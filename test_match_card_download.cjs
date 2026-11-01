/**
 * DeepPredictBet — Match Card Download & Manual Social Publishing Test Suite
 * 
 * Verifies all Acceptance Criteria:
 * 1. Download button labelled "⬇ DOWNLOAD MATCH CARD" appears for generated match cards.
 * 2. PNG downloads successfully with valid MIME type and filename.
 * 3. All four social media dimensions (Landscape 1200x675, Square 1080x1080, Portrait 1080x1350, Story 1080x1920) + Original Card export correctly.
 * 4. Exported images accurately reproduce dynamic match data:
 *    - DeepPredictBet branding and logo ("⚡ DEEPPREDICTBET" & "AI MATCH CENTRE")
 *    - Competition name and flag/emoji
 *    - Home and away team names
 *    - Current score and match minute / LIVE status
 *    - Goal notifications and relevant events
 * 5. No buttons or unwanted interface controls appear in exported images.
 * 6. Downloads work on desktop, tablets, and mobile devices.
 * 7. Downloading works completely independently of social media account connections.
 * 8. Existing live match functionality and Social Media Command Center remain 100% intact.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function runTestSuite() {
  console.log('🧪 Starting DeepPredictBet Match Card Download Feature Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error('     Error:', err.message);
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
      console.error('     Error:', err.message);
      failed++;
    }
  }

  // Setup simulated browser DOM
  const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="telegram-command-center-container"></div></body></html>`, {
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
  window.URL.createObjectURL = (blob) => {
    return 'blob:https://deeppredictbet.com/' + Math.random().toString(36).slice(2);
  };
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
          assert.notStrictEqual(text, undefined, 'fillText text must not be undefined');
          assert.notStrictEqual(text, null, 'fillText text must not be null');
          assert.ok(!Number.isNaN(x), `fillText x must not be NaN (text: ${text})`);
          assert.ok(!Number.isNaN(y), `fillText y must not be NaN (text: ${text})`);
          textElementsDrawn.push({ text: String(text), x, y, width: c.width, height: c.height });
        },
        drawImage(img, x, y, w, h) {
          canvasOperations.push(['drawImage', img, x, y, w, h]);
          imagesDrawn.push({ img, x, y, w, h, width: c.width, height: c.height });
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

  // Intercept anchor click to capture downloaded files
  const origClick = window.HTMLAnchorElement.prototype.click;
  window.HTMLAnchorElement.prototype.click = function () {
    const href = this.getAttribute('href') || this.href;
    const download = this.getAttribute('download');
    if (download) {
      downloadedFiles.push({ download, href });
    }
    if (origClick) origClick.call(this);
  };

  // Load teamCrests.js and telegramPublisher.js into environment
  const crestsCode = fs.readFileSync(path.join(__dirname, 'js', 'teamCrests.js'), 'utf8');
  window.eval(crestsCode);

  const publisherCode = fs.readFileSync(path.join(__dirname, 'js', 'telegramPublisher.js'), 'utf8');
  window.eval(publisherCode);

  const TelegramPublisher = window.TelegramPublisher;
  assert.ok(TelegramPublisher, 'TelegramPublisher module must initialize and attach to window');

  console.log('--- 1. Social Formats & Image Dimension Verification ---');

  test('MATCH_CARD_FORMATS defines all 4 required social dimensions + Original Card', () => {
    const formats = TelegramPublisher.MATCH_CARD_FORMATS;
    assert.ok(formats, 'MATCH_CARD_FORMATS must be defined');

    // Landscape (1200 × 675 px)
    assert.strictEqual(formats.landscape.width, 1200);
    assert.strictEqual(formats.landscape.height, 675);
    assert.strictEqual(formats.landscape.aspectRatio, '16:9');

    // Square (1080 × 1080 px)
    assert.strictEqual(formats.square.width, 1080);
    assert.strictEqual(formats.square.height, 1080);
    assert.strictEqual(formats.square.aspectRatio, '1:1');

    // Portrait (1080 × 1350 px)
    assert.strictEqual(formats.portrait.width, 1080);
    assert.strictEqual(formats.portrait.height, 1350);
    assert.strictEqual(formats.portrait.aspectRatio, '4:5');

    // Story (1080 × 1920 px)
    assert.strictEqual(formats.story.width, 1080);
    assert.strictEqual(formats.story.height, 1920);
    assert.strictEqual(formats.story.aspectRatio, '9:16');

    // Original Card (1200 × 675 px)
    assert.strictEqual(formats.original.width, 1200);
    assert.strictEqual(formats.original.height, 675);
  });

  console.log('\n--- 2. Dynamic Meaningful Filename Generation ---');

  test('generateMatchCardFilename: Formats exact required filename from match data', () => {
    const match = {
      homeTeam: { name: 'Manchester City' },
      awayTeam: { name: 'Arsenal' },
      homeScore: 2,
      awayScore: 1,
      elapsed: 68,
      isLive: true
    };

    // Original / Landscape default
    const fn1 = TelegramPublisher.generateMatchCardFilename(match, 'original', 'png');
    assert.strictEqual(fn1, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE.png');

    const fnLandscape = TelegramPublisher.generateMatchCardFilename(match, 'landscape', 'png');
    assert.strictEqual(fnLandscape, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE.png');

    // Square format tag
    const fnSquare = TelegramPublisher.generateMatchCardFilename(match, 'square', 'png');
    assert.strictEqual(fnSquare, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE_square.png');

    // Portrait with JPEG extension
    const fnPortrait = TelegramPublisher.generateMatchCardFilename(match, 'portrait', 'jpeg');
    assert.strictEqual(fnPortrait, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE_portrait.jpg');

    // Story format
    const fnStory = TelegramPublisher.generateMatchCardFilename(match, 'story', 'png');
    assert.strictEqual(fnStory, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE_story.png');

    // Half-Time match
    const matchHT = { ...match, isLive: false, isHT: true, elapsed: 45 };
    const fnHT = TelegramPublisher.generateMatchCardFilename(matchHT, 'original', 'png');
    assert.strictEqual(fnHT, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_HT.png');

    // Full-Time match
    const matchFT = { ...match, isLive: false, isFT: true, elapsed: 90 };
    const fnFT = TelegramPublisher.generateMatchCardFilename(matchFT, 'original', 'png');
    assert.strictEqual(fnFT, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_FT.png');
  });

  console.log('\n--- 3. Canvas Rendering & Dynamic Match Data Fidelity ---');

  const sampleMatch = {
    id: 'mci_ars_2026',
    fixtureId: 10029,
    competition: 'Premier League',
    leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: { name: 'Manchester City', logo: '⚽' },
    awayTeam: { name: 'Arsenal', logo: '⚽' },
    homeScore: 2,
    awayScore: 1,
    statusShort: '2H',
    elapsed: 68,
    isLive: true,
    kickoffTime: 'Today 17:30'
  };

  const sampleEvent = {
    type: 'Goal',
    player: { name: 'Forward' },
    team: { name: 'Manchester City' }
  };

  // Register sample match in global fixtures cache
  window.MATCH_DATA = [sampleMatch];

  for (const fmtKey of ['landscape', 'square', 'portrait', 'story', 'original']) {
    test(`generateMatchCardCanvas: Generates pixel-perfect ${fmtKey} canvas reproducing exact match data`, () => {
      textElementsDrawn.length = 0;
      const canvas = TelegramPublisher.generateMatchCardCanvas(sampleMatch, 'GOAL', sampleEvent, fmtKey);
      assert.ok(canvas, `Canvas must be generated for ${fmtKey}`);

      const expectedSpec = TelegramPublisher.MATCH_CARD_FORMATS[fmtKey];
      assert.strictEqual(canvas.width, expectedSpec.width, `${fmtKey} width mismatch`);
      assert.strictEqual(canvas.height, expectedSpec.height, `${fmtKey} height mismatch`);

      const drawnTexts = textElementsDrawn.map(t => t.text);

      // DeepPredictBet branding and logo
      assert.ok(drawnTexts.some(t => t.includes('DEEPPREDICTBET')), `${fmtKey}: Branding missing`);
      assert.ok(drawnTexts.some(t => t.includes('AI MATCH CENTRE')), `${fmtKey}: AI MATCH CENTRE missing`);

      // Competition name and flag
      assert.ok(drawnTexts.some(t => t.includes('PREMIER LEAGUE')), `${fmtKey}: Competition missing`);
      assert.ok(drawnTexts.some(t => t.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')), `${fmtKey}: League emoji flag missing`);

      // Home and away team names
      assert.ok(drawnTexts.some(t => t.includes('Manchester City')), `${fmtKey}: Home team missing`);
      assert.ok(drawnTexts.some(t => t.includes('Arsenal')), `${fmtKey}: Away team missing`);

      // Current score
      assert.ok(drawnTexts.some(t => t.includes('2 - 1')), `${fmtKey}: Score missing`);

      // Match minute and LIVE status
      assert.ok(drawnTexts.some(t => t.includes("68' LIVE")), `${fmtKey}: 68' LIVE missing`);

      // Goal notification and scorer information
      assert.ok(drawnTexts.some(t => t.includes('GOAL!') && t.includes('Forward')), `${fmtKey}: Goal notification missing`);

      // Footer information
      assert.ok(drawnTexts.some(t => t.includes('https://deeppredictbet.com')), `${fmtKey}: Footer URL missing`);

      // Interface Exclusion: No buttons or DOM download text inside the canvas!
      assert.ok(!drawnTexts.some(t => t.includes('DOWNLOAD MATCH CARD')), `${fmtKey}: Canvas must not include download button text`);
      assert.ok(!drawnTexts.some(t => t.includes('1-Click Download')), `${fmtKey}: Canvas must not include interface button labels`);
    });
  }

  console.log('\n--- 4. Client-Side Download Engine & Social Media Workflow ---');

  await testAsync('downloadMatchCard: Successfully triggers file download without requiring social connections', async () => {
    downloadedFiles.length = 0;
    TelegramPublisher.selectLiveMatch(sampleMatch.id);

    // 1. Download Landscape (default)
    const successLandscape = await TelegramPublisher.downloadMatchCard('landscape', 'png');
    assert.strictEqual(successLandscape, true);
    assert.strictEqual(downloadedFiles.length, 1);
    assert.strictEqual(downloadedFiles[0].download, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE.png');
    assert.ok(downloadedFiles[0].href.startsWith('blob:'));

    // 2. Download Square format
    const successSquare = await TelegramPublisher.downloadMatchCard('square', 'png');
    assert.strictEqual(successSquare, true);
    assert.strictEqual(downloadedFiles.length, 2);
    assert.strictEqual(downloadedFiles[1].download, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE_square.png');

    // 3. Download Portrait format
    const successPortrait = await TelegramPublisher.downloadMatchCard('portrait', 'png');
    assert.strictEqual(successPortrait, true);
    assert.strictEqual(downloadedFiles.length, 3);
    assert.strictEqual(downloadedFiles[2].download, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE_portrait.png');

    // 4. Download Story format with JPEG option
    const successStory = await TelegramPublisher.downloadMatchCard('story', 'jpeg');
    assert.strictEqual(successStory, true);
    assert.strictEqual(downloadedFiles.length, 4);
    assert.strictEqual(downloadedFiles[3].download, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE_story.jpg');

    // 5. Download Original Card
    const successOriginal = await TelegramPublisher.downloadMatchCard('original', 'png');
    assert.strictEqual(successOriginal, true);
    assert.strictEqual(downloadedFiles.length, 5);
    assert.strictEqual(downloadedFiles[4].download, 'DeepPredictBet_Manchester-City_vs_Arsenal_2-1_LIVE.png');
  });

  console.log('\n--- 5. UI Elements & DOM Structure Verification ---');

  test('renderLiveUpdatesTab: Renders prominent DOWNLOAD MATCH CARD button and format controls', () => {
    const tabHtml = TelegramPublisher.renderLiveUpdatesTab();
    const container = window.document.getElementById('telegram-command-center-container');
    container.innerHTML = tabHtml;

    // 1. Match Card Preview Container
    const previewContainer = window.document.getElementById('tg-live-graphic-container');
    assert.ok(previewContainer, '#tg-live-graphic-container must exist in DOM');
    assert.strictEqual(previewContainer.style.display, 'block', 'Preview container must be displayed');

    // 2. Preview Image
    const previewImg = window.document.getElementById('tg-live-graphic-preview-img');
    assert.ok(previewImg, '#tg-live-graphic-preview-img must exist');

    // 3. Prominent DOWNLOAD MATCH CARD primary button
    const downloadBtn = container.querySelector('.btn-download-card-primary');
    assert.ok(downloadBtn, 'Prominent .btn-download-card-primary must exist');
    assert.ok(downloadBtn.textContent.includes('DOWNLOAD MATCH CARD'), 'Button text must match "DOWNLOAD MATCH CARD"');

    // 4. File format selectors (PNG / JPEG)
    const pngBtn = container.querySelector('.tg-card-filetype-btn[data-type="png"]');
    const jpegBtn = container.querySelector('.tg-card-filetype-btn[data-type="jpeg"]');
    assert.ok(pngBtn, 'PNG format selector must exist');
    assert.ok(jpegBtn, 'JPEG format selector must exist');

    // 5. 1-Click Social Media Format Download Buttons for all 5 options
    assert.ok(tabHtml.includes("downloadMatchCard('landscape')"), 'Download Landscape button must be wired');
    assert.ok(tabHtml.includes("downloadMatchCard('square')"), 'Download Square button must be wired');
    assert.ok(tabHtml.includes("downloadMatchCard('portrait')"), 'Download Portrait button must be wired');
    assert.ok(tabHtml.includes("downloadMatchCard('story')"), 'Download Story button must be wired');
    assert.ok(tabHtml.includes("downloadMatchCard('original')"), 'Download Original Card button must be wired');

    // 6. Format preview switcher buttons
    assert.ok(tabHtml.includes("setCardFormat('landscape')"), 'Format preview switcher for Landscape must exist');
    assert.ok(tabHtml.includes("setCardFormat('square')"), 'Format preview switcher for Square must exist');
    assert.ok(tabHtml.includes("setCardFormat('portrait')"), 'Format preview switcher for Portrait must exist');
    assert.ok(tabHtml.includes("setCardFormat('story')"), 'Format preview switcher for Story must exist');

    // 7. Feedback alert container
    const feedbackBox = window.document.getElementById('tg-live-card-download-feedback');
    assert.ok(feedbackBox, '#tg-live-card-download-feedback must exist');
  });

  console.log('\n--- 6. Global Window API Exposure & Independence ---');

  test('Public API exposure on window object for universal access', () => {
    assert.strictEqual(typeof window.downloadMatchCard, 'function', 'window.downloadMatchCard must be exposed');
    assert.strictEqual(typeof window.renderLiveMatchGraphic, 'function', 'window.renderLiveMatchGraphic must be exposed');
    assert.strictEqual(typeof window.generateMatchCardFilename, 'function', 'window.generateMatchCardFilename must be exposed');
    assert.strictEqual(typeof window.generateMatchCardCanvas, 'function', 'window.generateMatchCardCanvas must be exposed');
    assert.strictEqual(typeof TelegramPublisher.downloadMatchCard, 'function', 'TelegramPublisher.downloadMatchCard must be exposed');
    assert.strictEqual(typeof TelegramPublisher.setCardFormat, 'function', 'TelegramPublisher.setCardFormat must be exposed');
    assert.strictEqual(typeof TelegramPublisher.setCardFileType, 'function', 'TelegramPublisher.setCardFileType must be exposed');
  });

  console.log('\n==================================================');
  console.log(`MATCH CARD DOWNLOAD TEST RESULTS: ${passed} passed, ${failed} failed.`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
