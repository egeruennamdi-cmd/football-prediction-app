import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="hero-tag">\s*<span style="animation: pulse 1\.5s infinite; color: var\(--primary\);">●<\/span>\s*🚀 MULTI-BOOKMAKER ENGINE\s*<\/div>\s*<h1 class="hero-title">\s*<span class="gradient-text">Bet Code Converter<\/span>\s*<\/h1>/g;

const replacement = `<div class="hero-tag">
      <span style="animation: pulse 1.5s infinite; color: var(--primary);">●</span>
      Win Rate: 87.6% Accuracy
    </div>
    <h1 class="hero-title">
      Football Match Previews with <span class="gradient-text">AI Predictions &amp; Analytics</span>
    </h1>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('index.html', content);
  console.log('SUCCESSFULLY RESTORED ORIGINAL HERO TITLE IN INDEX.HTML!');
} else {
  console.error('REGEX DID NOT MATCH!');
}
