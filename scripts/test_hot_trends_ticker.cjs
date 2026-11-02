const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log('================================================================');
console.log('🧪 RUNNING HOT TRENDS TICKER & UPCOMING EVENTS TEST SUITE');
console.log('================================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}: ${details}`);
    process.exitCode = 1;
  }
}

// 1. Load HTML into JSDOM without auto-running embedded network scripts
const htmlContent = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(htmlContent, {
  url: 'https://deeppredictbet.com/'
});

const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

// Set simulated time to current metadata
const SIMULATED_NOW = new Date('2026-11-02T21:31:07+01:00').getTime();
window.__HOT_TRENDS_TEST_NOW__ = SIMULATED_NOW;

// Load teamCrests.js, data.js, ui.js, app.js
require('../js/teamCrests.js');
require('../js/data.js');
require('../js/ui.js');
require('../js/app.js');

// Run renderTrends()
window.renderTrends();

const tickerContainer = window.document.getElementById('trends-ticker-container');
assert(tickerContainer !== null, 'Hot Trends ticker container exists in DOM');

const tickerItems = tickerContainer.querySelectorAll('.ticker-item');
assert(tickerItems.length > 0, `Hot Trends ticker has rendered items (found ${tickerItems.length})`);

// TEST 1: No raw image URLs appear in visible textContent
let rawUrlFound = false;
tickerItems.forEach(item => {
  const text = item.textContent;
  if (/https?:\/\//i.test(text) || /api-sports\.io/i.test(text) || /\.png\b/i.test(text)) {
    rawUrlFound = true;
    console.error('Leaked raw URL in text:', text);
  }
});
assert(!rawUrlFound, 'TEST 1: No raw image URLs appear in HOT TRENDS visible text');

// TEST 2: Authentic club crests display correctly via <img> tags
let allHaveCrests = true;
let crestCount = 0;
tickerItems.forEach(item => {
  const imgs = item.querySelectorAll('img.ticker-team-crest');
  if (imgs.length < 2) {
    allHaveCrests = false;
  }
  imgs.forEach(img => {
    crestCount++;
    const src = img.getAttribute('src');
    if (!src || !src.startsWith('https://media.api-sports.io/football/teams/')) {
      allHaveCrests = false;
      console.error('Invalid crest source:', src);
    }
  });
});
assert(allHaveCrests && crestCount >= tickerItems.length * 2, `TEST 2: Authentic club crests display correctly (found ${crestCount} crest images)`);

// TEST 3: Only upcoming fixtures are selected
const trends = window.getDynamicHotTrends();
let allUpcoming = true;
trends.forEach(t => {
  if (t.timeStr && t.timeStr.includes('LIVE')) return;
  if (t.timeStr && (t.timeStr.includes('Sep') || t.timeStr.includes('Oct'))) {
    allUpcoming = false;
    console.error('Expired fixture detected in trends:', t.headline, t.homeName, 'vs', t.awayName, t.timeStr);
  }
});
assert(allUpcoming, 'TEST 3: Only upcoming fixtures are selected (no Sep/Oct past dates)');

// TEST 4: Completed and expired fixtures are excluded
let completedIncluded = false;
trends.forEach(t => {
  const matchStr = `${t.homeName} vs ${t.awayName}`.toLowerCase();
  if (matchStr.includes('fulham') && matchStr.includes('chelsea')) completedIncluded = true;
  if (matchStr.includes('liverpool') && matchStr.includes('bournemouth')) completedIncluded = true;
  if (matchStr.includes('tottenham') && matchStr.includes('brentford')) completedIncluded = true;
  if (matchStr.includes('aston villa') && matchStr.includes('wolves')) completedIncluded = true;
});
assert(!completedIncluded, 'TEST 4: Completed and settled fixtures are strictly excluded from ticker');

// TEST 5: Ticker headlines are accurate and relevant (Major derbies and competitions present)
const headlines = trends.map(t => t.headline);
console.log('Top Ticker Headlines:', headlines);
const hasDerby = headlines.some(h => h.includes('DERBY') || h.includes('CLÁSICO') || h.includes('KLASSIKER') || h.includes('SHOWDOWN'));
const hasUCL = headlines.some(h => h.includes('CHAMPIONS LEAGUE') || h.includes('PREMIER LEAGUE'));
assert(hasDerby && hasUCL, 'TEST 5: Ticker headlines accurately prioritize derbies and major competitions');

// TEST 6: Club names and crests are correctly associated
let crestAssociationCorrect = true;
trends.forEach(t => {
  if (!t.homeCrestHtml.includes('img') || !t.awayCrestHtml.includes('img')) {
    crestAssociationCorrect = false;
  }
});
assert(crestAssociationCorrect, 'TEST 6: Club names and crests are correctly associated with valid HTML');

// TEST 7: No raw technical market codes in insights
let hasRawTechCode = false;
trends.forEach(t => {
  if (/\buo\d{2}\b/i.test(t.insight) || /\bbtts\d{1}h\b/i.test(t.insight)) {
    hasRawTechCode = true;
    console.error('Raw tech code in insight:', t.insight);
  }
});
assert(!hasRawTechCode, 'TEST 7: No raw technical market codes in insights');

// TEST 8: Empty state handling when no upcoming fixtures exist
const savedMatchData = window.MATCH_DATA;
const savedAuthData = window.AUTHENTIC_TOP_LEAGUES_FIXTURES;
window.MATCH_DATA = [];
window.AUTHENTIC_TOP_LEAGUES_FIXTURES = [];
window.TOP_LEAGUES_FIXTURES_POOL = [];

window.renderTrends();
const emptyContainer = window.document.getElementById('trends-ticker-container');
const emptySpan = emptyContainer.querySelector('.ticker-empty');
assert(emptySpan !== null && emptySpan.textContent.includes('Monitoring live feeds'), 'TEST 8: Sensible empty state rendered when no upcoming fixtures exist');

// Restore data and re-render
window.MATCH_DATA = savedMatchData;
window.AUTHENTIC_TOP_LEAGUES_FIXTURES = savedAuthData;
window.renderTrends();

// TEST 9: Seamless loop structure
const totalRendered = tickerContainer.querySelectorAll('.ticker-item').length;
assert(totalRendered === trends.length * 3, `TEST 9: Items correctly triplicated for seamless 3-way infinite loop (got ${totalRendered})`);

// TEST 10: Static fallback in index.html is valid and free of raw URLs
const indexHtml = fs.readFileSync('index.html', 'utf8');
const staticTickerPart = indexHtml.slice(indexHtml.indexOf('id="trends-ticker-container"'), indexHtml.indexOf('<!-- --- DEEPPREDICTBET COMMAND CENTER SECTION --- -->'));
const staticHasRawUrl = /https?:\/\/[^\s"'<>]+\.png(?=[^>]*<(?!\/img))/i.test(staticTickerPart);
assert(!staticHasRawUrl, 'TEST 10: index.html static markup does not leak raw image URLs as text');

console.log('================================================================');
console.log(`🏁 HOT TRENDS TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
