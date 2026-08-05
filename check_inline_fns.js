import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const files = ['js/data.js', 'js/ui.js', 'js/router.js', 'js/app.js', 'js/main.js'];
const code = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');

// Regex to capture function names inside inline event attributes like onclick="fnName(...)"
const regex = /on[a-z]+\s*=\s*["']([^"']+)["']/gi;
let match;
const inlineFns = new Set();

while ((match = regex.exec(html)) !== null) {
  const expr = match[1];
  // extract function name before (
  const fnMatches = expr.matchAll(/([a-zA-Z0-9_]+)\s*\(/g);
  for (const fnMatch of fnMatches) {
    const fnName = fnMatch[1];
    if (!['if', 'return', 'console', 'alert', 'setTimeout', 'clearTimeout'].includes(fnName)) {
      inlineFns.add(fnName);
    }
  }
}

console.log('Total unique inline function calls in index.html:', inlineFns.size);

const missing = [];
inlineFns.forEach(fn => {
  const isBound = code.includes('function ' + fn) || code.includes('window.' + fn) || code.includes(fn + ' = function') || code.includes(fn + ' = (');
  if (!isBound) {
    missing.push(fn);
  }
});

console.log('UNBOUND / MISSING INLINE FUNCTIONS IN JS FILES:', missing);
