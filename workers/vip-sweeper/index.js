/**
 * Cloudflare Scheduled Worker: DeepPredictBet VIP Expiration Sweeper
 * 
 * Runs on a recurring cron schedule (e.g. hourly: "0 * * * *")
 * Invokes the privileged, authenticated /api/integrations/telegram/sweep endpoint on Pages.
 * 
 * Configuration (set in Worker environment variables):
 * - SWEEP_ENDPOINT_URL: "https://deeppredictbet.com/api/integrations/telegram/sweep"
 * - ADMIN_SECRET_KEY: Secret matching Cloudflare Pages ADMIN_SECRET_KEY
 */

export default {
  // 1. Cron Trigger Handler
  async scheduled(event, env, ctx) {
    const sweepUrl = env.SWEEP_ENDPOINT_URL || 'https://deeppredictbet.com/api/integrations/telegram/sweep';
    const adminKey = env.ADMIN_SECRET_KEY || 'deep_admin_78_key';

    try {
      console.log(`[VipSweeperWorker] Starting scheduled VIP sweep at ${new Date().toISOString()}`);

      const res = await fetch(sweepUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey
        },
        body: JSON.stringify({ batchSize: 25 })
      });

      const data = await res.json();
      console.log('[VipSweeperWorker] Sweep completed with result:', JSON.stringify(data));
    } catch (err) {
      console.error('[VipSweeperWorker] Sweep execution error:', err.message);
    }
  },

  // 2. Manual HTTP trigger for diagnostic testing
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/trigger' && request.method === 'POST') {
      const sweepUrl = env.SWEEP_ENDPOINT_URL || 'https://deeppredictbet.com/api/integrations/telegram/sweep';
      const adminKey = env.ADMIN_SECRET_KEY || 'deep_admin_78_key';

      const res = await fetch(sweepUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey
        },
        body: JSON.stringify({ batchSize: 25 })
      });

      return new Response(await res.text(), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('DeepPredict VIP Sweeper Worker active.', { status: 200 });
  }
};
