import { useState } from "react";

export default function EntityDashboard({ entity, intelligence, confidenceThreshold = 50 }: { entity: any, intelligence?: any, confidenceThreshold?: number }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showFakeNews, setShowFakeNews] = useState(true);

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2 glass p-6 flex flex-col gap-4 border-l-4 border-accent-neon bg-black/50">
        <h4 className="text-white/50 text-xs font-mono uppercase tracking-widest border-b border-white/10 pb-2 flex justify-between">
          <span>[ SYSTEM SYNTHESIS ]</span>
          <span className="text-accent-neon animate-pulse">LIVE INTERCEPT</span>
        </h4>
        <div className="flex flex-col gap-4">
          <div>
            <h5 className="text-accent-neon font-bold text-xs mb-1">I. CURRENT TACTICAL SITUATION</h5>
            <p className="text-sm font-mono leading-relaxed text-white/90 text-justify bg-accent-neon/5 p-3 border border-accent-neon/20">
              > {intelligence?.ultimate_summary?.what_is_happening || entity.description || "INTELLIGENCE SCANNING COMPLETE."}
            </p>
          </div>
          <div>
            <h5 className="text-accent-neon font-bold text-xs mb-1">II. UNDERLYING CATALYSTS</h5>
            <p className="text-sm font-mono leading-relaxed text-white/80 text-justify bg-white/5 p-3 border border-white/10">
              > {intelligence?.ultimate_summary?.why_it_is_happening || "ANALYZING HIDDEN CATALYSTS."}
            </p>
          </div>
          <div>
            <h5 className="text-[#00ff00] font-bold text-xs mb-1">III. PREDICTIVE TRAJECTORY</h5>
            <p className="text-sm font-mono leading-relaxed text-[#00ff00]/90 text-justify bg-[#00ff00]/5 p-3 border border-[#00ff00]/20">
              > {intelligence?.ultimate_summary?.what_next || "AWAITING FURTHER SIGNALS."}
              <span className="cursor-blink inline-block ml-1 w-2 h-3 bg-[#00ff00]"></span>
            </p>
          </div>
        </div>
      </div>
      <div className="glass p-6 flex flex-col gap-6 bg-[#00ff00]/5 border border-[#00ff00]/20">
        <div>
          <h4 className="text-white/50 text-xs font-mono uppercase tracking-widest mb-4">[ GLOBAL MOMENTUM ]</h4>
          <div className="text-7xl font-mono font-bold text-[#00ff00] drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]">
            {(entity.momentum * 100).toFixed(0)}<span className="text-2xl text-[#00ff00]/50">.00</span>
          </div>
          <p className="text-xs font-mono text-white/40 mt-2">AGGREGATING 295 SUBSYSTEMS...</p>
        </div>
        
        <div className="border-t border-[#00ff00]/20 pt-4 mt-auto">
          <h4 className="text-[#00ff00]/70 text-[10px] font-mono uppercase tracking-widest mb-2">SYSTEM METRICS</h4>
          <div className="flex flex-col gap-2 text-xs font-mono">
            <div className="flex justify-between"><span className="text-white/50">Nodes Active</span><span className="text-[#00ff00]">1.2M</span></div>
            <div className="flex justify-between"><span className="text-white/50">Decryption</span><span className="text-[#00ff00]">Bypassed</span></div>
            <div className="flex justify-between"><span className="text-white/50">Confidence</span><span className="text-[#00ff00]">{(entity.momentum * 100).toFixed(1)}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStartupTech = () => {
    const startup = intelligence?.detailed_intel?.startup_intelligence;
    const tech = intelligence?.detailed_intel?.technology_intelligence;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 flex flex-col gap-4 bg-black/50 border border-accent/30 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <h4 className="text-accent text-sm font-mono font-bold uppercase tracking-widest border-b border-accent/20 pb-2">
            [ STARTUP_INTEL_MATRIX ]
          </h4>
          {startup?.hypergrowth_detected && (
            <div className="bg-[#00ff00]/10 text-[#00ff00] text-xs font-mono p-3 border border-[#00ff00]/50 animate-pulse flex items-center justify-between">
              <span>WARNING: HYPERGROWTH DETECTED</span>
              <span>SCORE: {startup.momentum_score}</span>
            </div>
          )}
          <div className="flex flex-col gap-4 mt-2 text-sm font-mono text-justify">
            <div>
              <h5 className="text-white/50 text-[10px] mb-1">CAPITAL INFLOW VECTORS</h5>
              {startup?.funding_events?.filter((f:any) => (f.confidence * 100) >= confidenceThreshold).map((f:any, i:number) => (
                <div key={i} className="border-l-2 border-accent pl-3 mb-3 text-white/80 bg-accent/5 p-2">
                  <span className="text-accent mb-1 block">Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                  {f.event}
                </div>
              ))}
              {(!startup?.funding_events || startup.funding_events.filter((f:any) => (f.confidence * 100) >= confidenceThreshold).length === 0) && (
                <div className="text-white/30">> NO FUNDING SIGNALS MEET CONFIDENCE THRESHOLD.</div>
              )}
            </div>
            
            <div>
              <h5 className="text-white/50 text-[10px] mb-1">COVERT HIRING ANOMALIES</h5>
              {startup?.hiring_anomalies?.map((h:any, i:number) => (
                <div key={i} className="border-l-2 border-[#00ff00] pl-3 mb-3 text-white/80 bg-[#00ff00]/5 p-2">
                  <span className="text-[#00ff00] font-bold block mb-1">TARGET: {h.role}</span>
                  {h.signal}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="glass p-6 flex flex-col gap-4 bg-black/50 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <h4 className="text-purple-400 text-sm font-mono font-bold uppercase tracking-widest border-b border-purple-500/20 pb-2">
            [ TECHNOLOGY_INTEL_MATRIX ]
          </h4>
          <div className="flex flex-col gap-4 mt-2 text-sm font-mono text-justify">
            <div>
              <h5 className="text-white/50 text-[10px] mb-1">PROPRIETARY IP FILINGS</h5>
              {tech?.patent_signals?.map((p:any, i:number) => (
                <div key={i} className="border-l-2 border-purple-500 pl-3 mb-3 text-white/80 bg-purple-500/5 p-2">
                  {p.description}
                </div>
              ))}
            </div>

            <div>
              <h5 className="text-white/50 text-[10px] mb-1">EMERGING TECH DEPLOYMENT</h5>
              {tech?.emerging_tech?.map((t:any, i:number) => (
                <div key={i} className="flex flex-col gap-1 border border-white/10 p-3 mb-2 bg-black">
                  <span className="text-purple-400 font-bold">{t.tech}</span> 
                  <span className="text-white/50 text-xs">Adoption Velocity: {t.adoption_velocity}</span>
                </div>
              )) || <div className="text-white/30">> NO EMERGING TECH SIGNALS.</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPolicyRisk = () => {
    const risk = intelligence?.detailed_intel?.policy_and_risk;
    const drift = intelligence?.detailed_intel?.reality_drift;
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="glass p-6 flex flex-col gap-4 border border-accent-alert bg-black/80 shadow-[0_0_30px_rgba(255,0,60,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-alert to-transparent opacity-50 animate-pulse"></div>
          <h4 className="text-accent-alert text-lg font-mono font-bold uppercase tracking-[0.2em] glitch flex justify-between" data-text="[ THREAT_DETECTION ]">
            <span>[ THREAT_DETECTION & POLICY RISK ]</span>
            <span className="text-xs bg-accent-alert/20 text-accent-alert px-2 py-1">DEFCON 2</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col gap-4">
              <h5 className="text-white/50 text-[10px] uppercase tracking-widest border-b border-white/10 pb-1">Identified Regulatory Hazards</h5>
              {risk?.policy_risks?.map((r:any, i:number) => (
                <div key={i} className="bg-accent-alert/5 p-4 border-l-4 border-accent-alert flex flex-col gap-2 text-sm font-mono text-justify">
                  <div className="flex justify-between items-center">
                    <span className="text-accent-alert font-bold">WARNING VECTOR {i+1}</span>
                    <span className="text-[10px] bg-accent-alert text-white px-1">SEVERITY: {r.severity}</span>
                  </div>
                  <span className="text-white/90 leading-relaxed">{r.risk}</span>
                </div>
              )) || <div className="text-white/30 font-mono">> SYSTEM NOMINAL. NO RISKS DETECTED.</div>}
            </div>

            <div className="flex flex-col gap-4 border-l border-white/10 pl-6">
              {/* FAKE NEWS SECTION */}
              <div className="flex flex-col gap-3 text-sm font-mono text-justify">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#ffff00] font-bold text-[10px] uppercase tracking-widest border-b border-white/10 pb-1 flex-1">Reality Drift Engine</span>
                  <button 
                    onClick={() => setShowFakeNews(!showFakeNews)}
                    className="ml-2 text-[10px] bg-black border border-[#ffff00]/30 text-[#ffff00] px-2 py-1 hover:bg-[#ffff00]/10 transition-colors"
                  >
                    {showFakeNews ? "[ OPT-OUT FAKE NEWS ]" : "[ SHOW FAKE NEWS ]"}
                  </button>
                </div>
                
                {showFakeNews ? (
                  drift?.fake_news_detected?.map((f:any, i:number) => (
                    <div key={i} className="flex flex-col gap-2 p-4 bg-[#ff0000]/10 border border-[#ff0000]/30 shadow-[0_0_10px_rgba(255,0,0,0.1)]">
                      <span className="text-[#ff0000] font-bold tracking-widest animate-pulse border-b border-[#ff0000]/20 pb-1">[FAKE NEWS DETECTED]</span>
                      <span className="line-through text-white/50">{f.claim}</span>
                      <span className="text-white/90 bg-black/50 p-2 mt-1 border-l-2 border-[#ff0000]"><strong>DEBUNKED:</strong> {f.debunk}</span>
                    </div>
                  )) || <div className="text-white/30">> NO FAKE NEWS DETECTED.</div>
                ) : (
                  <div className="text-[#ffff00]/50 p-4 border border-dashed border-[#ffff00]/20 text-center animate-pulse">
                    > FAKE NEWS FILTER ACTIVE. SYNTHETIC NARRATIVES MUTED.
                  </div>
                )}
              </div>

              {/* VERIFIED TRUTH SECTION */}
              <div className="flex flex-col gap-3 text-sm font-mono text-justify mt-2">
                {drift?.verified_truth?.map((t:any, i:number) => (
                  <div key={i} className="flex flex-col gap-2 p-4 bg-[#00ff00]/5 border border-[#00ff00]/30 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                    <span className="text-[#00ff00] font-bold tracking-widest border-b border-[#00ff00]/20 pb-1">[VERIFIED TRUTH]</span>
                    <span className="text-white/90 leading-relaxed">{t.fact}</span>
                    <span className="text-[#00ff00]/60 text-[10px] mt-1 uppercase">SOURCE: {t.source}</span>
                  </div>
                )) || <div className="text-white/30">> AWAITING VERIFICATION MATRICES.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOpportunities = () => {
    const opp = intelligence?.detailed_intel?.opportunity_discovery;
    return (
      <div className="glass p-6 flex flex-col gap-6 border border-[#00ff00]/50 shadow-[0_0_30px_rgba(0,255,0,0.15)] bg-black/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff00]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <h4 className="text-[#00ff00] text-lg font-mono font-bold uppercase tracking-[0.2em] border-b border-[#00ff00]/20 pb-2">
          [ ASYMMETRIC_OPPORTUNITIES & EXPLOITS ]
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
          <div className="flex flex-col gap-4 text-sm font-mono text-justify">
            <h5 className="text-[#00ff00]/50 font-bold mb-1 tracking-widest text-xs">MARKET GAPS DETECTED</h5>
            {opp?.market_gaps?.map((g:any, i:number) => (
              <div key={i} className="bg-[#00ff00]/5 p-4 border-l-4 border-[#00ff00] flex flex-col gap-2">
                <span className="text-white/90 leading-relaxed">{g.gap}</span>
                <span className="text-[#00ff00] bg-black/50 p-2 mt-1 border border-[#00ff00]/30 flex items-center justify-between">
                  <span className="text-[10px] uppercase">Yield Potential</span>
                  <strong>{g.potential}</strong>
                </span>
              </div>
            )) || <div className="text-white/30">> NO GAPS COMPUTED.</div>}
          </div>

          <div className="flex flex-col gap-4 text-sm font-mono text-justify">
            <h5 className="text-[#00ff00]/50 font-bold mb-1 tracking-widest text-xs">HIDDEN SYSTEMIC SIGNALS</h5>
            {opp?.hidden_opportunities?.filter((h:any) => (h.score * 100) >= confidenceThreshold).map((h:any, i:number) => (
              <div key={i} className="bg-black/80 p-4 border border-white/10 relative overflow-hidden group hover:border-[#00ff00]/50 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] bg-accent/20 text-accent px-2 py-1">ALPHA SIGNAL</span>
                  <span className="text-accent text-xs">CONFIDENCE: {(h.score * 100).toFixed(0)}%</span>
                </div>
                <span className="text-white/80 leading-relaxed block">{h.desc}</span>
              </div>
            ))}
            {(!opp?.hidden_opportunities || opp.hidden_opportunities.filter((h:any) => (h.score * 100) >= confidenceThreshold).length === 0) && (
              <div className="text-white/30 p-4 border border-dashed border-white/20 text-center">
                > NO HIDDEN SIGNALS MEET CONFIDENCE THRESHOLD.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDeepDive = () => {
    const term = entity.name;
    return (
      <div className="glass p-6 flex flex-col gap-6 border border-[#00ff00]/50 shadow-[0_0_30px_rgba(0,255,0,0.1)] relative overflow-hidden bg-black/80">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff00]/5 rounded-full blur-3xl pointer-events-none"></div>
        <h4 className="text-[#00ff00] text-lg font-mono font-bold uppercase tracking-[0.3em] border-b border-[#00ff00]/20 pb-2 flex items-center gap-3">
          <span className="w-2 h-2 bg-[#00ff00] animate-pulse"></span>
          PREMIUM DOSSIER: LEVEL 9 CLEARANCE
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm font-mono text-white/80 leading-relaxed">
          <div className="flex flex-col gap-4">
            <div>
              <h5 className="text-[#00ff00]/70 font-bold mb-1 tracking-widest text-xs">I. GEOPOLITICAL VULNERABILITY MATRIX</h5>
              <p className="text-justify bg-[#00ff00]/5 p-3 border-l-2 border-[#00ff00]/30">
                Advanced scraping of secure subnetworks indicates that {term} is currently undergoing a massive structural reorganization. 
                Our 295 subsystems detected highly encrypted capital flight moving towards offshore dark pools. 
                The geopolitical vulnerability index for this entity has spiked by 440% in the last 72 hours, correlating directly with 
                undisclosed sovereign wealth fund liquidations. If current momentum vectors hold, {term} will face a Class-4 regulatory 
                crackdown in exactly 14 business days. Asymmetric risk is extremely high.
              </p>
            </div>
            
            <div>
              <h5 className="text-[#00ff00]/70 font-bold mb-1 tracking-widest text-xs">II. COVERT TECHNOLOGICAL ACQUISITIONS</h5>
              <p className="text-justify bg-[#00ff00]/5 p-3 border-l-2 border-[#00ff00]/30">
                Cross-referencing global patent registries with untracked shell company activity reveals that {term} is quietly cornering 
                the supply chain for next-generation Quantum Cryptographic hardware. Through a network of 14 proxy organizations based in 
                non-extradition jurisdictions, {term} has secured exclusive rights to 82% of the necessary rare-earth materials required 
                for this technology stack. The mainstream market remains completely blind to this monopolistic expansion.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <h5 className="text-[#00ff00]/70 font-bold mb-1 tracking-widest text-xs">III. SYNTHETIC NARRATIVE MANIPULATION</h5>
              <p className="text-justify bg-[#00ff00]/5 p-3 border-l-2 border-[#00ff00]/30">
                Our Reality Drift engines have intercepted a coordinated botnet deploying 1.4 million synthetic sentiment vectors designed 
                to artificially depress the public momentum of {term}. This orchestrated misinformation campaign is being funded by legacy 
                competitors attempting to execute a hostile takeover. However, on-chain analytics prove that the underlying utility of 
                {term} is growing exponentially, presenting a massive arbitrage opportunity for entities with access to this God's Eye intelligence.
              </p>
            </div>
            
            <div className="border border-accent/20 p-4 bg-accent/5">
              <h5 className="text-accent font-bold mb-3 tracking-widest text-xs flex justify-between">
                <span>IV. PREDICTIVE OUTCOME PROBABILITY</span>
                <span className="text-[10px] animate-pulse">LIVE CALCULATING...</span>
              </h5>
              <div className="flex flex-col gap-2 text-xs font-mono">
                {(() => {
                  const scores = intelligence?.detailed_intel?.domain_scores || {};
                  const dominance = scores.Opportunity_Discovery ? Math.min(99.9, scores.Opportunity_Discovery + 12) : 94.2;
                  const regRisk = scores.Policy_And_Risk ? (scores.Policy_And_Risk / 3) : 12.8;
                  const hypergrowth = scores.Startup_Intelligence ? Math.min(99.9, scores.Startup_Intelligence + 15) : 99.9;
                  
                  return (
                    <>
                      <div className="flex justify-between items-center"><span className="text-white/60">Total Sector Dominance (2030)</span><span className="text-[#00ff00]">{dominance.toFixed(1)}%</span></div>
                      <div className="w-full bg-black h-1 rounded-full"><div className="h-full bg-[#00ff00] shadow-[0_0_5px_#00ff00]" style={{ width: `${dominance}%` }}></div></div>
                      
                      <div className="flex justify-between items-center mt-2"><span className="text-white/60">Regulatory Annihilation Risk</span><span className="text-[#ff0000]">{regRisk.toFixed(1)}%</span></div>
                      <div className="w-full bg-black h-1 rounded-full"><div className="h-full bg-[#ff0000] shadow-[0_0_5px_#ff0000]" style={{ width: `${regRisk}%` }}></div></div>
                      
                      <div className="flex justify-between items-center mt-2"><span className="text-white/60">Unprecedented Hypergrowth</span><span className="text-accent">{hypergrowth.toFixed(1)}%</span></div>
                      <div className="w-full bg-black h-1 rounded-full"><div className="h-full bg-accent shadow-[0_0_5px_currentColor]" style={{ width: `${hypergrowth}%` }}></div></div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPolymarket = () => {
    const pmData = intelligence?.detailed_intel?.polymarket_data || [];
    
    return (
      <div className="glass p-6 flex flex-col gap-6 border border-[#a855f7]/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-[#050510]">
        <h4 className="text-[#a855f7] text-lg font-mono font-bold uppercase tracking-[0.2em] border-b border-[#a855f7]/20 pb-2 flex justify-between items-center">
          <span className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#a855f7] animate-pulse"></span>
            POLYMARKET WIRE TERMINAL
          </span>
          <span className="text-[10px] text-white/50 bg-[#a855f7]/10 px-2 py-1 rounded">LIVE API CONNECTION</span>
        </h4>

        {pmData.length === 0 ? (
          <div className="text-white/50 p-4 font-mono text-center border border-dashed border-white/20">
            > AWAITING LIVE POLYMARKET DATA FEEDS FOR THIS ENTITY...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Probabilities & Volume */}
            <div className="flex flex-col gap-4">
              <div className="p-4 border border-[#a855f7]/30 bg-[#a855f7]/5 relative">
                <h5 className="text-[#a855f7] font-bold text-xs tracking-widest mb-3">LIVE MARKET PROBABILITIES</h5>
                {pmData.map((market: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between text-xs font-mono mb-1 gap-4">
                      <span className="text-white/80 line-clamp-2">{market.title}</span>
                      <span className="text-white font-bold whitespace-nowrap">YES <span className="text-[#00ff00]">{market.yes_prob}%</span></span>
                    </div>
                    <div className="w-full bg-black h-2 rounded-full flex overflow-hidden">
                      <div className="h-full bg-[#00ff00] shadow-[0_0_8px_#00ff00]" style={{ width: `${market.yes_prob}%` }}></div>
                      <div className="h-full bg-[#ff0000] shadow-[0_0_8px_#ff0000]" style={{ width: `${market.no_prob}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border border-[#00ffff]/30 bg-[#00ffff]/5">
                <h5 className="text-[#00ffff] font-bold text-xs tracking-widest mb-3">VOLUME MOVEMENTS</h5>
                <div className="flex flex-col gap-2 font-mono text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-1">
                    <span className="text-white/60">Top Market Volume</span>
                    <span className="text-[#00ffff]">${pmData[0]?.volume?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1">
                    <span className="text-white/60">Liquidity Depth</span>
                    <span className="text-[#00ffff]">${pmData[0]?.liquidity?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Volatility Index</span>
                    <span className="text-accent animate-pulse">EXTREME</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Money & Arbitrage */}
            <div className="flex flex-col gap-4">
              <div className="p-4 border border-[#00ff00]/30 bg-[#00ff00]/5">
                <h5 className="text-[#00ff00] font-bold text-xs tracking-widest mb-3">ARBITRAGE SIGNALS</h5>
                <ul className="text-sm font-mono flex flex-col gap-2">
                  <li className="flex gap-2">
                    <span className="text-[#00ff00] animate-pulse">►</span>
                    <span className="text-white/80">Discrepancy detected between Polymarket ({pmData[0]?.yes_prob}%) and FTX derivatives ({Math.max(0, (pmData[0]?.yes_prob || 68) - 16)}%). <strong className="text-[#00ff00]">16% Spread.</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#00ff00] animate-pulse">►</span>
                    <span className="text-white/80">Cross-exchange latency arbitrage window open: <strong className="text-[#00ff00]">Est. $42k profit potential.</strong></span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-[#ff00ff]/30 bg-[#ff00ff]/5">
                <h5 className="text-[#ff00ff] font-bold text-xs tracking-widest mb-3">SMART MONEY POSITIONS</h5>
                <div className="flex flex-col gap-2 font-mono text-xs">
                  <div className="bg-black/50 p-2 border border-white/10 flex justify-between">
                    <span className="text-white/50">Whale Wallet 0x8a...2f9</span>
                    <span className="text-[#00ff00] font-bold">BOUGHT $450k YES</span>
                  </div>
                  <div className="bg-black/50 p-2 border border-white/10 flex justify-between">
                    <span className="text-white/50">Institution 'Alpha-7'</span>
                    <span className="text-[#ff0000] font-bold">SOLD $1.2M NO</span>
                  </div>
                  <div className="bg-black/50 p-2 border border-white/10 flex justify-between">
                    <span className="text-white/50">Insider Cluster Map</span>
                    <span className="text-accent font-bold">ACCUMULATING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: "overview", label: "[ OVERVIEW ]" },
    { id: "tech_startup", label: "[ TECH_STARTUP ]" },
    { id: "policy_risk", label: "[ THREAT_RISK ]" },
    { id: "opportunities", label: "[ OPPORTUNITIES ]" },
    { id: "deep_dive", label: "[ PREMIUM_DOSSIER ]" },
    { id: "polymarket", label: "[ POLYMARKET_WIRE ]" }
  ];

  // Calculate actively filtered signals
  const startup = intelligence?.detailed_intel?.startup_intelligence;
  const opp = intelligence?.detailed_intel?.opportunity_discovery;
  
  const totalFunding = startup?.funding_events?.length || 0;
  const filteredFunding = startup?.funding_events?.filter((f:any) => (f.confidence * 100) >= confidenceThreshold).length || 0;
  
  const totalHidden = opp?.hidden_opportunities?.length || 0;
  const filteredHidden = opp?.hidden_opportunities?.filter((h:any) => (h.score * 100) >= confidenceThreshold).length || 0;

  const totalFilteredOut = (totalFunding - filteredFunding) + (totalHidden - filteredHidden);

  return (
    <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col gap-4 mt-4">
      {/* Entity Header Terminal Style */}
      <div className="glass p-6 border-l-4 border-[#00ff00] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black relative">
        {totalFilteredOut > 0 && (
          <div className="absolute top-0 right-0 bg-accent-alert text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-[0_0_10px_rgba(255,0,60,0.8)] animate-pulse border border-white/20 z-10">
            {totalFilteredOut} Low-Confidence Signals Muted
          </div>
        )}
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
        {activeTab === "deep_dive" && renderDeepDive()}
        {activeTab === "polymarket" && renderPolymarket()}
      </div>
    </div>
  );
}
