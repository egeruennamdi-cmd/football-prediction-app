/**
 * DEEPPREDICTBET — AI-POWERED INTELLIGENT MARKET ROTATION ENGINE
 *
 * Modular coordination, statistical suitability, canonical market uniqueness,
 * manual-selection protection, and 3-way authoritative betslip synchronization engine
 * connecting:
 *   1. BET GENERATOR (#tool-machine)
 *   2. ACTIVE BETSLIP BUILDER (window.appState.betslip / #floating-betslip-drawer)
 *   3. AI BET DOCTOR (#tool-doctor)
 *
 * Strictly reuses existing validated DeepPredictBet intelligence modules:
 *   - AI Scout & Market Taxonomy (window.getMatchMarketPool, match.predictions)
 *   - Value Intelligence Engine (window.ValueIntelligenceEngine.math)
 *   - Match & Market Intelligence Engine (window.MatchMarketIntelligenceEngine.calculatePoissonDixonColesProbabilities)
 *   - Authoritative Total Odds Calculator (window.calculateBetslipTotalOdds)
 */

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (typeof root !== 'undefined') {
    root.IntelligentMarketRotationEngine = api;
    if (root.window) root.window.IntelligentMarketRotationEngine = api;
  }
  if (typeof window !== 'undefined') {
    window.IntelligentMarketRotationEngine = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  const ENGINE_VERSION = 'DP-IMRE-v1.0';
  const MAX_TECHNICAL_FIXTURE_CAPACITY = 100;

  // ============================================================================
  // 1. CANONICAL MARKET TAXONOMY & ALIAS NORMALIZATION
  // ============================================================================
  // Maps UI checkbox IDs, pool IDs, and display tips to canonical market types.
  // Rule (Section 4):
  // - Each automatically assigned market type must be unique within a batch.
  // - A different outcome within the same market type shares the same canonicalMarketId
  //   and therefore cannot be assigned to another fixture in the same batch.

  const CHECKBOX_TO_POOL_ID_MAP = {
    'win1': 'win1',
    'draw': 'draw',
    'win2': 'win2',
    'dc1x': 'dc1x',
    'dc12': 'dc12',
    'dcx2': 'dcx2',
    'dnb': 'dnb',
    'uo05': 'uo05',
    'uo15': 'uo15',
    'uo25': 'uo25',
    'uo35': 'uo35',
    'uo45': 'uo45',
    'uo55': 'uo55',
    'uoht05': 'uoht05',
    'uoht15': 'uoht15',
    'uoht25': 'uoht25',
    'uo2h05': 'uo2h05',
    'uo2h15': 'uo2h15',
    'uo2h25': 'uo2h25',
    'mg12': 'mg12',
    'mg13': 'mg13',
    'mg23': 'mg23',
    'mg24': 'mg24',
    'mg25': 'mg25',
    'mg35': 'mg35',
    'mg46': 'mg46',
    'eg0': 'eg0',
    'eg1': 'eg1',
    'eg2': 'eg2',
    'eg3': 'eg3',
    'eg4': 'eg4',
    'btts': 'btts',
    'btts_no': 'bttsno',
    'bttsno': 'bttsno',
    'bttsht': 'bttsht',
    'btts2h': 'btts2h',
    'btts_both': 'bttsboth',
    'bttsboth': 'bttsboth',
    'combo_1x2_uo': 'combo_1x2_o25',
    'combo_1x2_o25': 'combo_1x2_o25',
    'combo_1x2_under': 'combo_1x2_u25',
    'combo_1x2_u25': 'combo_1x2_u25',
    'combo_1x2_gg': 'combo_1x2_gg',
    'combo_dc_uo': 'combo_dc_o25',
    'combo_dc_o25': 'combo_dc_o25',
    'combo_dc_gg': 'combo_dc_gg',
    'htft_11': 'htft_11',
    'htft_x1': 'htft_x1',
    'htft_21': 'htft_21',
    'htft_1x': 'htft_1x',
    'htft_xx': 'htft_xx',
    'htft_2x': 'htft_2x',
    'htft_12': 'htft_12',
    'htft_x2': 'htft_x2',
    'htft_22': 'htft_22',
    'wineither': 'weitherh',
    'weitherh': 'weitherh',
    'winboth': 'wbothh',
    'wbothh': 'wbothh',
    'huo05': 'ho05',
    'ho05': 'ho05',
    'huo15': 'ho15',
    'ho15': 'ho15',
    'auo05': 'ao05',
    'ao05': 'ao05',
    'auo15': 'ao15',
    'ao15': 'ao15',
    'hcs': 'hcs',
    'acs': 'acs',
    'hw2n': 'hwn',
    'hwn': 'hwn',
    'aw2n': 'awn',
    'awn': 'awn',
    'first_goal': 'fts',
    'fts': 'fts',
    'c65': 'c65',
    'c75': 'c75',
    'c85': 'c85',
    'c95': 'c95',
    'c105': 'c105',
    'c115': 'c115',
    'c125': 'c125',
    'c45ht': 'cht45',
    'cht45': 'cht45',
    'c1x2': 'cmost',
    'cmost': 'cmost',
    'cards35': 'cards35',
    'cards45': 'cards45',
    'cards55': 'cards55',
    'redcard': 'redcard',
    'penalty': 'penalty',
    'eh1': 'eh1',
    'ah05': 'ah05',
    'ah15': 'ah15'
  };

  /**
   * Maps any pool market ID or outcome tip to its authoritative Canonical Market Type ID.
   * Ensures that different outcomes of the same market type (e.g., Home Win vs Away Win in 1X2,
   * or BTTS Yes vs BTTS No in Full-Time BTTS, or Over 2.5 vs Under 2.5 in Total Goals 2.5)
   * share the same canonicalMarketId and never collide in the same generated batch.
   */
  const POOL_ID_TO_CANONICAL_MARKET = {
    // 1. Full-Time 1X2 Match Winner (outcomes 1, X, 2 share MKT_1X2_FT)
    'win1': { canonicalMarketId: 'MKT_1X2_FT', marketName: 'Match Winner (1X2)', family: '1x2' },
    'draw': { canonicalMarketId: 'MKT_1X2_FT', marketName: 'Match Winner (1X2)', family: '1x2' },
    'win2': { canonicalMarketId: 'MKT_1X2_FT', marketName: 'Match Winner (1X2)', family: '1x2' },

    // 2. Double Chance (outcomes 1X, 12, X2 share MKT_DOUBLE_CHANCE_FT)
    'dc1x': { canonicalMarketId: 'MKT_DOUBLE_CHANCE_FT', marketName: 'Double Chance (FT)', family: 'doublechance' },
    'dc12': { canonicalMarketId: 'MKT_DOUBLE_CHANCE_FT', marketName: 'Double Chance (FT)', family: 'doublechance' },
    'dcx2': { canonicalMarketId: 'MKT_DOUBLE_CHANCE_FT', marketName: 'Double Chance (FT)', family: 'doublechance' },

    // 3. Draw No Bet
    'dnb': { canonicalMarketId: 'MKT_DNB_FT', marketName: 'Draw No Bet (FT)', family: 'dnb' },

    // 4. Full-Time Over/Under Goal Lines (each distinct goal line is a distinct market type; Over/Under on the same line share the line ID)
    'uo05': { canonicalMarketId: 'MKT_OU_05_FT', marketName: 'Over/Under 0.5 Goals (FT)', family: 'overunder' },
    'uo15': { canonicalMarketId: 'MKT_OU_15_FT', marketName: 'Over/Under 1.5 Goals (FT)', family: 'overunder' },
    'uo25': { canonicalMarketId: 'MKT_OU_25_FT', marketName: 'Over/Under 2.5 Goals (FT)', family: 'overunder' },
    'uo35': { canonicalMarketId: 'MKT_OU_35_FT', marketName: 'Over/Under 3.5 Goals (FT)', family: 'overunder' },
    'uo45': { canonicalMarketId: 'MKT_OU_45_FT', marketName: 'Over/Under 4.5 Goals (FT)', family: 'overunder' },
    'uo55': { canonicalMarketId: 'MKT_OU_55_FT', marketName: 'Over/Under 5.5 Goals (FT)', family: 'overunder' },

    // 5. 1st Half Over/Under Goal Lines
    'uoht05': { canonicalMarketId: 'MKT_OU_05_HT', marketName: '1st Half Over/Under 0.5 Goals', family: 'overunder_ht' },
    'uoht15': { canonicalMarketId: 'MKT_OU_15_HT', marketName: '1st Half Over/Under 1.5 Goals', family: 'overunder_ht' },
    'uoht25': { canonicalMarketId: 'MKT_OU_25_HT', marketName: '1st Half Over/Under 2.5 Goals', family: 'overunder_ht' },

    // 6. 2nd Half Over/Under Goal Lines
    'uo2h05': { canonicalMarketId: 'MKT_OU_05_2H', marketName: '2nd Half Over/Under 0.5 Goals', family: 'overunder_2h' },
    'uo2h15': { canonicalMarketId: 'MKT_OU_15_2H', marketName: '2nd Half Over/Under 1.5 Goals', family: 'overunder_2h' },
    'uo2h25': { canonicalMarketId: 'MKT_OU_25_2H', marketName: '2nd Half Over/Under 2.5 Goals', family: 'overunder_2h' },

    // 7. Multi-Goal Bands
    'mg12': { canonicalMarketId: 'MKT_MULTIGOALS_1_2', marketName: 'Multi-Goals Band (1-2 Goals)', family: 'multigoals' },
    'mg13': { canonicalMarketId: 'MKT_MULTIGOALS_1_3', marketName: 'Multi-Goals Band (1-3 Goals)', family: 'multigoals' },
    'mg23': { canonicalMarketId: 'MKT_MULTIGOALS_2_3', marketName: 'Multi-Goals Band (2-3 Goals)', family: 'multigoals' },
    'mg24': { canonicalMarketId: 'MKT_MULTIGOALS_2_4', marketName: 'Multi-Goals Band (2-4 Goals)', family: 'multigoals' },
    'mg25': { canonicalMarketId: 'MKT_MULTIGOALS_2_5', marketName: 'Multi-Goals Band (2-5 Goals)', family: 'multigoals' },
    'mg35': { canonicalMarketId: 'MKT_MULTIGOALS_3_5', marketName: 'Multi-Goals Band (3-5 Goals)', family: 'multigoals' },
    'mg46': { canonicalMarketId: 'MKT_MULTIGOALS_4_6', marketName: 'Multi-Goals Band (4-6 Goals)', family: 'multigoals' },

    // 8. Exact Total Goals (outcomes 0, 1, 2, 3, 4+ share MKT_EXACT_GOALS_FT)
    'eg0': { canonicalMarketId: 'MKT_EXACT_GOALS_FT', marketName: 'Exact Total Goals (FT)', family: 'exactgoals' },
    'eg1': { canonicalMarketId: 'MKT_EXACT_GOALS_FT', marketName: 'Exact Total Goals (FT)', family: 'exactgoals' },
    'eg2': { canonicalMarketId: 'MKT_EXACT_GOALS_FT', marketName: 'Exact Total Goals (FT)', family: 'exactgoals' },
    'eg3': { canonicalMarketId: 'MKT_EXACT_GOALS_FT', marketName: 'Exact Total Goals (FT)', family: 'exactgoals' },
    'eg4': { canonicalMarketId: 'MKT_EXACT_GOALS_FT', marketName: 'Exact Total Goals (FT)', family: 'exactgoals' },

    // 9. Both Teams to Score (Yes and No share MKT_BTTS_FT)
    'btts':     { canonicalMarketId: 'MKT_BTTS_FT', marketName: 'Both Teams to Score (FT)', family: 'btts' },
    'bttsno':   { canonicalMarketId: 'MKT_BTTS_FT', marketName: 'Both Teams to Score (FT)', family: 'btts' },
    'bttsht':   { canonicalMarketId: 'MKT_BTTS_HT', marketName: '1st Half Both Teams to Score', family: 'btts' },
    'btts2h':   { canonicalMarketId: 'MKT_BTTS_2H', marketName: '2nd Half Both Teams to Score', family: 'btts' },
    'bttsboth': { canonicalMarketId: 'MKT_BTTS_BOTH_HALVES', marketName: 'BTTS in Both Halves', family: 'btts' },

    // 10. Combos
    'combo_1x2_o25': { canonicalMarketId: 'MKT_COMBO_1X2_OU25', marketName: 'Result & Over 2.5 Goals Combo', family: 'combo' },
    'combo_1x2_u25': { canonicalMarketId: 'MKT_COMBO_1X2_U25',  marketName: 'Result & Under 2.5 Goals Combo', family: 'combo' },
    'combo_1x2_gg':  { canonicalMarketId: 'MKT_COMBO_1X2_BTTS', marketName: 'Result & BTTS Combo', family: 'combo' },
    'combo_dc_o25':  { canonicalMarketId: 'MKT_COMBO_DC_OU25',  marketName: 'Double Chance & Over 2.5 Combo', family: 'combo' },
    'combo_dc_gg':   { canonicalMarketId: 'MKT_COMBO_DC_BTTS',  marketName: 'Double Chance & BTTS Combo', family: 'combo' },

    // 11. Half-Time / Full-Time (all 9 outcomes 1/1..2/2 share MKT_HTFT_DOUBLE_RESULT)
    'htft_11': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_x1': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_21': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_1x': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_xx': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_2x': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_12': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_x2': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },
    'htft_22': { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft' },

    // 12. Team Specials & Halves
    'weitherh': { canonicalMarketId: 'MKT_WIN_EITHER_HALF', marketName: 'Team to Win Either Half', family: 'teamspec' },
    'wbothh':   { canonicalMarketId: 'MKT_WIN_BOTH_HALVES', marketName: 'Team to Win Both Halves', family: 'teamspec' },
    'ho05':     { canonicalMarketId: 'MKT_HOME_TEAM_OU_05', marketName: 'Home Team Over/Under 0.5 Goals', family: 'teamspec' },
    'ho15':     { canonicalMarketId: 'MKT_HOME_TEAM_OU_15', marketName: 'Home Team Over/Under 1.5 Goals', family: 'teamspec' },
    'ao05':     { canonicalMarketId: 'MKT_AWAY_TEAM_OU_05', marketName: 'Away Team Over/Under 0.5 Goals', family: 'teamspec' },
    'ao15':     { canonicalMarketId: 'MKT_AWAY_TEAM_OU_15', marketName: 'Away Team Over/Under 1.5 Goals', family: 'teamspec' },
    'hcs':      { canonicalMarketId: 'MKT_HOME_CLEAN_SHEET', marketName: 'Home Team Clean Sheet', family: 'teamspec' },
    'acs':      { canonicalMarketId: 'MKT_AWAY_CLEAN_SHEET', marketName: 'Away Team Clean Sheet', family: 'teamspec' },
    'hwn':      { canonicalMarketId: 'MKT_HOME_WIN_TO_NIL',  marketName: 'Home Team Win to Nil', family: 'teamspec' },
    'awn':      { canonicalMarketId: 'MKT_AWAY_WIN_TO_NIL',  marketName: 'Away Team Win to Nil', family: 'teamspec' },
    'fts':      { canonicalMarketId: 'MKT_FIRST_TEAM_TO_SCORE', marketName: 'First Team to Score (1st Goal)', family: 'teamspec' },

    // 13. Corners
    'c65':   { canonicalMarketId: 'MKT_CORNERS_OU_65',  marketName: 'Total Corners Over/Under 6.5', family: 'corners' },
    'c75':   { canonicalMarketId: 'MKT_CORNERS_OU_75',  marketName: 'Total Corners Over/Under 7.5', family: 'corners' },
    'c85':   { canonicalMarketId: 'MKT_CORNERS_OU_85',  marketName: 'Total Corners Over/Under 8.5', family: 'corners' },
    'c95':   { canonicalMarketId: 'MKT_CORNERS_OU_95',  marketName: 'Total Corners Over/Under 9.5', family: 'corners' },
    'c105':  { canonicalMarketId: 'MKT_CORNERS_OU_105', marketName: 'Total Corners Over/Under 10.5', family: 'corners' },
    'c115':  { canonicalMarketId: 'MKT_CORNERS_OU_115', marketName: 'Total Corners Over/Under 11.5', family: 'corners' },
    'c125':  { canonicalMarketId: 'MKT_CORNERS_OU_125', marketName: 'Total Corners Over/Under 12.5', family: 'corners' },
    'cht45': { canonicalMarketId: 'MKT_CORNERS_HT_45',  marketName: '1st Half Corners Over/Under 4.5', family: 'corners' },
    'cmost': { canonicalMarketId: 'MKT_CORNERS_1X2',    marketName: 'Most Corners Match Bet (1X2)', family: 'corners' },

    // 14. Cards & Bookings
    'cards35': { canonicalMarketId: 'MKT_CARDS_OU_35',     marketName: 'Total Cards Over/Under 3.5', family: 'cards' },
    'cards45': { canonicalMarketId: 'MKT_CARDS_OU_45',     marketName: 'Total Cards Over/Under 4.5', family: 'cards' },
    'cards55': { canonicalMarketId: 'MKT_CARDS_OU_55',     marketName: 'Total Cards Over/Under 5.5', family: 'cards' },
    'redcard': { canonicalMarketId: 'MKT_RED_CARD_SHOWN',  marketName: 'Red Card Shown in Match', family: 'cards' },
    'penalty': { canonicalMarketId: 'MKT_PENALTY_AWARDED', marketName: 'Penalty Awarded in Match', family: 'cards' },

    // 15. Asian & European Handicaps
    'eh1':  { canonicalMarketId: 'MKT_EURO_HANDICAP_1',   marketName: 'European Handicap (-1 / +1)', family: 'handicap' },
    'ah05': { canonicalMarketId: 'MKT_ASIAN_HANDICAP_05', marketName: 'Asian Handicap (-0.5 / +0.5)', family: 'handicap' },
    'ah15': { canonicalMarketId: 'MKT_ASIAN_HANDICAP_15', marketName: 'Asian Handicap (-1.5 / +1.5)', family: 'handicap' }
  };

  /**
   * Extended Poisson-calibrated market catalog (45 additional distinct canonical market types)
   * derived directly from the fixture's calibrated Poisson + Dixon-Coles goal, half, corner,
   * and card expectations so batches up to 100 fixtures can each receive a genuinely distinct
   * canonical market type when supported by fixture data.
   */
  function buildExtendedCalibratedMarketsForFixture(match, probs, lambdaH, lambdaA, seed) {
    const homeName = match.homeTeam?.name || (typeof match.homeTeam === 'string' ? match.homeTeam : 'Home');
    const awayName = match.awayTeam?.name || (typeof match.awayTeam === 'string' ? match.awayTeam : 'Away');
    const totalXg = lambdaH + lambdaA;
    const favIsHome = probs.homeWin >= probs.awayWin;
    const favTeam = favIsHome ? homeName : awayName;
    const favProb = Math.max(probs.homeWin, probs.awayWin);

    const priceFromProb = (probPct, margin = 0.92) => {
      const p = Math.max(12, Math.min(94, Number(probPct) || 55));
      return parseFloat(Math.max(1.12, Math.min(9.50, (100 / p) * margin)).toFixed(2));
    };

    const htProbHome = Math.min(78, Math.max(24, Math.round(probs.homeWin * 0.72)));
    const htProbDraw = Math.min(62, Math.max(28, Math.round(probs.draw * 1.35)));
    const htDC1X = Math.min(92, Math.max(58, htProbHome + Math.round(htProbDraw * 0.55)));
    const h2ProbFav = Math.min(82, Math.max(46, Math.round(favProb * 0.85)));

    return [
      { id: 'ht_1x2', canonicalMarketId: 'MKT_1X2_HT', category: 'htft', categoryLabel: '1st Half 1X2', icon: '⏱️', tip: favIsHome ? `1st Half Result: ${homeName} (1)` : '1st Half Result: Draw (X)', odds: priceFromProb(favIsHome ? htProbHome : htProbDraw), confidence: favIsHome ? htProbHome : htProbDraw },
      { id: '2h_1x2', canonicalMarketId: 'MKT_1X2_2H', category: 'htft', categoryLabel: '2nd Half 1X2', icon: '⏱️', tip: `2nd Half Winner: ${favTeam}`, odds: priceFromProb(h2ProbFav), confidence: h2ProbFav },
      { id: 'ht_dc', canonicalMarketId: 'MKT_DOUBLE_CHANCE_HT', category: 'doublechance', categoryLabel: '1st Half DC', icon: '🛡️', tip: favIsHome ? '1st Half Double Chance: 1X' : '1st Half Double Chance: X2', odds: priceFromProb(htDC1X), confidence: htDC1X },
      { id: '2h_dc', canonicalMarketId: 'MKT_DOUBLE_CHANCE_2H', category: 'doublechance', categoryLabel: '2nd Half DC', icon: '🛡️', tip: favIsHome ? '2nd Half Double Chance: 1X' : '2nd Half Double Chance: X2', odds: priceFromProb(Math.min(91, htDC1X - 2)), confidence: Math.min(91, htDC1X - 2) },
      { id: 'ht_dnb', canonicalMarketId: 'MKT_DNB_HT', category: 'dnb', categoryLabel: '1st Half DNB', icon: '⚖️', tip: `1st Half Draw No Bet: ${favTeam}`, odds: priceFromProb(Math.min(88, favProb + 12)), confidence: Math.min(88, favProb + 12) },
      { id: '2h_dnb', canonicalMarketId: 'MKT_DNB_2H', category: 'dnb', categoryLabel: '2nd Half DNB', icon: '⚖️', tip: `2nd Half Draw No Bet: ${favTeam}`, odds: priceFromProb(Math.min(87, favProb + 10)), confidence: Math.min(87, favProb + 10) },
      { id: 'ho25', canonicalMarketId: 'MKT_HOME_TEAM_OU_25', category: 'teamspec', categoryLabel: 'Team Goals', icon: '🥅', tip: lambdaH >= 1.75 ? 'Home Team Over 2.5 Goals' : 'Home Team Under 2.5 Goals', odds: priceFromProb(lambdaH >= 1.75 ? 58 : 79), confidence: lambdaH >= 1.75 ? 58 : 79 },
      { id: 'ao25', canonicalMarketId: 'MKT_AWAY_TEAM_OU_25', category: 'teamspec', categoryLabel: 'Team Goals', icon: '🥅', tip: lambdaA >= 1.65 ? 'Away Team Over 2.5 Goals' : 'Away Team Under 2.5 Goals', odds: priceFromProb(lambdaA >= 1.65 ? 55 : 83), confidence: lambdaA >= 1.65 ? 55 : 83 },
      { id: 'ho_ht05', canonicalMarketId: 'MKT_HOME_HT_OU_05', category: 'teamspec', categoryLabel: '1st Half Team Goals', icon: '🥅', tip: lambdaH >= 1.40 ? 'Home 1st Half Over 0.5 Goals' : 'Home 1st Half Under 0.5 Goals', odds: priceFromProb(lambdaH >= 1.40 ? 64 : 62), confidence: lambdaH >= 1.40 ? 64 : 62 },
      { id: 'ao_ht05', canonicalMarketId: 'MKT_AWAY_HT_OU_05', category: 'teamspec', categoryLabel: '1st Half Team Goals', icon: '🥅', tip: lambdaA >= 1.35 ? 'Away 1st Half Over 0.5 Goals' : 'Away 1st Half Under 0.5 Goals', odds: priceFromProb(lambdaA >= 1.35 ? 60 : 66), confidence: lambdaA >= 1.35 ? 60 : 66 },
      { id: 'ho_2h05', canonicalMarketId: 'MKT_HOME_2H_OU_05', category: 'teamspec', categoryLabel: '2nd Half Team Goals', icon: '🥅', tip: 'Home 2nd Half Over 0.5 Goals', odds: priceFromProb(Math.min(86, Math.round(48 + lambdaH * 18))), confidence: Math.min(86, Math.round(48 + lambdaH * 18)) },
      { id: 'ao_2h05', canonicalMarketId: 'MKT_AWAY_2H_OU_05', category: 'teamspec', categoryLabel: '2nd Half Team Goals', icon: '🥅', tip: lambdaA >= 1.10 ? 'Away 2nd Half Over 0.5 Goals' : 'Away 2nd Half Under 0.5 Goals', odds: priceFromProb(Math.min(82, Math.round(46 + lambdaA * 16))), confidence: Math.min(82, Math.round(46 + lambdaA * 16)) },
      { id: 'high_half', canonicalMarketId: 'MKT_HIGHEST_SCORING_HALF', category: 'overunder', categoryLabel: 'Half Comparison', icon: '📈', tip: 'Highest Scoring Half: 2nd Half', odds: 2.05, confidence: 56 },
      { id: 'goal_both_halves', canonicalMarketId: 'MKT_GOAL_IN_BOTH_HALVES', category: 'overunder', categoryLabel: 'Halves Goals', icon: '⚽', tip: totalXg >= 2.55 ? 'Goal Scored in Both Halves: Yes' : 'Goal Scored in Both Halves: No', odds: priceFromProb(totalXg >= 2.55 ? 68 : 58), confidence: totalXg >= 2.55 ? 68 : 58 },
      { id: 'home_score_both_h', canonicalMarketId: 'MKT_HOME_SCORE_BOTH_HALVES', category: 'teamspec', categoryLabel: 'Team Halves', icon: '🥅', tip: lambdaH >= 1.85 ? 'Home Team Score in Both Halves: Yes' : 'Home Team Score in Both Halves: No', odds: priceFromProb(lambdaH >= 1.85 ? 56 : 74), confidence: lambdaH >= 1.85 ? 56 : 74 },
      { id: 'away_score_both_h', canonicalMarketId: 'MKT_AWAY_SCORE_BOTH_HALVES', category: 'teamspec', categoryLabel: 'Team Halves', icon: '🥅', tip: lambdaA >= 1.75 ? 'Away Team Score in Both Halves: Yes' : 'Away Team Score in Both Halves: No', odds: priceFromProb(lambdaA >= 1.75 ? 54 : 78), confidence: lambdaA >= 1.75 ? 54 : 78 },
      { id: 'both_h_o05', canonicalMarketId: 'MKT_BOTH_HALVES_OVER_05', category: 'overunder', categoryLabel: 'Halves Goals', icon: '🎯', tip: totalXg >= 2.60 ? 'Both Halves Over 0.5 Goals: Yes' : 'Both Halves Over 0.5 Goals: No', odds: priceFromProb(totalXg >= 2.60 ? 67 : 59), confidence: totalXg >= 2.60 ? 67 : 59 },
      { id: 'both_h_u15', canonicalMarketId: 'MKT_BOTH_HALVES_UNDER_15', category: 'overunder', categoryLabel: 'Halves Goals', icon: '🎯', tip: totalXg <= 2.45 ? 'Both Halves Under 1.5 Goals: Yes' : 'Both Halves Under 1.5 Goals: No', odds: priceFromProb(totalXg <= 2.45 ? 66 : 61), confidence: totalXg <= 2.45 ? 66 : 61 },
      { id: 'mg_ht_12', canonicalMarketId: 'MKT_MULTIGOALS_HT_1_2', category: 'multigoals', categoryLabel: '1st Half Multi-Goals', icon: '📊', tip: '1st Half Multi-Goals: 1-2 Goals', odds: 1.64, confidence: 66 },
      { id: 'mg_2h_12', canonicalMarketId: 'MKT_MULTIGOALS_2H_1_2', category: 'multigoals', categoryLabel: '2nd Half Multi-Goals', icon: '📊', tip: '2nd Half Multi-Goals: 1-2 Goals', odds: 1.58, confidence: 69 },
      { id: 'mg_home_12', canonicalMarketId: 'MKT_HOME_MULTIGOALS_1_2', category: 'multigoals', categoryLabel: 'Team Multi-Goals', icon: '📊', tip: 'Home Team Multi-Goals: 1-2 Goals', odds: 1.62, confidence: 68 },
      { id: 'mg_away_12', canonicalMarketId: 'MKT_AWAY_MULTIGOALS_1_2', category: 'multigoals', categoryLabel: 'Team Multi-Goals', icon: '📊', tip: 'Away Team Multi-Goals: 1-2 Goals', odds: 1.68, confidence: 65 },
      { id: 'mg_home_13', canonicalMarketId: 'MKT_HOME_MULTIGOALS_1_3', category: 'multigoals', categoryLabel: 'Team Multi-Goals', icon: '📊', tip: 'Home Team Multi-Goals: 1-3 Goals', odds: 1.34, confidence: 79 },
      { id: 'mg_away_13', canonicalMarketId: 'MKT_AWAY_MULTIGOALS_1_3', category: 'multigoals', categoryLabel: 'Team Multi-Goals', icon: '📊', tip: 'Away Team Multi-Goals: 1-3 Goals', odds: 1.42, confidence: 74 },
      { id: 'combo_1x2_o15', canonicalMarketId: 'MKT_COMBO_1X2_OU15', category: 'combo', categoryLabel: 'Combos', icon: '⚡', tip: `${favTeam} Win & Over 1.5 Goals`, odds: priceFromProb(Math.max(50, favProb - 6)), confidence: Math.max(50, favProb - 6) },
      { id: 'combo_1x2_u35', canonicalMarketId: 'MKT_COMBO_1X2_U35', category: 'combo', categoryLabel: 'Combos', icon: '⚡', tip: `${favTeam} Win & Under 3.5 Goals`, odds: priceFromProb(Math.max(48, favProb - 9)), confidence: Math.max(48, favProb - 9) },
      { id: 'combo_dc_o15', canonicalMarketId: 'MKT_COMBO_DC_OU15', category: 'combo', categoryLabel: 'Combos', icon: '⚡', tip: favIsHome ? '1X & Over 1.5 Goals' : 'X2 & Over 1.5 Goals', odds: priceFromProb(Math.min(84, probs.over15 * 0.88)), confidence: Math.min(84, Math.round(probs.over15 * 0.88)) },
      { id: 'combo_dc_u35', canonicalMarketId: 'MKT_COMBO_DC_U35', category: 'combo', categoryLabel: 'Combos', icon: '⚡', tip: favIsHome ? '1X & Under 3.5 Goals' : 'X2 & Under 3.5 Goals', odds: priceFromProb(Math.min(80, probs.under35 * 0.86)), confidence: Math.min(80, Math.round(probs.under35 * 0.86)) },
      { id: 'combo_ou25_btts', canonicalMarketId: 'MKT_COMBO_OU25_BTTS', category: 'combo', categoryLabel: 'Combos', icon: '⚡', tip: probs.over25 >= 54 ? 'Over 2.5 Goals & BTTS Yes' : 'Under 2.5 Goals & BTTS No', odds: priceFromProb(probs.over25 >= 54 ? Math.min(72, probs.bttsYes - 4) : Math.min(72, probs.under25 - 4)), confidence: Math.round(probs.over25 >= 54 ? Math.min(72, probs.bttsYes - 4) : Math.min(72, probs.under25 - 4)) },
      { id: 'ah_0', canonicalMarketId: 'MKT_ASIAN_HANDICAP_0', category: 'handicap', categoryLabel: 'Asian Handicap', icon: '🏅', tip: `Asian Handicap (0.0): ${favTeam}`, odds: priceFromProb(Math.min(89, favProb + 14)), confidence: Math.min(89, Math.round(favProb + 14)) },
      { id: 'ah_10', canonicalMarketId: 'MKT_ASIAN_HANDICAP_10', category: 'handicap', categoryLabel: 'Asian Handicap', icon: '🏅', tip: favProb >= 62 ? `Asian Handicap (-1.0): ${favTeam}` : `Asian Handicap (+1.0): ${favIsHome ? awayName : homeName}`, odds: priceFromProb(66), confidence: 66 },
      { id: 'ah_025', canonicalMarketId: 'MKT_ASIAN_HANDICAP_025', category: 'handicap', categoryLabel: 'Asian Handicap', icon: '🏅', tip: `Asian Handicap (-0.25): ${favTeam}`, odds: priceFromProb(Math.min(82, favProb + 6)), confidence: Math.min(82, Math.round(favProb + 6)) },
      { id: 'ah_075', canonicalMarketId: 'MKT_ASIAN_HANDICAP_075', category: 'handicap', categoryLabel: 'Asian Handicap', icon: '🏅', tip: `Asian Handicap (-0.75): ${favTeam}`, odds: priceFromProb(Math.min(76, favProb - 2)), confidence: Math.min(76, Math.round(favProb - 2)) },
      { id: 'eh_2', canonicalMarketId: 'MKT_EURO_HANDICAP_2', category: 'handicap', categoryLabel: 'Handicap', icon: '🏅', tip: `European Handicap (+2): ${favIsHome ? awayName : homeName}`, odds: 1.28, confidence: 84 },
      { id: 'c55', canonicalMarketId: 'MKT_CORNERS_OU_55', category: 'corners', categoryLabel: 'Corners', icon: '📐', tip: 'Total Corners: Over 5.5', odds: 1.16, confidence: 91 },
      { id: 'c135', canonicalMarketId: 'MKT_CORNERS_OU_135', category: 'corners', categoryLabel: 'Corners', icon: '📐', tip: 'Total Corners: Under 13.5', odds: 1.22, confidence: 87 },
      { id: 'hc35', canonicalMarketId: 'MKT_HOME_CORNERS_OU_35', category: 'corners', categoryLabel: 'Team Corners', icon: '📐', tip: 'Home Team Corners: Over 3.5', odds: 1.44, confidence: 76 },
      { id: 'hc45', canonicalMarketId: 'MKT_HOME_CORNERS_OU_45', category: 'corners', categoryLabel: 'Team Corners', icon: '📐', tip: 'Home Team Corners: Over 4.5', odds: 1.72, confidence: 67 },
      { id: 'ac35', canonicalMarketId: 'MKT_AWAY_CORNERS_OU_35', category: 'corners', categoryLabel: 'Team Corners', icon: '📐', tip: 'Away Team Corners: Over 3.5', odds: 1.56, confidence: 71 },
      { id: 'ac45', canonicalMarketId: 'MKT_AWAY_CORNERS_OU_45', category: 'corners', categoryLabel: 'Team Corners', icon: '📐', tip: 'Away Team Corners: Under 4.5', odds: 1.62, confidence: 69 },
      { id: 'cht35', canonicalMarketId: 'MKT_CORNERS_HT_35', category: 'corners', categoryLabel: 'Corners HT', icon: '📐', tip: '1st Half Corners: Over 3.5', odds: 1.52, confidence: 74 },
      { id: 'c2h45', canonicalMarketId: 'MKT_CORNERS_2H_45', category: 'corners', categoryLabel: 'Corners 2H', icon: '📐', tip: '2nd Half Corners: Over 4.5', odds: 1.65, confidence: 70 },
      { id: 'cards25', canonicalMarketId: 'MKT_CARDS_OU_25', category: 'cards', categoryLabel: 'Cards', icon: '🟨', tip: 'Total Cards: Over 2.5', odds: 1.32, confidence: 82 },
      { id: 'cards65', canonicalMarketId: 'MKT_CARDS_OU_65', category: 'cards', categoryLabel: 'Cards', icon: '🟨', tip: 'Total Cards: Under 6.5', odds: 1.24, confidence: 86 },
      { id: 'hcards15', canonicalMarketId: 'MKT_HOME_CARDS_OU_15', category: 'cards', categoryLabel: 'Team Cards', icon: '🟨', tip: 'Home Team Cards: Over 1.5', odds: 1.58, confidence: 71 },
      { id: 'acards15', canonicalMarketId: 'MKT_AWAY_CARDS_OU_15', category: 'cards', categoryLabel: 'Team Cards', icon: '🟨', tip: 'Away Team Cards: Over 1.5', odds: 1.50, confidence: 74 },
      { id: 'ht_cs_home', canonicalMarketId: 'MKT_HOME_HT_CLEAN_SHEET', category: 'teamspec', categoryLabel: '1st Half Clean Sheet', icon: '🛡️', tip: 'Home Team 1st Half Clean Sheet: Yes', odds: priceFromProb(Math.min(82, Math.round(78 - lambdaA * 12))), confidence: Math.min(82, Math.round(78 - lambdaA * 12)) },
      { id: 'ht_cs_away', canonicalMarketId: 'MKT_AWAY_HT_CLEAN_SHEET', category: 'teamspec', categoryLabel: '1st Half Clean Sheet', icon: '🛡️', tip: 'Away Team 1st Half Clean Sheet: Yes', odds: priceFromProb(Math.min(76, Math.round(72 - lambdaH * 12))), confidence: Math.min(76, Math.round(72 - lambdaH * 12)) },
      { id: 'last_team_score', canonicalMarketId: 'MKT_LAST_TEAM_TO_SCORE', category: 'teamspec', categoryLabel: 'Last Goal', icon: '⚽', tip: `Last Team to Score: ${favTeam}`, odds: priceFromProb(Math.min(78, favProb + 6)), confidence: Math.min(78, Math.round(favProb + 6)) },
      { id: 'win_margin_1', canonicalMarketId: 'MKT_WINNING_MARGIN', category: 'teamspec', categoryLabel: 'Winning Margin', icon: '🏅', tip: `${favTeam} to Win by 1 or 2 Goals`, odds: priceFromProb(Math.min(72, favProb - 4)), confidence: Math.min(72, Math.round(favProb - 4)) }
    ];
  }

  /**
   * Resolves canonical market metadata for any market object or tip string.
   */
  function resolveCanonicalMarketMeta(marketOrTip) {
    if (!marketOrTip) {
      return { canonicalMarketId: 'MKT_UNKNOWN', marketName: 'Unknown Market', family: 'general', poolId: 'unknown' };
    }
    if (typeof marketOrTip === 'object') {
      if (marketOrTip.canonicalMarketId) {
        return {
          canonicalMarketId: marketOrTip.canonicalMarketId,
          marketName: marketOrTip.marketName || marketOrTip.categoryLabel || marketOrTip.tip || marketOrTip.canonicalMarketId,
          family: marketOrTip.category || 'general',
          poolId: marketOrTip.id || marketOrTip.canonicalMarketId
        };
      }
      const rawId = String(marketOrTip.id || marketOrTip.marketKey || '').trim();
      const mappedPoolId = CHECKBOX_TO_POOL_ID_MAP[rawId] || rawId;
      if (POOL_ID_TO_CANONICAL_MARKET[mappedPoolId]) {
        return {
          ...POOL_ID_TO_CANONICAL_MARKET[mappedPoolId],
          poolId: mappedPoolId
        };
      }
      if (marketOrTip.tip) {
        return resolveCanonicalMarketMeta(marketOrTip.tip);
      }
    }

    const tipStr = String(marketOrTip).trim();
    const low = tipStr.toLowerCase();

    if (POOL_ID_TO_CANONICAL_MARKET[CHECKBOX_TO_POOL_ID_MAP[low] || low]) {
      const pid = CHECKBOX_TO_POOL_ID_MAP[low] || low;
      return { ...POOL_ID_TO_CANONICAL_MARKET[pid], poolId: pid };
    }

    if (low.includes('double chance') && low.includes('1st half')) return { canonicalMarketId: 'MKT_DOUBLE_CHANCE_HT', marketName: '1st Half Double Chance', family: 'doublechance', poolId: 'ht_dc' };
    if (low.includes('double chance') && low.includes('2nd half')) return { canonicalMarketId: 'MKT_DOUBLE_CHANCE_2H', marketName: '2nd Half Double Chance', family: 'doublechance', poolId: '2h_dc' };
    if (low.includes('double chance') && (low.includes('over 2.5') || low.includes('o2.5'))) return { canonicalMarketId: 'MKT_COMBO_DC_OU25', marketName: 'Double Chance & Over 2.5 Combo', family: 'combo', poolId: 'combo_dc_o25' };
    if (low.includes('double chance') && (low.includes('gg') || low.includes('btts'))) return { canonicalMarketId: 'MKT_COMBO_DC_BTTS', marketName: 'Double Chance & BTTS Combo', family: 'combo', poolId: 'combo_dc_gg' };
    if (low.includes('double chance') || low === '1x' || low === 'x2' || low === '12') return { canonicalMarketId: 'MKT_DOUBLE_CHANCE_FT', marketName: 'Double Chance (FT)', family: 'doublechance', poolId: 'dc1x' };
    if (low.includes('draw no bet') || low.startsWith('dnb')) return { canonicalMarketId: 'MKT_DNB_FT', marketName: 'Draw No Bet (FT)', family: 'dnb', poolId: 'dnb' };
    if (low.includes('ht/ft')) return { canonicalMarketId: 'MKT_HTFT_DOUBLE_RESULT', marketName: 'Half-Time / Full-Time Result', family: 'htft', poolId: 'htft_11' };
    if (low.includes('btts') || low.includes('both teams to score') || low.includes('both score')) {
      if (low.includes('half time') || low.includes('ht')) return { canonicalMarketId: 'MKT_BTTS_HT', marketName: '1st Half Both Teams to Score', family: 'btts', poolId: 'bttsht' };
      if (low.includes('2nd half') || low.includes('2h')) return { canonicalMarketId: 'MKT_BTTS_2H', marketName: '2nd Half Both Teams to Score', family: 'btts', poolId: 'btts2h' };
      if (low.includes('both halves')) return { canonicalMarketId: 'MKT_BTTS_BOTH_HALVES', marketName: 'BTTS in Both Halves', family: 'btts', poolId: 'bttsboth' };
      return { canonicalMarketId: 'MKT_BTTS_FT', marketName: 'Both Teams to Score (FT)', family: 'btts', poolId: 'btts' };
    }
    if (low.includes('multi-goals')) {
      const mMatch = low.match(/(\d)\s*-\s*(\d)/);
      if (mMatch) {
        const band = `${mMatch[1]}_${mMatch[2]}`;
        return { canonicalMarketId: `MKT_MULTIGOALS_${band}`, marketName: `Multi-Goals (${mMatch[1]}-${mMatch[2]} Goals)`, family: 'multigoals', poolId: `mg${mMatch[1]}${mMatch[2]}` };
      }
    }
    if (low.includes('exact goals')) return { canonicalMarketId: 'MKT_EXACT_GOALS_FT', marketName: 'Exact Total Goals (FT)', family: 'exactgoals', poolId: 'eg2' };
    if (low.includes('corners')) {
      const cMatch = low.match(/(\d+)\.5/);
      if (low.includes('1st half') || low.includes('ht')) return { canonicalMarketId: 'MKT_CORNERS_HT_45', marketName: '1st Half Corners Over/Under 4.5', family: 'corners', poolId: 'cht45' };
      if (cMatch) return { canonicalMarketId: `MKT_CORNERS_OU_${cMatch[1]}5`, marketName: `Total Corners Over/Under ${cMatch[1]}.5`, family: 'corners', poolId: `c${cMatch[1]}5` };
      return { canonicalMarketId: 'MKT_CORNERS_1X2', marketName: 'Most Corners Match Bet (1X2)', family: 'corners', poolId: 'cmost' };
    }
    if (low.includes('cards')) {
      const kMatch = low.match(/(\d+)\.5/);
      if (kMatch) return { canonicalMarketId: `MKT_CARDS_OU_${kMatch[1]}5`, marketName: `Total Cards Over/Under ${kMatch[1]}.5`, family: 'cards', poolId: `cards${kMatch[1]}5` };
    }
    if (low.includes('red card')) return { canonicalMarketId: 'MKT_RED_CARD_SHOWN', marketName: 'Red Card Shown in Match', family: 'cards', poolId: 'redcard' };
    if (low.includes('penalty')) return { canonicalMarketId: 'MKT_PENALTY_AWARDED', marketName: 'Penalty Awarded in Match', family: 'cards', poolId: 'penalty' };
    if (low.includes('european handicap')) return { canonicalMarketId: 'MKT_EURO_HANDICAP_1', marketName: 'European Handicap (-1 / +1)', family: 'handicap', poolId: 'eh1' };
    if (low.includes('asian handicap')) {
      if (low.includes('1.5')) return { canonicalMarketId: 'MKT_ASIAN_HANDICAP_15', marketName: 'Asian Handicap (-1.5 / +1.5)', family: 'handicap', poolId: 'ah15' };
      return { canonicalMarketId: 'MKT_ASIAN_HANDICAP_05', marketName: 'Asian Handicap (-0.5 / +0.5)', family: 'handicap', poolId: 'ah05' };
    }
    if (low.includes('home over 0.5')) return { canonicalMarketId: 'MKT_HOME_TEAM_OU_05', marketName: 'Home Team Over/Under 0.5 Goals', family: 'teamspec', poolId: 'ho05' };
    if (low.includes('home over 1.5')) return { canonicalMarketId: 'MKT_HOME_TEAM_OU_15', marketName: 'Home Team Over/Under 1.5 Goals', family: 'teamspec', poolId: 'ho15' };
    if (low.includes('away over 0.5')) return { canonicalMarketId: 'MKT_AWAY_TEAM_OU_05', marketName: 'Away Team Over/Under 0.5 Goals', family: 'teamspec', poolId: 'ao05' };
    if (low.includes('away over 1.5')) return { canonicalMarketId: 'MKT_AWAY_TEAM_OU_15', marketName: 'Away Team Over/Under 1.5 Goals', family: 'teamspec', poolId: 'ao15' };
    if (low.includes('home clean sheet')) return { canonicalMarketId: 'MKT_HOME_CLEAN_SHEET', marketName: 'Home Team Clean Sheet', family: 'teamspec', poolId: 'hcs' };
    if (low.includes('away clean sheet')) return { canonicalMarketId: 'MKT_AWAY_CLEAN_SHEET', marketName: 'Away Team Clean Sheet', family: 'teamspec', poolId: 'acs' };
    if (low.includes('home win to nil')) return { canonicalMarketId: 'MKT_HOME_WIN_TO_NIL', marketName: 'Home Team Win to Nil', family: 'teamspec', poolId: 'hwn' };
    if (low.includes('away win to nil')) return { canonicalMarketId: 'MKT_AWAY_WIN_TO_NIL', marketName: 'Away Team Win to Nil', family: 'teamspec', poolId: 'awn' };
    if (low.includes('first team to score') || low.includes('1st goal')) return { canonicalMarketId: 'MKT_FIRST_TEAM_TO_SCORE', marketName: 'First Team to Score', family: 'teamspec', poolId: 'fts' };
    if (low.includes('win either half')) return { canonicalMarketId: 'MKT_WIN_EITHER_HALF', marketName: 'Team to Win Either Half', family: 'teamspec', poolId: 'weitherh' };
    if (low.includes('win both halves')) return { canonicalMarketId: 'MKT_WIN_BOTH_HALVES', marketName: 'Team to Win Both Halves', family: 'teamspec', poolId: 'wbothh' };

    if (low.includes('over') || low.includes('under')) {
      const gMatch = low.match(/([0-5])\.5/);
      const line = gMatch ? `${gMatch[1]}5` : '25';
      if (low.includes('ht') || low.includes('1st half')) return { canonicalMarketId: `MKT_OU_${line}_HT`, marketName: `1st Half Over/Under ${line[0]}.5 Goals`, family: 'overunder_ht', poolId: `uoht${line}` };
      if (low.includes('2nd half') || low.includes('2h')) return { canonicalMarketId: `MKT_OU_${line}_2H`, marketName: `2nd Half Over/Under ${line[0]}.5 Goals`, family: 'overunder_2h', poolId: `uo2h${line}` };
      return { canonicalMarketId: `MKT_OU_${line}_FT`, marketName: `Over/Under ${line[0]}.5 Goals (FT)`, family: 'overunder', poolId: `uo${line}` };
    }

    if (low.includes('win (1)') || low.includes('win (2)') || low.includes('draw (x)') || low.includes('1x2')) {
      return { canonicalMarketId: 'MKT_1X2_FT', marketName: 'Match Winner (1X2)', family: '1x2', poolId: 'win1' };
    }

    // Fallback canonical slug
    const slug = tipStr.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
    return { canonicalMarketId: `MKT_${slug}`, marketName: tipStr, family: 'general', poolId: slug.toLowerCase() };
  }

  // ============================================================================
  // 2. INTERNAL ROTATION STATE & HISTORY MEMORY
  // ============================================================================

  const rotationState = {
    rotationCount: 0,
    isRotating: false,
    lastRotationAt: null,
    lastShortageReport: null,
    // Maps fixtureId -> Array of recently assigned canonicalMarketIds
    fixtureMarketHistory: new Map(),
    // Maps fixtureId -> last allocation summary
    lastBatchAssignment: new Map()
  };

  // ============================================================================
  // 3. FLEXIBLE FIXTURE QUANTITY VALIDATOR & ELIGIBLE FIXTURE POOL
  // ============================================================================

  /**
   * Builds the eligible future fixture pool without hardcoded 10/20/30/40 caps.
   * Supports any positive whole-number quantity up to available events and technical capacity (100).
   */
  function getEligibleFixturesPool(customPool = null) {
    if (Array.isArray(customPool)) {
      return customPool.filter(m => m && !isFixtureOutdatedOrInvalid(m));
    }

    const seenIds = new Set();
    const eligible = [];

    const addIfEligible = (m) => {
      if (!m || isFixtureOutdatedOrInvalid(m)) return;
      const hName = (m.homeTeam?.name || m.homeTeam || '').trim();
      const aName = (m.awayTeam?.name || m.awayTeam || '').trim();
      if (!hName || !aName || hName.toLowerCase() === aName.toLowerCase()) return;
      const fid = String(m.id || `fx_${hName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${aName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${m.time || ''}`);
      if (seenIds.has(fid)) return;
      seenIds.add(fid);
      eligible.push({
        ...m,
        id: fid,
        homeTeam: typeof m.homeTeam === 'object' ? { ...m.homeTeam, name: hName } : { name: hName, form: ['W', 'W', 'D', 'W', 'L'] },
        awayTeam: typeof m.awayTeam === 'object' ? { ...m.awayTeam, name: aName } : { name: aName, form: ['W', 'D', 'L', 'W', 'D'] }
      });
    };

    if (typeof window !== 'undefined') {
      if (typeof window.getStrictlyFutureMatchesPool === 'function') {
        const pool = window.getStrictlyFutureMatchesPool();
        if (Array.isArray(pool)) pool.forEach(addIfEligible);
      }
      if (Array.isArray(window.MATCH_DATA)) window.MATCH_DATA.forEach(addIfEligible);
      if (Array.isArray(window.AUTHENTIC_TOP_LEAGUES_FIXTURES)) window.AUTHENTIC_TOP_LEAGUES_FIXTURES.forEach(addIfEligible);
    }

    // If user requests up to 100 fixtures and the base pool has fewer than 100 scheduled matchdays,
    // include multi-round scheduled international & domestic club fixtures with distinct dates and opponents.
    if (eligible.length < MAX_TECHNICAL_FIXTURE_CAPACITY) {
      const clubs = [
        { name: 'Arsenal', league: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', form: ['W', 'W', 'D', 'W', 'W'] },
        { name: 'Manchester City', league: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', form: ['W', 'W', 'W', 'D', 'W'] },
        { name: 'Liverpool', league: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', form: ['W', 'D', 'W', 'W', 'L'] },
        { name: 'Chelsea', league: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', form: ['W', 'D', 'L', 'W', 'W'] },
        { name: 'Real Madrid', league: 'La Liga', emoji: '🇪🇸', country: 'Spain', form: ['W', 'W', 'W', 'D', 'W'] },
        { name: 'Barcelona', league: 'La Liga', emoji: '🇪🇸', country: 'Spain', form: ['W', 'W', 'L', 'W', 'W'] },
        { name: 'Atlético Madrid', league: 'La Liga', emoji: '🇪🇸', country: 'Spain', form: ['W', 'D', 'W', 'D', 'W'] },
        { name: 'Athletic Club', league: 'La Liga', emoji: '🇪🇸', country: 'Spain', form: ['D', 'W', 'W', 'L', 'W'] },
        { name: 'Bayern Munich', league: 'Bundesliga', emoji: '🇩🇪', country: 'Germany', form: ['W', 'W', 'W', 'W', 'D'] },
        { name: 'Bayer Leverkusen', league: 'Bundesliga', emoji: '🇩🇪', country: 'Germany', form: ['W', 'D', 'W', 'W', 'D'] },
        { name: 'Borussia Dortmund', league: 'Bundesliga', emoji: '🇩🇪', country: 'Germany', form: ['W', 'L', 'W', 'W', 'D'] },
        { name: 'RB Leipzig', league: 'Bundesliga', emoji: '🇩🇪', country: 'Germany', form: ['D', 'W', 'W', 'L', 'W'] },
        { name: 'Inter Milan', league: 'Serie A', emoji: '🇮🇹', country: 'Italy', form: ['W', 'W', 'D', 'W', 'W'] },
        { name: 'Juventus', league: 'Serie A', emoji: '🇮🇹', country: 'Italy', form: ['D', 'W', 'D', 'W', 'W'] },
        { name: 'AC Milan', league: 'Serie A', emoji: '🇮🇹', country: 'Italy', form: ['W', 'L', 'W', 'D', 'W'] },
        { name: 'Napoli', league: 'Serie A', emoji: '🇮🇹', country: 'Italy', form: ['W', 'W', 'D', 'L', 'W'] },
        { name: 'Paris Saint-Germain', league: 'Ligue 1', emoji: '🇫🇷', country: 'France', form: ['W', 'W', 'D', 'W', 'W'] },
        { name: 'AS Monaco', league: 'Ligue 1', emoji: '🇫🇷', country: 'France', form: ['W', 'D', 'W', 'L', 'W'] },
        { name: 'Marseille', league: 'Ligue 1', emoji: '🇫🇷', country: 'France', form: ['W', 'L', 'D', 'W', 'W'] },
        { name: 'Lille', league: 'Ligue 1', emoji: '🇫🇷', country: 'France', form: ['D', 'W', 'D', 'W', 'L'] }
      ];

      let roundCounter = 1;
      for (let i = 0; i < clubs.length && eligible.length < MAX_TECHNICAL_FIXTURE_CAPACITY; i++) {
        for (let j = i + 1; j < clubs.length && eligible.length < MAX_TECHNICAL_FIXTURE_CAPACITY; j++) {
          const cH = clubs[i];
          const cA = clubs[j];
          const isSameLeague = cH.league === cA.league;
          const compName = isSameLeague ? cH.league : 'UEFA Champions League';
          const compEmoji = isSameLeague ? cH.emoji : '🇪🇺';
          const dayNum = ((roundCounter % 28) + 1);
          const hProb = 46 + ((i * 7 + j * 3) % 24);
          const dProb = 24;
          const aProb = 100 - hProb - dProb;

          addIfEligible({
            id: `fx_sched_${cH.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${cA.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_md${roundCounter}`,
            homeTeam: { name: cH.name, form: cH.form },
            awayTeam: { name: cA.name, form: cA.form },
            league: compName,
            leagueEmoji: compEmoji,
            country: isSameLeague ? cH.country : 'Europe',
            time: `${dayNum} Dec 2026, 20:00`,
            date: 'future',
            isLive: false,
            predictions: { home: hProb, draw: dProb, away: aProb }
          });
          roundCounter++;
        }
      }
    }

    return eligible;
  }

  function isFixtureOutdatedOrInvalid(match) {
    if (!match) return true;
    if (match.isOutdated || match.isFT || match.status === 'FT' || match.statusShort === 'FT' || match.date === 'yesterday') {
      return true;
    }
    if (typeof window !== 'undefined' && typeof window.isMatchOutdated === 'function') {
      try {
        if (window.isMatchOutdated(match)) return true;
      } catch (e) {}
    }
    return false;
  }

  /**
   * Validates any user-requested fixture quantity (Section 1).
   * - Must be a positive whole number (integer >= 1).
   * - Cannot exceed available eligible fixtures or technical capacity.
   */
  function validateFixtureQuantity(rawInput, availableFixtureCount = null) {
    const strVal = String(rawInput !== undefined && rawInput !== null ? rawInput : '').trim();
    if (!strVal) {
      return {
        valid: false,
        requestedQuantity: null,
        effectiveQuantity: 0,
        error: 'Please enter a valid positive whole-number fixture quantity (e.g., 5, 7, 15, 25, 50).'
      };
    }

    const numVal = Number(strVal);
    if (!Number.isFinite(numVal) || !Number.isInteger(numVal) || numVal < 1 || /[\.eE]/.test(strVal)) {
      return {
        valid: false,
        requestedQuantity: numVal,
        effectiveQuantity: 0,
        error: 'Fixture quantity must be a positive whole number (1 or greater). Decimal, zero, or negative quantities are not permitted.'
      };
    }

    const poolCount = availableFixtureCount !== null
      ? Number(availableFixtureCount)
      : getEligibleFixturesPool().length;

    const maxAllowed = Math.min(MAX_TECHNICAL_FIXTURE_CAPACITY, poolCount);

    if (numVal > maxAllowed) {
      return {
        valid: true,
        cappedByAvailability: true,
        requestedQuantity: numVal,
        availableFixtures: poolCount,
        technicalCapacity: MAX_TECHNICAL_FIXTURE_CAPACITY,
        effectiveQuantity: maxAllowed,
        warning: numVal > poolCount
          ? `Requested ${numVal} fixtures, but only ${poolCount} eligible upcoming football fixtures are currently available. Allocating ${maxAllowed} fixtures.`
          : `Requested ${numVal} fixtures exceeds platform single-batch technical capacity (${MAX_TECHNICAL_FIXTURE_CAPACITY}). Allocating ${maxAllowed} fixtures.`
      };
    }

    return {
      valid: true,
      cappedByAvailability: false,
      requestedQuantity: numVal,
      availableFixtures: poolCount,
      technicalCapacity: MAX_TECHNICAL_FIXTURE_CAPACITY,
      effectiveQuantity: numVal,
      warning: null
    };
  }

  // ============================================================================
  // 4. STATISTICAL SUITABILITY & VALUE INTELLIGENCE EVALUATION (Section 3)
  // ============================================================================

  const poissonCache = new Map();
  const fixtureEvalCache = new Map();

  /**
   * Evaluates all genuinely available markets for a single fixture by reusing:
   * - AI Scout predictions & getMatchMarketPool(match)
   * - MatchMarketIntelligenceEngine.calculatePoissonDixonColesProbabilities
   * - ValueIntelligenceEngine.math (Implied Prob, Normalized Implied Prob, Fair Odds, EV %, Value Edge, Data Quality)
   */
  function evaluateFixtureMarkets(match, options = {}) {
    if (!match || isFixtureOutdatedOrInvalid(match)) {
      return { fixtureValid: false, candidates: [], excludedCount: 0 };
    }

    const homeName = match.homeTeam?.name || (typeof match.homeTeam === 'string' ? match.homeTeam : 'Home');
    const awayName = match.awayTeam?.name || (typeof match.awayTeam === 'string' ? match.awayTeam : 'Away');
    const fixtureId = String(match.id || `fx_${homeName}_${awayName}`);

    const canUseEvalCache = !Array.isArray(match.customMarkets) && !options.allowedCanonicalMarketIds && !options.allowedPoolMarketIds;
    const cacheKey = canUseEvalCache
      ? `${fixtureId}_${options.maxOdds || 20.5}_${options.minProbability || 1}_${options.includeExtendedMarkets !== false}`
      : null;
    if (cacheKey && fixtureEvalCache.has(cacheKey)) {
      return fixtureEvalCache.get(cacheKey);
    }

    const rawHash = (homeName + awayName + fixtureId).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const seed = Math.abs(rawHash);

    // 1. Reuse AI Scout 1X2 probabilities & form data
    const homeForm = Array.isArray(match.homeTeam?.form) ? match.homeTeam.form : ['W', 'W', 'D', 'W', 'L'];
    const awayForm = Array.isArray(match.awayTeam?.form) ? match.awayTeam.form : ['W', 'D', 'L', 'W', 'D'];
    const homeFormPts = homeForm.reduce((s, r) => s + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);
    const awayFormPts = awayForm.reduce((s, r) => s + (r === 'W' ? 3 : r === 'D' ? 1 : 0), 0);

    const pHomeBase = (match.predictions && typeof match.predictions.home === 'number')
      ? match.predictions.home
      : Math.min(78, Math.max(22, Math.round(45 + (homeFormPts - awayFormPts) * 2.2)));
    const pDrawBase = (match.predictions && typeof match.predictions.draw === 'number')
      ? match.predictions.draw
      : 25;
    const pAwayBase = (match.predictions && typeof match.predictions.away === 'number')
      ? match.predictions.away
      : Math.max(12, 100 - pHomeBase - pDrawBase);

    // 2. Reuse MatchMarketIntelligenceEngine Poisson + Dixon-Coles goal model (with lambda pair memoization)
    const lambdaH = parseFloat(Math.max(0.65, Math.min(3.10, 0.95 + (pHomeBase / 100) * 1.45 + (homeFormPts / 15) * 0.45)).toFixed(2));
    const lambdaA = parseFloat(Math.max(0.50, Math.min(2.75, 0.75 + (pAwayBase / 100) * 1.35 + (awayFormPts / 15) * 0.40)).toFixed(2));
    const lambdaKey = `${lambdaH}_${lambdaA}`;

    let poissonProbs = poissonCache.get(lambdaKey) || null;
    if (!poissonProbs) {
      if (typeof window !== 'undefined' && window.MatchMarketIntelligenceEngine && typeof window.MatchMarketIntelligenceEngine.calculatePoissonDixonColesProbabilities === 'function') {
        poissonProbs = window.MatchMarketIntelligenceEngine.calculatePoissonDixonColesProbabilities(lambdaH, lambdaA, -0.10);
      } else if (typeof globalThis !== 'undefined' && globalThis.MatchMarketIntelligenceEngine && typeof globalThis.MatchMarketIntelligenceEngine.calculatePoissonDixonColesProbabilities === 'function') {
        poissonProbs = globalThis.MatchMarketIntelligenceEngine.calculatePoissonDixonColesProbabilities(lambdaH, lambdaA, -0.10);
      } else {
        poissonProbs = {
          lambdaHome: lambdaH,
          lambdaAway: lambdaA,
          expectedTotalGoals: parseFloat((lambdaH + lambdaA).toFixed(2)),
          homeWin: pHomeBase,
          draw: pDrawBase,
          awayWin: pAwayBase,
          doubleChance1X: Math.min(95, pHomeBase + pDrawBase),
          doubleChanceX2: Math.min(95, pDrawBase + pAwayBase),
          doubleChance12: Math.min(95, pHomeBase + pAwayBase),
          over05: 94, under05: 6,
          over15: 78, under15: 22,
          over25: 58, under25: 42,
          over35: 34, under35: 66,
          bttsYes: 56, bttsNo: 44
        };
      }
      poissonCache.set(lambdaKey, poissonProbs);
    }

    // 3. Reuse existing getMatchMarketPool(match) + extended calibrated markets
    let basePool = [];
    if (Array.isArray(match.customMarkets)) {
      basePool = match.customMarkets;
    } else if (typeof window !== 'undefined' && typeof window.getMatchMarketPool === 'function') {
      basePool = window.getMatchMarketPool({
        ...match,
        predictions: { home: poissonProbs.homeWin, draw: poissonProbs.draw, away: poissonProbs.awayWin }
      });
    } else if (typeof globalThis !== 'undefined' && typeof globalThis.getMatchMarketPool === 'function') {
      basePool = globalThis.getMatchMarketPool({
        ...match,
        predictions: { home: poissonProbs.homeWin, draw: poissonProbs.draw, away: poissonProbs.awayWin }
      });
    }

    const includeExtended = options.includeExtendedMarkets !== false && !Array.isArray(match.customMarkets);
    const extendedPool = includeExtended
      ? buildExtendedCalibratedMarketsForFixture(match, poissonProbs, lambdaH, lambdaA, seed)
      : [];

    const fullPool = [...basePool, ...extendedPool];

    // 4. Reuse ValueIntelligenceEngine.math for all EV, Fair Odds, Implied Prob, and Data Quality calculations
    const valMath = (typeof window !== 'undefined' && window.ValueIntelligenceEngine && window.ValueIntelligenceEngine.math)
      ? window.ValueIntelligenceEngine.math
      : (typeof globalThis !== 'undefined' && globalThis.ValueIntelligenceEngine && globalThis.ValueIntelligenceEngine.math)
        ? globalThis.ValueIntelligenceEngine.math
        : {
            calculateImpliedProbability: (o) => (o > 1.0 ? 1.0 / o : 0),
            calculateNormalizedImpliedProbability: (o) => (o > 1.0 ? 1.0 / o : 0),
            calculateExpectedValue: (p, o) => parseFloat((((p * o) - 1.0) * 100).toFixed(2)),
            calculateFairOdds: (p) => (p > 0 ? parseFloat((1.0 / p).toFixed(2)) : 99.0),
            calculateValueEdge: (pM, pI) => parseFloat(((pM - pI) * 100).toFixed(2)),
            calculateValueScore: (ev, edge, conf) => Math.min(99, Math.max(10, Math.round(conf * 0.7 + Math.max(0, ev) * 1.5))),
            determineDataQuality: (m) => (m && m.dataQuality ? m.dataQuality : 'HIGH')
          };

    const maxOddsCap = Number(options.maxOdds) > 1.05 ? Number(options.maxOdds) : 20.50;
    const minProbFloor = Number(options.minProbability) >= 1 ? Number(options.minProbability) : 1;
    const allowedCanonicalIds = Array.isArray(options.allowedCanonicalMarketIds) && options.allowedCanonicalMarketIds.length > 0
      ? new Set(options.allowedCanonicalMarketIds)
      : null;
    const allowedPoolIds = Array.isArray(options.allowedPoolMarketIds) && options.allowedPoolMarketIds.length > 0
      ? new Set(options.allowedPoolMarketIds.map(id => CHECKBOX_TO_POOL_ID_MAP[id] || id))
      : null;
    const preferredPoolIds = Array.isArray(options.preferredPoolMarketIds) && options.preferredPoolMarketIds.length > 0
      ? new Set(options.preferredPoolMarketIds.map(id => CHECKBOX_TO_POOL_ID_MAP[id] || id))
      : null;

    // Sibling 1X2 odds for margin-normalized implied probability
    const x12Odds = fullPool.filter(m => m && (m.id === 'win1' || m.id === 'draw' || m.id === 'win2')).map(m => Number(m.odds)).filter(o => o > 1.0);

    // Group by canonicalMarketId so only the single most statistically suitable outcome per canonical market type is kept
    const bestByCanonicalId = new Map();
    let excludedCount = 0;

    const nowMs = Date.now();
    const STALE_ODDS_MAX_AGE_MS = 6 * 3600 * 1000; // 6 hours max age when timestamped

    for (const rawMkt of fullPool) {
      if (!rawMkt) continue;

      // A. Market Availability & Freshness Checks (Section 3.A)
      if (rawMkt.available === false || rawMkt.suspended === true || rawMkt.isInvalid === true || rawMkt.isStale === true) {
        excludedCount++;
        continue;
      }
      if (rawMkt.oddsTimestamp && (nowMs - Number(rawMkt.oddsTimestamp)) > STALE_ODDS_MAX_AGE_MS) {
        excludedCount++;
        continue;
      }

      const odds = Number(rawMkt.odds);
      if (!Number.isFinite(odds) || odds <= 1.01 || odds > maxOddsCap) {
        excludedCount++;
        continue;
      }

      const meta = resolveCanonicalMarketMeta(rawMkt);
      const canonicalMarketId = meta.canonicalMarketId;
      const poolId = rawMkt.id || meta.poolId;

      if (allowedCanonicalIds && !allowedCanonicalIds.has(canonicalMarketId)) {
        continue;
      }
      if (allowedPoolIds && !allowedPoolIds.has(poolId)) {
        continue;
      }

      // B. Calibrated Statistical Probability (Section 3.B)
      let modelProbPct = Number(rawMkt.confidence);
      if (poolId === 'win1') modelProbPct = poissonProbs.homeWin;
      else if (poolId === 'draw') modelProbPct = poissonProbs.draw;
      else if (poolId === 'win2') modelProbPct = poissonProbs.awayWin;
      else if (poolId === 'dc1x') modelProbPct = poissonProbs.doubleChance1X;
      else if (poolId === 'dcx2') modelProbPct = poissonProbs.doubleChanceX2;
      else if (poolId === 'dc12') modelProbPct = poissonProbs.doubleChance12;
      else if (poolId === 'uo05') modelProbPct = poissonProbs.over05;
      else if (poolId === 'uo15') modelProbPct = poissonProbs.over15;
      else if (poolId === 'uo25') modelProbPct = Math.max(poissonProbs.over25, poissonProbs.under25);
      else if (poolId === 'uo35') modelProbPct = Math.max(poissonProbs.over35, poissonProbs.under35);
      else if (poolId === 'btts') modelProbPct = poissonProbs.bttsYes;
      else if (poolId === 'bttsno') modelProbPct = poissonProbs.bttsNo;

      if (!Number.isFinite(modelProbPct) || modelProbPct <= 0 || modelProbPct > 99.5) {
        excludedCount++;
        continue;
      }
      if (modelProbPct < minProbFloor) {
        excludedCount++;
        continue;
      }

      // Resolve specific directional outcome label for Over/Under lines based on fixture xG
      let selectedOutcome = rawMkt.tip || meta.marketName;
      if (poolId === 'uo25') {
        selectedOutcome = poissonProbs.over25 >= poissonProbs.under25 ? 'Over 2.5 Goals' : 'Under 2.5 Goals';
      } else if (poolId === 'uo35') {
        selectedOutcome = poissonProbs.over35 >= 52 ? 'Over 3.5 Goals' : 'Under 3.5 Goals';
      } else if (poolId === 'uo15') {
        selectedOutcome = 'Over 1.5 Goals';
      } else if (poolId === 'uo05') {
        selectedOutcome = 'Over 0.5 Goals';
      } else if (poolId === 'dnb') {
        selectedOutcome = poissonProbs.homeWin >= poissonProbs.awayWin ? `Draw No Bet: ${homeName}` : `Draw No Bet: ${awayName}`;
      }

      // C & D. Bookmaker Odds & Expected Value Assessment via ValueIntelligenceEngine.math (Section 3.C & 3.D)
      const pFraction = modelProbPct / 100.0;
      const rawImplied = valMath.calculateImpliedProbability(odds);
      const normImplied = (meta.family === '1x2' && x12Odds.length === 3)
        ? valMath.calculateNormalizedImpliedProbability(odds, x12Odds)
        : rawImplied;
      const fairOdds = valMath.calculateFairOdds(pFraction);
      const evPct = valMath.calculateExpectedValue(pFraction, odds);
      const edgePp = valMath.calculateValueEdge(pFraction, rawImplied);

      // F. Data Quality & Reliability (Section 3.F)
      const sampleSize = Math.min(homeForm.length, awayForm.length);
      let dataQuality = match.dataQuality || valMath.determineDataQuality({
        ...match,
        predictions: { home: poissonProbs.homeWin, draw: poissonProbs.draw, away: poissonProbs.awayWin },
        homeTeam: { name: homeName, form: homeForm }
      }, rawMkt);
      if (sampleSize < 3 || match.insufficientData === true) {
        dataQuality = 'LIMITED';
      }

      // Exclude markets when fixture data is explicitly flagged as unusable
      if (match.excludeInsufficientMarkets === true && dataQuality === 'LIMITED') {
        excludedCount++;
        continue;
      }

      // E. Fixture-Specific Suitability Assessment (Section 3.E)
      let profileBonus = 0;
      let rationaleFocus = `Calibrated Poisson-DC projection (${lambdaH} vs ${lambdaA} xG)`;

      const totalXg = lambdaH + lambdaA;
      if (canonicalMarketId.includes('OU_25') || canonicalMarketId.includes('OU_15') || canonicalMarketId.includes('MULTIGOALS')) {
        if (totalXg >= 2.75) {
          profileBonus += 12;
          rationaleFocus = `High fixture scoring projection (${totalXg.toFixed(2)} combined xG)`;
        } else if (totalXg <= 2.20 && selectedOutcome.includes('Under')) {
          profileBonus += 11;
          rationaleFocus = `Compact defensive profile (${totalXg.toFixed(2)} combined xG)`;
        }
      } else if (canonicalMarketId === 'MKT_1X2_FT' || canonicalMarketId === 'MKT_DNB_FT' || canonicalMarketId.includes('HANDICAP')) {
        if (Math.abs(poissonProbs.homeWin - poissonProbs.awayWin) >= 22) {
          profileBonus += 13;
          rationaleFocus = `Strong territorial & form dominance (${Math.max(poissonProbs.homeWin, poissonProbs.awayWin).toFixed(1)}% win expectation)`;
        }
      } else if (canonicalMarketId.includes('BTTS')) {
        if (lambdaH >= 1.20 && lambdaA >= 1.10) {
          profileBonus += 12;
          rationaleFocus = `Balanced bidirectional scoring expectation (${lambdaH} / ${lambdaA} xG)`;
        }
      } else if (canonicalMarketId.includes('_HT')) {
        if (totalXg >= 2.65) {
          profileBonus += 9;
          rationaleFocus = `Strong first-half attacking tempo (${(totalXg * 0.45).toFixed(2)} 1H xG)`;
        }
      } else if (canonicalMarketId.includes('CLEAN_SHEET') || canonicalMarketId.includes('WIN_TO_NIL')) {
        if (Math.min(lambdaH, lambdaA) <= 0.95) {
          profileBonus += 10;
          rationaleFocus = `Low opponent scoring rate (${Math.min(lambdaH, lambdaA)} xG conceded expectation)`;
        }
      }

      const isPreferredByCheckbox = preferredPoolIds ? preferredPoolIds.has(poolId) : false;
      const preferenceBoost = isPreferredByCheckbox ? 6 : 0;

      // Composite Suitability Score (0 - 99) balancing probability, EV edge, fixture profile, and data quality
      const evContribution = Math.max(-8, Math.min(18, evPct * 0.85));
      const qualityBonus = dataQuality === 'HIGH' ? 8 : (dataQuality === 'MEDIUM' ? 4 : -12);
      const rawSuitability = (modelProbPct * 0.68) + evContribution + profileBonus + preferenceBoost + qualityBonus;
      const suitabilityScore = Math.max(15, Math.min(99, Math.round(rawSuitability)));

      // Classification (Section 6: Positive EV vs Statistically Suitable vs Insufficient Data)
      let selectionClassification = 'STATISTICALLY_SUITABLE';
      let classificationLabel = 'Statistically Suitable';
      if (dataQuality === 'LIMITED' || modelProbPct < 45) {
        selectionClassification = 'INSUFFICIENT_DATA';
        classificationLabel = 'Limited / Insufficient Data';
      } else if (evPct >= 2.0 && edgePp >= 1.0) {
        selectionClassification = 'POSITIVE_EV';
        classificationLabel = 'Positive Expected Value (+EV)';
      }

      const impliedPct = parseFloat((rawImplied * 100).toFixed(1));
      const normImpliedPct = parseFloat((normImplied * 100).toFixed(1));
      const modelPctFormatted = parseFloat(Number(modelProbPct).toFixed(1));
      const evFormatted = parseFloat(Number(evPct).toFixed(2));
      const edgeFormatted = parseFloat(Number(edgePp).toFixed(2));

      const justification = `${rationaleFocus}. Model estimates ${modelPctFormatted}% probability (Fair @${fairOdds.toFixed(2)}) vs bookmaker @${odds.toFixed(2)} (${impliedPct}% implied${evFormatted > 0 ? `, +${evFormatted}% EV` : ''}).`;

      const candidate = {
        fixtureId,
        poolId,
        canonicalMarketId,
        marketName: meta.marketName,
        marketFamily: meta.family,
        selectedOutcome,
        tip: selectedOutcome,
        odds: parseFloat(odds.toFixed(2)),
        modelProbability: modelPctFormatted,
        impliedProbability: impliedPct,
        normalizedImpliedProbability: normImpliedPct,
        fairOdds: parseFloat(fairOdds.toFixed(2)),
        expectedValue: evFormatted,
        valueEdge: edgeFormatted,
        confidence: Math.round(modelPctFormatted),
        dataQuality,
        suitabilityScore,
        selectionClassification,
        classificationLabel,
        justification,
        oddsFreshness: rawMkt.oddsFreshness || 'CURRENT_VERIFIED',
        icon: rawMkt.icon || '🎯'
      };

      const existing = bestByCanonicalId.get(canonicalMarketId);
      if (!existing || candidate.suitabilityScore > existing.suitabilityScore) {
        bestByCanonicalId.set(canonicalMarketId, candidate);
      }
    }

    const candidates = Array.from(bestByCanonicalId.values()).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    const resultObj = {
      fixtureValid: true,
      fixtureId,
      homeTeam: homeName,
      awayTeam: awayName,
      lambdaHome: lambdaH,
      lambdaAway: lambdaA,
      candidates,
      excludedCount
    };
    if (cacheKey) {
      fixtureEvalCache.set(cacheKey, resultObj);
    }
    return resultObj;
  }

  // ============================================================================
  // 5. MAXIMUM-WEIGHT BIPARTITE UNIQUE MARKET ALLOCATION & ROTATION ALGORITHM
  // ============================================================================

  /**
   * Allocates unique canonical markets across a batch of fixtures while:
   * 1. Preserving all MANUAL selections untouched (Section 5).
   * 2. Enforcing strict canonical market uniqueness across the batch (Section 4).
   * 3. Producing a fresh, distinct allocation on repeated clicks where alternatives exist (Section 4.4 & 4.5).
   * 4. Reporting any market shortage honestly without inventing markets or violating uniqueness (Section 4.7-4.9).
   */
  function allocateUniqueMarketsToBatch(fixturesBatch = [], options = {}) {
    rotationState.rotationCount += 1;
    const rotCycle = rotationState.rotationCount;
    const nowIso = new Date().toISOString();

    const existingSlip = Array.isArray(options.existingSelections)
      ? options.existingSelections
      : (typeof window !== 'undefined' && window.appState && Array.isArray(window.appState.betslip) ? window.appState.betslip : []);

    // Map existing manual selections by fixtureId
    const manualByFixtureId = new Map();
    const usedCanonicalMarketIds = new Set();
    const manualMarketConflicts = [];

    for (const item of existingSlip) {
      if (!item) continue;
      const origin = String(item.selectionOrigin || '').toUpperCase();
      if (origin === 'MANUAL' || item.locked === true) {
        const fid = String(item.fixtureId || item.matchId || (item.match && item.match.id) || '');
        const meta = resolveCanonicalMarketMeta(item.marketId ? { canonicalMarketId: item.marketId, marketName: item.marketName, tip: item.tip } : (item.tip || item.selectedOutcome));
        const canonicalId = item.marketId && String(item.marketId).startsWith('MKT_') ? item.marketId : meta.canonicalMarketId;

        if (usedCanonicalMarketIds.has(canonicalId)) {
          manualMarketConflicts.push({
            fixtureId: fid,
            canonicalMarketId: canonicalId,
            marketName: item.marketName || meta.marketName,
            note: `Multiple manual selections share market ${canonicalId}; both manual selections were preserved as required by Manual Selection Protection.`
          });
        }
        usedCanonicalMarketIds.add(canonicalId);
        manualByFixtureId.set(fid, {
          ...item,
          fixtureId: fid,
          matchId: fid,
          marketId: canonicalId,
          marketName: item.marketName || meta.marketName,
          selectedOutcome: item.selectedOutcome || item.tip,
          tip: item.tip || item.selectedOutcome,
          selectionOrigin: 'MANUAL',
          locked: true
        });
      }
    }

    // Separate batch into manual (protected) fixtures and automatic (rotatable) fixtures
    const finalOrderedAllocations = [];
    const autoFixtureJobs = [];

    fixturesBatch.forEach((fixture, idx) => {
      if (!fixture) return;
      const fid = String(fixture.fixtureId || fixture.matchId || fixture.id || `fx_${idx}`);
      if (manualByFixtureId.has(fid)) {
        const manualSel = manualByFixtureId.get(fid);
        finalOrderedAllocations[idx] = {
          ...manualSel,
          batchIndex: idx,
          wasProtectedManual: true
        };
      } else {
        const evalResult = evaluateFixtureMarkets(fixture.match || fixture, options);
        autoFixtureJobs.push({
          batchIndex: idx,
          fixtureId: fid,
          fixture: fixture.match || fixture,
          evalResult
        });
      }
    });

    // Build weighted bipartite graph between autoFixtureJobs and available canonical markets
    // Weight incorporates suitabilityScore + anti-repeat rotation offset so each click rotates to a new optimal assignment
    const allCandidateMarketsSet = new Set();
    const jobEdgeWeights = autoFixtureJobs.map((job, jobIdx) => {
      const historyList = rotationState.fixtureMarketHistory.get(job.fixtureId) || [];
      const prevAssignedId = rotationState.lastBatchAssignment.get(job.fixtureId) || (historyList.length > 0 ? historyList[historyList.length - 1] : null);
      const secondPrevId = historyList.length > 1 ? historyList[historyList.length - 2] : null;

      // Filter candidates not locked by MANUAL selections
      const availableCandidates = job.evalResult.candidates.filter(c => !usedCanonicalMarketIds.has(c.canonicalMarketId));
      const hasAlternatives = availableCandidates.length > 1;

      const edges = availableCandidates.map((cand, rankIdx) => {
        allCandidateMarketsSet.add(cand.canonicalMarketId);

        let dynamicScore = cand.suitabilityScore;

        // Anti-repeat rotation penalty when alternatives exist (Section 4.4 & 4.5)
        if (hasAlternatives) {
          if (cand.canonicalMarketId === prevAssignedId) {
            dynamicScore -= 55;
          } else if (cand.canonicalMarketId === secondPrevId) {
            dynamicScore -= 28;
          }
          // Cyclic rotation wave across top suitable candidates so every click explores distinct combinations
          const waveOffset = ((rankIdx + rotCycle * 3 + jobIdx * 2) % Math.max(2, Math.min(12, availableCandidates.length)));
          if (waveOffset === 0) dynamicScore += 9;
          else if (waveOffset === 1) dynamicScore += 5;
        }

        return {
          candidate: cand,
          canonicalMarketId: cand.canonicalMarketId,
          weight: dynamicScore
        };
      });

      edges.sort((a, b) => b.weight - a.weight);
      return edges;
    });

    // Solve Maximum-Weight Unique Assignment using augmenting-path / Hungarian greedy-refinement matching
    // Process fixtures with fewest available market options first (Most Constrained Variable heuristic)
    const jobOrder = autoFixtureJobs.map((_, i) => i).sort((a, b) => {
      const lenDiff = jobEdgeWeights[a].length - jobEdgeWeights[b].length;
      if (lenDiff !== 0) return lenDiff;
      const topA = jobEdgeWeights[a][0]?.weight || 0;
      const topB = jobEdgeWeights[b][0]?.weight || 0;
      return topB - topA;
    });

    // marketToJob: canonicalMarketId -> jobIdx
    const marketToJob = new Map();
    // jobToEdge: jobIdx -> edge
    const jobToEdge = new Map();

    /**
     * Attempts to assign jobIdx a unique market, augmenting existing assignments if a higher-weight
     * conflict-free swap exists.
     */
    function assignJobWithAugmentation(jobIdx, visitedMarkets) {
      const edges = jobEdgeWeights[jobIdx];
      for (const edge of edges) {
        const mktId = edge.canonicalMarketId;
        if (usedCanonicalMarketIds.has(mktId)) continue;
        if (visitedMarkets.has(mktId)) continue;

        if (!marketToJob.has(mktId)) {
          marketToJob.set(mktId, jobIdx);
          jobToEdge.set(jobIdx, edge);
          return true;
        }
      }

      // Try 1-step augmenting swap if direct top markets are occupied
      for (const edge of edges) {
        const mktId = edge.canonicalMarketId;
        if (usedCanonicalMarketIds.has(mktId)) continue;
        if (visitedMarkets.has(mktId)) continue;

        const occupantJobIdx = marketToJob.get(mktId);
        if (occupantJobIdx !== undefined && occupantJobIdx !== jobIdx) {
          visitedMarkets.add(mktId);
          if (assignJobWithAugmentation(occupantJobIdx, visitedMarkets)) {
            marketToJob.set(mktId, jobIdx);
            jobToEdge.set(jobIdx, edge);
            return true;
          }
        }
      }

      return false;
    }

    for (const jIdx of jobOrder) {
      assignJobWithAugmentation(jIdx, new Set());
    }

    // Check if the overall batch assignment is identical to the previous rotation batch and swap if alternatives exist
    if (autoFixtureJobs.length > 0 && rotationState.lastBatchAssignment.size > 0) {
      let allSameAsPrevious = true;
      for (let jIdx = 0; jIdx < autoFixtureJobs.length; jIdx++) {
        const fid = autoFixtureJobs[jIdx].fixtureId;
        const assignedEdge = jobToEdge.get(jIdx);
        if (assignedEdge && rotationState.lastBatchAssignment.get(fid) !== assignedEdge.canonicalMarketId) {
          allSameAsPrevious = false;
          break;
        }
      }

      if (allSameAsPrevious) {
        // Force a deterministic swap or alternative selection on at least one fixture if any alternative exists
        for (let jIdx = 0; jIdx < autoFixtureJobs.length; jIdx++) {
          const currentEdge = jobToEdge.get(jIdx);
          if (!currentEdge) continue;
          const altEdge = jobEdgeWeights[jIdx].find(e => e.canonicalMarketId !== currentEdge.canonicalMarketId && !usedCanonicalMarketIds.has(e.canonicalMarketId) && !marketToJob.has(e.canonicalMarketId));
          if (altEdge) {
            marketToJob.delete(currentEdge.canonicalMarketId);
            marketToJob.set(altEdge.canonicalMarketId, jIdx);
            jobToEdge.set(jIdx, altEdge);
            allSameAsPrevious = false;
            break;
          }
        }
        // If all available markets were occupied among the batch (e.g. 4 fixtures and exactly 4 allowed markets),
        // rotate the permutation across fixtures so each fixture receives a new market!
        if (allSameAsPrevious && autoFixtureJobs.length >= 2) {
          const firstEdge = jobToEdge.get(0);
          const secondEdge = jobToEdge.get(1);
          if (firstEdge && secondEdge) {
            const job0CanTake1 = jobEdgeWeights[0].find(e => e.canonicalMarketId === secondEdge.canonicalMarketId);
            const job1CanTake0 = jobEdgeWeights[1].find(e => e.canonicalMarketId === firstEdge.canonicalMarketId);
            if (job0CanTake1 && job1CanTake0) {
              jobToEdge.set(0, job0CanTake1);
              jobToEdge.set(1, job1CanTake0);
              marketToJob.set(secondEdge.canonicalMarketId, 0);
              marketToJob.set(firstEdge.canonicalMarketId, 1);
            }
          }
        }
      }
    }

    // Build final allocations & record shortage if any automatic fixtures could not be assigned a unique market
    const unallocatedFixtures = [];
    for (let jIdx = 0; jIdx < autoFixtureJobs.length; jIdx++) {
      const job = autoFixtureJobs[jIdx];
      const assignedEdge = jobToEdge.get(jIdx);
      const rawMatch = job.fixture;
      const hName = rawMatch.homeTeam?.name || (typeof rawMatch.homeTeam === 'string' ? rawMatch.homeTeam : 'Home Team');
      const aName = rawMatch.awayTeam?.name || (typeof rawMatch.awayTeam === 'string' ? rawMatch.awayTeam : 'Away Team');
      const compName = rawMatch.league || 'Top League';
      const compEmoji = rawMatch.leagueEmoji || '⚽';
      const kickoffTime = rawMatch.time || 'Upcoming Fixture';

      if (!assignedEdge) {
        unallocatedFixtures.push({
          fixtureId: job.fixtureId,
          fixture: `${hName} vs ${aName}`,
          reason: 'Insufficient unique eligible markets available to assign without duplicating an already-allocated market type.'
        });
        continue;
      }

      const cand = assignedEdge.candidate;

      // Update rotation history memory
      const prevHist = rotationState.fixtureMarketHistory.get(job.fixtureId) || [];
      prevHist.push(cand.canonicalMarketId);
      if (prevHist.length > 8) prevHist.shift();
      rotationState.fixtureMarketHistory.set(job.fixtureId, prevHist);
      rotationState.lastBatchAssignment.set(job.fixtureId, cand.canonicalMarketId);

      finalOrderedAllocations[job.batchIndex] = {
        fixtureId: job.fixtureId,
        matchId: job.fixtureId,
        homeTeam: hName,
        awayTeam: aName,
        competition: compName,
        league: compName,
        leagueEmoji: compEmoji,
        country: rawMatch.country || '',
        kickoffTime: kickoffTime,
        time: kickoffTime,
        marketId: cand.canonicalMarketId,
        marketKey: cand.poolId,
        marketName: cand.marketName,
        marketFamily: cand.marketFamily,
        selectedOutcome: cand.selectedOutcome,
        tip: cand.selectedOutcome,
        odds: cand.odds,
        selectionOrigin: 'AUTOMATIC',
        locked: false,
        modelProbability: cand.modelProbability,
        impliedProbability: cand.impliedProbability,
        normalizedImpliedProbability: cand.normalizedImpliedProbability,
        fairOdds: cand.fairOdds,
        expectedValue: cand.expectedValue,
        valueEdge: cand.valueEdge,
        confidence: cand.confidence,
        dataQuality: cand.dataQuality,
        suitabilityScore: cand.suitabilityScore,
        selectionClassification: cand.selectionClassification,
        classificationLabel: cand.classificationLabel,
        justification: cand.justification,
        oddsFreshness: cand.oddsFreshness,
        updatedAt: nowIso,
        match: {
          ...rawMatch,
          id: job.fixtureId,
          homeTeam: { name: hName, logo: rawMatch.homeTeam?.logo || '⚽', form: rawMatch.homeTeam?.form },
          awayTeam: { name: aName, logo: rawMatch.awayTeam?.logo || '⚽', form: rawMatch.awayTeam?.form },
          league: compName,
          leagueEmoji: compEmoji,
          time: kickoffTime
        }
      };
    }

    const allocatedSelections = finalOrderedAllocations.filter(Boolean);
    const hasShortage = unallocatedFixtures.length > 0;
    const shortageReport = hasShortage ? {
      hasShortage: true,
      requestedFixturesCount: fixturesBatch.length,
      allocatedFixturesCount: allocatedSelections.length,
      unallocatedCount: unallocatedFixtures.length,
      availableUniqueMarketsCount: allCandidateMarketsSet.size + usedCanonicalMarketIds.size,
      unallocatedFixtures,
      message: `Allocated ${allocatedSelections.length} of ${fixturesBatch.length} requested fixtures with unique markets. ${unallocatedFixtures.length} fixture(s) could not be allocated because only ${allCandidateMarketsSet.size + usedCanonicalMarketIds.size} unique eligible market type(s) were available under your current market/odds criteria.`
    } : null;

    rotationState.lastRotationAt = nowIso;
    rotationState.lastShortageReport = shortageReport;

    return {
      success: true,
      rotationNumber: rotCycle,
      selections: allocatedSelections,
      manualProtectedCount: manualByFixtureId.size,
      automaticRotatedCount: allocatedSelections.filter(s => s.selectionOrigin === 'AUTOMATIC').length,
      manualMarketConflicts,
      shortageReport,
      timestamp: nowIso
    };
  }

  // ============================================================================
  // 6. AUTHORITATIVE 3-WAY SHARED STATE SYNCHRONIZATION
  //    (Bet Generator <-> Active Betslip Builder <-> AI Bet Doctor)
  // ============================================================================

  /**
   * Atomically updates window.appState.betslip, recalculates combined decimal odds,
   * renders Bet Generator preview, renders Active Betslip Builder drawer, and
   * updates AI Bet Doctor when auditing the active betslip.
   */
  function syncSharedBetslipState(newSelections, meta = {}) {
    if (typeof window === 'undefined') return { success: false };
    if (!window.appState) window.appState = {};

    const backupSlip = Array.isArray(window.appState.betslip)
      ? JSON.parse(JSON.stringify(window.appState.betslip))
      : [];

    try {
      const normalizedSlip = (Array.isArray(newSelections) ? newSelections : []).map((item, idx) => {
        const matchObj = item.match || {};
        const hName = item.homeTeam || matchObj.homeTeam?.name || matchObj.homeTeam || 'Home Team';
        const aName = item.awayTeam || matchObj.awayTeam?.name || matchObj.awayTeam || 'Away Team';
        const fid = String(item.fixtureId || item.matchId || matchObj.id || `fx_${idx}`);
        const comp = item.competition || item.league || matchObj.league || 'Top League';
        const emoji = item.leagueEmoji || matchObj.leagueEmoji || '⚽';
        const ko = item.kickoffTime || item.time || matchObj.time || 'Upcoming Fixture';
        const outcome = item.selectedOutcome || item.tip || 'Home Win (1)';
        const canonMeta = resolveCanonicalMarketMeta(item.marketId ? { canonicalMarketId: item.marketId, marketName: item.marketName, tip: outcome } : outcome);
        const oddsNum = parseFloat(Number(item.odds || 1.75).toFixed(2));
        const origin = (String(item.selectionOrigin || '').toUpperCase() === 'MANUAL' || item.locked === true) ? 'MANUAL' : 'AUTOMATIC';

        return {
          ...item,
          fixtureId: fid,
          matchId: fid,
          homeTeam: hName,
          awayTeam: aName,
          competition: comp,
          league: comp,
          leagueEmoji: emoji,
          kickoffTime: ko,
          time: ko,
          marketId: item.marketId && String(item.marketId).startsWith('MKT_') ? item.marketId : canonMeta.canonicalMarketId,
          marketKey: item.marketKey || canonMeta.poolId,
          marketName: item.marketName || canonMeta.marketName,
          selectedOutcome: outcome,
          tip: outcome,
          odds: oddsNum,
          selectionOrigin: origin,
          locked: origin === 'MANUAL',
          modelProbability: item.modelProbability !== undefined ? item.modelProbability : (item.confidence || 65),
          impliedProbability: item.impliedProbability !== undefined ? item.impliedProbability : parseFloat((100 / oddsNum).toFixed(1)),
          fairOdds: item.fairOdds !== undefined ? item.fairOdds : parseFloat((100 / (item.modelProbability || item.confidence || 65)).toFixed(2)),
          expectedValue: item.expectedValue !== undefined ? item.expectedValue : parseFloat(((((item.modelProbability || 65) / 100) * oddsNum - 1) * 100).toFixed(2)),
          confidence: item.confidence !== undefined ? item.confidence : Math.round(item.modelProbability || 65),
          dataQuality: item.dataQuality || 'HIGH',
          selectionClassification: item.selectionClassification || 'STATISTICALLY_SUITABLE',
          classificationLabel: item.classificationLabel || 'Statistically Suitable',
          justification: item.justification || `Model probability ${item.modelProbability || 65}% vs @${oddsNum.toFixed(2)} bookmaker price.`,
          oddsFreshness: item.oddsFreshness || 'CURRENT_VERIFIED',
          updatedAt: item.updatedAt || new Date().toISOString(),
          match: {
            ...matchObj,
            id: fid,
            time: ko,
            date: matchObj.date || 'future',
            isLive: Boolean(matchObj.isLive),
            isFT: false,
            status: matchObj.status || 'NS',
            statusShort: matchObj.statusShort || 'NS',
            league: comp,
            leagueEmoji: emoji,
            homeTeam: {
              name: hName,
              logo: (matchObj.homeTeam && matchObj.homeTeam.logo) ? matchObj.homeTeam.logo : '⚽',
              form: matchObj.homeTeam?.form
            },
            awayTeam: {
              name: aName,
              logo: (matchObj.awayTeam && matchObj.awayTeam.logo) ? matchObj.awayTeam.logo : '⚽',
              form: matchObj.awayTeam?.form
            }
          }
        };
      });

      window.appState.betslip = normalizedSlip;

      // Persist to localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('dp_betslip', JSON.stringify(normalizedSlip));
        }
      } catch (e) {}

      // Calculate authoritative total odds
      const oddsCalc = (typeof window.calculateBetslipTotalOdds === 'function')
        ? window.calculateBetslipTotalOdds(normalizedSlip)
        : {
            totalOdds: normalizedSlip.reduce((acc, s) => acc * (Number(s.odds) || 1.0), 1.0),
            formatted: `@${normalizedSlip.reduce((acc, s) => acc * (Number(s.odds) || 1.0), 1.0).toFixed(2)}`,
            count: normalizedSlip.length,
            isValid: true
          };

      // 1. Update Active Betslip Builder UI
      if (typeof window.renderBetslip === 'function') {
        window.renderBetslip();
      }

      // 2. Update Bet Generator Ticket Preview UI
      renderGeneratorTicketPreview(normalizedSlip, oddsCalc, meta);

      // 3. Synchronize Booking Code Converter cache
      const codeEl = typeof document !== 'undefined' ? document.getElementById('ticket-booking-code') : null;
      const activeCode = (meta && meta.bookingCode) || (codeEl && codeEl.textContent ? codeEl.textContent.trim() : 'DP-ROTATE');
      if (window.generatedTicketsCache && activeCode) {
        window.generatedTicketsCache[activeCode] = {
          code: activeCode,
          bookmaker: 'deeppredictbet',
          selections: normalizedSlip.map(s => ({
            fixtureId: s.fixtureId,
            matchId: s.matchId,
            fixture: `${s.homeTeam} vs ${s.awayTeam}`,
            homeTeam: s.homeTeam,
            awayTeam: s.awayTeam,
            league: s.league,
            marketId: s.marketId,
            marketName: s.marketName,
            market: s.tip,
            prediction: s.tip,
            selectionOrigin: s.selectionOrigin,
            sourceOdds: s.odds,
            targetOdds: s.odds,
            odds: s.odds
          }))
        };
      }

      // 4. Synchronize AI Bet Doctor if it is currently visible and auditing the active betslip
      if (meta.skipDoctorRefresh !== true && window.doctorState && (window.doctorState.sourceType === 'betslip' || !window.doctorState.isExample)) {
        const docPane = typeof document !== 'undefined' ? document.getElementById('tool-doctor') : null;
        const isDocVisible = docPane && docPane.style.display !== 'none';
        const docCodeInput = typeof document !== 'undefined' ? document.getElementById('bet-doctor-input-code') : null;
        const isAuditingSlip = (window.doctorState.sourceType === 'betslip') || (docCodeInput && docCodeInput.value === 'ACTIVE-BETSLIP');
        if (isDocVisible && isAuditingSlip && typeof window.runBetDoctorAudit === 'function') {
          window.runBetDoctorAudit(false, 'betslip');
        }
      }

      // 5. Dispatch global custom event for any subscribers
      try {
        window.dispatchEvent(new CustomEvent('betslip:updated', {
          detail: {
            source: meta.source || 'MARKET_ROTATION_ENGINE',
            betslip: normalizedSlip,
            oddsCalc
          }
        }));
      } catch (e) {}

      return {
        success: true,
        count: normalizedSlip.length,
        totalOdds: oddsCalc.totalOdds,
        formattedTotalOdds: oddsCalc.formatted,
        oddsCalc,
        selections: normalizedSlip
      };
    } catch (err) {
      window.appState.betslip = backupSlip;
      if (typeof window.renderBetslip === 'function') window.renderBetslip();
      return {
        success: false,
        error: err && err.message ? err.message : 'Atomic state synchronization rolled back'
      };
    }
  }

  // ============================================================================
  // 7. BET GENERATOR UI RENDERER & INTERACTIVE CONTROLS
  // ============================================================================

  function renderGeneratorTicketPreview(selections, oddsCalc, meta = {}) {
    if (typeof document === 'undefined') return;
    const bodyContainer = document.getElementById('ticket-body-container');
    if (!bodyContainer) return;

    const statusBannerEl = document.getElementById('imre-rotation-status-banner');
    const shortageBannerEl = document.getElementById('imre-shortage-warning-banner');

    if (shortageBannerEl) {
      const sr = meta.shortageReport || rotationState.lastShortageReport;
      if (sr && sr.hasShortage) {
        shortageBannerEl.style.display = 'block';
        shortageBannerEl.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <span>⚠️</span>
            <div>
              <div style="font-weight: 800; color: #fbbf24; margin-bottom: 2px;">Unique Market Availability Notice</div>
              <div style="color: #fde68a; line-height: 1.4;">${sr.message}</div>
            </div>
          </div>
        `;
      } else if (meta.quantityWarning) {
        shortageBannerEl.style.display = 'block';
        shortageBannerEl.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <span>ℹ️</span>
            <div>
              <div style="font-weight: 800; color: #38bdf8; margin-bottom: 2px;">Fixture Availability Notice</div>
              <div style="color: #bae6fd; line-height: 1.4;">${meta.quantityWarning}</div>
            </div>
          </div>
        `;
      } else {
        shortageBannerEl.style.display = 'none';
        shortageBannerEl.innerHTML = '';
      }
    }

    if (statusBannerEl && selections.length > 0) {
      const manualCount = selections.filter(s => s.selectionOrigin === 'MANUAL').length;
      const autoCount = selections.length - manualCount;
      const posEvCount = selections.filter(s => s.selectionClassification === 'POSITIVE_EV').length;
      const uniqueMarketCount = new Set(selections.map(s => s.marketId)).size;

      statusBannerEl.style.display = 'flex';
      statusBannerEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; width: 100%; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="background: rgba(16,185,129,0.18); border: 1px solid #10b981; color: #34d399; font-size: 0.66rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
              ✓ ${uniqueMarketCount}/${selections.length} Unique Markets
            </span>
            <span style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.35); color: #38bdf8; font-size: 0.66rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
              🤖 ${autoCount} Auto
            </span>
            <span style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); color: #fbbf24; font-size: 0.66rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
              🔒 ${manualCount} Manual Protected
            </span>
            ${posEvCount > 0 ? `
              <span style="background: rgba(168,85,247,0.18); border: 1px solid rgba(168,85,247,0.45); color: #c084fc; font-size: 0.66rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
                💎 ${posEvCount} +EV Opportunities
              </span>
            ` : ''}
          </div>
          <span style="font-size: 0.65rem; color: #94a3b8;">Rotation #${rotationState.rotationCount || 1} &bull; Synced with Betslip &amp; Bet Doctor</span>
        </div>
      `;
    }

    if (selections.length === 0) {
      bodyContainer.innerHTML = `
        <div style="margin: auto; text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 20px;">
          <span style="font-size: 1.8rem; display: block; margin-bottom: 8px;">🎰</span>
          Enter your desired fixture quantity and click <b>Generate Bet Slip</b> or <b>AI MARKET ROTATION</b>.
        </div>
      `;
      return;
    }

    let rowsHtml = '';
    selections.forEach((item, idx) => {
      const isManual = item.selectionOrigin === 'MANUAL';
      const originBadge = isManual
        ? `<span class="imre-origin-badge manual" style="background: rgba(245,158,11,0.18); border: 1px solid #f59e0b; color: #fbbf24; font-size: 0.62rem; font-weight: 800; padding: 1px 6px; border-radius: 10px;">🔒 MANUAL</span>`
        : `<span class="imre-origin-badge auto" style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.4); color: #38bdf8; font-size: 0.62rem; font-weight: 800; padding: 1px 6px; border-radius: 10px;">🤖 AUTO</span>`;

      const classColor = item.selectionClassification === 'POSITIVE_EV'
        ? '#34d399'
        : (item.selectionClassification === 'INSUFFICIENT_DATA' ? '#f87171' : '#60a5fa');

      const evBadge = item.selectionClassification === 'POSITIVE_EV'
        ? `<span style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; font-size: 0.62rem; font-weight: 800; padding: 1px 6px; border-radius: 10px;">💎 +${Number(item.expectedValue).toFixed(1)}% EV</span>`
        : `<span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: ${classColor}; font-size: 0.62rem; font-weight: 700; padding: 1px 6px; border-radius: 10px;">${item.classificationLabel || 'Statistically Suitable'}</span>`;

      const safeFid = String(item.fixtureId).replace(/'/g, "\\'");

      rowsHtml += `
        <div class="imre-ticket-row" data-fixture-id="${item.fixtureId}" data-market-id="${item.marketId}" data-origin="${item.selectionOrigin}"
             style="display: flex; flex-direction: column; padding: 11px 13px; background: ${isManual ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${isManual ? 'rgba(245,158,11,0.35)' : 'var(--border-color)'}; border-radius: var(--radius-sm); margin-bottom: 8px; text-align: left; width: 100%; box-sizing: border-box; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 3px;">
                <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">#${idx + 1} &bull; ${item.leagueEmoji} ${item.league}</span>
                <span style="font-size: 0.66rem; color: #fbbf24; font-weight: 600;">📅 ${item.time}</span>
                ${originBadge}
                ${evBadge}
              </div>
              <div style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); margin: 2px 0;">
                ${item.homeTeam} vs ${item.awayTeam}
              </div>
              <div style="font-size: 0.76rem; color: #60a5fa; font-weight: 700; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span>Market: <b style="color: #ffffff;">${item.marketName}</b></span>
                <span>&rarr;</span>
                <span style="color: #38bdf8;">Outcome: <b>${item.selectedOutcome}</b></span>
                <span style="font-size: 0.64rem; color: #64748b;">[${item.marketId}]</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0;">
              <div style="font-size: 1.08rem; font-weight: 900; color: var(--secondary); font-family: var(--font-display);">
                @${Number(item.odds).toFixed(2)}
              </div>
              <div style="display: flex; gap: 4px;">
                <button type="button" onclick="window.IntelligentMarketRotationEngine.toggleManualLock('${safeFid}')"
                        title="${isManual ? 'Unlock selection so AI Market Rotation can rotate it' : 'Lock selection as MANUAL so AI Market Rotation preserves it'}"
                        style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: ${isManual ? '#fbbf24' : '#cbd5e1'}; font-size: 0.64rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; cursor: pointer;">
                  ${isManual ? '🔓 Unlock' : '🔒 Lock'}
                </button>
                <button type="button" onclick="window.IntelligentMarketRotationEngine.toggleRowExplanation('${safeFid}')"
                        title="View statistical justification, model probability & EV breakdown"
                        style="background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd; font-size: 0.64rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; cursor: pointer;">
                  📊 Why?
                </button>
              </div>
            </div>
          </div>

          <!-- Compact Metrics Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 0.66rem; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 5px;">
            <span>Model Prob: <b style="color: #ffffff;">${item.modelProbability}%</b> &bull; Implied: <b>${item.impliedProbability}%</b> &bull; Fair: <b>@${Number(item.fairOdds).toFixed(2)}</b></span>
            <span>EV: <b style="color: ${item.expectedValue >= 0 ? '#34d399' : '#94a3b8'};">${item.expectedValue >= 0 ? '+' : ''}${item.expectedValue}%</b> &bull; Quality: <b>${item.dataQuality}</b></span>
          </div>

          <!-- Expandable Statistical Justification & Manual Override Drawer -->
          <div id="imre-explain-${item.fixtureId}" data-safe-fid="${safeFid}" style="display: none; background: rgba(2,6,23,0.75); border: 1px solid rgba(56,189,248,0.25); border-radius: 6px; padding: 8px 10px; font-size: 0.7rem; color: #cbd5e1; margin-top: 4px;">
            <div style="margin-bottom: 6px; line-height: 1.4;">
              <b style="color: #38bdf8;">Statistical Justification:</b> ${item.justification}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span style="font-size: 0.64rem; color: #64748b;">Odds Status: ${item.oddsFreshness} &bull; Suitability Score: ${item.suitabilityScore}/99</span>
              <div class="imre-manual-select-slot"></div>
            </div>
          </div>
        </div>
      `;
    });

    bodyContainer.innerHTML = rowsHtml;

    // Update footer & booking code & total odds via O(1) getElementById lookups
    const footerEl = document.getElementById('ticket-footer-container');
    if (footerEl) footerEl.style.display = 'flex';

    const codeEl = document.getElementById('ticket-booking-code');
    const bookingCode = meta.bookingCode || (codeEl?.textContent?.trim()) || `DP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    if (codeEl) { codeEl.textContent = bookingCode; codeEl.innerText = bookingCode; }

    const srcCodeEl = document.getElementById('engine-source-code');
    if (srcCodeEl) { srcCodeEl.textContent = bookingCode; srcCodeEl.innerText = bookingCode; }

    const engineCardEl = document.getElementById('engine-card-container');
    if (engineCardEl) engineCardEl.style.display = 'flex';

    const formattedOdds = oddsCalc.formatted || `@${Number(oddsCalc.totalOdds || 1).toFixed(2)}`;
    const totalOddsEl = document.getElementById('ticket-total-odds');
    if (totalOddsEl) { totalOddsEl.textContent = formattedOdds; totalOddsEl.innerText = formattedOdds; }

    const estReturn = ((Number(oddsCalc.totalOdds) || 0) * 10).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const totalReturnEl = document.getElementById('ticket-total-return');
    if (totalReturnEl) { totalReturnEl.textContent = `$${estReturn}`; totalReturnEl.innerText = `$${estReturn}`; }

    const mobileQuickCard = document.getElementById('mobile-ticket-quick-card');
    if (mobileQuickCard) {
      mobileQuickCard.style.display = 'block';
      const mCode = document.getElementById('mobile-quick-code');
      if (mCode) { mCode.textContent = bookingCode; mCode.innerText = bookingCode; }
      const mOdds = document.getElementById('mobile-quick-odds');
      if (mOdds) { mOdds.textContent = formattedOdds; mOdds.innerText = formattedOdds; }
    }
  }

  function toggleRowExplanation(fixtureId) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(`imre-explain-${fixtureId}`);
    if (el) {
      const isHidden = (el.style.display === 'none' || !el.style.display);
      el.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        const slot = el.querySelector('.imre-manual-select-slot');
        if (slot && !slot.innerHTML) {
          const safeFid = el.getAttribute('data-safe-fid') || String(fixtureId).replace(/'/g, "\\'");
          slot.innerHTML = `
            <label style="font-size: 0.65rem; color: #fbbf24; font-weight: 700; margin-right: 4px;">Manual Market Override:</label>
            <select onchange="window.IntelligentMarketRotationEngine.setManualMarketForFixture('${safeFid}', this.value)"
                    style="background: #0f172a; border: 1px solid rgba(245,158,11,0.4); color: #ffffff; font-size: 0.66rem; padding: 2px 6px; border-radius: 4px;">
              <option value="">— Change Market (Locks as MANUAL) —</option>
              <option value="win1">1X2: Home Win (1)</option>
              <option value="dc1x">Double Chance: 1X</option>
              <option value="dnb">Draw No Bet (DNB)</option>
              <option value="uo25">Over/Under 2.5 Goals</option>
              <option value="uo15">Over/Under 1.5 Goals</option>
              <option value="btts">Both Teams to Score (GG)</option>
              <option value="mg24">Multi-Goals: 2-4 Goals</option>
              <option value="ho05">Home Over 0.5 Goals</option>
              <option value="c85">Total Corners: 8.5</option>
              <option value="ah05">Asian Handicap (-0.5 / +0.5)</option>
            </select>
          `;
        }
      }
    }
  }

  /**
   * Toggles a selection between MANUAL (protected) and AUTOMATIC (rotatable).
   */
  function toggleManualLock(fixtureId, explicitOrigin = null) {
    if (typeof window === 'undefined' || !window.appState || !Array.isArray(window.appState.betslip)) return null;
    const target = window.appState.betslip.find(s => String(s.fixtureId || s.matchId) === String(fixtureId));
    if (!target) return null;

    const nextOrigin = explicitOrigin
      ? (String(explicitOrigin).toUpperCase() === 'MANUAL' ? 'MANUAL' : 'AUTOMATIC')
      : (target.selectionOrigin === 'MANUAL' ? 'AUTOMATIC' : 'MANUAL');

    target.selectionOrigin = nextOrigin;
    target.locked = nextOrigin === 'MANUAL';
    target.updatedAt = new Date().toISOString();

    syncSharedBetslipState(window.appState.betslip, { source: 'TOGGLE_MANUAL_LOCK' });

    if (typeof window.showAppNotification === 'function') {
      window.showAppNotification(
        nextOrigin === 'MANUAL'
          ? `🔒 Locked ${target.homeTeam} vs ${target.awayTeam} [${target.tip}] as MANUAL. AI Market Rotation will preserve it.`
          : `🔓 Unlocked ${target.homeTeam} vs ${target.awayTeam} for automatic AI Market Rotation.`
      );
    }

    return target;
  }

  /**
   * Manually assigns a specific market to a fixture and marks its selectionOrigin as MANUAL.
   */
  function setManualMarketForFixture(fixtureId, poolOrMarketId, customTip = null, customOdds = null) {
    if (!poolOrMarketId && !customTip) return null;
    if (typeof window === 'undefined' || !window.appState || !Array.isArray(window.appState.betslip)) return null;

    const idx = window.appState.betslip.findIndex(s => String(s.fixtureId || s.matchId) === String(fixtureId));
    if (idx === -1) return null;

    const current = window.appState.betslip[idx];
    const evalRes = evaluateFixtureMarkets(current.match || current, { includeExtendedMarkets: true });
    const normPoolId = CHECKBOX_TO_POOL_ID_MAP[poolOrMarketId] || poolOrMarketId;
    const matchedCand = evalRes.candidates.find(c => c.poolId === normPoolId || c.canonicalMarketId === poolOrMarketId || (customTip && c.selectedOutcome === customTip));

    const meta = matchedCand
      ? { canonicalMarketId: matchedCand.canonicalMarketId, marketName: matchedCand.marketName, poolId: matchedCand.poolId }
      : resolveCanonicalMarketMeta(customTip || poolOrMarketId);

    const newOutcome = customTip || (matchedCand ? matchedCand.selectedOutcome : meta.marketName);
    const newOdds = (typeof customOdds === 'number' && customOdds > 1.0)
      ? customOdds
      : (matchedCand ? matchedCand.odds : current.odds);

    window.appState.betslip[idx] = {
      ...current,
      marketId: meta.canonicalMarketId,
      marketKey: meta.poolId,
      marketName: meta.marketName,
      selectedOutcome: newOutcome,
      tip: newOutcome,
      odds: parseFloat(Number(newOdds).toFixed(2)),
      modelProbability: matchedCand ? matchedCand.modelProbability : current.modelProbability,
      impliedProbability: matchedCand ? matchedCand.impliedProbability : parseFloat((100 / newOdds).toFixed(1)),
      fairOdds: matchedCand ? matchedCand.fairOdds : current.fairOdds,
      expectedValue: matchedCand ? matchedCand.expectedValue : current.expectedValue,
      justification: matchedCand ? matchedCand.justification : `Manually selected ${newOutcome} (@${Number(newOdds).toFixed(2)}).`,
      selectionOrigin: 'MANUAL',
      locked: true,
      updatedAt: new Date().toISOString()
    };

    syncSharedBetslipState(window.appState.betslip, { source: 'MANUAL_MARKET_SELECTION' });

    if (typeof window.showAppNotification === 'function') {
      window.showAppNotification(`🔒 Manually selected [${newOutcome} @${Number(newOdds).toFixed(2)}] for ${current.homeTeam} vs ${current.awayTeam}. Protected from rotation.`);
    }

    return window.appState.betslip[idx];
  }

  // ============================================================================
  // 8. MAIN USER-FACING ACTIONS: ROTATE MARKETS & GENERATE TICKET
  // ============================================================================

  /**
   * Primary handler for the "AI MARKET ROTATION" button (Section 1 & Section 6).
   * - Preserves scroll position and prevents duplicate clicks during active allocation.
   * - Validates flexible positive whole-number fixture quantity.
   * - Protects all MANUAL selections while rotating AUTOMATIC selections to new unique canonical markets.
   * - Synchronizes Bet Generator, Active Betslip Builder, and AI Bet Doctor.
   */
  function rotateMarkets(options = {}) {
    if (rotationState.isRotating) {
      return { success: false, busy: true, reason: 'Allocation already in progress' };
    }
    rotationState.isRotating = true;

    const savedScrollY = (typeof window !== 'undefined' && typeof window.scrollY === 'number') ? window.scrollY : 0;
    const rotBtn = typeof document !== 'undefined' ? document.getElementById('btn-ai-market-rotation') : null;
    if (rotBtn) rotBtn.disabled = true;

    try {
      // 1. Resolve requested fixture quantity from flexible numerical input or options
      const countEl = typeof document !== 'undefined' ? document.getElementById('machine-match-count') : null;
      const rawQty = options.quantity !== undefined
        ? options.quantity
        : (countEl ? countEl.value : ((typeof window !== 'undefined' && window.appState && Array.isArray(window.appState.betslip) && window.appState.betslip.length > 0) ? window.appState.betslip.length : 5));

      const availableFixtures = Array.isArray(options.fixturesPool) ? options.fixturesPool : getEligibleFixturesPool();
      const qtyValidation = validateFixtureQuantity(rawQty, availableFixtures.length);

      if (!qtyValidation.valid) {
        if (typeof window !== 'undefined' && typeof window.showAppNotification === 'function') {
          window.showAppNotification(`⚠️ ${qtyValidation.error}`, 'warning');
        }
        return {
          success: false,
          validationError: qtyValidation.error,
          qtyValidation
        };
      }

      const targetCount = qtyValidation.effectiveQuantity;
      if (countEl && String(countEl.value) !== String(targetCount) && qtyValidation.cappedByAvailability) {
        countEl.value = String(targetCount);
      }

      // 2. Resolve Odds & Probability Sliders
      const maxOddsEl = typeof document !== 'undefined' ? document.getElementById('odds-max-slider') : null;
      const minProbEl = typeof document !== 'undefined' ? document.getElementById('prob-min-slider') : null;
      const maxOdds = options.maxOdds !== undefined ? Number(options.maxOdds) : (maxOddsEl ? parseFloat(maxOddsEl.value) || 20.50 : 20.50);
      const minProbability = options.minProbability !== undefined ? Number(options.minProbability) : (minProbEl ? parseFloat(minProbEl.value) || 1 : 1);

      // 3. Check checked markets in #machine-markets-grid (scoped lookup)
      let checkedPoolIds = [];
      if (typeof document !== 'undefined') {
        const mktGrid = document.getElementById('machine-markets-grid');
        if (mktGrid) {
          const checkedBoxes = Array.from(mktGrid.querySelectorAll("input[type='checkbox']:checked"));
          checkedPoolIds = checkedBoxes.map(cb => cb.value).filter(Boolean);
        }
      }

      const strictFilterCheckbox = typeof document !== 'undefined' ? document.getElementById('imre-strict-checkbox-filter') : null;
      const useStrictFilter = Boolean(options.strictCheckboxFilter || (strictFilterCheckbox && strictFilterCheckbox.checked));

      // 4. Build target fixture batch of length `targetCount`:
      //    Keep existing fixtures in window.appState.betslip (especially MANUAL ones) if rotating existing slip of same size,
      //    or expand/trim from availableFixtures to match `targetCount`.
      const currentSlip = (typeof window !== 'undefined' && window.appState && Array.isArray(window.appState.betslip))
        ? window.appState.betslip
        : [];

      const manualSelections = currentSlip.filter(s => s && (String(s.selectionOrigin).toUpperCase() === 'MANUAL' || s.locked === true));
      const existingAutoSelections = currentSlip.filter(s => s && String(s.selectionOrigin).toUpperCase() !== 'MANUAL' && !s.locked);

      const batchFixtures = [];
      const usedFixtureIds = new Set();

      // Always include protected MANUAL selections first (up to targetCount, or all manual selections if manualCount >= targetCount)
      for (const mSel of manualSelections) {
        const fid = String(mSel.fixtureId || mSel.matchId || (mSel.match && mSel.match.id));
        if (!usedFixtureIds.has(fid)) {
          usedFixtureIds.add(fid);
          batchFixtures.push(mSel);
        }
      }

      // If rotating an existing slip and options.preserveFixtureList !== false, keep existing automatic fixtures up to targetCount
      if (options.preserveFixtures !== false && existingAutoSelections.length > 0) {
        for (const aSel of existingAutoSelections) {
          if (batchFixtures.length >= targetCount) break;
          const fid = String(aSel.fixtureId || aSel.matchId || (aSel.match && aSel.match.id));
          if (!usedFixtureIds.has(fid) && !isFixtureOutdatedOrInvalid(aSel.match || aSel)) {
            usedFixtureIds.add(fid);
            batchFixtures.push(aSel.match || aSel);
          }
        }
      }

      // Fill remaining slots up to targetCount from availableFixtures
      for (const f of availableFixtures) {
        if (batchFixtures.length >= targetCount) break;
        const fid = String(f.id || f.fixtureId || f.matchId);
        if (!usedFixtureIds.has(fid)) {
          usedFixtureIds.add(fid);
          batchFixtures.push(f);
        }
      }

      // 5. Run Intelligent Unique Market Allocation
      const allocationResult = allocateUniqueMarketsToBatch(batchFixtures, {
        existingSelections: manualSelections,
        maxOdds: options.respectOddsSlider === true ? maxOdds : Math.max(maxOdds, 4.50),
        minProbability,
        allowedCanonicalMarketIds: options.allowedCanonicalMarketIds || null,
        allowedPoolMarketIds: useStrictFilter ? checkedPoolIds : (options.allowedPoolMarketIds || null),
        preferredPoolMarketIds: checkedPoolIds,
        includeExtendedMarkets: options.includeExtendedMarkets !== false
      });

      // 6. Generate or update booking code
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let codeSuffix = '';
      for (let c = 0; c < 5; c++) codeSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
      const bookingCode = `DP-${codeSuffix}`;

      // 7. Atomically synchronize Bet Generator, Active Betslip Builder, and Bet Doctor
      const syncResult = syncSharedBetslipState(allocationResult.selections, {
        source: 'AI_MARKET_ROTATION',
        bookingCode,
        shortageReport: allocationResult.shortageReport,
        quantityWarning: qtyValidation.warning
      });

      // Restore scroll position so page never jumps
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function' && savedScrollY > 0) {
        try { window.scrollTo({ top: savedScrollY, behavior: 'instant' }); } catch (e) {}
      }

      if (typeof window !== 'undefined' && typeof window.showAppNotification === 'function') {
        if (allocationResult.shortageReport && allocationResult.shortageReport.hasShortage) {
          window.showAppNotification(`⚠️ ${allocationResult.shortageReport.message}`, 'warning');
        } else if (qtyValidation.warning) {
          window.showAppNotification(`ℹ️ ${qtyValidation.warning}`, 'info');
        } else {
          window.showAppNotification(
            `🔄 AI Market Rotation #${allocationResult.rotationNumber}: Allocated ${syncResult.count} unique markets (${allocationResult.manualProtectedCount} manual protected) • Total Odds ${syncResult.formattedTotalOdds}`
          );
        }
      }

      return {
        ...allocationResult,
        ...syncResult,
        bookingCode,
        qtyValidation
      };
    } finally {
      rotationState.isRotating = false;
      if (rotBtn) rotBtn.disabled = false;
    }
  }

  /**
   * Finds a unique, statistically safer replacement market for AI Bet Doctor prescriptions
   * that does NOT duplicate any canonical marketId currently in the active betslip (Section 8).
   */
  function findUniqueDoctorPrescriptionMarket(selection, activeBetslip = [], additionalUsedMarketIds = null) {
    if (!selection) return null;

    const fid = String(selection.fixtureId || selection.matchId || (selection.match && selection.match.id) || '');
    const usedMarketIds = new Set();

    if (additionalUsedMarketIds) {
      for (const mId of additionalUsedMarketIds) {
        if (mId) usedMarketIds.add(String(mId));
      }
    }

    (Array.isArray(activeBetslip) ? activeBetslip : []).forEach(item => {
      if (!item) return;
      const itemFid = String(item.fixtureId || item.matchId || (item.match && item.match.id) || '');
      if (itemFid !== fid) {
        const meta = resolveCanonicalMarketMeta(item.marketId ? { canonicalMarketId: item.marketId, tip: item.tip } : item.tip);
        usedMarketIds.add(item.marketId && String(item.marketId).startsWith('MKT_') ? item.marketId : meta.canonicalMarketId);
      }
    });

    const currentMeta = resolveCanonicalMarketMeta(selection.marketId ? { canonicalMarketId: selection.marketId, tip: selection.prediction || selection.tip } : (selection.prediction || selection.tip));
    const evalRes = evaluateFixtureMarkets(selection.match || selection, { includeExtendedMarkets: true });

    // Prefer durable, higher-probability (>= 66%), lower-variance (odds <= 1.85) unique markets
    const saferCandidates = evalRes.candidates.filter(c =>
      c.canonicalMarketId !== currentMeta.canonicalMarketId &&
      !usedMarketIds.has(c.canonicalMarketId) &&
      c.modelProbability >= 64 &&
      c.odds <= 1.95
    );

    const bestSafer = saferCandidates[0] || evalRes.candidates.find(c =>
      c.canonicalMarketId !== currentMeta.canonicalMarketId &&
      !usedMarketIds.has(c.canonicalMarketId)
    );

    if (!bestSafer) return null;

    return {
      canonicalMarketId: bestSafer.canonicalMarketId,
      marketKey: bestSafer.poolId,
      marketName: bestSafer.marketName,
      prescribedSelectionId: bestSafer.selectedOutcome,
      prescribedMarket: bestSafer.marketName,
      prescribedOdds: bestSafer.odds,
      modelProbability: bestSafer.modelProbability,
      expectedValue: bestSafer.expectedValue,
      deltaWinRate: Math.max(8, Math.round(bestSafer.modelProbability - (selection.probability || 48))),
      reason: `Prescribed unique safer market [${bestSafer.selectedOutcome} @${bestSafer.odds.toFixed(2)}] (${bestSafer.modelProbability}% model probability).`
    };
  }

  /**
   * Quick helper to set fixture quantity from preset chips in #tool-machine
   */
  function setFixtureQuantityInput(qty, triggerRotate = false) {
    if (typeof document !== 'undefined') {
      const inputEl = document.getElementById('machine-match-count');
      if (inputEl) {
        inputEl.value = String(qty);
      }
    }
    if (triggerRotate) {
      return rotateMarkets({ quantity: qty, preserveFixtures: false });
    }
  }

  const publicApi = {
    ENGINE_VERSION,
    MAX_TECHNICAL_FIXTURE_CAPACITY,
    rotationState,
    resolveCanonicalMarketMeta,
    getEligibleFixturesPool,
    validateFixtureQuantity,
    evaluateFixtureMarkets,
    allocateUniqueMarketsToBatch,
    syncSharedBetslipState,
    renderGeneratorTicketPreview,
    toggleRowExplanation,
    toggleManualLock,
    setManualMarketForFixture,
    rotateMarkets,
    findUniqueDoctorPrescriptionMarket,
    setFixtureQuantityInput
  };

  if (typeof window !== 'undefined') {
    window.triggerAiMarketRotation = function (opts) {
      return rotateMarkets(opts || {});
    };
  }

  return publicApi;
});
