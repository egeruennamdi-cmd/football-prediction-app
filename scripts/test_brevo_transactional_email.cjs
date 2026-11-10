/**
 * scripts/test_brevo_transactional_email.cjs
 * Comprehensive Verification & Test Suite for Brevo Transactional Email Integration
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('🧪 Starting Brevo Transactional Email Integration Test Suite...\n');

// Import the ES module _brevoEmailService using dynamic import
async function runTests() {
  const brevoService = await import('../functions/api/services/_brevoEmailService.js');
  const {
    validateEmail,
    normalizeEmail,
    escapeHtml,
    renderBaseEmailHtml,
    renderBaseEmailText,
    sendTransactionalEmail,
    sendAccountVerificationEmail,
    sendPasswordResetEmail,
    sendPasswordChangedAlert,
    sendVipPaymentSuccessEmail,
    sendAccountSecurityAlert
  } = brevoService;

  let passedTests = 0;

  // --- Suite 1: Email Validation & Sanitization ---
  console.log('--- Suite 1: Email Validation & Sanitization ---');
  assert.strictEqual(validateEmail('user@deeppredictbet.com'), true, 'Valid email should pass');
  assert.strictEqual(validateEmail('alex.nnamdi+vip@gmail.com'), true, 'Valid email with subaddress should pass');
  assert.strictEqual(validateEmail('invalid-email'), false, 'Missing domain should fail');
  assert.strictEqual(validateEmail('@domain.com'), false, 'Missing local-part should fail');
  assert.strictEqual(validateEmail('user@'), false, 'Missing TLD should fail');
  assert.strictEqual(validateEmail(''), false, 'Empty string should fail');
  assert.strictEqual(validateEmail(null), false, 'Null should fail');

  assert.strictEqual(normalizeEmail('  User@DeepPredictBet.COM '), 'user@deeppredictbet.com');
  assert.strictEqual(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  console.log('  ✅ PASS: Email validation and sanitization functions behave correctly.');
  passedTests++;

  // --- Suite 2: DeepPredictBet Brand Styling & Compliance ---
  console.log('\n--- Suite 2: DeepPredictBet Brand Styling & Compliance ---');
  const sampleHtml = renderBaseEmailHtml({
    title: 'Test Email',
    headline: 'Welcome to DeepPredictBet',
    contentHtml: '<p>This is test content.</p>',
    ctaText: 'Activate Now',
    ctaUrl: 'https://deeppredictbet.com/?action=test'
  });

  assert(sampleHtml.includes('#10b981'), 'Must include Deep Royal Green (#10b981)');
  assert(sampleHtml.includes('#38bdf8'), 'Must include Predict Royal Blue (#38bdf8)');
  assert(sampleHtml.includes('#ef4444'), 'Must include Bet Royal Red (#ef4444)');
  assert(sampleHtml.includes('18+'), 'Must include 18+ gambling age notice');
  assert(sampleHtml.includes('GAMBLE RESPONSIBLY'), 'Must include Gamble Responsibly message');
  assert(sampleHtml.includes('support@deeppredictbet.com'), 'Must reference support@deeppredictbet.com');
  assert(sampleHtml.includes('https://deeppredictbet.com'), 'Must link to https://deeppredictbet.com');
  assert(sampleHtml.includes('Activate Now'), 'Must render CTA button');

  const sampleText = renderBaseEmailText({
    headline: 'Welcome to DeepPredictBet',
    contentText: 'This is test content.',
    ctaText: 'Activate',
    ctaUrl: 'https://deeppredictbet.com'
  });
  assert(sampleText.includes('DEEPPREDICTBET'), 'Plain text must include brand header');
  assert(sampleText.includes('18+ · Gamble Responsibly'), 'Plain text must include compliance notice');
  assert(sampleText.includes('support@deeppredictbet.com'), 'Plain text must include support address');
  console.log('  ✅ PASS: Responsive HTML & Plain-text templates comply 100% with DeepPredictBet branding.');
  passedTests++;

  // --- Suite 3: Simulation & Dry-Run Fallback (Zero-Downtime without API key) ---
  console.log('\n--- Suite 3: Simulation & Dry-Run Fallback ---');
  const dummyEnv = { BREVO_API_KEY: '', BREVO_FROM_EMAIL: 'noreply@deeppredictbet.com' };
  const simResult = await sendTransactionalEmail(dummyEnv, {
    to: 'test-recipient@example.com',
    toName: 'Test Punter',
    subject: 'Simulation Test',
    htmlContent: '<p>Simulation body</p>',
    templateType: 'test_template',
    uniqueRef: 'sim_test_ref_1'
  });

  assert.strictEqual(simResult.success, true, 'Dry-run must return success: true');
  assert.strictEqual(simResult.simulated, true, 'Dry-run must indicate simulated: true');
  assert.strictEqual(simResult.provider, 'brevo_simulation');
  assert(simResult.messageId.startsWith('sim_'), 'Must generate simulation message ID');
  console.log('  ✅ PASS: Simulation mode safely protects tests and dev environments without API keys.');
  passedTests++;

  // --- Suite 4: Idempotency & Duplicate Suppression ---
  console.log('\n--- Suite 4: Idempotency & Duplicate Suppression ---');
  const dupResult = await sendTransactionalEmail(dummyEnv, {
    to: 'test-recipient@example.com',
    toName: 'Test Punter',
    subject: 'Simulation Test',
    htmlContent: '<p>Simulation body</p>',
    templateType: 'test_template',
    uniqueRef: 'sim_test_ref_1'
  });

  assert.strictEqual(dupResult.success, true);
  assert.strictEqual(dupResult.code, 'DUPLICATE_SUPPRESSED', 'Immediate identical request must be suppressed');
  assert.strictEqual(dupResult.cached, true);
  console.log('  ✅ PASS: Idempotency filter suppresses duplicate sends within the rate-limit window.');
  passedTests++;

  // --- Suite 5: Specialized Notification Workflow Templates ---
  console.log('\n--- Suite 5: Specialized Notification Workflow Templates ---');

  // A. Verification Email
  const vResult = await sendAccountVerificationEmail(dummyEnv, {
    email: 'newpunter@deeppredictbet.com',
    name: 'New Punter',
    verificationUrl: 'https://deeppredictbet.com/?action=verify-email&token=vfy_123',
    token: 'vfy_123'
  });
  assert.strictEqual(vResult.success, true);

  // B. Password Reset Email
  const rResult = await sendPasswordResetEmail(dummyEnv, {
    email: 'punter@deeppredictbet.com',
    name: 'Alex Nnamdi',
    resetUrl: 'https://deeppredictbet.com/?action=reset-password&token=rst_456',
    token: 'rst_456'
  });
  assert.strictEqual(rResult.success, true);

  // C. Password Changed Alert
  const cResult = await sendPasswordChangedAlert(dummyEnv, {
    email: 'punter@deeppredictbet.com',
    name: 'Alex Nnamdi',
    timestamp: new Date().toUTCString()
  });
  assert.strictEqual(cResult.success, true);

  // D. VIP Payment Success Email
  const pResult = await sendVipPaymentSuccessEmail(dummyEnv, {
    email: 'vip@deeppredictbet.com',
    name: 'VIP Member',
    plan: { id: 'monthly', name: 'Monthly VIP Pass' },
    transaction: { transaction_id: 'TX-NGN-12345', formatted_amount: '₦27,000.00', currency: 'NGN' },
    subscription: { formattedAmount: '₦27,000.00', currency: 'NGN', expiresAt: new Date(Date.now() + 30*86400000).toISOString() }
  });
  assert.strictEqual(pResult.success, true);

  // E. Security Alert Email
  const sResult = await sendAccountSecurityAlert(dummyEnv, {
    email: 'user@deeppredictbet.com',
    name: 'User',
    title: 'New Device Login Alert',
    details: 'A login to your account was detected from Chrome on Windows.'
  });
  assert.strictEqual(sResult.success, true);

  console.log('  ✅ PASS: All 5 transactional workflow templates construct and execute seamlessly.');
  passedTests++;

  // --- Suite 6: Email Verification Endpoint Integration ---
  console.log('\n--- Suite 6: Email Verification Endpoint Integration ---');
  const verifyModule = await import('../functions/api/verify-email.js');
  assert(typeof verifyModule.onRequestGet === 'function', 'verify-email.js must export onRequestGet');
  assert(typeof verifyModule.onRequestPost === 'function', 'verify-email.js must export onRequestPost');
  assert(typeof verifyModule.onRequestOptions === 'function', 'verify-email.js must export onRequestOptions');

  // Test missing token rejection
  const reqNoToken = new Request('https://deeppredictbet.com/api/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const resNoToken = await verifyModule.onRequestPost({ request: reqNoToken, env: {} });
  const dataNoToken = await resNoToken.json();
  assert.strictEqual(dataNoToken.success, false);
  assert.strictEqual(dataNoToken.code, 'MISSING_TOKEN');
  console.log('  ✅ PASS: /api/verify-email validates tokens and rejects missing inputs.');
  passedTests++;

  // --- Suite 7: API Key Protection & Zero-Exposure ---
  console.log('\n--- Suite 7: API Key Protection & Zero-Exposure ---');
  const adminEmailStatusModule = await import('../functions/api/admin/email-status.js');
  const reqAdminStatus = new Request('https://deeppredictbet.com/api/admin/email-status?adminKey=deep_admin_78_key');
  const resAdminStatus = await adminEmailStatusModule.onRequestGet({
    request: reqAdminStatus,
    env: { BREVO_API_KEY: 'xkeysib-secret-test-key-1234567890', BREVO_FROM_EMAIL: 'noreply@deeppredictbet.com' }
  });
  const dataAdminStatus = await resAdminStatus.json();
  assert.strictEqual(dataAdminStatus.success, true);
  assert.strictEqual(dataAdminStatus.configured, true);
  assert.strictEqual(dataAdminStatus.fromEmail, 'noreply@deeppredictbet.com');
  assert.strictEqual(dataAdminStatus.replyToEmail, 'support@deeppredictbet.com');
  // Strict Zero-Exposure Check: the secret key itself must NEVER appear in the response payload
  const stringified = JSON.stringify(dataAdminStatus);
  assert(!stringified.includes('xkeysib-secret-test-key-1234567890'), 'Secret key must NEVER leak in API responses');
  console.log('  ✅ PASS: Server-side environment secrets are strictly guarded against leakage.');
  passedTests++;

  console.log('\n========================================');
  console.log(`RESULTS: ALL ${passedTests}/7 BREVO INTEGRATION TEST SUITES PASSED!`);
  console.log('========================================\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
