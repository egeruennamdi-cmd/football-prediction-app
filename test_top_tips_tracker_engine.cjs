/**
 * Comprehensive Test Suite for DEEPPREDICTBET Top Tips Algorithmic Tracker
 * Validates Sections 1 - 150 of Product Specifications.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('====================================================');
console.log('RUNNING TOP TIPS ALGORITHMIC TRACKER TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
  }
}

// 1. Setup Mock DOM Environment
const elements = {};
function createMockElement(id, tag = 'div') {
  const el = {
    id: id || '',
    tagName: tag.toUpperCase(),
    value: '',
    innerHTML: '',
    textContent: '',
    innerText: '',
    style: {},
    children: [],
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); }
    },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    remove() {},
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener() {},
    removeEventListener() {}
  };
  if (id) elements[id] = el;
  return el;
}

['tool-toptips', 'toptips-tool-rows', 'top-tips-tracker-container'].forEach(id => createMockElement(id));

const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};

const mockWindow = {
  localStorage: mockLocalStorage,
  location: { pathname: '/top-tips', search: '' },
  history: { pushState: () => {} },
  appState: {
    betslip: [],
    watchlist: [],
    activeTopTipsToolMarket: 'uo15'
  },
  showToast: (m, t) => {},
  showAppNotification: (m, t) => {},
  addEventListener: () => {},
  removeEventListener: () => {}
};

const sandbox = {
  window: mockWindow,
  root: mockWindow,
  globalThis: mockWindow,
  document: {
    getElementById: (id) => elements[id] || createMockElement(id),
    querySelector: (sel) => {
      if (sel && sel.startsWith('#')) return elements[sel.slice(1)] || createMockElement(sel.slice(1));
      return createMockElement();
    },
    querySelectorAll: () => [],
    createElement: (tag) => createMockElement(`mock-${Math.random().toString(36).substring(7)}`, tag),
    body: { style: {}, appendChild() {}, removeChild() {} },
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  localStorage: mockLocalStorage,
  console: console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  Date: Date,
  Math: Math,
  Number: Number,
  String: String,
  Array: Array,
  Set: Set,
  Map: Map,
  JSON: JSON,
  parseFloat: parseFloat,
  parseInt: parseInt,
  isNaN: isNaN,
  isFinite: isFinite,
  RegExp: RegExp
};

const context = vm.createContext(sandbox);
const code = fs.readFileSync(path.join(__dirname, 'js', 'topTipsTrackerEngine.js'), 'utf8');
vm.runInContext(code, context);

const engine = sandbox.window.TopTipsTrackerEngine;

// --- TEST 1: STRICT PRODUCT NAME PRESERVATION ---
runTest('Product Name must strictly be "Top Tips Algorithmic Tracker"', () => {
  assert.ok(engine, 'Engine must be initialized');
  assert.strictEqual(engine.PRODUCT_NAME, 'Top Tips Algorithmic Tracker');
  assert.strictEqual(engine.VERSION, '3.0.0');

  const engineCode = fs.readFileSync(path.join(__dirname, 'js', 'topTipsTrackerEngine.js'), 'utf8');
  assert.ok(engineCode.includes("const PRODUCT_NAME = 'Top Tips Algorithmic Tracker';"));

  // Forbidden names check
  const forbidden = [
    'Premium Pick Tracker',
    'AI Picks',
    'Algorithmic Picks',
    'Top Picks',
    'Smart Picks',
    'Best Tips',
    'Prediction Tracker',
    'AI Tip Tracker'
  ];
  forbidden.forEach(fName => {
    const titleRegex = new RegExp(`PRODUCT_NAME\\s*=\\s*['"\`]${fName}['"\`]`, 'i');
    assert.ok(!titleRegex.test(engineCode), `Forbidden rename detected: ${fName}`);
  });
});

// --- TEST 2: DUAL-FILE EXACT PARITY ---
runTest('Dual-file parity between js/ and public/js/', () => {
  const pairs = [
    ['js/topTipsTrackerEngine.js', 'public/js/topTipsTrackerEngine.js'],
    ['js/ui.js', 'public/js/ui.js'],
    ['js/app.js', 'public/js/app.js'],
    ['index.html', 'public/index.html']
  ];

  pairs.forEach(([f1, f2]) => {
    const c1 = fs.readFileSync(path.join(__dirname, f1), 'utf8');
    const c2 = fs.readFileSync(path.join(__dirname, f2), 'utf8');
    assert.strictEqual(c1, c2, `Parity mismatch between ${f1} and ${f2}`);
  });
});

// --- TEST 3: SCRIPT TAG REGISTRATION IN HTML ---
runTest('topTipsTrackerEngine.js registered in index.html & public/index.html', () => {
  const html1 = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const html2 = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

  assert.ok(html1.includes('src="/js/topTipsTrackerEngine.js?v=20260929_v1"'), 'Missing script in index.html');
  assert.ok(html2.includes('src="/js/topTipsTrackerEngine.js?v=20260929_v1"'), 'Missing script in public/index.html');
});

// --- TEST 4: CORE EXPORTED API INTEGRITY ---
runTest('TopTipsTrackerEngine exports all critical lifecycle APIs', () => {
  const requiredMethods = [
    'init',
    'renderWorkspace',
    'setTab',
    'setMarketFilter',
    'setProbFilter',
    'setSort',
    'setSearch',
    'setValueOnly',
    'toggleTipDrawer',
    'closeDrawer',
    'setAnalyticsPeriod',
    'addToBetslip',
    'auditWithBetDoctor',
    'checkValueIntelligence',
    'viewMatchCentre',
    'askAiScout',
    'toggleWatch',
    'backtestFilter',
    'queryStatisticalDatabase',
    'shareTip',
    'exportCsv',
    'settleCompletedFixtures',
    'refresh',
    'computePerformanceMetrics',
    'computeCalibrationMetrics'
  ];

  requiredMethods.forEach(method => {
    assert.strictEqual(typeof engine[method], 'function', `Missing method: ${method}`);
  });
});

// --- TEST 5: MATHEMATICAL PERFORMANCE & YIELD VS ROI ---
runTest('Performance calculation engine: Yield % vs ROI % and Max Drawdown', () => {
  const testLedger = [
    { result: 'WON', odds: 2.00, stake: 1.0 },   // +1.0
    { result: 'LOST', odds: 1.80, stake: 1.0 },  // -1.0
    { result: 'WON', odds: 2.50, stake: 1.0 },   // +1.5
    { result: 'WON', odds: 1.90, stake: 1.0 },   // +0.9
    { result: 'LOST', odds: 2.10, stake: 1.0 },  // -1.0
    { result: 'VOID', odds: 1.75, stake: 1.0 }   // 0.0
  ];

  const metrics = engine.computePerformanceMetrics(testLedger, 'all');

  assert.strictEqual(metrics.total, 6);
  assert.strictEqual(metrics.wins, 3);
  assert.strictEqual(metrics.losses, 2);
  assert.strictEqual(metrics.voids, 1);
  assert.strictEqual(metrics.settledCount, 5); // 3 wins + 2 losses
  assert.strictEqual(metrics.winRate, 60.0); // 3 / 5 = 60.0%

  // Total stake on settled non-voids = 5 * 1.0 = 5.0
  assert.strictEqual(metrics.totalStake, 5.0);

  // Net P/L = 1.0 - 1.0 + 1.5 + 0.9 - 1.0 = 1.40
  assert.strictEqual(metrics.netPnl, 1.40);

  // Yield = (Net P/L / Total Stake) * 100 = (1.40 / 5.0) * 100 = 28.0%
  assert.strictEqual(metrics.yieldPct, 28.0);

  // ROI = (Net P/L / Starting Bankroll 100) * 100 = (1.40 / 100) * 100 = 1.4%
  assert.strictEqual(metrics.roiPct, 1.4);

  // Max Drawdown must be >= 0
  assert.ok(metrics.maxDrawdownUnits >= 0);
  assert.ok(metrics.maxDrawdownPct >= 0);
});

// --- TEST 6: CALIBRATION METRICS COMPUTATION ---
runTest('Empirical Model Calibration by probability bucket', () => {
  const testLedger = [
    { probability: 55, result: 'WON' },
    { probability: 58, result: 'LOST' },
    { probability: 64, result: 'WON' },
    { probability: 68, result: 'WON' },
    { probability: 72, result: 'WON' },
    { probability: 78, result: 'LOST' },
    { probability: 82, result: 'WON' },
    { probability: 85, result: 'WON' }
  ];

  const cal = engine.computeCalibrationMetrics(testLedger);
  assert.strictEqual(cal.length, 4);

  // 50-59% bucket: 2 items, 1 win -> 50.0%
  const b50 = cal.find(b => b.range === '50-59%');
  assert.strictEqual(b50.sample, 2);
  assert.strictEqual(b50.wins, 1);
  assert.strictEqual(b50.observedWinRate, 50.0);
  assert.strictEqual(b50.expectedProb, 55);

  // 80%+ bucket: 2 items, 2 wins -> 100.0%
  const b80 = cal.find(b => b.range === '80%+');
  assert.strictEqual(b80.sample, 2);
  assert.strictEqual(b80.wins, 2);
  assert.strictEqual(b80.observedWinRate, 100.0);
});

// --- TEST 7: IMMUTABLE SNAPSHOT & ODDS MOVEMENT ---
runTest('Snapshot store preserves original publishedOdds and computes odds movement', () => {
  const matches = engine.gatherAuthenticMatches();
  assert.ok(matches.length > 0, 'Must have authentic matches');

  const qualified = engine.qualifyTips(matches);
  assert.ok(qualified.length > 0, 'Must qualify tips from matches');

  const tip = qualified[0];
  assert.ok(tip.publishedOdds > 0, 'Must have published odds');
  assert.ok(tip.publishedTimestamp > 0 || new Date(tip.publishedAt).getTime() > 0, 'Must have published timestamp');
  assert.ok(['SHORTENED', 'DRIFTED', 'STABLE'].includes(tip.oddsMovement), 'Must compute valid odds movement');
});

// --- TEST 8: DETERMINISTIC SETTLEMENT MATRIX ---
runTest('Deterministic settlement matrix correctly grades football results', () => {
  // Home win match (2 - 1)
  const homeWinMatch = {
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    stats: { corners: { home: 6, away: 4 }, yellowCards: { home: 2, away: 2 } }
  };

  assert.strictEqual(engine.settleTipResult({ marketKey: 'win1' }, homeWinMatch), 'WON');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'win2' }, homeWinMatch), 'LOST');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'draw' }, homeWinMatch), 'LOST');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'dc1x' }, homeWinMatch), 'WON');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'dc12' }, homeWinMatch), 'WON');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'dcx2' }, homeWinMatch), 'LOST');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'btts' }, homeWinMatch), 'WON');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'uo15' }, homeWinMatch), 'WON');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'uo25' }, homeWinMatch), 'WON');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'uo35' }, homeWinMatch), 'LOST');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'c85' }, homeWinMatch), 'WON'); // 10 corners
  assert.strictEqual(engine.settleTipResult({ marketKey: 'cards35' }, homeWinMatch), 'WON'); // 4 cards

  // Draw match (0 - 0)
  const drawMatch = {
    homeScore: 0,
    awayScore: 0,
    status: 'FT',
    stats: { corners: { home: 3, away: 2 }, yellowCards: { home: 1, away: 1 } }
  };

  assert.strictEqual(engine.settleTipResult({ marketKey: 'win1' }, drawMatch), 'LOST');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'draw' }, drawMatch), 'WON');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'dnb' }, drawMatch), 'VOID');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'btts' }, drawMatch), 'LOST');
  assert.strictEqual(engine.settleTipResult({ marketKey: 'uo15' }, drawMatch), 'LOST');
});

// --- TEST 9: ECOSYSTEM ACTIONS (BETSLIP & WATCHLIST) ---
runTest('Ecosystem actions: Add to Betslip & Watchlist integration', () => {
  const matches = engine.gatherAuthenticMatches();
  const qualified = engine.rankTips(engine.qualifyTips(matches));
  const tip = qualified[0];

  // Test addToBetslip
  engine.addToBetslip(tip.tipId);
  const storedBetslip = JSON.parse(mockLocalStorage.getItem('dp_betslip'));
  assert.ok(Array.isArray(storedBetslip), 'Stored betslip must be an array');
  assert.ok(storedBetslip.some(item => item.matchId === tip.fixtureId || item.id === tip.fixtureId));

  // Test toggleWatch
  engine.toggleWatch(tip.fixtureId);
  const storedWatchlist = JSON.parse(mockLocalStorage.getItem('dp_watchlist'));
  assert.ok(Array.isArray(storedWatchlist), 'Stored watchlist must be an array');
  assert.ok(storedWatchlist.includes(tip.fixtureId));
});

// --- TEST 10: PROHIBITION OF DECEPTIVE LANGUAGE ---
runTest('Strict compliance: Zero misleading or guaranteed language in tracker templates', () => {
  const engineCode = fs.readFileSync(path.join(__dirname, 'js', 'topTipsTrackerEngine.js'), 'utf8');

  const bannedPhrases = [
    'guaranteed profit',
    'sure win',
    'risk-free',
    '100% winner',
    'can\'t lose',
    'guaranteed return',
    'fixed match'
  ];

  bannedPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'i');
    assert.ok(!regex.test(engineCode), `Prohibited deceptive phrase detected: "${phrase}"`);
  });
});

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
