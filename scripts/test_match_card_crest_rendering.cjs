const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ PASS: ${desc}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
  }
}

console.log('🧪 Starting Match Card Crest Rendering & Team Identity Test Suite...\n');

// 1. Setup JSDOM
const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><div id="fixtures-container"></div></body></html>`, {
  runScripts: "dangerously",
  resources: "usable",
  url: "https://deeppredictbet.com"
});

const { window } = dom;
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.HTMLElement = window.HTMLElement;

// Load TeamCrests
const teamCrestsCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'teamCrests.js'), 'utf8');
window.eval(teamCrestsCode);
const { TeamCrestRegistry, resolveTeamIdentity, resolveTeamCrestUrl, renderTeamLogoHtml, NEUTRAL_CREST_PLACEHOLDER } = window;

// Load Data
const dataCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
window.eval(dataCode);

// Load League Normalizer
const normalizerCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'leagueNormalizer.js'), 'utf8');
window.eval(normalizerCode);

// Load UI
const uiCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf8');
window.eval(uiCode);

console.log('--- Test Suite 1: Clean HTML Generation & No Leaked Text ---');

it('NEUTRAL_CREST_PLACEHOLDER is Base64 and contains zero quotes or angle brackets', () => {
  if (!NEUTRAL_CREST_PLACEHOLDER.startsWith('data:image/svg+xml;base64,')) {
    throw new Error('NEUTRAL_CREST_PLACEHOLDER is not Base64 encoded');
  }
  if (NEUTRAL_CREST_PLACEHOLDER.includes('"') || NEUTRAL_CREST_PLACEHOLDER.includes('<') || NEUTRAL_CREST_PLACEHOLDER.includes('>')) {
    throw new Error('NEUTRAL_CREST_PLACEHOLDER contains unsafe characters for HTML attributes');
  }
});

it('renderTeamLogoHtml for Manchester City generates clean markup without leaking loading="lazy">', () => {
  const html = renderTeamLogoHtml('Manchester City', true, 36);
  const container = window.document.createElement('div');
  container.innerHTML = html;

  if (container.textContent.includes('loading="lazy">') || container.textContent.includes('loading=')) {
    throw new Error(`Leaked HTML text detected in textContent: "${container.textContent}"`);
  }
  if (container.children.length !== 1) {
    throw new Error(`Expected exactly 1 child element, found ${container.children.length}`);
  }
  const img = container.children[0];
  if (img.tagName !== 'IMG') {
    throw new Error(`Expected tag IMG, got ${img.tagName}`);
  }
  if (img.getAttribute('loading') !== 'lazy') {
    throw new Error(`Expected loading attribute to be "lazy", got "${img.getAttribute('loading')}"`);
  }
  if (!img.getAttribute('src').includes('/50.png')) {
    throw new Error(`Expected Manchester City crest URL to contain 50.png, got ${img.getAttribute('src')}`);
  }
});

it('renderTeamLogoHtml for Fulham generates clean markup without leaking text', () => {
  const html = renderTeamLogoHtml('Fulham', false, 36);
  const container = window.document.createElement('div');
  container.innerHTML = html;

  if (container.textContent.trim() !== '') {
    throw new Error(`Unexpected text content in logo container: "${container.textContent}"`);
  }
  const img = container.children[0];
  if (!img.getAttribute('src').includes('/36.png')) {
    throw new Error(`Expected Fulham crest URL to contain 36.png, got ${img.getAttribute('src')}`);
  }
});

console.log('\n--- Test Suite 2: Match Card Team Identity Structure ---');

it('buildMatchCardElement renders 4-row layout: Role Label, Crest, Name, Form', () => {
  const sampleMatch = {
    id: 'test_mci_ful',
    fixtureId: 99901,
    league: 'Premier League',
    leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    time: '15:00',
    homeTeam: { name: 'Manchester City', id: 50, form: ['W', 'W', 'D', 'W', 'W'] },
    awayTeam: { name: 'Fulham', id: 36, form: ['L', 'W', 'D', 'L', 'D'] },
    predictions: { home: 68, draw: 20, away: 12 },
    confidence: 'high',
    confidenceVal: 88,
    scores: { home: null, away: null }
  };

  const card = window.buildMatchCardElement(sampleMatch);
  const cardHtml = card.outerHTML;

  // Assert no leaked HTML text
  if (card.textContent.includes('loading="lazy">') || card.textContent.includes('loading=')) {
    throw new Error(`Card text contains leaked loading="lazy"> attribute: "${card.textContent}"`);
  }

  // Assert home and away sections
  const homeSection = card.querySelector('.team.home-team');
  const awaySection = card.querySelector('.team.away-team');
  if (!homeSection || !awaySection) {
    throw new Error('Missing .team.home-team or .team.away-team in card markup');
  }

  // Assert HOME TEAM and AWAY TEAM labels
  const homeRole = homeSection.querySelector('.team-role-label');
  const awayRole = awaySection.querySelector('.team-role-label');
  if (!homeRole || homeRole.textContent.trim() !== 'HOME TEAM') {
    throw new Error(`Expected home role label "HOME TEAM", got "${homeRole ? homeRole.textContent : 'null'}"`);
  }
  if (!awayRole || awayRole.textContent.trim() !== 'AWAY TEAM') {
    throw new Error(`Expected away role label "AWAY TEAM", got "${awayRole ? awayRole.textContent : 'null'}"`);
  }

  // Assert Crests in .team-logo
  const homeLogo = homeSection.querySelector('.team-logo img');
  const awayLogo = awaySection.querySelector('.team-logo img');
  if (!homeLogo || !homeLogo.src.includes('/50.png')) {
    throw new Error(`Home crest missing or wrong URL: ${homeLogo ? homeLogo.src : 'null'}`);
  }
  if (!awayLogo || !awayLogo.src.includes('/36.png')) {
    throw new Error(`Away crest missing or wrong URL: ${awayLogo ? awayLogo.src : 'null'}`);
  }

  // Assert Team Names
  const homeNameEl = homeSection.querySelector('.team-name');
  const awayNameEl = awaySection.querySelector('.team-name');
  if (!homeNameEl || homeNameEl.textContent.trim() !== 'Manchester City') {
    throw new Error(`Home team name wrong: ${homeNameEl ? homeNameEl.textContent : 'null'}`);
  }
  if (!awayNameEl || awayNameEl.textContent.trim() !== 'Fulham') {
    throw new Error(`Away team name wrong: ${awayNameEl ? awayNameEl.textContent : 'null'}`);
  }

  // Assert VS Divider
  const vsDivider = card.querySelector('.vs-divider');
  if (!vsDivider) {
    throw new Error('Missing .vs-divider');
  }
  const vsText = vsDivider.querySelector('.vs-text');
  if (!vsText || vsText.textContent.trim() !== 'VS') {
    throw new Error(`Expected .vs-text to be "VS", got "${vsText ? vsText.textContent : 'null'}"`);
  }

  // Assert Form Badges
  const homeBadges = homeSection.querySelectorAll('.form-badge');
  const awayBadges = awaySection.querySelectorAll('.form-badge');
  if (homeBadges.length !== 5 || awayBadges.length !== 5) {
    throw new Error(`Expected 5 form badges per team, got home: ${homeBadges.length}, away: ${awayBadges.length}`);
  }
});

console.log('\n--- Test Suite 3: Central Registry & Fallback Isolation ---');

it('Unresolvable team cleanly falls back to NEUTRAL_CREST_PLACEHOLDER, never Liverpool or Arsenal', () => {
  const unknownLogoHtml = renderTeamLogoHtml('Totally Unknown Team FC 99999', true, 36);
  if (unknownLogoHtml.includes('40.png') || unknownLogoHtml.includes('42.png')) {
    throw new Error('Fell back to Liverpool (40) or Arsenal (42)!');
  }
  if (!unknownLogoHtml.includes(NEUTRAL_CREST_PLACEHOLDER)) {
    throw new Error('Did not fallback to NEUTRAL_CREST_PLACEHOLDER');
  }
});

console.log(`\n========================================`);
console.log(`RESULTS: ${passedTests}/${totalTests} Tests Passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
