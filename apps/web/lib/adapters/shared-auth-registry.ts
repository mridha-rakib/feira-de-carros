/**
 * Feira de Carros — Shared Authentication & Demo Account Registry
 *
 * Implements the explicit client decisions:
 * 1. AUTH-022: NO ACCOUNT CONVERSION. Buyer, Individual Seller, and Dealership are separate accounts.
 * 2. GLOBAL EMAIL UNIQUENESS (Option 2): One email address may belong to only one account
 *    across the entire platform (Buyer, Seller, or Dealership).
 *
 * Security Invariants:
 * - Passwords and raw secrets are never persisted in browser storage.
 * - In production mode without a live backend (/v1/auth/login), demo auth fails closed.
 * - Unknown emails are rejected (no auto-generated demo identities).
 * - Redirect URLs are sanitized against open redirect, backslash, and protocol-relative attacks.
 */

import { isProductionEnvironment } from '../security/environment';

export type AccountRole =
  | 'member' // Buyer
  | 'seller' // Individual Seller
  | 'dealer' // Dealership Advertiser
  | 'sales' // Staff: Sales
  | 'support' // Staff: Support
  | 'main_admin'; // Staff: Main Admin

export type AccountStatus =
  | 'active'
  | 'pending_approval'
  | 'correction_required'
  | 'suspended'
  | 'rejected';

export interface AuthAccount {
  id: string;
  email: string;
  normalizedEmail: string;
  fullName: string;
  role: AccountRole;
  status: AccountStatus;
  phone?: string;
  documentNumber?: string; // CPF or CNPJ (masked for safety)
  birthDate?: string;
  dealershipId?: string;
  dealershipName?: string;
  tradeName?: string;
  createdAt: string;
  rejectionReason?: string;
  correctionFields?: string[];
}

/**
 * Standard deterministic passwords permitted for seed demo fixture accounts in dev/test mode.
 * Real production authentication relies exclusively on backend POST /v1/auth/login.
 */
export const DEMO_FIXTURE_PASSWORD = 'Senha@123';
const VALID_DEMO_PASSWORDS = new Set(['Senha@123', '123456']);

/**
 * Normalizes an email address consistently across all flows.
 * Lowercases and trims whitespace.
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Validates standard email syntax.
 */
export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(normalized);
}

/**
 * Seed demo accounts across all personas to guarantee deterministic simulation.
 */
export const INITIAL_DEMO_ACCOUNTS: AuthAccount[] = [
  // 1. BUYER (Active)
  {
    id: 'acc-buyer-001',
    email: 'comprador@exemplo.com.br',
    normalizedEmail: 'comprador@exemplo.com.br',
    fullName: 'Carlos Eduardo Mendes',
    role: 'member',
    status: 'active',
    phone: '(31) 98765-4321',
    birthDate: '1990-05-15',
    createdAt: '2026-10-01T10:00:00Z',
  },
  // 2. BUYER (Google demo)
  {
    id: 'acc-buyer-google',
    email: 'comprador.google@exemplo.com',
    normalizedEmail: 'comprador.google@exemplo.com',
    fullName: 'Comprador Google Demo',
    role: 'member',
    status: 'active',
    phone: '(31) 98888-7777',
    birthDate: '1992-08-20',
    createdAt: '2026-10-15T12:00:00Z',
  },
  // 3. BUYER (Apple demo)
  {
    id: 'acc-buyer-apple',
    email: 'comprador.apple@exemplo.com',
    normalizedEmail: 'comprador.apple@exemplo.com',
    fullName: 'Comprador Apple Demo',
    role: 'member',
    status: 'active',
    phone: '(31) 98888-6666',
    birthDate: '1991-03-12',
    createdAt: '2026-10-15T12:00:00Z',
  },
  // 4. BUYER (Suspended)
  {
    id: 'acc-buyer-suspended',
    email: 'comprador.suspenso@exemplo.com',
    normalizedEmail: 'comprador.suspenso@exemplo.com',
    fullName: 'Comprador Suspenso Teste',
    role: 'member',
    status: 'suspended',
    phone: '(31) 97777-6666',
    birthDate: '1985-03-10',
    createdAt: '2026-09-01T08:00:00Z',
  },

  // 4. INDIVIDUAL SELLER (Active)
  {
    id: 'acc-seller-001',
    email: 'vendedor@exemplo.com.br',
    normalizedEmail: 'vendedor@exemplo.com.br',
    fullName: 'Marcos Vinícius Silva',
    role: 'seller',
    status: 'active',
    phone: '(31) 99123-4567',
    documentNumber: '***.456.789-**',
    birthDate: '1988-11-25',
    createdAt: '2026-10-05T14:30:00Z',
  },
  // 5. INDIVIDUAL SELLER (Pending Approval)
  {
    id: 'acc-seller-pending',
    email: 'vendedor.pendente@exemplo.com',
    normalizedEmail: 'vendedor.pendente@exemplo.com',
    fullName: 'Juliana Castro',
    role: 'seller',
    status: 'pending_approval',
    phone: '(31) 99234-5678',
    documentNumber: '***.321.654-**',
    birthDate: '1995-04-12',
    createdAt: '2026-11-10T09:00:00Z',
  },
  // 6. INDIVIDUAL SELLER (Correction Required)
  {
    id: 'acc-seller-correction',
    email: 'vendedor.corrigir@exemplo.com',
    normalizedEmail: 'vendedor.corrigir@exemplo.com',
    fullName: 'Roberto Albuquerque',
    role: 'seller',
    status: 'correction_required',
    phone: '(31) 99345-6789',
    documentNumber: '***.789.123-**',
    birthDate: '1982-07-30',
    createdAt: '2026-11-08T11:00:00Z',
    rejectionReason: 'Comprovante de residência ilegível ou divergente.',
    correctionFields: ['address', 'proof_of_residence'],
  },

  // 7. DEALERSHIP (Active)
  {
    id: 'acc-dealer-001',
    email: 'contato@liderveiculos.com.br',
    normalizedEmail: 'contato@liderveiculos.com.br',
    fullName: 'Rodrigo Fontes (Gerente)',
    role: 'dealer',
    status: 'active',
    phone: '(31) 3822-4000',
    documentNumber: '11.***.***/0001-81',
    dealershipId: 'dealer-lider-seminovos',
    dealershipName: 'Líder Veículos e Seminovos Ltda',
    tradeName: 'Líder Seminovos',
    createdAt: '2026-10-10T16:00:00Z',
  },
  // 8. DEALERSHIP (Pending Approval)
  {
    id: 'acc-dealer-pending',
    email: 'dealer.pendente@exemplo.com',
    normalizedEmail: 'dealer.pendente@exemplo.com',
    fullName: 'Fernanda Lima',
    role: 'dealer',
    status: 'pending_approval',
    phone: '(31) 3824-5500',
    documentNumber: '22.***.***/0001-81',
    dealershipId: 'dealer-autovale-multimarcas',
    dealershipName: 'Autovale Comércio de Veículos Ltda',
    tradeName: 'Autovale Multimarcas',
    createdAt: '2026-11-15T15:00:00Z',
  },
  // 9. DEALERSHIP (Correction Required)
  {
    id: 'acc-dealer-correction',
    email: 'dealer.corrigir@exemplo.com',
    normalizedEmail: 'dealer.corrigir@exemplo.com',
    fullName: 'Lucas Pinheiro',
    role: 'dealer',
    status: 'correction_required',
    phone: '(31) 3821-6600',
    documentNumber: '33.***.***/0001-03',
    dealershipId: 'dealer-novaera-veiculos',
    dealershipName: 'Nova Era Automóveis Eireli',
    tradeName: 'Nova Era Veículos',
    createdAt: '2026-11-12T10:00:00Z',
    rejectionReason: 'Razão social divergente do cartão CNPJ da Receita Federal.',
    correctionFields: ['legal_name', 'cnpj'],
  },
  // 10. DEALERSHIP (Suspended)
  {
    id: 'acc-dealer-suspended',
    email: 'dealer.suspenso@exemplo.com',
    normalizedEmail: 'dealer.suspenso@exemplo.com',
    fullName: 'Antônio Prado',
    role: 'dealer',
    status: 'suspended',
    phone: '(31) 3820-9999',
    documentNumber: '44.***.***/0001-14',
    dealershipId: 'dealer-valemotors-bloqueada',
    dealershipName: 'Vale Motors Bloqueada Ltda',
    tradeName: 'Vale Motors',
    createdAt: '2026-08-20T11:00:00Z',
    rejectionReason: 'Conta suspensa por violação das políticas comerciais.',
  },

  // 11. STAFF: Main Admin (for /admin boundary verification)
  {
    id: 'acc-staff-admin',
    email: 'admin@feiradecarros.com.br',
    normalizedEmail: 'admin@feiradecarros.com.br',
    fullName: 'Administrador do Sistema',
    role: 'main_admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  // 12. STAFF: Sales
  {
    id: 'acc-staff-sales',
    email: 'vendas@feiradecarros.com.br',
    normalizedEmail: 'vendas@feiradecarros.com.br',
    fullName: 'Operador Comercial',
    role: 'sales',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  // 13. STAFF: Support
  {
    id: 'acc-staff-support',
    email: 'suporte@feiradecarros.com.br',
    normalizedEmail: 'suporte@feiradecarros.com.br',
    fullName: 'Atendente de Suporte',
    role: 'support',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

const STORAGE_KEY_REGISTRY = 'feira_shared_accounts_registry';

/**
 * In-memory fallback and local-storage synchronization for demo accounts.
 */
let inMemoryAccounts: AuthAccount[] | null = null;

export function getAccountsRegistry(): AuthAccount[] {
  if (typeof window === 'undefined') {
    if (!inMemoryAccounts) {
      inMemoryAccounts = [...INITIAL_DEMO_ACCOUNTS];
    }
    return inMemoryAccounts;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
      return [...INITIAL_DEMO_ACCOUNTS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [...INITIAL_DEMO_ACCOUNTS];
  } catch {
    return [...INITIAL_DEMO_ACCOUNTS];
  }
}

export function saveAccountsRegistry(accounts: AuthAccount[]): void {
  if (typeof window === 'undefined') {
    inMemoryAccounts = [...accounts];
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to persist accounts registry:', err);
  }
}

/**
 * Resets the demo registry back to default initial fixtures.
 * Useful for test isolation.
 */
export function resetAccountsRegistry(): void {
  inMemoryAccounts = [...INITIAL_DEMO_ACCOUNTS];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
    } catch {
      // ignore
    }
  }
}

/**
 * Checks whether an email address is already registered in the platform (GLOBAL EMAIL UNIQUENESS).
 * Returns true if an account exists with the normalized email under ANY role.
 */
export function isEmailRegisteredGlobally(email: string): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const accounts = getAccountsRegistry();
  return accounts.some((a) => a.normalizedEmail === normalized);
}

/**
 * Finds an account by email across all roles.
 */
export function findAccountByEmail(email: string): AuthAccount | undefined {
  const normalized = normalizeEmail(email);
  if (!normalized) return undefined;
  const accounts = getAccountsRegistry();
  return accounts.find((a) => a.normalizedEmail === normalized);
}

/**
 * In-flight registrations to prevent concurrent duplicate submissions.
 */
const inFlightRegistrations = new Set<string>();

/**
 * Registers a new demo account while enforcing GLOBAL EMAIL UNIQUENESS.
 * Returns { success: true, account } on success, or { success: false, error } on duplicate.
 */
export function registerDemoAccount(
  params: Omit<AuthAccount, 'id' | 'createdAt' | 'normalizedEmail'>,
): { success: boolean; account?: AuthAccount; error?: string; errorCode?: string } {
  const normalized = normalizeEmail(params.email);
  if (!normalized || !isValidEmail(normalized)) {
    return {
      success: false,
      error: 'Endereço de e-mail inválido.',
      errorCode: 'INVALID_EMAIL',
    };
  }

  // Concurrency / rapid double-submission guard
  if (inFlightRegistrations.has(normalized)) {
    return {
      success: false,
      error:
        'Uma solicitação de cadastro para este e-mail já está sendo processada. Por favor, aguarde.',
      errorCode: 'CONCURRENT_CONFLICT',
    };
  }

  inFlightRegistrations.add(normalized);

  try {
    // GLOBAL EMAIL UNIQUENESS ENFORCEMENT (Option 2)
    if (isEmailRegisteredGlobally(normalized)) {
      return {
        success: false,
        error:
          'Este e-mail já está cadastrado na plataforma. Uma conta já existe com este endereço (faça login ou utilize outro e-mail).',
        errorCode: 'EMAIL_ALREADY_REGISTERED',
      };
    }

    const newAccount: AuthAccount = {
      ...params,
      id: `acc-${params.role}-${Date.now().toString(36)}`,
      email: normalized,
      normalizedEmail: normalized,
      createdAt: new Date().toISOString(),
    };

    const accounts = getAccountsRegistry();
    accounts.push(newAccount);
    saveAccountsRegistry(accounts);

    return { success: true, account: newAccount };
  } finally {
    inFlightRegistrations.delete(normalized);
  }
}

/**
 * Updates an existing account's status or fields (e.g. for correction resubmission).
 */
export function updateDemoAccount(
  accountId: string,
  updates: Partial<AuthAccount>,
): AuthAccount | undefined {
  const accounts = getAccountsRegistry();
  const index = accounts.findIndex((a) => a.id === accountId);
  if (index === -1) return undefined;

  const current = accounts[index];
  const updated: AuthAccount = {
    ...current,
    ...updates,
    normalizedEmail: updates.email ? normalizeEmail(updates.email) : current.normalizedEmail,
  };

  accounts[index] = updated;
  saveAccountsRegistry(accounts);
  return updated;
}

/**
 * Validates whether a requested redirect path is safe against open redirect attacks,
 * backslash tricks, protocol-relative URLs, control characters, or auth-delimiter injection.
 */
export function isSafeRedirect(path: string | null | undefined): boolean {
  if (!path || typeof path !== 'string') return false;
  const trimmed = path.trim();

  // Must begin with single forward slash
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return false;
  }

  // No control characters
  if (/[\r\n\t\0]/.test(trimmed)) {
    return false;
  }

  // No @ delimiter (could be used for userinfo trick in some parsers)
  if (trimmed.includes('@')) {
    return false;
  }

  return true;
}

/**
 * Resolves the safe post-login destination URL based on account role, status, and target path.
 * Enforces strict role boundaries and prevents cross-role privilege escalation.
 */
export function getRoleDestination(
  role: AccountRole,
  status: AccountStatus,
  requestedRedirect?: string | null,
): { destination: string; isBlocked: boolean; blockMessage?: string } {
  if (status === 'suspended') {
    return {
      destination: '/entrar?status=suspensa',
      isBlocked: true,
      blockMessage:
        'Esta conta encontra-se suspensa para análise de segurança. Entre em contato com o suporte institucional.',
    };
  }

  const safeRedirect = isSafeRedirect(requestedRedirect) ? requestedRedirect : null;

  switch (role) {
    case 'member': {
      // Buyer role: strictly buyer destinations (/conta, /favoritos, /mensagens, /veiculos, etc.)
      // Cross-role redirect protection: cannot redirect into seller, dealer, or admin portals
      if (
        safeRedirect &&
        !safeRedirect.startsWith('/vendedor') &&
        !safeRedirect.startsWith('/seller') &&
        !safeRedirect.startsWith('/concessionaria') &&
        !safeRedirect.startsWith('/dealer') &&
        !safeRedirect.startsWith('/admin')
      ) {
        return { destination: safeRedirect, isBlocked: false };
      }
      return { destination: '/conta', isBlocked: false };
    }

    case 'seller': {
      // Individual Seller role
      if (status === 'pending_approval') {
        return { destination: '/vendedor/solicitacao/status', isBlocked: false };
      }
      if (status === 'correction_required') {
        return { destination: '/vendedor/solicitacao/corrigir', isBlocked: false };
      }
      if (
        safeRedirect &&
        (safeRedirect.startsWith('/vendedor') || safeRedirect.startsWith('/seller')) &&
        !safeRedirect.startsWith('/concessionaria') &&
        !safeRedirect.startsWith('/admin')
      ) {
        return { destination: safeRedirect, isBlocked: false };
      }
      return { destination: '/vendedor/anuncios', isBlocked: false };
    }

    case 'dealer': {
      // Dealership Advertiser role
      if (status === 'pending_approval') {
        return { destination: '/concessionaria/solicitacao/status', isBlocked: false };
      }
      if (status === 'correction_required') {
        return { destination: '/concessionaria/solicitacao/corrigir', isBlocked: false };
      }
      if (
        safeRedirect &&
        (safeRedirect.startsWith('/concessionaria') || safeRedirect.startsWith('/dealer')) &&
        !safeRedirect.startsWith('/vendedor') &&
        !safeRedirect.startsWith('/admin')
      ) {
        return { destination: safeRedirect, isBlocked: false };
      }
      return { destination: '/concessionaria/anuncios', isBlocked: false };
    }

    case 'main_admin':
    case 'sales':
    case 'support': {
      // Staff accounts must not authenticate through public customer portal
      return {
        destination: '/admin/login',
        isBlocked: true,
        blockMessage:
          'Contas da equipe administrativa (Administrador, Vendas, Suporte) devem realizar login exclusivamente pelo portal administrativo em /admin/login.',
      };
    }

    default:
      return { destination: '/conta', isBlocked: false };
  }
}

/**
 * Authenticates credentials against the deterministic demo registry in dev/test environments.
 * Emulates POST /v1/auth/login behavior.
 *
 * Security Invariants:
 * 1. Fails closed in production without live backend (/v1/auth/login).
 * 2. Unknown emails are rejected (no auto-generated dummy buyer identities).
 * 3. Invalid passwords are strictly rejected.
 * 4. Passwords and credentials are never persisted in browser storage.
 */
export function authenticateDemoLogin(
  email: string,
  password?: string,
  requestedRedirect?: string | null,
): {
  success: boolean;
  account?: AuthAccount;
  destination?: string;
  error?: string;
} {
  // Fail closed in production if backend is not integrated
  if (isProductionEnvironment()) {
    return {
      success: false,
      error:
        'Autenticação em produção indisponível sem conexão com o backend (/v1/auth/login). O modo demonstrativo está desativado.',
    };
  }

  const normalized = normalizeEmail(email);
  if (!normalized || !isValidEmail(normalized)) {
    return { success: false, error: 'Por favor, informe um endereço de e-mail válido.' };
  }

  // Look up account in registry
  const account = findAccountByEmail(normalized);

  // Unknown email must NOT automatically authenticate (reject unknown emails)
  if (!account) {
    return {
      success: false,
      error: 'E-mail ou senha incorretos. Conta não encontrada.',
    };
  }

  // Password verification: must not be empty and must match recognized demo fixture credentials
  if (!password || typeof password !== 'string' || !VALID_DEMO_PASSWORDS.has(password)) {
    return {
      success: false,
      error: 'E-mail ou senha incorretos. Verifique suas credenciais.',
    };
  }

  // Staff accounts entering customer login are blocked
  if (['main_admin', 'sales', 'support'].includes(account.role)) {
    return {
      success: false,
      account,
      error:
        'Contas da equipe administrativa (Administrador, Vendas, Suporte) devem realizar login exclusivamente pelo portal administrativo em /admin/login.',
    };
  }

  // Suspended account check
  if (account.status === 'suspended') {
    return {
      success: false,
      account,
      error:
        'Esta conta encontra-se suspensa para análise de segurança. Entre em contato com o suporte institucional.',
    };
  }

  const roleDest = getRoleDestination(account.role, account.status, requestedRedirect);
  if (roleDest.isBlocked) {
    return {
      success: false,
      account,
      error: roleDest.blockMessage,
    };
  }

  return {
    success: true,
    account,
    destination: roleDest.destination,
  };
}
