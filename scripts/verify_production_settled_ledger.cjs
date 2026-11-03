/**
 * scripts/verify_production_settled_ledger.cjs
 * Verifies live production Recent Settled Predictions and Prediction Settlement Ledger.
 */

const https = require('https');
const assert = require('assert');

function fetchUrl(urlStr) {
  const parsed = new URL(urlStr);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'Host': parsed.hostname,
        'User-Agent': 'Mozilla/5.0 DeepPredictBetVerification'
      },
      lookup: (hostname, opts, cb) => {
        if (typeof opts === 'function') {
          cb = opts;
          opts = {};
        }
        if (hostname === 'deeppredictbet.com') {
          if (opts && opts.all) {
            return cb(null, [{ address: '104.21.71.157', family: 4 }]);
          }
          return cb(null, '104.21.71.157', 4);
        }
        require('dns').lookup(hostname, opts, cb);
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('🔍 Starting Live Production Verification for Recent Settled Predictions...\n');

  const urls = [
    'https://deeppredictbet.com'
  ];

  for (const baseUrl of urls) {
    console.log(`\n--- Auditing ${baseUrl} ---`);

    // 1. Check predictionLedger.js
    const scriptRes = await fetchUrl(`${baseUrl}/js/predictionLedger.js`);
    console.log(`  [HTTP ${scriptRes.status}] /js/predictionLedger.js size: ${scriptRes.body.length} bytes`);
    assert.strictEqual(scriptRes.status, 200, `${baseUrl}/js/predictionLedger.js must return 200`);
    assert.ok(scriptRes.body.includes('PredictionSettlementLedger'), 'Must contain PredictionSettlementLedger definition');
    assert.ok(scriptRes.body.includes('DP-PRED-20261102-EPL01'), 'Must contain 2 Nov 2026 settlements in script');

    // 2. Check main HTML
    const htmlRes = await fetchUrl(`${baseUrl}/`);
    console.log(`  [HTTP ${htmlRes.status}] Main page HTML size: ${htmlRes.body.length} bytes`);
    assert.strictEqual(htmlRes.status, 200, `${baseUrl}/ must return 200`);

    // Verify predictionLedger script tag
    assert.ok(htmlRes.body.includes('/js/predictionLedger.js'), 'Must contain script tag for predictionLedger.js');

    // Verify recent settled predictions grid exists
    assert.ok(htmlRes.body.includes('id="settled-picks-grid"'), 'Must contain settled-picks-grid container');

    // Verify static / hydrated cards contain 2 Nov 2026 matches
    assert.ok(htmlRes.body.includes('Manchester United'), 'Must include Manchester United in settled cards');
    assert.ok(htmlRes.body.includes('Barcelona'), 'Must include Barcelona in settled cards');
    assert.ok(htmlRes.body.includes('Bayern Munich'), 'Must include Bayern Munich in settled cards');
    assert.ok(htmlRes.body.includes('Bournemouth'), 'Must include Bournemouth in settled cards');

    // Verify authentic crest URLs in img src
    assert.ok(htmlRes.body.includes('/football/teams/33.png'), 'Must contain Manchester United crest image');
    assert.ok(htmlRes.body.includes('/football/teams/49.png'), 'Must contain Chelsea crest image');
    assert.ok(htmlRes.body.includes('/football/teams/529.png'), 'Must contain Barcelona crest image');

    // CRITICAL AUDIT: No raw URL text inside grid
    const settledSection = htmlRes.body.split('id="settled-picks-grid"')[1]?.split('<!-- Footer CTA')[0] || '';
    assert.ok(settledSection.length > 0, 'Must extract settled-picks-grid section');
    const rawUrlRegex = />\s*https?:\/\/[^<]+</i;
    assert.ok(!rawUrlRegex.test(settledSection), 'Grid section must never contain raw URLs inside tags');
    assert.ok(!settledSection.includes('.png</span>'), 'Grid section must never have .png inside text spans');

    console.log(`  ✅ All checks passed for ${baseUrl}`);
  }

  console.log('\n==================================================');
  console.log('🎉 LIVE PRODUCTION VERIFICATION COMPLETE: ALL PASS!');
  console.log('==================================================\n');
}

verify().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
