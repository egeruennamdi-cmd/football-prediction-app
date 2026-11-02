const fs = require('fs');
const path = require('path');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const targetFunctionStart = 'async function showMockTableStandings(leagueName, btn, countryName) {';
  const handoffSnippet = `
  // Authoritative Dynamic Standings Engine handoff
  if (typeof window !== 'undefined' && window.LeagueStandingsEngine && typeof window.LeagueStandingsEngine.showMockTableStandings === 'function') {
    const cleanL = (leagueName || '').replace(/^[^\w\s]+/, '').trim() || leagueName;
    const resolvedC = countryName || (window.appState && window.appState.calCountry);
    return window.LeagueStandingsEngine.showMockTableStandings(cleanL, btn, resolvedC);
  }
`;

  if (content.includes(targetFunctionStart) && !content.includes('Authoritative Dynamic Standings Engine handoff')) {
    const idx = content.indexOf(targetFunctionStart);
    const insertPos = idx + targetFunctionStart.length;
    content = content.slice(0, insertPos) + handoffSnippet + content.slice(insertPos);
    modified = true;
    console.log(`[PASS] Patched showMockTableStandings handoff in ${filePath}`);
  } else {
    console.log(`[SKIP] Already patched or target not found in ${filePath}`);
  }

  // Also hook into DOMContentLoaded if present
  const domContentMarker = 'document.addEventListener("DOMContentLoaded", function() {';
  const autoSyncSnippet = `
  try {
    if (typeof window !== 'undefined' && window.LeagueStandingsEngine && typeof window.LeagueStandingsEngine.syncAllMatches === 'function') {
      const globalMatches = [
        ...(Array.isArray(window.MATCH_DATA) ? window.MATCH_DATA : []),
        ...(Array.isArray(window.AUTHENTIC_TOP_LEAGUES_FIXTURES) ? window.AUTHENTIC_TOP_LEAGUES_FIXTURES : [])
      ];
      window.LeagueStandingsEngine.syncAllMatches(globalMatches);
    }
  } catch (e) {}
`;

  if (content.includes(domContentMarker) && !content.includes('window.LeagueStandingsEngine.syncAllMatches')) {
    const idx = content.indexOf(domContentMarker);
    const insertPos = idx + domContentMarker.length;
    content = content.slice(0, insertPos) + autoSyncSnippet + content.slice(insertPos);
    modified = true;
    console.log(`[PASS] Patched DOMContentLoaded auto-sync in ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

const filesToPatch = [
  path.join(__dirname, '..', 'js', 'ui.js'),
  path.join(__dirname, '..', 'public', 'js', 'ui.js'),
  path.join(__dirname, '..', 'js', 'app.js'),
  path.join(__dirname, '..', 'public', 'js', 'app.js')
];

for (const f of filesToPatch) {
  if (fs.existsSync(f)) {
    patchFile(f);
  } else {
    console.warn(`File not found: ${f}`);
  }
}
