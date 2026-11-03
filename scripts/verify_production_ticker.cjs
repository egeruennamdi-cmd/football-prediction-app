const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 DeepPredictBet-Verifier/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', err => reject(err));
  });
}

async function run() {
  console.log('================================================================');
  console.log('🌐 LIVE PRODUCTION VERIFICATION FOR HOT TRENDS TICKER');
  console.log('================================================================');

  const targets = [
    { name: 'Production Domain', url: 'https://deeppredictbet.com/' },
    { name: 'Cloudflare Pages Deployment', url: 'https://b7633b41.deeppredictbet.pages.dev/' }
  ];

  for (const target of targets) {
    console.log(`\nTesting ${target.name}: ${target.url}`);
    try {
      const res = await fetchUrl(target.url);
      console.log(`  HTTP Status: ${res.status}`);

      if (res.status !== 200) {
        console.error(`  FAIL: Unexpected status code ${res.status}`);
        continue;
      }

      // Check ticker container
      const hasTickerContainer = res.body.includes('id="trends-ticker-container"');
      console.log(`  Ticker container exists: ${hasTickerContainer}`);

      // Check height: 28px
      const hasHeight28 = res.body.includes('height: 28px');
      console.log(`  Container upgraded to height: 28px: ${hasHeight28}`);

      // Check ticker items and badges
      const hasTickerItem = res.body.includes('class="ticker-item"');
      const hasTitleShowdown = res.body.includes('TITLE SHOWDOWN');
      const hasElClasico = res.body.includes('EL CLÁSICO');
      const hasDerbyMadonnina = res.body.includes('DERBY DELLA MADONNINA');
      console.log(`  Structured .ticker-item markup present: ${hasTickerItem}`);
      console.log(`  Headline TITLE SHOWDOWN present: ${hasTitleShowdown}`);
      console.log(`  Headline EL CLÁSICO present: ${hasElClasico}`);
      console.log(`  Headline DERBY DELLA MADONNINA present: ${hasDerbyMadonnina}`);

      // Check that authentic crest images are present
      const hasCrests = res.body.includes('img src="https://media.api-sports.io/football/teams/');
      console.log(`  Authentic club crest images present: ${hasCrests}`);

      // Check that NO raw URLs leak into visible text in the ticker section
      const tickerStart = res.body.indexOf('id="trends-ticker-container"');
      const tickerEnd = res.body.indexOf('<!-- --- DEEPPREDICTBET COMMAND CENTER SECTION --- -->', tickerStart);
      if (tickerStart !== -1 && tickerEnd !== -1) {
        const tickerHtml = res.body.slice(tickerStart, tickerEnd);
        const textOnly = tickerHtml.replace(/<[^>]+>/g, ' ');
        const hasRawUrlText = /https?:\/\//i.test(textOnly) || /api-sports\.io/i.test(textOnly) || /\.png\b/i.test(textOnly);
        console.log(`  Raw URL leaked in visible ticker text: ${hasRawUrlText}`);
        if (hasRawUrlText) {
          console.error('  FAIL: Raw URL visible as text!');
        } else {
          console.log('  PASS: Zero raw image URLs as visible text.');
        }
      }

    } catch (e) {
      console.error(`  Error connecting to ${target.url}:`, e.message);
    }
  }

  // Also verify production JS bundles contain the new engine
  console.log('\n--- Verifying Production JS Bundles ---');
  try {
    const jsRes = await fetchUrl('https://deeppredictbet.com/js/ui.js');
    console.log(`  GET /js/ui.js HTTP Status: ${jsRes.status}`);
    const hasEngine = jsRes.body.includes('HOT TRENDS TICKER ENGINE');
    console.log(`  /js/ui.js contains new HOT TRENDS TICKER ENGINE: ${hasEngine}`);
  } catch (e) {
    console.error('  Error fetching /js/ui.js:', e.message);
  }

  console.log('================================================================');
  console.log('🏁 PRODUCTION VERIFICATION COMPLETE');
  console.log('================================================================');
}

run();
