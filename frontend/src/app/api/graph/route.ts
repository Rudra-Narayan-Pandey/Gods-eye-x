import { NextResponse } from 'next/server';
import entitiesData from '@/data/entities.json';
import edgesData from '@/data/edges.json';

export const runtime = 'edge';

export async function GET() {
  const nodes = entitiesData.map((e: any) => {
    // Map types to group number (1: company/startup, 2: threat/risk, 3: general/other)
    let group = 3;
    const t = (e.type || '').toLowerCase();
    if (t === 'company' || t === 'startup' || t === 'organization') {
      group = 1;
    } else if (t === 'threat' || t === 'risk' || t === 'anomaly') {
      group = 2;
    }
    
    // Safely parse tags
    let tags = [];
    if (e.tags) {
      try {
        tags = typeof e.tags === 'string' ? JSON.parse(e.tags) : e.tags;
      } catch {
        tags = String(e.tags).split(',').map(val => val.trim());
      }
    }

    // Safely parse properties
    let properties = {};
    if (e.properties) {
      try {
        properties = typeof e.properties === 'string' ? JSON.parse(e.properties) : e.properties;
      } catch {}
    }

    return {
      id: e.id,
      name: e.name,
      group,
      momentum: parseFloat(e.momentum) || 0.8,
      type: e.type,
      description: e.description,
      tags,
      properties
    };
  });

  const links = edgesData.map((edge: any) => {
    // Strip "n-" prefix to match entity IDs
    const source = edge.source_id.replace(/^n-/, '');
    const target = edge.target_id.replace(/^n-/, '');
    return {
      source,
      target,
      value: parseInt(edge.weight) || 3,
      type: edge.type
    };
  }).filter((link: any) => {
    // Only include links where both source and target exist in entities
    const sourceExists = entitiesData.some((e: any) => e.id === link.source);
    const targetExists = entitiesData.some((e: any) => e.id === link.target);
    return sourceExists && targetExists;
  });

  return NextResponse.json({ nodes, links });
}
