import { motion } from "framer-motion";

interface Props {
  currentReward: number;
  totalScore: number;
  quality: "Poor" | "Average" | "Good" | "Excellent";
  stepCount: number;
  totalSteps: number;
}

const qualityColors: Record<string, string> = {
  Poor: "text-destructive",
  Average: "emotion-confused",
  Good: "emotion-calm",
  Excellent: "emotion-satisfied",
};

export default function MetricsPanel({ currentReward, totalScore, quality, stepCount, totalSteps }: Props) {
  const progress = totalSteps > 0 ? (stepCount / totalSteps) * 100 : 0;

  return (
    <div className="glass-panel p-6">
      <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-5 font-bold">📊 Performance Metrics</h2>

      <div className="grid grid-cols-4 gap-6">
        {/* Current Reward */}
        <div className="text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase font-bold">Last Reward</span>
          <motion.div
            key={currentReward}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl font-extrabold text-accent font-mono mt-2"
          >
            {currentReward >= 0 ? "+" : ""}{currentReward.toFixed(2)}
          </motion.div>
        </div>

        {/* Total Score */}
        <div className="text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase font-bold">Total Score</span>
          <motion.div
            key={totalScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl font-extrabold text-primary font-mono glow-text mt-2"
          >
            {totalScore.toFixed(2)}
          </motion.div>
        </div>

        {/* Quality */}
        <div className="text-center">
          <span className="text-xs font-mono text-muted-foreground uppercase font-bold">Quality</span>
          <div className={`text-3xl font-extrabold font-mono mt-2 ${qualityColors[quality]}`}>
            {quality}
          </div>
        </div>

        {/* Progress */}
        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase font-bold">Progress</span>
          <div className="mt-3">
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary progress-glow"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground mt-2 block text-right">
              {progress.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
