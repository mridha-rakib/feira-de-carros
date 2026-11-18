import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface DealerPublicProfile {
  id: string; // Corresponds to public dealership ID, e.g. 'dealer-lider-seminovos'
  publicName: string; // Nome público da revenda (requisito a confirmar)
  logoUrl: string; // URL da logo pública
  bannerUrl: string; // URL da imagem de capa (banner)
  description: string; // Descrição pública (máx. 500 caracteres)
  city: string; // Cidade (obrigatório)
  state: string; // Estado / UF (obrigatório)
  address?: string; // Endereço visível (opcional)
  updatedAt?: string;
}

export interface ProfileValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const DEFAULT_DEALER_PUBLIC_PROFILE: DealerPublicProfile = {
  id: 'dealer-lider-seminovos',
  publicName: 'Líder Veículos Seminovos',
  logoUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
  bannerUrl: '/images/hero/hero-desktop.png',
  description:
    'Mais de 15 anos de tradição em Ipatinga e no Vale do Aço. Veículos com procedência garantida, laudo cautelar e garantia de motor e câmbio.',
  city: 'Ipatinga',
  state: 'MG',
  address: 'Av. Castelo Branco, 1200',
  updatedAt: '2026-11-18T10:00:00.000Z',
};

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
export const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2 MB
export const MAX_BANNER_BYTES = 5 * 1024 * 1024; // 5 MB

export function isBlobUrl(url?: string | null): boolean {
  return typeof url === 'string' && url.startsWith('blob:');
}

export function safeRevokeUrl(url?: string | null) {
  if (
    url &&
    isBlobUrl(url) &&
    typeof URL !== 'undefined' &&
    typeof URL.revokeObjectURL === 'function'
  ) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
}

export function validateLogoFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato inválido. Selecione um arquivo PNG, JPG ou WEBP.',
    };
  }
  if (file.size > MAX_LOGO_BYTES) {
    return {
      valid: false,
      error: 'A logo deve ter no máximo 2 MB.',
    };
  }
  return { valid: true };
}

export function validateBannerFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato inválido. Selecione um arquivo PNG, JPG ou WEBP.',
    };
  }
  if (file.size > MAX_BANNER_BYTES) {
    return {
      valid: false,
      error: 'A imagem de capa deve ter no máximo 5 MB.',
    };
  }
  return { valid: true };
}

export function validateProfile(profile: DealerPublicProfile): ProfileValidationResult {
  const errors: Record<string, string> = {};

  if (!profile.city || profile.city.trim() === '') {
    errors.city = 'A cidade é obrigatória.';
  }

  if (!profile.state || profile.state.trim() === '') {
    errors.state = 'O estado (UF) é obrigatório.';
  }

  if (profile.description && profile.description.length > 500) {
    errors.description = 'A descrição pública deve ter no máximo 500 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

interface DealerProfileState {
  publishedProfile: DealerPublicProfile;
  draftProfile: DealerPublicProfile;
  isDirty: boolean;
  tempLogoPreview: string | null;
  tempBannerPreview: string | null;

  // Actions
  setDraftField: (field: keyof DealerPublicProfile, value: string) => void;
  setLogoFile: (file: File) => { success: boolean; error?: string };
  removeLogo: () => void;
  setBannerFile: (file: File) => { success: boolean; error?: string };
  removeBanner: () => void;
  saveChanges: () => { success: boolean; errors?: Record<string, string> };
  revertChanges: () => void;
  resetToDefaults: () => void;
}

export const useDealerProfileStore = create<DealerProfileState>()(
  persist(
    (set, get) => ({
      publishedProfile: { ...DEFAULT_DEALER_PUBLIC_PROFILE },
      draftProfile: { ...DEFAULT_DEALER_PUBLIC_PROFILE },
      isDirty: false,
      tempLogoPreview: null,
      tempBannerPreview: null,

      setDraftField: (field, value) => {
        const { draftProfile, publishedProfile } = get();
        const updatedDraft = { ...draftProfile, [field]: value };

        // Check if any field differs from published
        const isNowDirty =
          updatedDraft.publicName !== publishedProfile.publicName ||
          updatedDraft.city !== publishedProfile.city ||
          updatedDraft.state !== publishedProfile.state ||
          (updatedDraft.address || '') !== (publishedProfile.address || '') ||
          updatedDraft.description !== publishedProfile.description ||
          get().tempLogoPreview !== null ||
          get().tempBannerPreview !== null;

        set({
          draftProfile: updatedDraft,
          isDirty: isNowDirty,
        });
      },

      setLogoFile: (file: File) => {
        const validation = validateLogoFile(file);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }

        // Revoke previously held temporary preview if any
        const oldPreview = get().tempLogoPreview;
        if (oldPreview) {
          safeRevokeUrl(oldPreview);
        }

        const previewUrl = URL.createObjectURL(file);
        set((state) => ({
          tempLogoPreview: previewUrl,
          draftProfile: { ...state.draftProfile, logoUrl: previewUrl },
          isDirty: true,
        }));

        return { success: true };
      },

      removeLogo: () => {
        const oldPreview = get().tempLogoPreview;
        if (oldPreview) {
          safeRevokeUrl(oldPreview);
        }

        set((state) => ({
          tempLogoPreview: null,
          draftProfile: { ...state.draftProfile, logoUrl: '' },
          isDirty: true,
        }));
      },

      setBannerFile: (file: File) => {
        const validation = validateBannerFile(file);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }

        // Revoke previously held temporary preview if any
        const oldPreview = get().tempBannerPreview;
        if (oldPreview) {
          safeRevokeUrl(oldPreview);
        }

        const previewUrl = URL.createObjectURL(file);
        set((state) => ({
          tempBannerPreview: previewUrl,
          draftProfile: { ...state.draftProfile, bannerUrl: previewUrl },
          isDirty: true,
        }));

        return { success: true };
      },

      removeBanner: () => {
        const oldPreview = get().tempBannerPreview;
        if (oldPreview) {
          safeRevokeUrl(oldPreview);
        }

        set((state) => ({
          tempBannerPreview: null,
          draftProfile: { ...state.draftProfile, bannerUrl: '' },
          isDirty: true,
        }));
      },

      saveChanges: () => {
        const { draftProfile } = get();
        const validation = validateProfile(draftProfile);

        if (!validation.valid) {
          return { success: false, errors: validation.errors };
        }

        const updatedPublished: DealerPublicProfile = {
          ...draftProfile,
          updatedAt: new Date().toISOString(),
        };

        set({
          publishedProfile: updatedPublished,
          draftProfile: { ...updatedPublished },
          isDirty: false,
          tempLogoPreview: null,
          tempBannerPreview: null,
        });

        return { success: true };
      },

      revertChanges: () => {
        const { publishedProfile, tempLogoPreview, tempBannerPreview } = get();

        // Safely revoke any uncommitted object URLs
        if (tempLogoPreview) {
          safeRevokeUrl(tempLogoPreview);
        }
        if (tempBannerPreview) {
          safeRevokeUrl(tempBannerPreview);
        }

        set({
          draftProfile: { ...publishedProfile },
          isDirty: false,
          tempLogoPreview: null,
          tempBannerPreview: null,
        });
      },

      resetToDefaults: () => {
        const { tempLogoPreview, tempBannerPreview } = get();
        if (tempLogoPreview) {
          safeRevokeUrl(tempLogoPreview);
        }
        if (tempBannerPreview) {
          safeRevokeUrl(tempBannerPreview);
        }

        set({
          publishedProfile: { ...DEFAULT_DEALER_PUBLIC_PROFILE },
          draftProfile: { ...DEFAULT_DEALER_PUBLIC_PROFILE },
          isDirty: false,
          tempLogoPreview: null,
          tempBannerPreview: null,
        });
      },
    }),
    {
      name: 'fdc_dealer_public_profile',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => {
        // Strip ephemeral blob: URLs from durable localStorage persistence
        // so that hard page reloads NEVER rehydrate broken/revoked object URLs.
        const sanitizeProfileForStorage = (profile: DealerPublicProfile): DealerPublicProfile => ({
          ...profile,
          logoUrl: isBlobUrl(profile.logoUrl)
            ? DEFAULT_DEALER_PUBLIC_PROFILE.logoUrl
            : profile.logoUrl,
          bannerUrl: isBlobUrl(profile.bannerUrl)
            ? DEFAULT_DEALER_PUBLIC_PROFILE.bannerUrl
            : profile.bannerUrl,
        });

        return {
          publishedProfile: sanitizeProfileForStorage(state.publishedProfile),
          draftProfile: sanitizeProfileForStorage(state.draftProfile),
          isDirty: state.isDirty,
        };
      },
    },
  ),
);
