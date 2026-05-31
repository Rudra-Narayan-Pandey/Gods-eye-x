import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Use edge runtime for faster global connectivity

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    // Try the primary Gamma API endpoint with a tight timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let events: any[] = [];
    try {
      const res = await fetch(
        'https://gamma-api.polymarket.com/events?limit=50&active=true&closed=false',
        {
          headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (res.ok) {
        events = await res.json();
      }
    } catch (primaryErr) {
      clearTimeout(timeout);
      console.error('Primary Gamma API failed, trying markets endpoint:', primaryErr);

      // Fallback: try the markets search endpoint directly
      try {
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 8000);
        const fallbackRes = await fetch(
          `https://gamma-api.polymarket.com/markets?limit=20&active=true&closed=false`,
          {
            headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            signal: fallbackController.signal,
          }
        );
        clearTimeout(fallbackTimeout);

        if (fallbackRes.ok) {
          const markets = await fallbackRes.json();
          // Markets endpoint returns individual markets, wrap them as events
          events = markets.map((m: any) => ({
            title: m.question || m.groupItemTitle || '',
            question: m.question || '',
            description: m.description || '',
            outcomes: m.outcomes || '[]',
            outcomePrices: m.outcomePrices || '[]',
            volumeNum: m.volumeNum || 0,
            liquidityNum: m.liquidityNum || 0,
            slug: m.slug || '',
            endDate: m.endDate || '',
          }));
        }
      } catch (fallbackErr) {
        console.error('Fallback markets endpoint also failed:', fallbackErr);
      }
    }

    if (events.length === 0) {
      return NextResponse.json({ events: [], error: 'Could not reach Polymarket API' });
    }

    const q = query.toLowerCase();

    // Filter by query match
    let matched = events.filter((e: any) =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q) ||
      (e.question || '').toLowerCase().includes(q)
    );

    // Try individual words if full query didn't match
    if (matched.length === 0) {
      const words = q.split(/\s+/).filter((w: string) => w.length > 2);
      matched = events.filter((e: any) => {
        const text = `${e.title || ''} ${e.description || ''} ${e.question || ''}`.toLowerCase();
        return words.some((w: string) => text.includes(w));
      });
    }

    // Fall back to top trending if nothing matched
    if (matched.length === 0) {
      matched = events.slice(0, 3);
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

        // For group events with nested markets, try to get data from first child
        if (yes_prob === 0 && no_prob === 0 && event.markets && event.markets.length > 0) {
          const childMarket = event.markets[0];
          try {
            const childOutcomes = JSON.parse(childMarket.outcomes || '[]');
            const childPrices = JSON.parse(childMarket.outcomePrices || '[]');
            if (childOutcomes.includes('Yes') && childOutcomes.includes('No')) {
              yes_prob = childPrices[childOutcomes.indexOf('Yes')] 
                ? Math.round(parseFloat(childPrices[childOutcomes.indexOf('Yes')]) * 100) : 0;
              no_prob = childPrices[childOutcomes.indexOf('No')] 
                ? Math.round(parseFloat(childPrices[childOutcomes.indexOf('No')]) * 100) : 0;
            }
          } catch {}
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
    return NextResponse.json({ events: [], error: err.message });
  }
}
