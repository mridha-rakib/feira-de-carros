import {
  createPublishedListingRevision,
  getSellerDetailedListings,
  getSellerListingById,
  markListingAsSold,
  resetMockListings,
  resubmitListingCorrection,
  updateListingCorrectionDraft,
} from '@/lib/adapters/seller-listings-adapter';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Seller Frontend Batch S3 — Listing Management & Revisions', () => {
  beforeEach(() => {
    resetMockListings();
  });

  describe('WEB-027: Rejected Listing Correction (/vendedor/anuncios/[id]/corrigir)', () => {
    it('retrieves listing in CORRECTION_REQUESTED state with moderation reasons and history', () => {
      const listing = getSellerListingById('FC-2026-0151');
      expect(listing).toBeDefined();
      expect(listing?.status).toBe('CORRECTION_REQUESTED');
      expect(listing?.statusLabel).toBe('Correção solicitada');
      expect(listing?.correction?.reasons).toHaveLength(3);
      expect(listing?.correction?.reasons[0]).toBe('Adicionar uma foto traseira do veículo.');
      expect(listing?.history).toBeDefined();
      expect(listing?.history?.length).toBeGreaterThanOrEqual(3);
    });

    it('updates correction draft without prematurely publishing', () => {
      const updated = updateListingCorrectionDraft('FC-2026-0151', {
        mileageKm: 33000,
        description: 'Descrição atualizada com dados do painel e opcionais revisados.',
        newPhoto: '/images/vehicles/demo/web027-thumb2.png',
      });

      expect(updated).toBeDefined();
      expect(updated?.mileageKm).toBe(33000);
      expect(updated?.mileageFormatted).toBe('33.000 km');
      expect(updated?.description).toContain('Descrição atualizada');
      // Listing should remain in CORRECTION_REQUESTED until resubmitted
      expect(updated?.status).toBe('CORRECTION_REQUESTED');
    });

    it('resubmits correction to moderation, transitioning status to PENDING_REVIEW and logging history', () => {
      const result = resubmitListingCorrection('FC-2026-0151');
      expect(result.success).toBe(true);
      expect(result.listing?.status).toBe('PENDING_REVIEW');
      expect(result.listing?.statusLabel).toBe('Em análise');

      const history = result.listing?.history || [];
      const lastEntry = history[history.length - 1];
      expect(lastEntry?.title).toBe('Correções reenviadas');
    });
  });

  describe('WEB-028: Own Listing Detail (/vendedor/anuncios/[id])', () => {
    it('retrieves complete published listing specs, performance metrics, and plan validity', () => {
      const listing = getSellerListingById('FDC-2026-0142');
      expect(listing).toBeDefined();
      expect(listing?.title).toBe('Volkswagen Polo Track 2023');
      expect(listing?.status).toBe('PUBLISHED');
      expect(listing?.plan).toBe('Padrão');
      expect(listing?.yearModel).toBe(2023);
      expect(listing?.metrics.totalViews).toBe(1284);
      expect(listing?.metrics.favorites).toBe(47);
      expect(listing?.galleryImages.length).toBeGreaterThanOrEqual(2);
    });

    it('marks a published vehicle as SOLD when confirmed', () => {
      const res = markListingAsSold('FDC-2026-0142');
      expect(res.success).toBe(true);
      expect(res.listing?.status).toBe('SOLD');
      expect(res.listing?.statusLabel).toBe('Vendido');
    });
  });

  describe('WEB-034: Edit Published Advertisement (/vendedor/anuncios/[id]/editar)', () => {
    it('CRITICAL INVARIANT: does NOT overwrite published version directly; creates pending revision', () => {
      const liveBefore = getSellerListingById('FDC-2026-0142');
      const originalPrice = liveBefore?.priceCents;
      const originalMileage = liveBefore?.mileageKm;

      const res = createPublishedListingRevision('FDC-2026-0142', {
        priceCents: 6190000, // R$ 61.900
        mileageKm: 44700,
        description: 'Nova proposta de descrição com valor promocional.',
      });

      expect(res.success).toBe(true);
      expect(res.revision).toBeDefined();
      expect(res.revision?.status).toBe('PENDING');
      expect(res.revision?.priceCents).toBe(6190000);
      expect(res.revision?.mileageKm).toBe(44700);

      // Verify LIVE vehicle data was NOT modified
      const liveAfter = getSellerListingById('FDC-2026-0142');
      expect(liveAfter?.priceCents).toBe(originalPrice);
      expect(liveAfter?.mileageKm).toBe(originalMileage);

      // Status transitioned to reflect revision in moderation
      expect(liveAfter?.status).toBe('REVISED_PENDING');
      expect(liveAfter?.statusLabel).toBe('Em revisão');
    });
  });

  describe('WEB-035: Pending Revision Comparison (/vendedor/anuncios/[id]/revisoes)', () => {
    it('identifies differences between approved published version and proposed revision', () => {
      const listing = getSellerListingById('FDC-2026-0189');
      expect(listing).toBeDefined();
      expect(listing?.status).toBe('REVISED_PENDING');
      expect(listing?.pendingRevision).toBeDefined();

      const published = {
        priceCents: listing?.priceCents,
        mileageKm: listing?.mileageKm,
      };

      const proposed = {
        priceCents: listing?.pendingRevision?.priceCents,
        mileageKm: listing?.pendingRevision?.mileageKm,
      };

      // Difference checks (matching Figma 698:622)
      expect(published.priceCents).toBe(6390000); // R$ 63.900
      expect(proposed.priceCents).toBe(6190000); // R$ 61.900 (- R$ 2.000)
      expect(published.mileageKm).toBe(45200); // 45.200 km
      expect(proposed.mileageKm).toBe(44700); // 44.700 km (-500 km)
    });
  });
});
