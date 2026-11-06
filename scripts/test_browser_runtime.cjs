const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('Loading index.html with JSDOM...');

const html = fs.readFileSync('index.html', 'utf8');

const virtualConsole = new (require('jsdom').VirtualConsole)();
virtualConsole.on('error', (err) => {
  console.error('[JSDOM Console Error]:', err);
});
virtualConsole.on('warn', (warn) => {
  console.warn('[JSDOM Console Warn]:', warn);
});
virtualConsole.on('jsdomError', (err) => {
  console.error('[JSDOM Script Error]:', err.detail ? err.detail.message : err.message);
  if (err.detail && err.detail.stack) console.error(err.detail.stack);
});

const dom = new JSDOM(html, {
  url: 'http://localhost:5173/',
  runScripts: 'dangerously',
  resources: 'usable',
  virtualConsole
});

// Give scripts time to execute
setTimeout(() => {
  const window = dom.window;
  const document = window.document;

  console.log('\n--- Checking Window Objects ---');
  console.log('typeof window.executeCommandScoutPrompt:', typeof window.executeCommandScoutPrompt);
  console.log('typeof window.handleCommandScoutSubmit:', typeof window.handleCommandScoutSubmit);
  console.log('typeof window.quickPromptScout:', typeof window.quickPromptScout);

  const scoutChip = document.querySelector('.command-scout-chip[onclick*="Analyse"]');
  console.log('Scout chip found:', !!scoutChip);
  if (scoutChip) {
    console.log('Scout chip onclick attribute:', scoutChip.getAttribute('onclick'));
  }

  const heroResults = document.getElementById('hero-scout-results');
  console.log('heroResults found:', !!heroResults);
  console.log('heroResults display style:', heroResults ? heroResults.style.display : 'N/A');

  console.log('\n--- Simulating User Clicking "Analyse today\'s matches" ---');
  try {
    if (scoutChip) {
      scoutChip.click();
    } else if (typeof window.executeCommandScoutPrompt === 'function') {
      window.executeCommandScoutPrompt("Analyse today's matches");
    }
    console.log('Click executed without throwing.');
    console.log('heroResults after click:', heroResults ? heroResults.innerHTML.slice(0, 300) : 'none');
    console.log('betslip length after click:', window.appState && window.appState.betslip ? window.appState.betslip.length : 'none');
  } catch (err) {
    console.error('Error during click simulation:', err);
  }

  process.exit(0);
}, 2000);
