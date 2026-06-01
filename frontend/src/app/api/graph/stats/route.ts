import { NextResponse } from 'next/server';
import entitiesData from '@/data/entities.json';
import anomaliesData from '@/data/anomalies.json';

export const runtime = 'edge';

export async function GET() {
  const total_nodes = entitiesData.length;
  
  // Calculate dynamic threat level based on critical anomalies
  const criticalCount = anomaliesData.filter((a: any) => {
    const sev = (a.severity || '').toLowerCase();
    return sev === 'critical' || sev === 'high';
  }).length;
  
  const threat_level = criticalCount > 4 ? 'CRITICAL' : (criticalCount > 1 ? 'ELEVATED' : 'NOMINAL');
  
  const stats = {
    total_nodes,
    threat_level,
    matrix_health: "98%"
  };

  return NextResponse.json(stats);
}
