/**
 * test_legal_direct_urls.cjs
 * Comprehensive verification for Direct URLs to "Terms", "Privacy", and "Disclaimer"
 * and non-regression of existing application capabilities.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('\n======================================================');
console.log(' LEGAL DIRECT URLS & MODAL INTEGRATION TEST SUITE');
console.log('======================================================\n');

const ROOT_DIR = __dirname;
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const routerJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'router.js'), 'utf8');
const uiJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'ui.js'), 'utf8');
const termsHtml = fs.readFileSync(path.join(ROOT_DIR, 'terms.html'), 'utf8');
const privacyHtml = fs.readFileSync(path.join(ROOT_DIR, 'privacy.html'), 'utf8');
const disclaimerHtml = fs.readFileSync(path.join(ROOT_DIR, 'disclaimer.html'), 'utf8');
const respGamblingHtml = fs.readFileSync(path.join(ROOT_DIR, 'responsible-gambling.html'), 'utf8');

// 1. Direct URLs in index.html (Desktop & Mobile)
runTest('Desktop footer contains direct URL href="/terms"', () => {
  assert(indexHtml.includes('href="/terms"'), 'Expected href="/terms" in index.html');
});

runTest('Desktop footer contains direct URL href="/privacy"', () => {
  assert(indexHtml.includes('href="/privacy"'), 'Expected href="/privacy" in index.html');
});

runTest('Desktop footer contains direct URL href="/disclaimer"', () => {
  assert(indexHtml.includes('href="/disclaimer"'), 'Expected href="/disclaimer" in index.html');
});

runTest('Desktop footer contains direct URL href="/responsible-gambling"', () => {
  assert(indexHtml.includes('href="/responsible-gambling"'), 'Expected href="/responsible-gambling" in index.html');
});

runTest('Footer links support modifier clicks (Ctrl/Cmd/Shift) for opening in new tab', () => {
  assert(indexHtml.includes('!event.ctrlKey && !event.metaKey && !event.shiftKey'), 'Expected modifier click check for tab opening');
});

// 2. Support Modal in index.html
runTest('Support modal includes dedicated "Disclaimer" tab button', () => {
  assert(indexHtml.includes('id="supp-tab-disclaimer"'), 'Expected #supp-tab-disclaimer in index.html');
  assert(indexHtml.includes("switchSupportTab('disclaimer')"), 'Expected switchSupportTab call for disclaimer');
});

runTest('Support modal includes dedicated "Disclaimer" content pane', () => {
  assert(indexHtml.includes('id="supp-pane-disclaimer"'), 'Expected #supp-pane-disclaimer in index.html');
  assert(indexHtml.includes('Analytical &amp; Statistical Disclaimer'), 'Expected disclaimer disclosures heading');
  assert(indexHtml.includes('not a bookmaker, sportsbook, or betting operator'), 'Expected non-bookmaker notice in disclaimer pane');
});

// 3. Router JS Route Configs
runTest('js/router.js configures /terms, /privacy, and /disclaimer routes', () => {
  assert(routerJs.includes("'/terms': {"), 'Expected /terms in ROUTE_CONFIGS');
  assert(routerJs.includes("'/privacy': {"), 'Expected /privacy in ROUTE_CONFIGS');
  assert(routerJs.includes("'/disclaimer': {"), 'Expected /disclaimer in ROUTE_CONFIGS');
  assert(routerJs.includes("'/responsible-gambling': {"), 'Expected /responsible-gambling in ROUTE_CONFIGS');
});

runTest('js/router.js maps routes to supportModalTab properties', () => {
  assert(routerJs.includes("supportModalTab: 'terms'"), 'Expected supportModalTab terms');
  assert(routerJs.includes("supportModalTab: 'privacy'"), 'Expected supportModalTab privacy');
  assert(routerJs.includes("supportModalTab: 'disclaimer'"), 'Expected supportModalTab disclaimer');
});

runTest('js/router.js supports hash redirects for legacy anchors', () => {
  assert(routerJs.includes("'#terms': '/terms'"), 'Expected #terms hash redirect');
  assert(routerJs.includes("'#privacy': '/privacy'"), 'Expected #privacy hash redirect');
  assert(routerJs.includes("'#disclaimer': '/disclaimer'"), 'Expected #disclaimer hash redirect');
});

// 4. UI JS Tab Handlers
runTest('js/ui.js includes "disclaimer" in switchSupportTab()', () => {
  assert(uiJs.includes("'disclaimer'"), 'Expected disclaimer tab registered in switchSupportTab');
});

runTest('js/ui.js handles "disclaimer" in openSupportModal()', () => {
  assert(uiJs.includes("activeTab === 'disclaimer'"), 'Expected disclaimer condition in openSupportModal');
});

runTest('js/ui.js restores root pathname on modal close', () => {
  assert(uiJs.includes("window.history.pushState(null, '', '/')"), 'Expected history.pushState restore on modal close');
});

// 5. Standalone Legal HTML Pages
runTest('terms.html has valid canonical URL and metadata', () => {
  assert(termsHtml.includes('<link rel="canonical" href="https://deeppredictbet.com/terms">'), 'Valid canonical URL in terms.html');
  assert(termsHtml.includes('<title>Terms and Conditions of Use — DeepPredictBet</title>'), 'Valid title in terms.html');
  assert(termsHtml.includes('Return to DeepPredictBet App'), 'Return to App link in terms.html');
});

runTest('privacy.html has valid canonical URL and metadata', () => {
  assert(privacyHtml.includes('<link rel="canonical" href="https://deeppredictbet.com/privacy">'), 'Valid canonical URL in privacy.html');
  assert(privacyHtml.includes('<title>Privacy Policy &amp; Data Security'), 'Valid title in privacy.html');
  assert(privacyHtml.includes('Zero Bet Slip Surveillance'), 'Zero bet-slip surveillance pledge in privacy.html');
});

runTest('disclaimer.html has valid canonical URL and metadata', () => {
  assert(disclaimerHtml.includes('<link rel="canonical" href="https://deeppredictbet.com/disclaimer">'), 'Valid canonical URL in disclaimer.html');
  assert(disclaimerHtml.includes('<title>Analytical &amp; Statistical Disclaimer'), 'Valid title in disclaimer.html');
  assert(disclaimerHtml.includes('DeepPredictBet is NOT a bookmaker'), 'Not a bookmaker declaration in disclaimer.html');
});

runTest('responsible-gambling.html has valid canonical URL and helpline resources', () => {
  assert(respGamblingHtml.includes('<link rel="canonical" href="https://deeppredictbet.com/responsible-gambling">'), 'Valid canonical in responsible-gambling.html');
  assert(respGamblingHtml.includes('GamCare') || respGamblingHtml.includes('National Problem Gambling Helpline'), 'Helplines listed');
});

// 6. Public and Dist Verification
runTest('Dist and Public directories contain standalone HTML files and index.html subdirs', () => {
  const publicFiles = [
    'public/terms.html',
    'public/terms/index.html',
    'public/privacy.html',
    'public/privacy/index.html',
    'public/disclaimer.html',
    'public/disclaimer/index.html',
    'public/responsible-gambling.html',
    'public/responsible-gambling/index.html',
    'dist/terms.html',
    'dist/privacy.html',
    'dist/disclaimer.html',
    'dist/responsible-gambling.html'
  ];
  for (const file of publicFiles) {
    const fullPath = path.join(ROOT_DIR, file);
    assert(fs.existsSync(fullPath), `Missing required build artifact: ${file}`);
  }
});

console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('\x1b[32m✔ ALL LEGAL DIRECT URL TESTS PASSED!\x1b[0m\n');
} else {
  console.log('\x1b[31m✖ SOME TESTS FAILED.\x1b[0m\n');
}
