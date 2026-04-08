import { motion } from "framer-motion";

interface Props {
  totalReward: number;
  finalScore: number;
  success: boolean;
  stepCount: number;
  totalSteps: number;
  phase: "idle" | "running" | "done";
}

export default function MetricsPanel({ totalReward, finalScore, success, stepCount, totalSteps, phase }: Props) {
  const progress = totalSteps > 0 ? (stepCount / totalSteps) * 100 : 0;

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-5">📊 Performance Metrics</h2>

      <div className="grid grid-cols-4 gap-6">
        {/* Total Reward */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Total Reward</span>
          <motion.div
            key={totalReward}
            initial={{ scale: 1.3, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`text-3xl font-extrabold font-mono mt-2 ${totalReward >= 0 ? "text-accent glow-text-accent" : "text-destructive"}`}
          >
            {totalReward >= 0 ? "+" : ""}{totalReward.toFixed(2)}
          </motion.div>
        </div>

        {/* Final Score */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Final Score</span>
          <motion.div
            key={finalScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl font-extrabold text-primary font-mono glow-text mt-2"
          >
            {finalScore.toFixed(2)}
          </motion.div>
        </div>

        {/* Status */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Status</span>
          <div className={`text-2xl font-extrabold font-mono mt-2 ${
            phase === "idle" ? "text-muted-foreground" :
            phase === "running" ? "text-accent glow-text-accent" :
            success ? "text-emerald-400" : "text-destructive"
          }`}>
            {phase === "idle" ? "READY" : phase === "running" ? "LIVE" : success ? "SUCCESS" : "FAILED"}
          </div>
        </div>

        {/* Progress */}
        <div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Progress</span>
          <div className="mt-3">
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary progress-glow"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] font-mono text-muted-foreground">{stepCount}/{totalSteps} steps</span>
              <span className="text-[10px] font-mono text-muted-foreground">{progress.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
