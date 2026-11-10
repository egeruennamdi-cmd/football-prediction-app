/**
 * Cloudflare Pages Function: /api/verify-email
 * Authoritative Server-Side Email Address Verification
 * Validates cryptographic verification token against Cloudflare KV and members_list.
 */

import { corsHeaders, getMembers, saveMembers } from './_kvHelper.js';
import { hashToken, getTokenKv, deleteTokenKv, isTokenExpired, verifyTokenMatch } from './services/_tokenSecurityService.js';

function getCorsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: getCorsHeaders() });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const token = (url.searchParams.get('token') || '').trim();
  const email = (url.searchParams.get('email') || '').trim().toLowerCase();
  const acceptHeader = context.request.headers.get('Accept') || '';

  const verificationResult = await processVerification(context, { token, email });

  // If the browser accessed directly, render a clean styled confirmation page
  if (acceptHeader.includes('text/html')) {
    const isSuccess = verificationResult.success;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${isSuccess ? 'Email Verified' : 'Verification Issue'} — DeepPredictBet</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 24px; background: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; box-sizing: border-box; }
    .card { background: #111827; border: 1.5px solid ${isSuccess ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}; border-radius: 16px; padding: 36px 28px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.6); }
    h1 { margin: 12px 0 8px 0; font-size: 22px; font-weight: 800; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0; }
    .btn { display: inline-block; background: ${isSuccess ? '#10b981' : '#2563eb'}; color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 8px; font-weight: 800; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 42px;">${isSuccess ? '✅' : '⚠️'}</div>
    <h1 style="color: ${isSuccess ? '#10b981' : '#f87171'};">${isSuccess ? 'Account Verified!' : 'Verification Link Expired'}</h1>
    <p>${verificationResult.message || verificationResult.error}</p>
    <a href="https://deeppredictbet.com/?auth=login" class="btn">Proceed to DeepPredictBet &rarr;</a>
  </div>
</body>
</html>`;
    return new Response(html, {
      status: isSuccess ? 200 : 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify(verificationResult), {
    status: verificationResult.success ? 200 : 400,
    headers: getCorsHeaders()
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));
    const token = (body.token || '').trim();
    const email = (body.email || '').trim().toLowerCase();

    const verificationResult = await processVerification(context, { token, email });
    return new Response(JSON.stringify(verificationResult), {
      status: verificationResult.success ? 200 : 400,
      headers: getCorsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Verification failed.'
    }), {
      status: 500,
      headers: getCorsHeaders()
    });
  }
}

async function processVerification(context, { token, email }) {
  if (!token) {
    return {
      success: false,
      code: 'MISSING_TOKEN',
      error: 'Verification token is required.'
    };
  }

  const tokenHash = await hashToken(token);

  // 1. Direct KV Lookup: check cryptographic hash key first, then legacy unhashed fallback
  let kvRecord = await getTokenKv(context.env, `verify_token:${tokenHash}`);
  if (!kvRecord) {
    kvRecord = await getTokenKv(context.env, `verify_token:${token}`);
  }

  // Check server-side expiration TTL
  if (kvRecord && isTokenExpired(kvRecord.expires)) {
    await deleteTokenKv(context.env, `verify_token:${tokenHash}`);
    await deleteTokenKv(context.env, `verify_token:${token}`);
    return {
      success: false,
      code: 'TOKEN_EXPIRED',
      error: 'This email verification link has expired (valid for 24 hours). Please request a new verification link.'
    };
  }

  // 2. Authoritative members_list search with safe migration & timing-safe matching
  const members = await getMembers(context);
  const targetEmail = (kvRecord && kvRecord.email) ? kvRecord.email.toLowerCase() : email;

  let matchedIndex = -1;
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const isCandidateUser = !targetEmail || (m.email && m.email.toLowerCase() === targetEmail);
    if (!isCandidateUser && !kvRecord) continue;

    const storedHashOrToken = m.verificationTokenHash || m.verificationToken;
    if (storedHashOrToken && await verifyTokenMatch(token, storedHashOrToken)) {
      matchedIndex = i;
      break;
    }
  }

  if (matchedIndex < 0) {
    return {
      success: false,
      code: 'INVALID_TOKEN',
      error: 'This verification link is invalid or has already been used. Please log in or request a new link.'
    };
  }

  const user = members[matchedIndex];

  // If already verified
  if (user.emailVerified) {
    return {
      success: true,
      alreadyVerified: true,
      message: 'Your email address is already verified! You can log in to your account.',
      email: user.email,
      username: user.username
    };
  }

  // Verify expiration on user record if KV didn't catch it
  if (isTokenExpired(user.verificationTokenExpires)) {
    return {
      success: false,
      code: 'TOKEN_EXPIRED',
      error: 'This verification link has expired. Please request a new verification email.'
    };
  }

  // Authoritatively activate verification & single-use consumption
  user.emailVerified = true;
  user.emailVerifiedAt = new Date().toISOString();
  delete user.verificationToken;
  delete user.verificationTokenHash;
  delete user.verificationTokenExpires;

  members[matchedIndex] = user;
  await saveMembers(context, members);

  // Invalidate one-time KV token entry
  await deleteTokenKv(context.env, `verify_token:${tokenHash}`);
  await deleteTokenKv(context.env, `verify_token:${token}`);

  return {
    success: true,
    message: 'Your email address has been successfully verified! Welcome to DeepPredictBet.',
    email: user.email,
    username: user.username,
    fullName: user.fullName
  };
}
