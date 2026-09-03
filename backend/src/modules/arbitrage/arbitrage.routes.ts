import { Router, Request, Response } from 'express';

const router = Router();

router.get('/scan', (req: Request, res: Response) => {
  const minRoi = parseFloat(req.query.minRoi as string || '4.0');
  const totalStake = parseFloat(req.query.totalStake as string || '100');

  const deals = [
    {
      id: 'arb-1',
      match: 'Arsenal vs Chelsea',
      league: 'Premier League',
      market: 'Over / Under 2.5 Goals',
      roi: 7.4,
      leg1: { bookie: 'SportyBet', selection: 'Over 2.5', odds: 2.15 },
      leg2: { bookie: 'Bet365', selection: 'Under 2.5', odds: 2.05 }
    },
    {
      id: 'arb-2',
      match: 'Barcelona vs Real Madrid',
      league: 'La Liga',
      market: '1X2 Match Result',
      roi: 5.8,
      leg1: { bookie: '1xBet', selection: 'Barcelona Win (1)', odds: 2.45 },
      leg2: { bookie: 'Bet9ja', selection: 'Draw or Real Madrid (X2)', odds: 1.85 }
    }
  ].filter(d => d.roi >= minRoi);

  res.status(200).json({
    success: true,
    totalBudget: totalStake,
    minRoiThreshold: minRoi,
    dealsCount: deals.length,
    deals
  });
});

export default router;
