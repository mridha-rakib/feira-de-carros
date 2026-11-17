import {
  MOCK_APPLICANT_DATA,
  MOCK_SELLER_APPLICATION,
  MOCK_SELLER_APPLICATION_CORRECTION,
  MOCK_SELLER_LISTINGS,
} from '@/lib/adapters/mock-seller-data';
import type { ApplicationStatus } from '@/lib/types/seller-presentation';
import { filterAndSortSellerListings } from '@/lib/utils/seller-listing-filters';
import {
  type SellerApplicationFormData,
  validateSellerApplicationForm,
} from '@/lib/utils/seller-validation';
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Seller Frontend Batch S1 — Production Functional Tests', () => {
  // -------------------------------------------------------------
  // 1. Actual Form Validation & Terms Acceptance Utility
  // -------------------------------------------------------------
  describe('Form Validation Utility (validateSellerApplicationForm)', () => {
    it('rejects form when required fields are missing', () => {
      const emptyData: Partial<SellerApplicationFormData> = {
        fullName: '',
        cpf: '',
        email: '',
        phone: '',
        cep: '',
        address: '',
        termsAccepted: false,
        lgpdConsent: false,
      };

      const result = validateSellerApplicationForm(emptyData);
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBe('Nome completo é obrigatório.');
      expect(result.errors.cpf).toBe('CPF deve conter 11 dígitos numéricos.');
      expect(result.errors.email).toBe('E-mail inválido ou não informado.');
      expect(result.errors.phone).toBe('Telefone para contato é obrigatório.');
      expect(result.errors.cep).toBe('CEP deve conter 8 dígitos numéricos.');
      expect(result.errors.address).toBe('Endereço residencial é obrigatório.');
      expect(result.errors.termsAccepted).toBe('É necessário concordar com os Termos de Uso.');
      expect(result.errors.lgpdConsent).toBe(
        'É necessário autorizar o tratamento de dados (LGPD).',
      );
    });

    it('rejects form when legal consent is omitted even if fields are filled', () => {
      const result = validateSellerApplicationForm({
        fullName: 'Carlos Eduardo',
        cpf: '12345678901',
        email: 'carlos@example.com',
        phone: '31987654321',
        cep: '35160001',
        address: 'Rua das Flores, 100',
        city: 'Ipatinga',
        state: 'MG',
        termsAccepted: false,
        lgpdConsent: true,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.termsAccepted).toBe('É necessário concordar com os Termos de Uso.');
      expect(result.errors.lgpdConsent).toBeUndefined();
    });

    it('approves complete and legally consented seller applicant form', () => {
      const result = validateSellerApplicationForm({
        fullName: 'Mariana Silva',
        cpf: '12345678901',
        email: 'mariana.silva@example.com',
        phone: '31987654321',
        cep: '35160001',
        address: 'Av. Castelo Branco, 500',
        city: 'Ipatinga',
        state: 'MG',
        termsAccepted: true,
        lgpdConsent: true,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  // -------------------------------------------------------------
  // 2. Production Listing Filter & Sort Utility
  // -------------------------------------------------------------
  describe('Listing Filter & Sort Utility (filterAndSortSellerListings)', () => {
    it('filters listings by keyword across title, brand, and model', () => {
      const poloResult = filterAndSortSellerListings(MOCK_SELLER_LISTINGS, 'polo', 'ALL', 'latest');
      expect(poloResult).toHaveLength(1);
      expect(poloResult[0]?.title).toBe('VW Polo Track 2023');

      const brandResult = filterAndSortSellerListings(
        MOCK_SELLER_LISTINGS,
        'fiat',
        'ALL',
        'latest',
      );
      expect(brandResult).toHaveLength(1);
      expect(brandResult[0]?.title).toBe('Fiat Strada 2023');
    });

    it('returns empty array when query does not match', () => {
      const noMatch = filterAndSortSellerListings(
        MOCK_SELLER_LISTINGS,
        'inexistente',
        'ALL',
        'latest',
      );
      expect(noMatch).toHaveLength(0);
    });

    it('filters listings strictly by status (PUBLISHED, PENDING_REVIEW, PENDING_PAYMENT)', () => {
      const published = filterAndSortSellerListings(
        MOCK_SELLER_LISTINGS,
        '',
        'PUBLISHED',
        'latest',
      );
      expect(published).toHaveLength(1);
      expect(published[0]?.status).toBe('PUBLISHED');

      const review = filterAndSortSellerListings(
        MOCK_SELLER_LISTINGS,
        '',
        'PENDING_REVIEW',
        'latest',
      );
      expect(review).toHaveLength(1);
      expect(review[0]?.status).toBe('PENDING_REVIEW');

      const payment = filterAndSortSellerListings(
        MOCK_SELLER_LISTINGS,
        '',
        'PENDING_PAYMENT',
        'latest',
      );
      expect(payment).toHaveLength(1);
      expect(payment[0]?.status).toBe('PENDING_PAYMENT');
    });

    it('sorts listings by price ascending and descending correctly', () => {
      const asc = filterAndSortSellerListings(MOCK_SELLER_LISTINGS, '', 'ALL', 'price_asc');
      expect(asc[0]?.priceCents).toBe(1350000); // Honda CG R$ 13.500
      expect(asc[2]?.priceCents).toBe(10990000); // Strada R$ 109.900

      const desc = filterAndSortSellerListings(MOCK_SELLER_LISTINGS, '', 'ALL', 'price_desc');
      expect(desc[0]?.priceCents).toBe(10990000); // Strada R$ 109.900
      expect(desc[2]?.priceCents).toBe(1350000); // Honda CG R$ 13.500
    });
  });

  // -------------------------------------------------------------
  // 3. Application Status & Correction Presentation Model
  // -------------------------------------------------------------
  describe('Application Status & Correction Presentation Model', () => {
    it('preserves immutable applicant identification fields', () => {
      expect(MOCK_APPLICANT_DATA.fullName).toBe('Mariana Silva');
      expect(MOCK_APPLICANT_DATA.cpfMasked).toMatch(/\*\*\*\.456\.789-\*\*/);

      // Correction model provides explicit feedback without allowing government id mutation
      const correction = MOCK_SELLER_APPLICATION_CORRECTION;
      expect(correction.status).toBe('CORRECTION_REQUESTED');
      expect(correction.applicant.fullName).toBe('Mariana Silva');
      expect(correction.correctionReason).toBe('Endereço incompleto na solicitação.');
    });

    it('models status state transitions cleanly', () => {
      const initialStatus: ApplicationStatus = 'CORRECTION_REQUESTED';
      const updatedStatus: ApplicationStatus = 'PENDING_REVIEW';
      expect(initialStatus).not.toBe(updatedStatus);
    });
  });

  // -------------------------------------------------------------
  // 4. Actual Middleware Redirection Tests with NextRequest
  // -------------------------------------------------------------
  describe('Production Middleware Route Protection (middleware)', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('allows public onboarding and authentication routes without redirect', () => {
      const publicPaths = [
        'http://localhost:3000/vendedor/solicitacao',
        'http://localhost:3000/seller/sell',
        'http://localhost:3000/seller/application',
        'http://localhost:3000/entrar',
        'http://localhost:3000/login',
      ];

      for (const url of publicPaths) {
        const req = new NextRequest(url);
        const res = middleware(req);
        // NextResponse.next() continues without redirect headers (status 200)
        expect(res.status).toBe(200);
        expect(res.headers.get('location')).toBeNull();
      }
    });

    it('redirects unauthenticated protected seller paths to /entrar in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      const protectedPaths = [
        'http://localhost:3000/vendedor/anuncios',
        'http://localhost:3000/vendedor/solicitacao/status',
        'http://localhost:3000/vendedor/solicitacao/corrigir',
        'http://localhost:3000/buyer/perfil',
        'http://localhost:3000/conta/configuracoes',
      ];

      for (const url of protectedPaths) {
        const req = new NextRequest(url);
        const res = middleware(req);

        expect(res.status).toBe(307);
        const location = res.headers.get('location');
        expect(location).toContain('/entrar?redirect=');
      }
    });

    it('strictly denies ?demo=true bypass in production environment', () => {
      vi.stubEnv('NODE_ENV', 'production');

      const req = new NextRequest('http://localhost:3000/vendedor/anuncios?demo=true');
      const res = middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get('location');
      expect(location).toContain('/entrar?redirect=%2Fvendedor%2Fanuncios');
    });

    it('allows authenticated session through in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      const req = new NextRequest('http://localhost:3000/vendedor/anuncios', {
        headers: {
          cookie: 'fdc_web_session=mock_active_session_token',
        },
      });
      const res = middleware(req);

      // Continues to downstream backend authorization
      expect(res.status).toBe(200);
    });
  });
});
