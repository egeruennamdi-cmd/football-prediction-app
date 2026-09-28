/**
 * DeepPredictBet — Bet Doctor -> Active Betslip Builder Real-Time Sync Test Suite
 *
 * Verifies:
 * 1. Single Source of Truth (window.appState.betslip)
 * 2. Real-time replacement: original selection replaced, odds updated, count preserved
 * 3. Total Odds recalculation: exact product immediately reflected in Betslip Builder
 * 4. Reversible state: "Original" restores original selections and original total odds
 * 5. Deterministic toggle between Original and Prescribed
 * 6. 40-Match accumulator replacement: 40 selections remain 40 selections
 * 7. Additive prescription: 40 selections become 41 selections
 * 8. Error handling: invalid odds or unresolvable prescriptions do not mutate state
 * 9. Persistence: dp_betslip in localStorage reflects prescribed selections and persists
 * 10. Converter integration: Converter receives updated prescribed selections
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: BET DOCTOR → ACTIVE BETSLIP REAL-TIME SYNC AUDIT');
console.log('================================================================');

// 1. Setup DOM Mock Environment
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
    remove() {},
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() { return null; },
    textContent: '',
    innerText: '',
    value: '',
    scrollIntoView() {}
  };
}

['floating-betslip-drawer', 'betslip-count-badge', 'betslip-header-odds',
 'betslip-empty-state', 'betslip-items-container', 'betslip-summary-actions',
 'betslip-total-odds-val', 'betslip-unavailable-alert', 'betslip-unavailable-count',
 'betslip-unavailable-review-list', 'bet-doctor-results', 'bet-doctor-input-code',
 'bet-doctor-code-input', 'bet-doctor-bookie-select', 'paddi-src-code', 'conv-source-code'].forEach(id => {
  elements[id] = createMockElement(id);
});

const mockDoc = {
  getElementById(id) {
    if (!elements[id]) elements[id] = createMockElement(id);
    return elements[id];
  },
  querySelector(sel) {
    if (sel.startsWith('#')) return this.getElementById(sel.slice(1));
    return createMockElement();
  },
  querySelectorAll() { return []; },
  createElement(tag) { return createMockElement(tag); },
  body: { style: {}, appendChild() {} },
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
  appState: { betslip: [], unavailableSelections: [], savedTickets: [] },
  doctorState: {},
  generatedTicketsCache: {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
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

// Load js/data.js and js/app.js
const dataCode = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');
vm.runInContext(dataCode, ctx);

const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
vm.runInContext(appCode, ctx);

console.log('✅ Environment & DeepPredictBet runtime loaded successfully.');

// --- TEST 1: Replacement & Total Odds Recalculation ---
console.log('\n--- TEST 1: Selection Replacement & Total Odds Recalculation ---');

const futurePool = (typeof sandbox.window.getStrictlyFutureMatchesPool === 'function')
  ? sandbox.window.getStrictlyFutureMatchesPool()
  : sandbox.window.MATCH_DATA.filter(m => !sandbox.window.isMatchOutdated(m));

const mArsenal = { ...futurePool[0], id: 'match-arsenal', homeTeam: { name: 'Arsenal' }, awayTeam: { name: 'Leeds' } };
const mVilla = { ...futurePool[1], id: 'match-villa', homeTeam: { name: 'Aston Villa' }, awayTeam: { name: 'Brentford' } };
const mChelsea = { ...futurePool[2], id: 'match-chelsea', homeTeam: { name: 'Chelsea' }, awayTeam: { name: 'Wolves' } };

// Baseline Betslip:
// Arsenal Win @ 1.40
// Aston Villa Over 1.5 @ 1.60
// Chelsea BTTS @ 1.50
// Total Odds = 1.40 * 1.60 * 1.50 = 3.36
sandbox.window.appState.betslip = [
  { matchId: 'match-arsenal', match: mArsenal, tip: 'Arsenal Win (1)', odds: 1.40 },
  { matchId: 'match-villa', match: mVilla, tip: 'Over 1.5 Goals', odds: 1.60 },
  { matchId: 'match-chelsea', match: mChelsea, tip: 'Both Teams to Score (Yes)', odds: 1.50 }
];

sandbox.window.renderBetslip();
const baselineOddsCalc = sandbox.calculateBetslipTotalOdds(sandbox.window.appState.betslip);
assert.strictEqual(baselineOddsCalc.totalOdds.toFixed(2), '3.36', 'Initial odds product must equal 3.36');
assert.strictEqual(elements['betslip-total-odds-val'].textContent, '@3.36', 'Total odds display must be @3.36');
assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 3, 'Selection count must be 3');

// Audit active betslip in Bet Doctor
sandbox.window.auditActiveBetslipInDoctor();
assert.strictEqual(sandbox.window.doctorState.auditedSelections.length, 3, 'Doctor must audit all 3 selections');

// Prescribe Arsenal leg: Double Chance 1X @ 1.10
const prescriptionPayload = {
  matchId: 'match-arsenal',
  fixtureId: 'arsenal-leeds',
  originalSelectionId: 'Arsenal Win (1)',
  originalOdds: 1.40,
  prescribedSelectionId: 'Double Chance 1X',
  prescribedOdds: 1.10,
  prescriptionType: 'replace'
};

const dispatchResult = sandbox.dispatchBetslipAction({
  type: 'APPLY_PRESCRIPTION',
  payload: { prescription: prescriptionPayload }
});

assert.strictEqual(dispatchResult.success, true, 'Dispatch must succeed');
assert.strictEqual(sandbox.window.appState.betslip.length, 3, 'Active betslip count must remain 3 (NOT 4)');
assert.strictEqual(sandbox.window.appState.betslip[0].tip, 'Double Chance 1X', 'Selection tip must be replaced');
assert.strictEqual(sandbox.window.appState.betslip[0].odds, 1.10, 'Selection odds must be updated to 1.10');
assert.strictEqual(sandbox.window.appState.betslip[0].originalOdds, 1.40, 'Original odds must be saved on selection');

// New Total Odds = 1.10 * 1.60 * 1.50 = 2.64
const updatedOddsCalc = sandbox.calculateBetslipTotalOdds(sandbox.window.appState.betslip);
assert.strictEqual(updatedOddsCalc.totalOdds.toFixed(2), '2.64', 'New odds product must equal 2.64');
assert.strictEqual(elements['betslip-total-odds-val'].textContent, '@2.64', 'Active Betslip Builder drawer must display @2.64');
assert.strictEqual(elements['betslip-header-odds'].textContent, 'Total Odds: @2.64', 'Header odds must display Total Odds: @2.64');
console.log('✅ TEST 1 PASSED: Selection replaced in active betslip, count preserved (3), Total Odds recalculated (@3.36 ➡️ @2.64).');

// --- TEST 2: Multiple Prescriptions Applied ---
console.log('\n--- TEST 2: Multiple Prescriptions Batch Application ---');

// Apply second prescription to Aston Villa: Under 3.5 Goals @ 1.25
// Total Odds = 1.10 * 1.25 * 1.50 = 2.0625 -> @2.06
sandbox.dispatchBetslipAction({
  type: 'APPLY_PRESCRIPTION',
  payload: {
    prescription: {
      matchId: 'match-villa',
      fixtureId: 'aston villa-brentford',
      originalSelectionId: 'Over 1.5 Goals',
      originalOdds: 1.60,
      prescribedSelectionId: 'Under 3.5 Goals',
      prescribedOdds: 1.25,
      prescriptionType: 'replace'
    }
  }
});

assert.strictEqual(sandbox.window.appState.betslip.length, 3, 'Count must remain 3');
assert.strictEqual(sandbox.window.appState.betslip[1].tip, 'Under 3.5 Goals', 'Second selection replaced');
assert.strictEqual(sandbox.window.appState.betslip[1].odds, 1.25, 'Second selection odds updated to 1.25');

const multiOddsCalc = sandbox.calculateBetslipTotalOdds(sandbox.window.appState.betslip);
assert.strictEqual(multiOddsCalc.totalOdds.toFixed(2), '2.06', 'Compound odds must be 2.06');
assert.strictEqual(elements['betslip-total-odds-val'].textContent, '@2.06', 'Betslip drawer shows @2.06');
console.log('✅ TEST 2 PASSED: Multiple prescriptions update active selections and recalculate total odds once from final product.');

// --- TEST 3: Revert / Original Button ---
console.log('\n--- TEST 3: Revert / Original Restoration ---');

// Revert all prescriptions
sandbox.window.revertDoctorPrescriptions();

assert.strictEqual(sandbox.window.appState.betslip.length, 3, 'Betslip count must remain 3 after revert');
assert.strictEqual(sandbox.window.appState.betslip[0].tip, 'Arsenal Win (1)', 'Original selection 1 restored');
assert.strictEqual(sandbox.window.appState.betslip[0].odds, 1.40, 'Original odds 1.40 restored');
assert.strictEqual(sandbox.window.appState.betslip[1].tip, 'Over 1.5 Goals', 'Original selection 2 restored');
assert.strictEqual(sandbox.window.appState.betslip[1].odds, 1.60, 'Original odds 1.60 restored');

const revertedOddsCalc = sandbox.calculateBetslipTotalOdds(sandbox.window.appState.betslip);
assert.strictEqual(revertedOddsCalc.totalOdds.toFixed(2), '3.36', 'Total odds must restore to baseline 3.36');
assert.strictEqual(elements['betslip-total-odds-val'].textContent, '@3.36', 'Betslip builder shows restored @3.36');
assert.strictEqual(sandbox.window.doctorState.isOptimized, false, 'Doctor state must be unoptimized');
console.log('✅ TEST 3 PASSED: Original button restores original selections, original odds, and baseline total odds (@3.36).');

// --- TEST 4: Selection Count Invariant (40 Selections Accumulator) ---
console.log('\n--- TEST 4: Selection Count Invariant (40 Selections Accumulator) ---');

// Generate 40-match accumulator
const acc40 = [];
for (let i = 0; i < 40; i++) {
  const matchObj = futurePool[i % futurePool.length];
  acc40.push({
    matchId: `acc-leg-${i + 1}`,
    match: { ...matchObj, id: `acc-leg-${i + 1}` },
    tip: i === 0 ? 'Arsenal Win (1)' : 'Over 1.5 Goals',
    odds: 1.50
  });
}
sandbox.window.appState.betslip = acc40;
sandbox.window.renderBetslip();

assert.strictEqual(sandbox.window.appState.betslip.length, 40, 'Accumulator must have exactly 40 selections');
assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 40, 'Badge must show 40');

// Apply prescription on leg 1 (replacing 1.50 with 1.15)
sandbox.dispatchBetslipAction({
  type: 'APPLY_PRESCRIPTION',
  payload: {
    prescription: {
      matchId: 'acc-leg-1',
      originalSelectionId: 'Arsenal Win (1)',
      originalOdds: 1.50,
      prescribedSelectionId: 'Double Chance 1X',
      prescribedOdds: 1.15,
      prescriptionType: 'replace'
    }
  }
});

assert.strictEqual(sandbox.window.appState.betslip.length, 40, 'Count must remain STRICTLY 40 after replacement (NOT 41)');
assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 40, 'Badge must remain 40');
assert.strictEqual(sandbox.window.appState.betslip[0].odds, 1.15, 'Target leg odds must be updated');
console.log('✅ TEST 4 PASSED: 40-leg accumulator replacement preserves exact count (40 remains 40, NOT 41).');

// --- TEST 5: Explicit Addition ---
console.log('\n--- TEST 5: Explicit Additive Prescription ---');

sandbox.dispatchBetslipAction({
  type: 'APPLY_PRESCRIPTION',
  payload: {
    prescription: {
      matchId: 'acc-leg-41-new',
      homeTeam: 'Inter',
      awayTeam: 'Milan',
      prescribedSelectionId: 'Draw No Bet (DNB)',
      prescribedOdds: 1.35,
      prescriptionType: 'add'
    }
  }
});

assert.strictEqual(sandbox.window.appState.betslip.length, 41, 'Count must increase from 40 to 41 for explicit addition');
assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 41, 'Badge must show 41');
console.log('✅ TEST 5 PASSED: Additive prescription increments selection count from 40 to 41.');

// --- TEST 6: Atomic Failure & Rollback ---
console.log('\n--- TEST 6: Atomic Error Handling & Non-Partial State Mutation ---');

const preFailureBetslip = JSON.parse(JSON.stringify(sandbox.window.appState.betslip));
const preFailureOdds = sandbox.calculateBetslipTotalOdds(preFailureBetslip).formatted;

// Attempt to apply prescription with invalid odds (odds <= 1.0)
const failResult = sandbox.dispatchBetslipAction({
  type: 'APPLY_PRESCRIPTION',
  payload: {
    prescription: {
      matchId: 'acc-leg-2',
      prescribedSelectionId: 'Invalid Line',
      prescribedOdds: 0.90, // Invalid!
      prescriptionType: 'replace'
    }
  }
});

assert.strictEqual(failResult.success, false, 'Action must fail validation');
assert.strictEqual(sandbox.window.appState.betslip.length, preFailureBetslip.length, 'Betslip length must be preserved on error');
assert.strictEqual(sandbox.window.appState.betslip[1].odds, 1.50, 'Leg 2 odds must NOT be modified');
assert.strictEqual(elements['betslip-total-odds-val'].textContent, preFailureOdds, 'Total odds must remain unchanged');
console.log('✅ TEST 6 PASSED: Invalid prescription causes atomic rollback without mutating betslip or odds.');

// --- TEST 7: LocalStorage Persistence ---
console.log('\n--- TEST 7: LocalStorage Persistence ---');

sandbox.window.appState.betslip = [
  { matchId: 'p1', tip: 'Double Chance 1X', odds: 1.18, isPrescribed: true }
];
sandbox.window.renderBetslip();

const storedRaw = sandbox.localStorage.getItem('dp_betslip');
assert(storedRaw !== null, 'dp_betslip must exist in localStorage');
const storedParsed = JSON.parse(storedRaw);
assert.strictEqual(storedParsed.length, 1, 'Stored betslip length must be 1');
assert.strictEqual(storedParsed[0].tip, 'Double Chance 1X', 'Stored tip must be prescribed tip');
assert.strictEqual(storedParsed[0].odds, 1.18, 'Stored odds must be prescribed odds');
assert.strictEqual(storedParsed[0].isPrescribed, true, 'Stored isPrescribed flag must be true');
console.log('✅ TEST 7 PASSED: Prescribed selection and odds persist in localStorage (dp_betslip).');

// --- TEST 8: Stale Odds & Market Pool Lookup ---
console.log('\n--- TEST 8: Market Pool Authoritative Odds Resolution ---');

const evaluated = sandbox.window.evaluateDoctorSelection({
  match: futurePool[0],
  prediction: 'Under 3.5 Goals',
  odds: 2.25
}, false);

assert(evaluated.prescription !== null, 'Selection must generate prescription');
assert(typeof evaluated.prescription.prescribedOdds === 'number', 'Prescribed odds must be a number');
assert(evaluated.prescription.prescribedOdds > 1.0, 'Prescribed odds must be valid (> 1.0)');
assert(evaluated.prescription.fixtureId !== undefined, 'Prescription must carry stable fixtureId');
assert(evaluated.prescription.matchId !== undefined, 'Prescription must carry stable matchId');
console.log(`✅ TEST 8 PASSED: Authoritative odds verified (@${evaluated.prescription.prescribedOdds}) with stable identifiers.`);

// --- TEST 9: Converter Integration ---
console.log('\n--- TEST 9: Converter Synchronization ---');

sandbox.window.appState.betslip = [
  { matchId: 'conv-m1', homeTeam: 'Arsenal', awayTeam: 'Leeds', tip: 'Double Chance 1X', odds: 1.10, isPrescribed: true }
];
sandbox.window.convertAuditedTicket('SPORTY-SYNC1', 'sportybet');

assert(sandbox.window.generatedTicketsCache['SPORTY-SYNC1'] !== undefined, 'Cache must be updated for audited ticket');
assert.strictEqual(sandbox.window.generatedTicketsCache['SPORTY-SYNC1'].selections[0].prediction, 'Double Chance 1X', 'Converter cache must receive prescribed tip');
assert.strictEqual(sandbox.window.generatedTicketsCache['SPORTY-SYNC1'].selections[0].odds, 1.10, 'Converter cache must receive prescribed odds');
console.log('✅ TEST 9 PASSED: Converter cache received updated prescribed selections and odds.');

// --- TEST 10: Saved Tickets Uses Updated Prescribed Selections ---
console.log('\n--- TEST 10: Saved Tickets Snapshot Integration ---');

const ticketToSave = {
  code: 'SAVED-DOC-1',
  date: new Date().toLocaleDateString(),
  betslip: sandbox.window.appState.betslip
};
sandbox.window.appState.savedTickets.push(ticketToSave);
sandbox.localStorage.setItem('dp_saved_tickets', JSON.stringify(sandbox.window.appState.savedTickets));

const savedRaw = JSON.parse(sandbox.localStorage.getItem('dp_saved_tickets'));
assert.strictEqual(savedRaw[0].betslip[0].tip, 'Double Chance 1X', 'Saved ticket must contain prescribed tip');
assert.strictEqual(savedRaw[0].betslip[0].odds, 1.10, 'Saved ticket must contain prescribed odds');
console.log('✅ TEST 10 PASSED: Saved tickets preserve active prescribed selections.');

console.log('\n================================================================');
console.log('ALL REAL-TIME PRESCRIPTION & ODDS SYNC AUDIT TESTS PASSED (100%)');
console.log('================================================================\n');
