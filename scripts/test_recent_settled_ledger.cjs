/**
 * scripts/test_recent_settled_ledger.cjs
 * Comprehensive test suite validating the Authoritative Prediction Settlement Ledger engine
 * and Recent Settled Predictions component for DeepPredictBet.
 */

const assert = require('assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('🧪 Starting DeepPredictBet Authoritative Prediction Settlement Ledger Test Suite...\n');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// 1. Setup DOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <div class="settled-picks-container">
    <div class="settled-picks-header">
      <span class="settled-picks-meta" id="settled-picks-sample-info"></span>
    </div>
    <div class="settled-picks-grid" id="settled-picks-grid"></div>
  </div>
</body></html>`, { url: 'https://deeppredictbet.com/' });

const { window } = dom;
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = {
  _store: {},
  getItem: (k) => global.localStorage._store[k] || null,
  setItem: (k, v) => { global.localStorage._store[k] = String(v); },
  removeItem: (k) => { delete global.localStorage._store[k]; },
  clear: () => { global.localStorage._store = {}; }
};
window.localStorage = global.localStorage;

// 2. Load dependencies
const dataCode = fs.readFileSync('js/data.js', 'utf8');
window.eval(dataCode);
global.MATCH_DATA = window.MATCH_DATA;

const crestsCode = fs.readFileSync('js/teamCrests.js', 'utf8');
window.eval(crestsCode);
global.TeamCrestRegistry = window.TeamCrestRegistry;
global.resolveTeamCrestUrl = window.resolveTeamCrestUrl;
global.renderTeamLogoHtml = window.renderTeamLogoHtml;

const ledgerCode = fs.readFileSync('js/predictionLedger.js', 'utf8');
window.eval(ledgerCode);
global.PredictionSettlementLedger = window.PredictionSettlementLedger;

const uiCode = fs.readFileSync('js/ui.js', 'utf8');
window.eval(uiCode);

console.log('--- CRITERION 1: Authoritative Ledger Querying ---');
it('PredictionSettlementLedger is defined and exposes required methods', () => {
  assert.ok(window.PredictionSettlementLedger, 'PredictionSettlementLedger must exist on window');
  assert.strictEqual(typeof window.PredictionSettlementLedger.getRecentSettledPredictions, 'function');
  assert.strictEqual(typeof window.PredictionSettlementLedger.settlePrediction, 'function');
  assert.strictEqual(typeof window.PredictionSettlementLedger.renderRecentSettledPredictions, 'function');
  assert.strictEqual(typeof window.PredictionSettlementLedger.subscribe, 'function');
});

console.log('\n--- CRITERION 2: Conclusive Settlement Filtering ---');
it('Only conclusive outcomes (WON, LOST, VOID) are included; pending/live excluded', () => {
  const res = window.PredictionSettlementLedger.getRecentSettledPredictions({ limit: 50, days: 30 });
  res.records.forEach(r => {
    const s = String(r.status).toUpperCase();
    assert.ok(s === 'WON' || s === 'LOST' || s === 'VOID', `Invalid status found: ${s}`);
  });
});

console.log('\n--- CRITERION 3: Primary Sort by Settlement Time Descending ---');
it('Predictions are strictly ordered by settled_at descending (newest first)', () => {
  const res = window.PredictionSettlementLedger.getRecentSettledPredictions({ limit: 10, days: 7 });
  for (let i = 0; i < res.records.length - 1; i++) {
    const curTs = res.records[i]._resolvedSettledTs;
    const nextTs = res.records[i + 1]._resolvedSettledTs;
    assert.ok(curTs >= nextTs, `Record ${i} (${curTs}) is older than record ${i+1} (${nextTs})`);
  }
});

console.log('\n--- CRITERION 4: Dynamic Rolling Recency Window (7 Days) ---');
it('Returns records settled within the rolling 7-day window from reference now', () => {
  const refNow = window.PredictionSettlementLedger.getEffectiveNow();
  const sevenDaysAgo = refNow - (7 * 86400000);
  const res = window.PredictionSettlementLedger.getRecentSettledPredictions({ limit: 6, days: 7 });
  
  assert.strictEqual(res.records.length, 6, 'Must retrieve 6 records for default view');
  res.records.forEach(r => {
    assert.ok(r._resolvedSettledTs <= refNow, `Settlement ${r._resolvedSettledTs} is in the future`);
    assert.ok(r._resolvedSettledTs >= sevenDaysAgo, `Settlement ${r._resolvedSettledTs} is older than 7 days`);
  });
});

console.log('\n--- CRITERION 5: Dynamic Metadata Calculation ---');
it('Calculates displayed counts (Won, Lost) dynamically from filtered records', () => {
  const res = window.PredictionSettlementLedger.getRecentSettledPredictions({ limit: 6, days: 7 });
  assert.strictEqual(res.wonCount + res.lostCount + res.voidCount, res.records.length);
  assert.strictEqual(res.wonCount, 3);
  assert.strictEqual(res.lostCount, 3);
});

console.log('\n--- CRITERION 6: Cross-League & Cross-Competition Diversity ---');
it('Default 6 records cover multiple top European leagues', () => {
  const res = window.PredictionSettlementLedger.getRecentSettledPredictions({ limit: 6, days: 7 });
  const leagues = new Set(res.records.map(r => r.league));
  assert.ok(leagues.has('Premier League'), 'Should contain Premier League');
  assert.ok(leagues.has('La Liga'), 'Should contain La Liga');
  assert.ok(leagues.has('Bundesliga'), 'Should contain Bundesliga');
  assert.ok(leagues.has('Serie A'), 'Should contain Serie A');
  assert.ok(leagues.size >= 4, `Expected at least 4 distinct leagues, got ${leagues.size}`);
});

console.log('\n--- CRITERION 7: Live Settlement Updates ---');
it('settlePrediction updates ledger, stamps settled_at, and promotes record', () => {
  let notified = false;
  const unsub = window.PredictionSettlementLedger.subscribe(() => { notified = true; });

  const newSettlement = {
    matchId: 'ucl-fix-real-mil',
    league: 'Champions League',
    leagueEmoji: '⭐',
    homeTeam: { name: 'Real Madrid', id: 541 },
    awayTeam: { name: 'AC Milan', id: 489 },
    scores: { home: 3, away: 1 },
    selection: 'Real Madrid Win & Over 2.5',
    odds: 1.95,
    confidence: 88,
    status: 'WON',
    matchDateFormatted: 'FT · Just Now'
  };

  const success = window.PredictionSettlementLedger.settlePrediction('DP-TEST-LIVE-01', newSettlement, 'WON');
  assert.strictEqual(success, true);
  assert.strictEqual(notified, true);
  unsub();

  const refreshed = window.PredictionSettlementLedger.getRecentSettledPredictions({ limit: 6, days: 7 });
  assert.strictEqual(refreshed.records[0].predictionId, 'DP-TEST-LIVE-01');
  assert.strictEqual(refreshed.records[0].status, 'WON');
  assert.strictEqual(refreshed.wonCount, 4);
  assert.strictEqual(refreshed.lostCount, 2);
});

console.log('\n--- CRITERION 8: Audit Integrity Preservation ---');
it('Preserves predictionId, matchId, selection, odds, confidence, and audit hash', () => {
  const res = window.PredictionSettlementLedger.getRecentSettledPredictions({ limit: 6, days: 7 });
  res.records.forEach(r => {
    assert.ok(r.predictionId, 'Must have predictionId');
    assert.ok(r.matchId, 'Must have matchId');
    assert.ok(r.selection, 'Must have selection');
    assert.ok(r.odds > 1.0, 'Must have valid odds');
    assert.ok(r.confidence > 0 && r.confidence <= 100, 'Must have valid confidence');
    assert.ok(r.auditHash && r.auditHash.startsWith('SHA256:'), 'Must have audit hash');
  });
});

console.log('\n--- CRITERION 9 & 10: Authentic Crests & Zero Raw URLs in UI ---');
it('Renders authentic crest img tags and zero raw image URLs in visible text', () => {
  // Clear test state back to seed
  global.localStorage.clear();
  window.renderRecentSettledPredictions();

  const grid = document.getElementById('settled-picks-grid');
  const cards = grid.querySelectorAll('.settled-pick-card');
  assert.strictEqual(cards.length, 6);

  const imgs = grid.querySelectorAll('img.settled-team-crest');
  assert.strictEqual(imgs.length, 12, '6 cards must have exactly 12 crest img elements');
  imgs.forEach(img => {
    assert.ok(img.src.includes('media.api-sports.io/football/teams/'), `Crest src invalid: ${img.src}`);
    assert.ok(img.alt && img.alt.length > 0, 'Img must have non-empty alt text');
  });

  const visibleText = grid.textContent;
  const rawUrlMatch = visibleText.match(/https?:\/\/media\.api-sports\.io[^\s<]*/i);
  assert.strictEqual(rawUrlMatch, null, `Found raw URL in visible text: ${rawUrlMatch ? rawUrlMatch[0] : ''}`);
  assert.ok(!visibleText.includes('.png'), 'Visible text must not include .png');
});

console.log('\n--- CRITERION 11: 3-Tier Card Structure ---');
it('Each card conforms to Header (league/time), Middle (crests/score), Bottom (pick/badge)', () => {
  const cards = document.querySelectorAll('.settled-pick-card');
  cards.forEach((card, idx) => {
    assert.ok(card.querySelector('.settled-card-header'), `Card ${idx + 1} missing header`);
    assert.ok(card.querySelector('.settled-teams-wrap'), `Card ${idx + 1} missing teams wrap`);
    assert.ok(card.querySelector('.settled-score-pill'), `Card ${idx + 1} missing score pill`);
    assert.ok(card.querySelector('.settled-pick-detail'), `Card ${idx + 1} missing detail section`);
    assert.ok(card.querySelector('.settled-status-badge'), `Card ${idx + 1} missing status badge`);
  });
});

console.log('\n--- CRITERION 12: Deduplication Protection ---');
it('Deduplicates predictions by predictionId or matchId', () => {
  const all = window.PredictionSettlementLedger.loadLedger();
  const idCounts = {};
  all.forEach(item => {
    idCounts[item.predictionId] = (idCounts[item.predictionId] || 0) + 1;
  });
  for (const [id, count] of Object.entries(idCounts)) {
    assert.strictEqual(count, 1, `Prediction ID ${id} duplicated in ledger`);
  }
});

console.log('\n==================================================');
console.log(`SETTLEMENT LEDGER TEST RESULTS: ${passCount} passed, ${failCount} failed.`);
console.log('==================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
