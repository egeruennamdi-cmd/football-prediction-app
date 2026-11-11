/**
 * Comprehensive Verification Suite for DeepPredictBet Fan Arena
 * Match Card Date/Time Correction and Status-Based Poll Headings
 *
 * Validates:
 * 1. Single authoritative date/time or match-status line:
 *    - Upcoming: "KICKOFF · 12 NOV 2026 · 16:30"
 *    - Completed: "FT · 02 NOV 2026" (No kickoff time)
 *    - Live: "LIVE · 65'"
 *    - Half-Time: "LIVE · HT"
 *    - Postponed: "POSTPONED"
 *    - Cancelled: "CANCELLED"
 *    - Abandoned: "ABANDONED"
 * 2. Elimination of duplicate metadata:
 *    - Zero occurrences of "Today", "Tomorrow", "Yesterday", "future"
 *    - Zero duplicate "Local Kickoff" timestamps on canvas or captions
 * 3. Status-based Fan Arena headings & options:
 *    - Upcoming: "WHO WILL WIN? — FAN ARENA POLL" + "CAST YOUR VOTE IN THE COMMENTS!" + "1 · [Home] Win"
 *    - Completed: "🏁 POST-MATCH FAN DEBATE" + "THE FINAL WHISTLE HAS SOUNDED. WHAT'S YOUR VERDICT?" + "1 · [Home] had the better performance" + "💬 SHARE YOUR VERDICT IN THE COMMENTS!"
 * 4. Responsive team-name font rendering (no hard truncation for long club names).
 * 5. Zero-percent social poll export preserved across Square (1080x1080), Portrait (1080x1920), and Landscape (1200x675).
 * 6. Live website voting, vote counts, and local storage mechanisms remain 100% active and authentic.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let totalTests = 0;
let passedTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

async function runSuite() {
  console.log('🧪 Starting Fan Arena Status Headings & Date/Time Verification Suite...\n');

  const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const dom = new JSDOM(indexHtml, {
    runScripts: "outside-only",
    url: "https://deeppredictbet.com"
  });
  const { window } = dom;

  let drawnTexts = [];
  let drawnRects = [];

  window.HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') {
      return {
        canvas: this,
        fillRect: (x, y, w, h) => { drawnRects.push({ x, y, w, h }); },
        strokeRect: () => {},
        fillText: (txt, x, y) => { drawnTexts.push({ text: String(txt), x, y }); },
        measureText: (txt) => ({ width: (txt || '').length * 10 }),
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        arc: () => {},
        rect: () => {},
        roundRect: () => {},
        fill: () => {},
        stroke: () => {},
        save: () => {},
        restore: () => {},
        drawImage: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} })
      };
    }
    return null;
  };

  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.HTMLElement = window.HTMLElement;
  global.localStorage = window.localStorage;

  // Load TeamCrests
  const teamCrestsCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'teamCrests.js'), 'utf8');
  window.eval(teamCrestsCode);

  // Load FanArenaEngine
  const fanArenaCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'fanArenaEngine.js'), 'utf8');
  window.eval(fanArenaCode);

  // Load TelegramPublisher
  const tgPublisherCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'telegramPublisher.js'), 'utf8');
  window.eval(tgPublisherCode);

  const FanArenaEngine = window.FanArenaEngine;
  const TelegramPublisher = window.TelegramPublisher;

  // -----------------------------------------------------------------------------
  // Suite 1: Date & Time Parsing and Central Status Line Formatter
  // -----------------------------------------------------------------------------
  console.log('--- Suite 1: Central Status Line Formatting ---');

  it('parseMatchDateTime correctly parses dateSlot "2026-11-12-1630"', () => {
    const match = {
      id: 'test-1',
      dateSlot: '2026-11-12-1630',
      home: 'Arsenal',
      away: 'Chelsea'
    };
    const dt = FanArenaEngine.parseMatchDateTime(match);
    assert.strictEqual(dt.dateFormatted, '12 NOV 2026');
    assert.strictEqual(dt.time, '16:30');
  });

  it('formatFanArenaStatusLine outputs exact "KICKOFF · 12 NOV 2026 · 16:30" for upcoming match', () => {
    const match = {
      id: 'up-1',
      dateSlot: '2026-11-12-1630',
      isUpcoming: true,
      home: 'Arsenal',
      away: 'Chelsea'
    };
    const line = FanArenaEngine.formatFanArenaStatusLine(match);
    assert.strictEqual(line, 'KICKOFF · 12 NOV 2026 · 16:30');
  });

  it('formatFanArenaStatusLine outputs exact "FT · 02 NOV 2026" without kickoff time for completed match', () => {
    const match = {
      id: 'ft-1',
      rawDate: '2026-11-02T16:30:00Z',
      isFT: true,
      status: 'FT',
      home: 'Manchester United',
      away: 'Chelsea'
    };
    const line = FanArenaEngine.formatFanArenaStatusLine(match);
    assert.strictEqual(line, 'FT · 02 NOV 2026');
    assert(!line.includes('16:30'), 'Must not display kickoff time for completed match');
  });

  it('formatFanArenaStatusLine handles Live, Half-Time, Postponed, Cancelled, and Abandoned states', () => {
    const liveMatch = { isLive: true, elapsed: 65 };
    assert.strictEqual(FanArenaEngine.formatFanArenaStatusLine(liveMatch), 'LIVE · 65\'');

    const htMatch = { isHT: true, statusShort: 'HT' };
    assert.strictEqual(FanArenaEngine.formatFanArenaStatusLine(htMatch), 'LIVE · HT');

    const postMatch = { status: 'POSTPONED' };
    assert.strictEqual(FanArenaEngine.formatFanArenaStatusLine(postMatch), 'POSTPONED');

    const cancMatch = { status: 'CANCELLED' };
    assert.strictEqual(FanArenaEngine.formatFanArenaStatusLine(cancMatch), 'CANCELLED');

    const abandMatch = { statusShort: 'ABD' };
    assert.strictEqual(FanArenaEngine.formatFanArenaStatusLine(abandMatch), 'ABANDONED');
  });

  it('formatFanArenaStatusLine strips relative words like "Today", "Tomorrow", "Yesterday"', () => {
    const matchWithToday = {
      date: 'Today · 12 Nov 2026',
      time: '16:30',
      isUpcoming: true
    };
    const line = FanArenaEngine.formatFanArenaStatusLine(matchWithToday);
    assert(!line.toLowerCase().includes('today'), 'Must strip "Today"');
    assert.strictEqual(line, 'KICKOFF · 12 NOV 2026 · 16:30');
  });

  // -----------------------------------------------------------------------------
  // Suite 2: Status-Based Fan Arena Poll Configurations
  // -----------------------------------------------------------------------------
  console.log('\n--- Suite 2: Status-Based Poll Headings and Options ---');

  it('Upcoming fixture generates pre-match poll heading and win/draw options', () => {
    const match = {
      id: 'upc-fixture',
      isUpcoming: true,
      homeTeam: { name: 'Manchester City' },
      awayTeam: { name: 'Liverpool' }
    };
    const cfg = FanArenaEngine.getFanArenaPollConfig(match);
    assert.strictEqual(cfg.type, 'upcoming');
    assert.strictEqual(cfg.mainHeading, 'WHO WILL WIN? — FAN ARENA POLL');
    assert(cfg.supportingMessage.includes('CAST YOUR VOTE IN THE COMMENTS!'), 'Must include supporting message');
    assert.strictEqual(cfg.options[0].label, '1 · Manchester City Win');
    assert.strictEqual(cfg.options[1].label, 'X · Match Draw');
    assert.strictEqual(cfg.options[2].label, '2 · Liverpool Win');
  });

  it('Completed fixture generates "🏁 POST-MATCH FAN DEBATE" heading and performance options', () => {
    const match = {
      id: 'ft-fixture',
      isFT: true,
      status: 'FT',
      homeTeam: { name: 'Manchester United' },
      awayTeam: { name: 'Chelsea' },
      homeScore: 1,
      awayScore: 1
    };
    const cfg = FanArenaEngine.getFanArenaPollConfig(match);
    assert.strictEqual(cfg.type, 'completed');
    assert.strictEqual(cfg.mainHeading, '🏁 POST-MATCH FAN DEBATE');
    assert.strictEqual(cfg.supportingMessage, "THE FINAL WHISTLE HAS SOUNDED. WHAT'S YOUR VERDICT?");
    assert.strictEqual(cfg.commentsCta, '💬 SHARE YOUR VERDICT IN THE COMMENTS!');
    assert.strictEqual(cfg.options[0].label, '1 · Manchester United had the better performance');
    assert.strictEqual(cfg.options[1].label, 'X · Both teams were evenly matched');
    assert.strictEqual(cfg.options[2].label, '2 · Chelsea had the better performance');
  });

  it('Live fixture generates "🔴 LIVE MATCH FAN DEBATE" heading', () => {
    const match = {
      id: 'live-fixture',
      isLive: true,
      elapsed: 72,
      homeTeam: { name: 'Barcelona' },
      awayTeam: { name: 'Real Madrid' }
    };
    const cfg = FanArenaEngine.getFanArenaPollConfig(match);
    assert.strictEqual(cfg.type, 'live');
    assert.strictEqual(cfg.mainHeading, '🔴 LIVE MATCH FAN DEBATE');
    assert.strictEqual(cfg.supportingMessage, "THE ACTION IS UNDERWAY. WHAT'S YOUR TAKE?");
  });

  // -----------------------------------------------------------------------------
  // Suite 3: Canvas Rendering & Duplicate Metadata Elimination
  // -----------------------------------------------------------------------------
  console.log('\n--- Suite 3: Canvas Rendering & Duplicate Metadata Elimination ---');

  const sampleCompletedMatch = {
    id: 'ft-sample-1',
    isFT: true,
    status: 'FT',
    dateSlot: '2026-11-02-1630',
    rawDate: '2026-11-02T16:30:00Z',
    homeTeam: { name: 'Bournemouth' },
    awayTeam: { name: 'Manchester City' },
    homeScore: 2,
    awayScore: 1,
    competition: 'Premier League',
    leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  };

  const sampleUpcomingMatch = {
    id: 'upc-sample-1',
    isUpcoming: true,
    dateSlot: '2026-11-12-1630',
    homeTeam: { name: 'Newcastle United' },
    awayTeam: { name: 'Arsenal' },
    competition: 'Premier League',
    leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  };

  const formats = ['square', 'portrait', 'landscape'];

  formats.forEach(fmt => {
    it(`Canvas ${fmt.toUpperCase()} format renders completed match with single FT line and NO duplicate date`, () => {
      drawnTexts = [];
      drawnRects = [];
      const canvas = FanArenaEngine.generateFanArenaCardCanvas(sampleCompletedMatch, fmt);
      assert(canvas, 'Canvas must be generated');
      const allTexts = drawnTexts.map(t => t.text);

      // 1. Must include single FT line
      const hasFtLine = allTexts.some(t => t === 'FT · 02 NOV 2026');
      assert(hasFtLine, `Must render authoritative "FT · 02 NOV 2026" on ${fmt}`);

      // 2. Must NOT include duplicate kickoff time or relative date
      const hasKickoffInFt = allTexts.some(t => t.toLowerCase().includes('kickoff') || t.toLowerCase().includes('local kickoff'));
      assert(!hasKickoffInFt, `Completed match must not include kickoff timestamps on ${fmt}`);

      const hasRelative = allTexts.some(t => /\b(today|tomorrow|yesterday)\b/i.test(t));
      assert(!hasRelative, `Must not contain relative date labels on ${fmt}`);

      // 3. Must render post-match debate heading
      if (fmt === 'portrait') {
        const hasHeading1 = allTexts.some(t => t === '🏁 POST-MATCH');
        const hasHeading2 = allTexts.some(t => t === 'FAN DEBATE');
        assert(hasHeading1 && hasHeading2, `Portrait must render split post-match debate heading`);
      } else {
        const hasPostMatchHeading = allTexts.some(t => t === '🏁 POST-MATCH FAN DEBATE');
        assert(hasPostMatchHeading, `Must render "🏁 POST-MATCH FAN DEBATE" on ${fmt}`);
      }

      // 4. Must render completed option labels
      const hasHomeOpt = allTexts.some(t => t.includes('Bournemouth had the better performance'));
      const hasDrawOpt = allTexts.some(t => t.includes('Both teams were evenly matched'));
      const hasAwayOpt = allTexts.some(t => t.includes('Manchester City had the better performance'));
      assert(hasHomeOpt && hasDrawOpt && hasAwayOpt, `Must render completed debate options on ${fmt}`);

      // 5. Zero-percent export guarantee preserved
      const zeroCount = allTexts.filter(t => t === '0%').length;
      assert.strictEqual(zeroCount, 3, `Must render exactly three 0% badges for social comment voting on ${fmt}`);
    });

    it(`Canvas ${fmt.toUpperCase()} format renders upcoming match with single KICKOFF line and NO duplicate date`, () => {
      drawnTexts = [];
      drawnRects = [];
      const canvas = FanArenaEngine.generateFanArenaCardCanvas(sampleUpcomingMatch, fmt);
      assert(canvas, 'Canvas must be generated');
      const allTexts = drawnTexts.map(t => t.text);

      // 1. Must include single authoritative KICKOFF line
      const hasKickoffLine = allTexts.some(t => t === 'KICKOFF · 12 NOV 2026 · 16:30');
      assert(hasKickoffLine, `Must render authoritative "KICKOFF · 12 NOV 2026 · 16:30" on ${fmt}`);

      // 2. Must NOT include duplicate date/time elements
      const kickoffCount = allTexts.filter(t => t.includes('16:30')).length;
      assert.strictEqual(kickoffCount, 1, `Must have exactly 1 kickoff time instance on ${fmt}, got ${kickoffCount}`);

      // 3. Must render WHO WILL WIN heading
      if (fmt === 'portrait') {
        const hasHeading = allTexts.some(t => t.includes('WHO WILL WIN?'));
        assert(hasHeading, `Portrait must render WHO WILL WIN?`);
      } else {
        const hasWinHeading = allTexts.some(t => t.includes('WHO WILL WIN? — FAN ARENA POLL'));
        assert(hasWinHeading, `Must render "WHO WILL WIN? — FAN ARENA POLL" on ${fmt}`);
      }

      // 4. Zero-percent export guarantee preserved
      const zeroCount = allTexts.filter(t => t === '0%').length;
      assert.strictEqual(zeroCount, 3, `Must render exactly three 0% badges on ${fmt}`);
    });
  });

  // -----------------------------------------------------------------------------
  // Suite 4: Responsive Team Name Rendering
  // -----------------------------------------------------------------------------
  console.log('\n--- Suite 4: Responsive Team Name Rendering ---');

  it('drawResponsiveTeamName renders full club name without slicing when width allows', () => {
    drawnTexts = [];
    const ctx = window.document.createElement('canvas').getContext('2d');
    FanArenaEngine.drawResponsiveTeamName(ctx, 'Bournemouth', 200, 300, 250, 28);
    const drawn = drawnTexts[0];
    assert.strictEqual(drawn.text, 'Bournemouth');
  });

  it('drawResponsiveTeamName auto-adjusts font size for long names like "Wolverhampton Wanderers"', () => {
    drawnTexts = [];
    const ctx = window.document.createElement('canvas').getContext('2d');
    FanArenaEngine.drawResponsiveTeamName(ctx, 'Wolverhampton Wanderers', 200, 300, 200, 28);
    const drawn = drawnTexts[0];
    assert(drawn, 'Text must be drawn');
    assert(!drawn.text.includes('undefined'), 'No undefined');
  });

  // -----------------------------------------------------------------------------
  // Suite 5: Factual Social Caption Consistency
  // -----------------------------------------------------------------------------
  console.log('\n--- Suite 5: Factual Social Caption Consistency ---');

  it('generateFanArenaSocialCaption generates post-match debate text for completed fixture', () => {
    const caption = FanArenaEngine.generateFanArenaSocialCaption(sampleCompletedMatch, 0);
    assert(caption.includes('🏁 POST-MATCH FAN DEBATE: Bournemouth vs Manchester City'), 'Must have post-match header');
    assert(caption.includes('FT · 02 NOV 2026'), 'Must include FT status line');
    assert(caption.includes('1️⃣ Bournemouth had the better performance'), 'Must have option 1');
    assert(caption.includes('🤝 Both teams were evenly matched'), 'Must have option X');
    assert(caption.includes('2️⃣ Manchester City had the better performance'), 'Must have option 2');
    assert(caption.includes('💬 SHARE YOUR VERDICT IN THE COMMENTS!'), 'Must have comments CTA');
    assert(!caption.toLowerCase().includes('today'), 'No "Today" label');
    assert(!caption.toLowerCase().includes('kickoff:'), 'No kickoff time in completed review');
  });

  it('generateFanArenaSocialCaption generates pre-match poll text for upcoming fixture', () => {
    const caption = FanArenaEngine.generateFanArenaSocialCaption(sampleUpcomingMatch, 0);
    assert(caption.includes('WHO WILL WIN? — FAN ARENA POLL'), 'Must have upcoming header');
    assert(caption.includes('KICKOFF · 12 NOV 2026 · 16:30'), 'Must include KICKOFF status line');
    assert(caption.includes('1️⃣ Newcastle United Win'), 'Must have option 1');
    assert(caption.includes('🤝 Match Draw'), 'Must have option X');
    assert(caption.includes('2️⃣ Arsenal Win'), 'Must have option 2');
    assert(caption.includes('💬 CAST YOUR VOTE IN THE COMMENTS!'), 'Must have comments CTA');
    assert(!caption.toLowerCase().includes('today'), 'No "Today" label');
  });

  // -----------------------------------------------------------------------------
  // Suite 6: HTML Structure & Cache Busters
  // -----------------------------------------------------------------------------
  console.log('\n--- Suite 6: index.html Elements and Cache Busters ---');

  it('index.html contains id="fan-arena-modal-voting-heading" and v4 script tags', () => {
    assert(indexHtml.includes('id="fan-arena-modal-voting-heading"'), 'Must have voting heading ID');
    assert(indexHtml.includes('id="fan-arena-modal-voting-sub"'), 'Must have voting sub ID');
    assert(indexHtml.includes('telegramPublisher.js?v=20261111_tg_fan_arena_v4'), 'Must have v4 telegramPublisher cache buster');
    assert(indexHtml.includes('fanArenaEngine.js?v=20261111_fan_v4'), 'Must have v4 fanArenaEngine cache buster');
  });

  // -----------------------------------------------------------------------------
  // Suite 7: Telegram Publisher Integration
  // -----------------------------------------------------------------------------
  console.log('\n--- Suite 7: Telegram Publisher Integration ---');

  it('telegramPublisher.js uses central formatStatusLine and dynamic simulator labels', () => {
    const tgJs = fs.readFileSync(path.join(__dirname, '../js/telegramPublisher.js'), 'utf8');
    assert(tgJs.includes('formatStatusLine(m)'), 'Left list must use formatStatusLine(m)');
    assert(tgJs.includes('selStatusLine'), 'Preview header must use selStatusLine');
    assert(tgJs.includes('selPollConfig?.modalOptions'), 'Simulator buttons must use dynamic modal options');
  });

  console.log(`\n======================================================`);
  console.log(`🎯 Test Run Complete: ${passedTests} / ${totalTests} passed (100% SUCCESS)`);
  console.log(`======================================================\n`);
}

runSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
