/**
 * DEEPPREDICTBET — PHASE 10 AUTOMATED TEST SUITE
 * Recent Settled Predictions Repair & Intelligent Historical Retrieval System
 */

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

require('../js/predictionLedger.js');
const Ledger = globalThis.PredictionSettlementLedger;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ❌ FAIL: ${name}\n     ${err.stack || err.message}`);
  }
}

console.log('======================================================================');
console.log('DEEPPREDICTBET — RECENT SETTLED PREDICTIONS & HISTORICAL RETRIEVAL TESTS');
console.log('======================================================================\n');

const NOW_2026_11_13 = Date.parse('2026-11-13T15:00:00Z');
const DAY_MS = 86400000;

function makeTestRecord(idNum, daysAgo, status = 'WON', extra = {}) {
  const settledTs = NOW_2026_11_13 - Math.floor(daysAgo * DAY_MS) + 3600000;
  const kickoffTs = settledTs - 7200000;
  const publishedTs = kickoffTs - 21600000;
  return {
    predictionId: `TEST-PRED-${idNum}`,
    matchId: `test-match-${idNum}`,
    fixtureId: `test-match-${idNum}`,
    competitionId: '39',
    league: extra.league || 'Premier League',
    leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: extra.country || 'England',
    publishedAt: new Date(publishedTs).toISOString(),
    kickoffAt: new Date(kickoffTs).toISOString(),
    homeTeam: { name: `Home Club ${idNum}`, id: 100 + idNum },
    awayTeam: { name: `Away Club ${idNum}`, id: 200 + idNum },
    scores: extra.scores || (status === 'WON' ? { home: 2, away: 0 } : { home: 0, away: 1 }),
    finalStatus: extra.finalStatus || 'FT',
    selection: extra.selection || `Home Win (Home Club ${idNum})`,
    market: extra.market || 'Match Result (1X2)',
    odds: extra.odds || 1.85,
    confidence: extra.confidence || 84,
    status,
    settled_at: new Date(settledTs).toISOString(),
    settledTimestamp: settledTs,
    ...extra
  };
}

// 1. Test Case 1: Settled predictions exist from Yesterday (1d)
test('1. Progressive retrieval stops at Yesterday (1d) when records exist in 1d window', () => {
  const records = [
    makeTestRecord(1, 0.5, 'WON'),
    makeTestRecord(2, 0.6, 'WON'),
    makeTestRecord(3, 0.8, 'LOST')
  ];
  Ledger.resetLedgerForTesting(records);
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 10, progressive: true });
  assert.strictEqual(res.totalCount, 3);
  assert.strictEqual(res.windowDays, 1);
  assert.strictEqual(res.windowLabel, 'Yesterday');
  assert.strictEqual(res.windowStep, 1);
  assert.strictEqual(res.wonCount, 2);
  assert.strictEqual(res.lostCount, 1);
});

// 2. Test Case 2: No settled predictions from Yesterday (1d), but records exist from 2 days ago (2d)
test('2. Progressive retrieval expands from 1d -> 2d when no records exist in 1d', () => {
  const records = [
    makeTestRecord(1, 1.4, 'WON'),
    makeTestRecord(2, 1.7, 'LOST')
  ];
  Ledger.resetLedgerForTesting(records);
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 10, progressive: true });
  assert.strictEqual(res.totalCount, 2);
  assert.strictEqual(res.windowDays, 2);
  assert.strictEqual(res.windowLabel, 'Last 2 Days');
  assert.strictEqual(res.windowStep, 2);
  assert.strictEqual(res.windowTrace.length, 2);
  assert.strictEqual(res.windowTrace[0].count, 0);
  assert.strictEqual(res.windowTrace[1].count, 2);
});

// 3. Test Case 3: No settled predictions from 1–2 days, but records exist from 3 days ago (3d)
test('3. Progressive retrieval expands 1d -> 2d -> 3d when records first appear at 3d', () => {
  const records = [
    makeTestRecord(1, 2.3, 'WON'),
    makeTestRecord(2, 2.5, 'WON'),
    makeTestRecord(3, 2.8, 'LOST')
  ];
  Ledger.resetLedgerForTesting(records);
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 10, progressive: true });
  assert.strictEqual(res.totalCount, 3);
  assert.strictEqual(res.windowDays, 3);
  assert.strictEqual(res.windowLabel, 'Last 3 Days');
  assert.strictEqual(res.windowStep, 3);
});

// 4. Test Case 4: Progressive expansion across 1d -> 2d -> 3d -> 4d -> 5d -> 6d -> 7d
test('4. Progressive cumulative expansion across 1d..7d stops as soon as target limit (10) is reached', () => {
  const records = [
    makeTestRecord(1, 0.5, 'WON'),  // 1d (1)
    makeTestRecord(2, 1.5, 'WON'),  // 2d (2)
    makeTestRecord(3, 2.5, 'LOST'), // 3d (3)
    makeTestRecord(4, 3.5, 'WON'),  // 4d (4)
    makeTestRecord(5, 4.5, 'WON'),  // 5d (5)
    makeTestRecord(6, 5.5, 'LOST'), // 6d (6)
    makeTestRecord(7, 6.2, 'WON'),  // 7d (7)
    makeTestRecord(8, 6.4, 'WON'),  // 7d (8)
    makeTestRecord(9, 6.6, 'LOST'), // 7d (9)
    makeTestRecord(10, 6.8, 'WON'), // 7d (10 -> hits limit!)
    makeTestRecord(11, 12.0, 'WON') // 14d (not needed because 7d hit 10)
  ];
  Ledger.resetLedgerForTesting(records);
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 10, progressive: true });
  assert.strictEqual(res.totalCount, 10);
  assert.strictEqual(res.windowDays, 7);
  assert.strictEqual(res.windowLabel, 'Last 7 Days');
  assert.strictEqual(res.windowStep, 7);
});

// 5. Test Case 5: Progressive expansion to 14 days (Production Scenario on 13 NOV 2026)
test('5. Production Ledger on 13 NOV 2026 expands 1d..7d -> 14d and returns 10 verified settlements (6 Won, 4 Lost)', () => {
  Ledger.resetLedgerForTesting(); // Restore full 25 authoritative seed settlements
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 10, progressive: true });
  assert.strictEqual(res.totalCount, 10, 'Should return 10 verified settlements from Nov 1-2, 2026');
  assert.strictEqual(res.windowDays, 14, 'Should resolve to 14-day window');
  assert.strictEqual(res.windowLabel, 'Last 14 Days');
  assert.strictEqual(res.windowStep, 8);
  assert.strictEqual(res.wonCount, 6);
  assert.strictEqual(res.lostCount, 4);
  const summary = Ledger.formatSummaryHeader(res);
  assert.strictEqual(summary, 'Showing 10 verified settlements · 6 Won · 4 Lost · Last 14 Days');
});

// 6. Test Case 6: Progressive expansion to 30 days & Older verified history
test('6. Progressive expansion to 30d (14 records) and Older verified history (25 records)', () => {
  Ledger.resetLedgerForTesting();
  const res30 = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 14, progressive: true });
  assert.strictEqual(res30.totalCount, 14);
  assert.strictEqual(res30.windowDays, 30);
  assert.strictEqual(res30.windowLabel, 'Last 30 Days');
  assert.strictEqual(res30.wonCount, 9);
  assert.strictEqual(res30.lostCount, 5);

  const resAll = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 25, progressive: true });
  assert.strictEqual(resAll.totalCount, 25);
  assert.strictEqual(resAll.windowDays, null);
  assert.strictEqual(resAll.windowLabel, 'Verified History');
  assert.strictEqual(resAll.wonCount, 17);
  assert.strictEqual(resAll.lostCount, 8);
});

// 7. Test Case 7: Strict newest-to-oldest ordering
test('7. Returned settlements are strictly ordered from newest to oldest by settledTimestamp', () => {
  Ledger.resetLedgerForTesting();
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 25, progressive: true });
  for (let i = 1; i < res.records.length; i++) {
    assert(
      res.records[i - 1].settledTimestamp >= res.records[i].settledTimestamp,
      `Record ${i - 1} (${res.records[i - 1].settledTimestamp}) must be >= Record ${i} (${res.records[i].settledTimestamp})`
    );
  }
});

// 8. Test Case 8: Deduplication across overlapping windows
test('8. Duplicate predictionIds or duplicate matchId+market entries are never returned', () => {
  const rec1 = makeTestRecord(1, 2.0, 'WON');
  const rec1Dup = { ...rec1 };
  const recSameMatchMarket = { ...makeTestRecord(2, 2.1, 'WON'), matchId: rec1.matchId, market: rec1.market };
  Ledger.resetLedgerForTesting([rec1, rec1Dup, recSameMatchMarket]);
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 10, progressive: true });
  assert.strictEqual(res.totalCount, 1, 'Duplicates must be collapsed to 1 authoritative record');
});

// 9. Test Case 9: Market Evaluator — WON, LOST, VOID, UNDER REVIEW, PENDING
test('9. Market Evaluator accurately classifies WON, LOST, VOID, UNDER REVIEW, and PENDING across markets', () => {
  // 1X2
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win (Arsenal)', { home: 2, away: 1 }, 'FT', 'Arsenal', 'Chelsea').status, 'WON');
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win (Arsenal)', { home: 1, away: 1 }, 'FT', 'Arsenal', 'Chelsea').status, 'LOST');
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Away Win (Chelsea)', { home: 0, away: 2 }, 'FT', 'Arsenal', 'Chelsea').status, 'WON');

  // BTTS
  assert.strictEqual(Ledger.evaluatePredictionMarket('BTTS', 'Both Teams To Score (BTTS: Yes)', { home: 1, away: 1 }, 'FT', 'A', 'B').status, 'WON');
  assert.strictEqual(Ledger.evaluatePredictionMarket('BTTS', 'Both Teams To Score (BTTS: Yes)', { home: 2, away: 0 }, 'FT', 'A', 'B').status, 'LOST');

  // Over/Under
  assert.strictEqual(Ledger.evaluatePredictionMarket('Over/Under 2.5', 'Over 2.5 Goals', { home: 2, away: 1 }, 'FT', 'A', 'B').status, 'WON');
  assert.strictEqual(Ledger.evaluatePredictionMarket('Over/Under 2.5', 'Over 2.5 Goals', { home: 1, away: 1 }, 'FT', 'A', 'B').status, 'LOST');
  assert.strictEqual(Ledger.evaluatePredictionMarket('Over/Under 2.0', 'Over 2.0 Goals', { home: 1, away: 1 }, 'FT', 'A', 'B').status, 'VOID');

  // Draw No Bet (DNB) — Draw results in VOID
  assert.strictEqual(Ledger.evaluatePredictionMarket('Draw No Bet', 'Arsenal Draw No Bet (Away DNB)', { home: 1, away: 1 }, 'FT', 'Newcastle', 'Arsenal').status, 'VOID');
  assert.strictEqual(Ledger.evaluatePredictionMarket('Draw No Bet', 'Arsenal Draw No Bet (Away DNB)', { home: 1, away: 0 }, 'FT', 'Newcastle', 'Arsenal').status, 'LOST');
  assert.strictEqual(Ledger.evaluatePredictionMarket('Draw No Bet', 'Arsenal Draw No Bet (Away DNB)', { home: 0, away: 2 }, 'FT', 'Newcastle', 'Arsenal').status, 'WON');

  // Win to Nil
  assert.strictEqual(Ledger.evaluatePredictionMarket('Win to Nil', 'Home Win to Nil (Bayern)', { home: 3, away: 0 }, 'FT', 'Bayern', 'Union').status, 'WON');
  assert.strictEqual(Ledger.evaluatePredictionMarket('Win to Nil', 'Home Win to Nil (Bayern)', { home: 3, away: 1 }, 'FT', 'Bayern', 'Union').status, 'LOST');

  // Postponed / Cancelled -> VOID
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win', { home: null, away: null }, 'PST', 'A', 'B').status, 'VOID');
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win', { home: null, away: null }, 'CANC', 'A', 'B').status, 'VOID');

  // Abandoned / Suspended -> UNDER REVIEW
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win', { home: 1, away: 0 }, 'ABD', 'A', 'B').status, 'UNDER REVIEW');
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win', { home: 1, away: 0 }, 'SUSP', 'A', 'B').status, 'UNDER REVIEW');

  // Unfinished -> PENDING
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win', { home: 1, away: 0 }, '2H', 'A', 'B').status, 'PENDING');
  assert.strictEqual(Ledger.evaluatePredictionMarket('1X2', 'Home Win', { home: null, away: null }, 'NS', 'A', 'B').status, 'PENDING');
});

// 10. Test Case 10: Anti-Backdating & Pre-Kickoff Publication Integrity (Phase 4 & 8)
test('10. Rejects any backdated prediction where publishedAt >= kickoffAt', () => {
  Ledger.resetLedgerForTesting([]);
  const backdated = makeTestRecord(99, 1.0, 'WON', {
    publishedAt: '2026-11-12T17:00:00Z',
    kickoffAt: '2026-11-12T15:00:00Z' // Published AFTER kickoff!
  });
  assert.strictEqual(Ledger.validatePreKickoffIntegrity(backdated), false);
  const ok = Ledger.settlePrediction('TEST-BACKDATED', backdated, 'WON');
  assert.strictEqual(ok, false, 'settlePrediction must reject backdated predictions');
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13 });
  assert.strictEqual(res.totalCount, 0);
});

// 11. Test Case 11: Idempotent Settlement & Fixture ID Isolation
test('11. Settlement is idempotent and isolates records by authoritative matchId', () => {
  const initial = makeTestRecord(50, 1.0, 'WON');
  Ledger.resetLedgerForTesting([initial]);
  const origSettledAt = initial.settled_at;
  // Settle same prediction again with identical final result
  Ledger.settlePrediction(initial.predictionId, {
    matchId: initial.matchId,
    scores: initial.scores,
    finalStatus: 'FT',
    settled_at: '2026-11-13T14:59:00Z'
  }, 'WON');
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13 });
  assert.strictEqual(res.totalCount, 1);
  assert.strictEqual(res.records[0].settled_at, origSettledAt, 'Idempotent settlement must preserve original settled_at');
});

// 12. Test Case 12: Explicit Date Format (Never Yesterday / Today / X Days Ago)
test('12. Explicit date formatter outputs DD MMM YYYY and never relative labels', () => {
  Ledger.resetLedgerForTesting();
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 25, progressive: true });
  for (const r of res.records) {
    assert(/^\d{2} [A-Z]{3} \d{4}$/.test(r.matchDateDisplay), `Invalid matchDateDisplay: ${r.matchDateDisplay}`);
    assert(/^(FT|AET|PEN|VOID|REVIEW) · \d{2} [A-Z]{3} \d{4}$/.test(r.matchDateFormatted), `Invalid matchDateFormatted: ${r.matchDateFormatted}`);
    assert(!/yesterday|today|tomorrow|days ago/i.test(r.matchDateFormatted), `Relative label found in ${r.matchDateFormatted}`);
  }
});

// 13. Test Case 13: Summary Header with VOID and UNDER REVIEW records
test('13. Summary header accounts for Void and Under Review records when present', () => {
  const records = [
    makeTestRecord(1, 0.5, 'WON'),
    makeTestRecord(2, 0.6, 'LOST'),
    makeTestRecord(3, 0.7, 'VOID', { finalStatus: 'PST', scores: { home: null, away: null } }),
    makeTestRecord(4, 0.8, 'UNDER REVIEW', { finalStatus: 'ABD', scores: { home: 1, away: 0 } })
  ];
  Ledger.resetLedgerForTesting(records);
  const res = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13, limit: 10, progressive: true });
  assert.strictEqual(res.wonCount, 1);
  assert.strictEqual(res.lostCount, 1);
  assert.strictEqual(res.voidCount, 1);
  assert.strictEqual(res.underReviewCount, 1);
  const header = Ledger.formatSummaryHeader(res);
  assert.strictEqual(header, 'Showing 4 verified settlements · 1 Won · 1 Lost · 1 Void · 1 Under Review · Yesterday');
});

// 14. Test Case 14: Phase 7 Empty States (Cases A, B, C, D)
test('14. Phase 7 Empty States return exact required messages for Cases A, B, C, and D', () => {
  // Case A: No eligible predictions exist
  Ledger.resetLedgerForTesting([]);
  const resA = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13 });
  assert.strictEqual(resA.emptyReason, 'NO_ELIGIBLE_PREDICTIONS');
  assert.strictEqual(resA.emptyMessage, 'No previously published predictions are available for settlement in the selected period.');

  // Case B: Matches are not yet finished (pending predictions exist)
  Ledger.resetLedgerForTesting([], {
    pendingPredictions: [{ matchId: 'fut-1', status: 'PENDING' }]
  });
  const resB = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13 });
  assert.strictEqual(resB.emptyReason, 'MATCHES_IN_PROGRESS');
  assert.strictEqual(resB.emptyMessage, 'Awaiting verified final match results for existing predictions.');

  // Case C: Settlement processing delay
  Ledger.resetLedgerForTesting([], {
    unverifiedFinishedCount: 3
  });
  const resC = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13 });
  assert.strictEqual(resC.emptyReason, 'SETTLEMENT_DELAY');
  assert.strictEqual(resC.emptyMessage, 'Recent match results are being verified. Settlement updates will appear once auditing is complete.');

  // Case D: API or database retrieval error
  Ledger.resetLedgerForTesting([], {
    simulateApiError: true
  });
  const resD = Ledger.getRecentSettledPredictions({ now: NOW_2026_11_13 });
  assert.strictEqual(resD.emptyReason, 'API_ERROR');
  assert.strictEqual(resD.emptyMessage, 'Settlement history is temporarily unavailable. Please try again shortly.');
});

// 15. Test Case 15: Full DOM Render & /results Consistency + Zero Top-Level Collision Check
test('15. Browser VM simulation: homepage #settled-picks-grid and /results page share identical dataset & zero script syntax collisions', () => {
  Ledger.resetLedgerForTesting();
  const html = fs.readFileSync('index.html', 'utf8');
  const scriptRegex = /<script\s+defer\s+src="\/([^"?]+)(?:\?[^"]*)?"><\/script>/g;
  const scripts = [];
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  assert(scripts.length >= 20, 'Should discover all deferred scripts in index.html');

  // Verify predictionLedger.js is loaded BEFORE ui.js and pages.js
  const idxLedger = scripts.indexOf('js/predictionLedger.js');
  const idxUi = scripts.indexOf('js/ui.js');
  const idxPages = scripts.indexOf('js/pages.js');
  assert(idxLedger >= 0 && idxLedger < idxUi, 'predictionLedger.js must load before ui.js');
  assert(idxLedger < idxPages, 'predictionLedger.js must load before pages.js');

  // Check that concatenating all scripts in global scope produces zero SyntaxError redeclarations
  const combinedSource = scripts.map(s => `// === ${s} ===\n` + fs.readFileSync(s, 'utf8')).join('\n;\n');
  new vm.Script(combinedSource, { filename: 'combined_global_scope.js' });
});

console.log('\n======================================================================');
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
console.log('======================================================================');
if (failed > 0) process.exit(1);

// 16. Test Case 16: DOM rendering of renderRecentSettledPredictions()
test('16. DOM rendering of renderRecentSettledPredictions populates #settled-picks-grid and #settled-picks-sample-info accurately', () => {
  Ledger.resetLedgerForTesting();
  const elements = {
    'settled-picks-grid': { innerHTML: '' },
    'settled-picks-sample-info': { textContent: '' }
  };
  globalThis.document = {
    readyState: 'complete',
    getElementById: (id) => elements[id] || null,
    querySelectorAll: () => []
  };
  globalThis.window = globalThis;
  globalThis.__DP_RUNTIME_NOW__ = NOW_2026_11_13;

  const qRes = Ledger.renderRecentSettledPredictions();
  assert.strictEqual(qRes.totalCount, 10);
  assert.strictEqual(
    elements['settled-picks-sample-info'].textContent,
    'Showing 10 verified settlements · 6 Won · 4 Lost · Last 14 Days'
  );
  assert(elements['settled-picks-grid'].innerHTML.includes('FT · 02 NOV 2026'), 'Must render explicit FT · 02 NOV 2026 date');
  assert(elements['settled-picks-grid'].innerHTML.includes('FT · 01 NOV 2026'), 'Must render explicit FT · 01 NOV 2026 date');
  assert(elements['settled-picks-grid'].innerHTML.includes('Manchester United'), 'Must render Manchester United');
  assert(elements['settled-picks-grid'].innerHTML.includes('✓ WON'), 'Must render ✓ WON badge');
  assert(elements['settled-picks-grid'].innerHTML.includes('✗ LOST'), 'Must render ✗ LOST badge');
  assert(!/yesterday|today|days ago/i.test(elements['settled-picks-grid'].innerHTML), 'Must never render relative date strings');

  delete globalThis.document;
  delete globalThis.__DP_RUNTIME_NOW__;
});

// 17. Test Case 17: /results Page (renderResultsPage) consistency with PredictionSettlementLedger
test('17. /results page (renderResultsPage) uses the exact same PredictionSettlementLedger dataset and explicit DD MMM YYYY dates', () => {
  Ledger.resetLedgerForTesting();
  const elements = {
    'view-results': { innerHTML: '' },
    'settled-picks-grid': { innerHTML: '' },
    'settled-picks-sample-info': { textContent: '' }
  };
  globalThis.document = {
    readyState: 'complete',
    getElementById: (id) => elements[id] || null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };
  globalThis.window = globalThis;
  globalThis.__DP_RUNTIME_NOW__ = NOW_2026_11_13;

  require('../js/pages.js');
  assert.strictEqual(typeof globalThis.renderResultsPage, 'function');

  globalThis.renderResultsPage('all');
  const htmlAll = elements['view-results'].innerHTML;
  assert(htmlAll.includes('Showing 25 verified settlements · 17 Won · 8 Lost · Verified History'), 'Should display all 25 verified settlements on /results');
  assert(htmlAll.includes('02 NOV 2026'), 'Should include 02 NOV 2026');
  assert(htmlAll.includes('27 OCT 2026'), 'Should include 27 OCT 2026');
  assert(htmlAll.includes('17 SEP 2026'), 'Should include 17 SEP 2026');
  assert(!/Yesterday|2 Days Ago|3 Days Ago/i.test(htmlAll), 'Should never include legacy relative date labels');

  globalThis.renderResultsPage('WON');
  const htmlWon = elements['view-results'].innerHTML;
  assert(htmlWon.includes('Showing 17 verified settlements'), 'WON filter should display 17 won settlements');

  globalThis.renderResultsPage('LOST');
  const htmlLost = elements['view-results'].innerHTML;
  assert(htmlLost.includes('Showing 8 verified settlements'), 'LOST filter should display 8 lost settlements');

  delete globalThis.document;
  delete globalThis.__DP_RUNTIME_NOW__;
});

// 18. Test Case 18: Welcome Back Panel Absence Independence
test('18. Recent Settled Predictions & /results operate with 100% independence when Welcome Back panel is absent', () => {
  Ledger.resetLedgerForTesting();
  const elements = {
    // Note: #auth-welcome-strip-mount is intentionally absent!
    'settled-picks-grid': { innerHTML: '' },
    'settled-picks-sample-info': { textContent: '' },
    'view-results': { innerHTML: '' }
  };
  globalThis.document = {
    readyState: 'complete',
    getElementById: (id) => elements[id] || null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };
  globalThis.window = globalThis;
  globalThis.__DP_RUNTIME_NOW__ = NOW_2026_11_13;

  const qRes = Ledger.renderRecentSettledPredictions();
  assert.strictEqual(qRes.totalCount, 10);
  assert(elements['settled-picks-grid'].innerHTML.includes('settled-pick-card'));

  globalThis.renderResultsPage('all');
  assert(elements['view-results'].innerHTML.includes('Historical Performance'));

  delete globalThis.document;
  delete globalThis.__DP_RUNTIME_NOW__;
});

console.log(`\nFINAL EXTENDED SUMMARY: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
