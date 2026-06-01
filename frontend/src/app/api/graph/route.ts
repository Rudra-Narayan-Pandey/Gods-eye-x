import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Edge runtime for instant global delivery

export async function GET() {
  const data = {
    nodes: [
      { id: "1", name: "Anakin AI Core", group: 1, momentum: 0.95, type: "Agent", description: "Primary LLM Cognitive Synthesis Core." },
      { id: "2", name: "Signal Discovery Wire", group: 1, momentum: 0.88, type: "Agent", description: "Dynamic Web RSS and Scraping Layer." },
      { id: "3", name: "Polymarket Edge Bypass", group: 1, momentum: 0.92, type: "Network", description: "High-speed edge proxy resolving sentiment odds." },
      { id: "4", name: "Global News Syndicates", group: 3, momentum: 0.75, type: "Source", description: "Real-time news wires." },
      { id: "5", name: "Yahoo Finance API", group: 3, momentum: 0.85, type: "Source", description: "Real-time market tickers and volume metrics." },
      { id: "6", name: "arXiv Preprint Server", group: 3, momentum: 0.70, type: "Source", description: "Preprint scientific publications." },
      { id: "7", name: "GitHub Activity Stream", group: 3, momentum: 0.82, type: "Source", description: "Developer and open-source codebase velocity." },
      { id: "8", name: "Reality Drift Anomalies", group: 2, momentum: 0.90, type: "Risk", description: "Factual discrepancies detected in live statements." }
    ],
    links: [
      { source: "1", target: "2", value: 5 },
      { source: "1", target: "3", value: 4 },
      { source: "2", target: "4", value: 3 },
      { source: "2", target: "5", value: 3 },
      { source: "2", target: "6", value: 2 },
      { source: "2", target: "7", value: 3 },
      { source: "1", target: "8", value: 4 }
    ]
  };

  return NextResponse.json(data);
}
