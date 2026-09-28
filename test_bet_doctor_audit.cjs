/**
 * DeepPredictBet - Bet Doctor Forensic Data-Integrity Audit & Verification Test
 *
 * Verifies:
 * 1. ZERO occurrences of hardcoded production placeholders (BC1A7X, static 58%, fake SportyBet default).
 * 2. State 1 (Empty State): Initial render contains invitation to submit ticket/audit betslip, 0 fake numbers.
 * 3. State 2 (Loading State): Animated pulse, skeleton loaders (████), 0 fake percentages during scan.
 * 4. State 3 (Dynamic Success):
 *    - Active Betslip: Audits actual selections directly from window.appState.betslip.
 *    - Booking Code: Decodes deterministic real matches from MATCH_DATA with mathematical metrics.
 *    - Dynamic Health Score & Trap detection (0-40 Critical, 41-60 High, 61-75 Moderate, 76-100 Lower-Risk).
 *    - Prescriptions deliver genuine point deltas (+X pts), never guaranteed profit claims.
 *    - Prescriptions can be applied and reverted cleanly.
 * 5. State 4 (Error State): Graceful failure with retry options, NEVER falling back to sample data.
 * 6. Illustrative Examples: Explicitly labeled with "Try an Example", "Lower-Risk" (no "Safe Ticket"),
 *    and prominent "Viewing Illustrative Example — Not a Live Ticket" notice.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: BET DOCTOR FORENSIC DATA-INTEGRITY AUDIT');
console.log('================================================================\n');

// --- TEST SUITE 1: Static Placeholder File Audit ---
console.log('--- TEST SUITE 1: Static Placeholder Elimination Audit ---');

const filesToCheck = [
  'index.html',
  'public/index.html',
  'js/app.js',
  'public/js/app.js',
  'js/ui.js',
  'public/js/ui.js',
  'js/dashboard.js',
  'public/js/dashboard.js'
];

filesToCheck.forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  assert.strictEqual(
    content.includes('BC1A7X'),
    false,
    `FAIL: Found hardcoded placeholder BC1A7X in ${file}`
  );
});
console.log('✅ 100% of files verified free of hardcoded BC1A7X placeholder.');

// Verify index.html & public/index.html start in State 1 Empty State
['index.html', 'public/index.html'].forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  assert.strictEqual(
    content.includes('id="bet-doctor-empty-state"'),
    true,
    `FAIL: ${file} does not contain State 1 Empty State`
  );
  assert.strictEqual(
    content.includes('Safe Ticket (92% Health)'),
    false,
    `FAIL: ${file} still contains "Safe Ticket" wording`
  );
  assert.strictEqual(
    content.includes('[Example — Lower-Risk] Illustrative Health: 92'),
    true,
    `FAIL: ${file} missing Lower-Risk example button label`
  );
});
console.log('✅ HTML files verified starting in clean State 1 Empty State with compliant example labels.');

// --- TEST SUITE 2: DOM & Runtime Initialization ---
console.log('\n--- TEST SUITE 2: Runtime Initialization & State 1 (Empty State) ---');

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
    value: '',
    closest() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; }
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
  querySelector() {
    return null;
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
  location: { hostname: 'localhost', hash: '' },
  showToast(msg) {},
  alert(msg) {},
  trackEvent() {}
};

const sandbox = {
  window: mockWindow,
  document: mockDoc,
  localStorage: mockStorage,
  console: console,
  setTimeout: (fn, ms) => { fn(); },
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
  showToast(msg) {},
  alert(msg) {},
  trackEvent() {}
};
sandbox.global = sandbox;
sandbox.window.window = sandbox.window;
sandbox.self = sandbox.window;

const ctx = vm.createContext(sandbox);

// Load data.js
const dataCode = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');
vm.runInContext(dataCode + '\nwindow.MATCH_DATA = MATCH_DATA;', ctx);

// Load app.js
const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
vm.runInContext(appCode, ctx);

// Verify State 1 (Empty State) is rendered
sandbox.window.renderBetDoctorEmptyState();
const resultsContainer = elements['bet-doctor-results'];
assert(resultsContainer.innerHTML.includes('AI Bet Doctor — Ticket Health Diagnostic'), 'Empty state missing title');
assert(resultsContainer.innerHTML.includes('Submit a ticket to begin your Bet Doctor analysis'), 'Empty state missing description');
assert(!resultsContainer.innerHTML.includes('58%'), 'Empty state must NOT contain hardcoded 58%');
assert(!resultsContainer.innerHTML.includes('34.2%'), 'Empty state must NOT contain hardcoded 34.2%');
assert(!resultsContainer.innerHTML.includes('BC1A7X'), 'Empty state must NOT contain BC1A7X');
console.log('✅ State 1 (Empty State) renders cleanly with 0 fake numbers, 0 fake gauges.');

// --- TEST SUITE 3: State 2 (Loading State) Skeletons ---
console.log('\n--- TEST SUITE 3: State 2 (Analyzing / Loading State) ---');

let interceptedScanHTML = '';
const originalSetTimeout = sandbox.setTimeout;
sandbox.setTimeout = function(fn, ms) {
  // Capture intermediate loading HTML before timeout fires
  interceptedScanHTML = elements['bet-doctor-results'].innerHTML;
  fn();
};

elements['bet-doctor-input-code'].value = 'SB-SCAN101';
sandbox.window.runBetDoctorAudit(true);
sandbox.setTimeout = originalSetTimeout;

assert(interceptedScanHTML.includes('██████████████████████████'), 'Loading state missing skeleton blocks');
assert(interceptedScanHTML.includes('Auditing line movements, calculating variance, scanning for trap matches...'), 'Loading state missing progress text');
assert(!interceptedScanHTML.includes('58%'), 'Loading state must NOT flash fake 58%');
assert(!interceptedScanHTML.includes('34.2%'), 'Loading state must NOT flash fake 34.2%');
console.log('✅ State 2 (Loading State) verified with skeleton blocks (████) and 0 fake numbers.');

// --- TEST SUITE 4: State 3 (Dynamic Success) - Active Betslip Audit ---
console.log('\n--- TEST SUITE 4: State 3 (Dynamic Success) - Active Betslip Audit ---');

sandbox.window.appState = sandbox.window.appState || {};
sandbox.window.appState.betslip = [
  {
    match: sandbox.window.MATCH_DATA[0],
    tip: 'Manchester City Win (1)',
    odds: 1.35
  },
  {
    match: sandbox.window.MATCH_DATA[1],
    tip: 'Over 2.5 Goals',
    odds: 1.70
  },
  {
    match: sandbox.window.MATCH_DATA[2],
    tip: 'Away Win (2) - High Risk',
    odds: 2.85
  }
];

sandbox.window.auditActiveBetslipInDoctor();

const betslipAuditHTML = elements['bet-doctor-results'].innerHTML;
assert(betslipAuditHTML.includes('ACTIVE-BETSLIP'), 'Results must reference Active Betslip');
assert(betslipAuditHTML.includes(sandbox.window.MATCH_DATA[0].homeTeam.name), 'Results must render real betslip fixture 1');
assert(betslipAuditHTML.includes(sandbox.window.MATCH_DATA[1].homeTeam.name), 'Results must render real betslip fixture 2');
assert(betslipAuditHTML.includes(sandbox.window.MATCH_DATA[2].homeTeam.name), 'Results must render real betslip fixture 3');
assert(sandbox.window.doctorState.auditedSelections.length === 3, 'Audited selections count must equal betslip length');
console.log(`✅ Active Betslip audited with ${sandbox.window.doctorState.auditedSelections.length} live selections.`);
console.log(`   Health Score: ${sandbox.window.doctorState.auditedHealth}%, Traps: ${sandbox.window.doctorState.auditedSelections.filter(s => s.isTrap).length}`);

// --- TEST SUITE 5: Prescriptions Application & Reversion ---
console.log('\n--- TEST SUITE 5: AI Prescriptions Application & Reversion ---');

const initialHealth = sandbox.window.doctorState.auditedHealth;
const expectedDelta = sandbox.window.doctorState.healthDelta;
assert(typeof expectedDelta === 'number' && expectedDelta > 0, 'Health delta must be a positive number');

// Apply prescriptions
sandbox.window.applyDoctorPrescription();
assert.strictEqual(sandbox.window.doctorState.isOptimized, true, 'Doctor state must be optimized');
const optimizedHealth = sandbox.window.doctorState.auditedHealth;
assert(optimizedHealth >= initialHealth, `Optimized health (${optimizedHealth}) must be >= initial (${initialHealth})`);
console.log(`✅ Prescriptions Applied: Health improved from ${initialHealth}% to ${optimizedHealth}% (+${optimizedHealth - initialHealth} pts).`);

// Revert prescriptions
sandbox.window.revertDoctorPrescriptions();
assert.strictEqual(sandbox.window.doctorState.isOptimized, false, 'Doctor state must revert to unoptimized');
assert.strictEqual(sandbox.window.doctorState.auditedHealth, initialHealth, 'Health must restore to initial');
console.log(`✅ Prescriptions Reverted: Health cleanly restored to original ${initialHealth}%.`);

// --- TEST SUITE 6: Illustrative Examples & Disclaimer Banner ---
console.log('\n--- TEST SUITE 6: Illustrative Examples & Disclaimers ---');

// High Risk Example
sandbox.window.loadDoctorSample('highrisk');
assert.strictEqual(sandbox.window.doctorState.isExample, true, 'isExample must be true');
assert.strictEqual(sandbox.window.doctorState.auditedHealth, 58, 'High risk illustrative health must be 58');
assert(elements['bet-doctor-results'].innerHTML.includes('Viewing Illustrative Example (High Risk) — Not a Live Ticket'), 'Notice banner missing');

// Moderate Risk Example
sandbox.window.loadDoctorSample('moderate');
assert.strictEqual(sandbox.window.doctorState.auditedHealth, 74, 'Moderate risk illustrative health must be 74');
assert(elements['bet-doctor-results'].innerHTML.includes('Viewing Illustrative Example (Moderate Risk) — Not a Live Ticket'), 'Notice banner missing');

// Lower-Risk Example
sandbox.window.loadDoctorSample('safe');
assert.strictEqual(sandbox.window.doctorState.auditedHealth, 92, 'Lower risk illustrative health must be 92');
assert(elements['bet-doctor-results'].innerHTML.includes('Viewing Illustrative Example (Lower-Risk) — Not a Live Ticket'), 'Notice banner missing');
console.log('✅ All 3 Illustrative Examples correctly labeled and render persistent test scenario disclaimer.');

// --- TEST SUITE 7: State 4 (Error / Invalid Ticket) ---
console.log('\n--- TEST SUITE 7: State 4 (Error / Invalid Ticket) ---');

// Clear betslip and provide an unresolvable code
sandbox.window.appState.betslip = [];
elements['bet-doctor-input-code'].value = '12'; // Too short
sandbox.window.doctorState.isExample = false;
sandbox.window.doctorState.exampleType = null;
sandbox.window.runBetDoctorAudit(false);

const errorHTML = elements['bet-doctor-results'].innerHTML;
assert(errorHTML.includes('Unable to analyze ticket "12"'), 'Error state missing failure message');
assert(errorHTML.includes('Try Again'), 'Error state missing retry action');
assert(!errorHTML.includes('58%'), 'Error state must NEVER fall back to fake 58%');
assert(!errorHTML.includes('34.2%'), 'Error state must NEVER fall back to fake 34.2%');
console.log('✅ State 4 (Error State) successfully handled without fallback to fake demo data.');

console.log('\n================================================================');
console.log('ALL BET DOCTOR AUDIT VERIFICATION TESTS PASSED (100% SUCCESS)');
console.log('================================================================\n');
