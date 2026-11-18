import { beforeEach, describe, expect, it } from 'vitest';
import { getPublicDealershipById } from '../../lib/adapters/buyer-catalog-adapter';
import {
  DEFAULT_DEALER_PUBLIC_PROFILE,
  MAX_BANNER_BYTES,
  MAX_LOGO_BYTES,
  useDealerProfileStore,
  validateBannerFile,
  validateLogoFile,
  validateProfile,
} from '../../stores/use-dealer-profile-store';

describe('Dealership Frontend Batch D4 — Business Profile & Showroom Integration (WEB-022)', () => {
  beforeEach(() => {
    useDealerProfileStore.getState().resetToDefaults();
  });

  // 1. Initial State & Fixture Loading
  it('loads with correct approved default dealership fixture and dealer ID ownership', () => {
    const state = useDealerProfileStore.getState();
    expect(state.publishedProfile.id).toBe('dealer-lider-seminovos');
    expect(state.publishedProfile.publicName).toBe('Líder Veículos Seminovos');
    expect(state.publishedProfile.city).toBe('Ipatinga');
    expect(state.publishedProfile.state).toBe('MG');
    expect(state.publishedProfile.address).toBe('Av. Castelo Branco, 1200');
    expect(state.publishedProfile.logoUrl).toContain('toyota-corolla');
    expect(state.publishedProfile.bannerUrl).toContain('hero-desktop');
    expect(state.isDirty).toBe(false);
  });

  // 2. Public Business Name Editing
  it('updates draft public business name and flags store as dirty', () => {
    const store = useDealerProfileStore.getState();
    store.setDraftField('publicName', 'Revenda Exemplo Veículos Premium');

    const updated = useDealerProfileStore.getState();
    expect(updated.draftProfile.publicName).toBe('Revenda Exemplo Veículos Premium');
    expect(updated.isDirty).toBe(true);
    expect(updated.publishedProfile.publicName).toBe('Líder Veículos Seminovos');
  });

  // 3. Required City Validation
  it('enforces required city validation when empty', () => {
    const draft = {
      ...DEFAULT_DEALER_PUBLIC_PROFILE,
      city: '',
    };
    const result = validateProfile(draft);
    expect(result.valid).toBe(false);
    expect(result.errors.city).toBe('A cidade é obrigatória.');

    const whitespaceDraft = {
      ...DEFAULT_DEALER_PUBLIC_PROFILE,
      city: '   ',
    };
    expect(validateProfile(whitespaceDraft).valid).toBe(false);
  });

  // 4. Required State Validation
  it('enforces required state (UF) validation when empty', () => {
    const draft = {
      ...DEFAULT_DEALER_PUBLIC_PROFILE,
      state: '',
    };
    const result = validateProfile(draft);
    expect(result.valid).toBe(false);
    expect(result.errors.state).toBe('O estado (UF) é obrigatório.');
  });

  // 5. Optional Address Handling
  it('permits optional address to be empty or populated without validation failure', () => {
    const draftWithoutAddress = {
      ...DEFAULT_DEALER_PUBLIC_PROFILE,
      address: '',
    };
    expect(validateProfile(draftWithoutAddress).valid).toBe(true);

    const draftWithAddress = {
      ...DEFAULT_DEALER_PUBLIC_PROFILE,
      address: 'Rua das Flores, 123, Sala 4',
    };
    expect(validateProfile(draftWithAddress).valid).toBe(true);
  });

  // 6. Description 500-Character Limit
  it('enforces 500-character maximum limit on public description', () => {
    const validDesc = 'A'.repeat(500);
    const draft500 = {
      ...DEFAULT_DEALER_PUBLIC_PROFILE,
      description: validDesc,
    };
    expect(validateProfile(draft500).valid).toBe(true);

    const invalidDesc = 'A'.repeat(501);
    const draft501 = {
      ...DEFAULT_DEALER_PUBLIC_PROFILE,
      description: invalidDesc,
    };
    const result = validateProfile(draft501);
    expect(result.valid).toBe(false);
    expect(result.errors.description).toBe(
      'A descrição pública deve ter no máximo 500 caracteres.',
    );
  });

  // 7. Valid Logo Upload Preview
  it('accepts valid PNG, JPG, and WEBP logo files within 2 MB', () => {
    const validPng = new File(['dummy-content'], 'logo.png', { type: 'image/png' });
    const validJpg = new File(['dummy-content'], 'logo.jpg', { type: 'image/jpeg' });
    const validWebp = new File(['dummy-content'], 'logo.webp', { type: 'image/webp' });

    expect(validateLogoFile(validPng).valid).toBe(true);
    expect(validateLogoFile(validJpg).valid).toBe(true);
    expect(validateLogoFile(validWebp).valid).toBe(true);
  });

  // 8. Invalid Logo Type Rejection
  it('rejects unsupported logo file formats (e.g. PDF, GIF, SVG, EXE)', () => {
    const pdfFile = new File(['pdf-content'], 'doc.pdf', { type: 'application/pdf' });
    const gifFile = new File(['gif-content'], 'anim.gif', { type: 'image/gif' });
    const svgFile = new File(['svg-content'], 'vector.svg', { type: 'image/svg+xml' });

    expect(validateLogoFile(pdfFile).valid).toBe(false);
    expect(validateLogoFile(pdfFile).error).toBe(
      'Formato inválido. Selecione um arquivo PNG, JPG ou WEBP.',
    );
    expect(validateLogoFile(gifFile).valid).toBe(false);
    expect(validateLogoFile(svgFile).valid).toBe(false);
  });

  // 9. Oversized Logo Rejection (> 2 MB)
  it('rejects logo files exceeding the 2 MB limit', () => {
    const oversizedFile = new File(['x'], 'huge-logo.png', { type: 'image/png' });
    Object.defineProperty(oversizedFile, 'size', { value: MAX_LOGO_BYTES + 1 });

    const result = validateLogoFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('A logo deve ter no máximo 2 MB.');
  });

  // 10. Valid Cover Banner Upload
  it('accepts valid banner image formats within 5 MB', () => {
    const validBanner = new File(['banner-bytes'], 'cover.png', { type: 'image/png' });
    expect(validateBannerFile(validBanner).valid).toBe(true);
  });

  // 11. Oversized Cover Rejection (> 5 MB)
  it('rejects cover banner files exceeding the 5 MB limit', () => {
    const oversizedBanner = new File(['x'], 'huge-banner.jpg', { type: 'image/jpeg' });
    Object.defineProperty(oversizedBanner, 'size', { value: MAX_BANNER_BYTES + 1 });

    const result = validateBannerFile(oversizedBanner);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('A imagem de capa deve ter no máximo 5 MB.');
  });

  // 12. Save and Revert Behavior
  it('supports saveChanges to persist edits and revertChanges to discard them', () => {
    const store = useDealerProfileStore.getState();

    // Edit fields
    store.setDraftField('publicName', 'Revenda Nova Era');
    store.setDraftField('city', 'Belo Horizonte');
    store.setDraftField('state', 'MG');
    expect(useDealerProfileStore.getState().isDirty).toBe(true);

    // Save
    const saveRes = store.saveChanges();
    expect(saveRes.success).toBe(true);

    const savedState = useDealerProfileStore.getState();
    expect(savedState.isDirty).toBe(false);
    expect(savedState.publishedProfile.publicName).toBe('Revenda Nova Era');
    expect(savedState.publishedProfile.city).toBe('Belo Horizonte');

    // Make more changes then revert
    store.setDraftField('publicName', 'Draft Temporary Name');
    expect(useDealerProfileStore.getState().isDirty).toBe(true);

    store.revertChanges();
    const revertedState = useDealerProfileStore.getState();
    expect(revertedState.isDirty).toBe(false);
    expect(revertedState.draftProfile.publicName).toBe('Revenda Nova Era');
  });

  // 13. Data Projection & Strict Privacy Guarantee
  it('strictly isolates public profile and ensures no private CNPJ, CPF, or personal details exist in model', () => {
    const profile = useDealerProfileStore.getState().publishedProfile;

    // Verify model keys
    const allowedKeys = [
      'id',
      'publicName',
      'logoUrl',
      'bannerUrl',
      'description',
      'city',
      'state',
      'address',
      'updatedAt',
    ];

    const actualKeys = Object.keys(profile);
    for (const key of actualKeys) {
      expect(allowedKeys).toContain(key);
    }

    // Explicit privacy assertions
    const record = profile as unknown as Record<string, unknown>;
    expect(record.cnpj).toBeUndefined();
    expect(record.cpf).toBeUndefined();
    expect(record.password).toBeUndefined();
    expect(record.firstName).toBeUndefined();
    expect(record.birthDate).toBeUndefined();
  });

  // 14. Buyer-Facing Showroom Projection Matching
  it('matches approved public dealership catalog entry without mutating unrelated dealerships', () => {
    const currentProfile = useDealerProfileStore.getState().publishedProfile;
    const matchedDealership = getPublicDealershipById(currentProfile.id);
    expect(matchedDealership).toBeDefined();
    expect(matchedDealership?.id).toBe('dealer-lider-seminovos');

    // Unrelated dealership is unaffected
    const unrelatedDealership = getPublicDealershipById('dealer-autocar-multimarcas');
    expect(unrelatedDealership).toBeDefined();
    expect(unrelatedDealership?.name).toBe('AutoCar Multimarcas');
    expect(unrelatedDealership?.id).not.toBe(currentProfile.id);
  });

  // 15. D4 Image Lifecycle Pre-flight: Revocation on replacement, removal, and revert
  it('correctly tracks and safely revokes ephemeral object URLs during image replacement, removal, and revert', () => {
    const revokedUrls: string[] = [];
    const origRevoke = URL.revokeObjectURL;
    const origCreate = URL.createObjectURL;

    URL.createObjectURL = (file: Blob | MediaSource) =>
      `blob:mock-uuid-${(file as File).name || 'file'}`;
    URL.revokeObjectURL = (url: string) => {
      revokedUrls.push(url);
    };

    try {
      const store = useDealerProfileStore.getState();

      // Set initial logo
      const file1 = new File(['1'], 'logo1.png', { type: 'image/png' });
      store.setLogoFile(file1);
      expect(useDealerProfileStore.getState().tempLogoPreview).toBe('blob:mock-uuid-logo1.png');

      // Replace logo -> previous url must be revoked
      const file2 = new File(['2'], 'logo2.png', { type: 'image/png' });
      store.setLogoFile(file2);
      expect(revokedUrls).toContain('blob:mock-uuid-logo1.png');
      expect(useDealerProfileStore.getState().tempLogoPreview).toBe('blob:mock-uuid-logo2.png');

      // Remove logo -> current url must be revoked
      store.removeLogo();
      expect(revokedUrls).toContain('blob:mock-uuid-logo2.png');
      expect(useDealerProfileStore.getState().tempLogoPreview).toBeNull();
      expect(useDealerProfileStore.getState().draftProfile.logoUrl).toBe('');

      // Set banner and revert -> banner url must be revoked
      const bannerFile = new File(['b'], 'banner.jpg', { type: 'image/jpeg' });
      store.setBannerFile(bannerFile);
      expect(useDealerProfileStore.getState().tempBannerPreview).toBe('blob:mock-uuid-banner.jpg');

      store.revertChanges();
      expect(revokedUrls).toContain('blob:mock-uuid-banner.jpg');
      expect(useDealerProfileStore.getState().tempBannerPreview).toBeNull();
    } finally {
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
    }
  });

  // 16. D4 Image Lifecycle Pre-flight: Never persist blob URLs to durable localStorage
  it('never persists ephemeral blob URLs to durable storage, falling back to default asset', () => {
    const origCreate = URL.createObjectURL;
    URL.createObjectURL = () => 'blob:http://localhost:3000/mock-active-blob';

    try {
      const store = useDealerProfileStore.getState();
      const testFile = new File(['data'], 'test.png', { type: 'image/png' });
      store.setLogoFile(testFile);
      store.saveChanges();

      // In active session memory, blob preview is available
      expect(useDealerProfileStore.getState().publishedProfile.logoUrl).toBe(
        'blob:http://localhost:3000/mock-active-blob',
      );

      // Verify that store partialize function strips blob: URL for storage
      const persistStore = useDealerProfileStore as unknown as {
        persist?: {
          getOptions?: () => {
            partialize?: (s: unknown) => {
              publishedProfile: { logoUrl: string };
              draftProfile: { logoUrl: string };
            };
          };
        };
      };
      const partialize = persistStore.persist?.getOptions?.()?.partialize;
      if (partialize) {
        const persistedData = partialize(useDealerProfileStore.getState());
        expect(persistedData.publishedProfile.logoUrl).not.toContain('blob:');
        expect(persistedData.publishedProfile.logoUrl).toBe(DEFAULT_DEALER_PUBLIC_PROFILE.logoUrl);
        expect(persistedData.draftProfile.logoUrl).not.toContain('blob:');
      }
    } finally {
      URL.createObjectURL = origCreate;
    }
  });
});
