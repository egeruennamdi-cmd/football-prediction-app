/**
 * Universal Market & Team Synonym Mapper
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
  cloudbet: 'CLD',
  betmines: 'BM'
};

export const MARKET_TRANSLATION_TABLE: Record<string, Record<string, string>> = {
  OVER_2_5: {
    sportybet: 'Over 2.5',
    bet9ja: 'O2.5',
    '1xbet': 'Total Over (2.5)',
    betking: 'Goals Over 2.5',
    bet365: 'Over 2.5 Goals',
    stake: 'Total - Over 2.5'
  },
  BTTS_YES: {
    sportybet: 'GG',
    bet9ja: 'GG/NG - GG',
    '1xbet': 'Both Teams To Score - Yes',
    betking: 'BTTS - Yes',
    bet365: 'Both Teams to Score - Yes',
    stake: 'Both Teams To Score - Yes'
  },
  DOUBLE_CHANCE_1X: {
    sportybet: '1X',
    bet9ja: '1X',
    '1xbet': 'Double Chance 1X',
    betking: '1X',
    bet365: 'Double Chance - 1X',
    stake: 'Double Chance - 1X'
  }
};

export function normalizeMarketPick(marketRaw: string, bookie: string): string {
  const clean = marketRaw.trim().toUpperCase();
  if (clean.includes('OVER 2.5') || clean === 'O2.5') return 'OVER_2_5';
  if (clean.includes('GG') || clean.includes('BOTH TEAMS TO SCORE')) return 'BTTS_YES';
  if (clean === '1X' || clean.includes('DOUBLE CHANCE')) return 'DOUBLE_CHANCE_1X';
  return 'MATCH_RESULT_1X2';
}

export function translateMarketPick(normalizedKey: string, targetBookie: string): string {
  const table = MARKET_TRANSLATION_TABLE[normalizedKey];
  if (table && table[targetBookie]) {
    return table[targetBookie];
  }
  return normalizedKey;
}
