/**
 * DEEPPREDICTBET — DATA INTEGRITY & COMPETITION ISOLATION TEST SUITE
 *
 * Mandatory verification test covering:
 * 1. Albania Superliga crest integrity: KF Tirana & Partizani Tirana must resolve to authentic crests, NEVER Liverpool or Arsenal.
 * 2. CAF Champions League isolation: resolves official competition ID 12, contains only African clubs, NEVER Aston Villa or Galatasaray.
 * 3. UEFA Champions League isolation: resolves competition ID 2, contains European clubs, NEVER African clubs.
 * 4. Neutral Crest Placeholder fallback: unresolvable teams produce neutral SVG, NEVER Liverpool (40) or Arsenal (42).
 * 5. Strict Independent Home/Away identity resolution.
 * 6. Match filtering by competition without cross-competition leakage.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('🧪 RUNNING DEEPPREDICTBET FOOTBALL DATA INTEGRITY & COMPETITION ISOLATION TEST SUITE...\n');

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
  }
}

// 1. Setup JSDOM environment with required scripts
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

// Load Live Fixtures
const liveFixturesCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'liveFixtures.js'), 'utf8');
window.eval(liveFixturesCode);

// Load UI
const uiCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf8');
window.eval(uiCode);

// ─────────────────────────────────────────────────────────────────────────────
console.log('--- TEST SUITE 1: ALBANIA SUPERLIGA TEAM IDENTITY & AUTHENTIC CRESTS ---');

it('KF Tirana resolves to its own authentic crest (Wikimedia SVG), NOT Liverpool (40)', () => {
  const url = resolveTeamCrestUrl('KF Tirana', true);
  assert.ok(url.includes('Tirana_Club_Logo.svg'), `Expected Tirana SVG crest, got: ${url}`);
  assert.strictEqual(url.includes('40.png'), false, 'KF Tirana must NEVER resolve to Liverpool crest (40.png)');
  assert.strictEqual(url.includes('42.png'), false, 'KF Tirana must NEVER resolve to Arsenal crest (42.png)');
});

it('Partizani Tirana resolves to its own authentic crest (Wikimedia SVG), NOT Arsenal (42)', () => {
  const url = resolveTeamCrestUrl('Partizani Tirana', false);
  assert.ok(url.includes('Partizani_Tirana_Club_Logo.svg'), `Expected Partizani SVG crest, got: ${url}`);
  assert.strictEqual(url.includes('40.png'), false, 'Partizani Tirana must NEVER resolve to Liverpool crest (40.png)');
  assert.strictEqual(url.includes('42.png'), false, 'Partizani Tirana must NEVER resolve to Arsenal crest (42.png)');
});

it('KF Tirana vs Partizani Tirana fixture resolves authentic independent crests for both clubs', () => {
  const fixture = {
    homeTeam: { name: 'KF Tirana' },
    awayTeam: { name: 'Partizani Tirana' },
    league: 'Superliga',
    country: 'Albania'
  };
  const homeIdentity = TeamCrestRegistry.resolveTeamIdentity(fixture.homeTeam, { isHome: true, country: 'Albania', competition: 'Superliga' });
  const awayIdentity = TeamCrestRegistry.resolveTeamIdentity(fixture.awayTeam, { isHome: false, country: 'Albania', competition: 'Superliga' });

  assert.strictEqual(homeIdentity.officialName, 'KF Tirana');
  assert.ok(homeIdentity.crestUrl.includes('Tirana_Club_Logo.svg'));
  assert.strictEqual(homeIdentity.crestUrl.includes('40.png'), false);

  assert.strictEqual(awayIdentity.officialName, 'Partizani Tirana');
  assert.ok(awayIdentity.crestUrl.includes('Partizani_Tirana_Club_Logo.svg'));
  assert.strictEqual(awayIdentity.crestUrl.includes('42.png'), false);
});

it('Other Albanian clubs (Vllaznia, Egnatia, Dinamo City) resolve authentic crests', () => {
  const vllaznia = resolveTeamCrestUrl('Vllaznia Shkodër', true);
  assert.ok(vllaznia.includes('Vllaznia_Shkod%C3%ABr_Club_Logo.svg'));
  assert.strictEqual(vllaznia.includes('40.png'), false);

  const egnatia = resolveTeamCrestUrl('Egnatia Rrogozhinë', true);
  assert.ok(egnatia.includes('Egnatia_Rrogozhin%C3%AB_club_logo.svg'));
  assert.strictEqual(egnatia.includes('40.png'), false);
});

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 2: CAF CHAMPIONS LEAGUE ISOLATION & OFFICIAL COMPETITION ID ---');

it('CAF Champions League resolves official API competition ID 12 in League Normalizer', () => {
  const norm = window.resolveCanonicalCompetition('CAF Champions League', 'Africa');
  assert.ok(norm !== null, 'CAF Champions League must normalize to a canonical competition');
  assert.strictEqual(norm.id, 12, `Expected CAF Champions League ID 12, got: ${norm.id}`);
  assert.strictEqual(norm.name, 'CAF Champions League');
  assert.strictEqual(norm.country, 'Africa');
});

it('getApiLeagueId resolves CAF Champions League to ID 12 and NEVER ID 2 (UEFA)', () => {
  const id = window.getApiLeagueId('CAF Champions League', 'Africa');
  assert.strictEqual(id, 12, `Expected API ID 12, got: ${id}`);
  assert.notStrictEqual(id, 2, 'CAF Champions League must NEVER return UCL ID 2');
});

it('getClubsForLeague("CAF Champions League") returns African clubs, NEVER European clubs', () => {
  const clubs = window.getClubsForLeague('CAF Champions League', 'Africa');
  assert.ok(clubs.length >= 2, 'Must return at least 2 clubs');
  const clubNames = clubs.map(c => c.name);

  // European clubs must NEVER appear in CAF
  assert.strictEqual(clubNames.includes('Aston Villa'), false, 'Aston Villa must NEVER appear in CAF Champions League');
  assert.strictEqual(clubNames.includes('Galatasaray'), false, 'Galatasaray must NEVER appear in CAF Champions League');
  assert.strictEqual(clubNames.includes('Liverpool'), false, 'Liverpool must NEVER appear in CAF Champions League');
  assert.strictEqual(clubNames.includes('Arsenal'), false, 'Arsenal must NEVER appear in CAF Champions League');
  assert.strictEqual(clubNames.includes('Real Madrid'), false, 'Real Madrid must NEVER appear in CAF Champions League');

  // Must contain authentic African clubs
  assert.ok(clubNames.some(n => n.includes('Al Ahly') || n.includes('Sundowns') || n.includes('Espérance') || n.includes('Mazembe') || n.includes('Raja') || n.includes('Wydad')), 'Must contain authentic African clubs');
});

it('African clubs (Al Ahly, Sundowns, Espérance) resolve authentic African crests', () => {
  const alAhly = resolveTeamCrestUrl('Al Ahly', true);
  assert.strictEqual(alAhly, 'https://media.api-sports.io/football/teams/1041.png', 'Al Ahly must resolve to official CDN ID 1041');

  const sundowns = resolveTeamCrestUrl('Mamelodi Sundowns', true);
  assert.strictEqual(sundowns, 'https://media.api-sports.io/football/teams/1026.png', 'Sundowns must resolve to official CDN ID 1026');

  const esperance = resolveTeamCrestUrl('Espérance de Tunis', true);
  assert.strictEqual(esperance, 'https://media.api-sports.io/football/teams/1042.png', 'Espérance must resolve to official CDN ID 1042');
});

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 3: UEFA CHAMPIONS LEAGUE ISOLATION ---');

it('UEFA Champions League resolves official ID 2 and does NOT collide with CAF', () => {
  const norm = window.resolveCanonicalCompetition('Champions League', 'Europe');
  assert.strictEqual(norm.id, 2);
  assert.strictEqual(norm.country, 'Europe');

  const uclClubs = window.getClubsForLeague('Champions League', 'Europe');
  const uclNames = uclClubs.map(c => c.name);
  assert.ok(uclNames.includes('Real Madrid') || uclNames.includes('Bayern Munich') || uclNames.includes('Barcelona'));
  assert.strictEqual(uclNames.includes('Al Ahly'), false, 'African club must not be in UCL');
  assert.strictEqual(uclNames.includes('KF Tirana'), false, 'KF Tirana must not be in UCL baseline');
});

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 4: NEUTRAL PLACEHOLDER INTEGRITY & FALLBACK GUARDS ---');

it('Unresolvable club produces neutral SVG placeholder, NEVER Liverpool or Arsenal', () => {
  const unknownHome = resolveTeamCrestUrl('Completely Unknown FC 999', true);
  assert.ok(unknownHome.startsWith('data:image/svg+xml'), 'Must return neutral SVG data URI');
  assert.strictEqual(unknownHome.includes('40.png'), false, 'Must not be Liverpool (40)');
  assert.strictEqual(unknownHome.includes('42.png'), false, 'Must not be Arsenal (42)');

  const unknownAway = resolveTeamCrestUrl('Unknown United 888', false);
  assert.ok(unknownAway.startsWith('data:image/svg+xml'), 'Must return neutral SVG data URI');
  assert.strictEqual(unknownAway.includes('40.png'), false, 'Must not be Liverpool (40)');
  assert.strictEqual(unknownAway.includes('42.png'), false, 'Must not be Arsenal (42)');
});

it('renderTeamLogoHtml onerror cleanly substitutes NEUTRAL_CREST_PLACEHOLDER, NOT 40.png / 42.png', () => {
  const html = renderTeamLogoHtml('KF Tirana', true, 36);
  assert.ok(html.includes('onerror="this.onerror=null;this.src=\'data:image/svg+xml'), 'onerror must use neutral SVG placeholder');
  assert.strictEqual(html.includes("this.src='https://media.api-sports.io/football/teams/40.png'"), false, 'onerror must NEVER fall back to Liverpool (40)');
  assert.strictEqual(html.includes("this.src='https://media.api-sports.io/football/teams/42.png'"), false, 'onerror must NEVER fall back to Arsenal (42)');
});

it('renderTeamLogoHtml for KF Tirana includes authentic SVG src and correct alt', () => {
  const html = renderTeamLogoHtml('KF Tirana', true, 36);
  assert.ok(html.includes('src="https://upload.wikimedia.org/wikipedia/en/0/0e/Tirana_Club_Logo.svg"'));
  assert.ok(html.includes('alt="KF Tirana"'));
});

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- TEST SUITE 5: MATCH FILTERING & COMPETITION ISOLATION ---');

it('AUTHENTIC_TOP_LEAGUES_FIXTURES includes authentic CAF and Albania fixtures', () => {
  const pool = window.AUTHENTIC_TOP_LEAGUES_FIXTURES;
  const cafFixtures = pool.filter(m => m.league === 'CAF Champions League');
  assert.ok(cafFixtures.length >= 2, `Expected at least 2 CAF fixtures, found ${cafFixtures.length}`);
  cafFixtures.forEach(m => {
    assert.strictEqual(m.league, 'CAF Champions League');
    assert.strictEqual(m.homeTeam.name !== 'Aston Villa' && m.awayTeam.name !== 'Aston Villa', true, 'Aston Villa cannot be in CAF fixture');
    assert.strictEqual(m.homeTeam.name !== 'Galatasaray' && m.awayTeam.name !== 'Galatasaray', true, 'Galatasaray cannot be in CAF fixture');
  });

  const albFixtures = pool.filter(m => (m.country === 'Albania' || m.league === 'Superliga') && m.id.startsWith('alb-'));
  assert.ok(albFixtures.length >= 2, `Expected at least 2 Albania fixtures, found ${albFixtures.length}`);
  const tiranaMatch = albFixtures.find(m => m.homeTeam.name === 'KF Tirana' && m.awayTeam.name === 'Partizani Tirana');
  assert.ok(tiranaMatch !== undefined, 'Must find KF Tirana vs Partizani Tirana fixture');
  assert.ok(tiranaMatch.homeTeam.logo.includes('Tirana_Club_Logo.svg'));
  assert.ok(tiranaMatch.awayTeam.logo.includes('Partizani_Tirana_Club_Logo.svg'));
});

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n==================================================');
console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
if (passedTests === totalTests) {
  console.log('🏁 ALL DATA INTEGRITY & COMPETITION ISOLATION TESTS PASSED 100%!');
  process.exit(0);
} else {
  console.error(`💥 ${totalTests - passedTests} TESTS FAILED!`);
  process.exit(1);
}
