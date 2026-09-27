/**
 * DeepPredictBet Centralized Role-Based Access Control (RBAC) & Authorization Engine
 * Authoritative security layer for Administrator privileges, Founder Console access,
 * and user permission gating.
 */

(function () {
  'use strict';

  // Authoritative Administrator email and username registries
  const AUTHORITATIVE_ADMIN_EMAILS = [
    'admin@deeppredictbet.com',
    'egeruennamdi@gmail.com'
  ];

  const AUTHORITATIVE_ADMIN_USERNAMES = [
    'egeruennamdi78',
    'egeruennamdi'
  ];

  /**
   * Normalizes a role string consistently against formatting variations (e.g. 'ADMIN', 'admin', 'Admin').
   * Rejects non-string and empty inputs.
   *
   * @param {string} role - The candidate role string.
   * @returns {string} Normalized uppercase role string or empty string.
   */
  function normalizeRole(role) {
    if (!role || typeof role !== 'string') return '';
    return role.trim().toUpperCase();
  }

  /**
   * Authoritative Administrator check.
   * Strictly requires:
   * 1. authenticated === true (user is logged in)
   * 2. user.role === 'ADMIN' (normalized)
   * 3. Authoritative identity integrity verification (email or username matches registered admin records)
   *
   * Rejects:
   * - Unauthenticated callers
   * - Normal punters (USER)
   * - PRO Analysts (PRO)
   * - VIP Club members (VIP)
   * - Founder badges without authoritative admin credentials
   * - Tampered localStorage values where a non-admin sets role to 'ADMIN'
   *
   * @param {Object} [userCandidate] - Optional user object. If omitted, inspects active session.
   * @returns {boolean} True only if the user is an authorized administrator.
   */
  function isAdmin(userCandidate) {
    let user = userCandidate;

    // If no user object is passed, extract from current browser session
    if (!user) {
      const isLoggedIn = typeof localStorage !== 'undefined' && localStorage.getItem('userLoggedIn') === 'true';
      if (!isLoggedIn) return false;

      user = {
        email: (localStorage.getItem('currentUserEmail') || '').trim().toLowerCase(),
        username: (localStorage.getItem('currentUsername') || '').trim().toLowerCase(),
        role: (localStorage.getItem('user_role') || '').trim(),
        authenticated: true
      };
    }

    if (!user || typeof user !== 'object') return false;

    // Explicit check on authenticated flag if present
    if (user.authenticated !== undefined && !user.authenticated) return false;

    // Check if the session indicates logged in
    if (typeof localStorage !== 'undefined' && localStorage.getItem('userLoggedIn') !== 'true' && !userCandidate) {
      return false;
    }

    // Strict Role Normalization: Only explicit "ADMIN" is accepted
    const role = normalizeRole(user.role);
    if (role !== 'ADMIN') {
      // Rejects: 'USER', 'PRO', 'VIP', 'PUNTER', 'SUBSCRIBER', etc.
      return false;
    }

    // Authoritative Identity Integrity Check
    // Prevents client-side manipulation (e.g. user opening devtools and setting localStorage.user_role = 'ADMIN')
    const email = (user.email || '').trim().toLowerCase();
    const username = (user.username || '').trim().toLowerCase();

    const isPrimaryAdmin =
      AUTHORITATIVE_ADMIN_EMAILS.includes(email) ||
      AUTHORITATIVE_ADMIN_USERNAMES.includes(username);

    if (isPrimaryAdmin) {
      return true;
    }

    // Secondary check: verify against registered members ledger in localStorage if available
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('deep_registered_members');
        if (raw) {
          const members = JSON.parse(raw);
          if (Array.isArray(members)) {
            const found = members.find(m =>
              (m.email && m.email.toLowerCase() === email) ||
              (m.username && m.username.toLowerCase() === username)
            );
            // Must be found in ledger AND the ledger record itself must have role === 'ADMIN'
            if (found && normalizeRole(found.role) === 'ADMIN') {
              return true;
            }
          }
        }
      }
    } catch (e) {}

    // Identity could not be verified as an authoritative administrator
    return false;
  }

  /**
   * Centralized permission verification helper.
   * Supports both signatures:
   * - hasPermission('admin_analytics') -> checks current active session
   * - hasPermission(userObject, 'admin_analytics') -> checks specific user candidate
   *
   * @param {Object|string} userOrPerm - User candidate object OR permission string
   * @param {string} [maybePerm] - Permission string when user object is first parameter
   * @returns {boolean} True if the user has the requested permission.
   */
  function hasPermission(userOrPerm, maybePerm) {
    let targetUser = null;
    let permStr = '';

    if (maybePerm === undefined && typeof userOrPerm === 'string') {
      targetUser = getAuthenticatedUser();
      permStr = userOrPerm;
    } else {
      targetUser = userOrPerm || getAuthenticatedUser();
      permStr = maybePerm || '';
    }

    if (!permStr || typeof permStr !== 'string') return false;
    const perm = permStr.trim().toUpperCase();

    // Admin permissions: strictly reserved for verified Administrators
    if (
      perm === 'FOUNDER_ANALYTICS' ||
      perm === 'ADMIN_ANALYTICS' ||
      perm === 'ADMIN_CONSOLE' ||
      perm === 'VIEW_BI_METRICS' ||
      perm === 'EXPORT_ADMIN_DATA' ||
      perm === 'MANAGE_USERS' ||
      perm === 'ADMIN_USERS'
    ) {
      return isAdmin(targetUser);
    }

    const role = targetUser ? normalizeRole(targetUser.role) : '';
    const isUserAdmin = isAdmin(targetUser);

    if (perm === 'PRO_ANALYTICS' || perm === 'PRO_CONTENT') {
      return isUserAdmin || role === 'PRO' || role === 'VIP';
    }

    if (perm === 'VIP_PREDICTIONS' || perm === 'VIP_CONTENT' || perm === 'VIP_PASS') {
      return isUserAdmin || role === 'VIP';
    }

    if (perm === 'VIEW_DASHBOARD' || perm === 'VIEW_PREDICTIONS') {
      return !!(targetUser && targetUser.isLoggedIn);
    }

    return false;
  }

  /**
   * Retrieves sanitized metadata about the currently authenticated session.
   *
   * @returns {Object} Object containing email, username, normalized role, and isAdmin flag.
   */
  function getAuthenticatedUser() {
    if (typeof localStorage === 'undefined' || localStorage.getItem('userLoggedIn') !== 'true') {
      return {
        isLoggedIn: false,
        email: null,
        username: null,
        role: null,
        isAdmin: false
      };
    }

    const email = (localStorage.getItem('currentUserEmail') || '').trim();
    const username = (localStorage.getItem('currentUsername') || '').trim();
    const role = normalizeRole(localStorage.getItem('user_role') || 'USER');

    return {
      isLoggedIn: true,
      email: email,
      username: username,
      role: role,
      isAdmin: isAdmin()
    };
  }

  // Bind to global window object
  if (typeof window !== 'undefined') {
    window.normalizeRole = normalizeRole;
    window.isAdmin = isAdmin;
    window.hasPermission = hasPermission;
    window.getAuthenticatedUser = getAuthenticatedUser;
    window.AUTHORITATIVE_ADMIN_EMAILS = AUTHORITATIVE_ADMIN_EMAILS;
    window.AUTHORITATIVE_ADMIN_USERNAMES = AUTHORITATIVE_ADMIN_USERNAMES;
  }

  // Also support CommonJS / Node environment if tested in Node
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      normalizeRole,
      isAdmin,
      hasPermission,
      getAuthenticatedUser,
      AUTHORITATIVE_ADMIN_EMAILS,
      AUTHORITATIVE_ADMIN_USERNAMES
    };
  }
})();
