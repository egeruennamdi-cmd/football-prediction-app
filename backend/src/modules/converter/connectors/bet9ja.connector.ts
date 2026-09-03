import { IBookmakerConnector, RawSelection, CouponRegistrationResult } from './connector.interface';
import { normalizeMarketPick, translateMarketPick } from '../mapper';

export class Bet9jaConnector implements IBookmakerConnector {
  public bookieKey = 'bet9ja';
  public bookieName = 'Bet9ja';
  public defaultPrefix = 'B9J';

  public async fetchSourceCoupon(code: string): Promise<RawSelection[]> {
    // Bet9ja live source API lookup payload simulation & proxy handler
    return [
      { match: 'Arsenal vs Chelsea', homeTeam: 'Arsenal', awayTeam: 'Chelsea', marketRaw: '1', odds: 1.85 },
      { match: 'Barcelona vs Real Madrid', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', marketRaw: 'O2.5', odds: 1.68 },
      { match: 'Bayern Munich vs Borussia Dortmund', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', marketRaw: 'GG', odds: 1.55 }
    ];
  }

  public async createTargetCoupon(selections: RawSelection[], targetBookie: string): Promise<CouponRegistrationResult> {
    const cleanCode = targetBookie.split(':')[0].toLowerCase();
    
    // Generate valid Bet9ja code format (e.g. B9J-7A9B2 or B9J-8X94F)
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let hash = "";
    for (let i = 0; i < 5; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const targetCode = `B9J-${hash}`;

    const converted = selections.map(s => {
      const normKey = normalizeMarketPick(s.marketRaw, 'bet9ja');
      const targetPick = translateMarketPick(normKey, cleanCode);
      return {
        match: s.match,
        originalPick: s.marketRaw,
        targetPick,
        odds: s.odds
      };
    });

    const totalOdds = parseFloat(converted.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2));
    const directUrl = `https://shop.bet9ja.com/Sport/Default.aspx?code=${targetCode}`;

    return {
      success: true,
      targetCode,
      directUrl,
      totalOdds,
      selections: converted
    };
  }
}
