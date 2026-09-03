export interface AuditRequest {
  bookingCode: string;
  sourceBookie: string;
}

export class DoctorService {
  public async auditTicket(req: AuditRequest) {
    const { bookingCode, sourceBookie } = req;
    const isRiskCode = bookingCode.toUpperCase().includes('RISK');

    const healthScore = isRiskCode ? 58 : 88;

    return {
      success: true,
      bookingCode,
      sourceBookie,
      ticketHealthScore: healthScore,
      status: healthScore >= 80 ? 'SAFE' : 'CRITICAL_TRAP_DETECTED',
      rawProbability: isRiskCode ? 34.2 : 78.4,
      diagnostics: [
        {
          match: 'Arsenal vs Chelsea',
          pick: 'Over 2.5 Goals',
          status: 'SAFE',
          probability: 84,
          rationale: 'Both teams scored 2.4 avg goals in last 6 home/away matches.'
        },
        {
          match: 'Barcelona vs Real Madrid',
          pick: isRiskCode ? 'Away Win (2) - TRAP PICK' : 'Double Chance X2',
          status: isRiskCode ? 'TRAP_MATCH' : 'SAFE',
          probability: isRiskCode ? 42 : 88,
          rationale: isRiskCode ? 'Real Madrid missing key players; Barcelona unbeaten at Camp Nou.' : 'Double chance covers Barcelona home advantage.'
        }
      ],
      prescriptions: isRiskCode ? [
        'Replace Barca vs Real Madrid [Away Win] with [Double Chance X2] (+28% Win Rate)',
        'Lower Bayern vs Dortmund [Over 3.5] with [Over 2.5 Goals] (+21% Win Rate)'
      ] : []
    };
  }
}
