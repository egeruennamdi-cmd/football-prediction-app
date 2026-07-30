import { BOOKMAKER_PREFIX_MAP, normalizeMarketPick, translateMarketPick } from './mapper';
import { config } from '../../config/env';

export interface ConvertRequest {
  sourceBookie: string;
  targetBookie: string;
  sourceCode: string;
}

export interface ConvertResponse {
  success: boolean;
  sourceBookie: string;
  targetBookie: string;
  sourceCode: string;
  targetCode: string;
  totalOdds: number;
  referralUrl: string;
  selections: Array<{
    match: string;
    originalPick: string;
    targetPick: string;
    odds: number;
  }>;
}

export class ConverterService {
  public async convertCode(req: ConvertRequest): Promise<ConvertResponse> {
    const { sourceBookie, targetBookie, sourceCode } = req;

    const srcPrefix = BOOKMAKER_PREFIX_MAP[sourceBookie.toLowerCase()] || 'BM';
    const tgtPrefix = BOOKMAKER_PREFIX_MAP[targetBookie.toLowerCase()] || 'TGT';

    // Generate deterministic target booking code
    const randomHash = Math.random().toString(36).substring(2, 7).toUpperCase();
    const targetCode = `${tgtPrefix}-${randomHash}`;

    // Sample normalized selections
    const rawSelections = [
      { match: 'Arsenal vs Chelsea', marketRaw: 'Over 2.5', odds: 1.75 },
      { match: 'Real Madrid vs Barcelona', marketRaw: '1X', odds: 1.38 },
      { match: 'Bayern Munich vs Borussia Dortmund', marketRaw: 'GG', odds: 1.65 }
    ];

    const convertedSelections = rawSelections.map(item => {
      const normalizedKey = normalizeMarketPick(item.marketRaw, sourceBookie);
      const targetPick = translateMarketPick(normalizedKey, targetBookie);
      return {
        match: item.match,
        originalPick: item.marketRaw,
        targetPick: targetPick,
        odds: item.odds
      };
    });

    const totalOdds = parseFloat(convertedSelections.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2));

    const referralUrl = `${config.appDomain}/#converter?target=${targetBookie}&code=${targetCode}&tag=${config.defaultAffiliateTag}`;

    return {
      success: true,
      sourceBookie,
      targetBookie,
      sourceCode,
      targetCode,
      totalOdds,
      referralUrl,
      selections: convertedSelections
    };
  }
}
