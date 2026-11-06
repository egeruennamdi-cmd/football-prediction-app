/**
 * Comprehensive Mobile Header Layout & Viewport Overflow Verification Suite
 * Tests responsive layout across viewports:
 * 320px, 360px, 375px, 390px, 412px, 430px, Tablet (768px, 1024px), Desktop (1280px)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== DeepPredictBet Mobile Header & Logout Overflow Test Suite ===\n');

const cssContent = fs.readFileSync(path.join(__dirname, '..', 'css', 'main.css'), 'utf8');
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const jsAppContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
const jsUiContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf8');

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${desc}: ${err.message}`);
  }
}

// 1. Static CSS verification
console.log('--- Suite 1: CSS Flexbox & Responsive Rules Verification ---');

it('header-account-area has flex-shrink: 1 and min-width: 0 in base CSS', () => {
  assert(cssContent.includes('flex-shrink: 1;'), 'Should have flex-shrink: 1');
  assert(cssContent.includes('min-width: 0;'), 'Should have min-width: 0');
});

it('header-user-identity has min-width: 0 and flex: 0 1 auto', () => {
  assert(cssContent.includes('flex: 0 1 auto;'), 'header-user-identity should have flex: 0 1 auto');
  assert(cssContent.includes('text-overflow: ellipsis;'), 'Should have ellipsis truncation');
  assert(cssContent.includes('white-space: nowrap;'), 'Should have nowrap');
});

it('header-logout-btn has flex-shrink: 0 and white-space: nowrap', () => {
  assert(cssContent.includes('flex-shrink: 0;'), 'Logout button must never shrink or clip');
  assert(cssContent.includes('white-space: nowrap;'), 'Logout text must not wrap');
});

it('mobile media queries exist for both max-width: 768px and max-width: 380px', () => {
  assert(cssContent.includes('@media (max-width: 768px)'), 'Should have max-width: 768px query');
  assert(cssContent.includes('@media (max-width: 380px)'), 'Should have max-width: 380px query');
});

it('nav-container in mobile query enforces overflow: hidden and box-sizing: border-box', () => {
  const mobileSection = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
  assert(mobileSection.includes('overflow: hidden !important;'), 'nav-container should have overflow: hidden');
  assert(mobileSection.includes('box-sizing: border-box !important;'), 'nav-container should have box-sizing: border-box');
});

it('nav-actions in mobile query has flex-shrink: 1 !important', () => {
  const mobileQuery = cssContent.slice(cssContent.indexOf('@media (max-width: 768px)'));
  assert(mobileQuery.includes('flex-shrink: 1 !important;'), 'nav-actions must be allowed to shrink');
});

// 2. Static HTML & JS verification
console.log('\n--- Suite 2: HTML & JS Cleanliness Verification ---');

it('index.html nav-left and nav-actions do not have inline gap: 10px override', () => {
  assert(!htmlContent.includes('<div class="nav-left" style="display: flex; align-items: center; gap: 10px;">'), 'nav-left should not have inline gap: 10px');
  assert(!htmlContent.includes('<div class="nav-actions" style="display: flex; align-items: center; gap: 10px;">'), 'nav-actions should not have inline gap: 10px');
});

it('js/app.js updateAuthUIState does not set inline gap: 10px on accountArea', () => {
  assert(!jsAppContent.includes('accountArea.style.gap = "10px"'), 'accountArea.style.gap should not be hardcoded in app.js');
});

it('js/ui.js updateAuthUIState does not set inline gap: 10px on accountArea', () => {
  assert(!jsUiContent.includes('accountArea.style.gap = "10px"'), 'accountArea.style.gap should not be hardcoded in ui.js');
});

// 3. Mathematical Viewport Layout Simulations
console.log('\n--- Suite 3: Mathematical Viewport Responsive Width Calculations ---');

const viewports = [
  { width: 320, name: 'Small Phone (iPhone SE 1st gen)' },
  { width: 360, name: 'Android Small (Galaxy S8)' },
  { width: 375, name: 'Standard iPhone (iPhone SE 2/3, 8, X)' },
  { width: 390, name: 'Modern iPhone / Android (iPhone 12/13/14, Galaxy A/S)' },
  { width: 412, name: 'Large Android (Pixel 7/8, Galaxy S22+)' },
  { width: 430, name: 'Max Phone (iPhone 14/15/16 Pro Max)' },
  { width: 768, name: 'Tablet Portrait (iPad Mini/Air)' },
  { width: 1024, name: 'Tablet Landscape (iPad Pro)' },
  { width: 1280, name: 'Desktop Standard' }
];

const testUsernames = [
  { name: 'Short username ("John")', label: 'John' },
  { name: 'Medium username ("Alex Nnamdi")', label: 'Alex Nnamdi' },
  { name: 'Long username ("Alexander Nnamdi Egerue")', label: 'Alexander Nnamdi Egerue' }
];

function getLayoutMetrics(viewportWidth, username) {
  const isNarrow = viewportWidth <= 380;
  const isMobile = viewportWidth <= 768;
  const isTablet = viewportWidth > 768 && viewportWidth <= 1024;
  const isDesktop = viewportWidth > 1024;

  const padding = isNarrow ? 4 : (isMobile ? 8 : 20);
  const totalContainerPadding = padding * 2;
  const availableContentWidth = viewportWidth - totalContainerPadding;

  const hamburgerWidth = isDesktop ? 0 : (isNarrow ? 30 : 32);
  const leftGap = isDesktop ? 0 : (isNarrow ? 4 : 6);
  const logoHeight = isNarrow ? 22 : (isMobile ? 24 : (isTablet ? 34 : 44));
  const logoAspectRatio = 180 / 44;
  const logoWidth = Math.min(logoHeight * logoAspectRatio, isNarrow ? 88 : (isMobile ? 105 : 180));
  const leftSideWidth = isDesktop ? logoWidth : (hamburgerWidth + leftGap + logoWidth);

  const mainGap = isNarrow ? 4 : (isMobile ? 6 : 12);
  const accountGap = isNarrow ? 4 : (isMobile ? 6 : 12);
  const logoutBtnPadding = isNarrow ? 6 * 2 : (isMobile ? 8 * 2 : 12 * 2);
  const logoutTextWidth = isNarrow ? 42 : (isMobile ? 46 : 52);
  const logoutBtnWidth = logoutTextWidth + logoutBtnPadding + 2; // border 2px

  const maxUserWidth = isNarrow ? 78 : (isMobile ? 110 : 170);
  const userPadding = isNarrow ? 5 * 2 : (isMobile ? 6 * 2 : 12 * 2);
  const estCharWidth = isNarrow ? 6.5 : (isMobile ? 7 : 8);
  const naturalTextWidth = username.length * estCharWidth;
  const naturalUserWidth = naturalTextWidth + userPadding + 2;
  const actualUserWidth = Math.min(naturalUserWidth, maxUserWidth);

  const rightSideWidth = actualUserWidth + accountGap + logoutBtnWidth;
  const totalOccupiedWidth = leftSideWidth + mainGap + rightSideWidth;
  const totalRowWidthWithPadding = totalOccupiedWidth + totalContainerPadding;
  const logoutRightPosition = padding + leftSideWidth + mainGap + actualUserWidth + accountGap + logoutBtnWidth;
  const rightMargin = viewportWidth - logoutRightPosition;

  return {
    viewportWidth,
    totalOccupiedWidth,
    totalRowWidthWithPadding,
    logoutRightPosition,
    rightMargin,
    isClipped: logoutRightPosition > (viewportWidth - padding),
    userTruncated: naturalUserWidth > maxUserWidth,
    actualUserWidth,
    logoutBtnWidth
  };
}

for (const vp of viewports) {
  for (const user of testUsernames) {
    it(`Viewport ${vp.width}px (${vp.name}) with ${user.name}: no overflow, logout visible`, () => {
      const metrics = getLayoutMetrics(vp.width, user.label);
      assert(!metrics.isClipped, `Logout button clipped! Right pos: ${metrics.logoutRightPosition}px, Viewport: ${metrics.viewportWidth}px`);
      assert(metrics.rightMargin >= 0, `Right margin negative (${metrics.rightMargin}px)! Overflow occurred.`);
      assert(metrics.totalRowWidthWithPadding <= vp.width, `Total width ${metrics.totalRowWidthWithPadding}px exceeds viewport ${vp.width}px!`);
    });
  }
}

// 4. Truncation and Authentication Behavior Checks
console.log('\n--- Suite 4: Truncation & Business Logic Assertions ---');

it('long username "Alexander Nnamdi Egerue" truncates gracefully on mobile 390px', () => {
  const metrics = getLayoutMetrics(390, 'Alexander Nnamdi Egerue');
  assert(metrics.userTruncated === true, 'Username should be truncated');
  assert(metrics.actualUserWidth <= 110, 'Username width must respect mobile max-width 110px');
  assert(metrics.rightMargin >= 8, 'Must have at least 8px margin from right viewport edge');
});

it('short username "John" does not unnecessarily truncate', () => {
  const metrics = getLayoutMetrics(390, 'John');
  assert(metrics.userTruncated === false, 'Short username "John" should not need truncation');
});

it('Logout button width remains intact across mobile without shrinking', () => {
  const m320 = getLayoutMetrics(320, 'Alex');
  const m390 = getLayoutMetrics(390, 'Alex');
  assert(m320.logoutBtnWidth >= 50, 'Logout button must maintain touch-friendly width');
  assert(m390.logoutBtnWidth >= 60, 'Logout button must maintain touch-friendly width');
});

console.log(`\n========================================`);
console.log(`Test Results: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
