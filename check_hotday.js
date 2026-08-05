import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const matches = html.match(/[a-zA-Z0-9_]*HotDay[a-zA-Z0-9_]*/gi) || [];
console.log('Matches for HotDay in index.html:', matches);

const triggerMatches = Array.from(new Set(html.match(/trigger[a-zA-Z0-9_]+/g) || [])).sort();
console.log('All trigger* functions in index.html:', triggerMatches);
