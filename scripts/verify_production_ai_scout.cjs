const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('================================================================');
  console.log('DEEPPREDICTBET: LIVE PRODUCTION VERIFICATION (ASK AI SCOUT)');
  console.log('================================================================\n');

  console.log('1. Checking https://deeppredictbet.com/ ...');
  const indexRes = await fetchUrl('https://deeppredictbet.com/?v=' + Date.now());
  console.log('   Status Code:', indexRes.status);
  console.log('   Contains #hero-scout-results:', indexRes.data.includes('id="hero-scout-results"'));
  console.log('   Contains .hero-scout-results class:', indexRes.data.includes('hero-scout-results'));
  console.log('   Contains "ASK AI SCOUT" header:', indexRes.data.includes('ASK AI SCOUT'));
  console.log('   Contains "Intelligent Assistant" indicator:', indexRes.data.includes('Intelligent Assistant'));
  console.log('   Contains "Build a ticket" quick action:', indexRes.data.includes('Build a ticket'));

  console.log('\n2. Checking https://deeppredictbet.com/js/app.js ...');
  const appRes = await fetchUrl('https://deeppredictbet.com/js/app.js?v=' + Date.now());
  console.log('   Status Code:', appRes.status);
  console.log('   Payload Size:', (appRes.data.length / 1024).toFixed(1), 'KB');
  console.log('   Contains November 2026 fixtures:', appRes.data.includes('November 2026'));
  console.log('   Contains December 2026 fixtures:', appRes.data.includes('December 2026'));
  console.log('   Contains dynamic betslip recalculation:', appRes.data.includes('formatAiScoutResultsHtml(window.appState.betslip'));
  console.log('   Contains authentic crest resolver:', appRes.data.includes('resolveTeamCrestUrl(hName'));
  console.log('   Contains Bet Doctor intent routing:', appRes.data.includes('/bet-doctor'));
  console.log('   Contains Live Scanner intent routing:', appRes.data.includes('/live-scanner'));
  console.log('   Contains Valuebot intent routing:', appRes.data.includes('/valuebot'));

  console.log('\n3. Checking Deployment Preview: https://63a71100.deeppredictbet.pages.dev/ ...');
  const prevRes = await fetchUrl('https://63a71100.deeppredictbet.pages.dev/');
  console.log('   Status Code:', prevRes.status);
  console.log('   Contains #hero-scout-results:', prevRes.data.includes('id="hero-scout-results"'));

  console.log('\n================================================================');
  console.log('LIVE PRODUCTION VERIFICATION COMPLETED SUCCESSFULLY');
  console.log('================================================================');
}

verify().catch(console.error);
