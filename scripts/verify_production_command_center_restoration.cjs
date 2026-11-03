/**
 * scripts/verify_production_command_center_restoration.cjs
 * Probes the live production Cloudflare Pages deployment to ensure:
 * 1. Command Center and Founder Analytics are separated in production assets
 * 2. router.js contains the corrected routing logic without the disruptive '/' intercept
 * 3. Both view-command-center and view-founder-analytics DOM nodes are intact
 */

const https = require('https');
const assert = require('assert');

const PRODUCTION_URL = 'https://deeppredictbet.com';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function verifyProduction() {
  console.log(`🔍 Starting Live Production Verification on ${PRODUCTION_URL}...\n`);

  // 1. Check router.js
  console.log('1. Checking /js/router.js ...');
  const routerRes = await fetchUrl(`${PRODUCTION_URL}/js/router.js`);
  console.log(`   [HTTP ${routerRes.status}] Size: ${routerRes.body.length} bytes`);
  assert.strictEqual(routerRes.status, 200, 'router.js must return HTTP 200');
  
  assert.ok(!routerRes.body.includes("if (path === '/' || path === '/login')"), 'router.js must NOT intercept root "/" to dashboard');
  assert.ok(routerRes.body.includes("if (path === '/login')"), 'router.js must only intercept "/login" for authenticated users');
  assert.ok(routerRes.body.includes("'/command-center':"), 'router.js must contain explicit /command-center route');
  assert.ok(routerRes.body.includes("window.initCommandCenter"), 'router.js must invoke initCommandCenter for Command Center');
  console.log('   ✅ router.js verified with correct separation logic.');

  // 2. Check index.html
  console.log('\n2. Checking Main Page / ...');
  const indexRes = await fetchUrl(`${PRODUCTION_URL}/`);
  console.log(`   [HTTP ${indexRes.status}] Size: ${indexRes.body.length} bytes`);
  assert.strictEqual(indexRes.status, 200, '/ must return HTTP 200');

  assert.ok(indexRes.body.includes('id="view-command-center"'), 'index.html must contain view-command-center');
  assert.ok(indexRes.body.includes('id="view-founder-analytics"'), 'index.html must contain view-founder-analytics');
  assert.ok(indexRes.body.includes('id="command-center-section"'), 'index.html must contain command-center-section');
  assert.ok(indexRes.body.includes('id="trends-ticker-wrapper"'), 'index.html must contain trends-ticker-wrapper');
  assert.ok(indexRes.body.includes('id="prof-founder-console-btn"'), 'index.html must contain prof-founder-console-btn trigger');
  console.log('   ✅ Main Page DOM verified with independent containers for both features.');

  console.log('\n==================================================');
  console.log('🎉 LIVE PRODUCTION VERIFICATION COMPLETE: ALL PASS!');
  console.log('==================================================\n');
}

verifyProduction().catch(err => {
  console.error('\n❌ Production verification failed:');
  console.error(err);
  process.exit(1);
});
