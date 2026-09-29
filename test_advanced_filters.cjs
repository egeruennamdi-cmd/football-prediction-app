/**
 * DEEPPREDICTBET: ADVANCED STATISTICAL DATABASE FILTERS TEST SUITE
 * Comprehensive verification of research, query, patterns, multi-tab workspace,
 * data integrity, and workflow integrations.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: ADVANCED STATISTICAL DATABASE FILTERS TEST SUITE');
console.log('================================================================\n');

// 1. Setup DOM Mock Environment
const elements = {};
function createMockElement(id, tag = 'div') {
  const el = {
    id: id || '',
    tagName: tag.toUpperCase(),
    value: '',
    innerHTML: '',
    textContent: '',
    style: {},
    children: [],
    options: [{ value: 'all', text: 'All Leagues' }],
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
      if (child.innerHTML) this.innerHTML += child.innerHTML;
      return child;
    },
    remove() {},
    scrollIntoView() {},
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {}
  };
  if (id) elements[id] = el;
  return el;
}

// Create all required tool-filters DOM elements
[
  'tool-filters', 'filter-output-container', 'btn-apply-filters',
  'filt-market-select', 'filt-submarket-select', 'filt-league-select',
  'filt-win-slider', 'filt-win-val', 'filt-conf-slider', 'filt-conf-val',
  'filt-odds-min', 'filt-odds-max', 'filt-form-slider', 'filt-form-val',
  'filt-avg-goals-scored', 'filt-avg-goals-conceded', 'filt-xg-min', 'filt-corners-min',
  'filt-form-window', 'filt-compound-operator', 'filt-home-win-pct', 'filt-away-loss-pct',
  'floating-betslip-drawer', 'betslip-count-badge', 'betslip-header-odds',
  'betslip-total-odds-val'
].forEach(id => createMockElement(id));

elements['filt-market-select'].value = 'all';
elements['filt-submarket-select'].value = 'any';
elements['filt-league-select'].value = 'all';
elements['filt-win-slider'].value = '40';
elements['filt-conf-slider'].value = '60';
elements['filt-odds-min'].value = '1.10';
elements['filt-odds-max'].value = '6.00';
elements['filt-form-slider'].value = '40';
elements['filt-avg-goals-scored'].value = '1.0';
elements['filt-avg-goals-conceded'].value = '2.0';
elements['filt-xg-min'].value = '0.5';
elements['filt-corners-min'].value = '6.0';
elements['filt-form-window'].value = 'last10';
elements['filt-compound-operator'].value = 'AND';
elements['filt-home-win-pct'].value = '0';
elements['filt-away-loss-pct'].value = '0';

const mockStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; }
};

let toastCount = 0;
let lastToast = null;
let lastAiScoutPrompt = null;
let lastBacktestQuery = null;
let lastDoctorAuditCall = false;

const mockWindow = {
  appState: { betslip: [] },
  doctorState: {},
  location: { hostname: 'localhost', pathname: '/tools/filters', hash: '' },
  showToast(msg, type) { toastCount++; lastToast = { msg, type }; },
  showAppNotification(msg, type) { toastCount++; lastToast = { msg, type }; },
  alert(msg) { console.log('ALERT:', msg); },
  triggerToolRoute(toolId) {
    if (toolId === 'backtester') lastBacktestQuery = true;
    if (toolId === 'doctor') lastDoctorAuditCall = true;
  },
  openScoutModal() {},
  sendScoutMessage(msg) { lastAiScoutPrompt = msg; },
  addMatchCardToBetslip(matchId) {
    mockWindow.appState.betslip.push({ id: matchId, selection: 'Mock Pick', odds: 1.85 });
  },
  addEventListener() {},
  removeEventListener() {}
};

const sandbox = {
  window: mockWindow,
  document: {
    getElementById: (id) => elements[id] || createMockElement(id),
    querySelector: (sel) => {
      if (sel && sel.startsWith('#')) return elements[sel.slice(1)] || createMockElement(sel.slice(1));
      return createMockElement();
    },
    querySelectorAll: () => [],
    createElement: (tag) => createMockElement(`mock-${Math.random().toString(36).substring(7)}`, tag),
    body: { style: {}, appendChild() {}, removeChild() {} },
    addEventListener() {},
    removeEventListener() {},
    readyState: 'complete'
  },
  localStorage: mockStorage,
  console: console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
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
  RegExp: RegExp,
  showToast: (m, t) => mockWindow.showToast(m, t),
  showAppNotification: (m, t) => mockWindow.showAppNotification(m, t)
};
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.window.document = sandbox.document;
sandbox.window.window = sandbox.window;
sandbox.window.localStorage = mockStorage;
sandbox.self = sandbox.window;

const ctx = vm.createContext(sandbox);

// Load data.js
const dataCode = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');
vm.runInContext(dataCode, ctx);

// Load advancedFiltersEngine.js
const afeCode = fs.readFileSync(path.join(__dirname, 'js/advancedFiltersEngine.js'), 'utf8');
vm.runInContext(afeCode, ctx);

const engine = sandbox.AdvancedFiltersEngine || sandbox.window.AdvancedFiltersEngine;
assert(engine, 'AdvancedFiltersEngine must be mounted to sandbox window');

console.log('✅ AdvancedFiltersEngine and data.js loaded in sandboxed runtime.\n');

// --- Test 1: Product Name & Identity Preservation ---
console.log('--- Test 1: Product Name & Identity Preservation ---');
assert.strictEqual(
  engine.PRODUCT_NAME,
  'Advanced Statistical Database Filters',
  'Product name MUST be strictly "Advanced Statistical Database Filters"'
);
console.log('  ✅ Product Name strictly preserved:', engine.PRODUCT_NAME);
console.log('  ✅ Engine Version:', engine.version);

// --- Test 2: Dual File Sync Test ---
console.log('\n--- Test 2: Dual-File Synchronization ---');
const enginePath = path.join(__dirname, 'js', 'advancedFiltersEngine.js');
const publicEnginePath = path.join(__dirname, 'public', 'js', 'advancedFiltersEngine.js');
const engineContent = fs.readFileSync(enginePath, 'utf8');
const publicEngineContent = fs.readFileSync(publicEnginePath, 'utf8');
assert.strictEqual(engineContent, publicEngineContent, 'js/ and public/js/ advancedFiltersEngine.js must match identically');

const uiContent = fs.readFileSync(path.join(__dirname, 'js', 'ui.js'), 'utf8');
const publicUiContent = fs.readFileSync(path.join(__dirname, 'public', 'js', 'ui.js'), 'utf8');
assert.strictEqual(uiContent, publicUiContent, 'js/ and public/js/ ui.js must match identically');
console.log('  ✅ advancedFiltersEngine.js and ui.js are in exact sync between root and public');

// --- Test 3: HTML 12 Existing Controls & Presets ---
console.log('\n--- Test 3: HTML 12 Existing Controls Verification ---');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const publicHtmlContent = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

const requiredControls = [
  'filt-market-select',
  'filt-submarket-select',
  'filt-league-select',
  'filt-win-slider',
  'filt-conf-slider',
  'filt-odds-min',
  'filt-odds-max',
  'filt-form-slider',
  'filt-avg-goals-scored',
  'filt-avg-goals-conceded',
  'filt-xg-min',
  'filt-corners-min'
];

requiredControls.forEach(ctrlId => {
  assert(htmlContent.includes(`id="${ctrlId}"`), `index.html must contain control #${ctrlId}`);
  assert(publicHtmlContent.includes(`id="${ctrlId}"`), `public/index.html must contain control #${ctrlId}`);
});
console.log('  ✅ All 12 required filter controls verified in both index.html and public/index.html');

// --- Test 4: Advanced Parameters Controls ---
console.log('\n--- Test 4: Advanced Parameters Controls ---');
const advancedControls = [
  'filt-form-window',
  'filt-compound-operator',
  'filt-home-win-pct',
  'filt-away-loss-pct'
];
advancedControls.forEach(ctrlId => {
  assert(htmlContent.includes(`id="${ctrlId}"`), `index.html must contain advanced control #${ctrlId}`);
  assert(publicHtmlContent.includes(`id="${ctrlId}"`), `public/index.html must contain advanced control #${ctrlId}`);
});
console.log('  ✅ Advanced statistical controls verified (Form Window, Compound Operator, Home/Away Splits)');

// --- Test 5: Research Presets Verification ---
console.log('\n--- Test 5: Research Presets Verification ---');
const expectedPresets = [
  'high-over25',
  'high-btts',
  'home-dominance',
  'away-scoring',
  'high-corners',
  'high-goals-env',
  'value-research',
  'form-reversal'
];

assert(engine.presets, 'Engine must expose presets dictionary');
expectedPresets.forEach(presetKey => {
  assert(engine.presets[presetKey], `Preset ${presetKey} must be defined`);
  assert(engine.presets[presetKey].label, `Preset ${presetKey} must have a label`);
  assert(engine.presets[presetKey].filters, `Preset ${presetKey} must have filters object`);
});
console.log(`  ✅ All ${expectedPresets.length} research presets are configured with statistical conditions`);

// --- Test 6: Dynamic League Count Check ---
console.log('\n--- Test 6: Dynamic League Count Registry Check ---');
assert(!htmlContent.includes('All Leagues (96)'), 'index.html must NOT contain hardcoded "All Leagues (96)"');
assert(!publicHtmlContent.includes('All Leagues (96)'), 'public/index.html must NOT contain hardcoded "All Leagues (96)"');
assert(!engineContent.includes('All Leagues (96)'), 'advancedFiltersEngine.js must NOT contain hardcoded "All Leagues (96)"');
console.log('  ✅ Verified dynamic league count derivation with zero hardcoded "(96)" occurrences');

// --- Test 7: Statistical Query Execution on Real Data ---
console.log('\n--- Test 7: Real Data Query Execution & Workspace Generation ---');
engine.init();
const results = engine.getResults();

assert(results, 'engine.getResults() must return valid results');
assert(Array.isArray(results.matches), 'results.matches must be an array');
assert(Array.isArray(results.teams), 'results.teams must be an array');
assert(Array.isArray(results.patterns), 'results.patterns must be an array');
assert(results.matrix, 'results.matrix must be populated');
assert(results.historicalMetrics, 'results.historicalMetrics must be populated');

console.log(`  ✅ Real Matches evaluated: ${results.matches.length}`);
console.log(`  ✅ Real Qualified Teams: ${results.teams.length}`);
console.log(`  ✅ Discovered Patterns: ${results.patterns.length}`);
console.log(`  ✅ Historical Baseline Hit Rate: ${results.historicalMetrics.hitRate} (Sample Size: ${results.historicalMetrics.sampleSize})`);
console.log(`  ✅ Historical Outcome Matrix: Home Win ${results.matrix.homeWin.rate}, Draw ${results.matrix.draw.rate}, Over 2.5 ${results.matrix.over25.rate}`);

// --- Test 8: Preset Application & State Synchronization ---
console.log('\n--- Test 8: Preset Application & State Synchronization ---');
engine.applyPreset('high-over25');
assert.strictEqual(engine.state.filters.market, 'overunder', 'high-over25 must set market to overunder');
assert.strictEqual(engine.state.filters.submarket, 'uo25', 'high-over25 must set submarket to uo25');
assert.strictEqual(engine.state.filters.minGoalsScored, 1.5, 'high-over25 must set minGoalsScored to 1.5');
console.log('  ✅ high-over25 preset successfully applied to internal state and inputs');

// --- Test 9: Multi-Tab Switching & Workspace HTML Output ---
console.log('\n--- Test 9: Multi-Tab Switching & Workspace HTML Output ---');
const container = elements['filter-output-container'];
assert(container.innerHTML.length > 0, 'filter-output-container must have rendered workspace content');

engine.setTab('teams');
assert.strictEqual(engine.state.activeTab, 'teams');
assert(container.innerHTML.includes('Qualified Teams'), 'HTML must render Teams view');

engine.setTab('patterns');
assert.strictEqual(engine.state.activeTab, 'patterns');
assert(container.innerHTML.includes('Discovered Patterns'), 'HTML must render Patterns view');

engine.setTab('historical');
assert.strictEqual(engine.state.activeTab, 'historical');
assert(container.innerHTML.includes('Historical Outcome Distribution'), 'HTML must render Historical Matrix view');

engine.setTab('matches');
assert.strictEqual(engine.state.activeTab, 'matches');
assert(container.innerHTML.includes('Matching Fixtures'), 'HTML must render Matches view');
console.log('  ✅ All 4 workspace tabs (Matches, Teams, Patterns, Historical) render content dynamically');

// --- Test 10: Reset Defaults Verification ---
console.log('\n--- Test 10: Reset Defaults Verification ---');
engine.reset();
assert.strictEqual(engine.state.filters.market, 'all', 'Market reset to "all"');
assert.strictEqual(engine.state.filters.minWin, 40, 'Min win reset to 40');
assert.strictEqual(engine.state.filters.minOdds, 1.10, 'Min odds reset to 1.10');
assert.strictEqual(engine.state.filters.maxOdds, 6.00, 'Max odds reset to 6.00');
assert.strictEqual(engine.state.filters.formWindow, 'last10', 'Form window reset to "last10"');
console.log('  ✅ Reset defaults restored all parameters cleanly');

// --- Test 11: Workflow Integrations ---
console.log('\n--- Test 11: Workflow Integrations (Betslip, Doctor, Scout, Backtester) ---');
// 11a: Add to Betslip
const testMatchId = results.matches.length > 0 ? results.matches[0].id : 'test_match_1';
engine.addToBetslip(testMatchId, 'Home Win', 1.85);
assert(mockWindow.appState.betslip.length > 0, 'Match selection must be added to appState.betslip');
console.log(`  ✅ Add to Betslip integration confirmed (Betslip items: ${mockWindow.appState.betslip.length})`);

// 11b: Bet Doctor Audit
engine.auditWithBetDoctor(testMatchId);
assert(lastDoctorAuditCall, 'Bet Doctor audit route must be triggered');
console.log('  ✅ Bet Doctor audit integration confirmed');

// 11c: AI Scout prompt dispatch
engine.askAiScout(testMatchId);
assert(lastAiScoutPrompt && lastAiScoutPrompt.includes('tactical breakdown'), 'AI Scout query must be dispatched');
console.log('  ✅ AI Scout prompt generation & dispatch confirmed');

// 11d: Backtest Query
engine.backtestQuery();
assert(lastBacktestQuery, 'Backtester route handoff must be triggered');
console.log('  ✅ Strategy Backtester handoff confirmed');

// --- Test 12: Saved Queries & LocalStorage Persistence ---
console.log('\n--- Test 12: Saved Queries & LocalStorage Persistence ---');
engine.saveCurrentQuery('Premier League High Goals');
const saved = engine.loadSavedQuery(0);
assert(saved, 'Saved query must be retrieved from storage');
assert.strictEqual(saved.name, 'Premier League High Goals', 'Saved query name must match');
console.log('  ✅ Saved queries persistence verified in localStorage');

// --- Test 13: Terminology & Responsible Analytics Compliance Check ---
console.log('\n--- Test 13: Responsible Language Audit ---');
const prohibitedPhrases = [
  'guaranteed win',
  'guaranteed profit',
  '100% sure',
  'risk-free',
  'sure win',
  'sure banker'
];

prohibitedPhrases.forEach(phrase => {
  const inEngine = engineContent.toLowerCase().includes(phrase);
  assert(!inEngine, `advancedFiltersEngine.js must NOT contain prohibited claim: "${phrase}"`);
});
console.log('  ✅ Zero prohibited guarantee phrases found in advancedFiltersEngine.js');

// --- Test 14: Script Inclusion Check ---
console.log('\n--- Test 14: Script Tag Inclusion ---');
assert(htmlContent.includes('/js/advancedFiltersEngine.js'), 'index.html must load advancedFiltersEngine.js');
assert(publicHtmlContent.includes('/js/advancedFiltersEngine.js'), 'public/index.html must load advancedFiltersEngine.js');
console.log('  ✅ <script defer src="/js/advancedFiltersEngine.js"> confirmed in both HTML entrypoints');

console.log('\n============================================================');
console.log('🎉 ALL ADVANCED STATISTICAL DATABASE FILTERS TESTS PASSED!');
console.log('============================================================\n');
