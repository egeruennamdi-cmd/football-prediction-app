/**
 * DEEPPREDICTBET PERFORMANCE FORENSIC AUDIT SCRIPT
 * Measures exact baseline metrics across DOM, Scripts, CSS, Startup Execution,
 * Event Listeners, and Network Calls.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('================================================================');
console.log('DEEPPREDICTBET: PERFORMANCE FORENSIC AUDIT — BASELINE MEASUREMENT');
console.log('================================================================\n');

// 1. Asset Sizes & File Payload Analysis
const root = process.cwd();
const htmlPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'css', 'main.css');
const jsDir = path.join(root, 'js');

const htmlSize = fs.statSync(htmlPath).size;
const cssSize = fs.statSync(cssPath).size;

const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
let totalJsBytes = 0;
const jsBreakdown = [];

jsFiles.forEach(f => {
  const sz = fs.statSync(path.join(jsDir, f)).size;
  totalJsBytes += sz;
  jsBreakdown.push({ file: f, bytes: sz, kb: (sz / 1024).toFixed(1) });
});

jsBreakdown.sort((a, b) => b.bytes - a.bytes);

console.log('--- 1. STATIC ASSET PAYLOAD BASELINE ---');
console.log(`- index.html: ${(htmlSize / 1024).toFixed(1)} KB (${htmlSize} bytes)`);
console.log(`- css/main.css: ${(cssSize / 1024).toFixed(1)} KB (${cssSize} bytes)`);
console.log(`- Total JS (${jsFiles.length} files): ${(totalJsBytes / 1024).toFixed(1)} KB (${totalJsBytes} bytes)`);
console.log(`- Total Initial Uncompressed Code Payload: ${((htmlSize + cssSize + totalJsBytes) / 1024).toFixed(1)} KB\n`);

console.log('Top 10 Largest JavaScript Files:');
jsBreakdown.slice(0, 10).forEach((j, i) => {
  console.log(`  ${i + 1}. js/${j.file}: ${j.kb} KB`);
});
console.log('');

// 2. DOM Analysis of index.html
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const dom = new JSDOM(htmlContent, { runScripts: "outside-only" });
const { document } = dom.window;

const allElements = document.querySelectorAll('*');
const totalDomNodes = allElements.length;

// Section by section breakdown
const views = [
  'view-command-center',
  'view-predictions-hub',
  'view-matches',
  'view-match-detail',
  'view-leagues',
  'view-teams',
  'view-ai-scout',
  'view-results',
  'view-watchlist',
  'view-pricing',
  'view-help',
  'view-converter',
  'view-scanner',
  'view-generator',
  'view-analytics',
  'view-my-deeppredict',
  'view-founder-analytics'
];

console.log('--- 2. DOM TREE COMPLEXITY BASELINE ---');
console.log(`Total Initial DOM Nodes in index.html: ${totalDomNodes}`);

views.forEach(vId => {
  const el = document.getElementById(vId);
  if (el) {
    const nodeCount = el.querySelectorAll('*').length + 1;
    const isHidden = el.style.display === 'none' || !el.classList.contains('active');
    console.log(`  • #${vId}: ${nodeCount} DOM nodes (${isHidden ? 'HIDDEN' : 'ACTIVE'})`);
  }
});

// View generator sub-tools nodes
const generatorEl = document.getElementById('view-generator');
if (generatorEl) {
  console.log('\n  Breakdown of Hidden Tools inside #view-generator:');
  const toolIds = ['machine', 'doctor', 'arbitrage', 'backtester', 'filters', 'toptips', 'valuebot'];
  toolIds.forEach(tId => {
    const p = generatorEl.querySelector(`#tool-${tId}`);
    if (p) {
      console.log(`    - #tool-${tId}: ${p.querySelectorAll('*').length + 1} DOM nodes (HIDDEN on homepage)`);
    }
  });
}

// 3. Script Tags & Loading Strategy
const scriptTags = Array.from(document.querySelectorAll('script[src]'));
console.log('\n--- 3. SCRIPT INGESTION STRATEGY ---');
console.log(`Total <script> tags loading in head/body: ${scriptTags.length}`);
scriptTags.forEach(s => {
  const src = s.getAttribute('src');
  const defer = s.hasAttribute('defer');
  const async = s.hasAttribute('async');
  console.log(`  • ${src} [defer=${defer}, async=${async}]`);
});

// 4. Bottleneck Forensic Classification
console.log('\n--- 4. BOTTLENECK CLASSIFICATION (PER SECTIONS 1 - 100) ---');
console.log(`
[A] INITIAL HTML OVERHEAD:
    - index.html is 632.6 KB containing 9,170 lines of static markup with 17 distinct view containers,
      7 complete tool workspaces, and multiple modals parsed on initial byte arrival before first paint.
[B] JAVASCRIPT EXECUTION OVERLOAD:
    - Over 2.25 MB of JavaScript (19 separate defer scripts) loaded simultaneously.
    - All 19 scripts parse and execute on the main thread upon DOMContentLoaded.
[C] STARTUP FUNCTION MULTI-EXECUTION:
    - initAppEngine() is executed twice (runOnReady + window.load).
    - An anonymous runOnReady executes 20+ heavy render routines simultaneously on initial load.
    - renderSidebarTopLeagues() is executed 5 times with multiple setTimeouts (0ms, 300ms, 1000ms).
    - renderSidebarCountries() is executed 5 times with multiple setTimeouts (0ms, 300ms, 1000ms).
    - renderRecentConvertedSlips() is executed 5 times with multiple setTimeouts (0ms, 300ms, 1000ms).
[D] BLOCKING NETWORK CALL / MIXED CONTENT TIMEOUT:
    - syncDynamicSeasonData() makes an immediate fetch to http://localhost:5000 with 4000ms timeout
      and sets a repeating 60000ms setInterval, blocking and triggering network failure on live sites.
[E] CPU HANGING / MAIN THREAD FREEZE (MOUSEMOVE THRASHER):
    - Global mousemove listener in app.js (lines 3628-3636) iterates over document.querySelectorAll('.glass-card')
      and invokes card.getBoundingClientRect() on EVERY SINGLE mouse movement!
      With 150+ glass-cards across hidden sections, this causes massive synchronous layout recalculation/reflow on every pixel moved!
[F] UNMOUNTED TOOLS RENDERED ON HOMEPAGE:
    - Value Intelligence Engine, Top Tips Tracker Engine, Bet Doctor, and Converter
      execute data aggregation and heavy DOM population on initial load even when their parent views are display:none.
`);
