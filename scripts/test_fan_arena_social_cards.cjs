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

console.log('🧪 Starting DeepPredictBet Fan Arena & Social Media Match Cards Test Suite...\n');

// 1. Setup JSDOM with index.html without fetching external resources
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const dom = new JSDOM(indexHtml, {
  runScripts: "outside-only",
  url: "https://deeppredictbet.com"
});

const { window } = dom;

// Polyfill mock 2D canvas context for JSDOM environment
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

// Load Fan Arena Engine
const fanArenaCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'fanArenaEngine.js'), 'utf8');
window.eval(fanArenaCode);

const { FanArenaEngine } = window;

// Sample Fixture
const sampleMatch = {
  id: 'mci_ful_test',
  fixtureId: 5036,
  league: 'Premier League',
  leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  date: 'Saturday, 14 Nov',
  time: '16:30',
  homeTeam: { name: 'Manchester City', id: 50 },
  awayTeam: { name: 'Fulham', id: 36 },
  scores: { home: 2, away: 1 },
  isLive: false,
  isFT: true,
  statusShort: 'FT'
};

console.log('--- Suite 1: Fan Voting Mechanism & Dynamic Recalculation ---');

it('Calculates baseline fan votes and percentages correctly', () => {
  const votes = FanArenaEngine.getMatchFanVotes(sampleMatch.id, sampleMatch);
  if (votes.totalVotes <= 0) throw new Error('Total votes should be greater than zero');
  if (votes.homePct + votes.drawPct + votes.awayPct !== 100) {
    throw new Error(`Percentages must sum to 100: got ${votes.homePct + votes.drawPct + votes.awayPct}`);
  }
});

it('Casting a vote increments the selected outcome and persists to localStorage', () => {
  const initial = FanArenaEngine.getMatchFanVotes(sampleMatch.id, sampleMatch);
  FanArenaEngine.castFanVote(sampleMatch.id, 'home');
  const updated = FanArenaEngine.getMatchFanVotes(sampleMatch.id, sampleMatch);

  if (updated.homeVotes !== initial.homeVotes + 1) {
    throw new Error(`Expected home votes to be ${initial.homeVotes + 1}, got ${updated.homeVotes}`);
  }
  if (updated.userVote !== 'home') {
    throw new Error(`Expected userVote to be 'home', got ${updated.userVote}`);
  }
});

it('Switching vote adjusts tallies dynamically without duplicating votes', () => {
  const beforeSwitch = FanArenaEngine.getMatchFanVotes(sampleMatch.id, sampleMatch);
  FanArenaEngine.castFanVote(sampleMatch.id, 'away');
  const afterSwitch = FanArenaEngine.getMatchFanVotes(sampleMatch.id, sampleMatch);

  if (afterSwitch.homeVotes !== beforeSwitch.homeVotes - 1) {
    throw new Error('Home votes did not decrement when switching to away');
  }
  if (afterSwitch.awayVotes !== beforeSwitch.awayVotes + 1) {
    throw new Error('Away votes did not increment when switching to away');
  }
  if (afterSwitch.userVote !== 'away') {
    throw new Error(`Expected userVote to be 'away', got ${afterSwitch.userVote}`);
  }
});

console.log('\n--- Suite 2: Social Media Formats & Canvas Rendering ---');

it('Renders Square (1080 × 1080) canvas correctly with all metadata', () => {
  const canvas = FanArenaEngine.generateFanArenaCardCanvas(sampleMatch, 'square');
  if (!canvas) throw new Error('Failed to generate square canvas');
  if (canvas.width !== 1080 || canvas.height !== 1080) {
    throw new Error(`Expected 1080x1080, got ${canvas.width}x${canvas.height}`);
  }
});

it('Renders Portrait / Story (1080 × 1920) canvas correctly for WhatsApp Status & Stories', () => {
  const canvas = FanArenaEngine.generateFanArenaCardCanvas(sampleMatch, 'portrait');
  if (!canvas) throw new Error('Failed to generate portrait canvas');
  if (canvas.width !== 1080 || canvas.height !== 1920) {
    throw new Error(`Expected 1080x1920, got ${canvas.width}x${canvas.height}`);
  }
});

it('Renders Landscape (1200 × 675) canvas correctly for Facebook & X posts', () => {
  const canvas = FanArenaEngine.generateFanArenaCardCanvas(sampleMatch, 'landscape');
  if (!canvas) throw new Error('Failed to generate landscape canvas');
  if (canvas.width !== 1200 || canvas.height !== 675) {
    throw new Error(`Expected 1200x675, got ${canvas.width}x${canvas.height}`);
  }
});

console.log('\n--- Suite 3: Match State Dynamic Adaptation ---');

it('Adapts dynamically to Upcoming match (kickoff time, VS, no fabricated score)', () => {
  const upcomingMatch = {
    ...sampleMatch,
    id: 'upcoming_test',
    isLive: false,
    isFT: false,
    scores: { home: null, away: null },
    time: '20:00'
  };
  const canvas = FanArenaEngine.generateFanArenaCardCanvas(upcomingMatch, 'square');
  if (!canvas) throw new Error('Failed to generate upcoming canvas');
});

it('Adapts dynamically to In-Play 1st Half / 2nd Half match', () => {
  const liveMatch = {
    ...sampleMatch,
    id: 'live_test',
    isLive: true,
    elapsed: 68,
    scores: { home: 1, away: 0 }
  };
  const canvas = FanArenaEngine.generateFanArenaCardCanvas(liveMatch, 'square');
  if (!canvas) throw new Error('Failed to generate live match canvas');
});

console.log('\n--- Suite 4: Download Filename & Export Requirements ---');

it('Generates unique and meaningful export filenames', () => {
  const fnSquare = FanArenaEngine.generateDownloadFilename(sampleMatch, 'square', 'png');
  if (fnSquare !== 'DeepPredictBet-Manchester-City-vs-Fulham-Fan-Arena-1080x1080.png') {
    throw new Error(`Unexpected filename: ${fnSquare}`);
  }

  const fnStory = FanArenaEngine.generateDownloadFilename(sampleMatch, 'portrait', 'jpg');
  if (fnStory !== 'DeepPredictBet-Manchester-City-vs-Fulham-Fan-Arena-1080x1920.jpg') {
    throw new Error(`Unexpected filename: ${fnStory}`);
  }

  const fnLandscape = FanArenaEngine.generateDownloadFilename(sampleMatch, 'landscape', 'png');
  if (fnLandscape !== 'DeepPredictBet-Manchester-City-vs-Fulham-Fan-Arena-1200x675.png') {
    throw new Error(`Unexpected filename: ${fnLandscape}`);
  }
});

console.log('\n--- Suite 5: DOM Integration & Accessibility ---');

it('index.html contains #fan-arena-modal with interactive voting and download controls', () => {
  const modal = window.document.getElementById('fan-arena-modal');
  if (!modal) throw new Error('Missing #fan-arena-modal in DOM');

  const dlBtn = modal.querySelector('.fan-arena-download-btn');
  if (!dlBtn || !dlBtn.textContent.includes('DOWNLOAD MATCH CARD')) {
    throw new Error('Missing DOWNLOAD MATCH CARD button');
  }

  const homeBtn = modal.querySelector('#fan-vote-btn-home');
  const drawBtn = modal.querySelector('#fan-vote-btn-draw');
  const awayBtn = modal.querySelector('#fan-vote-btn-away');
  if (!homeBtn || !drawBtn || !awayBtn) {
    throw new Error('Missing one or more voting choice buttons');
  }

  const canvasContainer = modal.querySelector('#fan-arena-canvas-preview-container');
  if (!canvasContainer) {
    throw new Error('Missing canvas preview container');
  }
});

console.log('\n========================================');
console.log(`RESULTS: ${passedTests}/${totalTests} Tests Passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
