/**
 * Comprehensive Verification Suite for DEEPPREDICTBET Dynamic Live League Standings Engine
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Setup global browser environment for tests
global.window = global;
global.document = {
  readyState: 'complete',
  addEventListener: () => {},
  getElementById: () => null,
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  body: {
    appendChild: () => {}
  }
};

// Load dependencies
require('../js/data.js');
require('../js/teamCrests.js');
require('../js/standingsEngine.js');

const Engine = window.LeagueStandingsEngine;

console.log('================================================================');
console.log('  DEEPPREDICTBET DYNAMIC LEAGUE STANDINGS ENGINE TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(testName, fn) {
  try {
    Engine.resetEngine();
    fn();
    console.log(`[PASS] Test ${passCount + failCount + 1}: ${testName}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] Test ${passCount + failCount + 1}: ${testName}`);
    console.error(`       Error: ${err.message}`);
    console.error(err.stack);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// Test 1: Home Win (3 pts to home, 0 to away, GD updated)
// -----------------------------------------------------------------------------
runTest('Scenario 1: Home Win awards 3 points to home, 0 to away, and updates GD', () => {
  const match = {
    id: 'test-epl-1',
    league: 'Premier League',
    status: 'FT',
    isFT: true,
    homeTeam: { name: 'Manchester City' },
    awayTeam: { name: 'Arsenal' },
    scores: { home: 3, away: 1 }
  };

  Engine.recordMatchResult(match);
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const mci = result.standings.find(t => t.name === 'Manchester City');
  const ars = result.standings.find(t => t.name === 'Arsenal');

  assert.ok(mci, 'Manchester City must exist in standings');
  assert.ok(ars, 'Arsenal must exist in standings');
  assert.strictEqual(mci.points, 9, 'Man City should have 6 baseline + 3 = 9 points');
  assert.strictEqual(mci.goalsFor, 9, 'Man City GF should be 6 + 3 = 9');
  assert.strictEqual(mci.goalsAgainst, 3, 'Man City GA should be 2 + 1 = 3');
  assert.strictEqual(mci.goalDiff, 6, 'Man City GD should be +6');
  assert.strictEqual(ars.points, 3, 'Arsenal points should remain 3');
  assert.strictEqual(ars.goalsAgainst, 3, 'Arsenal GA should be 0 + 3 = 3');
});

// -----------------------------------------------------------------------------
// Test 2: Away Win (3 pts to away, 0 to home, GD updated)
// -----------------------------------------------------------------------------
runTest('Scenario 2: Away Win awards 3 points to away, 0 to home, and updates GD', () => {
  const match = {
    id: 'test-epl-2',
    league: 'Premier League',
    status: 'FT',
    isFT: true,
    homeTeam: { name: 'Fulham' },
    awayTeam: { name: 'Chelsea' },
    scores: { home: 1, away: 4 }
  };

  Engine.recordMatchResult(match);
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const che = result.standings.find(t => t.name === 'Chelsea');
  const ful = result.standings.find(t => t.name === 'Fulham');

  assert.strictEqual(che.points, 9, 'Chelsea should have 6 baseline + 3 = 9 points');
  assert.strictEqual(che.wins, 3, 'Chelsea should have 2 baseline + 1 = 3 wins');
  assert.strictEqual(che.goalDiff, 5, 'Chelsea GD should be 2 + 3 = 5');
  assert.strictEqual(ful.losses, 1, 'Fulham losses should increase to 1');
  assert.strictEqual(ful.points, 2, 'Fulham points should remain 2');
});

// -----------------------------------------------------------------------------
// Test 3: Draw (1 pt each, GD unchanged)
// -----------------------------------------------------------------------------
runTest('Scenario 3: Draw awards 1 point each, GD remains unchanged', () => {
  const match = {
    id: 'test-epl-3',
    league: 'Premier League',
    status: 'FT',
    isFT: true,
    homeTeam: { name: 'Brighton' },
    awayTeam: { name: 'West Ham' },
    scores: { home: 2, away: 2 }
  };

  Engine.recordMatchResult(match);
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const bri = result.standings.find(t => t.name === 'Brighton');
  const whu = result.standings.find(t => t.name === 'West Ham');

  assert.strictEqual(bri.points, 4, 'Brighton should have 3 + 1 = 4 points');
  assert.strictEqual(bri.draws, 1, 'Brighton draws should increase to 1');
  assert.strictEqual(bri.goalDiff, 3, 'Brighton GD should remain unchanged at 3');
  assert.strictEqual(whu.points, 4, 'West Ham should have 3 + 1 = 4 points');
  assert.strictEqual(whu.goalDiff, -1, 'West Ham GD should remain unchanged at -1');
});

// -----------------------------------------------------------------------------
// Test 4: Loss (0 pts, GD reduced)
// -----------------------------------------------------------------------------
runTest('Scenario 4: Loss awards 0 points and reduces GD', () => {
  const match = {
    id: 'test-epl-4',
    league: 'Premier League',
    status: 'FT',
    isFT: true,
    homeTeam: { name: 'Everton' },
    awayTeam: { name: 'Spurs (Tottenham)' },
    scores: { home: 0, away: 3 }
  };

  Engine.recordMatchResult(match);
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const eve = result.standings.find(t => t.name === 'Everton');

  assert.strictEqual(eve.points, 4, 'Everton points should remain 4');
  assert.strictEqual(eve.losses, 1, 'Everton losses should increase to 1');
  assert.strictEqual(eve.goalsAgainst, 4, 'Everton GA should increase from 1 to 4');
  assert.strictEqual(eve.goalDiff, -1, 'Everton GD should decrease from +2 to -1');
});

// -----------------------------------------------------------------------------
// Test 5: Mathematical Integrity of Table Recalculation
// -----------------------------------------------------------------------------
runTest('Scenario 5: Mathematical integrity: P = W + D + L, PTS = 3W + D, GD = GF - GA', () => {
  // Ingest completed matches from MATCH_DATA
  Engine.syncAllMatches(window.MATCH_DATA);
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });

  for (const team of result.standings) {
    assert.strictEqual(team.matchesPlayed, team.wins + team.draws + team.losses,
      `${team.name} matchesPlayed must equal wins + draws + losses`);
    assert.strictEqual(team.points, team.wins * 3 + team.draws,
      `${team.name} points must equal 3*W + D`);
    assert.strictEqual(team.goalDiff, team.goalsFor - team.goalsAgainst,
      `${team.name} goalDiff must equal GF - GA`);
  }
});

// -----------------------------------------------------------------------------
// Test 6: Position Re-ranking
// -----------------------------------------------------------------------------
runTest('Scenario 6: Position re-ranking dynamically updates table ranks', () => {
  // Start fresh and simulate high win for Arsenal to take 1st place
  const match = {
    id: 'test-ars-blowout',
    league: 'Premier League',
    status: 'FT',
    isFT: true,
    homeTeam: { name: 'Arsenal' },
    awayTeam: { name: 'Southampton' },
    scores: { home: 6, away: 0 }
  };

  Engine.recordMatchResult(match);
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });

  // Arsenal should have 3 + 3 = 6 points, GD = 3 + 6 = +9, beating Man City (+4)
  assert.strictEqual(result.standings[0].name, 'Arsenal', 'Arsenal should be ranked 1st after blowout win');
  assert.strictEqual(result.standings[0].rank, 1, 'Rank must be 1');
  assert.strictEqual(result.standings[0].goalDiff, 9, 'Arsenal GD must be +9');
});

// -----------------------------------------------------------------------------
// Test 7: Live Score Change (Provisional in-play standings)
// -----------------------------------------------------------------------------
runTest('Scenario 7: Live score change produces provisional live standings', () => {
  const liveMatch = {
    id: 'live-match-1',
    league: 'Premier League',
    status: '2H',
    isLive: true,
    minute: "74'",
    homeTeam: { name: 'Liverpool' },
    awayTeam: { name: 'Chelsea' },
    scores: { home: 3, away: 0 }
  };

  Engine.recordMatchResult(liveMatch);

  // Confirmed standings should NOT include live match
  const confirmedResult = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const livConfirmed = confirmedResult.standings.find(t => t.name === 'Liverpool');
  assert.strictEqual(livConfirmed.points, 3, 'Confirmed mode must NOT include live scores');

  // Live standings MUST include provisional score
  const liveResult = Engine.calculateStandings('Premier League', { mode: 'live' });
  const livLive = liveResult.standings.find(t => t.name === 'Liverpool');
  assert.strictEqual(livLive.points, 6, 'Live mode should include provisional 3 points for Liverpool');
  assert.strictEqual(livLive.isLive, true, 'Liverpool must be flagged as isLive');
  assert.ok(livLive.liveMatchInfo, 'Liverpool must have liveMatchInfo');
  assert.strictEqual(livLive.liveMatchInfo.score, '3 - 0', 'Live match score must be 3 - 0');
});

// -----------------------------------------------------------------------------
// Test 8: Full-Time Graduation
// -----------------------------------------------------------------------------
runTest('Scenario 8: Live match graduates to confirmed table when status transitions to FT', () => {
  const liveMatch = {
    id: 'grad-match-1',
    league: 'Premier League',
    status: '2H',
    isLive: true,
    homeTeam: { name: 'Newcastle United' },
    awayTeam: { name: 'Brentford' },
    scores: { home: 2, away: 1 }
  };

  Engine.recordMatchResult(liveMatch);
  let liveResult = Engine.calculateStandings('Premier League', { mode: 'live' });
  let newcastleLive = liveResult.standings.find(t => t.name === 'Newcastle United');
  assert.strictEqual(newcastleLive.isLive, true, 'Newcastle should initially be live');

  // Now match finishes: reaches FT
  const ftMatch = {
    ...liveMatch,
    status: 'FT',
    isFT: true,
    isLive: false
  };
  Engine.recordMatchResult(ftMatch);

  // Check Confirmed mode: Newcastle should now have 4 baseline + 3 = 7 points
  const confirmedResult = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const newcastleConfirmed = confirmedResult.standings.find(t => t.name === 'Newcastle United');
  assert.strictEqual(newcastleConfirmed.points, 7, 'Newcastle must have graduated into confirmed standings with 7 points');

  // Check Live mode: isLive flag should be cleared
  liveResult = Engine.calculateStandings('Premier League', { mode: 'live' });
  newcastleLive = liveResult.standings.find(t => t.name === 'Newcastle United');
  assert.strictEqual(newcastleLive.isLive, false, 'Newcastle isLive flag must be cleared upon FT');
});

// -----------------------------------------------------------------------------
// Test 9: Duplicate Protection (Idempotency)
// -----------------------------------------------------------------------------
runTest('Scenario 9: Ingesting the same match ID multiple times is idempotent (no double counting)', () => {
  const match = {
    id: 'idempotent-match-99',
    league: 'Premier League',
    status: 'FT',
    isFT: true,
    homeTeam: { name: 'Bournemouth' },
    awayTeam: { name: 'Everton' },
    scores: { home: 2, away: 0 }
  };

  Engine.recordMatchResult(match);
  Engine.recordMatchResult(match); // Repeat 1
  Engine.recordMatchResult(match); // Repeat 2

  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const bou = result.standings.find(t => t.name === 'Bournemouth');

  assert.strictEqual(bou.points, 4, 'Bournemouth should have 1 baseline + 3 = 4 points (not 10)');
  assert.strictEqual(bou.wins, 1, 'Bournemouth wins should be 1 (not 3)');
});

// -----------------------------------------------------------------------------
// Test 10: Postponed, Abandoned, and Cancelled Matches Ignored
// -----------------------------------------------------------------------------
runTest('Scenario 10: Postponed (PST), Abandoned (ABD), and Cancelled (CANC) matches award zero points and do not count as played', () => {
  const pstMatch = {
    id: 'pst-match-1',
    league: 'Premier League',
    status: 'PST',
    statusShort: 'PST',
    homeTeam: { name: 'Crystal Palace' },
    awayTeam: { name: 'Leicester City' },
    scores: { home: 2, away: 1 }
  };

  const abdMatch = {
    id: 'abd-match-2',
    league: 'Premier League',
    status: 'ABD',
    statusShort: 'ABD',
    homeTeam: { name: 'Southampton' },
    awayTeam: { name: 'West Ham' },
    scores: { home: 1, away: 0 }
  };

  const cancMatch = {
    id: 'canc-match-3',
    league: 'Premier League',
    status: 'CANC',
    statusShort: 'CANC',
    homeTeam: { name: 'Chelsea' },
    awayTeam: { name: 'Arsenal' },
    scores: { home: 3, away: 2 }
  };

  assert.strictEqual(Engine.classifyMatchState(pstMatch), 'IGNORED');
  assert.strictEqual(Engine.classifyMatchState(abdMatch), 'IGNORED');
  assert.strictEqual(Engine.classifyMatchState(cancMatch), 'IGNORED');

  Engine.recordMatchResult(pstMatch);
  Engine.recordMatchResult(abdMatch);
  Engine.recordMatchResult(cancMatch);

  const result = Engine.calculateStandings('Premier League', { mode: 'live' });
  const palace = result.standings.find(t => t.name === 'Crystal Palace');
  const chelsea = result.standings.find(t => t.name === 'Chelsea');

  assert.strictEqual(palace.points, 0, 'Crystal Palace points must remain 0');
  assert.strictEqual(palace.matchesPlayed, 2, 'Crystal Palace matchesPlayed must remain 2');
  assert.strictEqual(chelsea.points, 6, 'Chelsea points must remain baseline 6');
});

// -----------------------------------------------------------------------------
// Test 11: Competition-Specific Tiebreakers
// -----------------------------------------------------------------------------
runTest('Scenario 11: League-specific tiebreakers: La Liga prioritizes H2H, Premier League prioritizes overall GD', () => {
  // Scenario: Team A and Team B have identical points (10).
  // Team A has higher overall GD (+6) than Team B (+2).
  // BUT Team B beat Team A in head-to-head (1-0).

  const h2hMatch = {
    home: 'Team B',
    away: 'Team A',
    hScore: 1,
    aScore: 0
  };

  const h2hMatrix = new Map();
  h2hMatrix.set('Team B:::Team A', [h2hMatch]);

  const mockTeams = [
    { name: 'Team A', points: 10, goalDiff: 6, goalsFor: 12, wins: 3 },
    { name: 'Team B', points: 10, goalDiff: 2, goalsFor: 8, wins: 3 }
  ];

  // In Premier League (GD priority), Team A must be ranked #1
  const sortedEpl = Engine.sortStandings(mockTeams, 'Premier League', h2hMatrix);
  assert.strictEqual(sortedEpl[0].name, 'Team A', 'Premier League must rank Team A first due to higher overall GD (+6 vs +2)');

  // In La Liga (H2H priority), Team B must be ranked #1
  const sortedLaLiga = Engine.sortStandings(mockTeams, 'La Liga', h2hMatrix);
  assert.strictEqual(sortedLaLiga[0].name, 'Team B', 'La Liga must rank Team B first due to superior Head-to-Head win');
});

// -----------------------------------------------------------------------------
// Test 12: UEFA Champions League Tiebreaker (Away goals, wins, away wins)
// -----------------------------------------------------------------------------
runTest('Scenario 12: UEFA Champions League League Phase ranks by GD, GF, Away GF, Wins, Away Wins', () => {
  const mockUclTeams = [
    { name: 'Club X', points: 6, goalDiff: 4, goalsFor: 7, awayGoalsFor: 4, wins: 2, awayWins: 1 },
    { name: 'Club Y', points: 6, goalDiff: 4, goalsFor: 7, awayGoalsFor: 2, wins: 2, awayWins: 0 }
  ];

  const sortedUcl = Engine.sortStandings(mockUclTeams, 'Champions League');
  assert.strictEqual(sortedUcl[0].name, 'Club X', 'UCL tiebreaker must rank Club X first due to higher away goals for (4 vs 2)');
});

// -----------------------------------------------------------------------------
// Test 13: Authentic Crest Rendering via TeamCrestRegistry
// -----------------------------------------------------------------------------
runTest('Scenario 13: Authentic club crest rendering: Zero raw URLs as visible text, zero generic balls/emojis', () => {
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const html = Engine.renderStandingsTableHtml(result);

  assert.ok(html.includes('<img src="https://media.api-sports.io/football/teams/'), 'Must render official API-Sports CDN img tags');
  assert.ok(!html.includes('https://media.api-sports.io/football/teams/49.png<'), 'Raw URL must NEVER be rendered as visible text');
  assert.ok(!html.includes('🦁'), 'No animal emojis allowed in authentic crest mode');
  assert.ok(!html.includes('🔵'), 'No generic colored balls allowed in authentic crest mode');
  assert.ok(!html.includes('🐯'), 'No tiger emojis allowed');
  assert.ok(html.includes('Chelsea'), 'Must display Chelsea');
  assert.ok(html.includes('Manchester City'), 'Must display Manchester City');
});

// -----------------------------------------------------------------------------
// Test 14: Complete 10-Column Table Format & Zone Highlighting
// -----------------------------------------------------------------------------
runTest('Scenario 14: Complete 10-column table structure: Pos | Club | P | W | D | L | GF | GA | GD | PTS | Form', () => {
  const result = Engine.calculateStandings('Premier League', { mode: 'confirmed' });
  const html = Engine.renderStandingsTableHtml(result);

  const expectedHeaders = ['Pos', 'Club', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'PTS', 'Form'];
  for (const h of expectedHeaders) {
    assert.ok(html.includes(`>${h}<`), `Table must contain column header '${h}'`);
  }

  // Mobile overflow wrapper check
  assert.ok(html.includes('overflow-x:auto'), 'Table must have horizontal scroll wrapper');
  assert.ok(html.includes('min-width:580px'), 'Table must have minimum width 580px for mobile layout safety');
});

// -----------------------------------------------------------------------------
// Test 15: Cross-League Support (La Liga, Serie A, Bundesliga, Champions League)
// -----------------------------------------------------------------------------
runTest('Scenario 15: Reusable engine supports La Liga, Serie A, Bundesliga, and Champions League without code duplication', () => {
  const leagues = ['La Liga', 'Serie A', 'Bundesliga', 'Champions League'];

  for (const l of leagues) {
    const res = Engine.calculateStandings(l, { mode: 'confirmed' });
    assert.strictEqual(res.league, l, `League must match ${l}`);
    assert.ok(Array.isArray(res.standings), `Standings must be an array for ${l}`);
    assert.ok(res.standings.length > 0, `Standings must have teams for ${l}`);
    assert.ok(res.season === '2026/27', `Season must be 2026/27 for ${l}`);
  }
});

console.log('\n================================================================');
console.log(`  TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED (TOTAL: ${passCount + failCount})`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
