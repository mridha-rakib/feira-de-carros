import { beforeEach, describe, expect, it } from 'vitest';
import {
  APPROVED_LOCATIONS,
  PUBLIC_VEHICLE_CATALOG,
  getFeaturedVehicles,
  getPublicVehicleById,
  searchPublicCatalog,
} from '../../lib/adapters/buyer-catalog-adapter';
import { useBuyerStore } from '../../stores/use-buyer-store';

describe('Buyer Batch B1 — Public Catalog & Discovery Search', () => {
  beforeEach(() => {
    // Reset store state
    useBuyerStore.setState({
      location: { city: 'Ipatinga', state: 'MG', label: 'Ipatinga, MG' },
      favorites: ['veh-civic-2022'],
      isLocationModalOpen: false,
      isAuthModalOpen: false,
      authModalRedirect: '/veiculos',
      isAuthenticated: false,
    });
  });

  describe('Catalog Data Boundaries & Invariants', () => {
    it('only contains approved published public vehicles with explicit DEMO DATA provenance', () => {
      expect(PUBLIC_VEHICLE_CATALOG.length).toBeGreaterThanOrEqual(9);

      for (const vehicle of PUBLIC_VEHICLE_CATALOG) {
        expect(vehicle.isMockData).toBe(true);
        expect(vehicle.id).toBeDefined();
        expect(vehicle.title).toBeDefined();
        expect(vehicle.priceCents).toBeGreaterThan(0);
        expect(vehicle.priceFormatted).toMatch(/^R\$\s[\d.]+/);
        expect(vehicle.city).toBeDefined();
        expect(vehicle.state).toBeDefined();
        expect(vehicle.yearModel).toBeGreaterThan(2000);
      }
    });

    it('does not expose internal seller metrics, moderation comments, or private draft statuses', () => {
      for (const vehicle of PUBLIC_VEHICLE_CATALOG) {
        // Must not contain seller private keys
        expect((vehicle as unknown as Record<string, unknown>).metrics).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).correction).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).revisions).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).status).toBeUndefined(); // Uses public condition instead
      }
    });

    it('returns featured vehicles for homepage hero matching Figma 1437:2452', () => {
      const featured = getFeaturedVehicles();
      expect(featured.length).toBeGreaterThanOrEqual(4);
      expect(featured.map((v) => v.title)).toContain('Honda Civic 2022');
      expect(featured.map((v) => v.title)).toContain('Toyota Corolla 2021');
      expect(featured.map((v) => v.title)).toContain('Chevrolet Onix 2023');
      expect(featured.map((v) => v.title)).toContain('Hyundai Creta 2022');
    });

    it('finds public vehicle by ID correctly', () => {
      const civic = getPublicVehicleById('veh-civic-2022');
      expect(civic).toBeDefined();
      expect(civic?.brand).toBe('Honda');
      expect(civic?.bodyType).toBe('Sedã');

      const nonExistent = getPublicVehicleById('non-existent-id');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('Search & Filter Engine (WEB-004 & WEB-005)', () => {
    it('filters vehicles by search text query matching title or brand', () => {
      const { results: corollas } = searchPublicCatalog({ query: 'Corolla' });
      expect(corollas.length).toBe(1);
      expect(corollas[0].title).toBe('Toyota Corolla 2021');

      const { results: honda } = searchPublicCatalog({ query: 'honda' });
      expect(honda.length).toBe(2); // Civic and CG 160
    });

    it('filters vehicles by category (Carros, Motos, Caminhões)', () => {
      const { results: carros } = searchPublicCatalog({ category: 'Carros' });
      expect(carros.length).toBeGreaterThanOrEqual(7);
      expect(carros.every((v) => v.category === 'Carros')).toBe(true);

      const { results: motos } = searchPublicCatalog({ category: 'Motos' });
      expect(motos.length).toBe(1);
      expect(motos[0].title).toBe('Honda CG 160 Titan 2022');

      const { results: caminhoes } = searchPublicCatalog({ category: 'Caminhões' });
      expect(caminhoes.length).toBe(1);
      expect(caminhoes[0].title).toBe('Volvo FH 540 2021');
    });

    it('filters vehicles by body type (Sedã, Hatch, SUV, Picape)', () => {
      const { results: sedans } = searchPublicCatalog({ bodyType: 'Sedã' });
      expect(sedans.length).toBe(2);
      expect(sedans.map((v) => v.model)).toEqual(expect.arrayContaining(['Civic', 'Corolla']));

      const { results: suvs } = searchPublicCatalog({ bodyType: 'SUV' });
      expect(suvs.length).toBe(2); // Creta and Compass

      const { results: pickups } = searchPublicCatalog({ bodyType: 'Picape' });
      expect(pickups.length).toBe(1);
      expect(pickups[0].model).toBe('Strada');
    });

    it('filters vehicles by brand and model', () => {
      const { results } = searchPublicCatalog({ brand: 'Toyota', model: 'Corolla' });
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Toyota Corolla 2021');
    });

    it('filters vehicles by max price', () => {
      const { results } = searchPublicCatalog({ maxPrice: 90000 });
      expect(results.every((v) => v.priceCents <= 9000000)).toBe(true);
      expect(results.map((v) => v.model)).toContain('Onix');
      expect(results.map((v) => v.model)).toContain('Polo Track');
      expect(results.map((v) => v.model)).not.toContain('Civic');
    });

    it('sorts vehicles by price ascending and descending', () => {
      const { results: asc } = searchPublicCatalog({ sortBy: 'menor_preco' });
      for (let i = 0; i < asc.length - 1; i++) {
        expect(asc[i].priceCents).toBeLessThanOrEqual(asc[i + 1].priceCents);
      }

      const { results: desc } = searchPublicCatalog({ sortBy: 'maior_preco' });
      for (let i = 0; i < desc.length - 1; i++) {
        expect(desc[i].priceCents).toBeGreaterThanOrEqual(desc[i + 1].priceCents);
      }
    });

    it('sorts vehicles by mileage ascending', () => {
      const { results } = searchPublicCatalog({ sortBy: 'menor_km' });
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].mileageKm).toBeLessThanOrEqual(results[i + 1].mileageKm);
      }
    });

    it('returns empty results when no vehicles match criteria', () => {
      const { results, totalCount } = searchPublicCatalog({
        brand: 'Ferrari',
      });
      expect(results.length).toBe(0);
      expect(totalCount).toBe(0);
    });
  });

  describe('Buyer State Management & Location (WEB-002)', () => {
    it('manages current location and approved locations list', () => {
      const state = useBuyerStore.getState();
      expect(state.location.city).toBe('Ipatinga');
      expect(state.location.state).toBe('MG');

      expect(APPROVED_LOCATIONS.length).toBeGreaterThanOrEqual(5);
      expect(APPROVED_LOCATIONS.some((loc) => loc.city === 'Ipatinga')).toBe(true);
      expect(APPROVED_LOCATIONS.some((loc) => loc.city === 'Belo Horizonte')).toBe(true);

      useBuyerStore.getState().setLocation('Belo Horizonte', 'MG');
      expect(useBuyerStore.getState().location.city).toBe('Belo Horizonte');
      expect(useBuyerStore.getState().location.label).toBe('Belo Horizonte, MG');
    });

    it('enforces favorites authentication gate for unauthenticated guest visitors (Figma 840:317)', () => {
      // User is guest by default
      expect(useBuyerStore.getState().isAuthenticated).toBe(false);
      expect(useBuyerStore.getState().isAuthModalOpen).toBe(false);

      // Attempting to toggle favorite as guest opens the auth gate modal and preserves state
      const result = useBuyerStore.getState().toggleFavorite('veh-corolla-2021', '/veiculos');
      expect(result).toBe(false);
      expect(useBuyerStore.getState().isAuthModalOpen).toBe(true);
      expect(useBuyerStore.getState().authModalRedirect).toBe('/veiculos');
      expect(useBuyerStore.getState().favorites).not.toContain('veh-corolla-2021');

      // Closing the auth modal
      useBuyerStore.getState().closeAuthModal();
      expect(useBuyerStore.getState().isAuthModalOpen).toBe(false);
    });

    it('toggles vehicle favorites when authenticated as a member', () => {
      useBuyerStore.getState().setAuthenticated(true);
      expect(useBuyerStore.getState().isAuthenticated).toBe(true);

      // Toggle off existing favorite
      const toggleOff = useBuyerStore.getState().toggleFavorite('veh-civic-2022');
      expect(toggleOff).toBe(true);
      expect(useBuyerStore.getState().isFavorite('veh-civic-2022')).toBe(false);
      expect(useBuyerStore.getState().favorites).not.toContain('veh-civic-2022');

      // Toggle on
      const toggleOn = useBuyerStore.getState().toggleFavorite('veh-corolla-2021');
      expect(toggleOn).toBe(true);
      expect(useBuyerStore.getState().isFavorite('veh-corolla-2021')).toBe(true);
      expect(useBuyerStore.getState().favorites).toContain('veh-corolla-2021');
    });

    it('controls location modal open and close states', () => {
      expect(useBuyerStore.getState().isLocationModalOpen).toBe(false);

      useBuyerStore.getState().openLocationModal();
      expect(useBuyerStore.getState().isLocationModalOpen).toBe(true);

      useBuyerStore.getState().closeLocationModal();
      expect(useBuyerStore.getState().isLocationModalOpen).toBe(false);
    });
  });
});
