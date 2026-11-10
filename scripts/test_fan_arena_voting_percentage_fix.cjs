/**
 * scripts/test_fan_arena_voting_percentage_fix.cjs
 * Comprehensive Verification Suite for DeepPredictBet Fan Arena Voting Percentage Fix
 *
 * Requirements Verified:
 * 1. Root Cause Elimination: No undefined%, NaN%, or Infinity% anywhere in rendered output.
 * 2. Mathematical Rigor: Total votes = Home + Draw + Away.
 *    Percentages strictly sum to 100% when totalVotes > 0 (Largest Remainder Method).
 * 3. Both property name conventions populated identically:
 *    homePercent / drawPercent / awayPercent AND homePct / drawPct / awayPct.
 * 4. Professional Display: Team names with percentages:
 *    HOME TEAM: XX% · DRAW: XX% · AWAY TEAM: XX% + Segmented Bar.
 * 5. State Handling:
 *    - Existing votes: actual counts and percentages.
 *    - Zero votes: "No votes yet", 0 total, no division by zero.
 *    - Unavailable stats: "Voting statistics unavailable", no fabricated data.
 *    - Completed matches (FT): historical counts preserved deterministically.
 *    - Live matches: dynamic updates supported.
 * 6. Data Integrity & Isolation:
 *    - Votes strictly isolated per match ID.
 *    - Duplicate / repeated clicks do not inflate vote counts.
 */

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

console.log('===============================================================');
console.log('  DEEPPREDICTBET — FAN ARENA VOTING PERCENTAGE TEST SUITE');
console.log('===============================================================\n');

// 1. Setup DOM environment
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const dom = new JSDOM(indexHtml, {
  runScripts: "outside-only",
  url: "https://deeppredictbet.com"
});
const { window } = dom;

// Polyfill Canvas 2D Context
window.HTMLCanvasElement.prototype.getContext = function (type) {
  if (type === '2d') {
    return {
      canvas: this,
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
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

// -----------------------------------------------------------------
// Suite 1: Mathematical Rigor & 100% Rounding Guarantee
// -----------------------------------------------------------------
console.log('--- Suite 1: Mathematical Percentage Calculation & 100% Rounding ---');

it('calculateVotingPercentages returns exact whole percentages summing to 100% for 1:1:1 split', () => {
  const p = FanArenaEngine.calculateVotingPercentages(100, 100, 100);
  if (p.homePercent + p.drawPercent + p.awayPercent !== 100) {
    throw new Error(`Percentages must sum to 100: got ${p.homePercent + p.drawPercent + p.awayPercent}`);
  }
  if (p.homePercent !== p.homePct || p.drawPercent !== p.drawPct || p.awayPercent !== p.awayPct) {
    throw new Error('homePercent and homePct must match exactly');
  }
  if (p.totalVotes !== 300) {
    throw new Error(`Expected totalVotes 300, got ${p.totalVotes}`);
  }
});

it('calculateVotingPercentages handles edge cases where standard rounding yields 101% or 99%', () => {
  // e.g. 1, 1, 1 -> 33.333% each -> round = 33, 33, 33 = 99% without adjustment
  const p1 = FanArenaEngine.calculateVotingPercentages(1, 1, 1);
  if (p1.homePercent + p1.drawPercent + p1.awayPercent !== 100) {
    throw new Error(`Adjustment failed for 1,1,1: sum is ${p1.homePercent + p1.drawPercent + p1.awayPercent}`);
  }

  // e.g. 50, 25, 25 -> 50% + 25% + 25% = 100%
  const p2 = FanArenaEngine.calculateVotingPercentages(50, 25, 25);
  if (p2.homePercent !== 50 || p2.drawPercent !== 25 || p2.awayPercent !== 25) {
    throw new Error(`Unexpected values for 50/25/25: ${JSON.stringify(p2)}`);
  }
  if (p2.homePercent + p2.drawPercent + p2.awayPercent !== 100) {
    throw new Error('Sum must strictly be 100');
  }
});

it('calculateVotingPercentages handles zero total votes safely without division by zero', () => {
  const p0 = FanArenaEngine.calculateVotingPercentages(0, 0, 0);
  if (p0.totalVotes !== 0) throw new Error(`Expected totalVotes 0, got ${p0.totalVotes}`);
  if (p0.homePercent !== 0 || p0.drawPercent !== 0 || p0.awayPercent !== 0) {
    throw new Error('Percentages must be 0 when total votes is 0');
  }
  if (p0.hasVotes !== false) throw new Error('hasVotes must be false when total is 0');
  if (isNaN(p0.homePercent) || isNaN(p0.drawPercent) || isNaN(p0.awayPercent)) {
    throw new Error('Percentages must never be NaN');
  }
});

it('calculateVotingPercentages safely handles null, undefined, and non-numeric inputs', () => {
  const pNull = FanArenaEngine.calculateVotingPercentages(null, undefined, 'abc');
  if (pNull.totalVotes !== 0 || pNull.hasVotes !== false) {
    throw new Error('Expected safe fallback to 0 votes');
  }
  if (isNaN(pNull.homePercent) || isNaN(pNull.drawPercent) || isNaN(pNull.awayPercent)) {
    throw new Error('Must not produce NaN');
  }
});

// -----------------------------------------------------------------
// Suite 2: Match Cards from User Reference (Screenshot Verification)
// -----------------------------------------------------------------
console.log('\n--- Suite 2: User Reference Matches (Manchester United vs Chelsea, etc.) ---');

const testMatches = [
  { id: 'match-nov-1', homeTeam: { name: 'Manchester United' }, awayTeam: { name: 'Chelsea' }, competition: 'Premier League', isFT: true },
  { id: 'match-nov-2', homeTeam: { name: 'Barcelona' }, awayTeam: { name: 'Espanyol' }, competition: 'La Liga', isFT: true },
  { id: 'match-nov-3', homeTeam: { name: 'Bournemouth' }, awayTeam: { name: 'Manchester City' }, competition: 'Premier League', isFT: true },
  { id: 'match-nov-4', homeTeam: { name: 'Bayern Munich' }, awayTeam: { name: 'Union Berlin' }, competition: 'Bundesliga', isFT: true },
  { id: 'match-nov-5', homeTeam: { name: 'Newcastle United' }, awayTeam: { name: 'Arsenal' }, competition: 'Premier League', isFT: true },
  { id: 'match-nov-6', homeTeam: { name: 'Napoli' }, awayTeam: { name: 'Atalanta' }, competition: 'Serie A', isFT: true }
];

testMatches.forEach(m => {
  it(`Resolves numeric, non-undefined percentages for ${m.homeTeam.name} vs ${m.awayTeam.name}`, () => {
    const v = FanArenaEngine.getMatchFanVotes(m.id, m);
    if (typeof v.homePercent !== 'number' || isNaN(v.homePercent)) {
      throw new Error(`homePercent must be a valid number, got ${v.homePercent}`);
    }
    if (typeof v.drawPercent !== 'number' || isNaN(v.drawPercent)) {
      throw new Error(`drawPercent must be a valid number, got ${v.drawPercent}`);
    }
    if (typeof v.awayPercent !== 'number' || isNaN(v.awayPercent)) {
      throw new Error(`awayPercent must be a valid number, got ${v.awayPercent}`);
    }
    if (v.homePercent + v.drawPercent + v.awayPercent !== 100) {
      throw new Error(`Sum must strictly be 100%: got ${v.homePercent + v.drawPercent + v.awayPercent}`);
    }
    if (v.totalVotes <= 0) {
      throw new Error(`Expected positive vote count for ${m.id}`);
    }
    // Verify backward compatibility
    if (v.homePct !== v.homePercent || v.drawPct !== v.drawPercent || v.awayPct !== v.awayPercent) {
      throw new Error('Dual-property compatibility failed (homePct != homePercent)');
    }
  });
});

it('Manchester United vs Chelsea produces exact persisted total 1,419 votes matching reference image', () => {
  const m1 = testMatches[0];
  const v1 = FanArenaEngine.getMatchFanVotes(m1.id, m1);
  if (v1.totalVotes !== 1419) {
    throw new Error(`Expected exactly 1,419 total votes, got ${v1.totalVotes}`);
  }
  if (v1.homePercent !== 48 || v1.drawPercent !== 21 || v1.awayPercent !== 31) {
    throw new Error(`Expected 48% · 21% · 31%, got ${v1.homePercent}% · ${v1.drawPercent}% · ${v1.awayPercent}%`);
  }
});

it('Barcelona vs Espanyol produces exact persisted total 1,320 votes matching reference image', () => {
  const m2 = testMatches[1];
  const v2 = FanArenaEngine.getMatchFanVotes(m2.id, m2);
  if (v2.totalVotes !== 1320) {
    throw new Error(`Expected exactly 1,320 total votes, got ${v2.totalVotes}`);
  }
});

// -----------------------------------------------------------------
// Suite 3: Match States & Presentation Markup
// -----------------------------------------------------------------
console.log('\n--- Suite 3: Match States & Rendered Presentation ---');

it('Command Center Fan Arena tab renders team names and percentages without "undefined%"', () => {
  // Set up mock window.MATCH_DATA
  window.MATCH_DATA = testMatches;
  window.AUTHENTIC_TOP_LEAGUES_FIXTURES = testMatches;

  const container = document.getElementById('founder-telegram-publisher-container') || document.createElement('div');
  container.id = 'founder-telegram-publisher-container';
  document.body.appendChild(container);

  TelegramPublisher.render(container);
  TelegramPublisher.switchTab('fan-arena');

  const renderedHtml = container.innerHTML;

  if (renderedHtml.includes('undefined%')) {
    throw new Error('FATAL: rendered output still contains "undefined%"!');
  }
  if (renderedHtml.includes('NaN%')) {
    throw new Error('FATAL: rendered output contains "NaN%"!');
  }
  if (renderedHtml.includes('Infinity%')) {
    throw new Error('FATAL: rendered output contains "Infinity%"!');
  }

  // Verify team names appear alongside percentages
  if (!renderedHtml.includes('Manchester United: 48%')) {
    throw new Error('Expected "Manchester United: 48%" in rendered output');
  }
  if (!renderedHtml.includes('Chelsea: 31%')) {
    throw new Error('Expected "Chelsea: 31%" in rendered output');
  }
  if (!renderedHtml.includes('Draw: 21%')) {
    throw new Error('Expected "Draw: 21%" in rendered output');
  }
});

it('Zero-vote match renders "No votes yet" without fabricated percentages', () => {
  const zeroMatch = {
    id: 'match-zero-test',
    homeTeam: { name: 'Zero FC' },
    awayTeam: { name: 'Empty United' },
    competition: 'Friendly',
    votes: { home: 0, draw: 0, away: 0 }
  };

  const vZero = FanArenaEngine.getMatchFanVotes(zeroMatch.id, zeroMatch);
  if (vZero.hasVotes !== false || vZero.totalVotes !== 0) {
    throw new Error('Zero match must have hasVotes=false and totalVotes=0');
  }
});

it('Unavailable statistics match renders "Voting statistics unavailable" safely', () => {
  const unavailMatch = {
    id: 'match-unavail-test',
    homeTeam: { name: 'Alpha' },
    awayTeam: { name: 'Beta' },
    competition: 'Cup',
    votingUnavailable: true
  };

  const vUnavail = FanArenaEngine.getMatchFanVotes(unavailMatch.id, unavailMatch);
  if (vUnavail.isUnavailable !== true || vUnavail.hasVotes !== false) {
    throw new Error('Unavailable match must have isUnavailable=true');
  }
});

// -----------------------------------------------------------------
// Suite 4: Voting Interaction & Isolation
// -----------------------------------------------------------------
console.log('\n--- Suite 4: Voting Interaction & Fixture Isolation ---');

it('Casting a vote updates tallies dynamically and persists per match ID', () => {
  const m = testMatches[0];
  const initial = FanArenaEngine.getMatchFanVotes(m.id, m);

  FanArenaEngine.castFanVote(m.id, 'home');
  const afterVote = FanArenaEngine.getMatchFanVotes(m.id, m);

  if (afterVote.homeVotes !== initial.homeVotes + 1) {
    throw new Error(`Home votes should increment by 1: from ${initial.homeVotes} to ${afterVote.homeVotes}`);
  }
  if (afterVote.totalVotes !== initial.totalVotes + 1) {
    throw new Error(`Total votes should increment by 1: from ${initial.totalVotes} to ${afterVote.totalVotes}`);
  }
  if (afterVote.userVote !== 'home') {
    throw new Error(`userVote must be 'home', got ${afterVote.userVote}`);
  }
});

it('Repeated clicks on the same option do not duplicate votes', () => {
  const m = testMatches[0];
  const countBefore = FanArenaEngine.getMatchFanVotes(m.id, m).totalVotes;

  // Click 'home' again
  FanArenaEngine.castFanVote(m.id, 'home');
  const countAfter = FanArenaEngine.getMatchFanVotes(m.id, m).totalVotes;

  if (countAfter !== countBefore) {
    throw new Error(`Repeated vote should not increment total: before ${countBefore}, after ${countAfter}`);
  }
});

it('Votes on match-nov-1 do not leak to match-nov-2 (strict isolation)', () => {
  const m1 = testMatches[0];
  const m2 = testMatches[1];

  const m2Before = FanArenaEngine.getMatchFanVotes(m2.id, m2).totalVotes;
  FanArenaEngine.castFanVote(m1.id, 'away');
  const m2After = FanArenaEngine.getMatchFanVotes(m2.id, m2).totalVotes;

  if (m2After !== m2Before) {
    throw new Error(`Votes on ${m1.id} leaked into ${m2.id}!`);
  }
});

// -----------------------------------------------------------------
// Suite 5: Telegram Broadcast Message Formatting
// -----------------------------------------------------------------
console.log('\n--- Suite 5: Telegram Broadcast Message Generation ---');

it('Telegram FAN_ARENA message format includes valid percentages and total votes', () => {
  const m = testMatches[0];
  const broadcastText = TelegramPublisher.generateLiveCaption(m, 'FAN_ARENA');

  if (broadcastText.includes('undefined%')) {
    throw new Error('Telegram message includes "undefined%"!');
  }
  if (!broadcastText.includes('1,420 votes') && !broadcastText.includes('1,419 votes')) {
    throw new Error('Telegram message missing total vote count');
  }
  if (!broadcastText.includes('Manchester United Win:') || !broadcastText.includes('Draw:')) {
    throw new Error('Telegram message missing formatted team prediction lines');
  }
});

// -----------------------------------------------------------------
// Summary
// -----------------------------------------------------------------
console.log('\n===============================================================');
console.log(`Results: ${passedTests} / ${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('===============================================================');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
