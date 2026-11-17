import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  type AccountStatus,
  type AuthAccount,
  findAccountByEmail,
  normalizeEmail,
} from '../lib/adapters/shared-auth-registry';
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
  cnpj: string; // Plaintext CNPJ strictly for internal review
  cnpjMasked: string; // Masked CNPJ for safe display

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
  // Step 1: Dados da conta / responsável
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password?: string;
  confirmPassword?: string;

  // Step 2: Dados da revenda
  dealershipName: string;
  cnpj: string;

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
  cnpj: '11222333000181',
  cnpjMasked: '11.***.***/0001-81',
  phone: '(31) 3822-4000',
  address: 'Av. Pedro Linhares Gomes, 4500, Horto',
  city: 'Ipatinga',
  state: 'MG',
  cep: '35160-285',
  termsAccepted: true,
};

interface DealerStoreState {
  // Session & Authentication
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

        const demoSessionToken = `fdc_dealer_${Date.now().toString(36)}`;

        // Set session cookie for Next.js middleware in browser environment
        if (typeof document !== 'undefined') {
          document.cookie = `fdc_web_session=${demoSessionToken}; path=/; SameSite=Lax`;
        }

        set({
          application: newApplication,
          isAuthenticated: true,
          sessionToken: demoSessionToken,
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
        const normalized = normalizeEmail(email);
        const account = targetAccount || findAccountByEmail(normalized);

        const sessionToken = `fdc_dealer_session_${Date.now().toString(36)}`;
        if (typeof document !== 'undefined') {
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
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        sessionToken: state.sessionToken,
        account: state.account,
        application: state.application,
        draft: state.draft,
        activeStep: state.activeStep,
      }),
    },
  ),
);
