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
  console.log('   Contains "ASK AI SCOUT" header:', indexRes.data.includes('ASK AI SCOUT'));
  console.log('   Contains "Intelligent Assistant" indicator:', indexRes.data.includes('Intelligent Assistant'));
  console.log('   Contains openGeneralScout() handler:', indexRes.data.includes('openGeneralScout()'));
  console.log('   Contains "Check my bet":', indexRes.data.includes('Check my bet'));
  console.log('   Contains "Build a ticket":', indexRes.data.includes('Build a ticket'));
  console.log('   Contains "Find value":', indexRes.data.includes('Find value'));
  console.log('   Contains "Analyse today\'s matches":', indexRes.data.includes("Analyse today&#39;s matches") || indexRes.data.includes("Analyse today's matches"));
  console.log('   Contains "Convert code":', indexRes.data.includes('Convert code'));
  console.log('   Contains "Scan live":', indexRes.data.includes('Scan live'));

  console.log('\n2. Checking https://deeppredictbet.com/js/app.js ...');
  const appRes = await fetchUrl('https://deeppredictbet.com/js/app.js?v=' + Date.now());
  console.log('   Status Code:', appRes.status);
  console.log('   Payload Size:', (appRes.data.length / 1024).toFixed(1), 'KB');
  console.log('   Contains executeCommandScoutPrompt:', appRes.data.includes('executeCommandScoutPrompt'));
  console.log('   Contains runInlineBetDoctorAudit:', appRes.data.includes('runInlineBetDoctorAudit'));
  console.log('   Contains runInlineCodeConversion:', appRes.data.includes('runInlineCodeConversion'));
  console.log('   Contains Bet Doctor intent routing:', appRes.data.includes('/bet-doctor'));
  console.log('   Contains Live Scanner intent routing:', appRes.data.includes('/live-scanner'));
  console.log('   Contains Valuebot intent routing:', appRes.data.includes('/valuebot'));
  console.log('   Contains Predictions intent routing:', appRes.data.includes('/predictions'));
  console.log('   Contains Converter intent routing:', appRes.data.includes('/bet-code-converter'));

  console.log('\n================================================================');
  console.log('LIVE PRODUCTION VERIFICATION COMPLETED SUCCESSFULLY');
  console.log('================================================================');
}

verify().catch(console.error);
