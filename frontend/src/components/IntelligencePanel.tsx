export default function IntelligencePanel() {
  return (
    <div className="glass p-6 flex flex-col gap-md">
      <h3 className="font-display text-lg font-bold border-b border-glass-border pb-2 gradient-text">
        Intelligence Overview
      </h3>
      
      <div className="flex flex-col gap-sm">
        <div className="flex-between">
          <span className="text-secondary text-sm">Nodes Connected</span>
          <span className="font-mono font-bold text-accent">1,423</span>
        </div>
        <div className="flex-between">
          <span className="text-secondary text-sm">Active Threat Level</span>
          <span className="font-mono font-bold text-accent-red">ELEVATED</span>
        </div>
        <div className="flex-between">
          <span className="text-secondary text-sm">Last Sync</span>
          <span className="font-mono text-sm text-secondary">0.02s ago</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-glass-border">
        <p className="text-xs text-secondary animate-pulse">
          Monitoring signal intercept streams...
        </p>
      </div>
    </div>
  );
}
