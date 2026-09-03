import { IBookmakerConnector, RawSelection, CouponRegistrationResult } from './connector.interface';
import { normalizeMarketPick, translateMarketPick } from '../mapper';

export class SportyBetConnector implements IBookmakerConnector {
  public bookieKey = 'sportybet';
  public bookieName = 'SportyBet';
  public defaultPrefix = 'SB';

  public async fetchSourceCoupon(code: string): Promise<RawSelection[]> {
    return [
      { match: 'Arsenal vs Chelsea', homeTeam: 'Arsenal', awayTeam: 'Chelsea', marketRaw: '1', odds: 1.85 },
      { match: 'Barcelona vs Real Madrid', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', marketRaw: 'Over 2.5', odds: 1.68 },
      { match: 'Inter Milan vs AC Milan', homeTeam: 'Inter Milan', awayTeam: 'AC Milan', marketRaw: '1X', odds: 1.35 }
    ];
  }

  public async createTargetCoupon(selections: RawSelection[], targetBookie: string): Promise<CouponRegistrationResult> {
    const cleanCode = targetBookie.split(':')[0].toLowerCase();
    
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let hash = "";
    for (let i = 0; i < 5; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const targetCode = `SB-${hash}`;

    const converted = selections.map(s => {
      const normKey = normalizeMarketPick(s.marketRaw, 'sportybet');
      const targetPick = translateMarketPick(normKey, cleanCode);
      return {
        match: s.match,
        originalPick: s.marketRaw,
        targetPick,
        odds: s.odds
      };
    });

    const totalOdds = parseFloat(converted.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2));
    const directUrl = `https://www.sportybet.com/?shareCode=${targetCode}`;

    return {
      success: true,
      targetCode,
      directUrl,
      totalOdds,
      selections: converted
    };
  }
}
