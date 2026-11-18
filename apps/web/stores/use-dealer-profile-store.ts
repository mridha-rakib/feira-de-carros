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

        const previewUrl = URL.createObjectURL(file);
        set((state) => ({
          tempLogoPreview: previewUrl,
          draftProfile: { ...state.draftProfile, logoUrl: previewUrl },
          isDirty: true,
        }));

        return { success: true };
      },

      removeLogo: () => {
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

        const previewUrl = URL.createObjectURL(file);
        set((state) => ({
          tempBannerPreview: previewUrl,
          draftProfile: { ...state.draftProfile, bannerUrl: previewUrl },
          isDirty: true,
        }));

        return { success: true };
      },

      removeBanner: () => {
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
        const { publishedProfile } = get();
        set({
          draftProfile: { ...publishedProfile },
          isDirty: false,
          tempLogoPreview: null,
          tempBannerPreview: null,
        });
      },

      resetToDefaults: () => {
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
      partialize: (state) => ({
        publishedProfile: state.publishedProfile,
        draftProfile: state.draftProfile,
        isDirty: state.isDirty,
      }),
    },
  ),
);
