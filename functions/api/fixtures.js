/**
 * Cloudflare Pages Function: /api/fixtures
 * Bulletproof Edge Proxy for API-Football with Pro Plan key
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const league = url.searchParams.get('league') || '39';

  const headers = {
    'x-apisports-key': API_KEY,
    'User-Agent': 'DeepPredictBet-Pro/1.0',
    'Accept': 'application/json'
  };

  const debugLog = [];

  const fetchEndpoint = async (endpoint) => {
    try {
      const res = await fetch(`${API_HOST}/${endpoint}`, { headers });
      const json = await res.json();
      debugLog.push({ endpoint, status: res.status, results: json.results, errors: json.errors });
      return Array.isArray(json.response) ? json.response : [];
    } catch (e) {
      debugLog.push({ endpoint, error: e.message });
      return [];
    }
  };

  try {
    let list = [];

    // Parallel fetch: next 14 upcoming, last 10 completed, and live in-play
    const [nextData, lastData, liveData] = await Promise.all([
      fetchEndpoint(`fixtures?league=${league}&next=14`),
      fetchEndpoint(`fixtures?league=${league}&last=10`),
      fetchEndpoint(`fixtures?league=${league}&live=all`)
    ]);

    if (Array.isArray(liveData)) list.push(...liveData);
    if (Array.isArray(nextData)) list.push(...nextData);
    if (Array.isArray(lastData)) list.push(...lastData);

    // If still empty, query full season
    if (list.length === 0) {
      const seasonData = await fetchEndpoint(`fixtures?league=${league}&season=2026`);
      if (Array.isArray(seasonData) && seasonData.length > 0) {
        list.push(...seasonData);
      } else {
        const seasonData2025 = await fetchEndpoint(`fixtures?league=${league}&season=2025`);
        if (Array.isArray(seasonData2025)) list.push(...seasonData2025);
      }
    }

    // Deduplicate by fixture id
    const seen = new Set();
    const unique = [];
    for (const item of list) {
      const id = item.fixture?.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      league,
      count: unique.length,
      debug: debugLog,
      response: unique
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
      debug: debugLog,
      response: []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
