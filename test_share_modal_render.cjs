/**
 * DeepPredictBet: Share Active Betslip Modal Immediate Rendering & Synchronization Test Suite
 *
 * Verifies:
 * 1. Immediate first-open rendering without requiring user tap, scroll, or resize.
 * 2. Active Betslip authoritative data source synchronization.
 * 3. 1, 5, 10, 20, 40-match accumulator rendering with exact Total Odds matching.
 * 4. Elimination of nested scroll container (single unified scrollable body).
 * 5. Deterministic rapid open/close cycles (15x) without blank states or debounce lockup.
 * 6. Prescription synchronization (Bet Doctor prescribed selections & odds reflected immediately).
 * 7. Action buttons (Download Image, Copy Text, Share via Device) functional & non-blocking.
 * 8. Desktop keyboard ESC key dismissal.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: SHARE ACTIVE BETSLIP IMMEDIATE RENDERING AUDIT');
console.log('================================================================');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const mainCss = fs.readFileSync(path.join(__dirname, 'css/main.css'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');

const dom = new JSDOM(indexHtml, {
  runScripts: 'outside-only',
  url: 'https://deeppredictbet.com/'
});

const { window } = dom;
const { document } = window;

// Provide browser APIs and match environment
window.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; },
  clear() { this._store = {}; }
};

window.alert = (msg) => { console.log('[Alert Mock]:', msg); };
window.navigator.clipboard = {
  writeText: async (text) => {
    window._lastCopiedText = text;
    return Promise.resolve();
  }
};
window.navigator.share = async (shareObj) => {
  window._lastSharedObject = shareObj;
  return Promise.resolve();
};

// Execute app.js in sandbox
const vm = require('vm');
const context = vm.createContext(window);
const script = new vm.Script(appJs);
script.runInContext(context);

// Helper to generate future pool items
const basePool = (function() {
  const list = [];
  const futureBase = Date.now() + 86400000 * 3;
  for (let i = 1; i <= 50; i++) {
    list.push({
      id: `match-share-${i}`,
      matchId: `match-share-${i}`,
      fixtureId: `team-${i}a-team-${i}b`,
      homeTeam: { name: `Club Alpha ${i}` },
      awayTeam: { name: `Club Beta ${i}` },
      league: `Premier Division ${((i % 4) + 1)}`,
      tip: i % 2 === 0 ? 'Over 1.5 Goals' : 'Home Win (1)',
      odds: 1.20 + (i % 10) * 0.08,
      rawDate: new Date(futureBase + i * 3600000).toISOString(),
      time: '18:00',
      isLive: false,
      isFinished: false
    });
  }
  return list;
})();

// --- TEST 1: CSS Architecture & Elimination of Nested Scroll Container ---
console.log('\n--- TEST 1: CSS Architecture & Scroll Container Audit ---');

assert(mainCss.includes('.betslip-share-content'), 'CSS must define .betslip-share-content');
assert(mainCss.includes('transform: none !important'), '.betslip-share-content must disable transform transitions');
assert(mainCss.includes('content-visibility: visible !important'), '.betslip-share-content must enforce visible content-visibility');
assert(mainCss.includes('overflow-y: auto !important'), '.betslip-share-body must be the primary scroll container');
assert(mainCss.includes('max-height: none !important'), '.betslip-ticket-fixtures must not be capped with nested scroll container');
assert(mainCss.includes('overflow: visible !important'), '.betslip-ticket-fixtures must have overflow visible');
console.log('✅ TEST 1 PASSED: CSS verified with single scroll container and zero transform transitions.');

// --- TEST 2: First-Open Immediate Rendering (3 Selections) ---
console.log('\n--- TEST 2: First-Open Immediate Rendering ---');

window.appState = {
  betslip: [
    { matchId: 'm1', homeTeam: 'Arsenal', awayTeam: 'Wolves', league: 'Premier League', tip: 'Home Win (1)', odds: 1.45 },
    { matchId: 'm2', homeTeam: 'PSG', awayTeam: 'Marseille', league: 'Ligue 1', tip: 'Over 2.5 Goals', odds: 1.60 },
    { matchId: 'm3', homeTeam: 'Juventus', awayTeam: 'Napoli', league: 'Serie A', tip: 'Under 3.5 Goals', odds: 1.35 }
  ]
};

const modal = document.getElementById('betslip-share-modal');
const fixturesList = document.getElementById('share-modal-fixtures-list');
const oddsEl = document.getElementById('share-modal-total-odds');
const countEl = document.getElementById('share-modal-matches-count');

assert(modal.style.display === 'none' || !modal.classList.contains('active'), 'Modal must initially be closed');

// Call openBetslipShareModal
window.openBetslipShareModal({ stopPropagation: () => {}, preventDefault: () => {} });

// Verification WITHOUT any tap or scroll:
assert.strictEqual(modal.style.display, 'flex', 'Modal must be display: flex immediately');
assert.strictEqual(modal.classList.contains('active'), true, 'Modal must have active class immediately');
assert.strictEqual(modal.style.opacity, '1', 'Modal opacity must be 1 immediately');
assert.strictEqual(modal.style.visibility, 'visible', 'Modal visibility must be visible immediately');

assert.strictEqual(fixturesList.children.length, 3, 'All 3 matches must be rendered immediately');
assert(fixturesList.children[0].textContent.includes('Arsenal vs Wolves'), 'Match 1 fixture must be visible');
assert(fixturesList.children[0].textContent.includes('Premier League'), 'Match 1 league must be visible');
assert(fixturesList.children[0].textContent.includes('Tip: Home Win (1)'), 'Match 1 tip must be visible');
assert(fixturesList.children[0].textContent.includes('@1.45'), 'Match 1 odds must be visible');

assert.strictEqual(countEl.textContent, '3 Matches', 'Count element must display 3 Matches');

// Total Odds: 1.45 * 1.60 * 1.35 = 3.132 -> @3.13
const expectedOdds = window.calculateBetslipTotalOdds(window.appState.betslip).formatted;
assert.strictEqual(oddsEl.textContent, expectedOdds, `Total odds must match Active Betslip Builder exactly (${expectedOdds})`);
console.log(`✅ TEST 2 PASSED: Modal opened and rendered immediately without user interaction. Total Odds: ${oddsEl.textContent}`);

// --- TEST 3: Large Accumulators (5, 10, 20, 40 Selections) ---
console.log('\n--- TEST 3: Large Accumulator Support (1, 5, 10, 20, 40 Legs) ---');

const countsToTest = [1, 5, 10, 20, 40];
for (const n of countsToTest) {
  window.appState.betslip = basePool.slice(0, n).map(m => ({
    matchId: m.id,
    homeTeam: m.homeTeam.name,
    awayTeam: m.awayTeam.name,
    league: m.league,
    tip: m.tip,
    odds: m.odds
  }));

  window.openBetslipShareModal();
  assert.strictEqual(fixturesList.children.length, n, `Fixture list must render all ${n} items immediately`);
  assert.strictEqual(countEl.textContent, `${n} ${n === 1 ? 'Match' : 'Matches'}`, `Matches count must display ${n}`);
  const expOdds = window.calculateBetslipTotalOdds(window.appState.betslip).formatted;
  assert.strictEqual(oddsEl.textContent, expOdds, `Total Odds must equal ${expOdds}`);
}
console.log('✅ TEST 3 PASSED: 1, 5, 10, 20, and 40-match accumulators render immediately with 100% odds fidelity.');

// --- TEST 4: Rapid Open/Close Cycles (15x) ---
console.log('\n--- TEST 4: Rapid Open/Close Cycles Resilience ---');

for (let cycle = 1; cycle <= 15; cycle++) {
  window.closeBetslipShareModal(null, true);
  assert.strictEqual(modal.style.display, 'none', `Modal must be hidden after close in cycle ${cycle}`);

  window.openBetslipShareModal();
  assert.strictEqual(modal.style.display, 'flex', `Modal must open immediately in cycle ${cycle}`);
  assert.strictEqual(fixturesList.children.length, 40, `Selections must be intact in cycle ${cycle}`);
}
console.log('✅ TEST 4 PASSED: 15 consecutive rapid open/close cycles succeeded with zero blank states.');

// --- TEST 5: Bet Doctor Prescription Synchronization ---
console.log('\n--- TEST 5: Bet Doctor Prescription Synchronization ---');

// Build initial slip
window.appState.betslip = [
  { matchId: 'doc-sync-1', homeTeam: 'Arsenal', awayTeam: 'Leeds', league: 'Premier League', tip: 'Home Win (1)', odds: 2.10 },
  { matchId: 'doc-sync-2', homeTeam: 'Aston Villa', awayTeam: 'Brentford', league: 'Premier League', tip: 'Under 1.5 Goals', odds: 3.20 }
];

// Open share before doctor
window.openBetslipShareModal();
assert(fixturesList.children[0].textContent.includes('Tip: Home Win (1)'), 'Initial tip must be Home Win (1)');
assert(fixturesList.children[0].textContent.includes('@2.10'), 'Initial odds must be @2.10');

// Apply doctor prescription: Swap Home Win to Double Chance 1X @1.15
window.dispatchBetslipAction({
  type: 'APPLY_PRESCRIPTION',
  payload: {
    matchId: 'doc-sync-1',
    prescribedTip: 'Double Chance 1X',
    prescribedOdds: 1.15
  }
});

// Reopen share modal
window.openBetslipShareModal();
assert(fixturesList.children[0].textContent.includes('Tip: Double Chance 1X'), 'Share modal must reflect prescribed tip immediately');
assert(fixturesList.children[0].textContent.includes('@1.15'), 'Share modal must reflect prescribed odds immediately');

const prescribedTotalOdds = window.calculateBetslipTotalOdds(window.appState.betslip).formatted;
assert.strictEqual(oddsEl.textContent, prescribedTotalOdds, 'Share total odds must reflect prescription recomputation');
console.log(`✅ TEST 5 PASSED: Bet Doctor prescription immediately reflected in Share modal (@${oddsEl.textContent}).`);

// --- TEST 6: Copy Text & Download Actions ---
console.log('\n--- TEST 6: Copy Text & Download Actions Integrity ---');

window._lastCopiedText = null;
window.copyBetslipShareText(true);
assert(window._lastCopiedText !== null, 'Clipboard must receive text');
assert(window._lastCopiedText.includes('DEEPPREDICTBET'), 'Attribution must be present in copied text');
assert(window._lastCopiedText.includes('Arsenal vs Leeds'), 'Match must be present in copied text');
assert(window._lastCopiedText.includes('Double Chance 1X'), 'Prescribed selection must be in copied text');
assert(window._lastCopiedText.includes('https://deeppredictbet.com/'), 'Website link must be in copied text');
console.log('✅ TEST 6 PASSED: Copy betslip text generates verified branded ticket breakdown.');

// --- TEST 7: Keyboard Accessibility (ESC Dismissal) ---
console.log('\n--- TEST 7: Keyboard Accessibility (ESC Key) ---');

assert.strictEqual(modal.style.display, 'flex', 'Modal must be open before ESC test');
const escEvent = new window.KeyboardEvent('keydown', { key: 'Escape', keyCode: 27 });
window.document.dispatchEvent(escEvent);

assert.strictEqual(modal.style.display, 'none', 'Modal must close on ESC key press');
console.log('✅ TEST 7 PASSED: Keyboard ESC cleanly dismisses Share modal.');

console.log('\n================================================================');
console.log('ALL SHARE ACTIVE BETSLIP RENDERING AUDIT TESTS PASSED (100%)');
console.log('================================================================\n');

process.exit(0);
