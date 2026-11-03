const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DeepPredictBet-Test/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function verifyProduction() {
  console.log('--- Verifying Production Deployment on deeppredictbet.com ---\n');

  // 1. Verify /js/standingsEngine.js
  const scriptRes = await fetchUrl('https://deeppredictbet.com/js/standingsEngine.js');
  console.log(`1. /js/standingsEngine.js: HTTP ${scriptRes.status} (Length: ${scriptRes.data.length})`);
  if (scriptRes.status === 200 && scriptRes.data.includes('LeagueStandingsEngine')) {
    console.log('   ✅ PASS: LeagueStandingsEngine script is live on production');
  } else {
    console.error('   ❌ FAIL: LeagueStandingsEngine script failed to load');
  }

  // 2. Verify /api/standings
  const apiRes = await fetchUrl('https://deeppredictbet.com/api/standings?league=39');
  console.log(`2. /api/standings?league=39: HTTP ${apiRes.status}`);
  try {
    const json = JSON.parse(apiRes.data);
    console.log(`   Standings count: ${json.standings ? json.standings.length : 0}`);
    if (json.standings && json.standings.length > 0) {
      const first = json.standings[0];
      console.log(`   Leader: ${first.name} (Pts: ${first.points}, GD: ${first.goalDiff}, Crest: ${first.logo})`);
      const hasAuthenticCrests = json.standings.every(t => t.logo && t.logo.startsWith('http') && !t.logo.includes('🦁') && !t.logo.includes('🔵'));
      if (hasAuthenticCrests) {
        console.log('   ✅ PASS: Standings API returns dynamic table with 100% authentic crest CDN URLs');
      } else {
        console.warn('   ⚠️ WARNING: Some standings items still have fallback or emoji logos');
      }
    }
  } catch (e) {
    console.error('   ❌ FAIL: Could not parse /api/standings JSON:', e.message);
  }

  // 3. Verify Homepage index.html
  const homeRes = await fetchUrl('https://deeppredictbet.com/');
  console.log(`3. Homepage: HTTP ${homeRes.status}`);
  if (homeRes.data.includes('standingsEngine.js')) {
    console.log('   ✅ PASS: Homepage links standingsEngine.js script bundle');
  } else {
    console.error('   ❌ FAIL: Homepage missing standingsEngine.js script');
  }
}

verifyProduction().catch(console.error);
