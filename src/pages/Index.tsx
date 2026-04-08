import { motion, AnimatePresence } from "framer-motion";
import { useSimulation, parseEmotion, getEmoji } from "@/hooks/useSimulation";
import ScenarioPanel from "@/components/ScenarioPanel";
import StatePanel from "@/components/StatePanel";
import DecisionTimeline from "@/components/DecisionTimeline";
import MetricsPanel from "@/components/MetricsPanel";
import ReasoningPanel from "@/components/ReasoningPanel";

export default function Index() {
  const { state, run, reset } = useSimulation();
  const currentStep = state.currentStepIndex >= 0 ? state.trajectory[state.currentStepIndex] : null;
  const visibleSteps = state.trajectory.slice(0, state.currentStepIndex + 1);
  const emotion = currentStep ? parseEmotion(currentStep.observation.emotion) : "neutral";

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col gap-4 font-display">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neon-border bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-lg font-bold glow-text">E</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">EADI</h1>
            <p className="text-[11px] font-mono text-muted-foreground">Emotion-Aware Decision Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {state.phase === "idle" && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(250 85% 65% / 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={run}
              disabled={state.isLoading}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold font-mono shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50 neon-border"
            >
              {state.isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                  AI is thinking...
                </span>
              ) : (
                "🤖 Run AI Agent"
              )}
            </motion.button>
          )}
          {state.phase === "running" && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 neon-border">
              <span className="w-2 h-2 rounded-full bg-accent glow-dot animate-pulse" />
              <span className="text-xs font-mono text-accent glow-text-accent">AGENT RUNNING</span>
            </div>
          )}
          {state.phase === "done" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { reset(); }}
              className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-bold font-mono border border-border hover:bg-secondary/80 transition-colors"
            >
              ↻ Run Again
            </motion.button>
          )}
          {state.error && (
            <span className="text-xs font-mono text-destructive bg-destructive/10 px-3 py-1.5 rounded-lg border border-destructive/20">
              {state.error}
            </span>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <ScenarioPanel
            message={currentStep?.observation.message || ""}
            emotion={emotion}
            emoji={getEmoji(emotion)}
            timeLeft={currentStep?.observation.time_left ?? 0}
            context="AI Decision Simulation"
          />
          <ReasoningPanel
            reasoning={state.thinkingText}
            currentAction={currentStep?.action || ""}
            stepNumber={state.currentStepIndex + 1}
            isRunning={state.phase === "running"}
          />
        </div>

        {/* Center: Timeline */}
        <div className="lg:col-span-1">
          <DecisionTimeline
            steps={visibleSteps}
            isRunning={state.phase === "running"}
            isDone={state.phase === "done"}
          />
        </div>

        {/* Right: State */}
        <div>
          <StatePanel
            knownFacts={currentStep?.observation.known_facts || []}
            unknowns={currentStep?.observation.unknowns || []}
            timeLeft={currentStep?.observation.time_left ?? 0}
            totalTime={state.trajectory[0]?.observation.time_left ?? 50}
            isRunning={state.phase === "running"}
          />
        </div>
      </div>

      {/* Bottom: Metrics */}
      <MetricsPanel
        totalReward={state.phase === "done" ? state.totalReward : visibleSteps.reduce((s, v) => s + v.reward, 0)}
        finalScore={state.finalScore}
        success={state.success}
        stepCount={visibleSteps.length}
        totalSteps={state.trajectory.length || 10}
        phase={state.phase}
      />

      {/* Final Summary Overlay */}
      <AnimatePresence>
        {state.phase === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={reset}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass-panel neon-border p-8 max-w-md w-full mx-4 text-center space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl">{state.success ? "✅" : "❌"}</div>
              <h2 className="text-2xl font-bold text-foreground">
                {state.success ? "Mission Successful!" : "Mission Failed"}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                <div className="glass-panel p-3">
                  <div className="text-muted-foreground text-[10px] uppercase">Final Score</div>
                  <div className="text-2xl font-bold text-primary glow-text">{state.finalScore.toFixed(2)}</div>
                </div>
                <div className="glass-panel p-3">
                  <div className="text-muted-foreground text-[10px] uppercase">Total Reward</div>
                  <div className="text-2xl font-bold text-accent glow-text-accent">{state.totalReward.toFixed(2)}</div>
                </div>
                <div className="glass-panel p-3">
                  <div className="text-muted-foreground text-[10px] uppercase">Steps Taken</div>
                  <div className="text-2xl font-bold text-foreground">{state.stepsTaken}</div>
                </div>
                <div className="glass-panel p-3">
                  <div className="text-muted-foreground text-[10px] uppercase">Status</div>
                  <div className={`text-lg font-bold ${state.success ? "text-emerald-400" : "text-destructive"}`}>
                    {state.success ? "SUCCESS" : "FAILURE"}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold font-mono neon-border w-full"
              >
                🤖 Run Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
