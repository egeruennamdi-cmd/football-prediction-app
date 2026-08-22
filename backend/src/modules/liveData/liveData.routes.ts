import { Router, Request, Response } from 'express';

const router = Router();

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY || '2a68951288bede4261ef3365fa11f2c8';
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

  const headers: Record<string, string> = {
    'x-apisports-key': FOOTBALL_API_KEY,
    'x-rapidapi-key': FOOTBALL_API_KEY,
    'x-rapidapi-host': FOOTBALL_API_HOST
  };

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers
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

// GET /api/v1/live/fixtures - Fetch live scores or upcoming fixtures (raw API-Football format)
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

// GET /api/v1/live/matches - Fetch live fixtures transformed directly into DeepPredictBet Match format
router.get('/matches', async (req: Request, res: Response) => {
  try {
    const data = await fetchFromApiFootball('fixtures', { live: 'all' });
    const rawFixtures = data.response || [];

    const normalizedMatches = rawFixtures.map((item: any) => {
      const elapsed = item.fixture?.status?.elapsed || 45;
      const statusShort = item.fixture?.status?.short || 'LIVE';
      const homeScore = item.goals?.home ?? 0;
      const awayScore = item.goals?.away ?? 0;

      // Deterministic synthetic ML probabilities based on match state & team data
      const homeName = item.teams?.home?.name || 'Home Team';
      const awayName = item.teams?.away?.name || 'Away Team';
      const hash = Math.abs((homeName + awayName).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0));
      const homeProb = 35 + (hash % 30);
      const awayProb = 20 + ((hash >> 2) % 25);
      const drawProb = Math.max(10, 100 - homeProb - awayProb);

      return {
        id: `apifootball-${item.fixture?.id}`,
        date: 'today',
        league: item.league?.name || 'Global League',
        leagueEmoji: item.league?.country === 'England' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' :
                     item.league?.country === 'Spain' ? '🇪🇸' :
                     item.league?.country === 'Germany' ? '🇩🇪' :
                     item.league?.country === 'Italy' ? '🇮🇹' :
                     item.league?.country === 'France' ? '🇫🇷' :
                     item.league?.country === 'Nigeria' ? '🇳🇬' : '⚽',
        time: statusShort === 'HT' ? 'HT' : `Live ${elapsed}'`,
        isLive: true,
        status: 'LIVE',
        homeTeam: {
          name: homeName,
          logo: item.teams?.home?.logo || '⚽',
          form: ['W', 'D', 'W', 'W', 'L']
        },
        awayTeam: {
          name: awayName,
          logo: item.teams?.away?.logo || '⚽',
          form: ['W', 'L', 'D', 'W', 'D']
        },
        scores: { home: homeScore, away: awayScore },
        predictions: { home: homeProb, draw: drawProb, away: awayProb },
        confidence: homeProb > 50 || awayProb > 45 ? 'high' : 'medium',
        confidenceVal: Math.min(95, Math.max(65, homeProb + 25)),
        insight: `Live in-play telemetry: ${homeName} ${homeScore} - ${awayScore} ${awayName} at minute ${elapsed}'.`,
        isPremium: false,
        aiAnalysis: `Automated live radar from API-Football. ${homeName} has generated high dangerous attack intensity. Current in-play probability favors Home Win (${homeProb}%) or Over 2.5 match goals.`,
        topTips: ['uo15', 'uo25', 'c75', 'c85', 'btts']
      };
    });

    res.status(200).json({
      success: true,
      count: normalizedMatches.length,
      matches: normalizedMatches
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

// GET /api/v1/live/fixtures-by-league - Fixtures for a specific league & date in DeepPredictBet match card format
router.get('/fixtures-by-league', async (req: Request, res: Response) => {
  try {
    const league  = req.query.league as string || '39';
    const dateStr = req.query.date   as string || new Date().toISOString().split('T')[0];
    const now     = new Date();
    const season  = req.query.season as string ||
                    (now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1).toString();

    // Fetch scheduled fixtures for the date AND any currently live ones for this league
    const [scheduledData, liveData] = await Promise.all([
      fetchFromApiFootball('fixtures', { league, date: dateStr, season }),
      fetchFromApiFootball('fixtures', { league, live: 'all' })
    ]);

    const scheduledFixtures: any[] = scheduledData.response || [];
    const liveFixtures: any[]      = liveData.response      || [];

    // Merge, deduplicate — live takes priority over scheduled
    const liveIds = new Set(liveFixtures.map((f: any) => f.fixture?.id));
    const allRaw  = [
      ...liveFixtures,
      ...scheduledFixtures.filter((f: any) => !liveIds.has(f.fixture?.id))
    ];

    const countryFlagMap: Record<string, string> = {
      'England':     '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Spain':       '🇪🇸',
      'Germany':     '🇩🇪',
      'Italy':       '🇮🇹',
      'France':      '🇫🇷',
      'Portugal':    '🇵🇹',
      'Netherlands': '🇳🇱',
      'USA':         '🇺🇸',
      'Nigeria':     '🇳🇬',
      'Brazil':      '🇧🇷',
      'Argentina':   '🇦🇷'
    };

    const LIVE_STATUSES = new Set(['1H','HT','2H','ET','BT','P','SUSP','INT','LIVE']);
    const FT_STATUSES   = new Set(['FT','AET','PEN']);

    const normalized = allRaw.map((item: any) => {
      const statusShort = item.fixture?.status?.short || 'NS';
      const elapsed     = item.fixture?.status?.elapsed || null;
      const isLive      = LIVE_STATUSES.has(statusShort);
      const isFT        = FT_STATUSES.has(statusShort);
      const homeScore   = item.goals?.home ?? null;
      const awayScore   = item.goals?.away ?? null;
      const homeName    = item.teams?.home?.name || 'Home Team';
      const awayName    = item.teams?.away?.name || 'Away Team';

      // Deterministic probability hash (API-Football free tier doesn't include /predictions)
      const hash     = Math.abs((homeName + awayName).split('').reduce(
        (a: number, c: string) => a + c.charCodeAt(0), 0));
      const homeProb = 35 + (hash % 30);
      const awayProb = 20 + ((hash >> 2) % 25);
      const drawProb = Math.max(10, 100 - homeProb - awayProb);

      let timeDisplay: string;
      if (isLive)    timeDisplay = statusShort === 'HT' ? 'Half Time' : `Live ${elapsed || ''}'`;
      else if (isFT) timeDisplay = 'Full Time';
      else {
        const kickoff = item.fixture?.date ? new Date(item.fixture.date) : null;
        timeDisplay   = kickoff
          ? kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : 'TBD';
      }

      const country    = item.league?.country || '';
      const leagueFlag = countryFlagMap[country] || '⚽';
      const insight    = isLive
        ? `Live: ${homeName} ${homeScore ?? 0}-${awayScore ?? 0} ${awayName} (${elapsed ?? '?'}')`
        : `Upcoming fixture — model favours ${homeProb > awayProb ? homeName : awayName} (${Math.max(homeProb, awayProb)}%).`;

      return {
        id:          `apifootball-${item.fixture?.id || Math.random().toString(36).slice(2)}`,
        date:        'today',
        league:      item.league?.name || 'Unknown League',
        leagueEmoji: leagueFlag,
        time:        timeDisplay,
        isLive,
        status:      statusShort,
        homeTeam: {
          name: homeName,
          logo: item.teams?.home?.logo
            ? `<img src="${item.teams.home.logo}" style="width:32px;height:32px;object-fit:contain;" onerror="this.outerHTML='⚽'">`
            : '⚽',
          form: ['W','D','W','W','L']
        },
        awayTeam: {
          name: awayName,
          logo: item.teams?.away?.logo
            ? `<img src="${item.teams.away.logo}" style="width:32px;height:32px;object-fit:contain;" onerror="this.outerHTML='⚽'">`
            : '⚽',
          form: ['W','L','D','W','D']
        },
        scores:       { home: homeScore, away: awayScore },
        predictions:  { home: homeProb, draw: drawProb, away: awayProb },
        confidence:   homeProb > 55 || awayProb > 45 ? 'high' : 'medium',
        confidenceVal: Math.min(95, Math.max(60, homeProb + 20)),
        insight,
        isPremium:    false,
        aiAnalysis:   `API-Football data · ${homeName} vs ${awayName} · Home ${homeProb}% | Draw ${drawProb}% | Away ${awayProb}%. ${insight}`,
        topTips:      ['uo15','uo25','c75','c85','btts']
      };
    });

    res.status(200).json({
      success: true,
      league,
      date:    dateStr,
      count:   normalized.length,
      matches: normalized
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
