/**
 * Verification Test Suite: Correct Button Label and Action (➕ Add to Slip)
 * Verifies:
 * 1. Button displays "➕ Add to Slip" in Match Detail Action Toolbar
 * 2. Zero occurrences of "Add to Bet Generator" remain on match actions
 * 3. Button styling matches reference: blue gradient, white text, plus icon, rounded corners
 * 4. Clicking button invokes addMatchToSlip / addMatchCardToBetslip
 * 5. Selection is added to Active Betslip Builder (window.appState.betslip)
 * 6. Betslip count updates accurately
 * 7. Total odds are recalculated accurately
 * 8. Existing selections are preserved
 * 9. Duplicate selections are handled cleanly (updated & highlighted without duplicate entries)
 * 10. Bet Generator workspace & routes operate completely independently
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('=== DeepPredictBet: Add to Slip Button & Betslip Integration Test Suite ===\n');

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${desc}: ${err.message}`);
  }
}

// 1. Static Audit
console.log('--- Suite 1: Static Codebase Audit ---');

const pagesJsContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'pages.js'), 'utf8');
const publicPagesJsContent = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'pages.js'), 'utf8');

it('js/pages.js contains NO instances of "Add to Bet Generator"', () => {
  assert(!pagesJsContent.includes('Add to Bet Generator'), 'Must not contain "Add to Bet Generator"');
});

it('public/js/pages.js contains NO instances of "Add to Bet Generator"', () => {
  assert(!publicPagesJsContent.includes('Add to Bet Generator'), 'Must not contain "Add to Bet Generator"');
});

it('Match Detail action toolbar contains button with "➕ Add to Slip"', () => {
  assert(pagesJsContent.includes('➕') && pagesJsContent.includes('Add to Slip'), 'Should have "➕ Add to Slip" label');
  assert(pagesJsContent.includes('id="match-detail-add-slip-btn"'), 'Should have match-detail-add-slip-btn id');
});

it('Button styling matches specification: blue background, white text, rounded corners', () => {
  assert(pagesJsContent.includes('background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'), 'Must have blue background');
  assert(pagesJsContent.includes('color: #ffffff'), 'Must have white text');
  assert(pagesJsContent.includes('border-radius: 10px'), 'Must have rounded corners');
  assert(pagesJsContent.includes('font-weight: 800'), 'Must have clear, bold typography');
});

it('js/pages.js exports window.addMatchToSlip', () => {
  assert(pagesJsContent.includes('window.addMatchToSlip = addMatchToSlip;'), 'Must export addMatchToSlip');
});

// 2. DOM & Functional Simulation
console.log('\n--- Suite 2: Functional Betslip Integration & State Management ---');

const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const dom = new JSDOM(htmlContent, {
  url: 'https://deeppredictbet.com/match/101',
  runScripts: 'outside-only'
});

const win = dom.window;
global.window = win;
global.document = win.document;
global.localStorage = win.localStorage;

// Mock test match data
win.MATCH_DATA = [
  {
    id: '101',
    homeTeam: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
    awayTeam: { name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
    league: 'Premier League',
    tip: 'Arsenal Win (1)',
    odds: 1.85,
    confidence: 68,
    isLive: false
  },
  {
    id: '102',
    homeTeam: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
    awayTeam: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
    league: 'La Liga',
    tip: 'Over 2.5 Goals',
    odds: 1.70,
    confidence: 74,
    isLive: false
  }
];

win.appState = {
  betslip: []
};

// Load app.js and pages.js into the jsdom context
const appJsContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
win.eval(appJsContent);
win.eval(pagesJsContent);

it('renderMatchDetailPage successfully renders the match detail view with "➕ Add to Slip" button', () => {
  const container = win.document.getElementById('view-match-detail');
  assert(container, 'view-match-detail element must exist');
  win.renderMatchDetailPage('101');

  const btn = win.document.getElementById('match-detail-add-slip-btn');
  assert(btn, 'match-detail-add-slip-btn must be present in DOM');
  assert(btn.textContent.includes('Add to Slip'), 'Button text must contain "Add to Slip"');
  assert(btn.textContent.includes('➕'), 'Button text must include plus icon');
  assert(!btn.textContent.includes('Bet Generator'), 'Button must NOT mention Bet Generator');
});

it('Clicking "➕ Add to Slip" adds match 101 to Active Betslip Builder without opening Bet Generator', () => {
  let navigatedRoute = null;
  win.navigateTo = function(route) {
    navigatedRoute = route;
  };

  const btn = win.document.getElementById('match-detail-add-slip-btn');
  btn.click();

  // Verify Bet Generator was NOT opened
  assert.strictEqual(navigatedRoute, null, 'Must NOT navigate to Bet Generator');

  // Verify Active Betslip Builder contains the selection
  assert.strictEqual(win.appState.betslip.length, 1, 'Betslip must have exactly 1 selection');
  assert.strictEqual(win.appState.betslip[0].matchId, '101', 'Must match fixture ID 101');
  assert.strictEqual(win.appState.betslip[0].match.homeTeam.name, 'Arsenal');
});

it('Betslip count badge updates to "1"', () => {
  const badge = win.document.getElementById('betslip-count-badge');
  assert(badge, 'betslip-count-badge must exist');
  assert.strictEqual(badge.textContent.trim(), '1', 'Badge must display "1"');
});

it('Floating betslip drawer opens automatically on add', () => {
  const drawer = win.document.getElementById('floating-betslip-drawer');
  assert(drawer.classList.contains('open'), 'Betslip drawer should have class "open"');
});

it('Adding a second distinct match preserves first selection and recalculates total odds', () => {
  // Render second match detail
  win.renderMatchDetailPage('102');
  const btn2 = win.document.getElementById('match-detail-add-slip-btn');
  assert(btn2, 'Button must exist for match 102');
  btn2.click();

  assert.strictEqual(win.appState.betslip.length, 2, 'Betslip must now contain 2 selections');
  assert.strictEqual(win.appState.betslip[0].matchId, '101', 'First selection must be preserved');
  assert.strictEqual(win.appState.betslip[1].matchId, '102', 'Second selection must be added');

  const badge = win.document.getElementById('betslip-count-badge');
  assert.strictEqual(badge.textContent.trim(), '2', 'Badge must update to "2"');

  // Total odds check: 1.85 * 1.70 = 3.145 -> ~3.15
  const expectedCombinedOdds = (1.85 * 1.70).toFixed(2);
  const headerOdds = win.document.getElementById('betslip-header-odds');
  assert(headerOdds.textContent.includes(expectedCombinedOdds), `Header odds should show @${expectedCombinedOdds}, got: ${headerOdds.textContent}`);
});

it('Duplicate selection rule: adding match 101 again does not create a duplicate entry', () => {
  win.renderMatchDetailPage('101');
  const btn1 = win.document.getElementById('match-detail-add-slip-btn');
  btn1.click();

  assert.strictEqual(win.appState.betslip.length, 2, 'Betslip must still contain exactly 2 selections (no duplicate)');
  assert.strictEqual(win.appState.betslip[0].matchId, '101');
  assert.strictEqual(win.appState.betslip[1].matchId, '102');
});

it('Independent Bet Generator workspace remains intact and operational', () => {
  assert(typeof win.switchTool === 'function' || win.document.getElementById('tool-tab-machine'), 'Bet generator tabs exist');
  const cardGenerator = win.document.querySelector('.card-theme-generator');
  assert(cardGenerator, 'Command Center Bet Generator card must remain in DOM');
  assert(cardGenerator.getAttribute('onclick').includes('/generator'), 'Bet Generator card points to /generator');
});

console.log(`\n========================================`);
console.log(`Test Results: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
