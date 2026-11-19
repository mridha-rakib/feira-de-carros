/**
 * Server-side session verification for Web application route protection.
 *
 * Security Principles:
 * 1. FAIL CLOSED IN PRODUCTION:
 *    Cryptographic session verification (JWT signature validation / auth service session endpoint)
 *    is not yet integrated. To prevent critical authentication bypass vulnerabilities,
 *    protected web routes in production strictly FAIL CLOSED. No client-writable cookies
 *    or mock tokens grant access.
 * 2. NO SUBSTRING/PREFIX ROLE GUESSING:
 *    Role permissions are NEVER inferred from cookie names, substrings, or prefixes.
 *    In dev/test mode, sessions are validated against an exact registered fixture token map.
 * 3. NO REQUEST-CONTROLLED BYPASSES:
 *    Request cookies, headers (x-fdc-test-env), query parameters, or user agents
 *    can never disable production security or enable test mode.
 */

import { isProductionEnvironment } from './environment';

export type WebAccountRole = 'member' | 'seller' | 'dealer' | 'main_admin' | 'sales' | 'support';
export type WebAccountStatus =
  | 'active'
  | 'pending_approval'
  | 'correction_required'
  | 'suspended'
  | 'rejected';

export interface WebSessionClaim {
  id: string;
  email: string;
  role: WebAccountRole;
  status: WebAccountStatus;
}

export type WebSessionRejectionReason =
  | 'MISSING_COOKIE'
  | 'EMPTY_COOKIE'
  | 'PRODUCTION_AUTH_FAIL_CLOSED'
  | 'INVALID_SESSION_TOKEN'
  | 'UNAUTHORIZED_ROLE';

export interface WebSessionVerificationResult {
  isValid: boolean;
  reason?: WebSessionRejectionReason;
  claim?: WebSessionClaim;
}

/**
 * Recognized fixture tokens exclusively permitted in local development and E2E test harnesses.
 * Maps exact token strings to verified claims without substring matching.
 */
const REGISTERED_FIXTURE_SESSIONS: Record<string, WebSessionClaim> = {
  // Buyer sessions
  demo_buyer_session: {
    id: 'acc-buyer-001',
    email: 'comprador@exemplo.com.br',
    role: 'member',
    status: 'active',
  },
  'mock-buyer-session': {
    id: 'acc-buyer-001',
    email: 'comprador@exemplo.com.br',
    role: 'member',
    status: 'active',
  },
  demo_buyer_suspended_session: {
    id: 'acc-buyer-suspended',
    email: 'comprador.suspenso@exemplo.com',
    role: 'member',
    status: 'suspended',
  },

  // Seller sessions (Active)
  demo_seller_session: {
    id: 'acc-seller-approved',
    email: 'vendedor.aprovado@exemplo.com.br',
    role: 'seller',
    status: 'active',
  },
  mock_active_session_token: {
    id: 'acc-seller-approved',
    email: 'vendedor.aprovado@exemplo.com.br',
    role: 'seller',
    status: 'active',
  },
  // Seller sessions (Pending & Correction)
  demo_seller_pending_session: {
    id: 'acc-seller-pending',
    email: 'vendedor.pendente@exemplo.com',
    role: 'seller',
    status: 'pending_approval',
  },
  demo_seller_correction_session: {
    id: 'acc-seller-correction',
    email: 'vendedor.corrigir@exemplo.com',
    role: 'seller',
    status: 'correction_required',
  },

  // Dealership sessions (Active)
  demo_dealer_session: {
    id: 'acc-dealer-approved',
    email: 'dealer.aprovada@exemplo.com',
    role: 'dealer',
    status: 'active',
  },
  // Dealership sessions (Pending, Correction, Suspended)
  demo_dealer_pending_session: {
    id: 'acc-dealer-pending',
    email: 'dealer.pendente@exemplo.com',
    role: 'dealer',
    status: 'pending_approval',
  },
  demo_dealer_correction_session: {
    id: 'acc-dealer-correction',
    email: 'dealer.corrigir@exemplo.com',
    role: 'dealer',
    status: 'correction_required',
  },
  demo_dealer_suspended_session: {
    id: 'acc-dealer-suspended',
    email: 'dealer.suspenso@exemplo.com',
    role: 'dealer',
    status: 'suspended',
  },
};

export function verifyWebSession(
  cookieValue: string | undefined | null,
  options?: { isProduction?: boolean },
): WebSessionVerificationResult {
  if (!cookieValue) {
    return { isValid: false, reason: 'MISSING_COOKIE' };
  }

  const token = cookieValue.trim();
  if (!token) {
    return { isValid: false, reason: 'EMPTY_COOKIE' };
  }

  const isProd = options?.isProduction ?? isProductionEnvironment();

  // PRODUCTION ROUTE PROTECTION: STRICTLY FAIL-CLOSED
  // In production, no mock tokens or client-written cookies grant access.
  if (isProd) {
    return { isValid: false, reason: 'PRODUCTION_AUTH_FAIL_CLOSED' };
  }

  // DEVELOPMENT & LOCAL TEST HARNESS (!isProd ONLY)
  // Exact token match lookup. NEVER substring or prefix matching.
  const claim = REGISTERED_FIXTURE_SESSIONS[token];
  if (!claim) {
    return { isValid: false, reason: 'INVALID_SESSION_TOKEN' };
  }

  return {
    isValid: true,
    claim,
  };
}
