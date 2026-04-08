import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEntry, Emotion } from "@/hooks/useSimulation";

interface Props {
  steps: HistoryEntry[];
  isRunning: boolean;
  isDone: boolean;
}

const emotionEmojis: Record<Emotion, string> = {
  angry: "😡",
  confused: "😕",
  calm: "😌",
  satisfied: "😊",
  neutral: "🤖",
};

const actionLabels: Record<string, string> = {
  apologize: "Apologize",
  clarify: "Clarify",
  gather_info: "Gather Info",
  act_now: "Act Now",
  delay: "Delay",
  ignore: "Ignore",
};

export default function DecisionTimeline({ steps, isRunning, isDone }: Props) {
  return (
    <div className="glass-panel-accent p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Decision Timeline</h2>
        {isRunning && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent glow-dot animate-pulse-glow" />
            <span className="text-[10px] font-mono text-accent">ACTIVE</span>
          </div>
        )}
        {isDone && (
          <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-400/10">
            COMPLETE
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-0 relative">
        {steps.length > 0 && (
          <div className="absolute left-4 top-3 bottom-3 w-px bg-border" />
        )}

        <AnimatePresence>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative pl-10 pb-5"
            >
              <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-primary bg-background z-10 ${i === steps.length - 1 && isRunning ? "glow-dot text-primary" : ""}`} />

              <div className="glass-panel p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">STEP {i + 1}</span>
                    <span className="text-sm font-semibold text-foreground">{actionLabels[step.action] || step.action}</span>
                  </div>
                  <span className={`text-xs font-mono ${step.reward >= 0 ? "text-accent" : "text-destructive"}`}>
                    {step.reward >= 0 ? "+" : ""}{step.reward}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span>{emotionEmojis[step.emotionBefore]}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{emotionEmojis[step.emotionAfter]}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {steps.length === 0 && !isRunning && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Timeline will appear here...
          </div>
        )}

        {steps.length === 0 && isRunning && (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-xs font-mono">Choose an action to begin...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
