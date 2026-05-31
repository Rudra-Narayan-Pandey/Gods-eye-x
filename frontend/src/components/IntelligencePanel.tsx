"use client";

import { useState, useEffect } from "react";
import { Zap, AlertTriangle, Shield, Activity } from "lucide-react";

export default function IntelligencePanel({ selectedNode }: { selectedNode?: any }) {
  const [feed, setFeed] = useState<{opportunities: any[], anomalies: any[]}>({ opportunities: [], anomalies: [] });
  const [stats, setStats] = useState({ total_nodes: 0, threat_level: "CALCULATING", matrix_health: "0%" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/feed").then(res => res.json()),
      fetch("/api/graph/stats").then(res => res.json())
    ])
      .then(([feedData, statsData]) => {
        setFeed(feedData);
        setStats(statsData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="glass flex flex-col border border-[#00ff00]/50 shadow-[0_0_30px_rgba(0,255,0,0.15)] bg-black/90 relative overflow-hidden h-[85vh]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff00]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-4 border-b border-[#00ff00]/30 bg-[#00ff00]/5 flex justify-between items-center">
        <h3 className="font-mono text-[#00ff00] text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2">
          {selectedNode ? <Shield size={16} className="animate-pulse text-accent" /> : <Activity size={16} className="animate-pulse" />}
          {selectedNode ? "TARGET ENTITY LOCK" : "GLOBAL GRAPH INTELLIGENCE"}
        </h3>
        {selectedNode && (
          <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 border border-accent/50 animate-pulse">
            TRACKING ACTIVE
          </span>
        )}
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        
        {selectedNode ? (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] text-white/50 uppercase tracking-widest flex items-center gap-2">
                ID: {selectedNode.id?.substring(0,8) || "0xUNKNOWN"} <span className="text-accent">{selectedNode.type}</span>
              </div>
              <h2 className="text-2xl font-bold font-display text-white uppercase tracking-widest">{selectedNode.name}</h2>
            </div>
            
            <div className="bg-accent/10 border border-accent/30 p-3">
              <div className="text-[10px] text-accent/70 uppercase tracking-widest mb-1 flex justify-between">
                <span>Momentum Vector</span>
                <span>{(selectedNode.momentum * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-black h-1 rounded-full mt-2"><div className="h-full bg-accent shadow-[0_0_5px_currentColor]" style={{ width: `${selectedNode.momentum * 100}%` }}></div></div>
            </div>

            <div className="bg-black/60 border border-white/10 p-3 font-mono text-xs leading-relaxed text-white/80">
              <div className="text-accent mb-2 uppercase tracking-widest text-[10px] border-b border-white/10 pb-1">Entity Dossier</div>
              {selectedNode.description || "Synthesizing deep entity profile. Insufficient data vectors available in current memory bank."}
            </div>

            {selectedNode.tags && selectedNode.tags.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] text-white/50 uppercase tracking-widest">Identified Vectors</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.tags.map((t: string, i: number) => (
                    <span key={i} className="bg-white/5 border border-white/20 text-white/70 px-2 py-1 text-[10px] uppercase font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="text-[10px] text-white/50 uppercase tracking-widest border-b border-white/10 pb-1">Source Metadata</div>
                <div className="grid grid-cols-1 gap-2 font-mono text-[10px]">
                  {Object.entries(selectedNode.properties).map(([k, v]: [string, any], i) => (
                    <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-white/40">{k}</span>
                      <span className="text-[#00ff00] text-right truncate max-w-[200px]">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#00ff00]/5 border border-[#00ff00]/20 p-3">
            <div className="text-[10px] text-[#00ff00]/60 uppercase tracking-widest mb-1">Total Nodes</div>
            <div className="text-xl font-mono text-[#00ff00] font-bold">{loading ? "..." : stats.total_nodes}</div>
          </div>
          <div className="bg-[#ff0000]/10 border border-[#ff0000]/30 p-3">
            <div className="text-[10px] text-[#ff0000]/70 uppercase tracking-widest mb-1">Threat Level</div>
            <div className="text-xl font-mono text-[#ff0000] font-bold animate-pulse">{stats.threat_level}</div>
          </div>
          <div className="col-span-2 bg-accent/10 border border-accent/30 p-3">
            <div className="text-[10px] text-accent/70 uppercase tracking-widest mb-1">Subsystem Matrix Health</div>
            <div className="w-full bg-black h-1 rounded-full mt-2"><div className="h-full bg-accent shadow-[0_0_5px_currentColor] transition-all duration-1000" style={{ width: stats.matrix_health }}></div></div>
          </div>
        </div>
        
        {/* Real-time Anomalies Feed */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] text-white/50 uppercase tracking-[0.2em] border-b border-white/10 pb-1 flex items-center gap-2">
            <AlertTriangle size={12} className="text-[#ff0000]" />
            REALITY DRIFT ANOMALIES
          </h4>
          <div className="flex flex-col gap-2">
            {feed.anomalies.slice(0, 3).map((anom, idx) => (
              <div key={idx} className="bg-[#ff0000]/5 border-l-2 border-[#ff0000] p-2 text-xs font-mono flex flex-col gap-1">
                <span className="text-[#ff0000] font-bold uppercase">{anom.entity_name}</span>
                <span className="text-white/70 line-clamp-2">{anom.description}</span>
              </div>
            ))}
            {feed.anomalies.length === 0 && !loading && <span className="text-white/30 text-xs font-mono">&gt; NO ACTIVE ANOMALIES DETECTED.</span>}
          </div>
        </div>
        
        {/* Real-time Opportunities Feed */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] text-white/50 uppercase tracking-[0.2em] border-b border-white/10 pb-1 flex items-center gap-2">
            <Zap size={12} className="text-[#00ff00]" />
            ASYMMETRIC EXPLOITS
          </h4>
          <div className="flex flex-col gap-3">
            {feed.opportunities.slice(0, 4).map((opp, idx) => (
              <div key={idx} className="bg-[#00ff00]/5 border border-[#00ff00]/20 p-3 text-xs font-mono flex flex-col gap-2 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff00]"></div>
                <div className="flex justify-between items-start">
                  <span className="text-[#00ff00] font-bold tracking-widest">{opp.title}</span>
                  <span className="bg-[#00ff00]/20 text-[#00ff00] px-1 py-0.5 rounded text-[10px]">{(opp.confidence_score * 100).toFixed(1)}%</span>
                </div>
                <div className="text-white/80 leading-relaxed text-[11px] bg-black/50 p-2 border border-white/5 mt-1 italic">
                  {opp.properties?.explainability_proof || "> Proof generation pending..."}
                </div>
              </div>
            ))}
            {feed.opportunities.length === 0 && !loading && <span className="text-white/30 text-xs font-mono">&gt; AWAITING EXPLOIT MATRICES.</span>}
          </div>
        </div>
          </>
        )}

      </div>
      
      {/* Footer Log Stream */}
      <div className="p-3 border-t border-glass-border bg-black text-[9px] font-mono text-[#00ff00]/60 flex flex-col gap-1 h-20 overflow-hidden">
        {selectedNode ? (
          <>
            <span className="animate-pulse text-accent">&gt; Loading source metadata for node {selectedNode.id?.substring(0,6)}...</span>
            <span>&gt; Reading stored evidence links...</span>
            <span>&gt; Rendering graph context...</span>
            <span>&gt; Data stream active.</span>
          </>
        ) : (
          <>
            <span className="animate-pulse">&gt; Reading live graph feed...</span>
            <span>&gt; Parsing returned entities and edges...</span>
            <span>&gt; Evidence consensus computed from returned live sources.</span>
            <span>&gt; Awaiting command...</span>
          </>
        )}
      </div>
      
    </div>
  );
}
