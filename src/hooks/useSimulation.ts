import { useState, useCallback, useRef } from "react";

const API_BASE = "http://localhost:8000";

export type Emotion = "angry" | "confused" | "calm" | "satisfied" | "neutral";

export interface TrajectoryStep {
  step: number;
  action: string;
  reward: number;
  observation: {
    message: string;
    emotion: string;
    known_facts: string[];
    unknowns: string[];
    time_left: number;
    history: string[];
  };
  done: boolean;
}

export interface SimulationState {
  phase: "idle" | "running" | "done";
  currentStepIndex: number;
  trajectory: TrajectoryStep[];
  finalScore: number;
  success: boolean;
  stepsTaken: number;
  totalReward: number;
  isLoading: boolean;
  error: string | null;
  thinkingText: string;
}

const thinkingPhrases = [
  "Analyzing emotional state...",
  "Evaluating possible actions...",
  "Reducing uncertainty...",
  "Weighing trade-offs...",
  "Considering consequences...",
  "Processing feedback...",
  "Adjusting strategy...",
  "Taking action...",
  "Reassessing situation...",
  "Making final decision...",
];

const initialState: SimulationState = {
  phase: "idle",
  currentStepIndex: -1,
  trajectory: [],
  finalScore: 0,
  success: false,
  stepsTaken: 0,
  totalReward: 0,
  isLoading: false,
  error: null,
  thinkingText: "",
};

export function parseEmotion(raw: string): Emotion {
  const lower = raw?.toLowerCase() || "neutral";
  if (lower.includes("angry") || lower.includes("frustrat")) return "angry";
  if (lower.includes("confus")) return "confused";
  if (lower.includes("calm")) return "calm";
  if (lower.includes("satisf") || lower.includes("happy")) return "satisfied";
  return "neutral";
}

export function getEmoji(emotion: Emotion): string {
  const map: Record<Emotion, string> = { angry: "😡", confused: "😕", calm: "😌", satisfied: "😊", neutral: "🤖" };
  return map[emotion];
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(initialState);
  const cancelRef = useRef(false);

  const run = useCallback(async () => {
    cancelRef.current = false;
    setState({ ...initialState, phase: "running", isLoading: true, thinkingText: "Connecting to AI agent..." });

    try {
      const res = await fetch(`${API_BASE}/run-agent`, { method: "POST" });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const trajectory: TrajectoryStep[] = data.trajectory || [];

      setState(prev => ({
        ...prev,
        isLoading: false,
        trajectory,
        finalScore: data.final_score ?? 0,
        success: data.success ?? false,
        stepsTaken: data.steps_taken ?? trajectory.length,
        totalReward: data.total_reward ?? 0,
      }));

      // Animate steps one by one
      for (let i = 0; i < trajectory.length; i++) {
        if (cancelRef.current) break;
        const thinkingText = thinkingPhrases[i % thinkingPhrases.length];
        setState(prev => ({ ...prev, thinkingText, currentStepIndex: i }));
        await new Promise(r => setTimeout(r, 1200));
      }

      if (!cancelRef.current) {
        setState(prev => ({ ...prev, phase: "done", thinkingText: "" }));
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, phase: "idle", error: err.message }));
    }
  }, []);

  const reset = useCallback(() => {
    cancelRef.current = true;
    setState(initialState);
  }, []);

  return { state, run, reset };
}
