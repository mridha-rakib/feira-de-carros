import { describe, expect, it } from 'vitest';
import {
  MOCK_BUYER_MATCH_ALERTS,
  PUBLIC_VEHICLE_CATALOG,
  getBuyerMatchAlerts,
} from '../../lib/adapters/buyer-catalog-adapter';
import {
  DEFAULT_DEMO_FAVORITES,
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_SAVED_SEARCHES,
  useBuyerStore,
} from '../../stores/use-buyer-store';

describe('Buyer Batch B4 — Favorites, Saved Searches, Alerts & Notification Preferences', () => {
  describe('Legacy WEB-004: Favorites State & Auth Gate (Figma 733:232 / 840:110 / 840:317)', () => {
    it('blocks unauthenticated visitors from saving favorites and opens auth modal', () => {
      useBuyerStore.setState({ isAuthenticated: false, isAuthModalOpen: false });
      const added = useBuyerStore.getState().toggleFavorite('veh-civic-2022');

      expect(added).toBe(false);
      expect(useBuyerStore.getState().isAuthModalOpen).toBe(true);
      expect(useBuyerStore.getState().favorites.includes('veh-civic-2022')).toBe(false);
    });

    it('allows authenticated buyers to toggle favorites on and off', () => {
      useBuyerStore.setState({ isAuthenticated: true, favorites: [] });

      // Add vehicle
      const added = useBuyerStore.getState().toggleFavorite('veh-civic-2022');
      expect(added).toBe(true);
      expect(useBuyerStore.getState().isFavorite('veh-civic-2022')).toBe(true);
      expect(useBuyerStore.getState().favorites).toContain('veh-civic-2022');

      // Toggle off
      const toggledOff = useBuyerStore.getState().toggleFavorite('veh-civic-2022');
      expect(toggledOff).toBe(true);
      expect(useBuyerStore.getState().isFavorite('veh-civic-2022')).toBe(false);
      expect(useBuyerStore.getState().favorites).not.toContain('veh-civic-2022');
    });

    it('supports clearFavorites and restoreDemoFavorites', () => {
      useBuyerStore.getState().restoreDemoFavorites();
      expect(useBuyerStore.getState().favorites.length).toBe(DEFAULT_DEMO_FAVORITES.length);

      useBuyerStore.getState().clearFavorites();
      expect(useBuyerStore.getState().favorites.length).toBe(0);
    });

    it('identifies sold or unavailable listings in favorites', () => {
      const soldVehicle = PUBLIC_VEHICLE_CATALOG.find((v) => v.id === 'veh-compass-2021-sold');
      expect(soldVehicle).toBeDefined();
      expect(soldVehicle?.isSold).toBe(true);
      expect(soldVehicle?.isUnavailable).toBe(true);
    });

    it('correctly resolves favorites into catalog vehicle items with category counts', () => {
      const demoFavorites = [
        'veh-corolla-2021', // Carros
        'veh-cg160-2022', // Motos
        'veh-volvo-fh540-2021', // Caminhões
        'veh-compass-2021-sold', // Carros (sold)
      ];

      const resolved = demoFavorites
        .map((id) => PUBLIC_VEHICLE_CATALOG.find((v) => v.id === id))
        .filter(Boolean);

      expect(resolved.length).toBe(4);

      const cars = resolved.filter((v) => v?.category === 'Carros');
      const motos = resolved.filter((v) => v?.category === 'Motos');
      const trucks = resolved.filter((v) => v?.category === 'Caminhões');

      expect(cars.length).toBe(2);
      expect(motos.length).toBe(1);
      expect(trucks.length).toBe(1);
    });
  });

  describe('Legacy WEB-009: Saved Searches Management (Figma 856:165 / 856:192)', () => {
    it('initializes with default mock saved searches matching Figma specs', () => {
      expect(DEFAULT_SAVED_SEARCHES.length).toBeGreaterThanOrEqual(3);
      const corollaSearch = DEFAULT_SAVED_SEARCHES.find((s) => s.id === 'search-corolla-ipatinga');
      expect(corollaSearch).toBeDefined();
      expect(corollaSearch?.title).toBe('Toyota Corolla em Ipatinga');
      expect(corollaSearch?.params.marca).toBe('Toyota');
      expect(corollaSearch?.params.modelo).toBe('Corolla');
      expect(corollaSearch?.alertsEnabled).toBe(true);
    });

    it('creates a new saved search with custom filter parameters', () => {
      useBuyerStore.setState({ savedSearches: [...DEFAULT_SAVED_SEARCHES] });

      const newSearch = useBuyerStore.getState().saveSearch(
        'SUVs em Ipatinga até R$ 140.000',
        {
          categoria: 'Carros',
          carroceria: 'SUV',
          precoMax: '140000',
          cidade: 'Ipatinga',
        },
        'Carros',
      );

      expect(newSearch.id).toBeDefined();
      expect(newSearch.title).toBe('SUVs em Ipatinga até R$ 140.000');
      expect(newSearch.params.carroceria).toBe('SUV');
      expect(newSearch.alertsEnabled).toBe(true);

      const state = useBuyerStore.getState();
      expect(state.savedSearches.some((s) => s.id === newSearch.id)).toBe(true);
    });

    it('toggles search alert status on and off', () => {
      const searchId = DEFAULT_SAVED_SEARCHES[0].id;
      const initialAlertState = DEFAULT_SAVED_SEARCHES[0].alertsEnabled;

      useBuyerStore.getState().toggleSearchAlert(searchId);
      const updated = useBuyerStore.getState().savedSearches.find((s) => s.id === searchId);
      expect(updated?.alertsEnabled).toBe(!initialAlertState);

      useBuyerStore.getState().toggleSearchAlert(searchId);
      const restored = useBuyerStore.getState().savedSearches.find((s) => s.id === searchId);
      expect(restored?.alertsEnabled).toBe(initialAlertState);
    });

    it('deletes a saved search and updates count', () => {
      useBuyerStore.setState({ savedSearches: [...DEFAULT_SAVED_SEARCHES] });
      const initialCount = useBuyerStore.getState().savedSearches.length;

      useBuyerStore.getState().deleteSavedSearch('search-picapes-auto');
      const nextSearches = useBuyerStore.getState().savedSearches;

      expect(nextSearches.length).toBe(initialCount - 1);
      expect(nextSearches.some((s) => s.id === 'search-picapes-auto')).toBe(false);
    });

    it('reconstructs URL search parameters from saved search dictionary', () => {
      const search = DEFAULT_SAVED_SEARCHES[0];
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(search.params)) {
        params.set(k, v);
      }
      const url = `/veiculos?${params.toString()}`;

      expect(url).toContain('marca=Toyota');
      expect(url).toContain('modelo=Corolla');
      expect(url).toContain('cidade=Ipatinga');
    });
  });

  describe('Legacy WEB-010: Matching Alerts (Figma 856:219 / 856:240)', () => {
    it('returns deterministic mock vehicle match alerts', () => {
      const alerts = getBuyerMatchAlerts();
      expect(alerts.length).toBeGreaterThan(0);

      const first = alerts[0];
      expect(first.id).toBeDefined();
      expect(first.savedSearchTitle).toBe('Toyota Corolla em Ipatinga');
      expect(first.vehicle).toBeDefined();
      expect(first.vehicle.priceFormatted).toMatch(/^R\$\s/);
      expect(first.notifiedAt).toBeDefined();
    });

    it('links match alerts to valid public catalog vehicle items', () => {
      for (const alert of MOCK_BUYER_MATCH_ALERTS) {
        expect(alert.vehicle.id).toBe(alert.vehicleId);
        expect(PUBLIC_VEHICLE_CATALOG.some((v) => v.id === alert.vehicleId)).toBe(true);
      }
    });
  });

  describe('Legacy WEB-011: Notification Preferences (Figma 856:261 / 856:282)', () => {
    it('initializes with default recommended notification preferences', () => {
      expect(DEFAULT_NOTIFICATION_PREFERENCES.savedSearchAlerts).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.emailChannel).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.pushChannel).toBe(false);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.sellerMessages).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.promotionsNewsletters).toBe(false);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.frequency).toBe('immediate');
    });

    it('updates individual notification preferences and sets lastUpdated timestamp', () => {
      useBuyerStore.setState({
        notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
      });

      useBuyerStore.getState().updateNotificationPreferences({
        pushChannel: true,
        frequency: 'daily',
      });

      const state = useBuyerStore.getState();
      expect(state.notificationPreferences.pushChannel).toBe(true);
      expect(state.notificationPreferences.frequency).toBe('daily');
      expect(state.notificationPreferences.lastUpdated).toBeDefined();
    });

    it('resets notification preferences to recommended defaults', () => {
      useBuyerStore.getState().updateNotificationPreferences({
        savedSearchAlerts: false,
        emailChannel: false,
        sellerMessages: false,
      });

      useBuyerStore.getState().resetNotificationPreferences();
      const state = useBuyerStore.getState();

      expect(state.notificationPreferences.savedSearchAlerts).toBe(true);
      expect(state.notificationPreferences.emailChannel).toBe(true);
      expect(state.notificationPreferences.sellerMessages).toBe(true);
    });
  });
});
