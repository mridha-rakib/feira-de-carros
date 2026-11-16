import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type VehicleCategory = 'cars' | 'motorcycles' | 'trucks';
export type ListingPlanType = 'basic' | 'extended';

export interface ListingDraft {
  step: number;
  category: VehicleCategory;

  // Step 2: Vehicle details
  make: string;
  model: string;
  version: string;
  yearFabrication?: number | string;
  yearModel?: number | string;
  mileageKm?: number | string;
  fuelType: string;
  transmission: string;
  color: string;
  licensePlateLastDigit: string;
  city: string;
  state: string;
  price: number | string;
  description: string;
  features: string[];

  // Step 3: Photos & Plan
  images: string[];
  coverImageIndex: number;
  plan: ListingPlanType;
  hasBoost: boolean;

  // Step 4: Submission
  submissionStatus: 'draft' | 'pending_review';
  protocolNumber?: string;
  submittedAt?: string;
}

interface ListingDraftState {
  draft: ListingDraft;
  setStep: (step: number) => void;
  setCategory: (category: VehicleCategory) => void;
  updateDraft: (fields: Partial<ListingDraft>) => void;
  addImage: (url: string) => void;
  removeImage: (indexOrUrl: number | string) => void;
  setCoverImage: (index: number) => void;
  setPlan: (plan: ListingPlanType) => void;
  toggleBoost: () => void;
  toggleFeature: (feature: string) => void;
  submitListing: () => string;
  resetDraft: () => void;
  loadDemoDraft: () => void;
}

export const initialDraft: ListingDraft = {
  step: 1,
  category: 'cars',
  make: '',
  model: '',
  version: '',
  yearFabrication: '',
  yearModel: '',
  mileageKm: '',
  fuelType: 'Flex',
  transmission: 'Automático',
  color: 'Prata',
  licensePlateLastDigit: '',
  city: 'São Paulo',
  state: 'SP',
  price: '',
  description: '',
  features: [
    'Ar-condicionado',
    'Direção elétrica',
    'Vidros elétricos',
    'Airbag duplo',
    'Freios ABS',
  ],
  images: [],
  coverImageIndex: 0,
  plan: 'basic',
  hasBoost: false,
  submissionStatus: 'draft',
};

export const demoDraft: ListingDraft = {
  step: 4,
  category: 'cars',
  make: 'Toyota',
  model: 'Corolla',
  version: '2.0 XEi 16V Flex Automático',
  yearFabrication: 2021,
  yearModel: 2022,
  mileageKm: 42500,
  fuelType: 'Flex',
  transmission: 'Automático',
  color: 'Prata Metálico',
  licensePlateLastDigit: '6',
  city: 'São Paulo',
  state: 'SP',
  price: 124900,
  description:
    'Veículo em estado impecável, único dono, com todas as revisões feitas rigorosamente em concessionária autorizada Toyota. Manual do proprietário, chave reserva, laudo cautelar 100% aprovado sem apontamentos. Pneus novos, estepe sem uso.',
  features: [
    'Ar-condicionado digital',
    'Direção elétrica',
    'Vidros elétricos nas 4 portas',
    'Travas elétricas',
    'Bancos em couro',
    'Central multimídia 8" com Apple CarPlay e Android Auto',
    'Câmera de ré',
    'Sensor de estacionamento dianteiro e traseiro',
    'Faróis em LED',
    'Rodas de liga leve aro 17"',
    'Airbags frontais, laterais e de cortina',
    'Controle de tração e estabilidade',
    'Piloto automático adaptativo',
  ],
  images: [
    '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
    '/images/vehicles/demo/vw-polo-2023.jpg',
  ],
  coverImageIndex: 0,
  plan: 'basic',
  hasBoost: true,
  submissionStatus: 'draft',
};

export const useListingDraftStore = create<ListingDraftState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setStep: (step) => set((s) => ({ draft: { ...s.draft, step } })),
      setCategory: (category) => set((s) => ({ draft: { ...s.draft, category } })),
      updateDraft: (fields) =>
        set((s) => ({
          draft: { ...s.draft, ...fields },
        })),
      addImage: (url) =>
        set((s) => {
          const maxPhotos = s.draft.plan === 'basic' ? 5 : 10;
          if (s.draft.images.length >= maxPhotos) {
            return s; // Max photos reached for current plan
          }
          return {
            draft: { ...s.draft, images: [...s.draft.images, url] },
          };
        }),
      removeImage: (indexOrUrl) =>
        set((s) => {
          let updatedImages: string[];
          if (typeof indexOrUrl === 'number') {
            updatedImages = s.draft.images.filter((_, idx) => idx !== indexOrUrl);
          } else {
            updatedImages = s.draft.images.filter((img) => img !== indexOrUrl);
          }
          let newCoverIndex = s.draft.coverImageIndex;
          if (newCoverIndex >= updatedImages.length) {
            newCoverIndex = Math.max(0, updatedImages.length - 1);
          }
          return {
            draft: {
              ...s.draft,
              images: updatedImages,
              coverImageIndex: newCoverIndex,
            },
          };
        }),
      setCoverImage: (index) =>
        set((s) => {
          if (index < 0 || index >= s.draft.images.length) return s;
          return {
            draft: { ...s.draft, coverImageIndex: index },
          };
        }),
      setPlan: (plan) =>
        set((s) => {
          // If downgrading to basic and has > 5 photos, keep only first 5
          const maxPhotos = plan === 'basic' ? 5 : 10;
          const adjustedImages =
            s.draft.images.length > maxPhotos ? s.draft.images.slice(0, maxPhotos) : s.draft.images;
          const adjustedCover =
            s.draft.coverImageIndex >= adjustedImages.length
              ? Math.max(0, adjustedImages.length - 1)
              : s.draft.coverImageIndex;

          return {
            draft: {
              ...s.draft,
              plan,
              images: adjustedImages,
              coverImageIndex: adjustedCover,
            },
          };
        }),
      toggleBoost: () =>
        set((s) => ({
          draft: { ...s.draft, hasBoost: !s.draft.hasBoost },
        })),
      toggleFeature: (feature) =>
        set((s) => {
          const exists = s.draft.features.includes(feature);
          const updated = exists
            ? s.draft.features.filter((f) => f !== feature)
            : [...s.draft.features, feature];
          return {
            draft: { ...s.draft, features: updated },
          };
        }),
      submitListing: () => {
        const protocol = `ANUN-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const submittedDate = new Date().toISOString();
        set((s) => ({
          draft: {
            ...s.draft,
            submissionStatus: 'pending_review',
            protocolNumber: protocol,
            submittedAt: submittedDate,
          },
        }));
        return protocol;
      },
      resetDraft: () => set({ draft: initialDraft }),
      loadDemoDraft: () => set({ draft: { ...demoDraft } }),
    }),
    {
      name: 'fdc_seller_listing_draft',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
    },
  ),
);
