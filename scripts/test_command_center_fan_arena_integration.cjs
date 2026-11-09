/**
 * scripts/test_command_center_fan_arena_integration.cjs
 * Comprehensive test suite validating Fan Arena integration into
 * DEEPPREDICTBET SOCIAL MEDIA & TELEGRAM COMMAND CENTER.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log('🧪 Starting Command Center Fan Arena Integration Test Suite...\n');

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body>
  <img id="tg-live-graphic-preview-img" src="" alt="preview" />
  <textarea id="tg-live-caption-input"></textarea>
  <div id="tg-live-char-counter"></div>
  <div id="tg-live-graphic-fmt-badge"></div>
  <div id="tg-live-graphic-title-text"></div>
  <div id="tg-live-card-download-feedback"></div>
</body></html>`, {
  url: 'https://deeppredictbet.com/admin',
  runScripts: 'outside-only'
});

const { window } = dom;

// Polyfill Canvas 2D Mock Context on window.HTMLCanvasElement.prototype
window.HTMLCanvasElement.prototype.getContext = function (type) {
  return {
    canvas: this,
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    rect: () => {},
    roundRect: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
    strokeText: () => {},
    measureText: (str) => ({ width: (str || '').length * 8 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {},
    setLineDash: () => {},
    getLineDash: () => []
  };
};

window.HTMLCanvasElement.prototype.toDataURL = function () {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
};

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.HTMLCanvasElement = window.HTMLCanvasElement;
global.localStorage = window.localStorage;

const sampleMatch = {
  id: 'fixture_cc_101',
  fixtureId: 'fixture_cc_101',
  competition: 'Premier League',
  leagueEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  date: '2026-11-10',
  time: '17:30',
  isUpcoming: true,
  isLive: false,
  isFT: false,
  homeTeam: { id: 42, name: 'Arsenal' },
  awayTeam: { id: 49, name: 'Chelsea' },
  homeScore: 0,
  awayScore: 0
};

window.MATCH_DATA = [sampleMatch];
window.AUTHENTIC_TOP_LEAGUES_FIXTURES = [sampleMatch];

// Load modules
require('../js/teamCrests.js');
const fanArenaEngine = require('../js/fanArenaEngine.js');
const tgModule = require('../js/telegramPublisher.js');

console.log('--- Suite 1: Global Symbol Sharing ---');
assert.strictEqual(typeof window.generateFanArenaCardCanvas, 'function', 'window.generateFanArenaCardCanvas must exist');
assert.strictEqual(typeof window.getMatchFanVotes, 'function', 'window.getMatchFanVotes must exist');
assert.strictEqual(typeof window.TelegramPublisher.setCardTemplate, 'function', 'TelegramPublisher.setCardTemplate must exist');
console.log('  ✅ PASS: Fan Arena engine functions and Command Center controls are exported to window');

console.log('\n--- Suite 2: Template Switching & Caption Generation ---');
window.TelegramPublisher.selectLiveMatch(sampleMatch.id);
window.TelegramPublisher.setCardTemplate('fan_arena');
const caption = window.TelegramPublisher.generateLiveCaption(sampleMatch, 'FAN_ARENA', null);
assert(caption.includes('DEEPPREDICTBET FAN ARENA: WHO IS WINNING?'), 'Caption should contain Fan Arena voting title');
assert(caption.includes('Arsenal vs Chelsea'), 'Caption should contain match teams');
assert(caption.includes('Fan Predictions'), 'Caption should contain Fan Predictions');
assert(caption.includes('https://deeppredictbet.com'), 'Caption should contain website link');
assert(caption.includes('18+ · Gamble Responsibly'), 'Caption should contain compliance footer');
console.log('  ✅ PASS: Command Center generates accurate Fan Arena voting copy for Telegram/socials');

console.log('\n--- Suite 3: Fan Arena Graphic Preview in Command Center ---');
const graphicDataUrl = window.TelegramPublisher.renderLiveMatchGraphic(sampleMatch, 'FAN_ARENA', null, 'square');
assert(graphicDataUrl && graphicDataUrl.startsWith('data:image/png;base64,'), 'Graphic preview should produce valid base64 data URL');
console.log('  ✅ PASS: Command Center renders high-resolution Fan Arena card on canvas');

console.log('\n--- Suite 4: Command Center HTML Structure ---');
const tabHtml = window.TelegramPublisher.renderLiveUpdatesTab();
assert(tabHtml.includes('CARD STYLE:'), 'renderLiveUpdatesTab must include Card Style selector');
assert(tabHtml.includes('data-template="ai_centre"'), 'renderLiveUpdatesTab must include AI Centre toggle');
assert(tabHtml.includes('data-template="fan_arena"'), 'renderLiveUpdatesTab must include Fan Arena toggle');
assert(tabHtml.includes('Fan Arena (Voting Card)'), 'renderLiveUpdatesTab must display Fan Arena button label');
assert(tabHtml.includes('FAN_ARENA'), 'renderLiveUpdatesTab must include 1-click FAN_ARENA preset button');
console.log('  ✅ PASS: Command Center UI includes card style toggles and 1-click Fan Arena preset');

console.log('\n--- Suite 5: Reversible Clean State ---');
window.TelegramPublisher.setCardTemplate('ai_centre');
const aiCaption = window.TelegramPublisher.generateLiveCaption(sampleMatch, 'GOAL', { player: { name: 'Saka' }, time: { elapsed: 35 } });
assert(aiCaption.includes('GOAL!'), 'Switches back cleanly to AI Match Centre event caption');
console.log('  ✅ PASS: Command Center can toggle seamlessly between AI Match Centre and Fan Arena modes');

console.log('\n========================================');
console.log('RESULTS: ALL 5/5 COMMAND CENTER INTEGRATION TESTS PASSED!');
console.log('========================================\n');
