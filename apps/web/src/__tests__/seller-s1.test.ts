import {
  MOCK_APPLICANT_DATA,
  MOCK_SELLER_APPLICATION,
  MOCK_SELLER_APPLICATION_CORRECTION,
  MOCK_SELLER_KPIS,
  MOCK_SELLER_LISTINGS,
} from '@/lib/adapters/mock-seller-data';
import { describe, expect, it } from 'vitest';

describe('Seller Frontend Batch S1 — Data & Presentation Models', () => {
  it('validates applicant profile data for WEB-016', () => {
    expect(MOCK_APPLICANT_DATA.fullName).toBe('Mariana Silva');
    expect(MOCK_APPLICANT_DATA.cpfMasked).toMatch(/\*\*\*\.456\.789-\*\*/);
    expect(MOCK_APPLICANT_DATA.email).toBe('mariana.silva@example.com');
    expect(MOCK_APPLICANT_DATA.city).toBe('Ipatinga');
    expect(MOCK_APPLICANT_DATA.state).toBe('MG');
    expect(MOCK_APPLICANT_DATA.registrationType).toContain('Pessoa física');
  });

  it('validates application review status for WEB-018', () => {
    expect(MOCK_SELLER_APPLICATION.protocol).toBe('SOL-2026-018');
    expect(MOCK_SELLER_APPLICATION.status).toBe('PENDING_REVIEW');
    expect(MOCK_SELLER_APPLICATION.statusLabel).toBe('Em análise');
    expect(MOCK_SELLER_APPLICATION.isMockData).toBe(true);
  });

  it('validates application correction and resubmission model for WEB-019', () => {
    expect(MOCK_SELLER_APPLICATION_CORRECTION.status).toBe('CORRECTION_REQUESTED');
    expect(MOCK_SELLER_APPLICATION_CORRECTION.statusLabel).toBe('Correção solicitada');
    expect(MOCK_SELLER_APPLICATION_CORRECTION.correctionReason).toBe(
      'Endereço incompleto na solicitação.',
    );
    expect(MOCK_SELLER_APPLICATION_CORRECTION.applicant.address).toBe(
      'Av. José de Alencar, 1.250, Sala 04',
    );
  });

  it('validates seller listings and KPI metrics for WEB-020', () => {
    expect(MOCK_SELLER_KPIS.totalListings).toBe(3);
    expect(MOCK_SELLER_KPIS.publishedCount).toBe(1);
    expect(MOCK_SELLER_KPIS.underReviewCount).toBe(1);
    expect(MOCK_SELLER_KPIS.pendingPaymentCount).toBe(1);

    expect(MOCK_SELLER_LISTINGS).toHaveLength(3);

    const [polo, strada, honda] = MOCK_SELLER_LISTINGS;

    // Listing 1: VW Polo
    expect(polo.title).toBe('VW Polo Track 2023');
    expect(polo.status).toBe('PUBLISHED');
    expect(polo.priceFormatted).toBe('R$ 74.900,00');
    expect(polo.imageUrl).toBe('/images/vehicles/demo/vw-polo-2023.jpg');

    // Listing 2: Fiat Strada
    expect(strada.title).toBe('Fiat Strada 2023');
    expect(strada.status).toBe('PENDING_REVIEW');
    expect(strada.priceFormatted).toBe('R$ 109.900,00');
    expect(strada.imageUrl).toBe('/images/vehicles/demo/fiat-strada-2023.jpg');

    // Listing 3: Honda CG 160
    expect(honda.title).toBe('Honda CG 160 2022');
    expect(honda.status).toBe('PENDING_PAYMENT');
    expect(honda.priceFormatted).toBe('R$ 13.500,00');
    expect(honda.imageUrl).toBe('/images/vehicles/demo/honda-cg-160-2022.jpg');
  });
});
