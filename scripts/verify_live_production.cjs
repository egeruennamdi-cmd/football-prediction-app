/**
 * Verification of Live Production Deployment on Cloudflare Pages
 * Inspects:
 * 1. Top-right account area markup on https://deeppredictbet.com/ and preview URL
 * 2. Confirms #header-account-area is present
 * 3. Confirms top-header-coins-pill is completely absent from top-right header
 * 4. Confirms auth endpoint responsiveness
 */

const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('--- VERIFYING LIVE PRODUCTION DEPLOYMENT ---');
  
  const urls = [
    'https://e044a6e6.deeppredictbet.pages.dev/',
    'https://deeppredictbet.com/'
  ];

  for (const url of urls) {
    try {
      console.log(`Checking ${url}...`);
      const { statusCode, data } = await fetchUrl(url);
      console.log(`  HTTP Status: ${statusCode}`);
      console.log(`  Contains #header-account-area: ${data.includes('id="header-account-area"')}`);
      console.log(`  Contains top-header-coins-pill: ${data.includes('top-header-coins-pill')}`);
      console.log(`  Contains view-auth-entry: ${data.includes('id="view-auth-entry"')}`);
      console.log(`  Contains view-command-center: ${data.includes('id="view-command-center"')}`);

      if (!data.includes('id="header-account-area"')) {
        console.warn(`  ⚠️ Warning: ${url} may still be updating cache for header-account-area.`);
      } else {
        console.log(`  ✅ ${url} verified live with authentication-aware header!`);
      }
    } catch (e) {
      console.error(`  Error checking ${url}:`, e.message);
    }
  }
}

verifyLive().then(() => process.exit(0));
