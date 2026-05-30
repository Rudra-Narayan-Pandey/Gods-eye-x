"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Lightbulb, RefreshCw, Zap } from "lucide-react";

export default function DashboardPage() {
  const [feed, setFeed] = useState<{opportunities: any[], anomalies: any[]}>({ opportunities: [], anomalies: [] });
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/dashboard/feed");
      if (res.ok) {
        const data = await res.json();
        setFeed(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-content min-h-screen pb-12">
      <div className="ambient-bg"></div>
      
      <div className="container py-8 flex flex-col gap-lg">
        <header className="flex-between glass p-4 mb-4">
          <Link href="/" className="font-display text-2xl gradient-text font-bold flex items-center gap-2">
            <Activity className="text-accent" /> GOD'S EYE X
          </Link>
          <nav className="flex gap-md items-center">
            <Link href="/dashboard" className="text-accent font-bold">Live Dashboard</Link>
            <Link href="/search" className="hover:text-accent transition-colors">Search</Link>
            <Link href="/graph" className="hover:text-accent transition-colors">Graph</Link>
            <button onClick={fetchFeed} className="ml-4 p-2 glass rounded-full hover:glow-cyan">
              <RefreshCw size={18} className={loading ? "animate-spin text-accent" : "text-secondary"} />
            </button>
          </nav>
        </header>

        <div className="flex flex-col mb-4">
          <h1 className="text-3xl font-display font-bold">Autonomous Intelligence Feed</h1>
          <p className="text-secondary mt-2">Live stream of AI-generated proofs and reality drift anomalies from the Holocron Agent Pipeline.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-xl">
          {/* Opportunities Section */}
          <section className="flex flex-col gap-md">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-accent" />
              <h2 className="text-2xl font-display font-semibold">High-Value Opportunities</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {feed.opportunities.length === 0 && !loading && (
                <div className="glass p-8 text-center text-secondary">Awaiting intelligence...</div>
              )}
              {feed.opportunities.map((opp, idx) => (
                <div key={idx} className="glass p-6 rounded-xl hover:border-accent/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold gradient-text">{opp.title}</h3>
                    <span className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded">Score: {Math.round(opp.confidence_score * 100)}</span>
                  </div>
                  <div className="text-sm text-secondary mb-4 flex gap-4">
                    <span><strong className="text-primary">Category:</strong> {opp.category}</span>
                    <span><strong className="text-primary">Horizon:</strong> {opp.time_horizon}</span>
                  </div>
                  
                  <div className="bg-black/40 border border-white/5 rounded-lg p-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                    <div className="flex items-center gap-2 mb-2 text-accent text-sm font-semibold">
                      <Zap size={14} /> AI Explainability Proof
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                      "{opp.properties?.explainability_proof || 'Proof generation pending...'}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Anomalies Section */}
          <section className="flex flex-col gap-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-rose-500" />
              <h2 className="text-2xl font-display font-semibold">Reality Drift Anomalies</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {feed.anomalies.length === 0 && !loading && (
                <div className="glass p-8 text-center text-secondary">Awaiting intelligence...</div>
              )}
              {feed.anomalies.map((anom, idx) => (
                <div key={idx} className="glass p-6 rounded-xl border-l-4 border-rose-500/50 hover:border-rose-500 transition-all bg-gradient-to-r from-rose-500/5 to-transparent">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-rose-400">{anom.entity_name}</h3>
                    <span className="text-xs font-mono bg-rose-500/20 text-rose-400 px-2 py-1 rounded">{anom.severity} Risk</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-rose-300/70 uppercase tracking-wider font-semibold mb-1">AI Drift Narrative</div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {anom.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
