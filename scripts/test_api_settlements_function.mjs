import assert from 'assert';
import { onRequest, evaluatePredictionMarket } from '../functions/api/settlements.js';

const NOW_2026_11_13 = Date.parse('2026-11-13T15:00:00Z');

async function runTests() {
  console.log('======================================================================');
  console.log('DEEPPREDICTBET — /api/settlements EDGE FUNCTION TESTS');
  console.log('======================================================================\n');

  const kvStore = new Map();
  const mockEnv = {
    ConvertBetCodes: {
      get: async (k) => kvStore.get(k) || null,
      put: async (k, v) => { kvStore.set(k, v); }
    }
  };

  // 1. GET /api/settlements with progressive retrieval on 13 NOV 2026
  {
    const req = new Request(`https://deeppredictbet.com/api/settlements?limit=10&progressive=true&now=${NOW_2026_11_13}`);
    const res = await onRequest({ request: req, env: mockEnv });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.totalCount, 10);
    assert.strictEqual(data.windowDays, 14);
    assert.strictEqual(data.windowLabel, 'Last 14 Days');
    assert.strictEqual(data.wonCount, 6);
    assert.strictEqual(data.lostCount, 4);
    assert.strictEqual(data.totalAvailable, 25);
    console.log('  ✅ PASS: 1. GET /api/settlements progressive retrieval returns 10 verified settlements (Last 14 Days)');
  }

  // 2. GET /api/settlements with status filter = WON and limit = 25
  {
    const req = new Request(`https://deeppredictbet.com/api/settlements?limit=25&status=WON&progressive=true&now=${NOW_2026_11_13}`);
    const res = await onRequest({ request: req, env: mockEnv });
    const data = await res.json();
    assert.strictEqual(data.totalCount, 17);
    assert(data.records.every(r => r.status === 'WON'));
    console.log('  ✅ PASS: 2. GET /api/settlements status=WON returns all 17 verified winning settlements');
  }

  // 3. POST /api/settlements — settle a new completed fixture with pre-kickoff publication
  {
    const postPayload = {
      predictionId: 'DP-PRED-20261112-TEST01',
      matchId: 'match-nov12-test-1',
      league: 'Premier League',
      leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      country: 'England',
      publishedAt: '2026-11-12T10:00:00Z',
      kickoffAt: '2026-11-12T19:45:00Z',
      homeTeam: { name: 'Arsenal', id: 42 },
      awayTeam: { name: 'Chelsea', id: 49 },
      scores: { home: 2, away: 1 },
      finalStatus: 'FT',
      market: 'Match Result (1X2)',
      selection: 'Home Win (Arsenal)',
      odds: 1.85,
      confidence: 86,
      settled_at: '2026-11-12T21:45:00Z'
    };
    const postReq = new Request('https://deeppredictbet.com/api/settlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload)
    });
    const postRes = await onRequest({ request: postReq, env: mockEnv });
    const postData = await postRes.json();
    assert.strictEqual(postData.success, true);
    assert.strictEqual(postData.updatedCount, 1);

    // Idempotent second POST must have updatedCount === 0
    const postReq2 = new Request('https://deeppredictbet.com/api/settlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload)
    });
    const postRes2 = await onRequest({ request: postReq2, env: mockEnv });
    const postData2 = await postRes2.json();
    assert.strictEqual(postData2.updatedCount, 0, 'Idempotent duplicate POST must not re-update');

    // Verify GET now includes the new 12 NOV 2026 record first!
    const getReq = new Request(`https://deeppredictbet.com/api/settlements?limit=10&progressive=true&now=${NOW_2026_11_13}`);
    const getRes = await onRequest({ request: getReq, env: mockEnv });
    const getData = await getRes.json();
    assert.strictEqual(getData.records[0].predictionId, 'DP-PRED-20261112-TEST01');
    assert.strictEqual(getData.records[0].matchDateFormatted, 'FT · 12 NOV 2026');
    assert.strictEqual(getData.records[0].status, 'WON');
    console.log('  ✅ PASS: 3. POST /api/settlements idempotently settles pre-published prediction & persists to KV');
  }

  // 4. POST /api/settlements — rejects backdated prediction (publishedAt >= kickoffAt)
  {
    const badPayload = {
      predictionId: 'DP-PRED-BACKDATED',
      matchId: 'match-backdated',
      publishedAt: '2026-11-12T21:00:00Z',
      kickoffAt: '2026-11-12T19:45:00Z',
      scores: { home: 3, away: 0 },
      finalStatus: 'FT',
      market: '1X2',
      selection: 'Home Win'
    };
    const postReq = new Request('https://deeppredictbet.com/api/settlements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(badPayload)
    });
    const postRes = await onRequest({ request: postReq, env: mockEnv });
    const postData = await postRes.json();
    assert.strictEqual(postData.updatedCount, 0, 'Must reject backdated prediction');
    console.log('  ✅ PASS: 4. POST /api/settlements rejects backdated prediction (publishedAt >= kickoffAt)');
  }

  // 5. Empty result sets Cache-Control: no-store
  {
    const req = new Request(`https://deeppredictbet.com/api/settlements?league=NonExistentLeagueXYZ&now=${NOW_2026_11_13}`);
    const res = await onRequest({ request: req, env: mockEnv });
    assert(res.headers.get('Cache-Control').includes('no-store'), 'Empty response must never be cached');
    console.log('  ✅ PASS: 5. Empty response enforces Cache-Control: no-store to prevent stale empty-state caching');
  }

  console.log('\nALL /api/settlements EDGE FUNCTION TESTS PASSED!');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
