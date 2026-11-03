/**
 * test_settled_predictions_crests.cjs
 * Comprehensive test suite verifying authentic club crest rendering, layout,
 * and zero raw image URLs as text in Recent Settled Predictions.
 */

const assert = require('assert');
const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('🧪 Starting DeepPredictBet Recent Settled Predictions Test Suite...\n');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// 1. Setup DOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <div class="settled-picks-container">
    <div class="settled-picks-header">
      <span class="settled-picks-meta" id="settled-picks-sample-info"></span>
    </div>
    <div class="settled-picks-grid" id="settled-picks-grid"></div>
  </div>
</body></html>`, { url: 'https://deeppredictbet.com/' });

const { window } = dom;
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};
window.localStorage = global.localStorage;

// 2. Load dependencies
const dataCode = fs.readFileSync('js/data.js', 'utf8');
window.eval(dataCode);
global.MATCH_DATA = window.MATCH_DATA;

const crestsCode = fs.readFileSync('js/teamCrests.js', 'utf8');
window.eval(crestsCode);
global.TeamCrestRegistry = window.TeamCrestRegistry;
global.resolveTeamCrestUrl = window.resolveTeamCrestUrl;
global.renderTeamLogoHtml = window.renderTeamLogoHtml;

const ledgerCode = fs.readFileSync('js/predictionLedger.js', 'utf8');
window.eval(ledgerCode);
global.PredictionSettlementLedger = window.PredictionSettlementLedger;

const uiCode = fs.readFileSync('js/ui.js', 'utf8');
window.eval(uiCode);

console.log('--- 1. Render Recent Settled Predictions & Overall Counts ---');
window.renderRecentSettledPredictions();
const grid = document.getElementById('settled-picks-grid');
const meta = document.getElementById('settled-picks-sample-info');
const cards = grid.querySelectorAll('.settled-pick-card');

it('Renders exactly 6 audited settled prediction cards', () => {
  assert.strictEqual(cards.length, 6, `Expected 6 cards, got ${cards.length}`);
});

it('Sample info displays exact 6 audited outcomes with 3 Won, 3 Lost', () => {
  assert.ok(
    meta.textContent.includes('6') && meta.textContent.includes('3 Won, 3 Lost'),
    `Unexpected meta: ${meta.textContent}`
  );
});

console.log('\n--- 2. CRITICAL AUDIT: Zero Raw Image URLs as Text ---');
it('No raw image URLs (http, .png, api-sports) appear anywhere as visible text in the grid', () => {
  // Check the text content of the entire grid
  const visibleText = grid.textContent;
  const rawUrlRegex = /https?:\/\/media\.api-sports\.io[^\s<]*/i;
  const match = visibleText.match(rawUrlRegex);
  assert.strictEqual(match, null, `Found raw image URL in visible text: ${match ? match[0] : ''}`);
  assert.ok(!visibleText.includes('.png'), 'Visible text must not include .png file extensions');
});

console.log('\n--- 3. Verification of 6 Specific Settled Fixtures ---');

// Expected fixtures (authoritative 2 November 2026 settled predictions)
const expectedFixtures = [
  {
    fixture: 'Manchester United vs Chelsea',
    homeName: 'Manchester United',
    awayName: 'Chelsea',
    homeId: 33,
    awayId: 49,
    score: '1 - 1',
    status: 'WON',
    odds: '1.75',
    conf: '85%'
  },
  {
    fixture: 'Barcelona vs Espanyol',
    homeName: 'Barcelona',
    awayName: 'Espanyol',
    homeId: 529,
    awayId: 540,
    score: '3 - 1',
    status: 'WON',
    odds: '1.70',
    conf: '88%'
  },
  {
    fixture: 'Bournemouth vs Manchester City',
    homeName: 'Bournemouth',
    awayName: 'Manchester City',
    homeId: 35,
    awayId: 50,
    score: '2 - 1',
    status: 'LOST',
    odds: '1.52',
    conf: '86%'
  },
  {
    fixture: 'Bayern Munich vs Union Berlin',
    homeName: 'Bayern Munich',
    awayName: 'Union Berlin',
    homeId: 157,
    awayId: 182,
    score: '3 - 0',
    status: 'WON',
    odds: '1.85',
    conf: '84%'
  },
  {
    fixture: 'Newcastle United vs Arsenal',
    homeName: 'Newcastle United',
    awayName: 'Arsenal',
    homeId: 34,
    awayId: 42,
    score: '1 - 0',
    status: 'LOST',
    odds: '1.55',
    conf: '78%'
  },
  {
    fixture: 'Napoli vs Atalanta',
    homeName: 'Napoli',
    awayName: 'Atalanta',
    homeId: 492,
    awayId: 499,
    score: '0 - 3',
    status: 'LOST',
    odds: '2.05',
    conf: '76%'
  }
];

expectedFixtures.forEach((exp, idx) => {
  it(`Card ${idx + 1} (${exp.fixture}): Verified official crests, score, and settlement`, () => {
    const card = cards[idx];
    assert.ok(card, `Card ${idx + 1} must exist`);

    // Check status class
    assert.ok(
      card.classList.contains(exp.status === 'WON' ? 'won' : 'lost'),
      `Card ${idx + 1} should have class ${exp.status === 'WON' ? 'won' : 'lost'}`
    );

    // Check crests
    const imgs = card.querySelectorAll('img.settled-team-crest');
    assert.strictEqual(imgs.length, 2, `Card ${idx + 1} must have exactly 2 crest images`);

    const homeImg = imgs[0];
    const awayImg = imgs[1];

    // Home crest
    assert.ok(
      homeImg.src.includes(`/teams/${exp.homeId}.png`),
      `Home crest for ${exp.homeName} must be /teams/${exp.homeId}.png, got ${homeImg.src}`
    );
    assert.strictEqual(homeImg.alt, exp.homeName);

    // Away crest
    assert.ok(
      awayImg.src.includes(`/teams/${exp.awayId}.png`),
      `Away crest for ${exp.awayName} must be /teams/${exp.awayId}.png, got ${awayImg.src}`
    );
    assert.strictEqual(awayImg.alt, exp.awayName);

    // Score pill
    const scorePill = card.querySelector('.settled-score-pill');
    assert.ok(scorePill, `Card ${idx + 1} must contain .settled-score-pill`);
    assert.strictEqual(scorePill.textContent.trim(), exp.score);

    // Status badge
    const badge = card.querySelector('.settled-status-badge');
    assert.ok(badge, `Card ${idx + 1} must contain .settled-status-badge`);
    assert.ok(badge.textContent.includes(exp.status));

    // Odds and Conf
    const oddsEl = card.querySelector('.settled-tip-odds');
    assert.ok(oddsEl.textContent.includes(exp.odds), `Odds must contain ${exp.odds}`);
    assert.ok(oddsEl.textContent.includes(exp.conf), `Confidence must contain ${exp.conf}`);
  });
});

console.log('\n--- 4. Layout & Proportions Inspection ---');
it('Each card adheres strictly to TOP ROW, MIDDLE SECTION, and BOTTOM SECTION', () => {
  cards.forEach((card, idx) => {
    const header = card.querySelector('.settled-card-header');
    assert.ok(header, `Card ${idx + 1} missing .settled-card-header`);
    assert.ok(header.querySelector('.settled-league-tag'), `Card ${idx + 1} missing .settled-league-tag`);
    assert.ok(header.querySelector('.settled-time-tag'), `Card ${idx + 1} missing .settled-time-tag`);

    const middle = card.querySelector('.settled-teams-wrap');
    assert.ok(middle, `Card ${idx + 1} missing .settled-teams-wrap`);
    assert.ok(middle.querySelector('.settled-teams'), `Card ${idx + 1} missing .settled-teams`);
    assert.ok(middle.querySelector('.settled-score-pill'), `Card ${idx + 1} missing .settled-score-pill`);

    const bottom = card.querySelector('.settled-pick-detail');
    assert.ok(bottom, `Card ${idx + 1} missing .settled-pick-detail`);
    assert.ok(bottom.querySelector('.settled-tip-info'), `Card ${idx + 1} missing .settled-tip-info`);
    assert.ok(bottom.querySelector('.settled-status-badge'), `Card ${idx + 1} missing .settled-status-badge`);
  });
});

console.log('\n--- 5. Static index.html Markup Verification ---');
it('index.html static markup contains authentic crest images and zero raw URL text', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  assert.ok(indexHtml.includes('/football/teams/33.png'), 'Static index.html must reference Manchester United crest');
  assert.ok(indexHtml.includes('/football/teams/49.png'), 'Static index.html must reference Chelsea crest');
  assert.ok(indexHtml.includes('class="settled-team-crest"'), 'Static index.html must have settled-team-crest class');
  
  // Verify no raw URL text in index.html settled cards
  const settledSection = indexHtml.split('id="settled-picks-grid"')[1].split('<!-- Footer CTA')[0];
  // Regex finding any text node that starts with http
  const rawTextInSpan = />\s*https?:\/\/[^<]+</i;
  assert.ok(!rawTextInSpan.test(settledSection), 'Static HTML must never contain raw URLs inside tags');
});

console.log('\n==================================================');
console.log(`SETTLED PREDICTIONS TEST RESULTS: ${passCount} passed, ${failCount} failed.`);
console.log('==================================================\n');

if (failCount > 0) {
  process.exit(1);
}
