import {
  DEMO_DEALER_DRAFT,
  INITIAL_DEALER_DRAFT,
  useDealerInventoryStore,
} from '@/stores/use-dealer-inventory-store';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Dealership Batch D3 — Listing Creation, Editing & Lifecycle (WEB-023 to WEB-038)', () => {
  beforeEach(() => {
    // Reset store state before each test
    useDealerInventoryStore.getState().resetToFixtures();
  });

  describe('1. Wizard Step 1: Vehicle Category Selection (WEB-023)', () => {
    it('initializes with default category and permits selecting cars, motorcycles, or trucks', () => {
      const store = useDealerInventoryStore.getState();
      expect(store.draft.category).toBe('cars');

      store.setDraftCategory('motorcycles');
      expect(useDealerInventoryStore.getState().draft.category).toBe('motorcycles');

      store.setDraftCategory('trucks');
      expect(useDealerInventoryStore.getState().draft.category).toBe('trucks');

      store.setDraftCategory('cars');
      expect(useDealerInventoryStore.getState().draft.category).toBe('cars');
    });

    it('manages wizard step transitions cleanly between 1 and 4', () => {
      const store = useDealerInventoryStore.getState();
      expect(store.draft.step).toBe(1);

      store.setDraftStep(2);
      expect(useDealerInventoryStore.getState().draft.step).toBe(2);

      store.setDraftStep(3);
      expect(useDealerInventoryStore.getState().draft.step).toBe(3);

      store.setDraftStep(4);
      expect(useDealerInventoryStore.getState().draft.step).toBe(4);

      // Boundaries test (clamped between 1 and 4)
      store.setDraftStep(0);
      expect(useDealerInventoryStore.getState().draft.step).toBe(1);

      store.setDraftStep(10);
      expect(useDealerInventoryStore.getState().draft.step).toBe(4);
    });
  });

  describe('2. Wizard Step 2: Vehicle Attributes & Specs (WEB-024)', () => {
    it('updates draft technical details, pricing, and toggles equipment features', () => {
      const store = useDealerInventoryStore.getState();

      store.updateDraft({
        make: 'Honda',
        model: 'HR-V',
        version: '1.5 Turbo Touring CVT',
        yearFabrication: 2023,
        yearModel: 2024,
        mileageKm: 14200,
        fuelType: 'Gasolina',
        transmission: 'CVT',
        color: 'Azul Cósmico',
        licensePlate: 'BRA7H99',
        price: 159900,
        description: 'HR-V Touring topo de linha com teto panorâmico e pacote Honda Sensing.',
      });

      const updatedDraft = useDealerInventoryStore.getState().draft;
      expect(updatedDraft.make).toBe('Honda');
      expect(updatedDraft.model).toBe('HR-V');
      expect(updatedDraft.price).toBe(159900);
      expect(updatedDraft.licensePlate).toBe('BRA7H99');

      // Feature toggles
      expect(updatedDraft.features).toContain('Ar-condicionado');
      store.toggleDraftFeature('Teto solar');
      expect(useDealerInventoryStore.getState().draft.features).toContain('Teto solar');

      // Toggle off
      store.toggleDraftFeature('Teto solar');
      expect(useDealerInventoryStore.getState().draft.features).not.toContain('Teto solar');
    });

    it('loads comprehensive demo draft data instantly for rapid QA evaluation', () => {
      const store = useDealerInventoryStore.getState();
      store.loadDemoDraft();

      const draft = useDealerInventoryStore.getState().draft;
      expect(draft.make).toBe('Toyota');
      expect(draft.model).toBe('Yaris');
      expect(draft.price).toBe(98900);
      expect(draft.licensePlate).toBe('BRA9E88');
      expect(draft.images.length).toBeGreaterThan(0);
      expect(draft.features.length).toBeGreaterThan(0);
    });
  });

  describe('3. Wizard Step 3: Photo Quota & Cover Selection (WEB-025)', () => {
    it('adds and removes photo URLs up to the Dealership quota (10 photos max)', () => {
      const store = useDealerInventoryStore.getState();
      expect(store.draft.images).toHaveLength(0);

      store.addDraftImage('/images/vehicles/demo/toyota-corolla-2021-b6.jpg');
      store.addDraftImage('/images/vehicles/demo/vw-polo-2023.jpg');
      expect(useDealerInventoryStore.getState().draft.images).toHaveLength(2);

      // Prevents adding duplicate photo
      store.addDraftImage('/images/vehicles/demo/toyota-corolla-2021-b6.jpg');
      expect(useDealerInventoryStore.getState().draft.images).toHaveLength(2);

      // Sets cover image
      store.setDraftCoverImage(1);
      expect(useDealerInventoryStore.getState().draft.coverImageIndex).toBe(1);

      // Removes photo by index
      store.removeDraftImage(0);
      const remainingImages = useDealerInventoryStore.getState().draft.images;
      expect(remainingImages).toHaveLength(1);
      expect(remainingImages[0]).toBe('/images/vehicles/demo/vw-polo-2023.jpg');
    });
  });

  describe('4. Wizard Step 4: Submission & Inventory Integration (WEB-026 & WEB-021)', () => {
    it('submits listing, generates protocol, and prepends new vehicle to inventory in "Em análise" state', () => {
      const store = useDealerInventoryStore.getState();
      const initialCount = store.vehicles.length;

      // Populate draft
      store.updateDraft({
        make: 'Nissan',
        model: 'Kicks',
        version: '1.6 Exclusive CVT',
        yearFabrication: 2023,
        yearModel: 2024,
        mileageKm: 21000,
        fuelType: 'Flex',
        transmission: 'CVT',
        color: 'Cinza Grafite',
        licensePlate: 'KIK3S99',
        price: 114900,
        description: 'Kicks Exclusive em estado de 0km.',
        images: ['/images/vehicles/demo/sedan-fallback.svg'],
      });

      const createdVehicle = store.submitDraft();

      expect(createdVehicle.id).toMatch(/^dlr-veh-\d{3}$/);
      expect(createdVehicle.make).toBe('Nissan');
      expect(createdVehicle.model).toBe('Kicks');
      expect(createdVehicle.status).toBe('in_review');
      expect(createdVehicle.statusLabel).toBe('Em análise');
      expect(createdVehicle.expiresAtLabel).toBe('Aguardando aprovação');
      expect(createdVehicle.viewsCount).toBe(0);
      expect(createdVehicle.isMockData).toBe(true);

      // Verify listing appears in live inventory
      const updatedVehicles = useDealerInventoryStore.getState().vehicles;
      expect(updatedVehicles).toHaveLength(initialCount + 1);
      expect(updatedVehicles[0].id).toBe(createdVehicle.id);

      // Verify protocol number was recorded
      expect(useDealerInventoryStore.getState().draft.protocolNumber).toMatch(
        /^PROT-DLR-202611-\d{4}$/,
      );
    });
  });

  describe('5. Listing Editing & Revision Governance (WEB-034 & WEB-035)', () => {
    it('creates a pending revision while keeping active vehicle live (VEH-018)', () => {
      const store = useDealerInventoryStore.getState();
      const targetVehicle = store.vehicles.find((v) => v.id === 'dlr-veh-001');
      expect(targetVehicle).toBeDefined();
      expect(targetVehicle?.price).toBe(124900);
      expect(targetVehicle?.status).toBe('active');

      // Submit proposed revision with reduced price and updated mileage
      store.submitRevision('dlr-veh-001', {
        price: 119900,
        mileageKm: 29000,
        description: 'Preço promocional de fim de semana na concessionária.',
        features: ['Ar-condicionado digital', 'Bancos de couro'],
      });

      const updatedVehicle = useDealerInventoryStore.getState().getVehicleById('dlr-veh-001');
      expect(updatedVehicle).toBeDefined();
      expect(updatedVehicle?.status).toBe('in_review');
      expect(updatedVehicle?.statusLabel).toBe('Em análise');
      expect(updatedVehicle?.pendingRevision).toBeDefined();
      expect(updatedVehicle?.pendingRevision?.price).toBe(119900);
      expect(updatedVehicle?.pendingRevision?.formattedPrice).toBe('R$ 119.900');
      expect(updatedVehicle?.pendingRevision?.mileageKm).toBe(29000);
      expect(updatedVehicle?.pendingRevision?.submittedAt).toBeDefined();
    });
  });

  describe('6. Sold Vehicle Removal & Lifecycle States (WEB-038)', () => {
    it('marks vehicle as sold, updating status to "Vendido" and recording sold timestamp (VEH-020)', () => {
      const store = useDealerInventoryStore.getState();
      const targetVehicle = store.vehicles.find((v) => v.id === 'dlr-veh-005');
      expect(targetVehicle).toBeDefined();
      expect(targetVehicle?.status).toBe('active');

      store.markAsSold('dlr-veh-005');

      const soldVehicle = useDealerInventoryStore.getState().getVehicleById('dlr-veh-005');
      expect(soldVehicle?.status).toBe('sold');
      expect(soldVehicle?.statusLabel).toBe('Vendido');
      expect(soldVehicle?.expiresAtLabel).toBe('Vendido');
      expect(soldVehicle?.soldAt).toBeDefined();
    });

    it('toggles pause and active states cleanly', () => {
      const store = useDealerInventoryStore.getState();
      const targetVehicle = store.vehicles.find((v) => v.id === 'dlr-veh-001');
      expect(targetVehicle?.status).toBe('active');

      // Pause
      store.togglePause('dlr-veh-001');
      expect(useDealerInventoryStore.getState().getVehicleById('dlr-veh-001')?.status).toBe(
        'paused',
      );

      // Reactivate
      store.togglePause('dlr-veh-001');
      expect(useDealerInventoryStore.getState().getVehicleById('dlr-veh-001')?.status).toBe(
        'active',
      );
    });

    it('renews expiring vehicle and updates expiration date', () => {
      const store = useDealerInventoryStore.getState();
      const expiringVehicle = store.vehicles.find((v) => v.id === 'dlr-veh-003');
      expect(expiringVehicle?.status).toBe('expiring');

      store.renewVehicle('dlr-veh-003');

      const renewed = useDealerInventoryStore.getState().getVehicleById('dlr-veh-003');
      expect(renewed?.status).toBe('active');
      expect(renewed?.statusLabel).toBe('Ativo');
      expect(renewed?.expiresAtLabel).toBe('18/12/2026');
    });
  });

  describe('7. Data Isolation & Privacy Invariants', () => {
    it('ensures dealership listings contain no seller CPF or raw owner credentials', () => {
      const store = useDealerInventoryStore.getState();
      for (const vehicle of store.vehicles) {
        expect((vehicle as unknown as Record<string, unknown>).cpf).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).sellerCpf).toBeUndefined();
        expect((vehicle as unknown as Record<string, unknown>).password).toBeUndefined();
        expect(vehicle.id).toMatch(/^dlr-veh-\d{3}$/);
      }
    });
  });
});
