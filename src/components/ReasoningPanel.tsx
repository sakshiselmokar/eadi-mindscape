import { motion, AnimatePresence } from "framer-motion";

interface Props {
  reasoning: string;
  currentAction: string;
  stepNumber: number;
  isRunning: boolean;
}

const actionLabels: Record<string, string> = {
  apologize: "Apologize",
  clarify: "Clarify",
  gather_info: "Gather Info",
  act_now: "Act Now",
  delay: "Delay",
  ignore: "Ignore",
};

export default function ReasoningPanel({ reasoning, currentAction, stepNumber, isRunning }: Props) {
  return (
    <div className="glass-panel p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Agent Thinking</h2>
          {isRunning && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent glow-dot animate-pulse" />
          )}
        </div>
        {stepNumber > 0 && (
          <span className="text-[10px] font-mono text-muted-foreground">
            STEP {stepNumber}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {reasoning ? (
          <motion.div
            key={reasoning}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex gap-3 items-start">
              <span className="text-lg mt-0.5">🧠</span>
              <p className="text-sm text-accent leading-relaxed font-mono typing-cursor">
                {reasoning}
              </p>
            </div>
            {currentAction && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 pl-8"
              >
                <span className="text-[10px] font-mono text-muted-foreground">ACTION →</span>
                <span className="text-sm font-mono font-bold text-primary glow-text">
                  {actionLabels[currentAction] || currentAction}
                </span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center py-4 text-muted-foreground text-sm font-mono">
            Waiting for AI agent...
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
