const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;
const scripts = [];
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const src = match[1].split('?')[0].replace(/^\//, '');
  if (fs.existsSync(src)) {
    scripts.push(src);
  }
}

console.log('Scripts to check in load order:', scripts);

// Collect all top-level `const `, `let `, `class ` declarations
const topLevelRegex = /^(?:const|let|class)\s+([a-zA-Z0-9_$]+)/gm;
const declaredVars = new Map();
const collisions = [];

for (const scriptPath of scripts) {
  const content = fs.readFileSync(scriptPath, 'utf8');
  let m;
  while ((m = topLevelRegex.exec(content)) !== null) {
    const varName = m[1];
    if (declaredVars.has(varName)) {
      collisions.push({
        name: varName,
        first: declaredVars.get(varName),
        second: scriptPath
      });
    } else {
      declaredVars.set(varName, scriptPath);
    }
  }
}

console.log('\n--- TOP-LEVEL DECLARATION COLLISIONS ---');
if (collisions.length === 0) {
  console.log('No top-level collisions found!');
} else {
  collisions.forEach(c => {
    console.error(`COLLISION on '${c.name}': first in ${c.first}, re-declared in ${c.second}`);
  });
}
