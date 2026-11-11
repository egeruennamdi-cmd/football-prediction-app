/**
 * scripts/test_corporate_contact_infrastructure.cjs
 * Comprehensive Automated Verification Suite for Corporate Contact Infrastructure,
 * Customer Support Centre, Contact Us Page & Global Website Footer Enhancement
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ PASS: ${desc}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
  }
}

console.log('===============================================================');
console.log('  DEEPPREDICTBET LIMITED — CORPORATE CONTACT INFRASTRUCTURE AUDIT');
console.log('===============================================================\n');

// Load files
const rootDir = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const publicIndexHtml = fs.readFileSync(path.join(rootDir, 'public', 'index.html'), 'utf8');
const routerJs = fs.readFileSync(path.join(rootDir, 'js', 'router.js'), 'utf8');
const dashboardJs = fs.readFileSync(path.join(rootDir, 'js', 'dashboard.js'), 'utf8');
const uiJs = fs.readFileSync(path.join(rootDir, 'js', 'ui.js'), 'utf8');
const contactApiJs = fs.readFileSync(path.join(rootDir, 'functions', 'api', 'contact.js'), 'utf8');
const brevoServiceJs = fs.readFileSync(path.join(rootDir, 'functions', 'api', 'services', '_brevoEmailService.js'), 'utf8');
const privacyHtml = fs.readFileSync(path.join(rootDir, 'privacy.html'), 'utf8');
const termsHtml = fs.readFileSync(path.join(rootDir, 'terms.html'), 'utf8');
const disclaimerHtml = fs.readFileSync(path.join(rootDir, 'disclaimer.html'), 'utf8');
const respGambleHtml = fs.readFileSync(path.join(rootDir, 'responsible-gambling.html'), 'utf8');

// Setup DOM for index.html
const dom = new JSDOM(indexHtml, { url: 'https://deeppredictbet.com' });
const { document } = dom.window;

// -------------------------------------------------------------
// Suite 1: Corporate Email Hierarchy & Security Rules
// -------------------------------------------------------------
console.log('--- Suite 1: Official Corporate Email Hierarchy & Routing Allowlist ---');

it('Official corporate emails strictly defined: support@ and info@, admin@ not exposed as public support', () => {
  const contactCode = contactApiJs;
  if (!contactCode.includes('support@deeppredictbet.com')) throw new Error('Missing support@deeppredictbet.com in contact API');
  if (!contactCode.includes('info@deeppredictbet.com')) throw new Error('Missing info@deeppredictbet.com in contact API');
  if (contactCode.includes('CATEGORY_RECIPIENT_MAP') && contactCode.includes('admin@deeppredictbet.com')) {
    throw new Error('admin@deeppredictbet.com must not be mapped as public contact recipient');
  }
});

it('Backend Contact API maps customer queries strictly to support@ and corporate queries to info@', () => {
  const mapRegex = /const CATEGORY_RECIPIENT_MAP = {([\s\S]*?)};/;
  const match = contactApiJs.match(mapRegex);
  if (!match) throw new Error('CATEGORY_RECIPIENT_MAP not found in contact.js');

  const mapBody = match[1];
  ['account', 'technical', 'vip', 'payment', 'other'].forEach(cat => {
    const r = new RegExp(`'${cat}'\\s*:\\s*DESK_SUPPORT`);
    if (!r.test(mapBody)) throw new Error(`Category ${cat} must route to DESK_SUPPORT`);
  });

  ['general', 'business', 'media', 'corporate'].forEach(cat => {
    const r = new RegExp(`'${cat}'\\s*:\\s*DESK_INFO`);
    if (!r.test(mapBody)) throw new Error(`Category ${cat} must route to DESK_INFO`);
  });
});

it('Backend Contact API enforces bot protection, CRLF sanitization, and rate limiting', () => {
  if (!contactApiJs.includes('hp_check') || !contactApiJs.includes('website')) {
    throw new Error('Contact API missing honeypot trap fields');
  }
  if (!contactApiJs.includes('cleanHeaderString') && !contactApiJs.includes('sanitizeHeaderValue')) {
    throw new Error('Contact API missing email header CRLF sanitization');
  }
  if (!contactApiJs.includes('rateLimitKey') || !contactApiJs.includes('submissionRateLimitMap')) {
    throw new Error('Contact API missing rate limiting protection');
  }
});

it('No Brevo API keys or internal credentials exposed in frontend code', () => {
  const frontendFiles = [indexHtml, routerJs, dashboardJs, uiJs];
  frontendFiles.forEach((content, i) => {
    if (content.includes('xkeysib-') || content.includes('BREVO_API_KEY')) {
      throw new Error(`Exposed secret detected in frontend file index ${i}`);
    }
  });
});

// -------------------------------------------------------------
// Suite 2: Public Routing Architecture
// -------------------------------------------------------------
console.log('\n--- Suite 2: Public Routing & Navigation Allowlist ---');

it('Router allows unauthenticated access to /contact, /support, /about, /help, /faq without redirect to login', () => {
  const pubRoutesRegex = /const PUBLIC_ROUTES = \[([\s\S]*?)\];/;
  const match = routerJs.match(pubRoutesRegex);
  if (!match) throw new Error('PUBLIC_ROUTES not found in router.js');

  const routes = match[1];
  ['/contact', '/support', '/about', '/help', '/faq'].forEach(r => {
    if (!routes.includes(`'${r}'`)) throw new Error(`PUBLIC_ROUTES missing ${r}`);
  });
});

it('Router registers hash and view mappings for contact, support, and about', () => {
  if (!routerJs.includes("'/contact'") || !routerJs.includes("viewId: 'view-contact'")) {
    throw new Error("Missing '/contact' view mapping");
  }
  if (!routerJs.includes("'/about'") || !routerJs.includes("viewId: 'view-about'")) {
    throw new Error("Missing '/about' view mapping");
  }
  if (!routerJs.includes("'/support'") || !routerJs.includes("viewId: 'view-help'")) {
    throw new Error("Missing '/support' view mapping");
  }
});

// -------------------------------------------------------------
// Suite 3: Global Website Footer Redesign
// -------------------------------------------------------------
console.log('\n--- Suite 3: Global Website Footer (Desktop & Mobile) ---');

it('Footer displays official brand identity with Deep (#10B981), Predict (#38BDF8), Bet (#EF4444)', () => {
  const footer = document.querySelector('footer.deeppredictbet-footer');
  if (!footer) throw new Error('Missing footer.deeppredictbet-footer element');

  const brandHtml = footer.innerHTML;
  if (!brandHtml.includes('#10b981') || !brandHtml.includes('#38bdf8') || !brandHtml.includes('#ef4444')) {
    throw new Error('Footer missing official brand colors');
  }
});

it('Footer presents mandatory non-bookmaker stance and company summary', () => {
  const footerText = document.querySelector('footer.deeppredictbet-footer').textContent;
  if (!footerText.includes('DeepPredictBet is a football intelligence and sports analytics platform')) {
    throw new Error('Footer missing official company summary');
  }
  if (!footerText.includes('not a bookmaker and does not accept or place bets')) {
    throw new Error('Footer missing mandatory non-bookmaker disclaimer');
  }
});

it('Desktop footer has 4 distinct logical columns with correct mailto links', () => {
  const footer = document.querySelector('.footer-desktop-view');
  if (!footer) throw new Error('Missing .footer-desktop-view in footer');

  const cols = footer.querySelectorAll('.footer-col-item');
  if (cols.length < 4) throw new Error(`Expected at least 4 footer columns, found ${cols.length}`);

  const supportLink = footer.querySelector('a[href^="mailto:support@deeppredictbet.com"]');
  if (!supportLink) throw new Error('Missing support@deeppredictbet.com mailto link in footer');

  const infoLink = footer.querySelector('a[href^="mailto:info@deeppredictbet.com"]');
  if (!infoLink) throw new Error('Missing info@deeppredictbet.com mailto link in footer');
});

it('Footer includes legal compliance links and 18+ Gamble Responsibly messaging', () => {
  const footer = document.querySelector('footer.deeppredictbet-footer');
  const text = footer.textContent;

  if (!text.includes('18+') || !text.includes('GAMBLE RESPONSIBLY')) {
    throw new Error('Footer missing 18+ Gamble Responsibly badge');
  }

  const links = Array.from(footer.querySelectorAll('a')).map(a => a.getAttribute('href'));
  ['/privacy', '/terms', '/disclaimer', '/responsible-gambling'].forEach(p => {
    if (!links.includes(p)) throw new Error(`Footer missing legal link to ${p}`);
  });
});

it('Footer dynamically binds copyright year placeholder', () => {
  const dynamicYearD = document.getElementById('footer-dynamic-year');
  const dynamicYearM = document.getElementById('footer-dynamic-year-m');
  if (!dynamicYearD || !dynamicYearM) {
    throw new Error('Footer missing dynamic year placeholders');
  }
  if (!uiJs.includes('updateFooterCopyrightYear')) {
    throw new Error('ui.js missing updateFooterCopyrightYear function');
  }
});

// -------------------------------------------------------------
// Suite 4: Dedicated Contact Us Page (/contact)
// -------------------------------------------------------------
console.log('\n--- Suite 4: Dedicated Contact Us Page (/contact) ---');

it('Dedicated Contact Us page view exists in DOM with header and department cards', () => {
  const contactView = document.getElementById('view-contact');
  if (!contactView) throw new Error('Missing #view-contact element');

  const title = contactView.querySelector('h1');
  if (!title || !title.textContent.includes('CONTACT DEEPPREDICTBET')) {
    throw new Error('Missing main heading CONTACT DEEPPREDICTBET');
  }

  const cards = contactView.querySelectorAll('.glass-card');
  if (cards.length < 2) throw new Error('Expected at least 2 department cards');

  const suppBtn = contactView.querySelector('a[href*="support@deeppredictbet.com"]');
  const infoBtn = contactView.querySelector('a[href*="info@deeppredictbet.com"]');
  if (!suppBtn || !infoBtn) throw new Error('Missing department mailto buttons');
});

it('Contact Us page includes complete interactive contact form with validation and honeypot', () => {
  const form = document.getElementById('contact-us-form');
  if (!form) throw new Error('Missing #contact-us-form');

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const categorySelect = document.getElementById('contact-category');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const consentBox = document.getElementById('contact-consent');
  const honeypot = document.getElementById('contact-hp');

  if (!nameInput || !emailInput || !categorySelect || !subjectInput || !messageInput || !consentBox) {
    throw new Error('Contact form missing required input fields');
  }
  if (!honeypot) throw new Error('Contact form missing honeypot anti-spam field');

  const categories = Array.from(categorySelect.options).map(o => o.value);
  ['Account Assistance', 'Technical Support', 'VIP Subscription', 'Payment Enquiry', 'General Enquiry', 'Business Partnership', 'Media & Press', 'Other'].forEach(c => {
    if (!categories.includes(c)) throw new Error(`Category select missing option: ${c}`);
  });
});

it('Contact form submission handler window.submitContactForm is globally defined and validates inputs', () => {
  if (!uiJs.includes('submitContactForm')) {
    throw new Error('Missing submitContactForm in js/ui.js');
  }
  if (!uiJs.includes('/api/contact')) {
    throw new Error('submitContactForm does not submit to /api/contact');
  }
});

// -------------------------------------------------------------
// Suite 5: Dedicated Help & Support Centre (/support)
// -------------------------------------------------------------
console.log('\n--- Suite 5: Dedicated Help & Support Centre (/support) ---');

it('Help & Support Centre view exists in DOM with 4 support categories', () => {
  const helpView = document.getElementById('view-help');
  if (!helpView) throw new Error('Missing #view-help element');

  const text = helpView.textContent;
  if (!text.includes('DEEPPREDICTBET HELP & SUPPORT CENTRE')) {
    throw new Error('Missing Help Centre header');
  }
  if (!text.includes('Account & Registration')) throw new Error('Missing Account & Registration category');
  if (!text.includes('Platform & Technical Support')) throw new Error('Missing Platform & Technical category');
  if (!text.includes('VIP Membership')) throw new Error('Missing VIP Membership category');
  if (!text.includes('Payments')) throw new Error('Missing Payments category');
});

it('Help Centre contains FAQ accordion items with verified platform features', () => {
  const faqItems = document.querySelectorAll('#view-help .faq-item');
  if (faqItems.length < 8) {
    throw new Error(`Expected at least 8 FAQ items, found ${faqItems.length}`);
  }
  if (!uiJs.includes('toggleFAQAccordion')) {
    throw new Error('Missing toggleFAQAccordion in js/ui.js');
  }
});

// -------------------------------------------------------------
// Suite 6: My DeepPredict Dashboard Help & Support Integration
// -------------------------------------------------------------
console.log('\n--- Suite 6: My DeepPredict Dashboard Help & Support Tab ---');

it('Dashboard includes Help & Support tab in sidebar items and active tab switcher', () => {
  if (!dashboardJs.includes("{ id: 'support', label: 'Help & Support', icon: '🛟' }")) {
    throw new Error('dashboard.js sidebarItems missing support tab');
  }
  if (!dashboardJs.includes("case 'support':") || !dashboardJs.includes("renderCustomerSupportTab")) {
    throw new Error('dashboard.js active customer tab switcher missing support case');
  }
});

it('Dashboard renders Customer Support tab with Report a Problem form', () => {
  if (!dashboardJs.includes('renderCustomerSupportTab')) {
    throw new Error('dashboard.js missing renderCustomerSupportTab function');
  }
  if (!dashboardJs.includes('submitDashboardProblemReport')) {
    throw new Error('dashboard.js missing submitDashboardProblemReport function');
  }
  if (!dashboardJs.includes('support@deeppredictbet.com')) {
    throw new Error('renderCustomerSupportTab missing direct support@ email');
  }
  if (!dashboardJs.includes('info@deeppredictbet.com')) {
    throw new Error('renderCustomerSupportTab missing corporate info@ email');
  }
});

it('Founder Analytics Console remains strictly segregated and administrator-only', () => {
  if (!dashboardJs.includes('function renderFounderDashboard')) {
    throw new Error('Founder Analytics dashboard function missing or modified');
  }
  if (!dashboardJs.includes('isFounderAuthenticated') && !dashboardJs.includes('isAdmin')) {
    throw new Error('Founder dashboard missing strict authentication gate');
  }
});

// -------------------------------------------------------------
// Suite 7: Legal Pages Consistency
// -------------------------------------------------------------
console.log('\n--- Suite 7: Legal & Policy Pages Contact Consistency ---');

it('privacy.html includes info@deeppredictbet.com for data protection and support@deeppredictbet.com for user queries', () => {
  if (!privacyHtml.includes('info@deeppredictbet.com')) throw new Error('privacy.html missing info@deeppredictbet.com');
  if (!privacyHtml.includes('support@deeppredictbet.com')) throw new Error('privacy.html missing support@deeppredictbet.com');
});

it('terms.html includes info@deeppredictbet.com for corporate and support@deeppredictbet.com for user support', () => {
  if (!termsHtml.includes('info@deeppredictbet.com')) throw new Error('terms.html missing info@deeppredictbet.com');
  if (!termsHtml.includes('support@deeppredictbet.com')) throw new Error('terms.html missing support@deeppredictbet.com');
});

it('disclaimer.html includes support@deeppredictbet.com and info@deeppredictbet.com', () => {
  if (!disclaimerHtml.includes('support@deeppredictbet.com')) throw new Error('disclaimer.html missing support@deeppredictbet.com');
  if (!disclaimerHtml.includes('info@deeppredictbet.com')) throw new Error('disclaimer.html missing info@deeppredictbet.com');
});

it('responsible-gambling.html includes support@deeppredictbet.com and 18+ Gamble Responsibly messaging', () => {
  if (!respGambleHtml.includes('support@deeppredictbet.com')) throw new Error('responsible-gambling.html missing support@deeppredictbet.com');
  if (!respGambleHtml.includes('18+') || !/gamble responsibly/i.test(respGambleHtml)) {
    throw new Error('responsible-gambling.html missing 18+ Gamble Responsibly messaging');
  }
});

// -------------------------------------------------------------
// Suite 8: Brevo Transactional Service Parity
// -------------------------------------------------------------
console.log('\n--- Suite 8: Brevo Transactional Email Service Parity ---');

it('Brevo service contains contact form dispatchers with verified sender and replyTo', () => {
  if (!brevoServiceJs.includes('sendContactFormNotification')) {
    throw new Error('_brevoEmailService.js missing sendContactFormNotification');
  }
  if (!brevoServiceJs.includes('sendContactFormAcknowledgement')) {
    throw new Error('_brevoEmailService.js missing sendContactFormAcknowledgement');
  }
  if (!brevoServiceJs.includes('noreply@deeppredictbet.com')) {
    throw new Error('_brevoEmailService.js missing verified sender noreply@deeppredictbet.com');
  }
  if (!brevoServiceJs.includes('support@deeppredictbet.com')) {
    throw new Error('_brevoEmailService.js missing default replyTo support@deeppredictbet.com');
  }
});

it('Existing transactional email functions preserved in _brevoEmailService.js', () => {
  const requiredFns = [
    'sendAccountVerificationEmail',
    'sendPasswordResetEmail',
    'sendPasswordChangedAlert',
    'sendAccountSecurityAlert',
    'sendVipPaymentSuccessEmail'
  ];
  requiredFns.forEach(fn => {
    if (!brevoServiceJs.includes(fn)) {
      throw new Error(`_brevoEmailService.js missing required transactional function: ${fn}`);
    }
  });
});

console.log('\n===============================================================');
console.log(`Results: ${passedTests} / ${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('===============================================================');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
