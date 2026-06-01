import Link from "next/link";

// Force Vercel cache purge and clean production rebuild v1.0.2
export default function LandingPage() {
  return (
    <div className="page-content flex-center flex-col min-h-screen">
      <div className="ambient-bg"></div>
      <div className="container text-center flex-col flex-center gap-xl">
        <h1 className="text-hero font-display gradient-text animate-fade-in-up">
          GOD'S EYE X
        </h1>
        <p className="text-xl text-secondary animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Advanced Entity Resolution & Intelligence Platform
        </p>
        
        <div className="flex flex-wrap justify-center gap-md mt-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/dashboard" className="glass px-8 py-4 text-accent hover:glow-cyan transition-all font-bold rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10">
            Enter Live Dashboard
          </Link>
          <Link href="/search" className="glass px-8 py-4 hover:glow-purple transition-all font-medium rounded-full">
            Start Intelligence Search
          </Link>
          <Link href="/graph" className="glass px-8 py-4 hover:glow-purple transition-all font-medium rounded-full">
            View Knowledge Graph
          </Link>
        </div>
      </div>
    </div>
  );
}
