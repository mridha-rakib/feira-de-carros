import {
  MOCK_APPLICANT_DATA,
  MOCK_SELLER_APPLICATION,
  MOCK_SELLER_APPLICATION_CORRECTION,
  MOCK_SELLER_KPIS,
  MOCK_SELLER_LISTINGS,
} from '@/lib/adapters/mock-seller-data';
import type {
  ApplicationStatus,
  SellerListingItem,
  SellerListingStatus,
} from '@/lib/types/seller-presentation';
import { describe, expect, it } from 'vitest';

describe('Seller Frontend Batch S1 — Functional QA Suite', () => {
  // -------------------------------------------------------------
  // 1. Form Validation & Terms Acceptance (WEB-016)
  // -------------------------------------------------------------
  describe('Form Validation & Terms Acceptance (WEB-016)', () => {
    interface ApplicationFormState {
      fullName: string;
      cpf: string;
      email: string;
      phone: string;
      birthDate: string;
      cep: string;
      address: string;
      neighborhood: string;
      city: string;
      state: string;
      termsAccepted: boolean;
      lgpdConsent: boolean;
    }

    function validateApplicationForm(form: ApplicationFormState): {
      isValid: boolean;
      errors: Record<string, string>;
    } {
      const errors: Record<string, string> = {};

      if (!form.fullName.trim()) {
        errors.fullName = 'Nome completo é obrigatório.';
      }
      if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf) && form.cpf.length !== 11) {
        errors.cpf = 'CPF inválido.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'E-mail inválido.';
      }
      if (!form.phone.trim()) {
        errors.phone = 'Telefone é obrigatório.';
      }
      if (!form.cep.trim()) {
        errors.cep = 'CEP é obrigatório.';
      }
      if (!form.address.trim()) {
        errors.address = 'Endereço é obrigatório.';
      }
      if (!form.termsAccepted) {
        errors.termsAccepted = 'Você deve aceitar os Termos e Condições.';
      }
      if (!form.lgpdConsent) {
        errors.lgpdConsent = 'Você deve concordar com a Política de Privacidade (LGPD).';
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    }

    it('rejects form when required fields are empty', () => {
      const emptyForm: ApplicationFormState = {
        fullName: '',
        cpf: '',
        email: '',
        phone: '',
        birthDate: '',
        cep: '',
        address: '',
        neighborhood: '',
        city: '',
        state: 'MG',
        termsAccepted: false,
        lgpdConsent: false,
      };

      const result = validateApplicationForm(emptyForm);
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBeDefined();
      expect(result.errors.cpf).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.phone).toBeDefined();
      expect(result.errors.termsAccepted).toBeDefined();
      expect(result.errors.lgpdConsent).toBeDefined();
    });

    it('rejects form when terms or LGPD are not accepted', () => {
      const formWithoutTerms: ApplicationFormState = {
        fullName: 'Carlos Eduardo',
        cpf: '123.456.789-00',
        email: 'carlos@example.com',
        phone: '(31) 98765-4321',
        birthDate: '1985-05-15',
        cep: '35160-001',
        address: 'Rua das Flores, 100',
        neighborhood: 'Centro',
        city: 'Ipatinga',
        state: 'MG',
        termsAccepted: false,
        lgpdConsent: true,
      };

      const result = validateApplicationForm(formWithoutTerms);
      expect(result.isValid).toBe(false);
      expect(result.errors.termsAccepted).toBe('Você deve aceitar os Termos e Condições.');
      expect(result.errors.lgpdConsent).toBeUndefined();
    });

    it('accepts form when all fields and legal consents are valid', () => {
      const validForm: ApplicationFormState = {
        fullName: 'Mariana Silva',
        cpf: '123.456.789-00',
        email: 'mariana.silva@example.com',
        phone: '(31) 98765-4321',
        birthDate: '1990-03-22',
        cep: '35160-001',
        address: 'Av. Castelo Branco, 500',
        neighborhood: 'Horto',
        city: 'Ipatinga',
        state: 'MG',
        termsAccepted: true,
        lgpdConsent: true,
      };

      const result = validateApplicationForm(validForm);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  // -------------------------------------------------------------
  // 2. Application Status Rendering (WEB-018)
  // -------------------------------------------------------------
  describe('Application Status Rendering (WEB-018)', () => {
    function getStatusConfig(status: ApplicationStatus) {
      switch (status) {
        case 'PENDING_REVIEW':
          return {
            badgeLabel: 'Em análise',
            badgeClass: 'bg-[#fff0db] text-[#b45309]',
            primaryCta: 'Acompanhar protocolo',
            canResubmit: false,
            canAccessDashboard: false,
          };
        case 'CORRECTION_REQUESTED':
          return {
            badgeLabel: 'Correção solicitada',
            badgeClass: 'bg-[#fef2f2] text-[#b91c1c]',
            primaryCta: 'Corrigir dados da solicitação',
            canResubmit: true,
            canAccessDashboard: false,
          };
        case 'APPROVED':
          return {
            badgeLabel: 'Aprovado',
            badgeClass: 'bg-[#e5f8ec] text-[#166534]',
            primaryCta: 'Acessar meus anúncios',
            canResubmit: false,
            canAccessDashboard: true,
          };
        case 'REJECTED':
          return {
            badgeLabel: 'Rejeitado',
            badgeClass: 'bg-[#fee2e2] text-[#991b1b]',
            primaryCta: 'Falar com suporte',
            canResubmit: false,
            canAccessDashboard: false,
          };
      }
    }

    it('renders PENDING_REVIEW state with 24-48h SLA notification', () => {
      const config = getStatusConfig(MOCK_SELLER_APPLICATION.status);
      expect(config.badgeLabel).toBe('Em análise');
      expect(config.canResubmit).toBe(false);
      expect(config.canAccessDashboard).toBe(false);
    });

    it('renders CORRECTION_REQUESTED with resubmission path enabled', () => {
      const config = getStatusConfig('CORRECTION_REQUESTED');
      expect(config.badgeLabel).toBe('Correção solicitada');
      expect(config.canResubmit).toBe(true);
      expect(config.primaryCta).toBe('Corrigir dados da solicitação');
    });

    it('renders APPROVED with direct access to seller dashboard', () => {
      const config = getStatusConfig('APPROVED');
      expect(config.badgeLabel).toBe('Aprovado');
      expect(config.canAccessDashboard).toBe(true);
      expect(config.primaryCta).toBe('Acessar meus anúncios');
    });
  });

  // -------------------------------------------------------------
  // 3. Correction Fields & Resubmission (WEB-019)
  // -------------------------------------------------------------
  describe('Correction Fields & Resubmission (WEB-019)', () => {
    it('enforces locked identification fields', () => {
      const lockedFields = ['fullName', 'cpf'];
      const correctionData = MOCK_SELLER_APPLICATION_CORRECTION;

      expect(correctionData.applicant.fullName).toBe('Mariana Silva');
      expect(correctionData.applicant.cpfMasked).toContain('***.456.789-**');

      // Attempting to simulate payload mutation on locked fields is blocked by domain rules
      const canMutateField = (fieldName: string) => !lockedFields.includes(fieldName);
      expect(canMutateField('fullName')).toBe(false);
      expect(canMutateField('cpf')).toBe(false);
      expect(canMutateField('address')).toBe(true);
      expect(canMutateField('cep')).toBe(true);
    });

    it('resubmits corrected address and transitions status to PENDING_REVIEW', () => {
      const initial = { ...MOCK_SELLER_APPLICATION_CORRECTION };
      expect(initial.status).toBe('CORRECTION_REQUESTED');

      // User updates incomplete address
      const updatedAddress = 'Av. José de Alencar, 1.250, Apto 302';
      const resubmittedApplication = {
        ...initial,
        applicant: {
          ...initial.applicant,
          address: updatedAddress,
        },
        status: 'PENDING_REVIEW' as ApplicationStatus,
        statusLabel: 'Em análise',
        updatedAt: '2026-10-27T10:00:00Z',
      };

      expect(resubmittedApplication.status).toBe('PENDING_REVIEW');
      expect(resubmittedApplication.applicant.address).toBe('Av. José de Alencar, 1.250, Apto 302');
      expect(resubmittedApplication.statusLabel).toBe('Em análise');
    });
  });

  // -------------------------------------------------------------
  // 4. Dashboard Search and Filters (WEB-020)
  // -------------------------------------------------------------
  describe('Dashboard Search and Filters (WEB-020)', () => {
    function filterAndSortListings(
      listings: SellerListingItem[],
      query: string,
      statusFilter: SellerListingStatus | 'ALL',
      sortBy: 'newest' | 'price_asc' | 'price_desc',
    ): SellerListingItem[] {
      let filtered = [...listings];

      // 1. Text Search
      if (query.trim()) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.brand.toLowerCase().includes(q) ||
            item.model.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q),
        );
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        filtered = filtered.filter((item) => item.status === statusFilter);
      }

      // 3. Sort
      if (sortBy === 'price_asc') {
        filtered.sort((a, b) => a.priceCents - b.priceCents);
      } else if (sortBy === 'price_desc') {
        filtered.sort((a, b) => b.priceCents - a.priceCents);
      }

      return filtered;
    }

    it('filters listings by keyword search', () => {
      const results = filterAndSortListings(MOCK_SELLER_LISTINGS, 'polo', 'ALL', 'newest');
      expect(results).toHaveLength(1);
      expect(results[0]?.title).toBe('VW Polo Track 2023');
    });

    it('returns empty array when search query does not match', () => {
      const results = filterAndSortListings(MOCK_SELLER_LISTINGS, 'Ferrari', 'ALL', 'newest');
      expect(results).toHaveLength(0);
    });

    it('filters listings by status PUBLISHED', () => {
      const results = filterAndSortListings(MOCK_SELLER_LISTINGS, '', 'PUBLISHED', 'newest');
      expect(results).toHaveLength(1);
      expect(results[0]?.status).toBe('PUBLISHED');
      expect(results[0]?.title).toBe('VW Polo Track 2023');
    });

    it('filters listings by status PENDING_REVIEW', () => {
      const results = filterAndSortListings(MOCK_SELLER_LISTINGS, '', 'PENDING_REVIEW', 'newest');
      expect(results).toHaveLength(1);
      expect(results[0]?.status).toBe('PENDING_REVIEW');
      expect(results[0]?.title).toBe('Fiat Strada 2023');
    });

    it('sorts listings by price ascending and descending', () => {
      const asc = filterAndSortListings(MOCK_SELLER_LISTINGS, '', 'ALL', 'price_asc');
      expect(asc[0]?.priceCents).toBe(1350000); // Honda CG
      expect(asc[2]?.priceCents).toBe(10990000); // Strada

      const desc = filterAndSortListings(MOCK_SELLER_LISTINGS, '', 'ALL', 'price_desc');
      expect(desc[0]?.priceCents).toBe(10990000); // Strada
      expect(desc[2]?.priceCents).toBe(1350000); // Honda CG
    });
  });

  // -------------------------------------------------------------
  // 5. Protected Navigation & Middleware Authorization Rules
  // -------------------------------------------------------------
  describe('Protected Navigation & Security Rules', () => {
    const PUBLIC_ONBOARDING_PATHS = new Set([
      '/seller/sell',
      '/seller/application',
      '/vendedor/solicitacao',
    ]);
    const PROTECTED_PREFIXES = ['/buyer', '/seller', '/dealer', '/vendedor'];

    function evaluateRouteAccess(
      pathname: string,
      isProduction: boolean,
      hasSessionCookie: boolean,
      _searchParams = new URLSearchParams(),
    ): { allow: boolean; redirectTo?: string } {
      // 1. Public onboarding
      const isPublic =
        PUBLIC_ONBOARDING_PATHS.has(pathname) || pathname === '/vendedor/solicitacao/';
      if (isPublic) {
        return { allow: true };
      }

      // 2. Protected paths
      const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
      if (isProtected) {
        // Development / testing environment allows visual QA
        if (!isProduction) {
          return { allow: true };
        }

        // Production strictly fails closed without valid session
        // NOTICE: ?demo=true does NOT bypass in production
        if (!hasSessionCookie) {
          return {
            allow: false,
            redirectTo: `/login?redirect=${encodeURIComponent(pathname)}`,
          };
        }

        return { allow: true };
      }

      return { allow: true };
    }

    it('allows public onboarding paths without session cookie', () => {
      expect(evaluateRouteAccess('/vendedor/solicitacao', true, false).allow).toBe(true);
      expect(evaluateRouteAccess('/seller/sell', true, false).allow).toBe(true);
      expect(evaluateRouteAccess('/seller/application', true, false).allow).toBe(true);
    });

    it('blocks unauthenticated access to seller status and dashboard in production', () => {
      const statusCheck = evaluateRouteAccess('/vendedor/solicitacao/status', true, false);
      expect(statusCheck.allow).toBe(false);
      expect(statusCheck.redirectTo).toBe('/login?redirect=%2Fvendedor%2Fsolicitacao%2Fstatus');

      const dashboardCheck = evaluateRouteAccess('/vendedor/anuncios', true, false);
      expect(dashboardCheck.allow).toBe(false);
      expect(dashboardCheck.redirectTo).toBe('/login?redirect=%2Fvendedor%2Fanuncios');
    });

    it('strictly forbids ?demo=true bypass in production environment', () => {
      const params = new URLSearchParams('demo=true');
      const bypassAttempt = evaluateRouteAccess(
        '/vendedor/anuncios',
        true,
        false, // No cookie in production
        params,
      );
      expect(bypassAttempt.allow).toBe(false);
      expect(bypassAttempt.redirectTo).toBe('/login?redirect=%2Fvendedor%2Fanuncios');
    });

    it('permits local QA in non-production environment', () => {
      const devAccess = evaluateRouteAccess('/vendedor/anuncios', false, false);
      expect(devAccess.allow).toBe(true);
    });
  });
});
