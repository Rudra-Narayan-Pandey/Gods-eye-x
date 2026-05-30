import { useEffect, useRef } from "react";
import { Terminal, ShieldAlert, Cpu, Activity, Database, Radar } from "lucide-react";

export default function CommandCenter({ pipelineData }: { pipelineData: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [pipelineData]);

  if (!pipelineData) return null;

  const { trace, scores, intelligence_summary } = pipelineData;

  return (
    <div className="flex flex-col gap-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-sm mb-2">
        <Radar className="w-5 h-5 text-accent animate-spin-slow" />
        <h2 className="text-xl font-display font-bold gradient-text uppercase tracking-widest">
          Ultimate Pipeline CommandCenter
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        
        {/* Transparent Execution Trace */}
        <div className="glass p-4 h-96 flex flex-col font-mono text-xs border border-white/5 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-white/70 uppercase tracking-widest">Live Execution Trace (295 Systems)</span>
          </div>
          <div 
            ref={scrollRef}
            className="overflow-y-auto flex-1 flex flex-col gap-1 pr-2 custom-scrollbar"
          >
            {trace?.map((line: string, i: number) => {
              const isHeader = line.includes("---");
              const isError = line.includes("CRITICAL") || line.includes("Error");
              return (
                <div 
                  key={i} 
                  className={`
                    ${isHeader ? "text-accent font-bold mt-2" : "text-white/60"}
                    ${isError ? "text-red-400" : ""}
                    animate-in fade-in slide-in-from-left-2
                  `}
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  {line}
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 pointer-events-none border border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Intelligence Outputs */}
        <div className="flex flex-col gap-md">
          {/* Summary Block */}
          <div className="glass p-4 border-l-4 border-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24" />
            </div>
            <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Final Intelligence Synthesis
            </h3>
            <div className="whitespace-pre-line text-sm text-white/90 leading-relaxed font-light">
              {intelligence_summary}
            </div>
          </div>

          {/* Subsystem Score Dials */}
          <div className="glass p-4 flex-1">
            <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Domain Engines Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {scores && Object.entries(scores).slice(0, 6).map(([domain, sysScores]: [string, any]) => {
                const avgScore = Object.values(sysScores).reduce((a: any, b: any) => a + b, 0) as number / Object.keys(sysScores).length;
                return (
                  <div key={domain} className="flex flex-col gap-1 p-2 rounded bg-white/5">
                    <span className="text-xs text-white/70 truncate">{domain}</span>
                    <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-purple-500"
                        style={{ width: `${avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
