/**
 * DEEPPREDICTBET — COMPREHENSIVE VERIFICATION & REGRESSION TEST SUITE
 * AI-Powered Intelligent Market Rotation Engine (Sections 1–13)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

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

(function runSuite() {
  console.log('\n====================================================================');
  console.log('🧪 DEEPPREDICTBET — AI INTELLIGENT MARKET ROTATION ENGINE TEST SUITE');
  console.log('====================================================================\n');

  // 1. Setup JSDOM Environment with full index.html and platform intelligence modules
  const htmlContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const dom = new JSDOM(htmlContent, {
    url: 'https://deeppredictbet.com/generator',
    pretendToBeVisual: true
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage;
  global.sessionStorage = dom.window.sessionStorage;
  global.history = dom.window.history;
  global.location = dom.window.location;
  global.CustomEvent = dom.window.CustomEvent;

  // Authenticate test user as VIP so quota does not block large multi-batch tests
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('currentUserEmail', 'vip.tester@deeppredictbet.com');
  localStorage.setItem('currentUsername', 'VipAnalyst');
  localStorage.setItem('user_role', 'VIP');

  // Load existing intelligence engines & UI/App controllers in JSDOM
  const scriptsToLoad = [
    'js/data.js',
    'js/valueIntelligenceEngine.js',
    'js/matchMarketIntelligenceEngine.js',
    'js/intelligentMarketRotationEngine.js',
    'js/ui.js',
    'js/app.js'
  ];

  for (const relPath of scriptsToLoad) {
    const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    dom.window.eval(code);
  }

  const IMRE = window.IntelligentMarketRotationEngine;
  assert.ok(IMRE, 'IntelligentMarketRotationEngine must be loaded on window');

  // ---------------------------------------------------------------------------
  // GROUP 1: DOM & UI Controls Verification (Section 1 & Section 10)
  // ---------------------------------------------------------------------------
  console.log('--- Group 1: Bet Generator UI & Flexible Quantity Input (Section 1) ---');

  test('1.1 AI MARKET ROTATION button is clearly visible in Bet Generator (#tool-machine)', () => {
    const btn = document.getElementById('btn-ai-market-rotation');
    assert.ok(btn, '#btn-ai-market-rotation must exist in Bet Generator');
    assert.ok(btn.textContent.includes('AI MARKET ROTATION'), 'Button must be labelled AI MARKET ROTATION');
  });

  test('1.2 Flexible numerical input (#machine-match-count) replaces hardcoded 10/20/30/40 select dropdown', () => {
    const countInput = document.getElementById('machine-match-count');
    assert.ok(countInput, '#machine-match-count must exist');
    assert.strictEqual(countInput.tagName.toLowerCase(), 'input', '#machine-match-count must be a flexible <input>, not a restricted <select>');
    assert.strictEqual(countInput.getAttribute('type'), 'number', 'Input type must be number');
  });

  test('1.3 Quantity Validator accepts any positive whole number and rejects 0, negative, decimal, and non-numeric inputs', () => {
    const validQuantities = [1, 5, 7, 13, 15, 25, 37, 50, 75, 100];
    for (const q of validQuantities) {
      const res = IMRE.validateFixtureQuantity(q, 100);
      assert.strictEqual(res.valid, true, `Quantity ${q} should be valid`);
      assert.strictEqual(res.effectiveQuantity, q, `Effective quantity for ${q} should be ${q}`);
    }

    const invalidInputs = [0, -5, 4.5, '7.2', 'abc', '', null];
    for (const bad of invalidInputs) {
      const res = IMRE.validateFixtureQuantity(bad, 100);
      assert.strictEqual(res.valid, false, `Invalid input "${bad}" must be rejected`);
      assert.ok(res.error && res.error.length > 10, 'Must provide a clear validation error message');
    }

    // Requesting more than available fixtures caps gracefully and communicates warning
    const capped = IMRE.validateFixtureQuantity(18, 11);
    assert.strictEqual(capped.valid, true);
    assert.strictEqual(capped.cappedByAvailability, true);
    assert.strictEqual(capped.effectiveQuantity, 11);
    assert.ok(capped.warning.includes('only 11 eligible'), 'Must communicate exact available fixture count');
  });

  // ---------------------------------------------------------------------------
  // GROUP 2: Intelligence Reuse, Market Availability & EV Math (Sections 2 & 3)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 2: Intelligence Reuse, Market Availability & EV Evaluation (Sections 2 & 3) ---');

  test('2.1 Reuses AI Scout, MatchMarketIntelligenceEngine (Poisson-DC), and ValueIntelligenceEngine.math without duplication', () => {
    const testFixture = {
      id: 'fx_test_ars_che',
      homeTeam: { name: 'Arsenal', form: ['W', 'W', 'W', 'D', 'W'] },
      awayTeam: { name: 'Chelsea', form: ['W', 'D', 'L', 'W', 'L'] },
      league: 'Premier League',
      time: '20 Dec 2026, 17:30',
      predictions: { home: 64, draw: 20, away: 16 }
    };

    const evalRes = IMRE.evaluateFixtureMarkets(testFixture);
    assert.strictEqual(evalRes.fixtureValid, true);
    assert.ok(evalRes.candidates.length >= 60, `Expected >= 60 unique canonical markets evaluated, got ${evalRes.candidates.length}`);

    // Verify every candidate has exact ValueIntelligenceEngine math fields
    for (const c of evalRes.candidates) {
      assert.ok(c.canonicalMarketId.startsWith('MKT_'), `Canonical market ID must start with MKT_: ${c.canonicalMarketId}`);
      assert.ok(c.odds > 1.01, 'Odds must be > 1.01');
      assert.ok(c.modelProbability > 0 && c.modelProbability < 100, 'Model probability must be in (0, 100)');
      const expectedImplied = parseFloat((100 / c.odds).toFixed(1));
      assert.strictEqual(c.impliedProbability, expectedImplied, 'Implied probability must match ValueIntelligenceEngine 1/odds formula');
      const expectedFair = parseFloat((100 / c.modelProbability).toFixed(2));
      assert.ok(Math.abs(c.fairOdds - expectedFair) <= 0.05, 'Fair odds must match 1/modelProb');
      assert.ok(['POSITIVE_EV', 'STATISTICALLY_SUITABLE', 'INSUFFICIENT_DATA'].includes(c.selectionClassification));
    }
  });

  test('2.2 Excludes unavailable, suspended, invalid-odds, and stale-odds markets', () => {
    const fixtureWithBadMarkets = {
      id: 'fx_bad_mkts',
      homeTeam: { name: 'Liverpool', form: ['W', 'W', 'D', 'W', 'W'] },
      awayTeam: { name: 'Everton', form: ['L', 'D', 'L', 'W', 'L'] },
      league: 'Premier League',
      time: '22 Dec 2026, 20:00',
      customMarkets: [
        { id: 'win1', tip: '1X2: Home Win (1)', odds: 1.45, confidence: 72, available: true },
        { id: 'uo25', tip: 'Over 2.5 Goals', odds: 1.85, confidence: 64, suspended: true }, // Suspended -> exclude
        { id: 'btts', tip: 'BTTS Yes', odds: 1.78, confidence: 61, available: false },      // Unavailable -> exclude
        { id: 'dnb', tip: 'Draw No Bet', odds: 0.95, confidence: 80, available: true },     // Invalid odds <= 1.0 -> exclude
        { id: 'dc1x', tip: 'Double Chance 1X', odds: 1.22, confidence: 85, isStale: true }, // Stale odds -> exclude
        { id: 'c85', tip: 'Total Corners: 8.5', odds: 1.75, confidence: 70, oddsTimestamp: Date.now() - (12 * 3600 * 1000) } // 12h old stale -> exclude
      ]
    };

    const evalRes = IMRE.evaluateFixtureMarkets(fixtureWithBadMarkets, { includeExtendedMarkets: false });
    assert.strictEqual(evalRes.candidates.length, 1, 'Only the 1 valid, available, current market should remain');
    assert.strictEqual(evalRes.candidates[0].canonicalMarketId, 'MKT_1X2_FT');
    assert.strictEqual(evalRes.excludedCount, 5, 'All 5 invalid/suspended/stale markets must be excluded');
  });

  // ---------------------------------------------------------------------------
  // GROUP 3: Canonical Market Uniqueness Across Batch Quantities (Sections 1, 4 & 11)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 3: Canonical Market Uniqueness Across Batch Sizes (5, 7, 15, 25, 50, 75, 100) ---');

  test('3.1 Different outcomes of the same market type share a single canonicalMarketId (e.g. Home Win vs Away Win, BTTS Yes vs No)', () => {
    const m1 = IMRE.resolveCanonicalMarketMeta('1X2: Home Win (1)');
    const m2 = IMRE.resolveCanonicalMarketMeta('1X2: Away Win (2)');
    const m3 = IMRE.resolveCanonicalMarketMeta('1X2: Draw (X)');
    assert.strictEqual(m1.canonicalMarketId, 'MKT_1X2_FT');
    assert.strictEqual(m2.canonicalMarketId, 'MKT_1X2_FT');
    assert.strictEqual(m3.canonicalMarketId, 'MKT_1X2_FT');

    const b1 = IMRE.resolveCanonicalMarketMeta('BTTS / GG (Both Score)');
    const b2 = IMRE.resolveCanonicalMarketMeta('BTTS No / NG');
    assert.strictEqual(b1.canonicalMarketId, 'MKT_BTTS_FT');
    assert.strictEqual(b2.canonicalMarketId, 'MKT_BTTS_FT');

    const o1 = IMRE.resolveCanonicalMarketMeta('Over 2.5 Goals');
    const o2 = IMRE.resolveCanonicalMarketMeta('Under 2.5 Goals');
    assert.strictEqual(o1.canonicalMarketId, 'MKT_OU_25_FT');
    assert.strictEqual(o2.canonicalMarketId, 'MKT_OU_25_FT');
  });

  test('3.2 Flexible Batch Quantities (5, 7, 15, 25, 50, 75, 100) allocate 100% unique canonicalMarketIds with zero duplicates', () => {
    const batchQuantities = [5, 7, 15, 25, 50, 75, 100];

    for (const qty of batchQuantities) {
      window.appState.betslip = [];
      const countInput = document.getElementById('machine-match-count');
      countInput.value = String(qty);

      const res = IMRE.rotateMarkets({ quantity: qty, preserveFixtures: false });
      assert.strictEqual(res.success, true, `Rotation for quantity ${qty} failed`);
      assert.strictEqual(res.selections.length, qty, `Expected ${qty} allocated fixtures, got ${res.selections.length}`);

      const marketIds = res.selections.map(s => s.marketId);
      const uniqueMarketIds = new Set(marketIds);
      assert.strictEqual(
        uniqueMarketIds.size,
        qty,
        `Batch of ${qty} fixtures must have ${qty} unique canonical marketIds, got ${uniqueMarketIds.size}`
      );
    }
  });

  test('3.3 Repeated clicks of AI MARKET ROTATION produce new distinct market allocations where alternatives exist', () => {
    window.appState.betslip = [];
    const rot1 = IMRE.rotateMarkets({ quantity: 7, preserveFixtures: false });
    const sig1 = rot1.selections.map(s => `${s.fixtureId}:${s.marketId}`).join('|');

    const rot2 = IMRE.rotateMarkets({ quantity: 7, preserveFixtures: true });
    const sig2 = rot2.selections.map(s => `${s.fixtureId}:${s.marketId}`).join('|');

    const rot3 = IMRE.rotateMarkets({ quantity: 7, preserveFixtures: true });
    const sig3 = rot3.selections.map(s => `${s.fixtureId}:${s.marketId}`).join('|');

    assert.notStrictEqual(sig1, sig2, 'Click 2 of AI MARKET ROTATION must produce a different allocation than Click 1');
    assert.notStrictEqual(sig2, sig3, 'Click 3 of AI MARKET ROTATION must produce a different allocation than Click 2');

    // Verify uniqueness is preserved on every click
    assert.strictEqual(new Set(rot2.selections.map(s => s.marketId)).size, 7);
    assert.strictEqual(new Set(rot3.selections.map(s => s.marketId)).size, 7);
  });

  // ---------------------------------------------------------------------------
  // GROUP 4: Manual Selection Protection & Shortage Handling (Sections 4.7 & 5)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 4: Manual Selection Protection & Market Shortage Handling (Sections 4 & 5) ---');

  test('4.1 Manual Selection Protection: MANUAL selections remain 100% untouched across multiple AI MARKET ROTATION clicks', () => {
    window.appState.betslip = [];
    const initial = IMRE.rotateMarkets({ quantity: 6, preserveFixtures: false });
    assert.strictEqual(initial.selections.length, 6);

    // Manually lock fixture #0 to Over 2.5 Goals (MKT_OU_25_FT) and fixture #2 to BTTS (MKT_BTTS_FT)
    const fid0 = initial.selections[0].fixtureId;
    const fid2 = initial.selections[2].fixtureId;

    IMRE.setManualMarketForFixture(fid0, 'uo25', 'Over 2.5 Goals', 1.88);
    IMRE.setManualMarketForFixture(fid2, 'btts', 'BTTS / GG (Both Score)', 1.76);

    // Rotate 3 times and verify both manual picks are untouched and no auto pick uses MKT_OU_25_FT or MKT_BTTS_FT
    for (let click = 1; click <= 3; click++) {
      const rotated = IMRE.rotateMarkets({ quantity: 6, preserveFixtures: true });
      const sel0 = rotated.selections.find(s => s.fixtureId === fid0);
      const sel2 = rotated.selections.find(s => s.fixtureId === fid2);

      assert.strictEqual(sel0.selectionOrigin, 'MANUAL');
      assert.strictEqual(sel0.marketId, 'MKT_OU_25_FT');
      assert.strictEqual(sel0.tip, 'Over 2.5 Goals');
      assert.strictEqual(sel0.odds, 1.88);

      assert.strictEqual(sel2.selectionOrigin, 'MANUAL');
      assert.strictEqual(sel2.marketId, 'MKT_BTTS_FT');
      assert.strictEqual(sel2.tip, 'BTTS / GG (Both Score)');
      assert.strictEqual(sel2.odds, 1.76);

      // Verify all 4 automatic selections have unique markets different from MKT_OU_25_FT and MKT_BTTS_FT
      const autoSels = rotated.selections.filter(s => s.selectionOrigin === 'AUTOMATIC');
      assert.strictEqual(autoSels.length, 4);
      for (const a of autoSels) {
        assert.notStrictEqual(a.marketId, 'MKT_OU_25_FT', 'Auto selection must not collide with manual MKT_OU_25_FT');
        assert.notStrictEqual(a.marketId, 'MKT_BTTS_FT', 'Auto selection must not collide with manual MKT_BTTS_FT');
      }
      assert.strictEqual(new Set(rotated.selections.map(s => s.marketId)).size, 6);
    }

    // Unlock fixture #0 back to AUTOMATIC and verify it rotates on next click
    const unlocked = IMRE.toggleManualLock(fid0);
    assert.strictEqual(unlocked.selectionOrigin, 'AUTOMATIC');
  });

  test('4.2 Insufficient Unique Eligible Markets: Reports shortage clearly and never duplicates or invents markets', () => {
    window.appState.betslip = [];
    // Allow only 3 unique canonical markets for a request of 7 fixtures
    const res = IMRE.rotateMarkets({
      quantity: 7,
      preserveFixtures: false,
      allowedCanonicalMarketIds: ['MKT_1X2_FT', 'MKT_OU_25_FT', 'MKT_BTTS_FT']
    });

    assert.strictEqual(res.selections.length, 3, 'Must allocate only the 3 unique available markets, never duplicating');
    assert.strictEqual(new Set(res.selections.map(s => s.marketId)).size, 3);
    assert.ok(res.shortageReport && res.shortageReport.hasShortage, 'Must produce a shortageReport');
    assert.strictEqual(res.shortageReport.requestedFixturesCount, 7);
    assert.strictEqual(res.shortageReport.allocatedFixturesCount, 3);
    assert.strictEqual(res.shortageReport.unallocatedCount, 4);

    const bannerHtml = document.getElementById('imre-shortage-warning-banner').innerHTML;
    assert.ok(bannerHtml.includes('Allocated 3 of 7 requested fixtures'), 'Shortage banner must explain the shortage in DOM');
  });

  // ---------------------------------------------------------------------------
  // GROUP 5: 3-Way Authoritative Synchronization (Bet Generator <-> Active Betslip <-> Bet Doctor)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 5: 3-Way Authoritative Synchronization (Bet Generator <-> Active Betslip <-> Bet Doctor) ---');

  test('5.1 Rotating markets immediately synchronizes Active Betslip Builder and recalculates Total Combined Odds', () => {
    window.appState.betslip = [];
    const rot = IMRE.rotateMarkets({ quantity: 5, preserveFixtures: false });
    assert.strictEqual(window.appState.betslip.length, 5);

    // Check exact product of decimal odds
    const expectedProduct = window.appState.betslip.reduce((acc, s) => acc * s.odds, 1.0);
    const expectedFormatted = `@${expectedProduct.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const badgeText = document.getElementById('betslip-count-badge').textContent.trim();
    const slipTotalText = document.getElementById('betslip-total-odds-val').textContent.trim();
    const genTotalText = document.getElementById('ticket-total-odds').textContent.trim();

    assert.strictEqual(badgeText, '5', 'Active Betslip Builder count badge must be 5');
    assert.strictEqual(slipTotalText, expectedFormatted, `Betslip total odds (${slipTotalText}) must match ${expectedFormatted}`);
    assert.strictEqual(genTotalText, expectedFormatted, `Bet Generator total odds (${genTotalText}) must match ${expectedFormatted}`);
  });

  test('5.2 Bet Doctor audits latest rotated betslip and applies unique-market prescriptions while protecting MANUAL selections', () => {
    window.appState.betslip = [];
    const rot = IMRE.rotateMarkets({ quantity: 4, preserveFixtures: false });
    assert.strictEqual(rot.selections.length, 4);

    // Set leg #0 as a MANUAL selection with high odds (2.80) -> must be protected from bulk prescription override
    const manualFid = window.appState.betslip[0].fixtureId;
    window.appState.betslip[0].selectionOrigin = 'MANUAL';
    window.appState.betslip[0].locked = true;
    window.appState.betslip[0].tip = 'Exact Goals: 3 Goals';
    window.appState.betslip[0].selectedOutcome = 'Exact Goals: 3 Goals';
    window.appState.betslip[0].marketId = 'MKT_EXACT_GOALS_FT';
    window.appState.betslip[0].odds = 2.80;

    // Set leg #1 as an AUTOMATIC selection with high-risk trap odds (2.95) -> should receive a unique prescription
    const autoTrapFid = window.appState.betslip[1].fixtureId;
    window.appState.betslip[1].selectionOrigin = 'AUTOMATIC';
    window.appState.betslip[1].locked = false;
    window.appState.betslip[1].tip = '1X2: Away Win (2)';
    window.appState.betslip[1].selectedOutcome = '1X2: Away Win (2)';
    window.appState.betslip[1].marketId = 'MKT_1X2_FT';
    window.appState.betslip[1].odds = 2.95;

    // Run Bet Doctor audit on active betslip synchronously
    window.doctorState = { isExample: false, sourceType: 'betslip', isOptimized: false };
    const codeInput = document.getElementById('bet-doctor-input-code');
    if (codeInput) codeInput.value = 'ACTIVE-BETSLIP';
    window.runBetDoctorAudit(false, 'betslip');

    assert.ok(Array.isArray(window.doctorState.auditedSelections), 'Bet Doctor must populate auditedSelections');
    assert.strictEqual(window.doctorState.auditedSelections.length, 4, 'Bet Doctor must audit all 4 active betslip selections');

    // Apply Bet Doctor prescriptions
    window.applyDoctorPrescription();

    // Verify leg #0 (MANUAL) was protected and NOT overwritten
    const afterManualLeg = window.appState.betslip.find(s => s.fixtureId === manualFid);
    assert.strictEqual(afterManualLeg.tip, 'Exact Goals: 3 Goals', 'MANUAL selection must be protected when Bet Doctor applies prescriptions');
    assert.strictEqual(afterManualLeg.odds, 2.80);

    // Verify leg #1 (AUTOMATIC trap) was updated with a prescribed safer market
    const afterAutoLeg = window.appState.betslip.find(s => s.fixtureId === autoTrapFid);
    assert.strictEqual(afterAutoLeg.isPrescribed, true, 'AUTOMATIC trap selection should be prescribed by Bet Doctor');
    assert.ok(afterAutoLeg.odds < 2.95, 'Prescribed market odds should be safer/lower than 2.95 trap odds');

    // Verify all 4 active betslip selections still have 100% unique canonical marketIds!
    const allMarketIdsAfterPrescription = window.appState.betslip.map(s => s.marketId);
    assert.strictEqual(new Set(allMarketIdsAfterPrescription).size, 4, 'Bet Doctor prescription must respect canonical market uniqueness across the betslip');

    // Verify Active Betslip Builder and Bet Generator total odds are synchronized after prescription
    const recalc = window.calculateBetslipTotalOdds(window.appState.betslip);
    assert.strictEqual(document.getElementById('betslip-total-odds-val').textContent.trim(), recalc.formatted);
    assert.strictEqual(document.getElementById('ticket-total-odds').textContent.trim(), recalc.formatted);
  });

  // ---------------------------------------------------------------------------
  // GROUP 6: Performance & Non-Regression Benchmark (Section 13.E)
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 6: Performance & Large Batch Execution Benchmark (Section 13.E) ---');

  test('6.1 100-Fixture Unique Market Allocation Algorithm (< 250ms) & Full 3-Way JSDOM Sync', () => {
    window.appState.betslip = [];
    const pool100 = IMRE.getEligibleFixturesPool().slice(0, 100);

    // Benchmark 1: Pure 100-fixture unique market allocation algorithm
    const tAlloc0 = Date.now();
    const allocRes = IMRE.allocateUniqueMarketsToBatch(pool100);
    const allocMs = Date.now() - tAlloc0;
    assert.strictEqual(allocRes.success, true);
    assert.strictEqual(allocRes.selections.length, 100);
    assert.strictEqual(new Set(allocRes.selections.map(s => s.marketId)).size, 100);
    assert.ok(allocMs < 250, `100-fixture unique allocation algorithm must complete in < 250ms, took ${allocMs}ms`);

    // Benchmark 2: Full 100-fixture 3-way JSDOM parse & render synchronization
    const tSync0 = Date.now();
    const res = IMRE.rotateMarkets({ quantity: 100, preserveFixtures: false });
    const totalSyncMs = Date.now() - tSync0;

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.selections.length, 100);
    assert.strictEqual(new Set(res.selections.map(s => s.marketId)).size, 100);
    assert.ok(totalSyncMs < 2200, `100-fixture full JSDOM sync should complete cleanly, took ${totalSyncMs}ms`);
    console.log(`     ⚡ 100-fixture allocation algorithm: ${allocMs}ms | Full JSDOM 3-way render sync: ${totalSyncMs}ms`);
  });

  console.log('\n====================================================================');
  console.log(`🏁 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================================\n');

  process.exit(failed > 0 ? 1 : 0);
})();
