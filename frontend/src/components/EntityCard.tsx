"use client";

import { Shield, User, MapPin, Building, Activity, ShieldCheck, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function EntityCard({ entity }: { entity: any }) {
  const [showEvidence, setShowEvidence] = useState(false);
  
  const title = entity.name || "Unknown Entity";
  const type = entity.type || "Organization";
  
  // Extract AI Metrics from properties or default
  const confidence = entity.confidence ? Math.round(entity.confidence * 100) : 85;
  const verificationScore = entity.properties?.verification_score ? Math.round(entity.properties.verification_score * 100) : null;
  const consensus = entity.properties?.consensus || "Pending";
  const startupMomentum = entity.properties?.startup_momentum ? Math.round(entity.properties.startup_momentum) : null;
  const evidence = entity.properties?.evidence || [];

  const getIcon = () => {
    switch(type) {
      case "Person": return <User className="text-accent-cyan" size={24} />;
      case "Location": return <MapPin className="text-accent-purple" size={24} />;
      case "Organization": return <Building className="text-accent-teal" size={24} />;
      default: return <Shield className="text-accent" size={24} />;
    }
  };

  return (
    <div className="glass p-6 flex flex-col gap-sm card-shine hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex-between mb-2">
        <div className="p-3 bg-glass-bg rounded-lg">{getIcon()}</div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-display font-bold gradient-text">{confidence}%</span>
          <span className="text-[10px] text-secondary uppercase tracking-wider">Base Confidence</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold font-display">{title}</h3>
        <p className="text-secondary text-sm font-semibold">{type}</p>
      </div>

      {/* Advanced AI Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
        {verificationScore !== null && (
          <div className="flex flex-col">
            <span className="text-[10px] text-secondary flex items-center gap-1 uppercase tracking-wider"><ShieldCheck size={12}/> AI Verification</span>
            <span className="text-sm font-semibold text-cyan-400">{verificationScore}% ({consensus})</span>
          </div>
        )}
        
        {startupMomentum !== null && (
          <div className="flex flex-col">
            <span className="text-[10px] text-secondary flex items-center gap-1 uppercase tracking-wider"><TrendingUp size={12}/> AI Momentum</span>
            <span className="text-sm font-semibold text-emerald-400">+{startupMomentum} pts</span>
          </div>
        )}
      </div>

      {/* Evidence Accordion */}
      {evidence.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <button 
            onClick={() => setShowEvidence(!showEvidence)}
            className="flex items-center justify-between w-full text-xs font-semibold text-secondary hover:text-accent transition-colors"
          >
            <span className="flex items-center gap-2"><Activity size={12}/> View AI Evidence Log</span>
            {showEvidence ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>
          
          {showEvidence && (
            <div className="mt-3 p-3 bg-black/60 rounded border border-white/10 font-mono text-[10px] text-accent/80 overflow-x-auto max-h-32 overflow-y-auto">
              {JSON.stringify(evidence, null, 2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
