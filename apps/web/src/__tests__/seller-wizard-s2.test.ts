import { beforeEach, describe, expect, it } from 'vitest';
import { WIZARD_STEPS, type WizardStep } from '../../app/components/SellerWizardStepper';
import { initialDraft, useListingDraftStore } from '../../stores/use-listing-draft-store';

describe('Seller Frontend Batch S2 — Advertisement Wizard (WEB-023 to WEB-026)', () => {
  beforeEach(() => {
    useListingDraftStore.getState().resetDraft();
  });

  describe('1. Stepper & Canonical Routes Specification', () => {
    it('defines 4 sequential steps matching approved Figma wizard flow', () => {
      expect(WIZARD_STEPS).toHaveLength(4);
      expect(WIZARD_STEPS.map((s: WizardStep) => s.number)).toEqual([1, 2, 3, 4]);
      expect(WIZARD_STEPS[0].href).toBe('/vendedor/anuncios/novo');
      expect(WIZARD_STEPS[1].href).toBe('/vendedor/anuncios/novo/detalhes');
      expect(WIZARD_STEPS[2].href).toBe('/vendedor/anuncios/novo/fotos');
      expect(WIZARD_STEPS[3].href).toBe('/vendedor/anuncios/novo/revisao');
    });
  });

  describe('2. Step 1: Category Selection (WEB-023)', () => {
    it('initializes with default category and allows updating category', () => {
      const store = useListingDraftStore.getState();
      expect(store.draft.category).toBe('cars');

      store.setCategory('motorcycles');
      expect(useListingDraftStore.getState().draft.category).toBe('motorcycles');

      store.setCategory('trucks');
      expect(useListingDraftStore.getState().draft.category).toBe('trucks');
    });
  });

  describe('3. Step 2: Vehicle Details & Attributes (WEB-024)', () => {
    it('updates vehicle technical specifications in draft', () => {
      const store = useListingDraftStore.getState();
      store.updateDraft({
        make: 'Toyota',
        model: 'Corolla',
        version: '2.0 XEi Flex Automático',
        yearFabrication: 2021,
        yearModel: 2022,
        mileageKm: 42500,
        fuelType: 'Flex',
        transmission: 'Automático',
        color: 'Prata',
        licensePlateLastDigit: '6',
        city: 'São Paulo',
        state: 'SP',
        price: 124900,
      });

      const updated = useListingDraftStore.getState().draft;
      expect(updated.make).toBe('Toyota');
      expect(updated.model).toBe('Corolla');
      expect(updated.price).toBe(124900);
      expect(updated.mileageKm).toBe(42500);
      expect(updated.licensePlateLastDigit).toBe('6');
    });

    it('toggles vehicle optional features correctly', () => {
      const store = useListingDraftStore.getState();
      const initialFeaturesCount = store.draft.features.length;

      // Add a new feature
      store.toggleFeature('Teto solar');
      expect(useListingDraftStore.getState().draft.features).toContain('Teto solar');
      expect(useListingDraftStore.getState().draft.features.length).toBe(initialFeaturesCount + 1);

      // Remove the feature
      store.toggleFeature('Teto solar');
      expect(useListingDraftStore.getState().draft.features).not.toContain('Teto solar');
      expect(useListingDraftStore.getState().draft.features.length).toBe(initialFeaturesCount);
    });
  });

  describe('4. Step 3: Photos & Commercial Plans Policy (WEB-025)', () => {
    it('enforces maximum 5 photos on Plano Básico', () => {
      const store = useListingDraftStore.getState();
      store.setPlan('basic');

      // Attempt adding 7 photos
      for (let i = 1; i <= 7; i++) {
        useListingDraftStore.getState().addImage(`/images/photo-${i}.jpg`);
      }

      // Should be strictly capped at 5
      expect(useListingDraftStore.getState().draft.images).toHaveLength(5);
      expect(useListingDraftStore.getState().draft.images).toEqual([
        '/images/photo-1.jpg',
        '/images/photo-2.jpg',
        '/images/photo-3.jpg',
        '/images/photo-4.jpg',
        '/images/photo-5.jpg',
      ]);
    });

    it('allows up to 10 photos on Plano Estendido', () => {
      const store = useListingDraftStore.getState();
      store.setPlan('extended');

      // Add 10 photos
      for (let i = 1; i <= 12; i++) {
        useListingDraftStore.getState().addImage(`/images/photo-${i}.jpg`);
      }

      // Should be strictly capped at 10
      expect(useListingDraftStore.getState().draft.images).toHaveLength(10);
    });

    it('truncates excess photos when switching from Plano Estendido to Plano Básico', () => {
      const store = useListingDraftStore.getState();
      store.setPlan('extended');

      for (let i = 1; i <= 8; i++) {
        useListingDraftStore.getState().addImage(`/images/photo-${i}.jpg`);
      }
      expect(useListingDraftStore.getState().draft.images).toHaveLength(8);

      // Downgrade to basic
      useListingDraftStore.getState().setPlan('basic');
      expect(useListingDraftStore.getState().draft.images).toHaveLength(5);
    });

    it('handles cover image selection and removal', () => {
      const store = useListingDraftStore.getState();
      store.addImage('/img1.jpg');
      store.addImage('/img2.jpg');
      store.addImage('/img3.jpg');

      store.setCoverImage(1);
      expect(useListingDraftStore.getState().draft.coverImageIndex).toBe(1);

      // Remove an image and ensure coverIndex stays in bounds
      store.removeImage('/img3.jpg');
      expect(useListingDraftStore.getState().draft.images).toHaveLength(2);

      store.removeImage(1);
      expect(useListingDraftStore.getState().draft.images).toHaveLength(1);
      expect(useListingDraftStore.getState().draft.coverImageIndex).toBe(0);
    });

    it('computes correct commercial pricing for basic, extended and boost addon', () => {
      const store = useListingDraftStore.getState();

      // Case 1: Plano Básico standard (R$ 30)
      store.setPlan('basic');
      expect(store.draft.plan).toBe('basic');
      expect(store.draft.hasBoost).toBe(false);

      // Case 2: Plano Básico + Boost (R$ 30 + R$ 10 = R$ 40)
      store.toggleBoost();
      expect(useListingDraftStore.getState().draft.hasBoost).toBe(true);

      // Case 3: Plano Estendido + Boost (R$ 50 + R$ 10 = R$ 60)
      store.setPlan('extended');
      expect(useListingDraftStore.getState().draft.plan).toBe('extended');
      expect(useListingDraftStore.getState().draft.hasBoost).toBe(true);

      // Case 4: Plano Estendido standard (R$ 50)
      store.toggleBoost();
      expect(useListingDraftStore.getState().draft.hasBoost).toBe(false);
    });
  });

  describe('5. Step 4: Review, Protocol Generation & Moderation Policy (WEB-026)', () => {
    it('submits listing and transitions status to pending_review with protocol', () => {
      const store = useListingDraftStore.getState();
      expect(store.draft.submissionStatus).toBe('draft');
      expect(store.draft.protocolNumber).toBeUndefined();

      const protocol = store.submitListing();
      const submittedDraft = useListingDraftStore.getState().draft;

      expect(protocol).toMatch(/^ANUN-\d{4}-[A-Z0-9]{4}$/);
      expect(submittedDraft.submissionStatus).toBe('pending_review');
      expect(submittedDraft.protocolNumber).toBe(protocol);
      expect(submittedDraft.submittedAt).toBeDefined();
    });

    it('loads demo draft for visual QA inspection and resets cleanly', () => {
      const store = useListingDraftStore.getState();
      store.loadDemoDraft();

      const demoState = useListingDraftStore.getState().draft;
      expect(demoState.make).toBe('Toyota');
      expect(demoState.model).toBe('Corolla');
      expect(demoState.price).toBe(124900);
      expect(demoState.images.length).toBeGreaterThan(0);

      store.resetDraft();
      expect(useListingDraftStore.getState().draft).toEqual(initialDraft);
    });
  });
});
