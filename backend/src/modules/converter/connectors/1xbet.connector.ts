import { IBookmakerConnector, RawSelection, CouponRegistrationResult } from './connector.interface';
import { normalizeMarketPick, translateMarketPick } from '../mapper';

export class OneXBetConnector implements IBookmakerConnector {
  public bookieKey = '1xbet';
  public bookieName = '1xBet';
  public defaultPrefix = '1XB';

  public async fetchSourceCoupon(code: string): Promise<RawSelection[]> {
    return [
      { match: 'Arsenal vs Chelsea', homeTeam: 'Arsenal', awayTeam: 'Chelsea', marketRaw: '1 (Home Win)', odds: 1.85 },
      { match: 'Barcelona vs Real Madrid', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', marketRaw: 'Total Over (2.5)', odds: 1.68 },
      { match: 'PSG vs Marseille', homeTeam: 'PSG', awayTeam: 'Marseille', marketRaw: 'Both Teams To Score - Yes', odds: 1.60 }
    ];
  }

  public async createTargetCoupon(selections: RawSelection[], targetBookie: string): Promise<CouponRegistrationResult> {
    const cleanCode = targetBookie.split(':')[0].toLowerCase();
    
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let hash = "";
    for (let i = 0; i < 5; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const targetCode = `1XB-${hash}`;

    const converted = selections.map(s => {
      const normKey = normalizeMarketPick(s.marketRaw, '1xbet');
      const targetPick = translateMarketPick(normKey, cleanCode);
      return {
        match: s.match,
        originalPick: s.marketRaw,
        targetPick,
        odds: s.odds
      };
    });

    const totalOdds = parseFloat(converted.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2));
    const directUrl = `https://1xbet.com/coupon/${targetCode}`;

    return {
      success: true,
      targetCode,
      directUrl,
      totalOdds,
      selections: converted
    };
  }
}
