import { ConnectorRegistry } from './connectors/connector.registry';
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
  engineVersion: string;
  selections: Array<{
    match: string;
    originalPick: string;
    targetPick: string;
    odds: number;
  }>;
}

export class ConverterService {
  /**
   * 3-Stage DeepPredictBet Live API Connector Engine
   * 1. Source Parser Worker: Fetches raw selections from Source Bookmaker API
   * 2. DeepPredict Universal Normalizer: Standardizes market picks & odds
   * 3. Target Slip Builder: Dispatches payload to Target Bookmaker API to issue live valid booking code
   */
  public async convertCode(req: ConvertRequest): Promise<ConvertResponse> {
    const { sourceBookie, targetBookie, sourceCode } = req;

    const sourceConnector = ConnectorRegistry.getConnector(sourceBookie);
    const targetConnector = ConnectorRegistry.getConnector(targetBookie);

    // 1. Fetch raw selections from source connector API
    const rawSelections = await sourceConnector.fetchSourceCoupon(sourceCode);

    // 2. Build live target coupon via target connector API
    const targetResult = await targetConnector.createTargetCoupon(rawSelections, targetBookie);

    const referralUrl = `https://deeppredictbet.com/#converter?target=${targetBookie}&code=${targetResult.targetCode}&tag=${config.defaultAffiliateTag}`;

    return {
      success: true,
      sourceBookie,
      targetBookie,
      sourceCode: sourceCode.toUpperCase(),
      targetCode: targetResult.targetCode,
      totalOdds: targetResult.totalOdds,
      referralUrl,
      engineVersion: 'DeepPredictBet Live Connector Engine v3.5 (50 Bookies Active)',
      selections: targetResult.selections
    };
  }
}
