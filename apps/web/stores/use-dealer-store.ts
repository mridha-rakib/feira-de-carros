import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  type AccountStatus,
  type AuthAccount,
  findAccountByEmail,
  normalizeEmail,
} from '../lib/adapters/shared-auth-registry';
import { isProductionEnvironment } from '../lib/security/environment';
import { maskCnpjForDisplay } from '../lib/utils/cnpj-validator';

export interface DealershipApplicationData {
  protocol: string;
  status: AccountStatus;
  submittedAt: string;
  updatedAt: string;
  rejectionReason?: string;
  correctionFields?: string[];

  // 1. Dados do responsável
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  email: string;

  // 2. Dados da revenda
  dealershipName: string;
  tradeName?: string;
  cnpj: string; // Plaintext CNPJ strictly ephemeral in memory
  cnpjMasked: string; // Masked CNPJ for safe display and persistence

  // 3. Contato e endereço
  phone: string;
  address: string;
  city: string;
  state: string;
  cep?: string;

  // Legal acceptance
  termsAccepted: boolean;
}

export interface DealershipDraftData {
  // Step 1: Dados da conta / responsável (sensitive fields: ephemeral only)
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password?: string;
  confirmPassword?: string;

  // Step 2: Dados da revenda
  dealershipName: string;
  cnpj: string; // Plaintext CNPJ: ephemeral only

  // Step 3: Contato e endereço
  phone: string;
  address: string;
  city: string;
  state: string;
  cep: string;

  // Step 4: Revisão
  termsAccepted: boolean;
}

export const INITIAL_DEALER_DRAFT: DealershipDraftData = {
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  password: '',
  confirmPassword: '',
  dealershipName: '',
  cnpj: '',
  phone: '',
  address: '',
  city: 'Ipatinga',
  state: 'MG',
  cep: '35160-001',
  termsAccepted: false,
};

export const DEFAULT_DEMO_DEALER_APPLICATION: DealershipApplicationData = {
  protocol: 'SOL-DEALER-202611-0089',
  status: 'pending_approval',
  submittedAt: '15/11/2026 15:30',
  updatedAt: '15/11/2026 15:30',
  firstName: 'Rodrigo',
  lastName: 'Fontes',
  fullName: 'Rodrigo Fontes',
  birthDate: '1985-06-12',
  email: 'contato@liderveiculos.com.br',
  dealershipName: 'Líder Veículos e Seminovos Ltda',
  tradeName: 'Líder Seminovos',
  cnpj: '', // Stripped for security
  cnpjMasked: '11.***.***/0001-81',
  phone: '(31) 3822-4000',
  address: 'Av. Pedro Linhares Gomes, 4500, Horto',
  city: 'Ipatinga',
  state: 'MG',
  cep: '35160-285',
  termsAccepted: true,
};

interface DealerStoreState {
  // Session & Authentication (Ephemeral in memory)
  isAuthenticated: boolean;
  sessionToken: string | null;
  account: AuthAccount | null;

  // Application Lifecycle
  application: DealershipApplicationData;
  draft: DealershipDraftData;
  activeStep: number; // 1, 2, 3, 4

  // Actions
  updateDraft: (data: Partial<DealershipDraftData>) => void;
  setActiveStep: (step: number) => void;
  resetDraft: () => void;
  submitApplication: (data?: Partial<DealershipDraftData>) => DealershipApplicationData;
  resubmitCorrection: (
    corrections: Partial<DealershipApplicationData>,
  ) => DealershipApplicationData;
  simulateStatus: (status: AccountStatus, reason?: string) => void;
  loginSimulation: (email: string, targetAccount?: AuthAccount) => boolean;
  logout: () => void;
}

export const useDealerStore = create<DealerStoreState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      sessionToken: null,
      account: null,
      application: DEFAULT_DEMO_DEALER_APPLICATION,
      draft: INITIAL_DEALER_DRAFT,
      activeStep: 1,

      updateDraft: (data) =>
        set((state) => ({
          draft: { ...state.draft, ...data },
        })),

      setActiveStep: (step) =>
        set({
          activeStep: Math.min(Math.max(step, 1), 4),
        }),

      resetDraft: () =>
        set({
          draft: INITIAL_DEALER_DRAFT,
          activeStep: 1,
        }),

      submitApplication: (extraData) => {
        const state = get();
        const mergedDraft = { ...state.draft, ...extraData };
        const cleanCnpjDigits = mergedDraft.cnpj.replace(/\D/g, '');
        const randomProtocolSuffix = Math.floor(1000 + Math.random() * 9000);
        const protocol = `SOL-DEALER-202611-${randomProtocolSuffix}`;
        const now = new Date();
        const formattedTimestamp = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        const newApplication: DealershipApplicationData = {
          protocol,
          status: 'pending_approval',
          submittedAt: formattedTimestamp,
          updatedAt: formattedTimestamp,
          firstName: mergedDraft.firstName || 'Responsável',
          lastName: mergedDraft.lastName || 'Concessionária',
          fullName: `${mergedDraft.firstName} ${mergedDraft.lastName}`.trim(),
          birthDate: mergedDraft.birthDate,
          email: mergedDraft.email,
          dealershipName: mergedDraft.dealershipName || 'Concessionária Solicitante',
          tradeName: mergedDraft.dealershipName,
          cnpj: cleanCnpjDigits,
          cnpjMasked: maskCnpjForDisplay(cleanCnpjDigits),
          phone: mergedDraft.phone,
          address: mergedDraft.address,
          city: mergedDraft.city || 'Ipatinga',
          state: mergedDraft.state || 'MG',
          cep: mergedDraft.cep,
          termsAccepted: true,
        };

        const demoSessionToken = 'demo_dealer_session';

        // In dev/test, set cookie for local middleware simulation; never in production
        if (typeof document !== 'undefined' && !isProductionEnvironment()) {
          document.cookie = `fdc_web_session=${demoSessionToken}; path=/; SameSite=Lax`;
        }

        set({
          application: newApplication,
          isAuthenticated: !isProductionEnvironment(),
          sessionToken: isProductionEnvironment() ? null : demoSessionToken,
          account: {
            id: `acc-dealer-${Date.now().toString(36)}`,
            email: mergedDraft.email,
            normalizedEmail: normalizeEmail(mergedDraft.email),
            fullName: `${mergedDraft.firstName} ${mergedDraft.lastName}`.trim(),
            role: 'dealer',
            status: 'pending_approval',
            phone: mergedDraft.phone,
            documentNumber: maskCnpjForDisplay(cleanCnpjDigits),
            dealershipName: mergedDraft.dealershipName,
            createdAt: now.toISOString(),
          },
          // Clear sensitive password fields in draft once submitted
          draft: {
            ...mergedDraft,
            password: '',
            confirmPassword: '',
          },
          activeStep: 4,
        });

        return newApplication;
      },

      resubmitCorrection: (corrections) => {
        const state = get();
        const now = new Date();
        const formattedTimestamp = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        const updatedApplication: DealershipApplicationData = {
          ...state.application,
          ...corrections,
          status: 'pending_approval',
          rejectionReason: undefined,
          correctionFields: [],
          updatedAt: formattedTimestamp,
        };

        set({
          application: updatedApplication,
        });

        return updatedApplication;
      },

      simulateStatus: (status, reason) => {
        set((state) => ({
          application: {
            ...state.application,
            status,
            rejectionReason:
              reason ||
              (status === 'correction_required'
                ? 'Razão social e comprovante de endereço apresentam divergências cadastrais.'
                : undefined),
            correctionFields: status === 'correction_required' ? ['dealershipName', 'address'] : [],
            updatedAt: new Date().toLocaleDateString('pt-BR'),
          },
        }));
      },

      loginSimulation: (email, targetAccount) => {
        if (isProductionEnvironment()) {
          // Fail closed in production: demo login simulation is prohibited
          return false;
        }

        const normalized = normalizeEmail(email);
        const account = targetAccount || findAccountByEmail(normalized);

        const sessionToken = 'demo_dealer_session';
        if (typeof document !== 'undefined' && !isProductionEnvironment()) {
          document.cookie = `fdc_web_session=${sessionToken}; path=/; SameSite=Lax`;
        }

        const appStatus = account?.status || 'active';
        const cleanDigits = (account?.documentNumber || '11222333000181').replace(/\D/g, '');

        set({
          isAuthenticated: true,
          sessionToken,
          account: account || {
            id: 'acc-dealer-dynamic',
            email: normalized,
            normalizedEmail: normalized,
            fullName: 'Gestor da Concessionária',
            role: 'dealer',
            status: appStatus,
            phone: '(31) 3822-4000',
            documentNumber: maskCnpjForDisplay(cleanDigits),
            dealershipName: 'Líder Veículos e Seminovos Ltda',
            createdAt: new Date().toISOString(),
          },
          application: {
            ...DEFAULT_DEMO_DEALER_APPLICATION,
            status: appStatus,
            email: normalized,
            dealershipName: account?.dealershipName || 'Líder Veículos e Seminovos Ltda',
            rejectionReason: account?.rejectionReason,
            correctionFields: account?.correctionFields,
          },
        });

        return true;
      },

      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie =
            'fdc_web_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        }
        set({
          isAuthenticated: false,
          sessionToken: null,
          account: null,
          draft: INITIAL_DEALER_DRAFT,
          activeStep: 1,
        });
      },
    }),
    {
      name: 'feira_dealer_store_v1',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // SEC-003 & PRIVACY INVARIANT:
      // Strip passwords, session tokens, and plaintext CNPJs from persistent storage.
      partialize: (state) => ({
        isAuthenticated: false, // In memory only; requires server validation
        sessionToken: null, // Never persist raw session tokens
        account: state.account
          ? {
              id: state.account.id,
              email: state.account.email,
              normalizedEmail: state.account.normalizedEmail,
              fullName: state.account.fullName,
              role: state.account.role,
              status: state.account.status,
              dealershipName: state.account.dealershipName,
              documentNumber: state.account.documentNumber, // Already masked
              phone: state.account.phone,
              createdAt: state.account.createdAt,
            }
          : null,
        application: {
          ...state.application,
          cnpj: '', // Never persist plaintext CNPJ in localStorage
        },
        draft: {
          ...state.draft,
          password: '', // Never persist password
          confirmPassword: '', // Never persist password confirmation
          cnpj: '', // Never persist plaintext CNPJ in draft storage
        },
        activeStep: state.activeStep,
      }),
    },
  ),
);
