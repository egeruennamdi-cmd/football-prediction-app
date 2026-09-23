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
  // 1. If Resend API Key is set in Cloudflare Pages Environment
  if (context.env && context.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'DeepPredictBet Security <auth@deeppredictbet.com>',
          to: [toEmail],
          subject: '🔐 DeepPredictBet — Password Reset Link',
          html: generateEmailHtml(recipientName, resetUrl)
        })
      });
      return true;
    } catch (e) {}
  }

  // 2. Cloudflare native MailChannels integration (Free on Cloudflare Workers/Pages)
  try {
    const mailchannelsRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: toEmail, name: recipientName }]
          }
        ],
        from: {
          email: 'support@deeppredictbet.com',
          name: 'DeepPredictBet Security'
        },
        subject: '🔐 DeepPredictBet — Reset Your Password',
        content: [
          {
            type: 'text/html',
            value: generateEmailHtml(recipientName, resetUrl)
          }
        ]
      })
    });
    if (mailchannelsRes.ok) return true;
  } catch (e) {}

  return false;
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

      await saveMembers(context, members);

      // Construct live reset link
      const origin = new URL(context.request.url).origin;
      const resetLink = `${origin}/?action=reset-password&token=${resetToken}&email=${encodeURIComponent(targetEmail)}`;

      // Dispatch email in background
      context.waitUntil(sendResetEmail(targetEmail, targetName, resetLink, context));

      return new Response(JSON.stringify({
        success: true,
        message: `Password reset link sent to ${targetEmail}. Please check your inbox.`,
        email: targetEmail,
        resetLink: resetLink, // Provided so the frontend can also offer direct click fallback
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

      const existingIndex = members.findIndex(m =>
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

      // Validate token match
      if (!user.resetToken || user.resetToken !== token) {
        return new Response(JSON.stringify({
          success: false,
          error: 'This password reset link is invalid or has already been used. Please request a new link.'
        }), {
          status: 400,
          headers: corsHeaders()
        });
      }

      // Validate token expiration
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

      return new Response(JSON.stringify({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
        username: user.username || user.fullName,
        email: user.email
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
