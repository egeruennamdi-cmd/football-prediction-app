const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');

const virtualConsole = new VirtualConsole();
const errors = [];
virtualConsole.on('error', (...args) => errors.push(['ERROR', ...args]));
virtualConsole.on('jsdomError', (err) => errors.push(['JSDOM_ERR', err.message]));

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  runScripts: 'dangerously',
  virtualConsole
});
const doc = dom.window.document;

// Setup mock window objects needed during top-level load
dom.window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
dom.window.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;
const scriptSources = [];
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const src = match[1].split('?')[0].replace(/^\//, '');
  if (fs.existsSync(src)) {
    scriptSources.push(src);
  }
}

console.log('Loading all 28 scripts sequentially via real DOM <script> elements:');
for (const src of scriptSources) {
  const code = fs.readFileSync(src, 'utf8');
  const s = doc.createElement('script');
  s.textContent = code;
  try {
    doc.head.appendChild(s);
    console.log(`  [OK] ${src}`);
  } catch (err) {
    console.error(`  [FAILED] ${src}:`, err.message);
  }
}

console.log('\n--- Script Errors Recorded ---');
console.log(errors);

console.log('\n--- Function checks on window ---');
console.log('window.DPFeatureHealth:', typeof dom.window.DPFeatureHealth);
console.log('window.executeCommandScoutPrompt:', typeof dom.window.executeCommandScoutPrompt);
console.log('window.runBetDoctorAudit:', typeof dom.window.runBetDoctorAudit);
console.log('window.initCommandCenter:', typeof dom.window.initCommandCenter);
console.log('window.renderWelcomePanel:', typeof dom.window.renderWelcomePanel);
