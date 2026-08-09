export interface RawSelection {
  match: string;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  marketRaw: string;
  odds: number;
}

export interface CouponRegistrationResult {
  success: boolean;
  targetCode: string;
  directUrl: string;
  totalOdds: number;
  selections: Array<{
    match: string;
    originalPick: string;
    targetPick: string;
    odds: number;
  }>;
}

export interface IBookmakerConnector {
  bookieKey: string;
  bookieName: string;
  defaultPrefix: string;
  
  fetchSourceCoupon(code: string): Promise<RawSelection[]>;
  createTargetCoupon(selections: RawSelection[], targetBookie: string): Promise<CouponRegistrationResult>;
}
