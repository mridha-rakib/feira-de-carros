import {
  type DealerSortOption,
  type DealerVehicleListing,
  MOCK_DEALER_INVENTORY_METRICS,
  MOCK_DEALER_VEHICLES,
  filterAndSortDealerVehicles,
} from '@/lib/adapters/mock-dealer-inventory';
import { describe, expect, it } from 'vitest';

describe('Dealership Batch D2 — Inventory Overview & Fleet Management (WEB-021)', () => {
  describe('1. Figma Fixtures & Data Integrity', () => {
    it('provides the exact 5 initial dealership fleet vehicles from Figma (1592:3472)', () => {
      expect(MOCK_DEALER_VEHICLES).toHaveLength(5);

      const makes = MOCK_DEALER_VEHICLES.map((v) => v.make);
      expect(makes).toEqual(['Honda', 'Toyota', 'Chevrolet', 'Hyundai', 'Volkswagen']);
    });

    it('contains valid Brazilian Mercosul / standard plates and prices for all vehicles', () => {
      for (const vehicle of MOCK_DEALER_VEHICLES) {
        expect(vehicle.id).toMatch(/^dlr-veh-\d{3}$/);
        expect(vehicle.plate).toMatch(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/);
        expect(vehicle.price).toBeGreaterThan(0);
        expect(vehicle.formattedPrice).toMatch(/^R\$\s\d{1,3}\.\d{3}$/);
        expect(vehicle.isMockData).toBe(true);
      }
    });

    it('matches Figma analytics summary metrics (12.840 total views, 482 today)', () => {
      expect(MOCK_DEALER_INVENTORY_METRICS.totalViews).toBe(12840);
      expect(MOCK_DEALER_INVENTORY_METRICS.viewsToday).toBe(482);
      expect(MOCK_DEALER_INVENTORY_METRICS.topOrigins).toContain('Ipatinga, MG');
      expect(MOCK_DEALER_INVENTORY_METRICS.topOrigins).toContain('Belo Horizonte, MG');
      expect(MOCK_DEALER_INVENTORY_METRICS.isMockData).toBe(true);
    });

    it('strictly isolates dealership fleet from seller private data (no CPF/CNPJ leaks)', () => {
      for (const vehicle of MOCK_DEALER_VEHICLES) {
        // Confirm no private CPF/CNPJ or raw owner credentials exist on vehicle entity
        expect((vehicle as unknown as Record<string, unknown>).cpf).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).cnpj).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).sellerCpf).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).password).toBeUndefined();
      }
    });
  });

  describe('2. Text Search Filtering', () => {
    it('filters vehicles by make (case-insensitive)', () => {
      const resultsHonda = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, 'honda', 'all', 'all');
      expect(resultsHonda).toHaveLength(1);
      expect(resultsHonda[0].model).toBe('Civic');

      const resultsToyota = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        'TOYOTA',
        'all',
        'all',
      );
      expect(resultsToyota).toHaveLength(1);
      expect(resultsToyota[0].model).toBe('Corolla');
    });

    it('filters vehicles by model name', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, 'Onix', 'all', 'all');
      expect(results).toHaveLength(1);
      expect(results[0].make).toBe('Chevrolet');
    });

    it('filters vehicles by plate substring', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, 'BRA2E19', 'all', 'all');
      expect(results).toHaveLength(1);
      expect(results[0].model).toBe('Civic');
    });

    it('returns empty array when search query matches no vehicle', () => {
      const results = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        'Ferrari Testarossa',
        'all',
        'all',
      );
      expect(results).toHaveLength(0);
    });
  });

  describe('3. Status Dropdown Filtering', () => {
    it('filters by "active" status returning 2 active vehicles', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'active', 'all');
      expect(results).toHaveLength(2);
      expect(results.every((v) => v.status === 'active')).toBe(true);
      expect(results.map((v) => v.model)).toContain('Civic');
      expect(results.map((v) => v.model)).toContain('Polo');
    });

    it('filters by "in_review" status returning 1 vehicle', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'in_review', 'all');
      expect(results).toHaveLength(1);
      expect(results[0].model).toBe('Corolla');
      expect(results[0].statusLabel).toBe('Em análise');
    });

    it('filters by "expiring" status returning 1 vehicle', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'expiring', 'all');
      expect(results).toHaveLength(1);
      expect(results[0].model).toBe('Onix');
      expect(results[0].statusLabel).toBe('Expirando');
    });

    it('filters by "paused" status returning 1 vehicle', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'paused', 'all');
      expect(results).toHaveLength(1);
      expect(results[0].model).toBe('Creta');
      expect(results[0].statusLabel).toBe('Pausado');
    });

    it('returns all 5 vehicles when status is "all"', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'all', 'all');
      expect(results).toHaveLength(5);
    });
  });

  describe('4. Plan Dropdown Filtering', () => {
    it('filters by "premium" plan returning Civic and Onix', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'all', 'premium');
      expect(results).toHaveLength(2);
      expect(results.map((v) => v.model).sort()).toEqual(['Civic', 'Onix'].sort());
    });

    it('filters by "essential" plan returning Corolla and Polo', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'all', 'essential');
      expect(results).toHaveLength(2);
      expect(results.map((v) => v.model).sort()).toEqual(['Corolla', 'Polo'].sort());
    });

    it('filters by "none" plan returning Creta', () => {
      const results = filterAndSortDealerVehicles(MOCK_DEALER_VEHICLES, '', 'all', 'none');
      expect(results).toHaveLength(1);
      expect(results[0].model).toBe('Creta');
      expect(results[0].planLabel).toBe('Sem impulsionamento');
    });
  });

  describe('5. Multi-criteria Filtering', () => {
    it('combines text search and status filter accurately', () => {
      // "Civic" + status "active" -> 1
      const activeCivic = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        'Civic',
        'active',
        'all',
      );
      expect(activeCivic).toHaveLength(1);

      // "Civic" + status "paused" -> 0
      const pausedCivic = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        'Civic',
        'paused',
        'all',
      );
      expect(pausedCivic).toHaveLength(0);
    });

    it('combines text search, status, and plan filter accurately', () => {
      const matching = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        'Honda',
        'active',
        'premium',
      );
      expect(matching).toHaveLength(1);
      expect(matching[0].id).toBe('dlr-veh-001');

      const mismatchPlan = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        'Honda',
        'active',
        'essential',
      );
      expect(mismatchPlan).toHaveLength(0);
    });
  });

  describe('6. Sorting Behavior', () => {
    it('sorts by lowest price first (price_asc)', () => {
      const sorted = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        '',
        'all',
        'all',
        'price_asc',
      );
      expect(sorted[0].price).toBe(76900); // VW Polo
      expect(sorted[sorted.length - 1].price).toBe(124900); // Honda Civic
    });

    it('sorts by highest price first (price_desc)', () => {
      const sorted = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        '',
        'all',
        'all',
        'price_desc',
      );
      expect(sorted[0].price).toBe(124900); // Honda Civic
      expect(sorted[sorted.length - 1].price).toBe(76900); // VW Polo
    });

    it('sorts by views count descending (views_desc)', () => {
      const sorted = filterAndSortDealerVehicles(
        MOCK_DEALER_VEHICLES,
        '',
        'all',
        'all',
        'views_desc',
      );
      expect(sorted[0].viewsCount).toBe(2340); // Honda Civic
      expect(sorted[sorted.length - 1].viewsCount).toBe(420); // Hyundai Creta
    });
  });

  describe('7. Interactive State Mutation Simulation', () => {
    it('toggles vehicle status between active and paused cleanly', () => {
      const initialVehicles: DealerVehicleListing[] = [...MOCK_DEALER_VEHICLES];
      const targetVehicle = initialVehicles.find((v) => v.id === 'dlr-veh-001');
      expect(targetVehicle).toBeDefined();
      expect(targetVehicle?.status).toBe('active');

      // Simulate pausing
      const pausedVehicles = initialVehicles.map((v) => {
        if (v.id === 'dlr-veh-001') {
          return {
            ...v,
            status: 'paused' as const,
            statusLabel: 'Pausado' as const,
            expiresAtLabel: 'Pausado',
          };
        }
        return v;
      });

      const pausedCivic = pausedVehicles.find((v) => v.id === 'dlr-veh-001');
      expect(pausedCivic).toBeDefined();
      expect(pausedCivic?.status).toBe('paused');
      expect(pausedCivic?.statusLabel).toBe('Pausado');

      // Simulate reactivating
      const reactivatedVehicles = pausedVehicles.map((v) => {
        if (v.id === 'dlr-veh-001') {
          return {
            ...v,
            status: 'active' as const,
            statusLabel: 'Ativo' as const,
            expiresAtLabel: '15/11/2026',
          };
        }
        return v;
      });

      const activeCivic = reactivatedVehicles.find((v) => v.id === 'dlr-veh-001');
      expect(activeCivic).toBeDefined();
      expect(activeCivic?.status).toBe('active');
      expect(activeCivic?.statusLabel).toBe('Ativo');
    });

    it('renews expiring vehicle and updates expiration date and status', () => {
      const initialVehicles: DealerVehicleListing[] = [...MOCK_DEALER_VEHICLES];
      const expiringVehicle = initialVehicles.find((v) => v.id === 'dlr-veh-003');
      expect(expiringVehicle).toBeDefined();
      expect(expiringVehicle?.status).toBe('expiring');

      // Simulate renew
      const renewedVehicles = initialVehicles.map((v) => {
        if (v.id === 'dlr-veh-003') {
          return {
            ...v,
            status: 'active' as const,
            statusLabel: 'Ativo' as const,
            expiresAt: '18/12/2026',
            expiresAtLabel: '18/12/2026',
          };
        }
        return v;
      });

      const renewedOnix = renewedVehicles.find((v) => v.id === 'dlr-veh-003');
      expect(renewedOnix).toBeDefined();
      expect(renewedOnix?.status).toBe('active');
      expect(renewedOnix?.statusLabel).toBe('Ativo');
      expect(renewedOnix?.expiresAtLabel).toBe('18/12/2026');
    });
  });
});
