import { useState, useCallback } from "react";

const API_BASE = "http://localhost:8000";

export type Emotion = "angry" | "confused" | "calm" | "satisfied" | "neutral";
export type ActionType = "apologize" | "clarify" | "gather_info" | "act_now" | "delay" | "ignore";

export interface HistoryEntry {
  action: ActionType;
  reward: number;
  emotionBefore: Emotion;
  emotionAfter: Emotion;
  timestamp: number;
}

export interface SimulationState {
  message: string;
  emotion: Emotion;
  knownFacts: string[];
  unknowns: string[];
  timeLeft: number;
  history: string[];
  done: boolean;
  isRunning: boolean;
  totalScore: number;
  currentReward: number;
  quality: "Poor" | "Average" | "Good" | "Excellent";
  steps: HistoryEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SimulationState = {
  message: "",
  emotion: "neutral",
  knownFacts: [],
  unknowns: [],
  timeLeft: 0,
  history: [],
  done: false,
  isRunning: false,
  totalScore: 0,
  currentReward: 0,
  quality: "Poor",
  steps: [],
  isLoading: false,
  error: null,
};

function parseEmotion(raw: string): Emotion {
  const lower = raw?.toLowerCase() || "neutral";
  if (lower.includes("angry") || lower.includes("frustrat")) return "angry";
  if (lower.includes("confus")) return "confused";
  if (lower.includes("calm")) return "calm";
  if (lower.includes("satisf") || lower.includes("happy")) return "satisfied";
  return "neutral";
}

function getQuality(score: number): SimulationState["quality"] {
  if (score >= 80) return "Excellent";
  if (score >= 50) return "Good";
  if (score >= 25) return "Average";
  return "Poor";
}

function getEmoji(emotion: Emotion): string {
  const map: Record<Emotion, string> = { angry: "😡", confused: "😕", calm: "😌", satisfied: "😊", neutral: "🤖" };
  return map[emotion];
}

export { getEmoji };

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(initialState);

  const start = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE}/reset`, { method: "POST" });
      if (!res.ok) throw new Error(`Reset failed: ${res.status}`);
      const data = await res.json();
      const emotion = parseEmotion(data.observation.emotion);
      setState({
        ...initialState,
        isRunning: true,
        message: data.observation.message,
        emotion,
        knownFacts: data.observation.known_facts || [],
        unknowns: data.observation.unknowns || [],
        timeLeft: data.observation.time_left || 0,
        history: data.observation.history || [],
        done: data.done,
      });
    } catch (err: any) {
      setState((prev) => ({ ...prev, isLoading: false, error: err.message }));
    }
  }, []);

  const step = useCallback(async (actionType: ActionType) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE}/step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type: actionType }),
      });
      if (!res.ok) throw new Error(`Step failed: ${res.status}`);
      const data = await res.json();
      const newEmotion = parseEmotion(data.observation.emotion || data.info?.emotion);

      setState((prev) => {
        const reward = data.reward || 0;
        const newScore = prev.totalScore + reward;
        const entry: HistoryEntry = {
          action: actionType,
          reward,
          emotionBefore: prev.emotion,
          emotionAfter: newEmotion,
          timestamp: Date.now(),
        };
        return {
          ...prev,
          isLoading: false,
          message: data.observation.message,
          emotion: newEmotion,
          knownFacts: data.observation.known_facts || [],
          unknowns: data.observation.unknowns || [],
          timeLeft: data.observation.time_left ?? prev.timeLeft,
          history: data.observation.history || [],
          done: data.done,
          isRunning: !data.done,
          totalScore: newScore,
          currentReward: reward,
          quality: getQuality(newScore),
          steps: [...prev.steps, entry],
        };
      });
    } catch (err: any) {
      setState((prev) => ({ ...prev, isLoading: false, error: err.message }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return { state, start, step, reset };
}
