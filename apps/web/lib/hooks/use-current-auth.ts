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

  // 3. Cookie for Next.js middleware
  let sessionToken = 'demo_buyer_session';
  if (account.role === 'dealer') {
    sessionToken = 'demo_dealer_session';
  } else if (account.role === 'seller') {
    sessionToken = 'demo_seller_session';
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

    // 2. Resolve Role from cookie first (source of truth for middleware), falling back to storedAccount or zustand
    let effectiveRole: 'member' | 'seller' | 'dealer' | null = null;

    if (sessionCookie === 'demo_dealer_session') {
      effectiveRole = 'dealer';
    } else if (
      sessionCookie === 'demo_seller_session' ||
      sessionCookie === 'mock_active_session_token'
    ) {
      effectiveRole = 'seller';
    } else if (sessionCookie === 'demo_buyer_session' || sessionCookie === 'mock-buyer-session') {
      effectiveRole = 'member';
    } else if (storedAccount) {
      if (
        storedAccount.role === 'dealer' ||
        storedAccount.role === 'seller' ||
        storedAccount.role === 'member'
      ) {
        effectiveRole = storedAccount.role;
      }
    } else if (useDealerStore.getState().isAuthenticated) {
      effectiveRole = 'dealer';
    } else if (useBuyerStore.getState().isAuthenticated) {
      effectiveRole = 'member';
    }

    // If no valid session indicator exists, return unauthenticated
    if (
      !effectiveRole ||
      (!sessionCookie &&
        !storedAccount &&
        !useDealerStore.getState().isAuthenticated &&
        !useBuyerStore.getState().isAuthenticated)
    ) {
      return { isAuthenticated: false, role: null, user: null };
    }

    // 3. Resolve persona details based on effective role
    if (effectiveRole === 'dealer') {
      const dealerStoreAccount = useDealerStore.getState().account;
      const dealerEmail =
        storedAccount?.role === 'dealer'
          ? storedAccount.email
          : dealerStoreAccount?.email || 'contato@liderveiculos.com.br';
      const registered = findAccountByEmail(dealerEmail);
      const activeData =
        storedAccount?.role === 'dealer' ? storedAccount : registered || dealerStoreAccount;

      const dealershipDisplayName =
        activeData?.tradeName || activeData?.dealershipName || 'Líder Veículos';
      const user: CurrentUser = {
        id: activeData?.id || 'acc-dealer-001',
        name: dealershipDisplayName,
        firstName: dealershipDisplayName.split(' ')[0] || 'Líder',
        email: activeData?.email || 'contato@liderveiculos.com.br',
        role: 'dealer',
        roleLabel: 'Concessionária',
        status: activeData?.status || 'active',
        avatarInitials: computeInitials(dealershipDisplayName),
        dealershipName: activeData?.dealershipName || 'Líder Veículos e Seminovos Ltda',
        tradeName: activeData?.tradeName || 'Líder Seminovos',
      };
      return { isAuthenticated: true, role: 'dealer', user };
    }

    if (effectiveRole === 'seller') {
      const sellerEmail =
        storedAccount?.role === 'seller' ? storedAccount.email : 'vendedor@exemplo.com.br';
      const registered = findAccountByEmail(sellerEmail);
      const activeData = storedAccount?.role === 'seller' ? storedAccount : registered;

      const name = activeData?.fullName || 'Marcos Vinícius Silva';
      const user: CurrentUser = {
        id: activeData?.id || 'acc-seller-001',
        name,
        firstName: name.split(' ')[0] || 'Marcos',
        email: activeData?.email || 'vendedor@exemplo.com.br',
        role: 'seller',
        roleLabel: 'Vendedor Particular',
        status: activeData?.status || 'active',
        avatarInitials: computeInitials(name),
      };
      return { isAuthenticated: true, role: 'seller', user };
    }

    if (effectiveRole === 'member') {
      const buyerStoreProfile = useBuyerStore.getState().buyerProfile;
      const buyerEmail =
        storedAccount?.role === 'member'
          ? storedAccount.email
          : buyerStoreProfile?.email || 'comprador@exemplo.com.br';
      const registered = findAccountByEmail(buyerEmail);
      const activeData = storedAccount?.role === 'member' ? storedAccount : registered;

      const fullName =
        activeData?.fullName || buyerStoreProfile.fullName || 'Carlos Eduardo Mendes';
      const firstName = activeData?.fullName
        ? activeData.fullName.split(' ')[0]
        : buyerStoreProfile.firstName || 'Carlos';

      const user: CurrentUser = {
        id: activeData?.id || buyerStoreProfile.id || 'acc-buyer-001',
        name: fullName,
        firstName,
        email: activeData?.email || buyerStoreProfile.email || 'comprador@exemplo.com.br',
        role: 'member',
        roleLabel: 'Comprador',
        status: activeData?.status || 'active',
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
    createAdUrl = '/concessionaria/anuncios/novo';
    messagesUrl = '/concessionaria/mensagens';
  } else if (role === 'seller') {
    const dest = getRoleDestination('seller', status);
    dashboardUrl = dest.destination;
    createAdUrl = '/vendedor/anuncios/novo';
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
