/**
 * scripts/verify_production_login_page.cjs
 * Live Production Verification for DeepPredictBet Premium Cinematic Stadium Login Page
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
        'User-Agent': 'Mozilla/5.0 DeepPredictBetLiveAuthAudit'
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
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          bodyText: buffer.toString('utf8'),
          byteLength: buffer.length
        });
      });
    }).on('error', reject);
  });
}

async function verify() {
  console.log('🔍 Starting Live Production Verification on https://deeppredictbet.com...\n');
  const baseUrl = 'https://deeppredictbet.com';

  // 1. Verify CSS Asset
  console.log('1. Checking /css/authEntry.css ...');
  const cssRes = await fetchUrl(`${baseUrl}/css/authEntry.css`);
  console.log(`   [HTTP ${cssRes.status}] Size: ${cssRes.byteLength} bytes`);
  assert.strictEqual(cssRes.status, 200, 'authEntry.css must return 200');
  assert.ok(cssRes.bodyText.includes('.auth-cinematic-page'), 'Must contain .auth-cinematic-page');
  assert.ok(cssRes.bodyText.includes('.auth-glass-panel'), 'Must contain .auth-glass-panel');
  assert.ok(cssRes.bodyText.includes('.auth-18plus-badge'), 'Must contain .auth-18plus-badge');

  // 2. Verify JS Controller
  console.log('2. Checking /js/authEntry.js ...');
  const jsRes = await fetchUrl(`${baseUrl}/js/authEntry.js`);
  console.log(`   [HTTP ${jsRes.status}] Size: ${jsRes.byteLength} bytes`);
  assert.strictEqual(jsRes.status, 200, 'authEntry.js must return 200');
  assert.ok(jsRes.bodyText.includes('handleAuthEntryLogin'), 'Must define handleAuthEntryLogin');
  assert.ok(jsRes.bodyText.includes('switchAuthEntryTab'), 'Must define switchAuthEntryTab');

  // 3. Verify Background Stadium Asset
  console.log('3. Checking /assets/auth-stadium-bg.webp ...');
  const imgRes = await fetchUrl(`${baseUrl}/assets/auth-stadium-bg.webp`);
  console.log(`   [HTTP ${imgRes.status}] Size: ${imgRes.byteLength} bytes`);
  assert.strictEqual(imgRes.status, 200, 'auth-stadium-bg.webp must return 200');
  assert.ok(imgRes.byteLength > 40000, 'Image size must be valid (> 40 KB)');

  // 4. Verify Main Landing Page
  console.log('4. Checking Main Entry Page / ...');
  const pageRes = await fetchUrl(`${baseUrl}/`);
  console.log(`   [HTTP ${pageRes.status}] Size: ${pageRes.byteLength} bytes`);
  assert.strictEqual(pageRes.status, 200, 'Root / must return 200');

  // Verify view container
  assert.ok(pageRes.bodyText.includes('id="view-auth-entry"'), 'Must contain id="view-auth-entry"');
  assert.ok(pageRes.bodyText.includes('auth-cinematic-page'), 'Must contain auth-cinematic-page class');

  // Verify branding & tagline
  assert.ok(pageRes.bodyText.includes('logo-3d.png'), 'Must reference logo-3d.png');
  assert.ok(pageRes.bodyText.includes('AI-POWERED FOOTBALL PREDICTIONS'), 'Must display tagline');

  // Verify Login form & elements
  assert.ok(pageRes.bodyText.includes('Welcome Back'), 'Must have Welcome Back heading');
  assert.ok(pageRes.bodyText.includes('Log in to your DeepPredictBet account'), 'Must have login subtitle');
  assert.ok(pageRes.bodyText.includes('id="auth-entry-identifier"'), 'Must have identifier input');
  assert.ok(pageRes.bodyText.includes('id="auth-entry-password"'), 'Must have password input');
  assert.ok(pageRes.bodyText.includes('Sign In to DeepPredictBet'), 'Must have Sign In button');

  // Verify Feature cards
  assert.ok(pageRes.bodyText.includes('AI Predictions'), 'Must include AI Predictions feature card');
  assert.ok(pageRes.bodyText.includes('Live Matches'), 'Must include Live Matches feature card');
  assert.ok(pageRes.bodyText.includes('League Standings'), 'Must include League Standings feature card');
  assert.ok(pageRes.bodyText.includes('Audited Results'), 'Must include Audited Results feature card');

  // Verify Trust strip
  assert.ok(pageRes.bodyText.includes('Accurate Predictions'), 'Must have Accurate Predictions in trust strip');
  assert.ok(pageRes.bodyText.includes('Real-Time Updates'), 'Must have Real-Time Updates in trust strip');
  assert.ok(pageRes.bodyText.includes('Trusted Results'), 'Must have Trusted Results in trust strip');

  // Verify 18+ Badge
  assert.ok(pageRes.bodyText.includes('auth-18plus-badge'), 'Must have auth-18plus-badge element');
  assert.ok(pageRes.bodyText.includes('href="/responsible-gambling"'), 'Must link to /responsible-gambling');

  // Verify script tags
  assert.ok(pageRes.bodyText.includes('/js/authEntry.js'), 'Must load /js/authEntry.js');
  assert.ok(pageRes.bodyText.includes('/css/authEntry.css'), 'Must load /css/authEntry.css');

  console.log('\n==================================================');
  console.log('🎉 LIVE PRODUCTION VERIFICATION COMPLETE: ALL PASS!');
  console.log('==================================================\n');
}

verify().catch(err => {
  console.error('❌ Live production verification failed:', err);
  process.exit(1);
});
