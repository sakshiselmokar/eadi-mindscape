import { motion, AnimatePresence } from "framer-motion";
import type { Emotion } from "@/hooks/useSimulation";

interface Props {
  message: string;
  emotion: Emotion;
  emoji: string;
  timeLeft: number;
  context: string;
}

const emotionLabels: Record<Emotion, string> = {
  angry: "Angry",
  confused: "Confused",
  calm: "Calm",
  satisfied: "Satisfied",
  neutral: "Neutral",
};

export default function ScenarioPanel({ message, emotion, emoji, timeLeft, context }: Props) {
  return (
    <div className="glass-panel p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Scenario Input</h2>
        <div className="flex items-center gap-2">
          {timeLeft > 0 && (
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
              ⏱ {timeLeft}s left
            </span>
          )}
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {context}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {message ? (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <p className="text-foreground text-sm leading-relaxed">"{message}"</p>
          </motion.div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-4">
            Awaiting scenario...
          </div>
        )}
      </AnimatePresence>

      {message && (
        <motion.div
          key={emotion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-emotion-${emotion} w-fit`}
        >
          <span className="text-lg">{emoji}</span>
          <span className={`text-xs font-mono font-semibold emotion-${emotion}`}>
            {emotionLabels[emotion]}
          </span>
        </motion.div>
      )}
    </div>
  );
}
