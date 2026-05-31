import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  try {
    const res = await fetch(
      'https://gamma-api.polymarket.com/events?limit=50&active=true&closed=false',
      { 
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 } // cache for 60 seconds
      }
    );
    
    if (!res.ok) {
      return NextResponse.json({ events: [], error: `Gamma API returned ${res.status}` }, { status: 200 });
    }
    
    const events = await res.json();
    const q = query.toLowerCase();
    
    // Filter by query, fall back to top trending if no match
    let matched = events.filter((e: any) =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.question || '').toLowerCase().includes(q)
    );
    
    if (matched.length === 0) {
      // Also try individual words from the query
      const words = q.split(/\s+/).filter((w: string) => w.length > 2);
      matched = events.filter((e: any) => {
        const text = `${e.title || ''} ${e.description || ''} ${e.question || ''}`.toLowerCase();
        return words.some((w: string) => text.includes(w));
      });
    }
    
    if (matched.length === 0) {
      matched = events.slice(0, 3); // Show top 3 trending
    } else {
      matched = matched.slice(0, 5);
    }
    
    // Parse into clean market data
    const markets = matched.map((event: any) => {
      try {
        const outcomes = JSON.parse(event.outcomes || '[]');
        const prices = JSON.parse(event.outcomePrices || '[]');
        let yes_prob = 0, no_prob = 0;
        
        if (outcomes.includes('Yes') && outcomes.includes('No')) {
          const yIdx = outcomes.indexOf('Yes');
          const nIdx = outcomes.indexOf('No');
          yes_prob = prices[yIdx] ? Math.round(parseFloat(prices[yIdx]) * 100) : 0;
          no_prob = prices[nIdx] ? Math.round(parseFloat(prices[nIdx]) * 100) : 0;
        }
        
        return {
          type: 'polymarket',
          title: event.title || event.question || '',
          yes_prob,
          no_prob,
          volume: event.volumeNum || parseFloat(event.volume) || 0,
          liquidity: event.liquidityNum || parseFloat(event.liquidity) || 0,
          source: 'Polymarket Gamma API (Live)',
          url: event.slug ? `https://polymarket.com/event/${event.slug}` : '',
          endDate: event.endDate || '',
        };
      } catch {
        return null;
      }
    }).filter(Boolean);
    
    return NextResponse.json({ events: markets });
  } catch (err: any) {
    console.error('Polymarket proxy error:', err);
    return NextResponse.json({ events: [], error: err.message }, { status: 200 });
  }
}
