import { NextResponse } from 'next/server';
import opportunitiesData from '@/data/opportunities.json';
import anomaliesData from '@/data/anomalies.json';

export const runtime = 'edge';

export async function GET() {
  // Parse and clean opportunities
  const opportunities = opportunitiesData.map((o: any) => {
    let properties = {};
    if (o.properties) {
      try {
        properties = typeof o.properties === 'string' ? JSON.parse(o.properties) : o.properties;
      } catch {
        properties = { explainability_proof: o.description };
      }
    } else {
      properties = { explainability_proof: o.description };
    }

    return {
      title: o.title,
      confidence_score: parseFloat(o.confidence_score) || 0.85,
      category: o.category,
      time_horizon: o.time_horizon,
      properties
    };
  });

  // Parse and clean anomalies
  const anomalies = anomaliesData.map((a: any) => {
    // Map severity to friendly display
    let severity = a.severity || 'moderate';
    const s = severity.toLowerCase();
    if (s === 'critical') severity = 'CRITICAL';
    else if (s === 'high') severity = 'HIGH';
    else if (s === 'moderate') severity = 'MODERATE';
    else if (s === 'low') severity = 'LOW';

    return {
      entity_name: a.entity_name,
      severity,
      description: a.description || `Deviation detected in startup metrics for ${a.entity_name}.`
    };
  });

  return NextResponse.json({ opportunities, anomalies });
}
