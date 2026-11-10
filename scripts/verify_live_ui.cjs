const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function checkUi() {
  const css = await get('https://deeppredictbet.com/css/main.css');
  console.log('1. Live Production Mobile Header CSS:');
  console.log('   - Has header-user-identity max-width: 110px:', css.data.includes('max-width: 110px !important'));
  console.log('   - Has header-logout-btn flex-shrink: 0:', css.data.includes('flex-shrink: 0 !important'));
  console.log('   - Has safe-area-inset-right:', css.data.includes('env(safe-area-inset-right)'));

  const js = await get('https://deeppredictbet.com/js/pages.js');
  console.log('2. Live Production Match Detail Button:');
  console.log('   - Has "Add to Slip":', js.data.includes('Add to Slip'));
  console.log('   - Has addMatchToSlip function:', js.data.includes('function addMatchToSlip'));
  console.log('   - Has "Add to Bet Generator":', js.data.includes('Add to Bet Generator'));
}

checkUi().catch(console.error);
