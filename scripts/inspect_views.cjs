const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const viewRegex = /id=["'](view-[^"']+)["']/g;
const views = [];
let match;
while ((match = viewRegex.exec(html)) !== null) {
  views.push(match[1]);
}
console.log('Found views:', [...new Set(views)]);
