/**
 * scripts/test_fan_arena_social_poll_export.cjs
 * Comprehensive Verification Suite for DeepPredictBet Fan Arena
 * Zero-Percent Social Poll Export & Factual Social Caption System
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let passedTests = 0;
let totalTests = 0;

async function it(desc, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ PASS: ${desc}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runAllTests() {
  console.log('======================================================================');
  console.log('  DEEPPREDICTBET — FAN ARENA SOCIAL POLL & CAPTION SYSTEM TEST SUITE');
  console.log('======================================================================\n');

  // 1. Setup DOM environment
  const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const dom = new JSDOM(indexHtml, {
    runScripts: "outside-only",
    url: "https://deeppredictbet.com"
  });
  const { window } = dom;

  // Enhanced Canvas Mock tracking draw calls
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

  const { FanArenaEngine, TelegramPublisher } = window;

  const sampleUpcomingMatch = {
    id: 'fixture-epl-arsenal-chelsea',
    fixtureId: 'fixture-epl-arsenal-chelsea',
    homeTeam: { name: 'Arsenal' },
    awayTeam: { name: 'Chelsea' },
    competition: 'Premier League',
    leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    date: '15 Nov 2026',
    time: '16:30',
    isUpcoming: true
  };

  const sampleFinishedMatch = {
    id: 'fixture-epl-manutd-chelsea',
    homeTeam: { name: 'Manchester United' },
    awayTeam: { name: 'Chelsea' },
    competition: 'Premier League',
    date: '2 Nov 2026',
    time: 'FT',
    score: '2 - 1',
    homeScore: 2,
    awayScore: 1,
    isFT: true
  };

  // ---------------------------------------------------------------------
  // Suite 1: Phase 1 — Zero-Percent Social Poll Export Graphics
  // ---------------------------------------------------------------------
  console.log('--- Suite 1: Zero-Percent Social Poll Export on Canvas ---');

  for (const fmt of ['square', 'portrait', 'landscape']) {
    await it(`Export format "${fmt}" displays 0% for all 3 options and Call-To-Action in comments`, () => {
      drawnTexts = [];
      drawnRects = [];

      const canvas = FanArenaEngine.generateFanArenaCardCanvas(sampleUpcomingMatch, fmt);
      if (!canvas) throw new Error('Canvas was not returned');

      // 1. Verify Call-To-Action text
      const hasCta = drawnTexts.some(t => t.text.includes('💬 CAST YOUR VOTE IN THE COMMENTS!'));
      if (!hasCta) throw new Error(`Format ${fmt} missing "💬 CAST YOUR VOTE IN THE COMMENTS!" CTA!`);

      // 2. Verify all percentage occurrences are strictly "0%"
      const zeroPctCount = drawnTexts.filter(t => t.text === '0%').length;
      if (zeroPctCount < 3) {
        throw new Error(`Format ${fmt} expected at least 3 "0%" text calls, found ${zeroPctCount}`);
      }

      // 3. Verify NO undefined%, NaN%, or non-zero vote percentages appear on graphic
      const hasInvalidPct = drawnTexts.some(t => t.text.includes('undefined%') || t.text.includes('NaN%'));
      if (hasInvalidPct) {
        throw new Error(`Format ${fmt} contains invalid percentage text!`);
      }

      // 4. Verify internal website vote count strings are removed from graphic
      const hasInternalVoteText = drawnTexts.some(t => /\b\d+\s+votes\b/i.test(t.text) || /\b\d+\s+fan votes\b/i.test(t.text));
      if (hasInternalVoteText) {
        throw new Error(`Format ${fmt} still contains internal website vote counts on graphic!`);
      }

      // 5. Verify official branding & compliance footer intact
      const hasBranding = drawnTexts.some(t => t.text.includes('https://deeppredictbet.com'));
      const hasCompliance = drawnTexts.some(t => t.text.includes('18+ · Gamble Responsibly'));
      if (!hasBranding || !hasCompliance) {
        throw new Error(`Format ${fmt} missing mandatory branding or compliance footer!`);
      }
    });
  }

  // ---------------------------------------------------------------------
  // Suite 2: Strict Separation of Concerns (Live Website Data Unaltered)
  // ---------------------------------------------------------------------
  console.log('\n--- Suite 2: Strict Separation of Concerns ---');

  await it('Live website getMatchFanVotes still returns authentic vote counts and percentages', () => {
    const liveVotes = FanArenaEngine.getMatchFanVotes(sampleUpcomingMatch.id, sampleUpcomingMatch);
    if (!liveVotes.hasVotes || liveVotes.totalVotes <= 0) {
      throw new Error('Live match must have active community votes');
    }
    if (liveVotes.homePct === 0 && liveVotes.drawPct === 0 && liveVotes.awayPct === 0) {
      throw new Error('Live website votes must NOT be set to 0%!');
    }
    if (liveVotes.homePct + liveVotes.drawPct + liveVotes.awayPct !== 100) {
      throw new Error('Live percentages must strictly sum to 100%');
    }
  });

  await it('User voting continues to function normally and dynamically updates website counts', () => {
    const initial = FanArenaEngine.getMatchFanVotes(sampleUpcomingMatch.id, sampleUpcomingMatch);
    FanArenaEngine.castFanVote(sampleUpcomingMatch.id, 'home');
    const updated = FanArenaEngine.getMatchFanVotes(sampleUpcomingMatch.id, sampleUpcomingMatch);

    if (updated.homeVotes !== initial.homeVotes + 1) {
      throw new Error('Casting vote did not increment home vote tally');
    }
  });

  // ---------------------------------------------------------------------
  // Suite 3: Dedicated Factual Social Caption System
  // ---------------------------------------------------------------------
  console.log('\n--- Suite 3: Dedicated Factual Social Caption Generation ---');

  await it('generateFanArenaSocialCaption produces rich, factual caption for upcoming fixture', () => {
    const cap = FanArenaEngine.generateFanArenaSocialCaption(sampleUpcomingMatch, 0);

    if (!cap.includes('⚽ THE FAN ARENA POLL IS OPEN!')) {
      throw new Error('Missing primary hook in variant 0');
    }
    if (!cap.includes('Arsenal vs Chelsea')) {
      throw new Error('Missing fixture names in caption');
    }
    if (!cap.includes('Premier League')) {
      throw new Error('Missing competition name');
    }
    if (!cap.includes('1️⃣ Arsenal Win') || !cap.includes('🤝 Match Draw') || !cap.includes('2️⃣ Chelsea Win')) {
      throw new Error('Missing 1/X/2 options formatted for social poll');
    }
    if (!cap.includes('💬 CAST YOUR VOTE IN THE COMMENTS!')) {
      throw new Error('Missing comments call to action');
    }
    if (!cap.includes('https://deeppredictbet.com')) {
      throw new Error('Missing official website URL');
    }
    if (!cap.includes('#DeepPredictBet') || !cap.includes('#FanArena') || !cap.includes('#PremierLeague')) {
      throw new Error('Missing mandatory hashtags');
    }
  });

  await it('generateFanArenaSocialCaption cycles through dynamic variants with distinct hooks', () => {
    const cap0 = FanArenaEngine.generateFanArenaSocialCaption(sampleUpcomingMatch, 0);
    const cap1 = FanArenaEngine.generateFanArenaSocialCaption(sampleUpcomingMatch, 1);
    const cap2 = FanArenaEngine.generateFanArenaSocialCaption(sampleUpcomingMatch, 2);
    const cap3 = FanArenaEngine.generateFanArenaSocialCaption(sampleUpcomingMatch, 3);

    if (!cap1.includes('🔥 FOOTBALL FANS, WE WANT YOUR VERDICT!')) {
      throw new Error('Variant 1 hook incorrect');
    }
    if (!cap2.includes('💬 WHO GETS YOUR VOTE IN THIS SHOWDOWN?')) {
      throw new Error('Variant 2 hook incorrect');
    }
    if (!cap3.includes('⚡ MATCH PREDICTION POLL — WHO TAKES THE POINTS?')) {
      throw new Error('Variant 3 hook incorrect');
    }
  });

  await it('generateFanArenaSocialCaption tailors retrospective tone for finished (FT) fixtures', () => {
    const ftCap = FanArenaEngine.generateFanArenaSocialCaption(sampleFinishedMatch, 0);
    if (!ftCap.includes('Manchester United vs Chelsea') || (!ftCap.includes('🏁 POST-MATCH FAN DEBATE') && !ftCap.includes('🏁 FAN ARENA POLL REVIEW'))) {
      throw new Error('FT match should produce retrospective review hook');
    }
    if (!ftCap.includes('Final Score: Manchester United 2 - 1 Chelsea')) {
      throw new Error('FT match should display official scoreline');
    }
    if (!ftCap.includes('Did this match outcome match your pre-match prediction?')) {
      throw new Error('FT match should ask fans about outcome match');
    }
  });

  // ---------------------------------------------------------------------
  // Suite 4: Caption State, Editing, Regenerate & Restore
  // ---------------------------------------------------------------------
  console.log('\n--- Suite 4: Caption State, Editing & Actions ---');

  await it('getFanArenaCaption retrieves initial caption and updateFanArenaCaption persists edits', () => {
    const mId = sampleUpcomingMatch.id;
    const initial = FanArenaEngine.getFanArenaCaption(mId, sampleUpcomingMatch);
    if (!initial || typeof initial !== 'string') throw new Error('Initial caption empty');

    const customText = 'My customized caption for Instagram!';
    FanArenaEngine.updateFanArenaCaption(mId, customText);

    const retrieved = FanArenaEngine.getFanArenaCaption(mId, sampleUpcomingMatch);
    if (retrieved !== customText) {
      throw new Error('updateFanArenaCaption failed to persist custom text');
    }
  });

  await it('regenerateFanArenaCaption cycles to next variant', () => {
    const mId = sampleUpcomingMatch.id;
    const fresh = FanArenaEngine.regenerateFanArenaCaption(mId, sampleUpcomingMatch);
    if (!fresh.includes('🔥 FOOTBALL FANS, WE WANT YOUR VERDICT!')) {
      throw new Error('regenerateFanArenaCaption did not advance to variant 1');
    }
  });

  await it('restoreFanArenaCaption reverts caption to original baseline', () => {
    const mId = sampleUpcomingMatch.id;
    const restored = FanArenaEngine.restoreFanArenaCaption(mId, sampleUpcomingMatch);
    if (!restored.includes('⚽ THE FAN ARENA POLL IS OPEN!')) {
      throw new Error('restoreFanArenaCaption failed to restore variant 0');
    }
  });

  await it('copyFanArenaCaption copies text and provides visual feedback', async () => {
    let clipboardData = '';
    window.navigator.clipboard = {
      writeText: (txt) => {
        clipboardData = txt;
        return Promise.resolve();
      }
    };

    const fakeBtn = { innerHTML: '<span>Copy</span>', style: {} };
    FanArenaEngine.copyFanArenaCaption(sampleUpcomingMatch.id, fakeBtn);

    // Allow promise microtask to resolve
    await new Promise(r => setTimeout(r, 20));

    if (!clipboardData.includes('⚽ THE FAN ARENA POLL IS OPEN!')) {
      throw new Error('Clipboard did not receive generated caption text');
    }
    if (!fakeBtn.innerHTML.includes('Copied!')) {
      throw new Error('Copy button did not show feedback');
    }
  });

  // ---------------------------------------------------------------------
  // Suite 5: Studio & Modal HTML Layout Verification
  // ---------------------------------------------------------------------
  console.log('\n--- Suite 5: Studio & Modal HTML Layout ---');

  await it('Telegram / Social Media Command Center studio includes Factual Social Caption section', () => {
    window.AUTHENTIC_TOP_LEAGUES_FIXTURES = [sampleUpcomingMatch];
    TelegramPublisher.selectFanArenaMatch(sampleUpcomingMatch.id);

    const html = TelegramPublisher.renderFanArenaTab();
    if (!html.includes('Factual Social Caption (Editable):')) {
      throw new Error('Command Center Studio missing "Factual Social Caption (Editable):"');
    }
    if (!html.includes('id="tg-fa-social-caption-textarea"')) {
      throw new Error('Command Center Studio missing textarea #tg-fa-social-caption-textarea');
    }
    if (!html.includes('id="tg-fa-caption-copy-btn"') || !html.includes('Copy Caption')) {
      throw new Error('Command Center Studio missing Copy Caption button');
    }
    if (!html.includes('Regenerate Caption') || !html.includes('Restore Original')) {
      throw new Error('Command Center Studio missing Regenerate or Restore buttons');
    }
  });

  await it('Fan Arena Modal in index.html includes Factual Social Caption section and v3 cache busters', () => {
    if (!indexHtml.includes('Factual Social Caption (Editable):')) {
      throw new Error('Modal in index.html missing "Factual Social Caption (Editable):"');
    }
    if (!indexHtml.includes('id="fan-arena-modal-social-caption-textarea"')) {
      throw new Error('Modal in index.html missing #fan-arena-modal-social-caption-textarea');
    }
    if (!indexHtml.includes('/js/telegramPublisher.js?v=20261110_tg_fan_arena_v3') && !indexHtml.includes('/js/telegramPublisher.js?v=20261111_tg_fan_arena_v4')) {
      throw new Error('index.html missing bumped telegramPublisher.js v3 or v4 cache buster');
    }
    if (!indexHtml.includes('/js/fanArenaEngine.js?v=20261110_fan_v3') && !indexHtml.includes('/js/fanArenaEngine.js?v=20261111_fan_v4')) {
      throw new Error('index.html missing bumped fanArenaEngine.js v3 or v4 cache buster');
    }
  });

  // ---------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(`Results: ${passedTests} / ${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('======================================================================');

  if (passedTests !== totalTests) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Test Suite Unhandled Exception:', err);
  process.exit(1);
});
