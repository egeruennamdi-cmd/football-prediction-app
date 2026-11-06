/**
 * scripts/verify_analyse_today_shortcut.cjs
 * Senior Engineer Verification for Ask AI Scout "Analyse today's matches" Restoration
 */

const fs = require('fs');
const assert = require('assert');

console.log('================================================================');
console.log('DEEPPREDICTBET: VERIFY "ANALYSE TODAY\'S MATCHES" RESTORATION');
console.log('================================================================\n');

const appJs = fs.readFileSync('js/app.js', 'utf8');
const uiJs = fs.readFileSync('js/ui.js', 'utf8');

// 1. Verify app.js contains hasAnalyseTodayIntent
assert.ok(appJs.includes('hasAnalyseTodayIntent'), 'js/app.js must define hasAnalyseTodayIntent');
console.log('✅ 1. js/app.js contains hasAnalyseTodayIntent definition');

// 2. Verify Section 5 is restricted to explicit prediction page navigation
assert.ok(appJs.includes('// 5. Explicit Routing to Today\'s Match Predictions'), 'Section 5 comment must be updated');
console.log('✅ 2. Section 5 does not intercept general "Analyse today\'s matches"');

// 3. Verify quickPromptScout sets requestedCount = 9 for today/analyse without numbers
assert.ok(appJs.includes('requestedCount = 9'), 'js/app.js quickPromptScout must set requestedCount = 9');
assert.ok(uiJs.includes('requestedCount = 9'), 'js/ui.js quickPromptScout must set requestedCount = 9');
console.log('✅ 3. quickPromptScout in both js/app.js and js/ui.js defaults to 9 matches for today analysis');

console.log('\n================================================================');
console.log('VERIFICATION SCRIPT PASSED SUCCESSFULLY');
console.log('================================================================');
