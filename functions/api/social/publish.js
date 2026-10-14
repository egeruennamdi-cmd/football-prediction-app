/**
 * Cloudflare Pages Function: /api/social/publish
 * 
 * Centralized Social Media Publishing & Governance Endpoint
 * Supports approval-first publishing, multi-platform dispatch, factual validation,
 * duplicate prevention, scheduling, and audit trail.
 * 
 * Protected strictly by Administrator Authorization Headers.
 */

import { verifyAdminAuthorization, adminCorsHeaders } from '../integrations/telegram/_adminAuth.js';
import {
  getSocialContentList,
  getSocialContentById,
  saveSocialContent,
  deleteSocialContent,
  getSocialAuditHistory,
  recordSocialAuditEvent,
  checkDuplicateSocialContent,
  transitionContentState,
  validateSocialContentFacts,
  computeContentFingerprint,
  SOCIAL_LIFECYCLE_STATES,
  SOCIAL_CONTENT_CATEGORIES
} from './_socialKv.js';
import {
  executeMultiPlatformDispatch,
  getSocialAccountsHealth
} from './_socialAdapters.js';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: adminCorsHeaders() });
}

/**
 * GET /api/social/publish
 * Returns content library, approval queue, scheduled dispatches, and audit history
 */
export async function onRequestGet(context) {
  const { env, request } = context;

  // Strict Admin Privilege Verification
  const auth = await verifyAdminAuthorization(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  try {
    const url = new URL(request.url);
    const categoryFilter = url.searchParams.get('category');
    const stateFilter = url.searchParams.get('state');

    const filter = {};
    if (categoryFilter) filter.category = categoryFilter;
    if (stateFilter) filter.state = stateFilter;

    const contentList = await getSocialContentList(env, filter);
    const auditHistory = await getSocialAuditHistory(env, 60);
    const accounts = await getSocialAccountsHealth(env);

    const pendingApproval = contentList.filter(c => c.state === SOCIAL_LIFECYCLE_STATES.AWAITING_APPROVAL);
    const scheduled = contentList.filter(c => c.state === SOCIAL_LIFECYCLE_STATES.SCHEDULED);
    const published = contentList.filter(c => c.state === SOCIAL_LIFECYCLE_STATES.PUBLISHED);

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        total: contentList.length,
        pendingApproval: pendingApproval.length,
        scheduled: scheduled.length,
        published: published.length
      },
      contentList,
      auditHistory,
      accounts
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Failed to retrieve social publishing data: ${err.message}`
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}

/**
 * POST /api/social/publish
 * Dispatches or schedules content across social channels with approval-first governance
 */
export async function onRequestPost(context) {
  const { env, request } = context;

  // Strict Admin Privilege Verification
  const auth = await verifyAdminAuthorization(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  const userEmail = (auth.user && auth.user.email) || 'admin@deeppredictbet.com';

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON request body.' }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    const { action = 'DISPATCH_NOW', content, contentId, scheduledAt, comment, overrideDuplicate } = body;

    // 1. ACTION: APPROVE DRAFT
    if (action === 'APPROVE') {
      const targetId = contentId || (content && content.id);
      if (!targetId) {
        return new Response(JSON.stringify({ success: false, error: 'Missing contentId to approve.' }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }
      const updated = await transitionContentState(env, targetId, SOCIAL_LIFECYCLE_STATES.APPROVED, userEmail, comment || 'Approved by Administrator');
      return new Response(JSON.stringify({
        success: true,
        message: 'Content successfully approved for publication.',
        content: updated
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // 2. ACTION: REQUEST APPROVAL (Move Draft to Awaiting Approval)
    if (action === 'REQUEST_APPROVAL') {
      const saved = await saveSocialContent(env, {
        ...(content || {}),
        state: SOCIAL_LIFECYCLE_STATES.AWAITING_APPROVAL
      }, userEmail);

      return new Response(JSON.stringify({
        success: true,
        message: 'Draft submitted to approval queue.',
        content: saved
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // 3. ACTION: SAVE DRAFT
    if (action === 'SAVE_DRAFT') {
      const saved = await saveSocialContent(env, {
        ...(content || {}),
        state: SOCIAL_LIFECYCLE_STATES.DRAFT
      }, userEmail);

      return new Response(JSON.stringify({
        success: true,
        message: 'Draft saved to library.',
        content: saved
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // 4. ACTION: SCHEDULE PUBLICATION
    if (action === 'SCHEDULE') {
      if (!scheduledAt) {
        return new Response(JSON.stringify({ success: false, error: 'scheduledAt timestamp is required for scheduling.' }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      const itemToSchedule = contentId
        ? await getSocialContentById(env, contentId)
        : content;

      if (!itemToSchedule) {
        return new Response(JSON.stringify({ success: false, error: 'Content item not found.' }), {
          status: 404,
          headers: adminCorsHeaders()
        });
      }

      // Pre-schedule factual validation
      const val = validateSocialContentFacts(itemToSchedule);
      if (!val.valid) {
        return new Response(JSON.stringify({
          success: false,
          error: `Cannot schedule invalid content: ${val.errors.join('; ')}`,
          validationErrors: val.errors
        }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      const scheduledItem = await saveSocialContent(env, {
        ...itemToSchedule,
        state: SOCIAL_LIFECYCLE_STATES.SCHEDULED,
        scheduledAt: new Date(scheduledAt).toISOString(),
        approver: userEmail,
        approvedAt: new Date().toISOString()
      }, userEmail);

      await recordSocialAuditEvent(env, {
        contentId: scheduledItem.id,
        action: 'CONTENT_SCHEDULED',
        scheduledAt: scheduledItem.scheduledAt,
        user: userEmail
      });

      return new Response(JSON.stringify({
        success: true,
        message: `Content scheduled for dispatch at ${scheduledItem.scheduledAt}`,
        content: scheduledItem
      }), {
        status: 200,
        headers: adminCorsHeaders()
      });
    }

    // 5. ACTION: DISPATCH NOW
    if (action === 'DISPATCH_NOW') {
      let itemToPublish = contentId
        ? await getSocialContentById(env, contentId)
        : content;

      if (!itemToPublish) {
        return new Response(JSON.stringify({ success: false, error: 'No content payload provided for dispatch.' }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      // Factual Validation Gate
      const val = validateSocialContentFacts(itemToPublish);
      if (!val.valid) {
        return new Response(JSON.stringify({
          success: false,
          error: `FACTUAL_VALIDATION_FAILED: ${val.errors.join('; ')}`,
          validationErrors: val.errors
        }), {
          status: 400,
          headers: adminCorsHeaders()
        });
      }

      // Duplicate Publication Prevention Check
      const primaryPlatform = Object.keys(itemToPublish.platforms || {})[0] || 'telegram';
      const primaryCopy = (itemToPublish.platforms && itemToPublish.platforms[primaryPlatform] && itemToPublish.platforms[primaryPlatform].copy) || '';
      const mediaUrl = (itemToPublish.platforms && itemToPublish.platforms[primaryPlatform] && itemToPublish.platforms[primaryPlatform].mediaUrl) || itemToPublish.mediaUrl || '';
      const fingerprint = await computeContentFingerprint(itemToPublish.category, itemToPublish.matchId, primaryCopy, mediaUrl);

      if (!overrideDuplicate) {
        const duplicate = await checkDuplicateSocialContent(env, fingerprint, 24 * 60 * 60 * 1000);
        if (duplicate) {
          return new Response(JSON.stringify({
            success: false,
            error: `DUPLICATE_CONTENT_DETECTED: Identical content was published within the past 24 hours (ID: ${duplicate.id}, publishedAt: ${duplicate.publishedAt || duplicate.updatedAt}).`,
            duplicateItem: duplicate
          }), {
            status: 409,
            headers: adminCorsHeaders()
          });
        }
      }

      // Mark as PUBLISHING in KV
      const publishingItem = await saveSocialContent(env, {
        ...itemToPublish,
        state: SOCIAL_LIFECYCLE_STATES.PUBLISHING,
        approver: userEmail,
        approvedAt: new Date().toISOString()
      }, userEmail);

      // Execute multi-platform dispatch
      const platformResults = await executeMultiPlatformDispatch(env, publishingItem);

      // Analyze outcomes
      const allStatuses = Object.values(platformResults).map(r => r.status);
      let finalState = SOCIAL_LIFECYCLE_STATES.PUBLISHED;

      if (allStatuses.includes('UNCERTAIN')) {
        finalState = SOCIAL_LIFECYCLE_STATES.UNCERTAIN;
      } else if (allStatuses.every(s => s === 'FAILED')) {
        finalState = SOCIAL_LIFECYCLE_STATES.FAILED;
      }

      const publishedItem = await saveSocialContent(env, {
        ...publishingItem,
        state: finalState,
        platformResults,
        publishedAt: new Date().toISOString()
      }, userEmail);

      await recordSocialAuditEvent(env, {
        contentId: publishedItem.id,
        action: 'CONTENT_DISPATCHED',
        finalState,
        platformResults,
        user: userEmail
      });

      return new Response(JSON.stringify({
        success: finalState === SOCIAL_LIFECYCLE_STATES.PUBLISHED || finalState === SOCIAL_LIFECYCLE_STATES.UNCERTAIN,
        state: finalState,
        platformResults,
        content: publishedItem
      }), {
        status: finalState === SOCIAL_LIFECYCLE_STATES.FAILED ? 502 : 200,
        headers: adminCorsHeaders()
      });
    }

    return new Response(JSON.stringify({ success: false, error: `Unrecognized action "${action}".` }), {
      status: 400,
      headers: adminCorsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Social publishing dispatch error: ${err.message}`
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}

/**
 * DELETE /api/social/publish
 * Deletes a draft or cancels a scheduled item
 */
export async function onRequestDelete(context) {
  const { env, request } = context;

  const auth = await verifyAdminAuthorization(context);
  if (!auth.authorized) {
    return new Response(JSON.stringify({
      success: false,
      error: auth.error || 'Forbidden: Administrator privileges required.'
    }), {
      status: auth.statusCode || 403,
      headers: adminCorsHeaders()
    });
  }

  const userEmail = (auth.user && auth.user.email) || 'admin@deeppredictbet.com';

  try {
    const url = new URL(request.url);
    const contentId = url.searchParams.get('id');

    if (!contentId) {
      return new Response(JSON.stringify({ success: false, error: 'Missing content ID parameter (?id=).' }), {
        status: 400,
        headers: adminCorsHeaders()
      });
    }

    const deleted = await deleteSocialContent(env, contentId, userEmail);
    if (!deleted) {
      return new Response(JSON.stringify({ success: false, error: `Content item "${contentId}" not found.` }), {
        status: 404,
        headers: adminCorsHeaders()
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Content item "${contentId}" deleted successfully.`
    }), {
      status: 200,
      headers: adminCorsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: `Delete error: ${err.message}`
    }), {
      status: 500,
      headers: adminCorsHeaders()
    });
  }
}
