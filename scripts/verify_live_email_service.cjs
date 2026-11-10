const https = require('https');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- Probing Live Brevo Functions on https://deeppredictbet.pages.dev ---');
  
  // 1. Verify Email Endpoint (missing token rejection)
  const verifyRes = await get('https://deeppredictbet.pages.dev/api/verify-email');
  console.log('1. /api/verify-email status:', verifyRes.status);
  const verifyJson = JSON.parse(verifyRes.data);
  console.log('   Expected rejection code:', verifyJson.code, 'Success:', verifyJson.success);

  // 2. Admin Email Status Endpoint (Authoritative diagnostic)
  const statusRes = await get('https://deeppredictbet.pages.dev/api/admin/email-status?adminKey=deep_admin_78_key');
  console.log('2. /api/admin/email-status status:', statusRes.status);
  const statusJson = JSON.parse(statusRes.data);
  console.log('   Service:', statusJson.service);
  console.log('   Sender:', statusJson.fromEmail);
  console.log('   Reply-To:', statusJson.replyToEmail);
  console.log('   Key Configured in Cloudflare Secrets:', statusJson.configured);
  console.log('   Workflows:', statusJson.workflows.length);

  console.log('\n--- Probing Production Custom Domain https://deeppredictbet.com ---');
  const prodStatus = await get('https://deeppredictbet.com/api/admin/email-status?adminKey=deep_admin_78_key');
  console.log('3. deeppredictbet.com /api/admin/email-status status:', prodStatus.status);
  const prodJson = JSON.parse(prodStatus.data);
  console.log('   Service:', prodJson.service);
  console.log('   Sender:', prodJson.fromEmail);
  console.log('   Key Configured in Cloudflare Secrets:', prodJson.configured);
}

verify().catch(console.error);
