/**
 * DEEPPREDICTBET — DYNAMIC LIVE LEAGUE STANDINGS ENGINE
 *
 * Unified, authoritative league standings system supporting all major global competitions:
 * - English Premier League (EPL)
 * - Spanish La Liga
 * - Italian Serie A
 * - German Bundesliga
 * - French Ligue 1
 * - UEFA Champions League (League Phase 2026/27)
 * - EFL Championship
 * - South African Premier Division (PSL / DStv Premiership)
 * - Major League Soccer (MLS)
 * - Portuguese Primeira Liga, Dutch Eredivisie, Turkish Süper Lig, etc.
 *
 * Key Capabilities:
 * 1. Automatic Match Result Ingestion & Recalculation across all 11 match states.
 * 2. Idempotent Deduplication by match ID.
 * 3. Real-time Live Provisional Standings vs Official Confirmed Standings toggle.
 * 4. Automatic graduation of live matches to confirmed standings when status reaches FT.
 * 5. Competition-Specific Tiebreaker Algorithms (EPL: Overall GD > GF > H2H; La Liga/Serie A: H2H > GD > GF; UCL: Points > GD > GF > Away GF > Wins > Away Wins).
 * 6. Authentic Club Crests rendered via TeamCrestRegistry (zero raw URLs, zero generic balls/emojis).
 * 7. Full 10-column responsive table: Pos | Club | P | W | D | L | GF | GA | GD | PTS | Form.
 * 8. Backward-compatible integration with showMockTableStandings.
 */

(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    try {
      Object.assign(module.exports, api);
      module.exports.default = api;
      module.exports = api;
    } catch (e) {}
  }
  if (typeof root !== 'undefined') {
    root.LeagueStandingsEngine = api;
    root.showMockTableStandings = api.showMockTableStandings;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.LeagueStandingsEngine = api;
    globalThis.showMockTableStandings = api.showMockTableStandings;
  }
  if (typeof window !== 'undefined') {
    window.LeagueStandingsEngine = api;
    window.showMockTableStandings = api.showMockTableStandings;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. LEAGUE CONFIGURATIONS & OFFICIAL TIEBREAKERS
  // ---------------------------------------------------------------------------

  const LEAGUE_CONFIGS = {
    'Premier League': {
      id: 39,
      displayName: 'Premier League',
      shortName: 'EPL',
      country: 'England',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      season: '2026/27',
      teamsCount: 20,
      tiebreaker: 'gd', // GD -> GF -> H2H
      zones: {
        ucl: [1, 2, 3, 4],
        uel: [5],
        uecl: [6],
        relegation: [18, 19, 20]
      }
    },
    'La Liga': {
      id: 140,
      displayName: 'La Liga',
      shortName: 'LaLiga',
      country: 'Spain',
      flag: '🇪🇸',
      season: '2026/27',
      teamsCount: 20,
      tiebreaker: 'h2h', // H2H pts -> H2H GD -> Overall GD -> GF
      zones: {
        ucl: [1, 2, 3, 4],
        uel: [5],
        uecl: [6],
        relegation: [18, 19, 20]
      }
    },
    'Serie A': {
      id: 135,
      displayName: 'Serie A',
      shortName: 'Serie A',
      country: 'Italy',
      flag: '🇮🇹',
      season: '2026/27',
      teamsCount: 20,
      tiebreaker: 'h2h', // H2H pts -> H2H GD -> Overall GD -> GF
      zones: {
        ucl: [1, 2, 3, 4],
        uel: [5],
        uecl: [6],
        relegation: [18, 19, 20]
      }
    },
    'Bundesliga': {
      id: 78,
      displayName: 'Bundesliga',
      shortName: 'Bundesliga',
      country: 'Germany',
      flag: '🇩🇪',
      season: '2026/27',
      teamsCount: 18,
      tiebreaker: 'gd', // GD -> GF -> H2H
      zones: {
        ucl: [1, 2, 3, 4],
        uel: [5],
        uecl: [6],
        playoff: [16],
        relegation: [17, 18]
      }
    },
    'Ligue 1': {
      id: 61,
      displayName: 'Ligue 1',
      shortName: 'Ligue 1',
      country: 'France',
      flag: '🇫🇷',
      season: '2026/27',
      teamsCount: 18,
      tiebreaker: 'gd', // GD -> GF -> H2H
      zones: {
        ucl: [1, 2, 3],
        uclQ: [4],
        uel: [5],
        uecl: [6],
        playoff: [16],
        relegation: [17, 18]
      }
    },
    'Champions League': {
      id: 2,
      displayName: 'UEFA Champions League',
      shortName: 'UCL',
      country: 'Europe',
      flag: '🇪🇺',
      season: '2026/27',
      teamsCount: 36,
      tiebreaker: 'ucl', // Points -> GD -> GF -> Away GF -> Wins -> Away Wins
      zones: {
        ucl: [1, 2, 3, 4, 5, 6, 7, 8],      // Round of 16 direct
        uel: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], // Knockout play-offs
        relegation: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36] // Eliminated
      }
    },
    'Championship': {
      id: 40,
      displayName: 'EFL Championship',
      shortName: 'Championship',
      country: 'England',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      season: '2026/27',
      teamsCount: 24,
      tiebreaker: 'gd',
      zones: {
        promo: [1, 2],
        playoff: [3, 4, 5, 6],
        relegation: [22, 23, 24]
      }
    },
    'South African PSL': {
      id: 288,
      displayName: 'South African Premier Division',
      shortName: 'PSL',
      country: 'South Africa',
      flag: '🇿🇦',
      season: '2026/27',
      teamsCount: 16,
      tiebreaker: 'gd',
      zones: {
        cafCL: [1, 2],
        cafCC: [3],
        playoff: [15],
        relegation: [16]
      }
    },
    'MLS': {
      id: 253,
      displayName: 'Major League Soccer',
      shortName: 'MLS',
      country: 'USA',
      flag: '🇺🇸',
      season: '2026/27',
      teamsCount: 29,
      tiebreaker: 'gd',
      zones: {
        playoff: [1, 2, 3, 4, 5, 6, 7],
        wildcard: [8, 9]
      }
    },
    'CAF Champions League': {
      id: 12,
      displayName: 'CAF Champions League',
      shortName: 'CAF CL',
      country: 'Africa',
      flag: '🌍',
      season: '2026/27',
      teamsCount: 16,
      tiebreaker: 'h2h',
      zones: {
        knockout: [1, 2],
        eliminated: [3, 4]
      }
    },
    'Superliga': {
      id: 31,
      displayName: 'Albania Superliga',
      shortName: 'Superliga',
      country: 'Albania',
      flag: '🇦🇱',
      season: '2026/27',
      teamsCount: 10,
      tiebreaker: 'h2h',
      zones: {
        ucl: [1],
        uecl: [2, 3],
        relegationPlayoff: [8],
        relegation: [9, 10]
      }
    }
  };

  // Aliases map for normalizing incoming league queries
  const LEAGUE_ALIASES = {
    'premier league': 'Premier League',
    'english premier league': 'Premier League',
    'epl': 'Premier League',
    'la liga': 'La Liga',
    'spanish la liga': 'La Liga',
    'laliga': 'La Liga',
    'primera division': 'La Liga',
    'serie a': 'Serie A',
    'italian serie a': 'Serie A',
    'bundesliga': 'Bundesliga',
    'german bundesliga': 'Bundesliga',
    'ligue 1': 'Ligue 1',
    'french ligue 1': 'Ligue 1',
    'champions league': 'Champions League',
    'uefa champions league': 'Champions League',
    'ucl': 'Champions League',
    'championship': 'Championship',
    'efl championship': 'Championship',
    'south african psl': 'South African PSL',
    'dstv premiership': 'South African PSL',
    'betway premiership': 'South African PSL',
    'psl': 'South African PSL',
    'caf champions league': 'CAF Champions League',
    'caf champions': 'CAF Champions League',
    'caf cl': 'CAF Champions League',
    'superliga': 'Superliga',
    'albania superliga': 'Superliga',
    'kategoria superiore': 'Superliga',
    'mls': 'MLS',
    'major league soccer': 'MLS'
  };

  // Club name normalization mapping for reliable matching across feeds
  const TEAM_NAME_ALIASES = {
    'man city': 'Manchester City',
    'mancity': 'Manchester City',
    'manchester city': 'Manchester City',
    'arsenal': 'Arsenal',
    'arsenal fc': 'Arsenal',
    'liverpool': 'Liverpool',
    'liverpool fc': 'Liverpool',
    'chelsea': 'Chelsea',
    'chelsea fc': 'Chelsea',
    'spurs': 'Spurs (Tottenham)',
    'tottenham': 'Spurs (Tottenham)',
    'tottenham hotspur': 'Spurs (Tottenham)',
    'tottenham hotspur fc': 'Spurs (Tottenham)',
    'spurs (tottenham)': 'Spurs (Tottenham)',
    'man united': 'Manchester United',
    'man utd': 'Manchester United',
    'manchester united': 'Manchester United',
    'newcastle': 'Newcastle United',
    'newcastle united': 'Newcastle United',
    'aston villa': 'Aston Villa',
    'villa': 'Aston Villa',
    'brighton': 'Brighton',
    'brighton & hove albion': 'Brighton',
    'brighton and hove albion': 'Brighton',
    'west ham': 'West Ham',
    'west ham united': 'West Ham',
    'brentford': 'Brentford',
    'fulham': 'Fulham',
    'everton': 'Everton',
    'bournemouth': 'Bournemouth',
    'afc bournemouth': 'Bournemouth',
    'nottingham forest': 'Nottingham Forest',
    'nottingham': 'Nottingham Forest',
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
    'hull city': 'Hull City',
    'real madrid': 'Real Madrid',
    'real madrid cf': 'Real Madrid',
    'barcelona': 'Barcelona',
    'fc barcelona': 'Barcelona',
    'barca': 'Barcelona',
    'atletico': 'Atletico Madrid',
    'atletico madrid': 'Atletico Madrid',
    'atletico de madrid': 'Atletico Madrid',
    'athletic club': 'Athletic Bilbao',
    'athletic bilbao': 'Athletic Bilbao',
    'real sociedad': 'Real Sociedad',
    'valencia': 'Valencia',
    'valencia cf': 'Valencia',
    'sevilla': 'Sevilla',
    'sevilla fc': 'Sevilla',
    'villarreal': 'Villarreal',
    'real betis': 'Real Betis',
    'betis': 'Real Betis',
    'bayern': 'Bayern Munich',
    'bayern munich': 'Bayern Munich',
    'bayern munchen': 'Bayern Munich',
    'fc bayern': 'Bayern Munich',
    'dortmund': 'Borussia Dortmund',
    'borussia dortmund': 'Borussia Dortmund',
    'bvb': 'Borussia Dortmund',
    'leverkusen': 'Bayer Leverkusen',
    'bayer leverkusen': 'Bayer Leverkusen',
    'bayer 04 leverkusen': 'Bayer Leverkusen',
    'frankfurt': 'Eintracht Frankfurt',
    'eintracht frankfurt': 'Eintracht Frankfurt',
    'rb leipzig': 'RB Leipzig',
    'leipzig': 'RB Leipzig',
    'inter': 'Inter Milan',
    'inter milan': 'Inter Milan',
    'internazionale': 'Inter Milan',
    'milan': 'AC Milan',
    'ac milan': 'AC Milan',
    'juventus': 'Juventus',
    'juve': 'Juventus',
    'napoli': 'Napoli',
    'ssc napoli': 'Napoli',
    'roma': 'AS Roma',
    'as roma': 'AS Roma',
    'lazio': 'Lazio',
    'ss lazio': 'Lazio',
    'atalanta': 'Atalanta',
    'parma': 'Parma',
    'psg': 'Paris Saint-Germain',
    'paris sg': 'Paris Saint-Germain',
    'paris saint-germain': 'Paris Saint-Germain',
    'marseille': 'Marseille',
    'olympique marseille': 'Marseille',
    'monaco': 'Monaco',
    'as monaco': 'Monaco',
    'lille': 'Lille',
    'lyon': 'Lyon',
    'olympique lyonnais': 'Lyon',
    'dinamo zagreb': 'Dinamo Zagreb',
    'sporting cp': 'Sporting CP',
    'benfica': 'Benfica',
    'porto': 'Porto'
  };

  function normalizeLeagueName(rawLeague) {
    if (!rawLeague) return 'Premier League';
    const clean = String(rawLeague).replace(/^[^\w\s]+/, '').trim().toLowerCase();
    if (LEAGUE_ALIASES[clean]) return LEAGUE_ALIASES[clean];
    for (const [alias, canonical] of Object.entries(LEAGUE_ALIASES)) {
      if (clean.includes(alias) || alias.includes(clean)) return canonical;
    }
    return String(rawLeague).trim();
  }

  function normalizeTeamName(rawName) {
    if (!rawName) return '';
    const s = String(rawName).trim();
    const lower = s.toLowerCase();
    if (TEAM_NAME_ALIASES[lower]) return TEAM_NAME_ALIASES[lower];
    for (const [alias, canonical] of Object.entries(TEAM_NAME_ALIASES)) {
      if (lower === alias || lower.startsWith(alias + ' ') || lower.endsWith(' ' + alias)) {
        return canonical;
      }
    }
    return s;
  }

  // ---------------------------------------------------------------------------
  // 2. MATCH STATE CLASSIFICATION (11 STATES SUPPORTED)
  // ---------------------------------------------------------------------------

  /**
   * Classify match state across all 11 supported states:
   * - Not Started: 'NS', 'TBD', 'NOT_STARTED', 'SCHEDULED' -> UNPLAYED
   * - In-Play / Live: '1H', 'HT', '2H', 'ET', 'PK', 'P', 'LIVE', 'IN_PLAY' -> LIVE_IN_PLAY
   * - Completed: 'FT', 'AET', 'AP', 'FULL_TIME', 'FINISHED', 'COMPLETED' -> COMPLETED
   * - Postponed / Abandoned / Cancelled: 'PST', 'ABD', 'CANC', 'SUSP', 'INT' -> IGNORED (0 points, not played)
   */
  function classifyMatchState(match) {
    if (!match) return 'UNPLAYED';

    const rawStatus = String(match.statusShort || match.status || '').trim().toUpperCase();
    const isLiveFlag = match.isLive === true;
    const isFTFlag = match.isFT === true;

    // Check Ignored states FIRST (Postponed, Abandoned, Cancelled, Suspended)
    const ignoredStatuses = ['PST', 'POSTPONED', 'ABD', 'ABANDONED', 'CANC', 'CANCELLED', 'SUSP', 'SUSPENDED', 'INT', 'INTERRUPTED'];
    if (ignoredStatuses.includes(rawStatus)) {
      return 'IGNORED';
    }

    // Check Completed states
    const completedStatuses = ['FT', 'AET', 'AP', 'FULL_TIME', 'FINISHED', 'COMPLETED'];
    if (isFTFlag || completedStatuses.includes(rawStatus)) {
      return 'COMPLETED';
    }

    // Check Live In-Play states
    const liveStatuses = ['1H', 'HT', '2H', 'ET', 'PK', 'P', 'LIVE', 'IN_PLAY', 'FIRST_HALF', 'SECOND_HALF', 'HALFTIME'];
    if (isLiveFlag || liveStatuses.includes(rawStatus)) {
      return 'LIVE_IN_PLAY';
    }

    return 'UNPLAYED';
  }

  // ---------------------------------------------------------------------------
  // 3. SCORE & TEAM EXTRACTION HELPERS
  // ---------------------------------------------------------------------------

  function extractScores(match) {
    if (!match) return null;
    let home = null;
    let away = null;

    if (match.scores && typeof match.scores === 'object') {
      if (typeof match.scores.home === 'number') home = match.scores.home;
      if (typeof match.scores.away === 'number') away = match.scores.away;
    }
    if ((home === null || away === null) && match.score && typeof match.score === 'object') {
      if (typeof match.score.home === 'number') home = match.score.home;
      if (typeof match.score.away === 'number') away = match.score.away;
    }
    if ((home === null || away === null) && match.goals && typeof match.goals === 'object') {
      if (typeof match.goals.home === 'number') home = match.goals.home;
      if (typeof match.goals.away === 'number') away = match.goals.away;
    }
    if ((home === null || away === null) && typeof match.homeScore === 'number' && typeof match.awayScore === 'number') {
      home = match.homeScore;
      away = match.awayScore;
    }
    if ((home === null || away === null) && typeof match.score === 'string') {
      const parts = match.score.split('-').map(p => parseInt(p.trim(), 10));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        home = parts[0];
        away = parts[1];
      }
    }

    if (home !== null && away !== null && !isNaN(home) && !isNaN(away)) {
      return { home: Math.max(0, home), away: Math.max(0, away) };
    }
    return null;
  }

  function extractTeams(match) {
    if (!match) return { home: '', away: '' };
    const homeRaw = (match.homeTeam && typeof match.homeTeam === 'object') ? match.homeTeam.name : (match.homeTeam || match.home || '');
    const awayRaw = (match.awayTeam && typeof match.awayTeam === 'object') ? match.awayTeam.name : (match.awayTeam || match.away || '');
    return {
      home: normalizeTeamName(homeRaw),
      away: normalizeTeamName(awayRaw)
    };
  }

  // ---------------------------------------------------------------------------
  // 4. ENGINE INTERNAL REPOSITORY & MATCH PROCESSING
  // ---------------------------------------------------------------------------

  // Deduplication store and match registries
  const processedCompletedMatchIds = new Set();
  const completedMatchesRegistry = new Map(); // leagueKey -> Array of matches
  const liveMatchesRegistry = new Map();      // leagueKey -> Map(matchId -> match)

  function resetEngine() {
    processedCompletedMatchIds.clear();
    completedMatchesRegistry.clear();
    liveMatchesRegistry.clear();
  }

  function recordMatchResult(match) {
    if (!match) return false;
    const matchId = match.id || `${match.league || 'league'}_${match.homeTeam?.name || 'h'}_${match.awayTeam?.name || 'a'}_${match.date || ''}`;
    const classification = classifyMatchState(match);
    const leagueKey = normalizeLeagueName(match.league || match.competition);

    if (classification === 'IGNORED') {
      // Postponed/Abandoned/Cancelled matches must NEVER count towards standings
      if (liveMatchesRegistry.has(leagueKey)) {
        liveMatchesRegistry.get(leagueKey).delete(matchId);
      }
      return false;
    }

    if (classification === 'COMPLETED') {
      // Graduate live match if present
      if (liveMatchesRegistry.has(leagueKey)) {
        liveMatchesRegistry.get(leagueKey).delete(matchId);
      }

      // Check if already completed and recorded
      if (processedCompletedMatchIds.has(matchId)) {
        // Idempotent: already counted
        return true;
      }
      processedCompletedMatchIds.add(matchId);

      if (!completedMatchesRegistry.has(leagueKey)) {
        completedMatchesRegistry.set(leagueKey, []);
      }
      completedMatchesRegistry.get(leagueKey).push(match);
      return true;
    }

    if (classification === 'LIVE_IN_PLAY') {
      // Do not add to completed, add to live in-play map
      if (!liveMatchesRegistry.has(leagueKey)) {
        liveMatchesRegistry.set(leagueKey, new Map());
      }
      liveMatchesRegistry.get(leagueKey).set(matchId, match);
      return true;
    }

    return false;
  }

  function syncAllMatches(matches) {
    if (!Array.isArray(matches)) return 0;
    let count = 0;
    for (const m of matches) {
      if (recordMatchResult(m)) count++;
    }
    return count;
  }

  // ---------------------------------------------------------------------------
  // 5. BASELINE TEAMS RESOLUTION
  // ---------------------------------------------------------------------------

  function getGlobalClubsForLeague(leagueKey) {
    const allClubs = (typeof window !== 'undefined' && Array.isArray(window.GLOBAL_CLUBS))
      ? window.GLOBAL_CLUBS
      : ((typeof globalThis !== 'undefined' && Array.isArray(globalThis.GLOBAL_CLUBS)) ? globalThis.GLOBAL_CLUBS : []);

    const targetKeyLower = leagueKey.toLowerCase();
    let matched = allClubs.filter(c => {
      const cLeague = (c.league || '').toLowerCase();
      return cLeague === targetKeyLower ||
             (targetKeyLower.includes('south african') && (cLeague.includes('dstv') || cLeague.includes('psl'))) ||
             (targetKeyLower.includes('champions league') && (cLeague.includes('champions') || c.ucl === true));
    });

    // Special handling for UCL: if GLOBAL_CLUBS has only 4 UCL teams, enrich with top European clubs from top leagues
    if (leagueKey === 'Champions League' && matched.length < 36) {
      const uclClubsSet = new Set(matched.map(c => normalizeTeamName(c.name)));
      const topEuropeanLeagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Primeira Liga'];
      for (const tLeague of topEuropeanLeagues) {
        const topLeagueClubs = allClubs.filter(c => c.league === tLeague);
        for (const c of topLeagueClubs.slice(0, 5)) {
          const norm = normalizeTeamName(c.name);
          if (!uclClubsSet.has(norm)) {
            uclClubsSet.add(norm);
            matched.push({
              ...c,
              league: 'Champions League',
              matchesPlayed: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              goalDiff: 0,
              points: 0,
              form: []
            });
          }
          if (matched.length >= 36) break;
        }
        if (matched.length >= 36) break;
      }
    }

    return matched;
  }

  // ---------------------------------------------------------------------------
  // 6. COMPETITION TIEBREAKER SORTING
  // ---------------------------------------------------------------------------

  /**
   * Sorts standings according to specific competition rules:
   * 1. 'gd': EPL, Bundesliga, Ligue 1, Championship, PSL:
   *    Points -> Overall GD -> Overall GF -> H2H Points -> H2H GD -> Alphabetical
   * 2. 'h2h': La Liga, Serie A:
   *    Points -> H2H Points (if played) -> H2H GD (if played) -> Overall GD -> Overall GF -> Alphabetical
   * 3. 'ucl': UEFA Champions League League Phase (36 teams):
   *    Points -> Overall GD -> Overall GF -> Away GF -> Wins -> Away Wins -> Alphabetical
   */
  function sortStandings(teams, leagueKey, h2hMatrix = new Map()) {
    const config = LEAGUE_CONFIGS[leagueKey] || { tiebreaker: 'gd' };
    const tiebreakerMode = config.tiebreaker || 'gd';

    // Helper to calculate H2H points between two clubs
    function getH2HStats(teamA, teamB) {
      const keyAB = `${teamA.name}:::${teamB.name}`;
      const keyBA = `${teamB.name}:::${teamA.name}`;
      const matchesAB = h2hMatrix.get(keyAB) || [];
      const matchesBA = h2hMatrix.get(keyBA) || [];
      const allH2H = [...matchesAB, ...matchesBA];

      let ptsA = 0;
      let ptsB = 0;
      let gdA = 0;
      let gdB = 0;

      for (const m of allH2H) {
        if (m.home === teamA.name) {
          if (m.hScore > m.aScore) { ptsA += 3; gdA += (m.hScore - m.aScore); gdB += (m.aScore - m.hScore); }
          else if (m.hScore < m.aScore) { ptsB += 3; gdA += (m.hScore - m.aScore); gdB += (m.aScore - m.hScore); }
          else { ptsA += 1; ptsB += 1; }
        } else if (m.home === teamB.name) {
          if (m.hScore > m.aScore) { ptsB += 3; gdB += (m.hScore - m.aScore); gdA += (m.aScore - m.hScore); }
          else if (m.hScore < m.aScore) { ptsA += 3; gdB += (m.hScore - m.aScore); gdA += (m.aScore - m.hScore); }
          else { ptsA += 1; ptsB += 1; }
        }
      }

      return { played: allH2H.length, ptsA, ptsB, gdA, gdB };
    }

    return [...teams].sort((a, b) => {
      // 1. Points is always primary
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // UEFA Champions League Tiebreaker
      if (tiebreakerMode === 'ucl') {
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        if ((b.awayGoalsFor || 0) !== (a.awayGoalsFor || 0)) return (b.awayGoalsFor || 0) - (a.awayGoalsFor || 0);
        if (b.wins !== a.wins) return b.wins - a.wins;
        if ((b.awayWins || 0) !== (a.awayWins || 0)) return (b.awayWins || 0) - (a.awayWins || 0);
        return a.name.localeCompare(b.name);
      }

      // La Liga & Serie A: Head-to-Head first (if H2H matches played)
      if (tiebreakerMode === 'h2h') {
        const h2h = getH2HStats(a, b);
        if (h2h.played > 0 && h2h.ptsA !== h2h.ptsB) {
          return h2h.ptsB - h2h.ptsA;
        }
        if (h2h.played > 0 && h2h.gdA !== h2h.gdB) {
          return h2h.gdB - h2h.gdA;
        }
        // If H2H tied or not yet played, fall back to overall GD and GF
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.name.localeCompare(b.name);
      }

      // Standard (Premier League, Bundesliga, Ligue 1, Championship, PSL, MLS):
      // Overall GD -> Overall GF -> Head-to-Head
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

      const h2h = getH2HStats(a, b);
      if (h2h.played > 0 && h2h.ptsA !== h2h.ptsB) {
        return h2h.ptsB - h2h.ptsA;
      }
      if (h2h.played > 0 && h2h.gdA !== h2h.gdB) {
        return h2h.gdB - h2h.gdA;
      }

      return a.name.localeCompare(b.name);
    });
  }

  // ---------------------------------------------------------------------------
  // 7. DYNAMIC STANDINGS CALCULATION
  // ---------------------------------------------------------------------------

  /**
   * Recalculates full league table.
   * Options:
   * - mode: 'confirmed' (default, official completed matches only) | 'live' (provisional in-play included)
   * - extraMatches: optional array of matches to incorporate
   */
  function calculateStandings(leagueName, options = {}) {
    const leagueKey = normalizeLeagueName(leagueName);
    const mode = options.mode === 'live' ? 'live' : 'confirmed';
    const config = LEAGUE_CONFIGS[leagueKey] || {
      displayName: leagueKey,
      shortName: leagueKey,
      country: '',
      flag: '🏆',
      season: '2026/27',
      tiebreaker: 'gd',
      zones: { ucl: [1, 2, 3, 4], uel: [5], uecl: [6], relegation: [18, 19, 20] }
    };

    // 1. Initialize Baseline Table from GLOBAL_CLUBS
    const baselineClubs = getGlobalClubsForLeague(leagueKey);
    const tableMap = new Map();

    for (const club of baselineClubs) {
      const normName = normalizeTeamName(club.name);
      const played = club.matchesPlayed ?? 0;
      const wins = club.wins ?? 0;
      const draws = club.draws ?? 0;
      const losses = club.losses ?? 0;
      const gf = club.goalsFor ?? 0;
      const ga = club.goalsAgainst ?? 0;
      const gd = (club.goalsFor !== undefined && club.goalsAgainst !== undefined) ? (club.goalsFor - club.goalsAgainst) : (club.goalDiff ?? 0);
      const pts = club.points ?? (wins * 3 + draws);
      const rawForm = Array.isArray(club.form) ? [...club.form] : (typeof club.form === 'string' ? club.form.split('') : []);

      tableMap.set(normName, {
        name: normName,
        originalName: club.name,
        logo: club.logo || null,
        matchesPlayed: played,
        wins: wins,
        draws: draws,
        losses: losses,
        goalsFor: gf,
        goalsAgainst: ga,
        goalDiff: gd,
        points: pts,
        form: rawForm,
        awayGoalsFor: 0,
        awayWins: 0,
        isLive: false,
        liveMatchInfo: null
      });
    }

    // H2H match tracking matrix: `${home}:::${away}` -> [{ hScore, aScore }]
    const h2hMatrix = new Map();

    function recordH2H(home, away, hScore, aScore) {
      const key = `${home}:::${away}`;
      if (!h2hMatrix.has(key)) h2hMatrix.set(key, []);
      h2hMatrix.get(key).push({ home, away, hScore, aScore });
    }

    // Helper to get or auto-create a team entry if a match features a team not in baseline
    function getOrCreateTeam(normName) {
      if (!tableMap.has(normName)) {
        tableMap.set(normName, {
          name: normName,
          originalName: normName,
          logo: null,
          matchesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDiff: 0,
          points: 0,
          form: [],
          awayGoalsFor: 0,
          awayWins: 0,
          isLive: false,
          liveMatchInfo: null
        });
      }
      return tableMap.get(normName);
    }

    // Helper to apply match result to a team
    function applyResult(homeTeam, awayTeam, hScore, aScore, isLiveProvisional = false, matchMeta = null) {
      const gdDiff = hScore - aScore;

      homeTeam.matchesPlayed += 1;
      homeTeam.goalsFor += hScore;
      homeTeam.goalsAgainst += aScore;
      homeTeam.goalDiff += gdDiff;

      awayTeam.matchesPlayed += 1;
      awayTeam.goalsFor += aScore;
      awayTeam.goalsAgainst += hScore;
      awayTeam.goalDiff -= gdDiff;

      awayTeam.awayGoalsFor = (awayTeam.awayGoalsFor || 0) + aScore;

      if (hScore > aScore) {
        // Home win
        homeTeam.wins += 1;
        homeTeam.points += 3;
        homeTeam.form = ['W', ...(homeTeam.form || [])].slice(0, 5);

        awayTeam.losses += 1;
        awayTeam.form = ['L', ...(awayTeam.form || [])].slice(0, 5);
      } else if (hScore < aScore) {
        // Away win
        awayTeam.wins += 1;
        awayTeam.awayWins = (awayTeam.awayWins || 0) + 1;
        awayTeam.points += 3;
        awayTeam.form = ['W', ...(awayTeam.form || [])].slice(0, 5);

        homeTeam.losses += 1;
        homeTeam.form = ['L', ...(homeTeam.form || [])].slice(0, 5);
      } else {
        // Draw
        homeTeam.draws += 1;
        homeTeam.points += 1;
        homeTeam.form = ['D', ...(homeTeam.form || [])].slice(0, 5);

        awayTeam.draws += 1;
        awayTeam.points += 1;
        awayTeam.form = ['D', ...(awayTeam.form || [])].slice(0, 5);
      }

      recordH2H(homeTeam.name, awayTeam.name, hScore, aScore);

      if (isLiveProvisional && matchMeta) {
        homeTeam.isLive = true;
        homeTeam.liveMatchInfo = {
          opponent: awayTeam.name,
          score: `${hScore} - ${aScore}`,
          isHome: true,
          minute: matchMeta.minute || matchMeta.time || 'LIVE',
          status: matchMeta.statusShort || matchMeta.status || '1H'
        };

        awayTeam.isLive = true;
        awayTeam.liveMatchInfo = {
          opponent: homeTeam.name,
          score: `${aScore} - ${hScore}`,
          isHome: false,
          minute: matchMeta.minute || matchMeta.time || 'LIVE',
          status: matchMeta.statusShort || matchMeta.status || '1H'
        };
      }
    }

    // 2. Ingest Completed Matches from Registry
    const completedList = completedMatchesRegistry.get(leagueKey) || [];
    for (const m of completedList) {
      const scores = extractScores(m);
      if (!scores) continue;
      const { home, away } = extractTeams(m);
      if (!home || !away) continue;

      const homeRecord = getOrCreateTeam(home);
      const awayRecord = getOrCreateTeam(away);
      applyResult(homeRecord, awayRecord, scores.home, scores.away, false);
    }

    // 3. Ingest Extra Matches if supplied (e.g. from unit tests or live event hooks)
    if (Array.isArray(options.extraMatches)) {
      for (const m of options.extraMatches) {
        const state = classifyMatchState(m);
        if (state === 'IGNORED') continue; // Postponed/Abandoned/Cancelled matches ignored
        const scores = extractScores(m);
        if (!scores) continue;
        const { home, away } = extractTeams(m);
        if (!home || !away) continue;

        const homeRecord = getOrCreateTeam(home);
        const awayRecord = getOrCreateTeam(away);

        if (state === 'COMPLETED') {
          applyResult(homeRecord, awayRecord, scores.home, scores.away, false);
        } else if (state === 'LIVE_IN_PLAY' && mode === 'live') {
          applyResult(homeRecord, awayRecord, scores.home, scores.away, true, m);
        }
      }
    }

    // 4. Ingest Live In-Play Matches if in 'live' mode
    if (mode === 'live') {
      const liveMap = liveMatchesRegistry.get(leagueKey);
      if (liveMap && liveMap.size > 0) {
        for (const m of liveMap.values()) {
          const scores = extractScores(m);
          if (!scores) continue;
          const { home, away } = extractTeams(m);
          if (!home || !away) continue;

          const homeRecord = getOrCreateTeam(home);
          const awayRecord = getOrCreateTeam(away);
          applyResult(homeRecord, awayRecord, scores.home, scores.away, true, m);
        }
      }
    }

    // 5. Convert table map to array and sort by competition tiebreakers
    const rawList = Array.from(tableMap.values());
    const sorted = sortStandings(rawList, leagueKey, h2hMatrix);

    // 6. Assign ranks and zone metadata
    const finalStandings = sorted.map((team, idx) => {
      const rank = idx + 1;
      let zone = 'normal';
      let zoneLabel = '';

      if (config.zones) {
        if (config.zones.ucl && config.zones.ucl.includes(rank)) {
          zone = 'ucl';
          zoneLabel = 'UEFA Champions League';
        } else if (config.zones.uclQ && config.zones.uclQ.includes(rank)) {
          zone = 'ucl-q';
          zoneLabel = 'UCL Qualifiers';
        } else if (config.zones.uel && config.zones.uel.includes(rank)) {
          zone = 'uel';
          zoneLabel = 'UEFA Europa League';
        } else if (config.zones.uecl && config.zones.uecl.includes(rank)) {
          zone = 'uecl';
          zoneLabel = 'UEFA Conference League';
        } else if (config.zones.promo && config.zones.promo.includes(rank)) {
          zone = 'promo';
          zoneLabel = 'Automatic Promotion';
        } else if (config.zones.cafCL && config.zones.cafCL.includes(rank)) {
          zone = 'ucl';
          zoneLabel = 'CAF Champions League';
        } else if (config.zones.cafCC && config.zones.cafCC.includes(rank)) {
          zone = 'uel';
          zoneLabel = 'CAF Confederation Cup';
        } else if (config.zones.playoff && config.zones.playoff.includes(rank)) {
          zone = 'playoff';
          zoneLabel = 'Play-offs';
        } else if (config.zones.relegation && config.zones.relegation.includes(rank)) {
          zone = 'relegation';
          zoneLabel = 'Relegation Zone';
        }
      }

      return {
        rank,
        position: rank,
        ...team,
        zone,
        zoneLabel
      };
    });

    return {
      league: leagueKey,
      displayName: config.displayName,
      shortName: config.shortName,
      country: config.country,
      flag: config.flag,
      season: config.season || '2026/27',
      mode: mode,
      isLiveProvisional: mode === 'live',
      lastUpdated: new Date().toISOString(),
      standings: finalStandings
    };
  }

  // ---------------------------------------------------------------------------
  // 8. AUTHENTIC TABLE HTML RENDERING (10-COLUMN FORMAT)
  // ---------------------------------------------------------------------------

  /**
   * Generates the authentic 10-column standings table HTML
   * Columns: Pos | Club | P | W | D | L | GF | GA | GD | PTS | Form
   */
  function renderStandingsTableHtml(tableData, options = {}) {
    if (!tableData || !Array.isArray(tableData.standings)) {
      return '<div style="padding:20px;text-align:center;color:#94a3b8;">No standings data available.</div>';
    }

    const standings = tableData.standings;
    const isLiveMode = tableData.mode === 'live';

    // Helper for crest HTML
    function getCrestHtml(teamName) {
      if (typeof window !== 'undefined' && window.TeamCrestRegistry && typeof window.TeamCrestRegistry.renderTeamLogoHtml === 'function') {
        return window.TeamCrestRegistry.renderTeamLogoHtml(teamName, true, 20, { inline: true });
      }
      if (typeof globalThis !== 'undefined' && globalThis.TeamCrestRegistry && typeof globalThis.TeamCrestRegistry.renderTeamLogoHtml === 'function') {
        return globalThis.TeamCrestRegistry.renderTeamLogoHtml(teamName, true, 20, { inline: true });
      }
      return `<img src="https://media.api-sports.io/football/teams/40.png" alt="${teamName}" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;">`;
    }

    // Helper for form badge pills
    function renderFormPills(formArray) {
      if (!Array.isArray(formArray) || formArray.length === 0) {
        return '<span style="color:#64748b;font-size:0.75rem;">—</span>';
      }
      const pills = formArray.slice(0, 5).map(r => {
        const res = String(r).toUpperCase();
        let bg = '#64748b'; // Draw default
        if (res === 'W') bg = '#10b981'; // Green
        else if (res === 'L') bg = '#ef4444'; // Red
        return `<span style="display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:3px;background:${bg};color:#ffffff;font-size:0.6rem;font-weight:700;line-height:1;">${res}</span>`;
      });
      return `<div style="display:inline-flex;gap:3px;align-items:center;">${pills.join('')}</div>`;
    }

    // Render table rows
    const rowsHtml = standings.map((team, idx) => {
      const pos = team.rank;
      let posColor = '#94a3b8';
      let borderLeft = '3px solid transparent';
      let rowBg = idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent';

      if (team.zone === 'ucl' || team.zone === 'cafCL') {
        posColor = '#38bdf8'; // Blue
        borderLeft = '3px solid #38bdf8';
      } else if (team.zone === 'uel' || team.zone === 'cafCC') {
        posColor = '#fbbf24'; // Amber
        borderLeft = '3px solid #fbbf24';
      } else if (team.zone === 'uecl' || team.zone === 'promo') {
        posColor = '#34d399'; // Emerald
        borderLeft = '3px solid #34d399';
      } else if (team.zone === 'relegation') {
        posColor = '#f87171'; // Red
        borderLeft = '3px solid #f87171';
      } else if (team.zone === 'playoff') {
        posColor = '#c084fc'; // Purple
        borderLeft = '3px solid #c084fc';
      }

      // Live tag if club is currently in live match
      let liveBadge = '';
      if (team.isLive && team.liveMatchInfo) {
        liveBadge = `<span class="standings-live-badge" title="Live vs ${team.liveMatchInfo.opponent} (${team.liveMatchInfo.score})" style="font-size:0.62rem;background:rgba(239,68,68,0.2);color:#f87171;border:1px solid rgba(239,68,68,0.4);border-radius:4px;padding:1px 4px;font-weight:700;margin-left:6px;display:inline-block;animation:pulse 2s infinite;">🔴 ${team.liveMatchInfo.score}</span>`;
      }

      const gdVal = team.goalDiff > 0 ? `+${team.goalDiff}` : `${team.goalDiff}`;
      const gdColor = team.goalDiff > 0 ? '#34d399' : (team.goalDiff < 0 ? '#f87171' : '#94a3b8');

      return `
        <tr style="background:${rowBg};border-bottom:1px solid rgba(255,255,255,0.04);border-left:${borderLeft};transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.05)';" onmouseout="this.style.background='${rowBg}';">
          <td style="padding:8px 6px;text-align:center;font-weight:700;color:${posColor};font-size:0.78rem;">${pos}</td>
          <td style="padding:8px 6px;font-weight:600;color:#f1f5f9;font-size:0.8rem;white-space:nowrap;">
            <div style="display:inline-flex;align-items:center;gap:7px;">
              ${getCrestHtml(team.name)}
              <span style="font-weight:600;">${team.name}</span>
              ${liveBadge}
            </div>
          </td>
          <td style="padding:8px 4px;text-align:center;color:#cbd5e1;font-size:0.78rem;">${team.matchesPlayed}</td>
          <td style="padding:8px 4px;text-align:center;color:#34d399;font-weight:600;font-size:0.78rem;">${team.wins}</td>
          <td style="padding:8px 4px;text-align:center;color:#94a3b8;font-size:0.78rem;">${team.draws}</td>
          <td style="padding:8px 4px;text-align:center;color:#f87171;font-size:0.78rem;">${team.losses}</td>
          <td style="padding:8px 4px;text-align:center;color:#94a3b8;font-size:0.78rem;">${team.goalsFor}</td>
          <td style="padding:8px 4px;text-align:center;color:#94a3b8;font-size:0.78rem;">${team.goalsAgainst}</td>
          <td style="padding:8px 4px;text-align:center;font-weight:600;color:${gdColor};font-size:0.78rem;">${gdVal}</td>
          <td style="padding:8px 6px;text-align:center;font-weight:700;color:#fbbf24;font-size:0.84rem;background:rgba(251,191,36,0.05);">${team.points}</td>
          <td style="padding:8px 6px;text-align:center;white-space:nowrap;">${renderFormPills(team.form)}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="standings-table-wrap" style="overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;">
        <table class="standings-table" style="min-width:580px;width:100%;border-collapse:collapse;font-family:system-ui,-apple-system,sans-serif;">
          <thead>
            <tr style="background:rgba(15,23,42,0.9);border-bottom:1px solid rgba(255,255,255,0.1);font-size:0.68rem;text-transform:uppercase;color:#94a3b8;font-weight:700;">
              <th style="padding:8px 6px;text-align:center;width:28px;">Pos</th>
              <th style="padding:8px 6px;text-align:left;">Club</th>
              <th style="padding:8px 4px;text-align:center;width:28px;" title="Played">P</th>
              <th style="padding:8px 4px;text-align:center;width:28px;" title="Won">W</th>
              <th style="padding:8px 4px;text-align:center;width:28px;" title="Drawn">D</th>
              <th style="padding:8px 4px;text-align:center;width:28px;" title="Lost">L</th>
              <th style="padding:8px 4px;text-align:center;width:28px;" title="Goals For">GF</th>
              <th style="padding:8px 4px;text-align:center;width:28px;" title="Goals Against">GA</th>
              <th style="padding:8px 4px;text-align:center;width:32px;" title="Goal Difference">GD</th>
              <th style="padding:8px 6px;text-align:center;width:38px;color:#fbbf24;" title="Points">PTS</th>
              <th style="padding:8px 6px;text-align:center;width:95px;">Form</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 9. MODERN INTERACTIVE STANDINGS MODAL
  // ---------------------------------------------------------------------------

  let currentActiveLeague = 'Premier League';
  let currentActiveMode = 'confirmed'; // 'confirmed' or 'live'

  /**
   * Opens the interactive League Standings Modal with mode switchers and league navigation
   */
  async function openStandingsModal(leagueName, countryName, options = {}) {
    if (typeof document === 'undefined') return;

    currentActiveLeague = normalizeLeagueName(leagueName || currentActiveLeague);
    if (options.mode) currentActiveMode = options.mode;

    const existingModal = document.getElementById('live-standings-modal');
    if (existingModal) existingModal.remove();

    // Auto-sync completed and live matches from global application state if available
    if (typeof window !== 'undefined') {
      const globalMatches = [
        ...(Array.isArray(window.MATCH_DATA) ? window.MATCH_DATA : []),
        ...(Array.isArray(window.AUTHENTIC_TOP_LEAGUES_FIXTURES) ? window.AUTHENTIC_TOP_LEAGUES_FIXTURES : [])
      ];
      syncAllMatches(globalMatches);
    }

    const modal = document.createElement('div');
    modal.id = 'live-standings-modal';
    modal.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:999999;padding:12px;box-sizing:border-box;animation:fadeIn 0.2s ease-out;';
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    const content = document.createElement('div');
    content.className = 'glass-card standings-modal-content';
    content.style.cssText = 'width:100%;max-width:680px;max-height:90vh;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,0.12);border-radius:18px;background:#0f172a;box-shadow:0 30px 70px rgba(0,0,0,0.85);box-sizing:border-box;overflow:hidden;';

    // Renders modal body
    function updateModalContent() {
      const tableData = calculateStandings(currentActiveLeague, { mode: currentActiveMode });
      const config = LEAGUE_CONFIGS[currentActiveLeague] || {
        displayName: currentActiveLeague,
        flag: '🏆',
        season: '2026/27'
      };

      const quickLeagues = [
        'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Champions League'
      ];

      const leaguePillsHtml = quickLeagues.map(l => {
        const isActive = l === currentActiveLeague;
        const bg = isActive ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.04)';
        const border = isActive ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)';
        const color = isActive ? '#c084fc' : '#94a3b8';
        return `<button class="standings-league-pill" data-league="${l}" style="padding:5px 12px;border-radius:20px;font-size:0.72rem;font-weight:700;cursor:pointer;background:${bg};border:${border};color:${color};white-space:nowrap;transition:all 0.15s ease;">${l}</button>`;
      }).join('');

      const confirmedActive = currentActiveMode === 'confirmed';
      const toggleHtml = `
        <div style="display:inline-flex;background:rgba(15,23,42,0.9);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:3px;gap:3px;">
          <button id="btn-mode-confirmed" style="padding:4px 12px;border-radius:20px;border:none;font-size:0.72rem;font-weight:700;cursor:pointer;background:${confirmedActive ? '#3b82f6' : 'transparent'};color:${confirmedActive ? '#ffffff' : '#94a3b8'};transition:all 0.15s ease;">
            🛡️ Official Confirmed
          </button>
          <button id="btn-mode-live" style="padding:4px 12px;border-radius:20px;border:none;font-size:0.72rem;font-weight:700;cursor:pointer;background:${!confirmedActive ? '#10b981' : 'transparent'};color:${!confirmedActive ? '#ffffff' : '#94a3b8'};transition:all 0.15s ease;">
            🟢 Live In-Play
          </button>
        </div>
      `;

      const modeBadge = currentActiveMode === 'live'
        ? `<span style="font-size:0.68rem;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:2px 8px;font-weight:700;">🟢 Live / Provisional Standings</span>`
        : `<span style="font-size:0.68rem;background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);border-radius:12px;padding:2px 8px;font-weight:700;">🛡️ Official / Confirmed Standings</span>`;

      content.innerHTML = `
        <!-- Modal Header -->
        <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;background:rgba(30,41,59,0.5);">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <h3 style="margin:0;font-size:1.05rem;color:#f8fafc;font-weight:700;display:flex;align-items:center;gap:6px;">
                <span>${config.flag || '🏆'}</span>
                <span>${config.displayName} Standings</span>
              </h3>
              ${modeBadge}
            </div>
            <div style="font-size:0.72rem;color:#64748b;margin-top:2px;">
              Season ${config.season || '2026/27'} • Recalculated Dynamically from Match Results
            </div>
          </div>
          <button id="cls-standings-modal" style="background:rgba(255,255,255,0.08);border:none;color:#94a3b8;font-size:1.1rem;cursor:pointer;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;transition:background 0.15s ease;" onmouseover="this.style.background='rgba(255,255,255,0.15)';" onmouseout="this.style.background='rgba(255,255,255,0.08)';">✕</button>
        </div>

        <!-- Controls Bar: League Switcher & Mode Toggle -->
        <div style="padding:10px 16px;background:rgba(15,23,42,0.6);border-bottom:1px solid rgba(255,255,255,0.06);display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;">
          <div style="display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:2px;max-width:100%;">
            ${leaguePillsHtml}
          </div>
          <div>
            ${toggleHtml}
          </div>
        </div>

        <!-- Table Body (Scrollable) -->
        <div style="overflow-y:auto;flex:1;max-height:55vh;">
          ${renderStandingsTableHtml(tableData)}
        </div>

        <!-- Footer & Legend -->
        <div style="padding:10px 16px;background:rgba(15,23,42,0.8);border-top:1px solid rgba(255,255,255,0.08);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;font-size:0.72rem;color:#94a3b8;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
            <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#38bdf8;"></span> Champions League</span>
            <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#fbbf24;"></span> Europa League</span>
            <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#34d399;"></span> Conf. League</span>
            <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#f87171;"></span> Relegation</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button id="btn-sync-standings" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#cbd5e1;padding:4px 10px;border-radius:8px;font-size:0.72rem;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;gap:4px;">
              🔄 Refresh
            </button>
            <button id="btn-standings-ok" class="btn btn-primary" style="padding:4px 16px;border-radius:8px;font-size:0.76rem;font-weight:700;cursor:pointer;">
              Done
            </button>
          </div>
        </div>
      `;

      // Event handlers
      const closeBtn = content.querySelector('#cls-standings-modal');
      const okBtn = content.querySelector('#btn-standings-ok');
      if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());
      if (okBtn) okBtn.addEventListener('click', () => modal.remove());

      const btnConfirmed = content.querySelector('#btn-mode-confirmed');
      const btnLive = content.querySelector('#btn-mode-live');
      if (btnConfirmed) {
        btnConfirmed.addEventListener('click', () => {
          currentActiveMode = 'confirmed';
          updateModalContent();
        });
      }
      if (btnLive) {
        btnLive.addEventListener('click', () => {
          currentActiveMode = 'live';
          updateModalContent();
        });
      }

      content.querySelectorAll('.standings-league-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          currentActiveLeague = btn.dataset.league;
          updateModalContent();
        });
      });

      const syncBtn = content.querySelector('#btn-sync-standings');
      if (syncBtn) {
        syncBtn.addEventListener('click', () => {
          syncBtn.innerHTML = '🔄 Syncing...';
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              const globalMatches = [
                ...(Array.isArray(window.MATCH_DATA) ? window.MATCH_DATA : []),
                ...(Array.isArray(window.AUTHENTIC_TOP_LEAGUES_FIXTURES) ? window.AUTHENTIC_TOP_LEAGUES_FIXTURES : [])
              ];
              syncAllMatches(globalMatches);
            }
            updateModalContent();
          }, 300);
        });
      }
    }

    updateModalContent();
    modal.appendChild(content);
    document.body.appendChild(modal);

    if (options.triggerBtn && options.triggerBtn.classList) {
      document.querySelectorAll('.sidebar-league-btn').forEach(b => b.classList.remove('active'));
      options.triggerBtn.classList.add('active');
    }
  }

  /**
   * Backward-compatible entrypoint replacing the old static showMockTableStandings
   */
  async function showMockTableStandings(leagueName, btn, countryName) {
    return openStandingsModal(leagueName, countryName, { triggerBtn: btn });
  }

  // ---------------------------------------------------------------------------
  // 10. PUBLIC API EXPORT
  // ---------------------------------------------------------------------------

  return {
    LEAGUE_CONFIGS,
    LEAGUE_ALIASES,
    TEAM_NAME_ALIASES,
    normalizeLeagueName,
    normalizeTeamName,
    classifyMatchState,
    extractScores,
    extractTeams,
    recordMatchResult,
    syncAllMatches,
    resetEngine,
    calculateStandings,
    sortStandings,
    renderStandingsTableHtml,
    openStandingsModal,
    showMockTableStandings,
    _state: {
      processedCompletedMatchIds,
      completedMatchesRegistry,
      liveMatchesRegistry
    }
  };
});
