'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { useDealerStore } from '../../stores/use-dealer-store';
import {
  type AccountRole,
  type AccountStatus,
  type AuthAccount,
  findAccountByEmail,
  getRoleDestination,
} from '../adapters/shared-auth-registry';
import { verifyWebSession } from '../security/session-verifier';

export interface CurrentUser {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: AccountRole;
  roleLabel: string;
  status: AccountStatus;
  avatarInitials: string;
  dealershipName?: string;
  tradeName?: string;
}

export interface CurrentAuthState {
  isMounted: boolean;
  isAuthenticated: boolean;
  role: 'member' | 'seller' | 'dealer' | null;
  user: CurrentUser | null;
  dashboardUrl: string;
  createAdUrl: string;
  messagesUrl: string;
  logout: (redirectTarget?: string) => void;
}

export const AUTH_CHANGED_EVENT = 'fdc-auth-changed';
export const ACTIVE_AUTH_STORAGE_KEY = 'fdc_active_auth_account';

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function computeInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Global helper to log in a user and set cookies, storage, and stores coherently.
 */
export function setAuthenticatedAccount(account: AuthAccount): void {
  if (typeof window === 'undefined') return;

  // 1. Synchronize zustand stores first
  if (account.role === 'dealer') {
    useBuyerStore.getState().logoutSimulation();
    useDealerStore.getState().loginSimulation(account.email, account);
  } else if (account.role === 'seller') {
    useBuyerStore.getState().logoutSimulation();
    useDealerStore.getState().logout();
  } else if (account.role === 'member') {
    useDealerStore.getState().logout();
    useBuyerStore.getState().loginSimulation(account.email, account.fullName);
  }

  // 2. Authoritative localStorage active auth account
  try {
    localStorage.setItem(ACTIVE_AUTH_STORAGE_KEY, JSON.stringify(account));
  } catch (err) {
    console.warn('Failed to store active auth account in localStorage', err);
  }

  // 3. Status-aware session cookie for Next.js middleware
  let sessionToken = 'demo_buyer_session';
  if (account.role === 'dealer') {
    if (account.status === 'pending_approval') {
      sessionToken = 'demo_dealer_pending_session';
    } else if (account.status === 'correction_required') {
      sessionToken = 'demo_dealer_correction_session';
    } else if (account.status === 'suspended') {
      sessionToken = 'demo_dealer_suspended_session';
    } else {
      sessionToken = 'demo_dealer_session';
    }
  } else if (account.role === 'seller') {
    if (account.status === 'pending_approval') {
      sessionToken = 'demo_seller_pending_session';
    } else if (account.status === 'correction_required') {
      sessionToken = 'demo_seller_correction_session';
    } else {
      sessionToken = 'demo_seller_session';
    }
  } else if (account.role === 'member') {
    if (account.status === 'suspended') {
      sessionToken = 'demo_buyer_suspended_session';
    } else {
      sessionToken = 'demo_buyer_session';
    }
  }
  document.cookie = `fdc_web_session=${sessionToken}; path=/; SameSite=Lax`;

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

/**
 * Global helper to execute unified logout.
 */
export function executeUnifiedLogout(redirectTarget = '/entrar'): void {
  if (typeof document !== 'undefined') {
    document.cookie =
      'fdc_web_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ACTIVE_AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  useBuyerStore.getState().logoutSimulation();
  useDealerStore.getState().logout();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    if (redirectTarget) {
      window.location.href = redirectTarget;
    }
  }
}

/**
 * Unified client-side hook providing complete, consistent, role-aware identity & navigation state.
 */
export function useCurrentAuth(): CurrentAuthState {
  const [isMounted, setIsMounted] = useState(false);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    role: 'member' | 'seller' | 'dealer' | null;
    user: CurrentUser | null;
  }>({
    isAuthenticated: false,
    role: null,
    user: null,
  });

  const resolveCurrentState = useCallback((): {
    isAuthenticated: boolean;
    role: 'member' | 'seller' | 'dealer' | null;
    user: CurrentUser | null;
  } => {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, role: null, user: null };
    }

    const sessionCookie = getCookieValue('fdc_web_session');

    // Authoritative verification via session verifier:
    // If cookie is missing, empty, or invalid, client state MUST evaluate to unauthenticated guest immediately.
    // LocalStorage or Zustand stores must NEVER be treated as independent authentication authorities.
    const verification = verifyWebSession(sessionCookie);
    if (!verification.isValid || !verification.claim) {
      try {
        localStorage.removeItem(ACTIVE_AUTH_STORAGE_KEY);
      } catch {
        // ignore
      }
      return { isAuthenticated: false, role: null, user: null };
    }

    const cookieClaim = verification.claim;
    const cookieRole = cookieClaim.role;

    if (cookieRole !== 'member' && cookieRole !== 'seller' && cookieRole !== 'dealer') {
      return { isAuthenticated: false, role: null, user: null };
    }

    // 1. Check stored active auth account in localStorage
    let storedAccount: AuthAccount | null = null;
    try {
      const raw = localStorage.getItem(ACTIVE_AUTH_STORAGE_KEY);
      if (raw) {
        storedAccount = JSON.parse(raw);
      }
    } catch {
      storedAccount = null;
    }

    // Mismatch detection: if storedAccount exists but storedAccount.role !== cookieRole,
    // clear stale storage and fail closed to unauthenticated state immediately.
    if (storedAccount && storedAccount.role !== cookieRole) {
      try {
        localStorage.removeItem(ACTIVE_AUTH_STORAGE_KEY);
      } catch {
        // ignore
      }
      return { isAuthenticated: false, role: null, user: null };
    }

    // 2. Resolve persona details based on verified cookie claim and registered account
    if (cookieRole === 'dealer') {
      const dealerStoreAccount = useDealerStore.getState().account;
      const dealerEmail =
        storedAccount?.role === 'dealer'
          ? storedAccount.email
          : cookieClaim.email || dealerStoreAccount?.email || 'dealer.aprovada@exemplo.com';
      const registered = findAccountByEmail(dealerEmail);
      const activeData =
        storedAccount?.role === 'dealer' ? storedAccount : registered || dealerStoreAccount;

      const dealershipDisplayName =
        activeData?.tradeName ||
        activeData?.dealershipName ||
        (cookieClaim.status === 'pending_approval' ? 'Autovale Multimarcas' : 'Líder Veículos');
      const user: CurrentUser = {
        id: activeData?.id || cookieClaim.id || 'acc-dealer-001',
        name: dealershipDisplayName,
        firstName: dealershipDisplayName.split(' ')[0] || 'Líder',
        email: dealerEmail,
        role: 'dealer',
        roleLabel: 'Concessionária',
        status: cookieClaim.status,
        avatarInitials: computeInitials(dealershipDisplayName),
        dealershipName:
          activeData?.dealershipName ||
          (cookieClaim.status === 'pending_approval'
            ? 'Autovale Comércio de Veículos Ltda'
            : 'Líder Veículos e Seminovos Ltda'),
        tradeName: dealershipDisplayName,
      };
      return { isAuthenticated: true, role: 'dealer', user };
    }

    if (cookieRole === 'seller') {
      const sellerEmail =
        storedAccount?.role === 'seller'
          ? storedAccount.email
          : cookieClaim.email || 'vendedor.aprovado@exemplo.com.br';
      const registered = findAccountByEmail(sellerEmail);
      const activeData = storedAccount?.role === 'seller' ? storedAccount : registered;

      const name =
        activeData?.fullName ||
        (cookieClaim.status === 'pending_approval'
          ? 'Patrícia Alvarenga'
          : 'Marcos Vinícius Silva');
      const user: CurrentUser = {
        id: activeData?.id || cookieClaim.id || 'acc-seller-001',
        name,
        firstName: name.split(' ')[0] || 'Marcos',
        email: sellerEmail,
        role: 'seller',
        roleLabel: 'Vendedor Particular',
        status: cookieClaim.status,
        avatarInitials: computeInitials(name),
      };
      return { isAuthenticated: true, role: 'seller', user };
    }

    if (cookieRole === 'member') {
      const buyerStoreProfile = useBuyerStore.getState().buyerProfile;
      const buyerEmail =
        storedAccount?.role === 'member'
          ? storedAccount.email
          : cookieClaim.email || buyerStoreProfile?.email || 'comprador@exemplo.com.br';
      const registered = findAccountByEmail(buyerEmail);
      const activeData = storedAccount?.role === 'member' ? storedAccount : registered;

      const fullName =
        activeData?.fullName || buyerStoreProfile.fullName || 'Carlos Eduardo Mendes';
      const firstName = activeData?.fullName
        ? activeData.fullName.split(' ')[0]
        : buyerStoreProfile.firstName || 'Carlos';

      const user: CurrentUser = {
        id: activeData?.id || cookieClaim.id || buyerStoreProfile.id || 'acc-buyer-001',
        name: fullName,
        firstName,
        email: buyerEmail,
        role: 'member',
        roleLabel: 'Comprador',
        status: cookieClaim.status,
        avatarInitials: buyerStoreProfile.avatarInitials || computeInitials(fullName),
      };
      return { isAuthenticated: true, role: 'member', user };
    }

    return { isAuthenticated: false, role: null, user: null };
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setAuthState(resolveCurrentState());

    const handleUpdate = () => {
      setAuthState(resolveCurrentState());
    };

    window.addEventListener(AUTH_CHANGED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Subscribe to zustand stores
    const unsubBuyer = useBuyerStore.subscribe(handleUpdate);
    const unsubDealer = useDealerStore.subscribe(handleUpdate);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      unsubBuyer();
      unsubDealer();
    };
  }, [resolveCurrentState]);

  // Compute destination URLs dynamically based on active status & role
  const user = authState.user;
  const role = authState.role;
  const status = user?.status || 'active';

  let dashboardUrl = '/conta';
  let createAdUrl = '/vendedor/solicitacao';
  let messagesUrl = '/mensagens';

  if (role === 'dealer') {
    const dest = getRoleDestination('dealer', status);
    dashboardUrl = dest.destination;
    if (status === 'pending_approval') {
      createAdUrl = '/concessionaria/solicitacao/status';
    } else if (status === 'correction_required') {
      createAdUrl = '/concessionaria/solicitacao/corrigir';
    } else {
      createAdUrl = '/concessionaria/anuncios/novo';
    }
    messagesUrl = '/concessionaria/mensagens';
  } else if (role === 'seller') {
    const dest = getRoleDestination('seller', status);
    dashboardUrl = dest.destination;
    if (status === 'pending_approval') {
      createAdUrl = '/vendedor/solicitacao/status';
    } else if (status === 'correction_required') {
      createAdUrl = '/vendedor/solicitacao/corrigir';
    } else {
      createAdUrl = '/vendedor/anuncios/novo';
    }
    messagesUrl = '/vendedor/mensagens';
  } else if (role === 'member') {
    dashboardUrl = '/conta';
    createAdUrl = '/vendedor/solicitacao';
    messagesUrl = '/mensagens';
  } else {
    dashboardUrl = '/entrar';
    createAdUrl = '/vendedor/solicitacao';
    messagesUrl = '/mensagens';
  }

  const logout = useCallback((redirectTarget = '/entrar') => {
    executeUnifiedLogout(redirectTarget);
  }, []);

  return {
    isMounted,
    isAuthenticated: authState.isAuthenticated,
    role: authState.role,
    user: authState.user,
    dashboardUrl,
    createAdUrl,
    messagesUrl,
    logout,
  };
}
