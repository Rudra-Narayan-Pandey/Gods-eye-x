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

  const { trace, detailed_intel, ultimate_summary } = pipelineData;

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
              {ultimate_summary ? (
                <div className="flex flex-col gap-3">
                  <p><strong className="text-accent uppercase tracking-widest text-xs">WHAT IS HAPPENING:</strong><br/>{ultimate_summary.what_is_happening}</p>
                  <p><strong className="text-accent uppercase tracking-widest text-xs">WHY IT IS HAPPENING:</strong><br/>{ultimate_summary.why_it_is_happening}</p>
                  <p><strong className="text-accent uppercase tracking-widest text-xs">WHAT NEXT:</strong><br/>{ultimate_summary.what_next}</p>
                  
                  {ultimate_summary.horizon_20_year && (
                    <div className="mt-4 border-t border-accent/30 pt-4">
                      <h4 className="text-accent font-mono font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                        <Radar className="w-3 h-3 animate-spin-slow" /> Year-By-Year Predictive Horizon Matrix
                      </h4>
                      <div className="flex flex-col gap-4 relative border-l border-accent/20 pl-4 ml-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(ultimate_summary.horizon_20_year).filter(([k]) => k !== "...").map(([year, prediction], idx) => {
                          // Alternate colors to make it look incredibly cool
                          const colors = ["bg-accent shadow-[0_0_8px_#00ff00]", "bg-purple-500 shadow-[0_0_8px_#a855f7]", "bg-blue-500 shadow-[0_0_8px_#3b82f6]", "bg-rose-500 shadow-[0_0_8px_#f43f5e]"];
                          const textColors = ["text-accent bg-accent/10", "text-purple-400 bg-purple-500/10", "text-blue-400 bg-blue-500/10", "text-rose-400 bg-rose-500/10"];
                          const colorIdx = idx % colors.length;
                          return (
                            <div key={year} className="relative">
                              <div className={`absolute w-2 h-2 rounded-full -left-[21px] top-1.5 ${colors[colorIdx]} ${year === '2046' ? 'animate-pulse' : ''}`}></div>
                              <span className={`text-xs font-bold px-1 ${textColors[colorIdx]}`}>{year} PROJECTION:</span>
                              <p className="text-xs text-white/80 mt-1 leading-relaxed text-justify">{prediction as string}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                "Processing intelligence..."
              )}
            </div>
          </div>

          {/* Subsystem Score Dials */}
          <div className="glass p-4 flex-1">
            <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Domain Engines Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {detailed_intel?.domain_scores && Object.entries(detailed_intel.domain_scores).map(([domain, score]: [string, any]) => {
                const color = score > 90 ? "#00ff00" : (score > 80 ? "#ffff00" : "#ff0000");
                return (
                  <div key={domain} className="flex flex-col gap-1 p-2 rounded bg-white/5 border border-white/10 shadow-[0_0_5px_rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/90 truncate font-bold uppercase tracking-widest">{domain.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-mono" style={{ color }}>{score}%</span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden mt-1 border border-white/20">
                      <div 
                        className="h-full shadow-[0_0_10px_currentColor] transition-all duration-1000"
                        style={{ width: `${score}%`, backgroundColor: color, color: color }}
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
