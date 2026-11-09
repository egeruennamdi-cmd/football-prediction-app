const https = require('https');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- Verifying Cloudflare Pages: https://deeppredictbet.pages.dev ---');
  const resHtml = await get('https://deeppredictbet.pages.dev/');
  console.log('Status:', resHtml.status);
  console.log('index.html contains v=20261110_tg_fan_arena_v2:', resHtml.data.includes('v=20261110_tg_fan_arena_v2'));

  const resJs = await get('https://deeppredictbet.pages.dev/js/telegramPublisher.js?v=20261110_tg_fan_arena_v2');
  console.log('telegramPublisher.js size:', resJs.data.length);
  console.log('Has data-tab="fan-arena":', resJs.data.includes('data-tab="fan-arena"'));
  console.log('Has renderFanArenaTab:', resJs.data.includes('renderFanArenaTab'));
  console.log('Has Fan Arena Community Polls:', resJs.data.includes('Fan Arena Community Polls'));
  console.log('Has "Fan Arena Cards" label:', resJs.data.includes('Fan Arena Cards'));

  console.log('\n--- Verifying Custom Domain: https://deeppredictbet.com ---');
  const prodHtml = await get('https://deeppredictbet.com/');
  console.log('deeppredictbet.com index.html has new script version:', prodHtml.data.includes('v=20261110_tg_fan_arena_v2'));

  const prodJs = await get('https://deeppredictbet.com/js/telegramPublisher.js?v=20261110_tg_fan_arena_v2');
  console.log('deeppredictbet.com telegramPublisher.js size:', prodJs.data.length);
  console.log('deeppredictbet.com Has data-tab="fan-arena":', prodJs.data.includes('data-tab="fan-arena"'));
  console.log('deeppredictbet.com Has renderFanArenaTab:', prodJs.data.includes('renderFanArenaTab'));
}

verify().catch(console.error);
