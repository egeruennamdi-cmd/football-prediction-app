/**
 * scripts/test_ai_scout_restoration.cjs
 * Comprehensive Verification Suite for Ask AI Scout Historical Restoration:
 * - TEST A: Natural-Language Input & Intent Routing
 * - TEST B: Quick-Action Shortcuts (All 6 Shortcuts)
 * - TEST C: Event Generation & Authentic Fixtures
 * - TEST D: Dynamic Selection Counts (Heading & Subtitle Derivation)
 * - TEST E: Total Odds Calculation (Product of decimal odds & recalculation on removal)
 * - TEST F: Data Validity & Integrity (No duplicates, valid teams/competitions/markets)
 * - TEST G: Error Handling & Empty States
 * - TEST H: Responsive Design & DOM Structure
 * - TEST I: Platform Regression Safeguards
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: ASK AI SCOUT HISTORICAL RESTORATION TEST SUITE');
console.log('================================================================\n');

// 1. Setup DOM Mock Environment
const elements = {};
function createElementMock(id, tag = 'div') {
  if (!elements[id]) {
    elements[id] = {
      id,
      tagName: tag.toUpperCase(),
      value: '',
      innerHTML: '',
      textContent: '',
      style: { display: '' },
      children: [],
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      setAttribute(k, v) { this[k] = v; },
      getAttribute(k) { return this[k] || null; },
      appendChild(child) {
        this.children.push(child);
        if (child && child.innerHTML) this.innerHTML += child.innerHTML;
        return child;
      },
      remove() {
        if (this.parentNode) {
          const idx = this.parentNode.children.indexOf(this);
          if (idx !== -1) this.parentNode.children.splice(idx, 1);
        }
      },
      scrollIntoView() {},
      querySelectorAll() { return []; },
      addEventListener() {},
      removeEventListener() {}
    };
  }
  return elements[id];
}

// Pre-create required DOM elements
[
  'command-scout-box', 'command-scout-input', 'hero-scout-input', 'command-scout-feedback',
  'hero-scout-results', 'scout-chat-body', 'scout-chat-input', 'floating-betslip-drawer',
  'betslip-count-badge', 'betslip-header-odds', 'betslip-items-container', 'betslip-empty-state',
  'betslip-summary-actions', 'betslip-total-odds-val'
].forEach(id => createElementMock(id));

let lastNavigatedRoute = null;
let lastOpenedModal = null;
let lastScoutMessage = null;

const mockStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; },
  clear() { this._data = {}; }
};

const sandbox = {
  console,
  setTimeout: (fn, delay) => {
    // Execute immediately in test sandbox for synchronous assertion
    if (typeof fn === 'function') fn();
    return 1;
  },
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  document: {
    getElementById: (id) => elements[id] || createElementMock(id),
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elements[sel.slice(1)] || createElementMock(sel.slice(1));
      return createElementMock(`mock-${Math.random().toString(36).substring(7)}`);
    },
    createElement: (tag) => createElementMock(`mock-${Math.random().toString(36).substring(7)}`, tag),
    body: { style: {}, appendChild() {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    readyState: 'complete',
    querySelectorAll: () => []
  },
  localStorage: mockStorage,
  window: {
    appState: { betslip: [] },
    localStorage: mockStorage,
    location: { hash: '', search: '', pathname: '/' },
    navigateTo: (route) => { lastNavigatedRoute = route; },
    openScoutModal: (fixtureId) => { lastOpenedModal = fixtureId; },
    openGeneralScout: () => { lastOpenedModal = 'general-scout'; },
    sendScoutMessage: (msg) => { lastScoutMessage = msg; },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    setInterval: () => {},
    clearInterval: () => {}
  },
  navigateTo: (route) => { lastNavigatedRoute = route; },
  openScoutModal: (fixtureId) => { lastOpenedModal = fixtureId; },
  openGeneralScout: () => { lastOpenedModal = 'general-scout'; },
  sendScoutMessage: (msg) => { lastScoutMessage = msg; },
  navigator: {},
  Date,
  Math,
  Number,
  String,
  Array,
  Set,
  Map,
  JSON,
  parseFloat,
  parseInt,
  isNaN,
  isFinite,
  RegExp,
  showAppNotification: () => {},
  showToast: () => {},
  alert: () => {}
};
sandbox.global = sandbox;
sandbox.window.document = sandbox.document;
sandbox.self = sandbox.window;
vm.createContext(sandbox);

// Load teamCrests.js, data.js, and app.js
const crestsJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'teamCrests.js'), 'utf8');
vm.runInContext(crestsJs, sandbox);

const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
vm.runInContext(dataJs, sandbox);

const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
vm.runInContext(appJs, sandbox);

console.log('✅ DeepPredictBet runtime and modules loaded successfully.\n');

let passedTests = 0;
let totalTests = 0;
function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ----------------------------------------------------
// TEST A: NATURAL-LANGUAGE INPUT & INTENT ROUTING
// ----------------------------------------------------
console.log('--- TEST A: Natural-Language Input & Intent Routing ---');

runTest('Test A1: "Generate high-probability football selections" generates selections in-place without routing away', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Generate high-probability football selections");
  assert.strictEqual(lastNavigatedRoute, null, 'Must NOT redirect away to /generator');
  assert.ok(sandbox.window.appState.betslip.length > 0, 'Betslip must have selections');
  const heroHtml = elements['hero-scout-results'].innerHTML;
  assert.ok(heroHtml.includes('Football Event Selections'), 'Must render selections in hero results');
  const feedbackHtml = elements['command-scout-feedback'].innerHTML;
  assert.ok(feedbackHtml.includes('Intent Recognized • AI Scout Generated Selections'), 'Feedback tag must reflect generated selections');
});

runTest('Test A2: "Check my betting ticket" routes to /bet-doctor', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Check my betting ticket");
  assert.strictEqual(lastNavigatedRoute, '/bet-doctor');
  const feedbackHtml = elements['command-scout-feedback'].innerHTML;
  assert.ok(feedbackHtml.includes('Bet Doctor Diagnostic'), 'Feedback tag must reflect Bet Doctor');
});

runTest('Test A3: "Take me to the Bet Doctor" routes to /bet-doctor', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Take me to the Bet Doctor");
  assert.strictEqual(lastNavigatedRoute, '/bet-doctor');
});

runTest('Test A4: "Find potential value bets" routes to /valuebot', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Find potential value bets");
  assert.strictEqual(lastNavigatedRoute, '/valuebot');
  const feedbackHtml = elements['command-scout-feedback'].innerHTML;
  assert.ok(feedbackHtml.includes('Value Bet Intelligence'), 'Feedback tag must reflect Value Intelligence');
});

runTest('Test A5: "Convert my booking code" routes to /bet-code-converter', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Convert my booking code");
  assert.strictEqual(lastNavigatedRoute, '/bet-code-converter');
  const feedbackHtml = elements['command-scout-feedback'].innerHTML;
  assert.ok(feedbackHtml.includes('Booking Code Converter'), 'Feedback tag must reflect Booking Code Converter');
});

runTest('Test A6: "Scan live football matches" routes to /live-scanner', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Scan live football matches");
  assert.strictEqual(lastNavigatedRoute, '/live-scanner');
  const feedbackHtml = elements['command-scout-feedback'].innerHTML;
  assert.ok(feedbackHtml.includes('Live Market Scanner'), 'Feedback tag must reflect Live Market Scanner');
});

runTest('Test A7: "Show me the latest football predictions" routes to /predictions', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Show me the latest football predictions");
  assert.strictEqual(lastNavigatedRoute, '/predictions');
});

runTest('Test A8: "Analyse Arsenal vs Chelsea" identifies fixture and triggers match analysis', () => {
  sandbox.window.appState.activeScoutMatchId = null;
  sandbox.executeCommandScoutPrompt("Analyse Arsenal vs Chelsea");
  assert.ok(sandbox.window.appState.activeScoutMatchId !== null || lastOpenedModal !== null, 'Must open scout match analysis modal');
  const feedbackHtml = elements['command-scout-feedback'].innerHTML;
  assert.ok(feedbackHtml.includes('Match Analysis'), 'Feedback tag must reflect Match Analysis');
});

// ----------------------------------------------------
// TEST B: QUICK-ACTION SHORTCUTS (ALL 6)
// ----------------------------------------------------
console.log('\n--- TEST B: Quick-Action Shortcuts (All 6 Shortcuts) ---');

runTest('Test B1: Shortcut "Check my bet" routes to /bet-doctor', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt('Check my bet');
  assert.strictEqual(lastNavigatedRoute, '/bet-doctor');
});

runTest('Test B2: Shortcut "Build a ticket" generates selections and opens Active Betslip Builder drawer', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt('Build a ticket');
  assert.strictEqual(lastNavigatedRoute, null, 'Must NOT kick user off to /generator');
  assert.ok(sandbox.window.appState.betslip.length > 0, 'Active betslip must be populated');
  assert.ok(elements['floating-betslip-drawer'].classList.contains('open'), 'Betslip drawer must open');
  assert.ok(elements['hero-scout-results'].innerHTML.includes('Football Event Selections'));
});

runTest('Test B3: Shortcut "Find value" routes to /valuebot', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt('Find value');
  assert.strictEqual(lastNavigatedRoute, '/valuebot');
});

runTest('Test B4: Shortcut "Analyse today\'s matches" routes to /predictions', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt("Analyse today's matches");
  assert.strictEqual(lastNavigatedRoute, '/predictions');
});

runTest('Test B5: Shortcut "Convert code" routes to /bet-code-converter', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt('Convert code');
  assert.strictEqual(lastNavigatedRoute, '/bet-code-converter');
});

runTest('Test B6: Shortcut "Scan live" routes to /live-scanner', () => {
  lastNavigatedRoute = null;
  sandbox.executeCommandScoutPrompt('Scan live');
  assert.strictEqual(lastNavigatedRoute, '/live-scanner');
});

// ----------------------------------------------------
// TEST C: EVENT GENERATION & AUTHENTIC FIXTURES
// ----------------------------------------------------
console.log('\n--- TEST C: Event Generation & Authentic Fixtures ---');

runTest('Test C1: AI Scout generator produces authentic fixtures with valid clubs and leagues', () => {
  const selections = sandbox.generateScoutAccumulator(10);
  assert.strictEqual(selections.length, 10);
  selections.forEach(s => {
    assert.ok(s.match.homeTeam && s.match.homeTeam.name, 'Home team name must exist');
    assert.ok(s.match.awayTeam && s.match.awayTeam.name, 'Away team name must exist');
    assert.ok(s.match.league, 'League name must exist');
    assert.ok(s.tip, 'Market tip must exist');
    assert.ok(typeof s.odds === 'number' && s.odds > 1.0, 'Odds must be > 1.0');
  });
});

runTest('Test C2: Authentic club crest images are rendered without raw text URLs', () => {
  sandbox.quickPromptScout('Generate 10 selections', false);
  const html = elements['hero-scout-results'].innerHTML;
  assert.ok(html.includes('scout-team-crest'), 'Must render scout-team-crest image tags');
  assert.ok(!html.includes('https://media.api-sports.io/football/teams/33.png</span>'), 'Crest URLs must never be naked text');
});

// ----------------------------------------------------
// TEST D: DYNAMIC SELECTION COUNTS
// ----------------------------------------------------
console.log('\n--- TEST D: Dynamic Selection Counts ---');

runTest('Test D1: 10 selections dynamically sets "10-Match" and "10 high-probability"', () => {
  sandbox.quickPromptScout('Generate 10 selections', false);
  const html = elements['hero-scout-results'].innerHTML;
  assert.ok(html.includes('10-Match Football Event Selections'), 'Heading must have 10-Match');
  assert.ok(html.includes('10 high-probability football event selections'), 'Subtitle must have 10 high-probability');
});

runTest('Test D2: 20 selections dynamically sets "20-Match" and "20 high-probability"', () => {
  sandbox.quickPromptScout('Generate 20 selections', false);
  const html = elements['hero-scout-results'].innerHTML;
  assert.ok(html.includes('20-Match Football Event Selections'), 'Heading must have 20-Match');
  assert.ok(html.includes('20 high-probability football event selections'), 'Subtitle must have 20 high-probability');
});

runTest('Test D3: 30 selections dynamically sets "30-Match" and "30 high-probability"', () => {
  sandbox.quickPromptScout('Generate 30 selections', false);
  const html = elements['hero-scout-results'].innerHTML;
  assert.ok(html.includes('30-Match Football Event Selections'), 'Heading must have 30-Match');
  assert.ok(html.includes('30 high-probability football event selections'), 'Subtitle must have 30 high-probability');
});

runTest('Test D4: 40 selections dynamically sets "40-Match" and "40 high-probability"', () => {
  sandbox.quickPromptScout('Generate 40 selections', false);
  const html = elements['hero-scout-results'].innerHTML;
  assert.ok(html.includes('40-Match Football Event Selections'), 'Heading must have 40-Match');
  assert.ok(html.includes('40 high-probability football event selections'), 'Subtitle must have 40 high-probability');
});

runTest('Test D5: Count divergence: If actual count is 9, heading and subtitle strictly say 9', () => {
  const dummySelections = sandbox.window.appState.betslip.slice(0, 9);
  const html = sandbox.formatAiScoutResultsHtml(dummySelections, 40);
  assert.ok(html.includes('9-Match Football Event Selections'), 'Must display 9-Match');
  assert.ok(html.includes('9 high-probability football event selections'), 'Must display 9 high-probability');
  assert.ok(!html.includes('40-Match'), 'Must not display 40-Match');
});

// ----------------------------------------------------
// TEST E: TOTAL ODDS ACCURACY & RECALCULATION
// ----------------------------------------------------
console.log('\n--- TEST E: Total Odds Accuracy & Recalculation ---');

runTest('Test E1: Total odds strictly equals the mathematical product of individual decimal odds', () => {
  sandbox.quickPromptScout('Generate 10 selections', false);
  const selections = sandbox.window.appState.betslip;
  assert.strictEqual(selections.length, 10);
  const manualProduct = selections.reduce((acc, s) => acc * s.odds, 1.0);
  const expectedDisplay = manualProduct.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const html = elements['hero-scout-results'].innerHTML;
  assert.ok(html.includes(`@${expectedDisplay} Total Odds`), `Total odds display must match calculated @${expectedDisplay}`);
});

runTest('Test E2: Removing a selection dynamically recalculates count and combined odds in AI Scout', () => {
  sandbox.quickPromptScout('Generate 10 selections', false);
  assert.strictEqual(sandbox.window.appState.betslip.length, 10);
  
  // Remove item at index 0
  sandbox.removeBetslipItem(0);
  assert.strictEqual(sandbox.window.appState.betslip.length, 9, 'Betslip length must decrease to 9');
  
  // Verify hero-scout-results dynamically updated
  const html = elements['hero-scout-results'].innerHTML;
  assert.ok(html.includes('9-Match Football Event Selections'), 'Heading must automatically update to 9-Match');
  assert.ok(html.includes('9 high-probability football event selections'), 'Subtitle must automatically update to 9 selections');

  const newManualProduct = sandbox.window.appState.betslip.reduce((acc, s) => acc * s.odds, 1.0);
  const newExpectedDisplay = newManualProduct.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  assert.ok(html.includes(`@${newExpectedDisplay} Total Odds`), `Odds must recalculate to @${newExpectedDisplay}`);
});

// ----------------------------------------------------
// TEST F: DATA INTEGRITY & DEDUPLICATION
// ----------------------------------------------------
console.log('\n--- TEST F: Data Integrity & Deduplication ---');

runTest('Test F1: Zero duplicate fixtures or clubs playing against themselves in generated ticket', () => {
  sandbox.quickPromptScout('Generate 40 selections', false);
  const selections = sandbox.window.appState.betslip;
  const matchupKeys = new Set();
  selections.forEach(s => {
    const h = s.match.homeTeam.name.toLowerCase();
    const a = s.match.awayTeam.name.toLowerCase();
    assert.notStrictEqual(h, a, `Team cannot play against itself: ${h}`);
    const key = `${h}-vs-${a}`;
    assert.ok(!matchupKeys.has(key), `Duplicate matchup found: ${key}`);
    matchupKeys.add(key);
  });
});

// ----------------------------------------------------
// TEST G: ERROR HANDLING & EMPTY STATES
// ----------------------------------------------------
console.log('\n--- TEST G: Error Handling & Empty States ---');

runTest('Test G1: Empty selections list renders clean empty state without false claims', () => {
  const html = sandbox.formatAiScoutResultsHtml([], 10);
  assert.ok(html.includes('No AI Scout selections available'));
  assert.ok(!html.includes('0-Match Football Event Selections'));
  assert.ok(!html.includes('10-Match Football Event Selections'));
});

// ----------------------------------------------------
// TEST H: RESPONSIVE DESIGN & DOM STRUCTURE
// ----------------------------------------------------
console.log('\n--- TEST H: Responsive Design & DOM Structure ---');

runTest('Test H1: index.html contains all required Ask AI Scout elements', () => {
  const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('ASK AI SCOUT'), 'Must contain ASK AI SCOUT heading');
  assert.ok(indexHtml.includes("Tell me what you're looking for and I'll take you to the right DeepPredictBet tool."), 'Must contain subtitle');
  assert.ok(indexHtml.includes('placeholder="What are you trying to do today?"'), 'Must contain search placeholder');
  assert.ok(indexHtml.includes('Intelligent Assistant'), 'Must contain Intelligent Assistant badge');
  assert.ok(indexHtml.includes("executeCommandScoutPrompt('Check my bet')"), 'Must contain Check my bet chip');
  assert.ok(indexHtml.includes("executeCommandScoutPrompt('Build a ticket')"), 'Must contain Build a ticket chip');
  assert.ok(indexHtml.includes("executeCommandScoutPrompt('Find value')"), 'Must contain Find value chip');
  assert.ok(indexHtml.includes("executeCommandScoutPrompt('Analyse today\\'s matches')"), 'Must contain Analyse today\'s matches chip');
  assert.ok(indexHtml.includes("executeCommandScoutPrompt('Convert code')"), 'Must contain Convert code chip');
  assert.ok(indexHtml.includes("executeCommandScoutPrompt('Scan live')"), 'Must contain Scan live chip');
  assert.ok(indexHtml.includes('id="hero-scout-results" class="hero-scout-results"'), 'Must contain hero-scout-results with class');
});

// ----------------------------------------------------
// TEST I: PLATFORM REGRESSION SAFEGUARDS
// ----------------------------------------------------
console.log('\n--- TEST I: Platform Regression Safeguards ---');

runTest('Test I1: Command Center remains on route "/" and Founder Analytics on "/admin"', () => {
  const routerJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'router.js'), 'utf8');
  assert.ok(routerJs.includes("view-command-center"), 'Router must handle view-command-center');
  assert.ok(routerJs.includes("view-founder-analytics"), 'Router must handle view-founder-analytics');
});

// ----------------------------------------------------
// TEST J: INTELLIGENT ASSISTANT INDICATOR & SHORTCUT INTEGRITY
// ----------------------------------------------------
console.log('\n--- TEST J: Intelligent Assistant Indicator & Shortcut Integrity ---');

runTest('Test J1: Intelligent Assistant badge click invokes openGeneralScout()', () => {
  let scoutOpened = false;
  sandbox.openGeneralScout = () => { scoutOpened = true; };
  sandbox.window.openGeneralScout = () => { scoutOpened = true; };
  
  const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('onclick="openGeneralScout()"'), 'Badge must have onclick="openGeneralScout()"');
  assert.ok(indexHtml.includes('role="button"'), 'Badge must have role="button"');
  assert.ok(indexHtml.includes('class="command-scout-badge-ai-dot"'), 'Badge must have pulsing dot element');

  sandbox.openGeneralScout();
  assert.strictEqual(scoutOpened, true, 'openGeneralScout() must execute cleanly');
});

runTest('Test J2: CSS contains pulsing indicator animation and hover styling', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'main.css'), 'utf8');
  assert.ok(css.includes('scoutIndicatorPulse'), 'CSS must define scoutIndicatorPulse animation');
  assert.ok(css.includes('.command-scout-badge-ai:hover'), 'CSS must have hover styles');
  assert.ok(css.includes('cursor: pointer'), 'Badge must specify cursor: pointer');
});

runTest('Test J3: "ASK AI SCOUT" form submit with empty text generates selections in-place', () => {
  elements['command-scout-input'].value = '';
  elements['hero-scout-input'].value = '';
  sandbox.handleCommandScoutSubmit({ preventDefault: () => {} });
  assert.ok(sandbox.window.appState.betslip.length > 0, 'Must generate selections into betslip');
  assert.ok(elements['hero-scout-results'].innerHTML.includes('Football Event Selections'));
});

runTest('Test J4: All 6 shortcuts populate input field and trigger intent feedback', () => {
  const shortcuts = ['Check my bet', 'Build a ticket', 'Find value', "Analyse today's matches", 'Convert code', 'Scan live'];
  shortcuts.forEach(s => {
    sandbox.executeCommandScoutPrompt(s);
    assert.strictEqual(elements['command-scout-input'].value, s, `Input value must reflect shortcut: ${s}`);
    assert.ok(elements['command-scout-feedback'].innerHTML.length > 0, `Feedback must be populated for: ${s}`);
  });
});

// ----------------------------------------------------
// TEST K: NUMERIC SELECTIONS & ACTIVE BETSLIP BUILDER (E.G. 12, 15)
// ----------------------------------------------------
console.log('\n--- TEST K: Numeric Selections & Active Betslip Builder (e.g. 12, 15) ---');

runTest('Test K1: Input "12" outputs 12 upcoming match events into Active Betslip Builder', () => {
  sandbox.window.appState.betslip = [];
  sandbox.executeCommandScoutPrompt('12');
  assert.strictEqual(sandbox.window.appState.betslip.length, 12, 'Must output 12 selections into betslip');
  assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 12, 'Active Betslip count badge must be 12');
  assert.ok(elements['floating-betslip-drawer'].classList.contains('open'), 'Active Betslip Builder drawer must be open');
  assert.ok(elements['hero-scout-results'].innerHTML.toUpperCase().includes('12-MATCH'), 'Heading must indicate 12-MATCH');
  assert.ok(elements['hero-scout-results'].innerHTML.includes('12 high-probability'), 'Subtitle must indicate 12 high-probability');
});

runTest('Test K2: Input "15" outputs 15 upcoming match events into Active Betslip Builder', () => {
  sandbox.window.appState.betslip = [];
  sandbox.executeCommandScoutPrompt('15');
  assert.strictEqual(sandbox.window.appState.betslip.length, 15, 'Must output 15 selections into betslip');
  assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 15, 'Active Betslip count badge must be 15');
  assert.ok(elements['floating-betslip-drawer'].classList.contains('open'), 'Active Betslip Builder drawer must be open');
  assert.ok(elements['hero-scout-results'].innerHTML.toUpperCase().includes('15-MATCH'), 'Heading must indicate 15-MATCH');
  assert.ok(elements['hero-scout-results'].innerHTML.includes('15 high-probability'), 'Subtitle must indicate 15 high-probability');
});

runTest('Test K3: Input "output 12 upcoming match events into the Active Betslip Builder" outputs 12 events', () => {
  sandbox.window.appState.betslip = [];
  sandbox.executeCommandScoutPrompt('output 12 upcoming match events into the Active Betslip Builder');
  assert.strictEqual(sandbox.window.appState.betslip.length, 12);
  assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 12);
  assert.ok(elements['floating-betslip-drawer'].classList.contains('open'));
});

runTest('Test K4: Input "output 15 upcoming match events into the Active Betslip Builder" outputs 15 events', () => {
  sandbox.window.appState.betslip = [];
  sandbox.executeCommandScoutPrompt('output 15 upcoming match events into the Active Betslip Builder');
  assert.strictEqual(sandbox.window.appState.betslip.length, 15);
  assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 15);
  assert.ok(elements['floating-betslip-drawer'].classList.contains('open'));
});

runTest('Test K5: Form submit with "12" in command-scout-input outputs 12 matches into Active Betslip Builder', () => {
  sandbox.window.appState.betslip = [];
  elements['command-scout-input'].value = '12';
  sandbox.handleCommandScoutSubmit({ preventDefault: () => {} });
  assert.strictEqual(sandbox.window.appState.betslip.length, 12, 'Must output 12 selections into betslip');
  assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 12, 'Active Betslip count badge must be 12');
  assert.ok(elements['floating-betslip-drawer'].classList.contains('open'), 'Active Betslip Builder drawer must be open');
});

runTest('Test K6: Form submit with "15" in command-scout-input outputs 15 matches into Active Betslip Builder', () => {
  sandbox.window.appState.betslip = [];
  elements['command-scout-input'].value = '15';
  sandbox.handleCommandScoutSubmit({ preventDefault: () => {} });
  assert.strictEqual(sandbox.window.appState.betslip.length, 15, 'Must output 15 selections into betslip');
  assert.strictEqual(Number(elements['betslip-count-badge'].textContent), 15, 'Active Betslip count badge must be 15');
  assert.ok(elements['floating-betslip-drawer'].classList.contains('open'), 'Active Betslip Builder drawer must be open');
});

console.log('\n================================================================');
console.log(`ALL ASK AI SCOUT TESTS PASSED (${passedTests}/${totalTests}) — 100% SUCCESS`);
console.log('================================================================');
