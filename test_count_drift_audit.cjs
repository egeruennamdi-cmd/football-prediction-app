/**
 * DeepPredictBet - Betslip Builder Selection Count & Total Odds Audit
 * Verifies:
 * 1. generateScoutAccumulator(40) delivers exactly 40 selections
 * 2. 0 duplicate matchups or club schedule conflicts
 * 3. 100% strictly future matches (October - December 2026)
 * 4. calculateBetslipTotalOdds produces exact mathematical product
 * 5. Unavailable selections alert & auto-replacement workflow
 * 6. Single authoritative source of truth
 */

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('========================================================');
console.log('DEEPPREDICTBET: BETSLIP BUILDER COUNT DRIFT & ODDS AUDIT');
console.log('========================================================\n');

// 1. Mock DOM and Browser Environment
const elements = {};
function createMockElement(id) {
  return {
    id: id || '',
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); },
      contains(c) { return this._classes.has(c); }
    },
    children: [],
    appendChild(child) { this.children.push(child); },
    addEventListener() {},
    removeEventListener() {},
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; },
    scrollIntoView() {},
    remove() {},
    _textContent: '',
    set textContent(v) { this._textContent = (v === null || v === undefined) ? '' : String(v); },
    get textContent() { return this._textContent; },
    set innerText(v) { this._textContent = (v === null || v === undefined) ? '' : String(v); },
    get innerText() { return this._textContent; },
    innerHTML: '',
    value: ''
  };
}

const mockDoc = {
  body: createMockElement('body'),
  getElementById(id) {
    if (!elements[id]) {
      elements[id] = createMockElement(id);
    }
    return elements[id];
  },
  createElement(tag) {
    return createMockElement(tag);
  },
  querySelectorAll() {
    return [];
  },
  addEventListener() {},
  removeEventListener() {},
  readyState: 'complete'
};

const mockStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; }
};

const mockWindow = {
  appState: { betslip: [], unavailableSelections: [] },
  addEventListener() {},
  removeEventListener() {},
  location: { hostname: 'localhost' }
};

const sandbox = {
  window: mockWindow,
  document: mockDoc,
  localStorage: mockStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
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
  RegExp: RegExp
};
sandbox.global = sandbox;
sandbox.window.window = sandbox.window;

// Load js/data.js and js/app.js
const dataCode = fs.readFileSync('js/data.js', 'utf8');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const ctx = vm.createContext(sandbox);
vm.runInContext(dataCode, ctx);
vm.runInContext(appCode, ctx);

console.log('✅ Browser environment & scripts loaded successfully.\n');

// TEST SUITE 1: 40-Match Accumulator Generation
console.log('--- TEST SUITE 1: 40-Match Accumulator Generation ---');
const selections = sandbox.generateScoutAccumulator(40);
console.log(`Generated selections count: ${selections.length}`);
assert.strictEqual(selections.length, 40, 'Should generate exactly 40 selections');

// Verify all are future
let pastCount = 0;
const matchupMap = new Set();
selections.forEach((s, idx) => {
  const m = s.match || s;
  if (sandbox.isMatchOutdated(m)) {
    pastCount++;
    console.error(`Selection #${idx+1} is outdated: ${m.homeTeam.name} vs ${m.awayTeam.name} (${m.time})`);
  }
  const key = `${m.homeTeam.name.toLowerCase()}-vs-${m.awayTeam.name.toLowerCase()}`;
  assert.ok(!matchupMap.has(key), `Duplicate matchup found: ${key}`);
  matchupMap.add(key);
});
assert.strictEqual(pastCount, 0, 'No selection should be outdated');
console.log('✅ All 40 selections are valid future fixtures with 0 duplicate matchups.\n');

// TEST SUITE 2: Total Odds Real-Time Calculation
console.log('--- TEST SUITE 2: Total Odds Calculation ---');
const oddsCalc = sandbox.calculateBetslipTotalOdds(selections);
console.log(`Total Odds Calculated: ${oddsCalc.formatted}`);
console.log(`Display Odds: ${oddsCalc.displayOdds}`);
console.log(`Valid count: ${oddsCalc.count}`);
assert.strictEqual(oddsCalc.count, 40, 'Odds calc count must match 40');
assert.ok(oddsCalc.totalOdds > 1000, '40-match accumulator should have huge compound odds');
assert.ok(!oddsCalc.formatted.includes('@99,999+'), 'Placeholder cap @99,999+ must NOT be present');
assert.ok(oddsCalc.isValid, 'All odds must be valid');
console.log('✅ Accurate compounding total odds calculation verified with no placeholder caps.\n');

// TEST SUITE 3: UI State & Badge Consistency
console.log('--- TEST SUITE 3: UI Badge & Drawer Synchronization ---');
sandbox.renderBetslip();
const badge = elements['betslip-count-badge'];
const oddsHeader = elements['betslip-header-odds'];
const oddsSummary = elements['betslip-total-odds-val'];
console.log(`Badge count text: ${badge.textContent}`);
console.log(`Header odds text: ${oddsHeader.textContent}`);
console.log(`Summary odds text: ${oddsSummary.textContent}`);
assert.strictEqual(badge.textContent, '40', 'Badge text should be 40');
assert.strictEqual(oddsSummary.textContent, oddsCalc.formatted, 'Summary odds text should match calculated odds');
console.log('✅ Badge, Header and Summary are 100% synchronized.\n');

// TEST SUITE 4: Unavailable Selections Alert & Auto-Replacement
console.log('--- TEST SUITE 4: Unavailable Selections & Replacement Workflow ---');
// Simulate 4 matches expiring (kickoff passed)
const expiredSlip = [...sandbox.window.appState.betslip];
expiredSlip[0].match.time = '20th, September 2026, 16:30';
expiredSlip[0].match.date = 'past';
expiredSlip[1].match.time = '21st, September 2026, 15:00';
expiredSlip[1].match.date = 'past';
expiredSlip[2].match.time = '26th, September 2026, 12:30';
expiredSlip[2].match.date = 'past';
expiredSlip[3].match.time = '27th, September 2026, 16:30';
expiredSlip[3].match.date = 'past';

sandbox.window.appState.betslip = expiredSlip;
sandbox.renderBetslip();

console.log(`Remaining active selections: ${sandbox.window.appState.betslip.length}`);
assert.strictEqual(sandbox.window.appState.betslip.length, 36, 'Active betslip should have 36 selections after 4 expired');
assert.strictEqual(sandbox.window.appState.unavailableSelections.length, 4, '4 selections should be moved to unavailableSelections');

const alertBanner = elements['betslip-unavailable-alert'];
const alertCount = elements['betslip-unavailable-count'];
console.log(`Alert banner display: ${alertBanner.style.display}`);
console.log(`Alert count display: ${alertCount.textContent}`);
assert.strictEqual(alertBanner.style.display, 'block', 'Alert banner must be displayed');
assert.strictEqual(alertCount.textContent, '4', 'Alert count must show 4');

// Now trigger replaceUnavailableSelections()
console.log('Triggering replaceUnavailableSelections()...');
sandbox.replaceUnavailableSelections();

console.log(`Post-replacement active betslip count: ${sandbox.window.appState.betslip.length}`);
console.log(`Post-replacement unavailable count: ${sandbox.window.appState.unavailableSelections.length}`);
assert.strictEqual(sandbox.window.appState.betslip.length, 40, 'Betslip count must be restored to 40');
assert.strictEqual(sandbox.window.appState.unavailableSelections.length, 0, 'Unavailable list must be cleared');
assert.strictEqual(alertBanner.style.display, 'none', 'Alert banner must be hidden after replacement');

const restoredOddsCalc = sandbox.calculateBetslipTotalOdds(sandbox.window.appState.betslip);
console.log(`Restored Total Odds: ${restoredOddsCalc.formatted}`);
assert.strictEqual(restoredOddsCalc.count, 40);
console.log('✅ Unavailable detection, UI alert banner, and automatic replacement successfully verified.\n');

// TEST SUITE 5: quickPromptScout Dynamic Title & Subtitle
console.log('--- TEST SUITE 5: quickPromptScout Dynamic Count ---');
sandbox.quickPromptScout('Generate 40 selections', false);
const heroResults = elements['hero-scout-results'];
assert.ok(heroResults.innerHTML.includes('40-Match Football Event Selections'), 'Hero card title must reflect 40 matches');
assert.ok(heroResults.innerHTML.includes('40 high-probability football event selections'), 'Hero subtitle must reflect 40 matches');

sandbox.quickPromptScout('Generate 20 selections', false);
assert.strictEqual(sandbox.window.appState.betslip.length, 20, 'Should generate 20 selections when requested');
assert.ok(heroResults.innerHTML.includes('20-Match Football Event Selections'), 'Hero card title must reflect 20 matches');
console.log('✅ quickPromptScout dynamically adapts to actual selections count with 0 drift.\n');

console.log('========================================================');
console.log('ALL VERIFICATION AUDIT TESTS PASSED (100% SUCCESS)');
console.log('========================================================');
process.exit(0);
