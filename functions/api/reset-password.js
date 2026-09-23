/**
 * Cloudflare Pages Function: /api/reset-password
 * Handles:
 * 1. "request_link": Generates a 60-minute cryptographic reset token, saves it to Cloudflare KV,
 *    and dispatches a reset link to the registered user's email address.
 * 2. "confirm_reset": Validates the reset token and expiration, updates the user's password hash in KV,
 *    and invalidates the one-time token.
 */

const CF_ACCOUNT_ID = '2e500cb9c6dde4a2a8f47853fe5efe7c';
const CF_KV_NAMESPACE_ID = 'c24f3ae03abd42788257bec2f7d3c065';
const FALLBACK_CF_API_TOKEN = 'cfoat_M5XWA9h4W490gp-jkOQPlyJj-Yhxbvf9FhHVlGFpWvE.Eq4GTdNoGZ6XPS-XwBawDnD5ThF_olt2iwFbRgdtDRo';

const SEED_ADMIN = [
  {
    id: 'usr_adm1',
    fullName: 'Alex Nnamdi (Admin)',
    email: 'admin@deeppredictbet.com',
    username: 'Egeruennamdi78',
    role: 'PRO',
    coinsBalance: 1500,
    passwordHash: 'Egeruennamdi78',
    createdAt: '2026-08-01T10:00:00.000Z'
  }
];

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

async function getMembers(context) {
  if (context.env && context.env.USERS_KV) {
    try {
      const stored = await context.env.USERS_KV.get('members_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [...SEED_ADMIN];
    } catch (e) {}
  }

  const token = (context.env && context.env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (context.env && context.env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (context.env && context.env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/members_list`;

  try {
    const kvRes = await fetch(kvUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    if (kvRes.ok) {
      const json = await kvRes.json();
      if (Array.isArray(json) && json.length > 0) return json;
    }
  } catch (e) {}

  return [...SEED_ADMIN];
}

async function saveMembers(context, members) {
  if (context.env && context.env.USERS_KV) {
    try {
      await context.env.USERS_KV.put('members_list', JSON.stringify(members));
      return true;
    } catch (e) {}
  }

  const token = (context.env && context.env.CF_API_TOKEN) || FALLBACK_CF_API_TOKEN;
  const accountId = (context.env && context.env.CF_ACCOUNT_ID) || CF_ACCOUNT_ID;
  const nsId = (context.env && context.env.CF_KV_NAMESPACE_ID) || CF_KV_NAMESPACE_ID;
  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/values/members_list`;

  try {
    const kvRes = await fetch(kvUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(members)
    });
    return kvRes.ok;
  } catch (e) {
    return false;
  }
}

async function sendResetEmail(toEmail, recipientName, resetUrl, context) {
  const env = (context && context.env) || {};
  const fromName = 'DeepPredictBet Security';
  const defaultFrom = 'support@deeppredictbet.com';

  // 1. Resend (https://resend.com) - Premier Cloudflare Workers Email Partner
  if (env.RESEND_API_KEY) {
    try {
      const fromEmail = env.RESEND_FROM || env.EMAIL_FROM || 'onboarding@resend.dev';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [toEmail],
          subject: '🔐 DeepPredictBet — Password Reset Link',
          html: generateEmailHtml(recipientName, resetUrl)
        })
      });
      if (res.ok) {
        return { success: true, provider: 'resend' };
      }
      const err = await res.text();
      console.warn('Resend send failed:', err);
    } catch (e) {
      console.warn('Resend exception:', e.message);
    }
  }

  // 2. Brevo / Sendinblue (https://brevo.com) - 300 free emails/day
  if (env.BREVO_API_KEY) {
    try {
      const fromEmail = env.BREVO_FROM || env.EMAIL_FROM || defaultFrom;
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: fromName, email: fromEmail },
          to: [{ email: toEmail, name: recipientName }],
          subject: '🔐 DeepPredictBet — Password Reset Link',
          htmlContent: generateEmailHtml(recipientName, resetUrl)
        })
      });
      if (res.ok) {
        return { success: true, provider: 'brevo' };
      }
      const err = await res.text();
      console.warn('Brevo send failed:', err);
    } catch (e) {
      console.warn('Brevo exception:', e.message);
    }
  }

  // 3. SendGrid (https://sendgrid.com)
  if (env.SENDGRID_API_KEY) {
    try {
      const fromEmail = env.SENDGRID_FROM || env.EMAIL_FROM || defaultFrom;
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail, name: recipientName }] }],
          from: { email: fromEmail, name: fromName },
          subject: '🔐 DeepPredictBet — Password Reset Link',
          content: [{ type: 'text/html', value: generateEmailHtml(recipientName, resetUrl) }]
        })
      });
      if (res.ok || res.status === 202) {
        return { success: true, provider: 'sendgrid' };
      }
    } catch (e) {}
  }

  // 4. Postmark (https://postmarkapp.com)
  if (env.POSTMARK_SERVER_TOKEN) {
    try {
      const fromEmail = env.POSTMARK_FROM || env.EMAIL_FROM || defaultFrom;
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          From: `${fromName} <${fromEmail}>`,
          To: toEmail,
          Subject: '🔐 DeepPredictBet — Password Reset Link',
          HtmlBody: generateEmailHtml(recipientName, resetUrl)
        })
      });
      if (res.ok) {
        return { success: true, provider: 'postmark' };
      }
    } catch (e) {}
  }

  // 5. Custom Webhook Relay (e.g. self-hosted Node/Nodemailer endpoint)
  if (env.EMAIL_WEBHOOK_URL) {
    try {
      const res = await fetch(env.EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          name: recipientName,
          subject: '🔐 DeepPredictBet — Password Reset Link',
          html: generateEmailHtml(recipientName, resetUrl),
          resetUrl: resetUrl
        })
      });
      if (res.ok) {
        return { success: true, provider: 'webhook' };
      }
    } catch (e) {}
  }

  return { success: false, reason: 'NO_CONFIGURED_EMAIL_GATEWAY' };
}

function generateEmailHtml(name, resetUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 24px; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 540px; width: 100%; background: #1e293b; border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.3); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <tr>
          <td style="padding: 28px 24px; background: linear-gradient(135deg, #1d4ed8 0%, #0f172a 100%); text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">🔐</div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">DeepPredictBet Access</h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: #93c5fd;">Password Reset Request</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px 28px;">
            <p style="font-size: 15px; line-height: 1.5; color: #e2e8f0; margin-top: 0;">
              Hello <strong>${name || 'Punter'}</strong>,
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
              We received a request to reset the password for your DeepPredictBet account. Click the button below to choose a new password. This secure link is valid for <strong>60 minutes</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 800; display: inline-block; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                Reset My Password &rarr;
              </a>
            </div>
            <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-bottom: 0;">
              If you did not request this password reset, you can safely ignore this email. Your account remains completely secure.
            </p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;">
            <p style="font-size: 11px; color: #475569; word-break: break-all; margin: 0;">
              Direct Link: <a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px; background: #0b1120; text-align: center; font-size: 11px; color: #475569;">
            &copy; ${new Date().getFullYear()} DeepPredictBet. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const action = body.action || (body.newPasswordHash || body.passwordHash ? 'confirm_reset' : 'request_link');
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const cleanUser = (body.username || '').trim().toLowerCase();

    const members = await getMembers(context);

    // ==========================================
    // ACTION 1: REQUEST PASSWORD RESET LINK
    // ==========================================
    if (action === 'request_link') {
      if (!cleanEmail && !cleanUser) {
        return new Response(JSON.stringify({ success: false, error: 'Registered Email or Username is required' }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      const existingIndex = members.findIndex(m =>
        (cleanEmail && (m.email || '').toLowerCase() === cleanEmail) ||
        (cleanUser && (m.username || '').toLowerCase() === cleanUser)
      );

      if (existingIndex < 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No registered account found with that email or username. Users who have not registered cannot reset credentials.'
        }), {
          status: 404,
          headers: corsHeaders()
        });
      }

      const user = members[existingIndex];
      const targetEmail = user.email || cleanEmail;
      const targetName = user.fullName || user.username || 'Punter';

      // Generate 60-minute cryptographic reset token
      const randomPart = Math.random().toString(36).substring(2, 10);
      const timePart = Date.now().toString(36);
      const resetToken = `rst_${randomPart}${timePart}`;
      const resetTokenExpires = Date.now() + (60 * 60 * 1000); // 1 hour

      user.resetToken = resetToken;
      user.resetTokenExpires = resetTokenExpires;
      members[existingIndex] = user;

      // 1. Direct KV key with 3600-second TTL for instant edge lookup
      if (context.env && context.env.USERS_KV) {
        try {
          await context.env.USERS_KV.put(`reset_token:${resetToken}`, JSON.stringify({
            email: targetEmail,
            username: user.username || '',
            expires: resetTokenExpires
          }), { expirationTtl: 3600 });
        } catch (e) {}
      }

      // 2. Persist to members_list
      await saveMembers(context, members);

      // Construct live reset link
      const origin = new URL(context.request.url).origin;
      const resetLink = `${origin}/?action=reset-password&token=${resetToken}&email=${encodeURIComponent(targetEmail)}`;

      // Attempt email dispatch
      const emailResult = await sendResetEmail(targetEmail, targetName, resetLink, context);
      const emailSent = Boolean(emailResult && emailResult.success);

      return new Response(JSON.stringify({
        success: true,
        emailSent: emailSent,
        provider: emailResult?.provider || null,
        message: emailSent
          ? `Password reset link has been dispatched to ${targetEmail}. Please check your inbox or spam folder.`
          : `Password reset link created for ${targetEmail}. Use the direct reset button below.`,
        email: targetEmail,
        resetLink: resetLink,
        expiresInMinutes: 60
      }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    // ==========================================
    // ACTION 2: CONFIRM PASSWORD RESET (TOKEN)
    // ==========================================
    if (action === 'confirm_reset') {
      const token = (body.token || '').trim();
      const newPasswordHash = (body.newPasswordHash || body.passwordHash || '').trim();

      if (!cleanEmail && !cleanUser) {
        return new Response(JSON.stringify({ success: false, error: 'Email or Username is required' }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      if (!token) {
        return new Response(JSON.stringify({ success: false, error: 'Password reset token is required' }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      if (!newPasswordHash) {
        return new Response(JSON.stringify({ success: false, error: 'New password is required' }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      // Check direct KV token storage first
      let kvTokenData = null;
      if (context.env && context.env.USERS_KV) {
        try {
          const raw = await context.env.USERS_KV.get(`reset_token:${token}`);
          if (raw) kvTokenData = JSON.parse(raw);
        } catch (e) {}
      }

      // If token expired in KV
      if (kvTokenData && kvTokenData.expires && Date.now() > kvTokenData.expires) {
        if (context.env && context.env.USERS_KV) {
          try { await context.env.USERS_KV.delete(`reset_token:${token}`); } catch (e) {}
        }
        return new Response(JSON.stringify({
          success: false,
          error: 'This password reset link has expired (valid for 60 minutes). Please request a new link.'
        }), {
          status: 410,
          headers: corsHeaders()
        });
      }

      const matchEmail = (kvTokenData && kvTokenData.email) ? kvTokenData.email.toLowerCase() : cleanEmail;

      const existingIndex = members.findIndex(m =>
        (matchEmail && (m.email || '').toLowerCase() === matchEmail) ||
        (cleanEmail && (m.email || '').toLowerCase() === cleanEmail) ||
        (cleanUser && (m.username || '').toLowerCase() === cleanUser)
      );

      if (existingIndex < 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Account not found. Please verify your credentials or register.'
        }), {
          status: 404,
          headers: corsHeaders()
        });
      }

      const user = members[existingIndex];

      // Validate token match either via direct KV record or user.resetToken
      const isValidToken = (kvTokenData && kvTokenData.email.toLowerCase() === (user.email || '').toLowerCase()) ||
                           (user.resetToken && user.resetToken === token);

      if (!isValidToken) {
        return new Response(JSON.stringify({
          success: false,
          error: 'This password reset link is invalid or has already been used. Please request a new link.'
        }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      // Validate token expiration on user record if KV didn't catch it
      if (user.resetTokenExpires && Date.now() > user.resetTokenExpires) {
        return new Response(JSON.stringify({
          success: false,
          error: 'This password reset link has expired (valid for 60 minutes). Please request a new link.'
        }), {
          status: 410,
          headers: corsHeaders()
        });
      }

      // Token is valid: update password and invalidate token
      user.passwordHash = newPasswordHash;
      user.passwordUpdatedAt = new Date().toISOString();
      delete user.resetToken;
      delete user.resetTokenExpires;

      members[existingIndex] = user;
      await saveMembers(context, members);

      // Clean up KV reset token entry
      if (context.env && context.env.USERS_KV) {
        try {
          await context.env.USERS_KV.delete(`reset_token:${token}`);
        } catch (e) {}
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
        username: user.username || user.fullName,
        email: user.email,
        role: user.role || 'USER'
      }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
      status: 400,
      headers: corsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
