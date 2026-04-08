import { motion } from "framer-motion";
import type { ActionType } from "@/hooks/useSimulation";

interface Props {
  onAction: (action: ActionType) => void;
  disabled: boolean;
}

const actions: { type: ActionType; label: string; icon: string }[] = [
  { type: "apologize", label: "Apologize", icon: "🙏" },
  { type: "clarify", label: "Clarify", icon: "🔍" },
  { type: "gather_info", label: "Gather Info", icon: "📋" },
  { type: "act_now", label: "Act Now", icon: "⚡" },
  { type: "delay", label: "Delay", icon: "⏳" },
  { type: "ignore", label: "Ignore", icon: "🚫" },
];

export default function ActionButtons({ onAction, disabled }: Props) {
  return (
    <div className="glass-panel p-5">
      <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Choose Action</h2>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((a) => (
          <motion.button
            key={a.type}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={() => onAction(a.type)}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm font-mono text-foreground hover:bg-primary/20 hover:border-primary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-lg">{a.icon}</span>
            <span>{a.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
