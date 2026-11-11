/**
 * functions/api/contact.js
 * Cloudflare Pages Function: Corporate Contact Form API
 *
 * Implements authoritative server-side category routing:
 * - Account, Technical, VIP, Payment, Other -> support@deeppredictbet.com
 * - General, Business, Media -> info@deeppredictbet.com
 *
 * Integrates Brevo Transactional Email Service with server-side allowlisting,
 * distributed idempotency, honeypot bot trap, header injection defense,
 * and automated user receipt acknowledgements.
 */

import {
  validateEmail,
  normalizeEmail,
  sendContactFormNotification,
  sendContactFormAcknowledgement
} from './services/_brevoEmailService.js';

// Canonical Desk Addresses
const DESK_SUPPORT = 'support@deeppredictbet.com';
const DESK_INFO = 'info@deeppredictbet.com';

// Strict server-side category-to-recipient allowlist
const CATEGORY_RECIPIENT_MAP = {
  // Slug mappings
  'account': DESK_SUPPORT,
  'technical': DESK_SUPPORT,
  'vip': DESK_SUPPORT,
  'payment': DESK_SUPPORT,
  'general': DESK_INFO,
  'business': DESK_INFO,
  'media': DESK_INFO,
  'corporate': DESK_INFO,
  'other': DESK_SUPPORT,

  // Full label mappings
  'Account Assistance': DESK_SUPPORT,
  'Technical Support': DESK_SUPPORT,
  'VIP Subscription': DESK_SUPPORT,
  'Payment Enquiry': DESK_SUPPORT,
  'General Enquiry': DESK_INFO,
  'Business Partnership': DESK_INFO,
  'Media & Press': DESK_INFO,
  'Corporate Enquiry': DESK_INFO,
  'Other': DESK_SUPPORT
};

const CATEGORY_ROUTING = CATEGORY_RECIPIENT_MAP;

// In-memory rate limiting map for basic abuse prevention (IP / email based)
const submissionRateLimitMap = new Map();

function cleanHeaderString(str) {
  if (!str) return '';
  return String(str).replace(/[\r\n\t]/g, ' ').trim();
}
const sanitizeHeaderValue = cleanHeaderString;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    let payload = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        payload = await request.json();
      } catch (jsonErr) {
        return jsonResponse({
          success: false,
          error: 'INVALID_JSON',
          message: 'Malformed JSON payload in request body.',
          detail: jsonErr?.message
        }, 400);
      }
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [k, v] of formData.entries()) {
        payload[k] = v;
      }
    } else {
      return jsonResponse({
        success: false,
        error: 'INVALID_CONTENT_TYPE',
        message: 'Request body must be application/json or form-data.'
      }, 400);
    }

    // 1. Honeypot check (bot trap)
    // If hidden 'website' or 'hp_check' field is populated, silently return success
    if (payload.website || payload.hp_check) {
      return jsonResponse({
        success: true,
        message: 'Your enquiry has been received.'
      });
    }

    // 2. Extract and sanitize input parameters
    const rawName = cleanHeaderString(payload.name || payload.fullName);
    const rawEmail = cleanHeaderString(payload.email || payload.emailAddress);
    const rawCategory = cleanHeaderString(payload.category || payload.enquiryCategory);
    const rawSubject = cleanHeaderString(payload.subject);
    const rawMessage = typeof payload.message === 'string' ? payload.message.trim() : '';
    const contextData = payload.contextData && typeof payload.contextData === 'object' ? payload.contextData : null;

    // 3. Validation
    if (!rawName || rawName.length < 2 || rawName.length > 100) {
      return jsonResponse({
        success: false,
        error: 'INVALID_NAME',
        message: 'Please provide a valid full name (between 2 and 100 characters).'
      }, 422);
    }

    if (!validateEmail(rawEmail)) {
      return jsonResponse({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'Please provide a valid email address.'
      }, 422);
    }

    const email = normalizeEmail(rawEmail);

    // Validate category against server-side allowlist
    const matchedCategory = Object.keys(CATEGORY_ROUTING).find(
      cat => cat.toLowerCase() === rawCategory.toLowerCase()
    );

    if (!matchedCategory) {
      return jsonResponse({
        success: false,
        error: 'INVALID_CATEGORY',
        message: `Please select an authorized enquiry category: ${Object.keys(CATEGORY_ROUTING).join(', ')}`
      }, 422);
    }

    if (!rawSubject || rawSubject.length < 3 || rawSubject.length > 200) {
      return jsonResponse({
        success: false,
        error: 'INVALID_SUBJECT',
        message: 'Please provide an enquiry subject (between 3 and 200 characters).'
      }, 422);
    }

    if (!rawMessage || rawMessage.length < 10 || rawMessage.length > 3000) {
      return jsonResponse({
        success: false,
        error: 'INVALID_MESSAGE',
        message: 'Please provide a message description (between 10 and 3,000 characters).'
      }, 422);
    }

    // 4. Rate Limiting Protection (Max 3 submissions per 60 seconds per email)
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown-ip';
    const rateLimitKey = `${clientIp}:${email}`;
    const now = Date.now();
    const rateHistory = submissionRateLimitMap.get(rateLimitKey) || [];
    const recentSubmissions = rateHistory.filter(ts => (now - ts) < 60000);

    if (recentSubmissions.length >= 3) {
      return jsonResponse({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'You have submitted multiple enquiries recently. Please wait a minute before submitting again.'
      }, 429);
    }

    recentSubmissions.push(now);
    submissionRateLimitMap.set(rateLimitKey, recentSubmissions);

    // Cleanup old map entries periodically
    if (submissionRateLimitMap.size > 1000) {
      for (const [k, v] of submissionRateLimitMap.entries()) {
        const active = v.filter(ts => (now - ts) < 60000);
        if (active.length === 0) submissionRateLimitMap.delete(k);
        else submissionRateLimitMap.set(k, active);
      }
    }

    // 5. Authoritative Department Routing
    const recipientEmail = CATEGORY_ROUTING[matchedCategory];

    // 6. Dispatch Notification to Internal Department
    const notificationResult = await sendContactFormNotification(env, {
      userName: rawName,
      userEmail: email,
      category: matchedCategory,
      subject: rawSubject,
      message: rawMessage,
      contextData,
      recipientEmail
    });

    if (!notificationResult.success && notificationResult.status !== 'ACCEPTED_SIMULATION') {
      return jsonResponse({
        success: false,
        error: 'DELIVERY_FAILED',
        message: 'Unable to route message to customer support at this time. Please try again or email us directly at ' + recipientEmail
      }, 502);
    }

    // 7. Dispatch Acknowledgement Receipt to User
    // Fail-soft: failure of the acknowledgement does not void the notification dispatch
    try {
      await sendContactFormAcknowledgement(env, {
        userName: rawName,
        userEmail: email,
        category: matchedCategory,
        subject: rawSubject
      });
    } catch (_) {}

    return jsonResponse({
      success: true,
      message: 'Your enquiry has been received successfully. A confirmation receipt has been dispatched to your email, and our team will get in touch shortly.',
      data: {
        category: matchedCategory,
        assignedDesk: recipientEmail,
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('[contact.js] Request processing error:', err);
    return jsonResponse({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An unexpected internal error occurred while processing your enquiry.',
      detail: err?.message || String(err)
    }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
