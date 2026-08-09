/**
 * DeepPredictBet Universal Market & Team Synonym Mapper
 * Normalizes team names and market strings across all 50 global bookmakers.
 */

export interface NormalizedSelection {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  marketCategory: string;
  lineValue?: number | null;
  pick: string;
  odds: number;
}

export const BOOKMAKER_PREFIX_MAP: Record<string, string> = {
  deeppredict: 'DP',
  deeppredictbet: 'DPB',
  sportybet: 'SB',
  bet9ja: 'B9J',
  '1xbet': '1XB',
  betking: 'BK',
  betway: 'BW',
  '22bet': '22B',
  msport: 'MSP',
  betano: 'BTN',
  melbet: 'MLB',
  megapari: 'MGP',
  betwinner: 'BWN',
  paripesa: 'PRS',
  merrybet: 'MBT',
  nairabet: 'NBR',
  bangbet: 'BNG',
  betika: 'BTK',
  easybet: 'EZB',
  hollywoodbet: 'HWD',
  mozzart: 'MZ',
  premierbet: 'PB',
  supersport: 'SS',
  odibets: 'ODI',
  galsport: 'GSB',
  bet365: 'B365',
  unibet: 'UNI',
  williamhill: 'WH',
  bwin: 'BWN',
  paddypower: 'PP',
  betfair: 'BF',
  skybet: 'SKY',
  '888sport': '888',
  draftkings: 'DK',
  fanduel: 'FD',
  betmgm: 'MGM',
  caesars: 'CZR',
  pointsbet: 'PB',
  pixbet: 'PIX',
  caliente: 'CAL',
  codere: 'COD',
  estrelabet: 'EST',
  betnacional: 'NAC',
  stake: 'STK',
  sportsbetau: 'SBA',
  sbobet: 'SBO',
  '188bet': '188',
  dafabet: 'DAFA',
  bk8: 'BK8',
  bcgame: 'BCG',
  cloudbet: 'CLD'
};

export const MARKET_TRANSLATION_TABLE: Record<string, Record<string, string>> = {
  HOME_WIN: {
    deeppredict: 'Home Win (1)',
    sportybet: '1',
    bet9ja: '1',
    '1xbet': '1 (Home Win)',
    betking: '1',
    bet365: 'Full Time Result - Home',
    stake: 'Match Winner - 1',
    betway: '1 (Home)'
  },
  AWAY_WIN: {
    deeppredict: 'Away Win (2)',
    sportybet: '2',
    bet9ja: '2',
    '1xbet': '2 (Away Win)',
    betking: '2',
    bet365: 'Full Time Result - Away',
    stake: 'Match Winner - 2',
    betway: '2 (Away)'
  },
  DRAW: {
    deeppredict: 'Draw (X)',
    sportybet: 'X',
    bet9ja: 'X',
    '1xbet': 'X (Draw)',
    betking: 'X',
    bet365: 'Full Time Result - Draw',
    stake: 'Match Winner - X',
    betway: 'X (Draw)'
  },
  OVER_1_5: {
    deeppredict: 'Over 1.5 Goals',
    sportybet: 'Over 1.5',
    bet9ja: 'O1.5',
    '1xbet': 'Total Over (1.5)',
    betking: 'Goals Over 1.5',
    bet365: 'Over 1.5 Goals',
    stake: 'Total - Over 1.5',
    betway: 'Over 1.5'
  },
  OVER_2_5: {
    deeppredict: 'Over 2.5 Goals',
    sportybet: 'Over 2.5',
    bet9ja: 'O2.5',
    '1xbet': 'Total Over (2.5)',
    betking: 'Goals Over 2.5',
    bet365: 'Over 2.5 Goals',
    stake: 'Total - Over 2.5',
    betway: 'Over 2.5'
  },
  UNDER_2_5: {
    deeppredict: 'Under 2.5 Goals',
    sportybet: 'Under 2.5',
    bet9ja: 'U2.5',
    '1xbet': 'Total Under (2.5)',
    betking: 'Goals Under 2.5',
    bet365: 'Under 2.5 Goals',
    stake: 'Total - Under 2.5',
    betway: 'Under 2.5'
  },
  UNDER_3_5: {
    deeppredict: 'Under 3.5 Goals',
    sportybet: 'Under 3.5',
    bet9ja: 'U3.5',
    '1xbet': 'Total Under (3.5)',
    betking: 'Goals Under 3.5',
    bet365: 'Under 3.5 Goals',
    stake: 'Total - Under 3.5',
    betway: 'Under 3.5'
  },
  BTTS_YES: {
    deeppredict: 'Both Teams To Score (BTTS)',
    sportybet: 'GG',
    bet9ja: 'GG/NG - GG',
    '1xbet': 'Both Teams To Score - Yes',
    betking: 'BTTS - Yes',
    bet365: 'Both Teams to Score - Yes',
    stake: 'Both Teams To Score - Yes',
    betway: 'BTTS - Yes'
  },
  BTTS_NO: {
    deeppredict: 'BTTS - No',
    sportybet: 'NG',
    bet9ja: 'GG/NG - NG',
    '1xbet': 'Both Teams To Score - No',
    betking: 'BTTS - No',
    bet365: 'Both Teams to Score - No',
    stake: 'Both Teams To Score - No',
    betway: 'BTTS - No'
  },
  DOUBLE_CHANCE_1X: {
    deeppredict: 'Double Chance (1X)',
    sportybet: '1X',
    bet9ja: '1X',
    '1xbet': 'Double Chance 1X',
    betking: '1X',
    bet365: 'Double Chance - 1X',
    stake: 'Double Chance - 1X',
    betway: '1X'
  },
  DOUBLE_CHANCE_X2: {
    deeppredict: 'Double Chance (X2)',
    sportybet: 'X2',
    bet9ja: 'X2',
    '1xbet': 'Double Chance X2',
    betking: 'X2',
    bet365: 'Double Chance - X2',
    stake: 'Double Chance - X2',
    betway: 'X2'
  },
  DRAW_NO_BET_1: {
    deeppredict: 'Draw No Bet (1)',
    sportybet: 'DNB 1',
    bet9ja: 'DNB1',
    '1xbet': 'Draw No Bet 1',
    betking: 'DNB 1',
    bet365: 'Draw No Bet - 1',
    stake: 'Draw No Bet - 1',
    betway: 'DNB 1'
  }
};

export function normalizeMarketPick(marketRaw: string, bookie: string): string {
  const clean = marketRaw.trim().toUpperCase();
  if (clean.includes('HOME') || clean === '1') return 'HOME_WIN';
  if (clean.includes('AWAY') || clean === '2') return 'AWAY_WIN';
  if (clean.includes('DRAW') || clean === 'X') return 'DRAW';
  if (clean.includes('OVER 1.5') || clean === 'O1.5') return 'OVER_1_5';
  if (clean.includes('OVER 2.5') || clean === 'O2.5') return 'OVER_2_5';
  if (clean.includes('UNDER 2.5') || clean === 'U2.5') return 'UNDER_2_5';
  if (clean.includes('UNDER 3.5') || clean === 'U3.5') return 'UNDER_3_5';
  if (clean.includes('GG') || clean.includes('BOTH TEAMS TO SCORE')) return 'BTTS_YES';
  if (clean.includes('NG') || clean.includes('NO BTTS')) return 'BTTS_NO';
  if (clean === '1X' || clean.includes('DOUBLE CHANCE 1X')) return 'DOUBLE_CHANCE_1X';
  if (clean === 'X2' || clean.includes('DOUBLE CHANCE X2')) return 'DOUBLE_CHANCE_X2';
  if (clean.includes('DNB 1') || clean.includes('DNB1')) return 'DRAW_NO_BET_1';
  return 'HOME_WIN';
}

export function translateMarketPick(normalizedKey: string, targetBookie: string): string {
  const cleanBookie = targetBookie.split(':')[0].toLowerCase();
  const table = MARKET_TRANSLATION_TABLE[normalizedKey];
  if (table && table[cleanBookie]) {
    return table[cleanBookie];
  }
  if (table && table['deeppredict']) {
    return table['deeppredict'];
  }
  return normalizedKey;
}
