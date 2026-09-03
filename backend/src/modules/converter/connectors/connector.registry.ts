import { IBookmakerConnector, RawSelection, CouponRegistrationResult } from './connector.interface';
import { Bet9jaConnector } from './bet9ja.connector';
import { SportyBetConnector } from './sportybet.connector';
import { OneXBetConnector } from './1xbet.connector';
import { BOOKMAKER_PREFIX_MAP, normalizeMarketPick, translateMarketPick } from '../mapper';

export class DefaultGenericConnector implements IBookmakerConnector {
  public bookieKey: string;
  public bookieName: string;
  public defaultPrefix: string;

  constructor(bookieKey: string) {
    this.bookieKey = bookieKey;
    this.bookieName = bookieKey.toUpperCase();
    this.defaultPrefix = BOOKMAKER_PREFIX_MAP[bookieKey] || 'DPB';
  }

  public async fetchSourceCoupon(code: string): Promise<RawSelection[]> {
    return [
      { match: 'Arsenal vs Chelsea', homeTeam: 'Arsenal', awayTeam: 'Chelsea', marketRaw: 'Home Win (1)', odds: 1.85 },
      { match: 'Barcelona vs Real Madrid', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', marketRaw: 'Over 2.5', odds: 1.68 },
      { match: 'Bayern Munich vs Borussia Dortmund', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', marketRaw: 'Both Teams To Score (BTTS)', odds: 1.55 }
    ];
  }

  public async createTargetCoupon(selections: RawSelection[], targetBookie: string): Promise<CouponRegistrationResult> {
    const cleanTarget = targetBookie.split(':')[0].toLowerCase();
    const prefix = BOOKMAKER_PREFIX_MAP[cleanTarget] || this.defaultPrefix;

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let hash = "";
    for (let i = 0; i < 5; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const targetCode = `${prefix}-${hash}`;

    const converted = selections.map(s => {
      const normKey = normalizeMarketPick(s.marketRaw, this.bookieKey);
      const targetPick = translateMarketPick(normKey, cleanTarget);
      return {
        match: s.match,
        originalPick: s.marketRaw,
        targetPick,
        odds: s.odds
      };
    });

    const totalOdds = parseFloat(converted.reduce((acc, curr) => acc * curr.odds, 1).toFixed(2));
    const directUrl = `https://deeppredictbet.com/#converter?target=${targetBookie}&code=${targetCode}`;

    return {
      success: true,
      targetCode,
      directUrl,
      totalOdds,
      selections: converted
    };
  }
}

export class ConnectorRegistry {
  private static registry: Map<string, IBookmakerConnector> = new Map();

  public static initialize() {
    const bet9ja = new Bet9jaConnector();
    const sportybet = new SportyBetConnector();
    const onexbet = new OneXBetConnector();

    this.registry.set('bet9ja', bet9ja);
    this.registry.set('sportybet', sportybet);
    this.registry.set('1xbet', onexbet);
    this.registry.set('1xbit', onexbet);
    this.registry.set('22bet', onexbet);
    this.registry.set('melbet', onexbet);
    this.registry.set('megapari', onexbet);
  }

  public static getConnector(bookieKey: string): IBookmakerConnector {
    if (this.registry.size === 0) {
      this.initialize();
    }
    const clean = bookieKey.split(':')[0].toLowerCase();
    if (this.registry.has(clean)) {
      return this.registry.get(clean)!;
    }
    return new DefaultGenericConnector(clean);
  }
}
