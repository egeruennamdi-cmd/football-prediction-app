const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function inspectView(viewId) {
  const start = html.indexOf(`id="${viewId}"`);
  if (start === -1) {
    console.log(`View ${viewId} not found`);
    return;
  }
  console.log(`=== View ${viewId} ===`);
  console.log(html.slice(start, start + 800));
}

inspectView('view-leagues');
inspectView('view-analytics');
