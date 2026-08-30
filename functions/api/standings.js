/**
 * Cloudflare Pages Function: /api/standings
 * Fetches live league standings from API-Football via Cloudflare edge.
 * TTL: 10-minute edge cache.
 */

const API_KEY = '2a68951288bede4261ef3365fa11f2c8';
const API_HOST = 'https://v3.football.api-sports.io';

export async function onRequest(context) {
  const cache = caches.default;
  const url = new URL(context.request.url);
  const league = url.searchParams.get('league') || '39';
  const now = new Date();
  const season = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  const cacheKey = new Request(`https://deeppredictbet.pages.dev/api/standings?league=${league}&season=${season}`);
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) return cachedResponse;

  const apiHeaders = {
    'x-apisports-key': API_KEY,
    'User-Agent': 'DeepPredictBet/1.0',
    'Accept': 'application/json'
  };

  try {
    const apiRes = await fetch(`${API_HOST}/standings?league=${league}&season=${season}`, { headers: apiHeaders });
    if (!apiRes.ok) throw new Error('API returned ' + apiRes.status);
    const json = await apiRes.json();

    const raw =
      json.response?.[0]?.league?.standings?.[0] ||
      json.response?.[0]?.league?.standings       ||
      json.response?.[0]?.standings?.[0]          ||
      json.response?.[0]?.standings               ||
      json.response || [];

    const standings = Array.isArray(raw) ? raw : [];

    const table = standings.map(item => ({
      rank:          item.rank                    ?? 0,
      name:          item.team?.name ?? item.name ?? 'Unknown',
      logo:          item.team?.logo              ?? null,
      matchesPlayed: item.all?.played             ?? 0,
      wins:          item.all?.win                ?? 0,
      draws:         item.all?.draw               ?? 0,
      losses:        item.all?.lose               ?? 0,
      goalsFor:      item.all?.goals?.for         ?? 0,
      goalsAgainst:  item.all?.goals?.against     ?? 0,
      goalDiff:      item.goalsDiff               ?? 0,
      points:        item.points                  ?? 0,
      form:          item.form                    ?? ''
    }));

    const payload = { success: table.length > 0, league, season, count: table.length, standings: table };

    const response = new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600, s-maxage=600',
        'Access-Control-Allow-Origin': '*'
      }
    });

    if (table.length > 0) context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message, standings: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
