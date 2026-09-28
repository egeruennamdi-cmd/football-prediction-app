/**
 * DEEPPREDICTBET: VALUE INTELLIGENCE ENGINE COMPREHENSIVE VERIFICATION AUDIT
 * Tests mathematical models, multi-bookmaker odds intelligence, filtering,
 * betslip integration, Bet Doctor audit, AI Scout prompt dispatch, tracking, and compliance.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: VALUE INTELLIGENCE ENGINE COMPREHENSIVE AUDIT');
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

[
  'tool-valuebot', 'value-intelligence-suite-container', 'value-bet-bot-rows',
  'floating-betslip-drawer', 'betslip-count-badge', 'betslip-header-odds',
  'betslip-empty-state', 'betslip-items-container', 'betslip-summary-actions',
  'betslip-total-odds-val', 'betslip-share-btn'
].forEach(id => createMockElement(id));

const mockStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; }
};

const mockWindow = {
  appState: { betslip: [] },
  doctorState: {},
  generatedTicketsCache: {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
  location: { hostname: 'localhost', pathname: '/value-bets', hash: '' },
  showToast() {},
  showAppNotification() {},
  alert() {}
};

const sandbox = {
  window: mockWindow,
  document: {
    getElementById: (id) => elements[id] || createMockElement(id),
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elements[sel.slice(1)] || createMockElement(sel.slice(1));
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
  showToast: () => {},
  showAppNotification: () => {},
  alert: () => {}
};
sandbox.global = sandbox;
sandbox.window.document = sandbox.document;
sandbox.window.window = sandbox.window;
sandbox.window.localStorage = mockStorage;
sandbox.self = sandbox.window;

const ctx = vm.createContext(sandbox);

// Load code files in sequence
const dataCode = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');
vm.runInContext(dataCode, ctx);

const vieCode = fs.readFileSync(path.join(__dirname, 'js/valueIntelligenceEngine.js'), 'utf8');
vm.runInContext(vieCode, ctx);

const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
vm.runInContext(appCode, ctx);

console.log('✅ DeepPredictBet runtime & ValueIntelligenceEngine loaded successfully.\n');

const engine = sandbox.window.ValueIntelligenceEngine;
assert(engine, 'ValueIntelligenceEngine must be exposed on window');

// ----------------------------------------------------
// TEST SUITE 1: MATHEMATICAL SPECIFICATION & ACCURACY (Phase 1, 66)
// ----------------------------------------------------
console.log('--- TEST SUITE 1: Value Mathematics & Precision Accuracy ---');

// Test Case 1A: Odds 2.00, Model Prob 50% -> Expected EV = 0.0%
const ev1A = engine.math.calculateExpectedValue(0.50, 2.00);
const imp1A = engine.math.calculateImpliedProbability(2.00);
const fair1A = engine.math.calculateFairOdds(0.50);
const edge1A = engine.math.calculateValueEdge(0.50, imp1A);

assert.strictEqual(ev1A, 0.0, 'EV for 50% prob at 2.00 odds must be exactly 0.0%');
assert.strictEqual(imp1A, 0.50, 'Implied prob for 2.00 must be 0.50 (50%)');
assert.strictEqual(fair1A, 2.00, 'Fair odds for 50% prob must be @2.00');
assert.strictEqual(edge1A, 0.0, 'Value edge for 50% vs 50% must be 0.0pp');
console.log('✅ Test 1A: Odds 2.00, Prob 50% -> EV 0.0%, Fair @2.00, Edge 0.0pp verified.');

// Test Case 1B: Odds 2.00, Model Prob 55% -> Expected EV = +10.0%
const ev1B = engine.math.calculateExpectedValue(0.55, 2.00);
const edge1B = engine.math.calculateValueEdge(0.55, 0.50);
const fair1B = engine.math.calculateFairOdds(0.55);

assert.strictEqual(ev1B, 10.0, 'EV for 55% prob at 2.00 odds must be +10.0%');
assert.strictEqual(edge1B, 5.0, 'Value edge must be +5.0pp');
assert.strictEqual(fair1B, 1.82, 'Fair odds for 55% prob must be @1.82');
console.log('✅ Test 1B: Odds 2.00, Prob 55% -> EV +10.0%, Fair @1.82, Edge +5.0pp verified.');

// Test Case 1C: Odds 1.50, Model Prob 70% -> Expected EV = +5.0%
const ev1C = engine.math.calculateExpectedValue(0.70, 1.50);
const imp1C = engine.math.calculateImpliedProbability(1.50);
const fair1C = engine.math.calculateFairOdds(0.70);
const edge1C = engine.math.calculateValueEdge(0.70, imp1C);

assert.strictEqual(ev1C, 5.0, 'EV for 70% prob at 1.50 odds must be +5.0%');
assert.strictEqual(fair1C, 1.43, 'Fair odds for 70% prob must be @1.43');
assert(Math.abs(edge1C - 3.33) < 0.05, 'Value edge must be ~+3.3pp');
console.log('✅ Test 1C: Odds 1.50, Prob 70% -> EV +5.0%, Fair @1.43, Edge +3.3pp verified.');

// Test Case 1D: Odds 3.00, Model Prob 40% -> Expected EV = +20.0%
const ev1D = engine.math.calculateExpectedValue(0.40, 3.00);
const imp1D = engine.math.calculateImpliedProbability(3.00);
const fair1D = engine.math.calculateFairOdds(0.40);
const edge1D = engine.math.calculateValueEdge(0.40, imp1D);

assert.strictEqual(ev1D, 20.0, 'EV for 40% prob at 3.00 odds must be +20.0%');
assert.strictEqual(fair1D, 2.50, 'Fair odds for 40% prob must be @2.50');
assert(Math.abs(edge1D - 6.67) < 0.05, 'Value edge must be ~+6.7pp');
console.log('✅ Test 1D: Odds 3.00, Prob 40% -> EV +20.0%, Fair @2.50, Edge +6.7pp verified.');

// Test Case 1E: Multi-outcome Overround Normalization (1X2 Market)
const normProb = engine.math.calculateNormalizedImpliedProbability(2.00, [2.00, 3.40, 4.20]);
assert(normProb < 0.50, 'Normalized implied probability must be lower than raw 1/odds due to bookmaker margin');
console.log(`✅ Test 1E: Normalized implied probability with overround: ${(normProb * 100).toFixed(2)}% vs raw 50.0% verified.`);

// ----------------------------------------------------
// TEST SUITE 2: NORMALIZED OPPORTUNITY OBJECT COMPLETENESS (Phase 2)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 2: Value Opportunity Object Specification ---');

engine.buildValueOpportunities();
const opps = engine.getOpportunities();
assert(opps.length > 0, 'Engine must discover value opportunities from future match pool');

const sample = opps[0];
const requiredFields = [
  'opportunityId', 'fixtureId', 'competitionId', 'competitionName', 'league',
  'homeTeam', 'awayTeam', 'match', 'marketId', 'marketName', 'selectionId', 'selectionName',
  'bookmakerId', 'bookmakerName', 'bookmakersCompared', 'decimalOdds', 'bookmakerOdds',
  'modelProbability', 'impliedProbability', 'fairOdds', 'modelOdds', 'valueEdge',
  'expectedValue', 'valueScore', 'confidence', 'dataQuality', 'status', 'whyValue',
  'riskFactors', 'historicalMetrics'
];

requiredFields.forEach(f => {
  assert(sample[f] !== undefined && sample[f] !== null, `Opportunity object missing required field: ${f}`);
});
assert(sample.expectedValue > 0, 'Opportunity must have positive expected value');
assert(sample.valueScore >= 1 && sample.valueScore <= 99, 'Value score must be between 1 and 99');
assert(sample.bookmakersCompared.length >= 3, 'Must contain comparison across at least 3 bookmakers');
console.log(`✅ Test 2: Opportunity object ${sample.opportunityId} validated with all 30 canonical fields.`);

// ----------------------------------------------------
// TEST SUITE 3: FILTERING & SORTING ENGINE (Phases 15, 16, 17)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 3: Filtering & Sorting Engine ---');

// Filter: Min EV 10%
engine.setFilter('minEv', 10);
let filtered = engine.getFilteredOpportunities();
filtered.forEach(o => assert(o.expectedValue >= 10, `Expected EV >= 10%, got ${o.expectedValue}%`));
console.log(`✅ Filter Min EV >= 10%: Returned ${filtered.length} matching opportunities.`);

// Filter: Reset
engine.resetFilters();
assert.strictEqual(engine.getFilteredOpportunities().length, opps.length, 'Reset filters must restore all opportunities');

// Sort: Highest EV
engine.setSort('ev_desc');
let sorted = engine.getFilteredOpportunities();
for (let i = 0; i < sorted.length - 1; i++) {
  assert(sorted[i].expectedValue >= sorted[i + 1].expectedValue, 'Must be sorted by EV descending');
}
console.log('✅ Sort Highest Expected Value: Order verified.');

// Sort: Value Edge
engine.setSort('edge_desc');
sorted = engine.getFilteredOpportunities();
for (let i = 0; i < sorted.length - 1; i++) {
  assert(sorted[i].valueEdge >= sorted[i + 1].valueEdge, 'Must be sorted by Value Edge descending');
}
console.log('✅ Sort Highest Value Edge: Order verified.');

// ----------------------------------------------------
// TEST SUITE 4: ACTIVE BETSLIP INTEGRATION (Phase 12, 50)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 4: Active Betslip Integration ---');

sandbox.window.appState.betslip = [];
const testOpp = opps[0];
const addResult = engine.addToBetslip(testOpp.opportunityId);

assert.strictEqual(addResult, true, 'addToBetslip must return true');
assert.strictEqual(sandbox.window.appState.betslip.length, 1, 'Active betslip must receive 1 new leg');

const addedItem = sandbox.window.appState.betslip[0];
assert.strictEqual(addedItem.tip, testOpp.selectionName, 'Selection name must match opportunity');
assert.strictEqual(addedItem.odds, testOpp.decimalOdds, 'Odds must match opportunity best price');

// Check drawer open
const drawer = sandbox.document.getElementById('floating-betslip-drawer');
assert(drawer.classList.contains('open'), 'Floating betslip drawer must be opened automatically');
console.log(`✅ Test 4: Added ${testOpp.match} (${testOpp.selectionName} @${testOpp.decimalOdds}) to active betslip.`);

// ----------------------------------------------------
// TEST SUITE 5: BET DOCTOR INTEGRATION (Phase 13, 49)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 5: Bet Doctor Audit Integration ---');

let auditTriggered = false;
let auditSource = null;
sandbox.window.runBetDoctorAudit = (showAnim, src) => {
  auditTriggered = true;
  auditSource = src;
};
sandbox.window.switchTool = (toolId) => {
  assert.strictEqual(toolId, 'doctor', 'Must switch tool to doctor');
};

engine.auditWithBetDoctor(testOpp.opportunityId);
assert(auditTriggered, 'runBetDoctorAudit must be called');
assert.strictEqual(auditSource, 'betslip', 'Audit must be called with betslip source');
console.log('✅ Test 5: Audit with Bet Doctor workflow successfully triggered.');

// ----------------------------------------------------
// TEST SUITE 6: AI SCOUT CONTEXT DISPATCH (Phase 10, 48)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 6: AI Scout Prompt Dispatch ---');

let capturedPrompt = '';
sandbox.window.quickPromptScout = (prompt, openModal) => {
  capturedPrompt = prompt;
  assert.strictEqual(openModal, true, 'Scout modal must be set to auto-open');
};

engine.askAiScout(testOpp.opportunityId);
assert(capturedPrompt.includes(testOpp.homeTeam), 'Prompt must include home team');
assert(capturedPrompt.includes(testOpp.selectionName), 'Prompt must include target selection');
assert(capturedPrompt.includes(String(testOpp.decimalOdds)), 'Prompt must include decimal odds');
assert(capturedPrompt.includes('DeepPredictBet model estimates'), 'Prompt must include model estimate context');
console.log(`✅ Test 6: AI Scout prompt formatted and dispatched: "${capturedPrompt.substring(0, 75)}..."`);

// ----------------------------------------------------
// TEST SUITE 7: VALUE LEDGER HISTORICAL TRACKING (Phase 24, 25)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 7: Value Ledger & Historical Tracking ---');

engine.trackOpportunity(testOpp.opportunityId);
const ledgerStats = engine.getLedgerMetrics();
assert(ledgerStats.total >= 1, 'Value ledger must contain at least 1 tracked opportunity');
assert.strictEqual(ledgerStats.pending, 1, 'Newly tracked opportunity must be in PENDING state');
console.log(`✅ Test 7: Tracked opportunity stored in Value Ledger (Total: ${ledgerStats.total}, Pending: ${ledgerStats.pending}).`);

// ----------------------------------------------------
// TEST SUITE 8: VALUE BET BOT (ALERTS CONFIGURATION) (Phase 22, 23)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 8: Value Bet Bot Automation & Alerts ---');

const evSelect = createMockElement('bot-min-ev');
evSelect.value = '12';
const probSelect = createMockElement('bot-min-prob');
probSelect.value = '60';
const freqSelect = createMockElement('bot-frequency');
freqSelect.value = 'hourly';

engine.saveAlertPreferences();
const savedAlerts = JSON.parse(mockStorage.getItem('dp_value_bot_config'));
assert.strictEqual(savedAlerts.minEv, 12, 'Min EV must be saved to 12%');
assert.strictEqual(savedAlerts.minProb, 60, 'Min Prob must be saved to 60%');
assert.strictEqual(savedAlerts.frequency, 'hourly', 'Frequency must be saved to hourly');
console.log('✅ Test 8: Value Bet Bot alert preferences saved to persistent storage.');

// ----------------------------------------------------
// TEST SUITE 9: RESPONSIBLE TERMINOLOGY COMPLIANCE (Phase 41, 42)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 9: Responsible Terminology Compliance ---');

const engineSource = fs.readFileSync(path.join(__dirname, 'js/valueIntelligenceEngine.js'), 'utf8');
const prohibitedTerms = [
  'guaranteed profit',
  'guaranteed value',
  'risk-free value',
  'sure value',
  'guaranteed win',
  'certain profit',
  'sure wins'
];

prohibitedTerms.forEach(term => {
  const regex = new RegExp(`\\b${term}\\b`, 'i');
  assert(!regex.test(engineSource), `Prohibited term found in source code: "${term}"`);
});
console.log('✅ Test 9: Zero prohibited promotional/certainty terms found in engine codebase.');

// ----------------------------------------------------
// TEST SUITE 10: UI RENDERING & SUITE MOUNTING (Phase 8, 43, 44, 45)
// ----------------------------------------------------
console.log('\n--- TEST SUITE 10: UI Rendering & Suite Mounting ---');

engine.render();
const suiteContainer = sandbox.document.getElementById('value-intelligence-suite-container');
assert(suiteContainer.innerHTML.includes('VALUE INTELLIGENCE ENGINE'), 'Header must contain VALUE INTELLIGENCE ENGINE');
assert(suiteContainer.innerHTML.includes('Opportunities'), 'Summary must contain Opportunities metric');
assert(suiteContainer.innerHTML.includes('Average EV'), 'Summary must contain Average EV');
assert(suiteContainer.innerHTML.includes('Key Principle: High probability does not automatically mean high value'), 'Educational principle must be displayed');

// Switch to dense table
engine.setViewMode('table');
assert(suiteContainer.innerHTML.includes('<table'), 'Table view must render an HTML table');

// Switch to cards
engine.setViewMode('cards');
assert(suiteContainer.innerHTML.includes('POTENTIAL VALUE'), 'Cards view must render potential value badges');

console.log('✅ Test 10: Full Value Intelligence Engine UI successfully mounted and rendered.');

console.log('\n================================================================');
console.log('ALL VALUE INTELLIGENCE ENGINE AUDIT TESTS PASSED (100% SUCCESS)');
console.log('================================================================');
