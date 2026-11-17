/**
 * Feira de Carros — Shared Authentication & Demo Account Registry
 *
 * Implements the explicit client decisions:
 * 1. AUTH-022: NO ACCOUNT CONVERSION. Buyer, Individual Seller, and Dealership are separate accounts.
 * 2. GLOBAL EMAIL UNIQUENESS (Option 2): One email address may belong to only one account
 *    across the entire platform (Buyer, Seller, or Dealership).
 *
 * Normalizes email identities consistently before uniqueness checks.
 * Manages deterministic demo accounts for testing and simulation without persisting raw secrets.
 */

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
 * Normalizes an email address consistently across all flows.
 * Lowercases and trims whitespace.
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
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
  // 3. BUYER (Suspended)
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
    documentNumber: '11.222.333/0001-81',
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
    documentNumber: '22.333.444/0001-92',
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
    documentNumber: '33.444.555/0001-03',
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
    documentNumber: '44.555.666/0001-14',
    dealershipId: 'dealer-valemotors-bloqueada',
    dealershipName: 'Vale Motors Bloqueada Ltda',
    tradeName: 'Vale Motors',
    createdAt: '2026-08-20T11:00:00Z',
    rejectionReason: 'Conta suspensa por violação das políticas comerciais.',
  },

  // 11. STAFF: MAIN ADMIN
  {
    id: 'acc-staff-admin',
    email: 'admin@feiradecarros.com.br',
    normalizedEmail: 'admin@feiradecarros.com.br',
    fullName: 'Administrador Geral',
    role: 'main_admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  // 12. STAFF: SALES
  {
    id: 'acc-staff-sales',
    email: 'vendas@feiradecarros.com.br',
    normalizedEmail: 'vendas@feiradecarros.com.br',
    fullName: 'Equipe Comercial Vendas',
    role: 'sales',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  // 13. STAFF: SUPPORT
  {
    id: 'acc-staff-support',
    email: 'suporte@feiradecarros.com.br',
    normalizedEmail: 'suporte@feiradecarros.com.br',
    fullName: 'Equipe Suporte e Moderação',
    role: 'support',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

const STORAGE_KEY_REGISTRY = 'feira_shared_accounts_registry';

/**
 * In-memory fallback and local-storage synchronization for demo accounts.
 */
function getAccountsRegistry(): AuthAccount[] {
  if (typeof window === 'undefined') {
    return INITIAL_DEMO_ACCOUNTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
      return INITIAL_DEMO_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEMO_ACCOUNTS;
  } catch {
    return INITIAL_DEMO_ACCOUNTS;
  }
}

function saveAccountsRegistry(accounts: AuthAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to persist accounts registry:', err);
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
 * Registers a new demo account while enforcing GLOBAL EMAIL UNIQUENESS.
 * Returns { success: true, account } on success, or { success: false, error } on duplicate.
 */
export function registerDemoAccount(
  params: Omit<AuthAccount, 'id' | 'createdAt' | 'normalizedEmail'>,
): { success: boolean; account?: AuthAccount; error?: string } {
  const normalized = normalizeEmail(params.email);
  if (!normalized || !isValidEmail(normalized)) {
    return { success: false, error: 'Endereço de e-mail inválido.' };
  }

  // GLOBAL EMAIL UNIQUENESS ENFORCEMENT
  if (isEmailRegisteredGlobally(normalized)) {
    return {
      success: false,
      error: 'Este e-mail já está cadastrado na plataforma. Uma conta já existe com este endereço.',
    };
  }

  const newAccount: AuthAccount = {
    ...params,
    id: `acc-${params.role}-${Date.now().toString(36)}`,
    normalizedEmail: normalized,
    createdAt: new Date().toISOString(),
  };

  const accounts = getAccountsRegistry();
  accounts.push(newAccount);
  saveAccountsRegistry(accounts);

  return { success: true, account: newAccount };
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
 * Resolves the safe post-login destination URL based on account role and status.
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

  // Sanitized redirect check
  const safeRedirect =
    requestedRedirect?.startsWith('/') &&
    !requestedRedirect.startsWith('//') &&
    !requestedRedirect.includes('\\')
      ? requestedRedirect
      : null;

  switch (role) {
    case 'member': {
      // Buyer role
      if (
        safeRedirect &&
        !safeRedirect.startsWith('/vendedor') &&
        !safeRedirect.startsWith('/concessionaria') &&
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
      if (safeRedirect?.startsWith('/vendedor')) {
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
      if (safeRedirect?.startsWith('/concessionaria')) {
        return { destination: safeRedirect, isBlocked: false };
      }
      return { destination: '/concessionaria/anuncios', isBlocked: false };
    }

    case 'main_admin':
    case 'sales':
    case 'support': {
      return {
        destination: '/admin/login',
        isBlocked: true,
        blockMessage:
          'Contas da equipe administrativa (Main Admin, Vendas, Suporte) devem realizar login exclusivamente pelo portal administrativo em /admin/login.',
      };
    }

    default:
      return { destination: '/conta', isBlocked: false };
  }
}

/**
 * Authenticates credentials against the deterministic demo registry.
 * Emulates POST /v1/auth/login behavior.
 */
export function authenticateDemoLogin(
  email: string,
  _password?: string,
  requestedRedirect?: string | null,
): {
  success: boolean;
  account?: AuthAccount;
  destination?: string;
  error?: string;
} {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { success: false, error: 'Por favor, informe seu e-mail.' };
  }

  const account = findAccountByEmail(normalized);

  // If email is not in seed list, provide a friendly demo fallback as a registered buyer
  if (!account) {
    // In demo environment, unknown emails default to new buyer preview unless requested otherwise
    const fallbackBuyer: AuthAccount = {
      id: `acc-guest-${Date.now().toString(36)}`,
      email: normalized,
      normalizedEmail: normalized,
      fullName: 'Usuário Convidado (Demo)',
      role: 'member',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    const dest = getRoleDestination('member', 'active', requestedRedirect);
    return {
      success: true,
      account: fallbackBuyer,
      destination: dest.destination,
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
