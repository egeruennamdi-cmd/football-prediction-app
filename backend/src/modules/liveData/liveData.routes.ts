import { Router, Request, Response } from 'express';

const router = Router();

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || 'e5b18229ddd53fd3d195dfdb059aa329';
const FOOTBALL_API_HOST = process.env.FOOTBALL_API_HOST || 'v3.football.api-sports.io';

// Cache memory to preserve 100 requests/day quota efficiently
let cache: { [key: string]: { timestamp: number; data: any } } = {};
const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache

async function fetchFromApiFootball(endpoint: string, params: Record<string, string> = {}) {
  const queryStr = new URLSearchParams(params).toString();
  const fullUrl = `https://${FOOTBALL_API_HOST}/${endpoint}${queryStr ? '?' + queryStr : ''}`;

  if (cache[fullUrl] && (Date.now() - cache[fullUrl].timestamp < CACHE_TTL_MS)) {
    return cache[fullUrl].data;
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'x-apisports-key': FOOTBALL_API_KEY,
      'x-rapidapi-host': FOOTBALL_API_HOST
    }
  });

  const data = await response.json();
  cache[fullUrl] = { timestamp: Date.now(), data };
  return data;
}

// GET /api/v1/live/status - Check API Football account quota & subscription
router.get('/status', async (req: Request, res: Response) => {
  try {
    const data = await fetchFromApiFootball('status');
    res.status(200).json({
      success: true,
      data: data.response || data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/live/fixtures - Fetch live scores or upcoming fixtures
router.get('/fixtures', async (req: Request, res: Response) => {
  try {
    const live = req.query.live as string || 'all';
    const params: Record<string, string> = {};
    if (live === 'all' || live === 'true') {
      params.live = 'all';
    }
    const data = await fetchFromApiFootball('fixtures', params);
    res.status(200).json({
      success: true,
      count: data.results || 0,
      fixtures: data.response || []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/live/standings - Fetch live league standings
router.get('/standings', async (req: Request, res: Response) => {
  try {
    const league = req.query.league as string || '39'; // Default Premier League
    const season = req.query.season as string || new Date().getFullYear().toString();
    const data = await fetchFromApiFootball('standings', { league, season });
    res.status(200).json({
      success: true,
      standings: data.response || []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
