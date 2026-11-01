/**
 * DEEPPREDICTBET — STRICT OFFICIAL FOOTBALL CLUB LOGO VERIFICATION SUITE
 *
 * Verifies all 7 Acceptance Criteria from user specification:
 * 1. Liverpool vs Arsenal displays exact Liverpool (40) and Arsenal (42) crests.
 * 2. Manchester City vs Arsenal displays authentic Manchester City (50) and Arsenal (42) crests.
 * 3. Logos change automatically when fixtures change (Real Madrid vs Barcelona, Bayern Munich vs Chelsea, etc.).
 * 4. Home and away club identities are resolved independently and never mixed up.
 * 5. No generic coloured circular balls or emojis appear where official crests are available.
 * 6. Downloaded match cards across all 5 formats (landscape, square, portrait, story, original) retain exact displayed logos.
 * 7. Existing live scores, match events, competition information, and AI Match Centre functionality remain 100% intact.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

async function runOfficialClubCrestTestSuite() {
  console.log('🧪 Starting DeepPredictBet Strict Official Football Club Logo Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // Setup simulated browser DOM
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="telegram-command-center-container"></div></body></html>', {
    url: 'https://deeppredictbet.com/admin/social',
    runScripts: 'dangerously'
  });

  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.HTMLElement = window.HTMLElement;
  global.Blob = window.Blob;
  global.URL = window.URL;
  window.alert = () => {};
  window.prompt = () => {};
  window.confirm = () => true;

  // Track created blob URLs and download clicks
  const downloadedFiles = [];
  window.URL.createObjectURL = (blob) => 'blob:https://deeppredictbet.com/' + Math.random().toString(36).slice(2);
  window.URL.revokeObjectURL = () => {};

  // Mock canvas in JSDOM
  const textElementsDrawn = [];
  const imagesDrawn = [];
  const canvasOperations = [];

  window.HTMLCanvasElement.prototype.getContext = function (contextType) {
    if (contextType === '2d') {
      const c = this;
      return {
        canvas: c,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: 'left',
        textBaseline: 'alphabetic',
        fillRect(x, y, w, h) { canvasOperations.push(['fillRect', x, y, w, h]); },
        strokeRect(x, y, w, h) { canvasOperations.push(['strokeRect', x, y, w, h]); },
        fillText(text, x, y) {
          textElementsDrawn.push({ text: String(text), x, y, width: c.width, height: c.height });
        },
        drawImage(img, x, y, w, h) {
          canvasOperations.push(['drawImage', img, x, y, w, h]);
          imagesDrawn.push({ img, x, y, w, h, canvasWidth: c.width, canvasHeight: c.height });
        },
        roundRect(x, y, w, h, r) {
          canvasOperations.push(['roundRect', x, y, w, h, r]);
        },
        beginPath() { canvasOperations.push(['beginPath']); },
        arc(x, y, r, s, e) { canvasOperations.push(['arc', x, y, r, s, e]); },
        stroke() { canvasOperations.push(['stroke']); },
        fill() { canvasOperations.push(['fill']); },
        moveTo(x, y) { canvasOperations.push(['moveTo', x, y]); },
        lineTo(x, y) { canvasOperations.push(['lineTo', x, y]); },
        save() {},
        restore() {},
        clip() {},
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
      };
    }
    return null;
  };

  window.HTMLCanvasElement.prototype.toDataURL = function (type, quality) {
    return `data:${type || 'image/png'};base64,mockCanvasData_${this.width}x${this.height}`;
  };

  window.HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
    const mime = type || 'image/png';
    const blob = new window.Blob([`mock_image_bytes_${this.width}x${this.height}`], { type: mime });
    callback(blob);
  };

  window.HTMLAnchorElement.prototype.click = function () {
    const href = this.getAttribute('href') || this.href;
    const download = this.getAttribute('download');
    if (download) downloadedFiles.push({ download, href });
  };

  // Load teamCrests.js and telegramPublisher.js into environment
  const crestsCode = fs.readFileSync(path.join(__dirname, 'js', 'teamCrests.js'), 'utf8');
  window.eval(crestsCode);

  const publisherCode = fs.readFileSync(path.join(__dirname, 'js', 'telegramPublisher.js'), 'utf8');
  window.eval(publisherCode);

  const TeamCrestRegistry = window.TeamCrestRegistry;
  const TelegramPublisher = window.TelegramPublisher;

  assert.ok(TeamCrestRegistry, 'TeamCrestRegistry must initialize');
  assert.ok(TelegramPublisher, 'TelegramPublisher must initialize');

  console.log('--- 1. Acceptance Test 1 & 2: Liverpool, Arsenal & Manchester City Crests ---');

  test('Liverpool vs Arsenal resolves exact official Liverpool (40) and Arsenal (42) crests', () => {
    const livUrl = TeamCrestRegistry.resolveTeamCrestUrl('Liverpool FC', true);
    const arsUrl = TeamCrestRegistry.resolveTeamCrestUrl('Arsenal FC', false);

    assert.strictEqual(livUrl, 'https://media.api-sports.io/football/teams/40.png');
    assert.strictEqual(arsUrl, 'https://media.api-sports.io/football/teams/42.png');
  });

  test('Manchester City vs Arsenal resolves exact official Man City (50) and Arsenal (42) crests', () => {
    const mciUrl = TeamCrestRegistry.resolveTeamCrestUrl('Manchester City', true);
    const arsUrl = TeamCrestRegistry.resolveTeamCrestUrl('Arsenal', false);

    assert.strictEqual(mciUrl, 'https://media.api-sports.io/football/teams/50.png');
    assert.strictEqual(arsUrl, 'https://media.api-sports.io/football/teams/42.png');
  });

  console.log('\n--- 2. Acceptance Test 3: Dynamic Crest Switching on Fixture Change ---');

  test('Logos change dynamically across all major clubs (Real Madrid, Barca, Bayern, Chelsea, Man Utd)', () => {
    // Real Madrid vs Barcelona
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Real Madrid', true), 'https://media.api-sports.io/football/teams/541.png');
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Barcelona', false), 'https://media.api-sports.io/football/teams/529.png');

    // Bayern Munich vs Chelsea
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Bayern Munich', true), 'https://media.api-sports.io/football/teams/157.png');
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Chelsea', false), 'https://media.api-sports.io/football/teams/49.png');

    // Manchester United vs Tottenham
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Manchester United', true), 'https://media.api-sports.io/football/teams/33.png');
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Tottenham Hotspur', false), 'https://media.api-sports.io/football/teams/47.png');

    // Paris Saint-Germain vs Juventus
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Paris Saint-Germain', true), 'https://media.api-sports.io/football/teams/85.png');
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Juventus', false), 'https://media.api-sports.io/football/teams/496.png');

    // Inter Milan vs AC Milan
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('Inter Milan', true), 'https://media.api-sports.io/football/teams/505.png');
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl('AC Milan', false), 'https://media.api-sports.io/football/teams/489.png');
  });

  console.log('\n--- 3. Acceptance Test 4: Strict Independent Home/Away Resolution ---');

  test('Home and Away identities are resolved independently and never mixed up or swapped', () => {
    const fixture1 = {
      homeTeam: { name: 'Arsenal' },
      awayTeam: { name: 'Liverpool' }
    };
    const f1Home = TeamCrestRegistry.resolveTeamCrestUrl(fixture1.homeTeam, true);
    const f1Away = TeamCrestRegistry.resolveTeamCrestUrl(fixture1.awayTeam, false);

    assert.strictEqual(f1Home, 'https://media.api-sports.io/football/teams/42.png', 'Fixture 1 Home must be Arsenal');
    assert.strictEqual(f1Away, 'https://media.api-sports.io/football/teams/40.png', 'Fixture 1 Away must be Liverpool');

    // Reverse fixture
    const fixture2 = {
      homeTeam: { name: 'Liverpool' },
      awayTeam: { name: 'Arsenal' }
    };
    const f2Home = TeamCrestRegistry.resolveTeamCrestUrl(fixture2.homeTeam, true);
    const f2Away = TeamCrestRegistry.resolveTeamCrestUrl(fixture2.awayTeam, false);

    assert.strictEqual(f2Home, 'https://media.api-sports.io/football/teams/40.png', 'Fixture 2 Home must be Liverpool');
    assert.strictEqual(f2Away, 'https://media.api-sports.io/football/teams/42.png', 'Fixture 2 Away must be Arsenal');

    // Verify team ID priority over name
    const teamWithId = { id: 541, name: 'Random Name That Is Not Madrid' };
    assert.strictEqual(TeamCrestRegistry.resolveTeamCrestUrl(teamWithId, true), 'https://media.api-sports.io/football/teams/541.png');
  });

  console.log('\n--- 4. Acceptance Test 5: No Generic Coloured Circular Balls in Canvas ---');

  test('drawAuthenticCrest draws via drawImage with official crest and never draws generic circular balls or emoji substitutes', () => {
    imagesDrawn.length = 0;
    textElementsDrawn.length = 0;

    const mockCtx = window.document.createElement('canvas').getContext('2d');
    const livUrl = TeamCrestRegistry.resolveTeamCrestUrl('Liverpool', true);
    TelegramPublisher.drawAuthenticCrest(mockCtx, 280, 235, 140, 140, livUrl, 'Liverpool', true);

    assert.strictEqual(imagesDrawn.length, 1, 'drawImage must be invoked to draw the authentic crest');
    assert.strictEqual(imagesDrawn[0].img.src, 'https://media.api-sports.io/football/teams/40.png');
    assert.ok(imagesDrawn[0].w <= 140, 'Width must respect maxW bounding box');
    assert.ok(imagesDrawn[0].h <= 140, 'Height must respect maxH bounding box');

    // Ensure no generic emoji text like 🔵, 🔴, 🛡️ was drawn inside the crest
    const textDrawn = textElementsDrawn.map(t => t.text);
    assert.ok(!textDrawn.includes('🔵'), 'Must not draw generic blue circle ball');
    assert.ok(!textDrawn.includes('🔴'), 'Must not draw generic red circle ball');
    assert.ok(!textDrawn.includes('🛡️'), 'Must not draw generic shield emoji');
  });

  console.log('\n--- 5. Acceptance Test 6: Downloaded Match Cards Retain Authentic Logos Across All 5 Formats ---');

  const liverpoolVsArsenal = {
    id: 'liv_ars_2026',
    fixtureId: 4042,
    competition: 'Premier League',
    leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: { name: 'Liverpool', id: 40 },
    awayTeam: { name: 'Arsenal', id: 42 },
    homeScore: 2,
    awayScore: 1,
    statusShort: '2H',
    elapsed: 74,
    isLive: true,
    kickoffTime: 'Today 20:00'
  };

  const formats = ['landscape', 'square', 'portrait', 'story', 'original'];

  for (const fmtKey of formats) {
    test(`generateMatchCardCanvas(${fmtKey}): Renders exact Liverpool and Arsenal crests via drawImage`, () => {
      imagesDrawn.length = 0;
      textElementsDrawn.length = 0;

      const canvas = TelegramPublisher.generateMatchCardCanvas(liverpoolVsArsenal, 'GOAL', null, fmtKey);
      assert.ok(canvas, `Canvas must generate for ${fmtKey}`);

      // Verify that drawImage was called for both Home (Liverpool) and Away (Arsenal)
      const crestImages = imagesDrawn.filter(i => i.img && i.img.src && i.img.src.includes('media.api-sports.io/football/teams/'));
      assert.strictEqual(crestImages.length, 2, `${fmtKey}: Must draw exactly 2 authentic crests via drawImage`);

      const homeCrest = crestImages[0];
      const awayCrest = crestImages[1];

      assert.strictEqual(homeCrest.img.src, 'https://media.api-sports.io/football/teams/40.png', `${fmtKey}: Home crest must be Liverpool (40)`);
      assert.strictEqual(awayCrest.img.src, 'https://media.api-sports.io/football/teams/42.png', `${fmtKey}: Away crest must be Arsenal (42)`);

      // Verify aspect ratio preservation
      assert.ok(homeCrest.w > 0 && homeCrest.h > 0, `${fmtKey}: Dimensions must be positive`);
      assert.ok(awayCrest.w > 0 && awayCrest.h > 0, `${fmtKey}: Dimensions must be positive`);
    });
  }

  await testAsync('downloadMatchCard: Exported image file includes authentic club crests', async () => {
    downloadedFiles.length = 0;
    imagesDrawn.length = 0;

    window.MATCH_DATA = [liverpoolVsArsenal];
    TelegramPublisher.selectLiveMatch(liverpoolVsArsenal.id);

    const success = await TelegramPublisher.downloadMatchCard('landscape', 'png');
    assert.strictEqual(success, true);
    assert.strictEqual(downloadedFiles.length, 1);
    assert.ok(downloadedFiles[0].download.includes('Liverpool_vs_Arsenal'));

    // Verify drawImage was used with Liverpool and Arsenal crests during export
    const drawnCrests = imagesDrawn.filter(i => i.img && i.img.src && i.img.src.includes('media.api-sports.io/football/teams/'));
    assert.ok(drawnCrests.some(i => i.img.src.endsWith('/40.png')), 'Exported card must include Liverpool crest');
    assert.ok(drawnCrests.some(i => i.img.src.endsWith('/42.png')), 'Exported card must include Arsenal crest');
  });

  console.log('\n--- 6. Acceptance Test 7: Integrity of Live Scores, Events & Match Centre Workflows ---');

  test('Live scores, match events, competition headings and AI Match Centre functionality remain 100% intact', () => {
    textElementsDrawn.length = 0;
    const canvas = TelegramPublisher.generateMatchCardCanvas(
      liverpoolVsArsenal,
      'GOAL',
      { player: { name: 'Salah' }, team: { name: 'Liverpool' } },
      'landscape'
    );
    assert.ok(canvas);

    const texts = textElementsDrawn.map(t => t.text);

    // Branding
    assert.ok(texts.some(t => t.includes('DEEPPREDICTBET')), 'Brand logo must be intact');
    assert.ok(texts.some(t => t.includes('AI MATCH CENTRE')), 'AI MATCH CENTRE must be intact');

    // Competition
    assert.ok(texts.some(t => t.includes('PREMIER LEAGUE')), 'Competition text must be intact');
    assert.ok(texts.some(t => t.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')), 'Competition emoji flag must be intact');

    // Score & Minute
    assert.ok(texts.some(t => t.includes('2 - 1')), 'Scoreline must be intact');
    assert.ok(texts.some(t => t.includes("74' LIVE")), 'Live match minute must be intact');

    // Event Info
    assert.ok(texts.some(t => t.includes('GOAL!') && t.includes('Salah')), 'Goalscorer event must be intact');

    // Footer URL
    assert.ok(texts.some(t => t.includes('https://deeppredictbet.com')), 'Footer URL must be intact');

    // Live Updates Tab HTML rendering
    const tabHtml = TelegramPublisher.renderLiveUpdatesTab();
    assert.ok(tabHtml.includes('DOWNLOAD MATCH CARD'), 'Download button in UI must be intact');
    assert.ok(tabHtml.includes('tg-live-graphic-preview-img'), 'Preview image container must be intact');
    assert.ok(tabHtml.includes('media.api-sports.io/football/teams/40.png'), 'Match list must render authentic Liverpool crest thumbnail');
    assert.ok(tabHtml.includes('media.api-sports.io/football/teams/42.png'), 'Match list must render authentic Arsenal crest thumbnail');
  });

  console.log('\n==================================================');
  console.log(`OFFICIAL CLUB CRESTS TEST RESULTS: ${passed} passed, ${failed} failed.`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runOfficialClubCrestTestSuite().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
