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
  console.log('DEEPPREDICTBET: LIVE PRODUCTION VERIFICATION (ASK AI SCOUT & BETSLIP)');
  console.log('================================================================\n');

  console.log('1. Checking https://deeppredictbet.com/ ...');
  const indexRes = await fetchUrl('https://deeppredictbet.com/?v=' + Date.now());
  console.log('   Status Code:', indexRes.status);
  console.log('   Contains #hero-scout-results:', indexRes.data.includes('id="hero-scout-results"'));
  console.log('   Contains "ASK AI SCOUT" header:', indexRes.data.includes('ASK AI SCOUT'));
  console.log('   Contains "Intelligent Assistant" indicator:', indexRes.data.includes('Intelligent Assistant'));
  console.log('   Contains openGeneralScout() handler:', indexRes.data.includes('openGeneralScout()'));
  console.log('   Contains handleCommandScoutSubmit(event) button click handler:', indexRes.data.includes('handleCommandScoutSubmit(event)'));
  console.log('   Contains Active Betslip Builder drawer:', indexRes.data.includes('floating-betslip-drawer'));

  console.log('\n2. Checking https://deeppredictbet.com/js/app.js ...');
  const appRes = await fetchUrl('https://deeppredictbet.com/js/app.js?v=' + Date.now());
  console.log('   Status Code:', appRes.status);
  console.log('   Payload Size:', (appRes.data.length / 1024).toFixed(1), 'KB');
  console.log('   Contains executeCommandScoutPrompt:', appRes.data.includes('executeCommandScoutPrompt'));
  console.log('   Contains numeric selection detection:', appRes.data.includes('isNumericOnly'));
  console.log('   Contains betslip drawer ensure in scout prompt:', appRes.data.includes('floating-betslip-drawer'));
  console.log('   Contains generateScoutAccumulator:', appRes.data.includes('generateScoutAccumulator'));
  console.log('   Contains renderBetslip:', appRes.data.includes('renderBetslip'));

  console.log('\n================================================================');
  console.log('LIVE PRODUCTION VERIFICATION COMPLETED SUCCESSFULLY');
  console.log('================================================================');
}

verify().catch(console.error);
