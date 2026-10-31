import { create } from 'zustand';

export interface ListingDraft {
  step: number;
  make: string;
  model: string;
  version: string;
  yearFabrication?: number;
  yearModel?: number;
  mileageKm?: number;
  priceCents?: number;
  fuelType?: string;
  transmission?: string;
  color: string;
  licensePlateLastDigit: string;
  city: string;
  state: string;
  description: string;
  images: string[];
}

interface ListingDraftState {
  draft: ListingDraft;
  setStep: (step: number) => void;
  updateDraft: (fields: Partial<ListingDraft>) => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  resetDraft: () => void;
}

const initialDraft: ListingDraft = {
  step: 1,
  make: '',
  model: '',
  version: '',
  color: '',
  licensePlateLastDigit: '',
  city: '',
  state: '',
  description: '',
  images: [],
};

export const useListingDraftStore = create<ListingDraftState>((set) => ({
  draft: initialDraft,
  setStep: (step) => set((s) => ({ draft: { ...s.draft, step } })),
  updateDraft: (fields) =>
    set((s) => ({
      draft: { ...s.draft, ...fields },
    })),
  addImage: (url) =>
    set((s) => ({
      draft: { ...s.draft, images: [...s.draft.images, url] },
    })),
  removeImage: (url) =>
    set((s) => ({
      draft: {
        ...s.draft,
        images: s.draft.images.filter((img) => img !== url),
      },
    })),
  resetDraft: () => set({ draft: initialDraft }),
}));
