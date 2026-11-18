/**
 * Feira de Carros — Dealership Application Adapter
 *
 * Mock adapter emulating Dealership Application API endpoints:
 * - POST /v1/dealership-applications (Submit application)
 * - GET /v1/dealership-applications/me (Get current status and application details)
 * - PATCH /v1/dealership-applications/me (Resubmit corrected data)
 *
 * Adheres strictly to OpenAPI v0.2 contract standards and client requirements.
 */

import { maskCnpjForDisplay } from '../utils/cnpj-validator';
import {
  type AccountStatus,
  type AuthAccount,
  findAccountByEmail,
  normalizeEmail,
} from './shared-auth-registry';

export interface DealershipApplicationPayload {
  // Step 1: Dados do responsável
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD or DD/MM/AAAA
  email: string;
  password?: string;

  // Step 2: Dados da revenda
  dealershipName: string;
  tradeName?: string;
  cnpj: string; // Plaintext CNPJ digits

  // Step 3: Contato e endereço
  phone: string;
  address: string;
  city: string;
  state: string;
  cep?: string;

  // Step 4: Termos
  termsAccepted: boolean;
}

export interface DealershipApplicationResponse {
  id: string;
  protocol: string;
  status: AccountStatus;
  submittedAt: string;
  updatedAt: string;
  rejectionReason?: string;
  correctionFields?: string[];

  applicant: {
    firstName: string;
    lastName: string;
    fullName: string;
    birthDate: string;
    email: string;
  };

  dealership: {
    name: string;
    tradeName?: string;
    cnpjMasked: string; // CNPJ masked for public and client rendering
    phone: string;
    address: string;
    city: string;
    state: string;
    cep?: string;
  };
}

const STORAGE_KEY_APPLICATIONS = 'feira_dealer_applications_data';

export const SEED_DEALER_APPLICATIONS: Record<string, DealershipApplicationResponse> = {
  'contato@liderveiculos.com.br': {
    id: 'app-dealer-001',
    protocol: 'SOL-DEALER-202610-0012',
    status: 'active',
    submittedAt: '10/10/2026 14:00',
    updatedAt: '11/10/2026 09:30',
    applicant: {
      firstName: 'Rodrigo',
      lastName: 'Fontes',
      fullName: 'Rodrigo Fontes',
      birthDate: '1985-06-12',
      email: 'contato@liderveiculos.com.br',
    },
    dealership: {
      name: 'Líder Veículos e Seminovos Ltda',
      tradeName: 'Líder Seminovos',
      cnpjMasked: '11.***.***/0001-81',
      phone: '(31) 3822-4000',
      address: 'Av. Pedro Linhares Gomes, 4500, Horto',
      city: 'Ipatinga',
      state: 'MG',
      cep: '35160-285',
    },
  },
  'dealer.pendente@exemplo.com': {
    id: 'app-dealer-002',
    protocol: 'SOL-DEALER-202611-0045',
    status: 'pending_approval',
    submittedAt: '15/11/2026 15:00',
    updatedAt: '15/11/2026 15:00',
    applicant: {
      firstName: 'Fernanda',
      lastName: 'Lima',
      fullName: 'Fernanda Lima',
      birthDate: '1992-04-18',
      email: 'dealer.pendente@exemplo.com',
    },
    dealership: {
      name: 'Autovale Comércio de Veículos Ltda',
      tradeName: 'Autovale Multimarcas',
      cnpjMasked: '22.***.***/0001-92',
      phone: '(31) 3824-5500',
      address: 'Av. Castelo Branco, 1200, República',
      city: 'Ipatinga',
      state: 'MG',
      cep: '35160-001',
    },
  },
  'dealer.corrigir@exemplo.com': {
    id: 'app-dealer-003',
    protocol: 'SOL-DEALER-202611-0033',
    status: 'correction_required',
    submittedAt: '12/11/2026 10:00',
    updatedAt: '13/11/2026 16:45',
    rejectionReason:
      'Razão social divergente do cartão CNPJ da Receita Federal e comprovante de endereço desatualizado.',
    correctionFields: ['dealershipName', 'cnpj', 'address'],
    applicant: {
      firstName: 'Lucas',
      lastName: 'Pinheiro',
      fullName: 'Lucas Pinheiro',
      birthDate: '1987-09-24',
      email: 'dealer.corrigir@exemplo.com',
    },
    dealership: {
      name: 'Nova Era Automóveis Eireli',
      tradeName: 'Nova Era Veículos',
      cnpjMasked: '33.***.***/0001-03',
      phone: '(31) 3821-6600',
      address: 'Rua Jacarandá, 320, Horto',
      city: 'Ipatinga',
      state: 'MG',
      cep: '35160-280',
    },
  },
  'dealer.suspenso@exemplo.com': {
    id: 'app-dealer-004',
    protocol: 'SOL-DEALER-202608-0099',
    status: 'suspended',
    submittedAt: '20/08/2026 11:00',
    updatedAt: '25/08/2026 14:00',
    rejectionReason: 'Conta suspensa por violação das políticas de publicação comercial.',
    applicant: {
      firstName: 'Antônio',
      lastName: 'Prado',
      fullName: 'Antônio Prado',
      birthDate: '1979-12-05',
      email: 'dealer.suspenso@exemplo.com',
    },
    dealership: {
      name: 'Vale Motors Bloqueada Ltda',
      tradeName: 'Vale Motors',
      cnpjMasked: '44.***.***/0001-14',
      phone: '(31) 3820-9999',
      address: 'Av. Brasil, 800, Iguaçu',
      city: 'Ipatinga',
      state: 'MG',
      cep: '35162-036',
    },
  },
};

function getStoredApplications(): Record<string, DealershipApplicationResponse> {
  if (typeof window === 'undefined') return SEED_DEALER_APPLICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(SEED_DEALER_APPLICATIONS));
      return SEED_DEALER_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_DEALER_APPLICATIONS;
  }
}

function saveStoredApplications(data: Record<string, DealershipApplicationResponse>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save dealer applications data:', err);
  }
}

/**
 * Submits a new dealership application.
 */
export async function submitDealershipApplication(
  payload: DealershipApplicationPayload,
): Promise<DealershipApplicationResponse> {
  const normalized = normalizeEmail(payload.email);
  const now = new Date();
  const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const protocol = `SOL-DEALER-202611-${randomSuffix}`;
  const cleanDigits = payload.cnpj.replace(/\D/g, '');

  const newApp: DealershipApplicationResponse = {
    id: `app-dealer-${Date.now().toString(36)}`,
    protocol,
    status: 'pending_approval',
    submittedAt: formattedDate,
    updatedAt: formattedDate,
    applicant: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`.trim(),
      birthDate: payload.birthDate,
      email: normalized,
    },
    dealership: {
      name: payload.dealershipName,
      tradeName: payload.tradeName || payload.dealershipName,
      cnpjMasked: maskCnpjForDisplay(cleanDigits),
      phone: payload.phone,
      address: payload.address,
      city: payload.city || 'Ipatinga',
      state: payload.state || 'MG',
      cep: payload.cep,
    },
  };

  const stored = getStoredApplications();
  stored[normalized] = newApp;
  saveStoredApplications(stored);

  return newApp;
}

/**
 * Gets the current application details for an email or authenticated session.
 */
export async function getDealershipApplication(
  email?: string,
): Promise<DealershipApplicationResponse | null> {
  const targetEmail = normalizeEmail(email || 'contato@liderveiculos.com.br');
  const stored = getStoredApplications();

  if (stored[targetEmail]) {
    return stored[targetEmail];
  }

  // Fallback to checking shared auth registry
  const account = findAccountByEmail(targetEmail);
  if (account && account.role === 'dealer') {
    const cleanDigits = (account.documentNumber || '11222333000181').replace(/\D/g, '');
    return {
      id: `app-${account.id}`,
      protocol: 'SOL-DEALER-202611-0099',
      status: account.status,
      submittedAt: '15/11/2026 10:00',
      updatedAt: '15/11/2026 10:00',
      rejectionReason: account.rejectionReason,
      correctionFields: account.correctionFields,
      applicant: {
        firstName: account.fullName.split(' ')[0] || 'Gestor',
        lastName: account.fullName.split(' ').slice(1).join(' ') || 'Concessionária',
        fullName: account.fullName,
        birthDate: account.birthDate || '1985-01-01',
        email: account.email,
      },
      dealership: {
        name: account.dealershipName || 'Concessionária Parceira',
        tradeName: account.tradeName || account.dealershipName,
        cnpjMasked: maskCnpjForDisplay(cleanDigits),
        phone: account.phone || '(31) 3822-4000',
        address: 'Av. Pedro Linhares Gomes, 4500, Horto',
        city: 'Ipatinga',
        state: 'MG',
        cep: '35160-285',
      },
    };
  }

  return null;
}

/**
 * Resubmits corrected dealership application details.
 */
export async function resubmitDealershipCorrection(
  email: string,
  updates: Partial<DealershipApplicationPayload>,
): Promise<DealershipApplicationResponse | null> {
  const normalized = normalizeEmail(email);
  const stored = getStoredApplications();
  const existing = stored[normalized];
  if (!existing) return null;

  const now = new Date();
  const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updated: DealershipApplicationResponse = {
    ...existing,
    status: 'pending_approval',
    rejectionReason: undefined,
    correctionFields: [],
    updatedAt: formattedDate,
    applicant: {
      ...existing.applicant,
      firstName: updates.firstName || existing.applicant.firstName,
      lastName: updates.lastName || existing.applicant.lastName,
      fullName:
        updates.firstName && updates.lastName
          ? `${updates.firstName} ${updates.lastName}`.trim()
          : existing.applicant.fullName,
      birthDate: updates.birthDate || existing.applicant.birthDate,
    },
    dealership: {
      ...existing.dealership,
      name: updates.dealershipName || existing.dealership.name,
      tradeName: updates.tradeName || existing.dealership.tradeName,
      cnpjMasked: updates.cnpj
        ? maskCnpjForDisplay(updates.cnpj.replace(/\D/g, ''))
        : existing.dealership.cnpjMasked,
      phone: updates.phone || existing.dealership.phone,
      address: updates.address || existing.dealership.address,
      city: updates.city || existing.dealership.city,
      state: updates.state || existing.dealership.state,
      cep: updates.cep || existing.dealership.cep,
    },
  };

  stored[normalized] = updated;
  saveStoredApplications(stored);
  return updated;
}
