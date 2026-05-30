"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import FiltersPanel from "@/components/FiltersPanel";
import EntityDashboard from "@/components/EntityDashboard";
import CommandCenter from "@/components/CommandCenter";

export default function SearchPage() {
  const [entities, setEntities] = useState<any[]>([]);
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setEntities(data.entities || []);
        setPipelineData(data.ultimate_pipeline || null);
      } else {
        console.error("Failed to fetch from backend");
        setEntities([]);
        setPipelineData(null);
      }
    } catch (err) {
      console.error(err);
      setEntities([]);
    }
    setLoading(false);
  };

  return (
    <div className="page-content min-h-screen">
      <div className="ambient-bg"></div>
      
      <div className="container py-8 flex flex-col gap-lg">
        <header className="flex-between glass p-4 mb-8">
          <Link href="/" className="font-display text-2xl gradient-text font-bold">
            GOD'S EYE X
          </Link>
          <nav className="flex gap-md">
            <Link href="/search" className="text-accent">Search</Link>
            <Link href="/graph" className="hover:text-accent transition-colors">Graph</Link>
          </nav>
        </header>

        <main className="flex gap-lg flex-col lg:flex-row">
          <aside className="w-full lg:w-1/4">
            <FiltersPanel />
          </aside>
          
          <section className="w-full lg:w-3/4 flex flex-col gap-lg">
            <SearchBar onSearch={handleSearch} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md mt-6">
              {loading && <div className="text-secondary p-4 glass">Scanning Global Intelligence Network...</div>}
              
              {!loading && hasSearched && entities.length === 0 && (
                <div className="text-secondary p-4 glass">No entities found in the Knowledge Graph for this query.</div>
              )}

              {/* Display the CommandCenter for transparency */}
              {!loading && hasSearched && pipelineData && (
                <div className="col-span-1 md:col-span-2 xl:col-span-3 mb-8">
                  <CommandCenter pipelineData={pipelineData} />
                </div>
              )}

              {/* Display the detailed Entity Dashboard powered by the Ultimate Pipeline */}
              {!loading && pipelineData && (
                <EntityDashboard 
                  entity={entities.length > 0 ? entities[0] : { name: query || "Unknown", type: "Dynamic Concept", momentum: 0.85 }} 
                  intelligence={pipelineData} 
                />
              )}
              
              {!hasSearched && (
                <div className="text-secondary p-4 glass w-full col-span-3 text-center py-12">
                  Enter a query above to initiate a scan against the Holocron Agent Pipeline.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
