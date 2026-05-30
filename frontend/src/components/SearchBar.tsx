"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="glass p-2 rounded-full flex items-center card-shine hover:border-accent-cyan transition-all">
      <div className="p-3 text-secondary">
        <Search size={20} />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter entity name, ID, or keywords..."
        className="flex-1 bg-transparent border-none outline-none text-white px-2 placeholder-secondary"
      />
      <button type="submit" className="glass px-6 py-2 rounded-full text-accent hover:bg-accent-cyan hover:text-black transition-all font-medium">
        Scan
      </button>
    </form>
  );
}
