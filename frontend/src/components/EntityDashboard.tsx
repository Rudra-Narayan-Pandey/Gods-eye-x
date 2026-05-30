import { useState } from "react";

export default function EntityDashboard({ entity, intelligence }: { entity: any, intelligence?: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="glass p-4 flex flex-col gap-2 border-l-4 border-accent-neon">
        <h4 className="text-white/50 text-xs font-mono uppercase tracking-widest">[ SYSTEM SYNTHESIS ]</h4>
        <p className="text-sm font-mono leading-relaxed text-accent-neon">
          > {intelligence?.ultimate_summary?.what_is_happening || entity.description || "INTELLIGENCE SCANNING COMPLETE."}
        </p>
        <p className="text-sm font-mono leading-relaxed text-[#00ff00]">
          > {intelligence?.ultimate_summary?.what_next || "AWAITING FURTHER SIGNALS."}
          <span className="cursor-blink"></span>
        </p>
      </div>
      <div className="glass p-4 flex flex-col gap-2">
        <h4 className="text-white/50 text-xs font-mono uppercase tracking-widest">[ GLOBAL MOMENTUM ]</h4>
        <div className="text-5xl font-mono font-bold text-accent-neon">
          {(entity.momentum * 100).toFixed(0)}<span className="text-lg text-white/50">.00</span>
        </div>
        <p className="text-xs font-mono text-white/40">AGGREGATING 295 SUBSYSTEMS...</p>
      </div>
    </div>
  );

  const renderStartupTech = () => {
    const startup = intelligence?.detailed_intel?.startup_intelligence;
    const tech = intelligence?.detailed_intel?.technology_intelligence;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-4 flex flex-col gap-4">
          <h4 className="text-accent-neon text-sm font-mono uppercase tracking-widest">[ STARTUP_INTEL_MATRIX ]</h4>
          {startup?.hypergrowth_detected && (
            <span className="bg-[#00ff00]/20 text-[#00ff00] text-xs font-mono px-2 py-1 border border-[#00ff00]/50 w-fit animate-pulse">
              WARNING: HYPERGROWTH DETECTED
            </span>
          )}
          <ul className="text-sm font-mono flex flex-col gap-2">
            {startup?.funding_events?.map((f:any, i:number) => (
              <li key={i} className="border-l-2 border-[#00ff00] pl-2">> {f.event} (CONF: {f.confidence})</li>
            )) || <li className="text-white/30">> NO FUNDING SIGNALS DETECTED.</li>}
            {startup?.hiring_anomalies?.map((h:any, i:number) => (
              <li key={i} className="border-l-2 border-[#00ff00] pl-2 text-[#00ff00]">> HIRING_ANOMALY: {h.role} - {h.signal}</li>
            ))}
          </ul>
        </div>
        <div className="glass p-4 flex flex-col gap-4">
          <h4 className="text-accent-neon text-sm font-mono uppercase tracking-widest">[ TECHNOLOGY_INTEL_MATRIX ]</h4>
          <ul className="text-sm font-mono flex flex-col gap-2">
            {tech?.emerging_tech?.map((t:any, i:number) => (
              <li key={i} className="flex justify-between border-b border-white/10 pb-1">
                <span>{t.tech}</span> <span className="text-white/50">[{t.adoption_velocity}]</span>
              </li>
            )) || <li className="text-white/30">> NO EMERGING TECH SIGNALS.</li>}
            {tech?.patent_signals?.map((p:any, i:number) => (
              <li key={i} className="border-l-2 border-white/20 pl-2 text-white/50">> {p.description}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderPolicyRisk = () => {
    const risk = intelligence?.detailed_intel?.policy_and_risk;
    const drift = intelligence?.detailed_intel?.reality_drift;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-4 flex flex-col gap-4 border border-accent-alert shadow-[0_0_10px_rgba(255,0,60,0.2)]">
          <h4 className="text-accent-alert text-sm font-mono uppercase tracking-widest glitch" data-text="[ THREAT_DETECTION ]">[ THREAT_DETECTION ]</h4>
          <ul className="text-sm font-mono flex flex-col gap-2">
            {risk?.policy_risks?.map((r:any, i:number) => (
              <li key={i} className="bg-accent-alert/10 p-2 border border-accent-alert/30 text-accent-alert">
                > RISK: {r.risk} [SEV: {r.severity}]
              </li>
            )) || <li className="text-white/30">> SYSTEM NOMINAL. NO RISKS DETECTED.</li>}
          </ul>
        </div>
        <div className="glass p-4 flex flex-col gap-4 border border-[#ffff00]/30 shadow-[0_0_10px_rgba(255,255,0,0.1)]">
          <h4 className="text-[#ffff00] text-sm font-mono uppercase tracking-widest">[ REALITY_DRIFT_ANALYSIS ]</h4>
          <ul className="text-sm font-mono flex flex-col gap-2">
            {drift?.contradictions_detected?.map((c:any, i:number) => (
              <li key={i} className="flex flex-col gap-1 p-2 bg-black border border-[#ffff00]/20">
                <span className="line-through text-white/40">NARRATIVE: {c.narrative}</span>
                <span className="text-[#00ff00]">REALITY: {c.reality}</span>
              </li>
            )) || <li className="text-white/30">> NO REALITY DRIFT DETECTED. NARRATIVE ALIGNS.</li>}
          </ul>
        </div>
      </div>
    );
  };

  const renderOpportunities = () => {
    const opp = intelligence?.detailed_intel?.opportunity_discovery;
    return (
      <div className="glass p-4 flex flex-col gap-4 border border-[#00ff00]/30 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
        <h4 className="text-[#00ff00] text-sm font-mono uppercase tracking-widest">[ ASYMMETRIC_OPPORTUNITIES ]</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-sm font-mono flex flex-col gap-2">
            <h5 className="text-white/30 text-xs mb-1">MARKET GAPS</h5>
            {opp?.market_gaps?.map((g:any, i:number) => (
              <li key={i} className="bg-[#00ff00]/10 p-2 border border-[#00ff00]/20 text-[#00ff00]">
                > GAP: {g.gap} <br/>  [POTENTIAL: {g.potential}]
              </li>
            )) || <li className="text-white/30">> NO GAPS COMPUTED.</li>}
          </ul>
          <ul className="text-sm font-mono flex flex-col gap-2">
            <h5 className="text-white/30 text-xs mb-1">HIDDEN SIGNALS</h5>
            {opp?.hidden_opportunities?.map((h:any, i:number) => (
              <li key={i} className="bg-black/50 p-2 border border-white/10 text-white/70">> {h.desc}</li>
            )) || <li className="text-white/30">> NO HIDDEN SIGNALS.</li>}
          </ul>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "overview", label: "[ OVERVIEW ]" },
    { id: "tech_startup", label: "[ TECH_STARTUP ]" },
    { id: "policy_risk", label: "[ THREAT_RISK ]" },
    { id: "opportunities", label: "[ OPPORTUNITIES ]" }
  ];

  return (
    <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col gap-4 mt-4">
      {/* Entity Header Terminal Style */}
      <div className="glass p-6 border-l-4 border-[#00ff00] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-[#00ff00] text-black font-mono font-bold px-2 py-1 uppercase tracking-widest">
              ENTITY: {entity.type}
            </span>
            <span className="text-xs text-[#00ff00] font-mono border border-[#00ff00] px-2 py-1">ID: {entity.id || "SYS-DYN"}</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-[#00ff00] tracking-widest uppercase glitch" data-text={entity.name}>
            {entity.name}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all ${
                activeTab === tab.id 
                  ? "bg-[#00ff00] text-black" 
                  : "bg-transparent text-[#00ff00] border border-[#00ff00]/50 hover:bg-[#00ff00]/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <div className="min-h-[250px]">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "tech_startup" && renderStartupTech()}
        {activeTab === "policy_risk" && renderPolicyRisk()}
        {activeTab === "opportunities" && renderOpportunities()}
      </div>
    </div>
  );
}
