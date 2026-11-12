const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');

function runTestScenario(name, isLoggedIn, removeWelcomeEl = false) {
  console.log(`\n==============================================`);
  console.log(`SCENARIO: ${name}`);
  console.log(`==============================================`);

  const virtualConsole = new VirtualConsole();
  const errors = [];
  virtualConsole.on('error', (...args) => errors.push(['ERROR', ...args]));
  virtualConsole.on('jsdomError', (err) => errors.push(['JSDOM_ERR', err.message]));

  const html = fs.readFileSync('index.html', 'utf8');
  const dom = new JSDOM(html, {
    url: 'https://deeppredictbet.com/',
    runScripts: 'dangerously',
    virtualConsole
  });
  const win = dom.window;
  const doc = win.document;

  // Mock network & storage
  win.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  win.scrollTo = () => {};
  win.Element.prototype.scrollIntoView = () => {};

  const storage = {};
  if (isLoggedIn) {
    storage['userLoggedIn'] = 'true';
    storage['currentUsername'] = 'Egeruennamdi78';
    storage['deeppredictbet_vip'] = JSON.stringify({ package: 'ADMIN PASS' });
  }

  win.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  };

  if (removeWelcomeEl) {
    const el = doc.getElementById('command-center-welcome');
    if (el) el.remove();
    console.log('Explicitly REMOVED #command-center-welcome from DOM before scripts load');
  }

  // Load scripts via real script elements
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const src = match[1].split('?')[0].replace(/^\//, '');
    if (fs.existsSync(src)) {
      const code = fs.readFileSync(src, 'utf8');
      const s = doc.createElement('script');
      s.textContent = code;
      doc.head.appendChild(s);
    }
  }

  // Fire DOMContentLoaded
  doc.dispatchEvent(new win.Event('DOMContentLoaded', { bubbles: true, cancelable: true }));

  console.log('Script errors:', errors);
  console.log('DPFeatureHealth status:', win.DPFeatureHealth ? win.DPFeatureHealth.getStatus().features : 'N/A');
  console.log('executeCommandScoutPrompt exists?:', typeof win.executeCommandScoutPrompt === 'function');
  console.log('runBetDoctorAudit exists?:', typeof win.runBetDoctorAudit === 'function');

  // Test Ask AI Scout execution
  console.log('Testing Ask AI Scout ("Find value")...');
  try {
    win.executeCommandScoutPrompt('Find value');
    const feedback = doc.getElementById('command-scout-feedback');
    console.log('  Scout Feedback display:', feedback?.style.display);
    console.log('  Scout Feedback text includes Value?:', feedback?.textContent.includes('Value'));
  } catch (e) {
    console.error('  Scout FAILED:', e.message);
  }

  // Test Ask AI Scout ("Check my bet")...
  console.log('Testing Ask AI Scout ("Check my bet")...');
  try {
    win.executeCommandScoutPrompt('Check my bet');
    const feedback = doc.getElementById('command-scout-feedback');
    console.log('  Scout Feedback text includes Doctor?:', feedback?.textContent.includes('Doctor'));
  } catch (e) {
    console.error('  Scout Check my bet FAILED:', e.message);
  }

  // Test AI Bet Doctor audit execution
  console.log('Testing runBetDoctorAudit()...');
  try {
    win.runBetDoctorAudit();
    console.log('  runBetDoctorAudit executed cleanly without crash!');
  } catch (e) {
    console.error('  runBetDoctorAudit FAILED:', e.message);
  }
}

runTestScenario('1. Logged in with welcome panel present', true, false);
runTestScenario('2. Logged in with welcome panel REMOVED', true, true);
runTestScenario('3. Guest / unauthenticated with welcome panel absent', false, false);
