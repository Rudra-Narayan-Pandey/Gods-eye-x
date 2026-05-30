import { useState } from "react";

export default function FiltersPanel({ onConfidenceChange }: { onConfidenceChange?: (val: number) => void }) {
  const [conf, setConf] = useState(50);
  
  return (
    <div className="glass p-6 flex flex-col gap-md sticky top-24">
      <h3 className="font-display text-lg font-bold border-b border-glass-border pb-2">Filters</h3>
      
      <div className="flex flex-col gap-sm">
        <h4 className="text-sm text-secondary uppercase font-semibold">Entity Type</h4>
        <label className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
          <input type="checkbox" className="accent-cyan-500" defaultChecked /> Person
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
          <input type="checkbox" className="accent-cyan-500" defaultChecked /> Organization
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
          <input type="checkbox" className="accent-cyan-500" defaultChecked /> Location
        </label>
      </div>

      <div className="flex flex-col gap-sm mt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm text-secondary uppercase font-semibold">Confidence Threshold</h4>
          <span className="text-accent font-mono text-xs">{conf}%</span>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={conf} 
          onChange={(e) => {
            setConf(parseInt(e.target.value));
            if(onConfidenceChange) onConfidenceChange(parseInt(e.target.value));
          }}
          className="w-full accent-cyan-500 cursor-pointer" 
        />
      </div>
    </div>
  );
}
