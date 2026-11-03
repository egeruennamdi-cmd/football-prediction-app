const fs = require('fs');

global.window = global;
global.document = {
  readyState: 'complete',
  addEventListener: () => {},
  getElementById: () => null
};

require('../js/data.js');
require('../js/teamCrests.js');

// Helper to normalize team name
function normalizeTeamName(rawName) {
  if (!rawName) return '';
  const s = String(rawName).trim();
  const lower = s.toLowerCase();

  const aliases = {
    'man city': 'Manchester City',
    'manchester city': 'Manchester City',
    'mancity': 'Manchester City',
    'arsenal': 'Arsenal',
    'liverpool': 'Liverpool',
    'chelsea': 'Chelsea',
    'spurs': 'Spurs (Tottenham)',
    'tottenham': 'Spurs (Tottenham)',
    'tottenham hotspur': 'Spurs (Tottenham)',
    'spurs (tottenham)': 'Spurs (Tottenham)',
    'man united': 'Manchester United',
    'man utd': 'Manchester United',
    'manchester united': 'Manchester United',
    'newcastle': 'Newcastle United',
    'newcastle united': 'Newcastle United',
    'aston villa': 'Aston Villa',
    'villa': 'Aston Villa',
    'brighton': 'Brighton',
    'brighton and hove albion': 'Brighton',
    'west ham': 'West Ham',
    'west ham united': 'West Ham',
    'brentford': 'Brentford',
    'fulham': 'Fulham',
    'everton': 'Everton',
    'bournemouth': 'Bournemouth',
    'nottingham forest': 'Nottingham Forest',
    'forest': 'Nottingham Forest',
    'crystal palace': 'Crystal Palace',
    'palace': 'Crystal Palace',
    'leicester': 'Leicester City',
    'leicester city': 'Leicester City',
    'southampton': 'Southampton',
    'wolves': 'Wolves',
    'wolverhampton': 'Wolves',
    'wolverhampton wanderers': 'Wolves',
    'ipswich': 'Ipswich Town',
    'ipswich town': 'Ipswich Town',
    'leeds': 'Leeds United',
    'leeds united': 'Leeds United',
    'hull': 'Hull City',
    'hull city': 'Hull City'
  };

  if (aliases[lower]) return aliases[lower];
  return s;
}

// Build baseline map for Premier League
const baselineClubs = (global.GLOBAL_CLUBS || []).filter(c => c.league === 'Premier League');
const tableMap = new Map();

baselineClubs.forEach(c => {
  const normName = normalizeTeamName(c.name);
  tableMap.set(normName, {
    name: normName,
    matchesPlayed: c.matchesPlayed || 0,
    wins: c.wins || 0,
    draws: c.draws || 0,
    losses: c.losses || 0,
    goalsFor: c.goalsFor || 0,
    goalsAgainst: c.goalsAgainst || 0,
    goalDiff: (c.goalsFor !== undefined && c.goalsAgainst !== undefined) ? (c.goalsFor - c.goalsAgainst) : (c.goalDiff || 0),
    points: c.points || 0,
    form: typeof c.form === 'string' ? c.form.split('') : (Array.isArray(c.form) ? [...c.form] : [])
  });
});

console.log(`Baseline Premier League teams loaded: ${tableMap.size}`);
console.log('Initial Chelsea:', tableMap.get('Chelsea'));

// Ingest completed Premier League matches from MATCH_DATA
const processedMatchIds = new Set();
const completedMatches = (global.MATCH_DATA || []).filter(m => m.isFT || m.status === 'FT');

console.log(`\nFound ${completedMatches.length} completed matches in MATCH_DATA:`);
completedMatches.forEach(m => {
  if (processedMatchIds.has(m.id)) return;
  processedMatchIds.add(m.id);

  if (m.league !== 'Premier League') {
    console.log(`Skipping non-EPL match ${m.id} (${m.league})`);
    return;
  }

  const homeRaw = m.homeTeam?.name || m.homeTeam;
  const awayRaw = m.awayTeam?.name || m.awayTeam;
  const homeName = normalizeTeamName(homeRaw);
  const awayName = normalizeTeamName(awayRaw);

  const homeGoals = m.scores?.home ?? 0;
  const awayGoals = m.scores?.away ?? 0;

  console.log(`Ingesting ${m.id}: ${homeName} ${homeGoals} - ${awayGoals} ${awayName}`);

  let homeTeam = tableMap.get(homeName);
  if (!homeTeam) {
    homeTeam = { name: homeName, matchesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [] };
    tableMap.set(homeName, homeTeam);
  }

  let awayTeam = tableMap.get(awayName);
  if (!awayTeam) {
    awayTeam = { name: awayName, matchesPlayed: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [] };
    tableMap.set(awayName, awayTeam);
  }

  homeTeam.matchesPlayed += 1;
  awayTeam.matchesPlayed += 1;

  homeTeam.goalsFor += homeGoals;
  homeTeam.goalsAgainst += awayGoals;
  homeTeam.goalDiff = homeTeam.goalsFor - homeTeam.goalsAgainst;

  awayTeam.goalsFor += awayGoals;
  awayTeam.goalsAgainst += homeGoals;
  awayTeam.goalDiff = awayTeam.goalsFor - awayTeam.goalsAgainst;

  if (homeGoals > awayGoals) {
    homeTeam.wins += 1;
    homeTeam.points += 3;
    homeTeam.form.push('W');

    awayTeam.losses += 1;
    awayTeam.form.push('L');
  } else if (homeGoals < awayGoals) {
    awayTeam.wins += 1;
    awayTeam.points += 3;
    awayTeam.form.push('W');

    homeTeam.losses += 1;
    homeTeam.form.push('L');
  } else {
    homeTeam.draws += 1;
    homeTeam.points += 1;
    homeTeam.form.push('D');

    awayTeam.draws += 1;
    awayTeam.points += 1;
    awayTeam.form.push('D');
  }
});

console.log('\nUpdated Chelsea:', tableMap.get('Chelsea'));
console.log('Updated Liverpool:', tableMap.get('Liverpool'));
console.log('Updated Fulham:', tableMap.get('Fulham'));

// Sort Premier League standings (Points -> GD -> GF -> Alphabetical)
const sorted = Array.from(tableMap.values()).sort((a, b) => {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.name.localeCompare(b.name);
});

console.log('\n--- TOP 10 PREMIER LEAGUE STANDINGS AFTER COMPLETED MATCHDAY 3 FIXTURES ---');
sorted.slice(0, 10).forEach((t, i) => {
  console.log(`${i+1}. ${t.name.padEnd(20)} P:${t.matchesPlayed} W:${t.wins} D:${t.draws} L:${t.losses} GF:${t.goalsFor} GA:${t.goalsAgainst} GD:${t.goalDiff >= 0 ? '+' : ''}${t.goalDiff} PTS:${t.points} Form:${t.form.slice(-5).join('')}`);
});
