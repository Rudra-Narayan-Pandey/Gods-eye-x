import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Edge runtime for instant global delivery

export async function GET() {
  const stats = {
    total_nodes: 8,
    threat_level: "NOMINAL",
    matrix_health: "98%"
  };

  return NextResponse.json(stats);
}
