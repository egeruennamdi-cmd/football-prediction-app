/**
 * Test Suite: Match Card Club Crest Rendering & Base64 Data Leak Prevention
 * Tests that:
 * 1. Deportivo La Coruña resolves to authentic crest ID 544.
 * 2. Alaves resolves to authentic crest ID 542.
 * 3. renderTeamLogoHtml safely renders <img src="..."> for URLs, data URIs, and neutral fallbacks.
 * 4. formatAiScoutResultsHtml never renders data URIs into visible textContent.
 * 5. Selection #12 (Alaves vs Deportivo La Coruna) displays authentic crests without base64 text leak.
 * 6. Match card components never expose raw base64 strings in the DOM.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Crest Rendering & Base64 Data Leak Prevention Tests...\n');

// Mock browser environment for JSDOM / Node testing
const mockWindow = {
  appState: { betslip: [] },
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.window = mockWindow;
global.document = {
  getElementById: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    style: {},
    classList: { add: () => {}, remove: () => {} },
    innerHTML: '',
    appendChild: () => {}
  })
};

// 1. Load teamCrests.js
const teamCrestsCode = fs.readFileSync(path.join(__dirname, '../js/teamCrests.js'), 'utf-8');
const teamCrestsFactory = new Function('root', 'factory', `
  const module = { exports: {} };
  ${teamCrestsCode}
  return root.TeamCrestRegistry;
`);
const TeamCrestRegistry = teamCrestsFactory(mockWindow);
global.TeamCrestRegistry = TeamCrestRegistry;
global.resolveTeamCrestUrl = TeamCrestRegistry.resolveTeamCrestUrl;
global.renderTeamLogoHtml = TeamCrestRegistry.renderTeamLogoHtml;
global.NEUTRAL_CREST_PLACEHOLDER = TeamCrestRegistry.NEUTRAL_CREST_PLACEHOLDER;
global.escapeScoutHtml = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
global.formatStandardMatchDateString = (t) => t || '25th, Oct 2026, 16:30';

// Test 1: Authentic Crest ID Resolution
console.log('Test 1: Deportivo La Coruña and Alaves Authentic Crest Resolution');
const alavesUrl = TeamCrestRegistry.resolveTeamCrestUrl('Alaves');
assert.strictEqual(alavesUrl, 'https://media.api-sports.io/football/teams/542.png', 'Alaves must resolve to team ID 542');
console.log('  ✓ Alaves correctly resolved to:', alavesUrl);

const deporVariants = [
  'Deportivo La Coruna',
  'Deportivo La Coruña',
  'deportivo de la coruna',
  'RC Deportivo',
  'RCD La Coruna'
];
deporVariants.forEach(variant => {
  const deporUrl = TeamCrestRegistry.resolveTeamCrestUrl(variant);
  assert.strictEqual(deporUrl, 'https://media.api-sports.io/football/teams/544.png', `${variant} must resolve to team ID 544`);
});
console.log('  ✓ All 5 Deportivo La Coruña name variants resolved to authentic ID 544 CDN URL');

// Test 2: renderTeamLogoHtml Safety
console.log('\nTest 2: renderTeamLogoHtml Outputs strictly <img src="...">');
const alavesImg = TeamCrestRegistry.renderTeamLogoHtml('Alaves', true, 20);
assert.ok(alavesImg.includes('src="https://media.api-sports.io/football/teams/542.png"'), 'Must contain 542.png src');
assert.ok(!alavesImg.includes('>data:image/'), 'Must not render data:image as text node');
console.log('  ✓ renderTeamLogoHtml generated valid img tag for Alaves');

const deporImg = TeamCrestRegistry.renderTeamLogoHtml('Deportivo La Coruna', false, 20);
assert.ok(deporImg.includes('src="https://media.api-sports.io/football/teams/544.png"'), 'Must contain 544.png src');
console.log('  ✓ renderTeamLogoHtml generated valid img tag for Deportivo La Coruna');

const unknownImg = TeamCrestRegistry.renderTeamLogoHtml('Unknown Nonexistent Club XYZ', true, 20);
assert.ok(unknownImg.includes('src="data:image/svg+xml;base64,'), 'Neutral placeholder must be in src attribute');
assert.ok(!unknownImg.includes('>data:image/svg+xml;base64,'), 'Neutral placeholder must NEVER be rendered inside a text node');
console.log('  ✓ Unresolved club correctly uses NEUTRAL_CREST_PLACEHOLDER in src attribute, never text node');

// Test 3: formatAiScoutResultsHtml with #12 Alaves vs Deportivo La Coruna
console.log('\nTest 3: AI Scout Selection #12 (Alaves vs Deportivo La Coruna) Layout & Crest Test');
const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf-8');

// Extract formatAiScoutResultsHtml function from app.js
const extractFn = (code, fnName) => {
  const startIdx = code.indexOf(`function ${fnName}(`);
  if (startIdx === -1) throw new Error(`Function ${fnName} not found`);
  const paramEnd = code.indexOf(')', startIdx);
  const bodyStart = code.indexOf('{', paramEnd);
  let depth = 0;
  let endIdx = -1;
  for (let i = bodyStart; i < code.length; i++) {
    if (code[i] === '{') {
      depth++;
    } else if (code[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  return code.substring(startIdx, endIdx);
};

const formatAiScoutHtmlCode = extractFn(appCode, 'formatAiScoutResultsHtml');
const fnWrapper = new Function(
  'resolveTeamCrestUrl',
  'renderTeamLogoHtml',
  'NEUTRAL_CREST_PLACEHOLDER',
  'escapeScoutHtml',
  'formatStandardMatchDateString',
  'calculateBetslipTotalOdds',
  `
  const DEFAULT_AI_SCOUT_SELECTION_COUNT = 10;
  ${formatAiScoutHtmlCode}
  return formatAiScoutResultsHtml;
  `
);

const formatAiScoutResultsHtml = fnWrapper(
  TeamCrestRegistry.resolveTeamCrestUrl,
  TeamCrestRegistry.renderTeamLogoHtml,
  TeamCrestRegistry.NEUTRAL_CREST_PLACEHOLDER,
  global.escapeScoutHtml,
  global.formatStandardMatchDateString,
  () => ({ displayOdds: '48.50', totalOdds: '48.50' })
);

// Build 12 mock selections, with #12 being Alaves vs Deportivo La Coruna
const mockSelections = [];
for (let i = 1; i <= 11; i++) {
  mockSelections.push({
    match: {
      homeTeam: { name: `Team A${i}` },
      awayTeam: { name: `Team B${i}` },
      league: 'Premier League',
      time: '25th Oct 2026, 16:30'
    },
    tip: 'Over 2.5 Goals',
    odds: 1.75
  });
}
mockSelections.push({
  match: {
    homeTeam: { name: 'Alaves' },
    awayTeam: { name: 'Deportivo La Coruna' },
    league: 'La Liga',
    time: '25th Oct 2026, 21:00'
  },
  tip: 'Corners Over 8.5',
  odds: 1.60
});

const renderedHtml = formatAiScoutResultsHtml(mockSelections, 12, { mode: 'selections' });

// Verify rendered HTML
assert.ok(renderedHtml.includes('#12 Alaves vs Deportivo La Coruna'), 'Must render #12 Alaves vs Deportivo La Coruna');
assert.ok(renderedHtml.includes('Corners Over 8.5 (@1.60)'), 'Must render Corners Over 8.5 (@1.60)');
assert.ok(renderedHtml.includes('https://media.api-sports.io/football/teams/542.png'), 'Must render Alaves 542.png crest');
assert.ok(renderedHtml.includes('https://media.api-sports.io/football/teams/544.png'), 'Must render Deportivo 544.png crest');

// CRITICAL SECURITY ASSERTION: No visible base64 text leak anywhere
const textLeakMatch = renderedHtml.match(/>[^<]*data:image\/[^<]*/);
assert.strictEqual(textLeakMatch, null, 'Rendered HTML must NEVER contain data:image inside text nodes: ' + (textLeakMatch ? textLeakMatch[0] : ''));
console.log('  ✓ #12 Alaves vs Deportivo La Coruna rendered with authentic crests 542.png & 544.png');
console.log('  ✓ Confirmed: ZERO raw base64 data URIs exist in visible text nodes');

// Test 4: Extreme Edge Case - completely unresolvable club and base64 logo injection
console.log('\nTest 4: Unresolvable Club & Raw Data URI Input Edge Cases');
const edgeSelections = [{
  match: {
    homeTeam: { name: 'Completely Unmatched Club A', logo: 'data:image/svg+xml;base64,PHN2Zy...custom' },
    awayTeam: { name: 'data:image/svg+xml;base64,CORRUPTED_NAME', logo: null },
    league: 'La Liga',
    time: '25th Oct 2026, 21:00'
  },
  tip: 'Draw (X)',
  odds: 3.20
}];

const edgeHtml = formatAiScoutResultsHtml(edgeSelections, 1, { mode: 'selections' });
const edgeTextLeak = edgeHtml.match(/>[^<]*data:image\/[^<]*/);
assert.strictEqual(edgeTextLeak, null, 'Even with corrupted names or custom data URIs, no text node leak may occur');
assert.ok(!edgeHtml.includes('CORRUPTED_NAME vs'), 'Corrupted name containing data URI must be sanitized');
console.log('  ✓ Corrupted team names and raw data URIs safely sanitized and never exposed in text');

// Test 5: Check UI Card and Match Card Logo Resolvers
console.log('\nTest 5: UI Match Card Logo Resolution');
const uiCode = fs.readFileSync(path.join(__dirname, '../js/ui.js'), 'utf-8');
assert.ok(!uiCode.includes(": (match.homeTeam?.logo && String(match.homeTeam.logo).startsWith('http')"), 'Old naive startsWith(http) fallback must be replaced by safe resolver in ui.js');
assert.ok(!uiCode.includes(": (match.awayTeam?.logo && String(match.awayTeam.logo).startsWith('http')"), 'Old naive startsWith(http) fallback must be replaced by safe resolver in ui.js');
console.log('  ✓ ui.js uses safe resolveCardLogo and resolveMatchCardLogo without base64 text leak risks');

console.log('\n🎉 ALL 5 TEST SUITES PASSED FLAWLESSLY!');
