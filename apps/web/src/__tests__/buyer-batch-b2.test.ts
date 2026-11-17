import { describe, expect, it } from 'vitest';
import {
  PUBLIC_DEALERSHIP_CATALOG,
  PUBLIC_VEHICLE_CATALOG,
  getAllDealerships,
  getPublicDealershipById,
  getPublicVehicleById,
  getVehiclesByDealershipId,
  recordPhoneRevealInteraction,
} from '../../lib/adapters/buyer-catalog-adapter';

describe('Buyer Batch B2 — Public Vehicle Detail, Phone Reveal & Dealer Showroom', () => {
  describe('Canonical WEB-006: Vehicle Details Adapter (Figma 733:179 / 733:208)', () => {
    it('retrieves detailed specs for Honda Civic 2022', () => {
      const civic = getPublicVehicleById('veh-civic-2022');
      expect(civic).toBeDefined();
      expect(civic?.title).toBe('Honda Civic 2022');
      expect(civic?.version).toContain('2.0 EXL');
      expect(civic?.priceFormatted).toBe('R$ 124.900');
      expect(civic?.color).toBe('Prata Metálico');
      expect(civic?.plateEnd).toBe('4');
      expect(civic?.doors).toBe(4);
      expect(civic?.features.length).toBeGreaterThanOrEqual(10);
      expect(civic?.features).toContain('Ar-condicionado digital dual zone');
      expect(civic?.features).toContain('Apple CarPlay e Android Auto sem fio');
      expect(civic?.sellerType).toBe('concessionaria');
      expect(civic?.dealershipId).toBe('dealer-lider-seminovos');
      expect(civic?.galleryImages.length).toBeGreaterThanOrEqual(3);
    });

    it('retrieves detailed specs for private seller vehicle (Toyota Corolla 2021)', () => {
      const corolla = getPublicVehicleById('veh-corolla-2021');
      expect(corolla).toBeDefined();
      expect(corolla?.sellerType).toBe('particular');
      expect(corolla?.sellerName).toBe('Carlos Eduardo Mendes');
      expect(corolla?.dealershipId).toBeUndefined();
      expect(corolla?.contactPhoneMasked).toBe('(31) 98765-****');
      expect(corolla?.contactPhoneFull).toBe('(31) 98765-4321');
    });

    it('returns undefined for non-existent vehicle ID', () => {
      expect(getPublicVehicleById('veh-unknown-404')).toBeUndefined();
    });
  });

  describe('Anti-Scraping & Lead Telemetry (Figma 1211:2518 / 1379:2327)', () => {
    it('provides masked phone by default to prevent static scraping', () => {
      for (const vehicle of PUBLIC_VEHICLE_CATALOG) {
        expect(vehicle.contactPhoneMasked).toMatch(/\(\d{2}\)\s[\d*]+-\*{4}/);
        expect(vehicle.contactPhoneFull).toMatch(/\(\d{2}\)\s\d{4,5}-\d{4}/);
      }
    });

    it('records telemetry lead interaction upon phone reveal', () => {
      const telemetry = recordPhoneRevealInteraction('veh-civic-2022', 'concessionaria');
      expect(telemetry.status).toBe('recorded');
      expect(telemetry.vehicleId).toBe('veh-civic-2022');
      expect(telemetry.timestamp).toBeDefined();
    });
  });

  describe('Dealership Showroom Directory & Invariants (Figma 1211:2395 / 1211:2461)', () => {
    it('retrieves dealership by ID and slug', () => {
      const dealer = getPublicDealershipById('dealer-lider-seminovos');
      expect(dealer).toBeDefined();
      expect(dealer?.name).toBe('Líder Veículos Seminovos');
      expect(dealer?.city).toBe('Ipatinga');
      expect(dealer?.state).toBe('MG');
      expect(dealer?.verifiedDealer).toBe(true);
      expect(dealer?.openingHours).toContain('Segunda a Sexta');

      const bySlug = getPublicDealershipById('lider-veiculos-seminovos');
      expect(bySlug).toEqual(dealer);
    });

    it('retrieves all vehicles belonging to a specific dealership', () => {
      const liderVehicles = getVehiclesByDealershipId('dealer-lider-seminovos');
      expect(liderVehicles.length).toBeGreaterThanOrEqual(2);
      expect(liderVehicles.map((v) => v.id)).toContain('veh-civic-2022');
      expect(liderVehicles.map((v) => v.id)).toContain('veh-creta-2022');

      const autocarVehicles = getVehiclesByDealershipId('dealer-autocar-multimarcas');
      expect(autocarVehicles.length).toBe(1);
      expect(autocarVehicles[0].id).toBe('veh-onix-2023');
    });

    it('lists all registered public dealerships', () => {
      const all = getAllDealerships();
      expect(all.length).toBe(3);
      expect(all.map((d) => d.id)).toEqual([
        'dealer-lider-seminovos',
        'dealer-autocar-multimarcas',
        'dealer-valedoaco-motors',
      ]);
    });

    it('strictly satisfies Monorepo & Privacy invariants: NO CNPJ, NO fabricated commercial metrics', () => {
      for (const dealer of PUBLIC_DEALERSHIP_CATALOG) {
        // Invariant: No public CNPJ
        expect((dealer as unknown as Record<string, unknown>).cnpj).toBeUndefined();
        expect((dealer as unknown as Record<string, unknown>).documentNumber).toBeUndefined();

        // Invariant: No fabricated reviews or fake star ratings
        expect((dealer as unknown as Record<string, unknown>).rating).toBeUndefined();
        expect((dealer as unknown as Record<string, unknown>).stars).toBeUndefined();
        expect((dealer as unknown as Record<string, unknown>).reviewsCount).toBeUndefined();
        expect((dealer as unknown as Record<string, unknown>).monthlyRevenue).toBeUndefined();

        // Must be marked as mock data
        expect(dealer.isMockData).toBe(true);
      }
    });
  });
});
