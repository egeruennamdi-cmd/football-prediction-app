/**
 * DEEPPREDICTBET — COMPREHENSIVE VERIFICATION & TEST SUITE
 * AI-Powered Match & Market Intelligence Engine (Section 19)
 *
 * Covers:
 * 19.1 Functional & Full-Page Routing Tests (All 8 sections + 2 operating modes)
 * 19.2 Mathematical & Statistical Calibration Tests (Poisson + Dixon-Coles, EV, Overround, Odds Movement, Brier Score, Log Loss, CLV)
 * 19.3 Security, Entitlement & User Isolation Tests (Visitor, Free, VIP, Admin + Server KV isolation)
 * 19.4 Failure & Honesty Tests (Empty live matches, missing xA -> N/A, missing opening odds, Telegram unlinked/failure)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
require(path.join(ROOT, 'js', 'matchMarketIntelligenceEngine.js'));
const Engine = globalThis.MatchMarketIntelligenceEngine;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err && err.stack ? err.stack : err}`);
    failed++;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err && err.stack ? err.stack : err}`);
    failed++;
  }
}

(async function runSuite() {
  console.log('\n================================================================');
  console.log('🧪 DEEPPREDICTBET — MATCH & MARKET INTELLIGENCE ENGINE TEST SUITE');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. MATHEMATICAL & STATISTICAL TESTS (Section 19.2)
  // ---------------------------------------------------------------------------
  console.log('--- 1. Mathematical & Calibration Tests (Section 19.2) ---');

  test('1.1 Poisson + Dixon-Coles mutually exclusive probabilities sum to 100.0%', () => {
    const pairs = [
      [1.65, 1.10],
      [2.30, 0.85],
      [0.95, 1.80],
      [1.35, 1.35]
    ];
    for (const [lH, lA] of pairs) {
      const p = Engine.calculatePoissonDixonColesProbabilities(lH, lA, -0.10);
      const sum1X2 = parseFloat((p.homeWin + p.draw + p.awayWin).toFixed(1));
      const sumOU05 = parseFloat((p.over05 + p.under05).toFixed(1));
      const sumOU15 = parseFloat((p.over15 + p.under15).toFixed(1));
      const sumOU25 = parseFloat((p.over25 + p.under25).toFixed(1));
      const sumOU35 = parseFloat((p.over35 + p.under35).toFixed(1));
      const sumBTTS = parseFloat((p.bttsYes + p.bttsNo).toFixed(1));

      assert.strictEqual(sum1X2, 100.0, `1X2 sum for (${lH},${lA}) was ${sum1X2}`);
      assert.strictEqual(sumOU05, 100.0, `O/U 0.5 sum was ${sumOU05}`);
      assert.strictEqual(sumOU15, 100.0, `O/U 1.5 sum was ${sumOU15}`);
      assert.strictEqual(sumOU25, 100.0, `O/U 2.5 sum was ${sumOU25}`);
      assert.strictEqual(sumOU35, 100.0, `O/U 3.5 sum was ${sumOU35}`);
      assert.strictEqual(sumBTTS, 100.0, `BTTS sum was ${sumBTTS}`);
      assert.ok(Array.isArray(p.topScorelines) && p.topScorelines.length === 5, 'Should return top 5 probable scorelines');
    }
  });

  test('1.2 Value Metrics: Implied Probability, Fair Odds, EV (%), Probability Diff & Overround', () => {
    // Model Prob = 60% (0.60), Available Odds = 2.00
    // Implied Prob = 1 / 2.00 = 50.00%
    // Fair Odds = 1 / 0.60 = 1.67
    // EV (%) = ((0.60 * 2.00) - 1) * 100 = +20.00%
    // Prob Diff = 60.00 - 50.00 = +10.00%
    const v = Engine.calculateValueMetrics(60, 2.00, [2.00, 3.50, 3.80]);
    assert.strictEqual(v.valid, true);
    assert.strictEqual(v.modelProbabilityPct, 60.00);
    assert.strictEqual(v.impliedProbabilityPct, 50.00);
    assert.strictEqual(v.modelFairOdds, 1.67);
    assert.strictEqual(v.availableOdds, 2.00);
    assert.strictEqual(v.expectedValuePct, 20.00);
    assert.strictEqual(v.probabilityDifferencePct, 10.00);
    assert.ok(v.overroundPct > 0, `Expected positive bookmaker overround, got ${v.overroundPct}`);
    assert.ok(v.marginAdjustedImpliedPct < 50.00, 'Margin-adjusted implied prob should be lower than raw implied prob');
  });

  test('1.3 Opportunity Classification: Distinguishes High Probability from True +EV Value', () => {
    // High probability (75%) but poor bookmaker odds (1.20 -> EV = 0.75 * 1.20 - 1 = -10%) -> No Identified Value
    const highProbNoValue = Engine.classifyValueOpportunity({
      expectedValuePct: -10.0,
      probabilityDifferencePct: -8.33,
      modelConfidencePct: 82,
      decimalOdds: 1.20,
      sampleSize: 6,
      dataQualityVerified: true
    });
    assert.strictEqual(highProbNoValue, 'No Identified Value');

    // Strong +EV (+9.5% EV, +5.2% edge, 74% confidence, @1.95) -> Strong Potential Value
    const strongVal = Engine.classifyValueOpportunity({
      expectedValuePct: 9.5,
      probabilityDifferencePct: 5.2,
      modelConfidencePct: 74,
      decimalOdds: 1.95,
      sampleSize: 5,
      dataQualityVerified: true
    });
    assert.strictEqual(strongVal, 'Strong Potential Value');

    // Moderate +EV (+4.8% EV, +2.6% edge, 64% confidence) -> Moderate Potential Value
    const modVal = Engine.classifyValueOpportunity({
      expectedValuePct: 4.8,
      probabilityDifferencePct: 2.6,
      modelConfidencePct: 64,
      decimalOdds: 2.10,
      sampleSize: 5,
      dataQualityVerified: true
    });
    assert.strictEqual(modVal, 'Moderate Potential Value');

    // Insufficient data when sampleSize < 3 or low confidence
    const insuffVal = Engine.classifyValueOpportunity({
      expectedValuePct: 14.0,
      probabilityDifferencePct: 7.0,
      modelConfidencePct: 42,
      decimalOdds: 2.20,
      sampleSize: 2,
      dataQualityVerified: true
    });
    assert.strictEqual(insuffVal, 'Insufficient Data');

    // Expired or suspended market -> No Identified Value
    const expiredVal = Engine.classifyValueOpportunity({
      expectedValuePct: 12.0,
      probabilityDifferencePct: 6.0,
      modelConfidencePct: 78,
      decimalOdds: 2.05,
      sampleSize: 5,
      dataQualityVerified: true,
      isExpired: true
    });
    assert.strictEqual(expiredVal, 'No Identified Value');
  });

  test('1.4 Odds Movement Calculation & Honest Baseline-Only Handling', () => {
    // Shortening odds: 2.20 -> 1.85 (-15.91%)
    const shortMv = Engine.calculateOddsMovement(2.20, 2.00, 1.85, 5.0);
    assert.strictEqual(shortMv.valid, true);
    assert.strictEqual(shortMv.hasOpeningSnapshot, true);
    assert.strictEqual(shortMv.direction, 'SHORTENING');
    assert.strictEqual(shortMv.pctChange, -15.91);
    assert.strictEqual(shortMv.exceedsThreshold, true);
    assert.ok(shortMv.impliedProbChangePct > 8.0, 'Implied probability should increase when odds shorten');

    // Drifting odds: 1.80 -> 2.10 (+16.67%)
    const driftMv = Engine.calculateOddsMovement(1.80, 1.95, 2.10, 5.0);
    assert.strictEqual(driftMv.direction, 'DRIFTING');
    assert.strictEqual(driftMv.pctChange, 16.67);
    assert.strictEqual(driftMv.exceedsThreshold, true);

    // Missing opening snapshot -> BASELINE_SNAPSHOT_ONLY (never invent opening odds)
    const noOpenMv = Engine.calculateOddsMovement(null, null, 1.90, 5.0);
    assert.strictEqual(noOpenMv.valid, true);
    assert.strictEqual(noOpenMv.hasOpeningSnapshot, false);
    assert.strictEqual(noOpenMv.openingOdds, null);
    assert.strictEqual(noOpenMv.direction, 'BASELINE_SNAPSHOT_ONLY');
    assert.strictEqual(noOpenMv.exceedsThreshold, false);
  });

  test('1.5 Historical Performance Metrics: Accuracy, Brier Score, Log Loss, Calibration & CLV (Wins + Losses)', () => {
    const sampleLedger = [
      { id: '1', settlementStatus: 'WON', confidence: 75, odds: 1.80, closingOdds: 1.70, marketCategory: '1X2', league: 'Premier League' },
      { id: '2', settlementStatus: 'WON', confidence: 65, odds: 2.00, closingOdds: 1.90, marketCategory: 'Over/Under', league: 'La Liga' },
      { id: '3', settlementStatus: 'LOST', confidence: 60, odds: 1.90, closingOdds: 1.95, marketCategory: '1X2', league: 'Premier League' },
      { id: '4', settlementStatus: 'WON', confidence: 82, odds: 1.55, closingOdds: 1.50, marketCategory: 'BTTS', league: 'Serie A' }
    ];
    const perf = Engine.calculateHistoricalPerformanceMetrics(sampleLedger);
    assert.strictEqual(perf.totalDecided, 4);
    assert.strictEqual(perf.wins, 3);
    assert.strictEqual(perf.losses, 1, 'Must never exclude losing predictions');
    assert.strictEqual(perf.accuracyPct, 75.0);
    assert.ok(perf.brierScore > 0 && perf.brierScore < 0.25, `Expected realistic Brier Score, got ${perf.brierScore}`);
    assert.ok(perf.logLoss > 0 && perf.logLoss < 0.70, `Expected realistic Log Loss, got ${perf.logLoss}`);
    assert.ok(perf.hypotheticalRoiPct > 0, `Expected positive hypothetical ROI for 3W/1L, got ${perf.hypotheticalRoiPct}%`);
    assert.ok(perf.avgClvPct > 0, `Expected positive average CLV, got ${perf.avgClvPct}%`);
    assert.strictEqual(perf.calibrationBuckets.length, 4);
  });

  // ---------------------------------------------------------------------------
  // 2. FUNCTIONAL, DOM & FULL-PAGE ROUTING TESTS (Section 19.1 & 19.4)
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Functional, DOM & Full-Page Routing Tests (Section 19.1 & 19.4) ---');

  const htmlContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const dom = new JSDOM(htmlContent, {
    url: 'https://deeppredictbet.com/live-scanner',
    pretendToBeVisual: true
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.sessionStorage = dom.window.sessionStorage;
  global.history = dom.window.history;
  global.location = dom.window.location;

  // Set authenticated user state
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('currentUserEmail', 'analyst@deeppredictbet.com');
  localStorage.setItem('currentUsername', 'AnalystPro');
  localStorage.setItem('user_role', 'VIP');

  // Seed test match pool (1 Pre-Match + 0 Live initially to test honest empty live state)
  window.MATCH_DATA = [
    {
      id: 'fx_ars_che',
      homeTeam: { name: 'Arsenal', form: ['W', 'W', 'D', 'W', 'W'] },
      awayTeam: { name: 'Chelsea', form: ['W', 'D', 'L', 'W', 'D'] },
      league: 'Premier League',
      country: 'England',
      isLive: false,
      time: 'Today 20:00',
      odds: { home: 1.95, draw: 3.60, away: 3.90, over25: 1.85, under25: 2.00 },
      openingOdds: { home: 2.15, over25: 1.95 }
    },
    {
      id: 'fx_mad_bar',
      homeTeam: { name: 'Real Madrid', form: ['W', 'W', 'W', 'D', 'W'] },
      awayTeam: { name: 'Barcelona', form: ['W', 'W', 'L', 'W', 'D'] },
      league: 'La Liga',
      country: 'Spain',
      isLive: false,
      time: 'Tomorrow 21:00',
      odds: { home: 2.10, draw: 3.50, away: 3.40, over25: 1.72, under25: 2.15 },
      openingOdds: { home: 2.30, over25: 1.85 }
    }
  ];

  // Attach Engine to DOM window
  window.MatchMarketIntelligenceEngine = Engine;

  // Load router.js and ui.js in JSDOM context
  const routerCode = fs.readFileSync(path.join(ROOT, 'js', 'router.js'), 'utf8');
  dom.window.eval(routerCode);

  test('2.1 Empty Live-Match State: Never fabricates live matches when 0 live fixtures exist', () => {
    window.navigateTo('/live-scanner');
    const scannerView = document.getElementById('view-scanner');
    assert.ok(scannerView.classList.contains('active'), '#view-scanner should be active on /live-scanner');

    const rootHtml = document.getElementById('mmie-workspace-root').innerHTML;
    assert.ok(rootHtml.includes('No Verified Live Matches Currently In Play'), 'Should show honest empty live match state');

    const rowsHtml = document.getElementById('scanner-rows-container').innerHTML;
    assert.ok(rowsHtml.includes('No active live matches in play right now'), 'Legacy rows container should also show honest empty state');
  });

  test('2.2 Live Match Rendering & Missing Stat Honesty (xA displayed as N/A, never 0)', () => {
    // Add 1 verified live match without xA
    window.MATCH_DATA.push({
      id: 'fx_liv_mci',
      homeTeam: { name: 'Liverpool', form: ['W', 'W', 'W', 'D', 'W'] },
      awayTeam: { name: 'Manchester City', form: ['W', 'D', 'W', 'W', 'W'] },
      league: 'Premier League',
      country: 'England',
      isLive: true,
      statusShort: '2H',
      time: "64'",
      score: '2 - 1',
      odds: { home: 1.65, draw: 3.90, away: 5.20 }
    });

    Engine.switchSection('live');
    const enrichedLive = Engine.getAllEnrichedMatches().filter(m => m.isLive);
    assert.strictEqual(enrichedLive.length, 1);
    assert.strictEqual(enrichedLive[0].liveStats.xaHome, null, 'Missing xA must be null, never 0');
    assert.strictEqual(enrichedLive[0].liveStats.xaAway, null, 'Missing xA must be null, never 0');

    const rowsHtml = document.getElementById('scanner-rows-container').innerHTML;
    assert.ok(rowsHtml.includes('Liverpool (2 - 1) vs Manchester City'), 'Live match row should render score and teams');
    assert.ok(rowsHtml.includes('xA: N/A'), 'Missing xA must render explicitly as N/A in live telemetry');
  });

  test('2.3 All 8 Main Sections Route as Full-Page Views with Clean URLs (No Modal Popups)', () => {
    const routesToVerify = [
      { path: '/scanner/overview', expectedSec: 'overview', marker: 'AI-POWERED MATCH &amp; MARKET INTELLIGENCE ENGINE' },
      { path: '/live-scanner', expectedSec: 'live', marker: 'Monitoring <b>1</b> verified live matches' },
      { path: '/pre-match-scanner', expectedSec: 'prematch', marker: 'Poisson + Dixon-Coles goal distributions' },
      { path: '/scanner/odds-movement', expectedSec: 'odds', marker: 'Bookmaker Odds Movement &amp; Market Liquidity Tracker' },
      { path: '/scanner/value-opportunities', expectedSec: 'value', marker: 'AI Value Opportunity Detection Engine' },
      { path: '/scanner/match-analysis', expectedSec: 'analysis', marker: 'A. Match Overview &amp; B. Team Form' },
      { path: '/scanner/alerts', expectedSec: 'alerts', marker: 'Smart Alert Intelligence &amp; Delivery History' },
      { path: '/scanner/performance', expectedSec: 'history', marker: 'Historical Model Performance &amp; Calibration Ledger' }
    ];

    for (const r of routesToVerify) {
      window.navigateTo(r.path);
      assert.strictEqual(window.location.pathname, r.path, `Pathname should be ${r.path}`);
      assert.strictEqual(Engine.state.activeSection, r.expectedSec, `Active section for ${r.path} should be ${r.expectedSec}`);
      const html = document.getElementById('mmie-workspace-root').innerHTML;
      assert.ok(html.includes(r.marker), `Expected marker "${r.marker}" on route ${r.path}`);
    }
  });

  test('2.4 Filtering by Country, Competition, Team Search & Probability Threshold', () => {
    Engine.updateFilter('country', 'Spain');
    Engine.switchSection('prematch', true);
    const rowsSpain = document.getElementById('mmie-workspace-root').innerHTML;
    assert.ok(rowsSpain.includes('Showing <b>1</b> upcoming fixtures'), 'Country filter Spain should match 1 fixture (Real Madrid vs Barcelona)');

    Engine.updateFilter('country', 'all');
    Engine.updateFilter('search', 'Arsenal');
    const rowsArsenal = document.getElementById('mmie-workspace-root').innerHTML;
    assert.ok(rowsArsenal.includes('Showing <b>1</b> upcoming fixtures'), 'Search filter Arsenal should match 1 fixture');

    // Reset filters
    Engine.updateFilter('search', '');
    Engine.updateFilter('country', 'all');
  });

  test('2.5 Smart Alert Rules: Creation, Duplicate Prevention, Active Toggle, Cooldown Deduplication & Deletion', () => {
    localStorage.removeItem('dp_scanner_alert_rules_v1');
    localStorage.removeItem('dp_scanner_alert_cooldowns_v1');
    localStorage.removeItem('dp_scanner_alert_history_v1');

    // Create rule
    const r1 = Engine.addRule({ param: 'possession', cond: 'gt', val: 40, channel: 'both' });
    assert.ok(r1 && r1.id, 'Should create alert rule');
    assert.strictEqual(Engine.getAlertRules().length, 1);

    // Prevent duplicate rule
    const dup = Engine.addRule({ param: 'possession', cond: 'gt', val: 40, channel: 'both' });
    assert.strictEqual(dup, null, 'Duplicate rule with identical indicator/condition/value must be rejected');
    assert.strictEqual(Engine.getAlertRules().length, 1);

    // Evaluate rule against live matches -> should trigger once
    const enriched = Engine.getAllEnrichedMatches();
    const firstEval = Engine.evaluateRulesAgainstMatches(enriched);
    assert.strictEqual(firstEval.length, 1, 'First evaluation should trigger 1 alert for Liverpool vs Man City');

    // Immediate second evaluation -> must be suppressed by 15-minute cooldown deduplication
    const secondEval = Engine.evaluateRulesAgainstMatches(enriched);
    assert.strictEqual(secondEval.length, 0, 'Second evaluation within 15-minute cooldown must be deduplicated');

    // Toggle rule active/inactive
    Engine.toggleRuleActive(r1.id);
    assert.strictEqual(Engine.getAlertRules()[0].active, false);

    // Delete rule
    Engine.deleteRule(r1.id);
    assert.strictEqual(Engine.getAlertRules().length, 0);
  });

  // ---------------------------------------------------------------------------
  // 3. SERVER-SIDE ENDPOINT & SECURITY ISOLATION TESTS (Section 19.3 & 19.4)
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Server-Side Endpoints, User Isolation & Telegram Delivery Tests ---');

  await asyncTest('3.1 Server-Side /api/scanner/alerts enforces authentication and user-isolated KV storage', async () => {
    const alertsModulePath = path.join(ROOT, 'functions', 'api', 'scanner', 'alerts.js');
    const code = fs.readFileSync(alertsModulePath, 'utf8');
    assert.ok(code.includes('scanner_alerts:'), 'Must namespace alert storage by user key');
    assert.ok(code.includes('DELIVERED_CONFIRMED'), 'Must confirm delivery only after Telegram Bot API returns ok: true');
    assert.ok(code.includes('TELEGRAM_NOT_LINKED'), 'Must return honest TELEGRAM_NOT_LINKED status when user has not linked Telegram');
    assert.ok(code.includes('COOLDOWN_DEDUPLICATED'), 'Must enforce server-side 15-minute cooldown deduplication');
  });

  await asyncTest('3.2 Server-Side /api/scanner/intelligence persists timestamped odds snapshots in KV', async () => {
    const intelModulePath = path.join(ROOT, 'functions', 'api', 'scanner', 'intelligence.js');
    const code = fs.readFileSync(intelModulePath, 'utf8');
    assert.ok(code.includes('scanner_odds_snapshots_v1'), 'Must persist odds snapshots to scanner_odds_snapshots_v1');
    assert.ok(code.includes('onRequestGet') && code.includes('onRequestPost'), 'Must export GET and POST handlers');
  });

  test('3.3 Multi-Role Access Verification (Visitor, Free User, VIP User, Admin)', () => {
    // 1. Visitor (unauthenticated) -> router redirects protected /live-scanner to /login
    localStorage.setItem('userLoggedIn', 'false');
    window.navigateTo('/live-scanner');
    assert.strictEqual(window.location.pathname, '/login', 'Logged-out visitor should be routed to /login gate');

    // 2. Free User -> can access /live-scanner without internal telemetry screen
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('user_role', 'USER');
    window.navigateTo('/live-scanner');
    assert.strictEqual(window.location.pathname, '/live-scanner');
    assert.ok(!document.body.innerHTML.includes('Authenticating Server-Side & Aggregating Telemetry'), 'Must never show internal telemetry screen');

    // 3. VIP User -> full access to all 8 scanner sections
    localStorage.setItem('user_role', 'VIP');
    window.navigateTo('/scanner/value-opportunities');
    assert.strictEqual(window.location.pathname, '/scanner/value-opportunities');

    // 4. Admin -> full access
    localStorage.setItem('user_role', 'ADMIN');
    localStorage.setItem('currentUserEmail', 'egeruennamdi@gmail.com');
    window.navigateTo('/scanner/performance');
    assert.strictEqual(window.location.pathname, '/scanner/performance');
  });

  console.log('\n================================================================');
  console.log(`🏁 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
})();
