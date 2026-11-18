import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  type DealerSortOption,
  type DealerVehicleListing,
  type DealerVehiclePlan,
  type DealerVehicleStatus,
  MOCK_DEALER_INVENTORY_METRICS,
  MOCK_DEALER_VEHICLES,
  filterAndSortDealerVehicles,
} from '../lib/adapters/mock-dealer-inventory';

export type DealerVehicleCategory = 'cars' | 'motorcycles' | 'trucks';

export interface DealerListingDraft {
  step: number;
  category: DealerVehicleCategory;
  make: string;
  model: string;
  version: string;
  yearFabrication: string | number;
  yearModel: string | number;
  mileageKm: string | number;
  fuelType: string;
  transmission: string;
  color: string;
  licensePlate: string;
  price: string | number;
  description: string;
  features: string[];
  images: string[];
  coverImageIndex: number;
  plan: DealerVehiclePlan;
  submissionStatus: 'draft' | 'pending_review';
  protocolNumber?: string;
  submittedAt?: string;
}

export const INITIAL_DEALER_DRAFT: DealerListingDraft = {
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
  licensePlate: '',
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
  plan: 'premium',
  submissionStatus: 'draft',
};

export const DEMO_DEALER_DRAFT: DealerListingDraft = {
  step: 4,
  category: 'cars',
  make: 'Toyota',
  model: 'Yaris',
  version: '1.5 XLS 16V Flex Automático',
  yearFabrication: 2023,
  yearModel: 2024,
  mileageKm: 19500,
  fuelType: 'Flex',
  transmission: 'Automático',
  color: 'Branco Perolizado',
  licensePlate: 'BRA9E88',
  price: 98900,
  description:
    'Veículo de único dono, revisões rigorosamente em concessionária autorizada, garantia de fábrica ativa até 2028. Laudo cautelar 100% aprovado.',
  features: [
    'Ar-condicionado digital',
    'Direção elétrica',
    'Vidros elétricos nas 4 portas',
    'Central multimídia com Apple CarPlay e Android Auto',
    'Câmera de ré',
    'Sensor crepuscular e de chuva',
    'Faróis em LED',
    '7 Airbags',
    'Freios ABS com EBD',
  ],
  images: [
    '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
    '/images/vehicles/demo/vw-polo-2023.jpg',
  ],
  coverImageIndex: 0,
  plan: 'premium',
  submissionStatus: 'draft',
};

interface DealerInventoryStoreState {
  vehicles: DealerVehicleListing[];
  draft: DealerListingDraft;

  // Draft wizard actions
  setDraftStep: (step: number) => void;
  setDraftCategory: (category: DealerVehicleCategory) => void;
  updateDraft: (data: Partial<DealerListingDraft>) => void;
  addDraftImage: (url: string) => void;
  removeDraftImage: (indexOrUrl: number | string) => void;
  setDraftCoverImage: (index: number) => void;
  toggleDraftFeature: (feature: string) => void;
  resetDraft: () => void;
  loadDemoDraft: () => void;
  submitDraft: () => DealerVehicleListing;

  // Vehicle inventory actions
  updateVehicle: (id: string, updates: Partial<DealerVehicleListing>) => void;
  submitRevision: (
    id: string,
    revisionData: {
      price: number;
      mileageKm: number;
      description?: string;
      features?: string[];
    },
  ) => void;
  togglePause: (id: string) => void;
  markAsSold: (id: string) => void;
  renewVehicle: (id: string) => void;
  getVehicleById: (id: string) => DealerVehicleListing | undefined;
  resetToFixtures: () => void;
}

export const useDealerInventoryStore = create<DealerInventoryStoreState>()(
  persist(
    (set, get) => ({
      vehicles: MOCK_DEALER_VEHICLES,
      draft: INITIAL_DEALER_DRAFT,

      setDraftStep: (step) =>
        set((state) => ({
          draft: { ...state.draft, step: Math.min(Math.max(step, 1), 4) },
        })),

      setDraftCategory: (category) =>
        set((state) => ({
          draft: { ...state.draft, category },
        })),

      updateDraft: (data) =>
        set((state) => ({
          draft: { ...state.draft, ...data },
        })),

      addDraftImage: (url) =>
        set((state) => {
          if (state.draft.images.includes(url)) return state;
          return {
            draft: {
              ...state.draft,
              images: [...state.draft.images, url],
            },
          };
        }),

      removeDraftImage: (indexOrUrl) =>
        set((state) => {
          let updatedImages: string[];
          if (typeof indexOrUrl === 'number') {
            updatedImages = state.draft.images.filter((_, i) => i !== indexOrUrl);
          } else {
            updatedImages = state.draft.images.filter((img) => img !== indexOrUrl);
          }
          const safeCoverIndex = Math.min(
            state.draft.coverImageIndex,
            Math.max(updatedImages.length - 1, 0),
          );
          return {
            draft: {
              ...state.draft,
              images: updatedImages,
              coverImageIndex: safeCoverIndex,
            },
          };
        }),

      setDraftCoverImage: (index) =>
        set((state) => ({
          draft: {
            ...state.draft,
            coverImageIndex: Math.max(0, Math.min(index, state.draft.images.length - 1)),
          },
        })),

      toggleDraftFeature: (feature) =>
        set((state) => {
          const currentFeatures = state.draft.features || [];
          const exists = currentFeatures.includes(feature);
          const updated = exists
            ? currentFeatures.filter((f) => f !== feature)
            : [...currentFeatures, feature];
          return {
            draft: {
              ...state.draft,
              features: updated,
            },
          };
        }),

      resetDraft: () =>
        set({
          draft: INITIAL_DEALER_DRAFT,
        }),

      loadDemoDraft: () =>
        set({
          draft: DEMO_DEALER_DRAFT,
        }),

      submitDraft: () => {
        const state = get();
        const draft = state.draft;

        const nextNum = state.vehicles.length + 1;
        const id = `dlr-veh-${String(nextNum).padStart(3, '0')}`;
        const randomProtocol = `PROT-DLR-202611-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date();
        const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        const rawPrice = Number(draft.price) || 98900;
        const formattedPrice = `R$ ${rawPrice.toLocaleString('pt-BR')}`;
        const rawKm = Number(draft.mileageKm) || 20000;
        const rawYear = Number(draft.yearFabrication) || 2023;

        const primaryImage =
          draft.images[draft.coverImageIndex] ||
          draft.images[0] ||
          '/images/vehicles/demo/sedan-fallback.svg';

        const planLabels: Record<
          DealerVehiclePlan,
          'Plano Premium' | 'Plano Essencial' | 'Sem impulsionamento'
        > = {
          premium: 'Plano Premium',
          essential: 'Plano Essencial',
          none: 'Sem impulsionamento',
        };

        const newVehicle: DealerVehicleListing = {
          id,
          plate: draft.licensePlate || `DLR${nextNum}E88`,
          make: draft.make || 'Toyota',
          model: draft.model || 'Yaris',
          version: draft.version || '1.5 XLS 16V Flex Automático',
          year: rawYear,
          mileageKm: rawKm,
          fuel: draft.fuelType || 'Flex',
          transmission: draft.transmission || 'Automático',
          color: draft.color || 'Prata',
          price: rawPrice,
          formattedPrice,
          status: 'in_review',
          statusLabel: 'Em análise',
          plan: draft.plan || 'premium',
          planLabel: planLabels[draft.plan || 'premium'],
          expiresAt: 'Aguardando aprovação',
          expiresAtLabel: 'Aguardando aprovação',
          viewsCount: 0,
          viewsLabel: '0 visualizações',
          photoCount: draft.images.length || 1,
          imageUrl: primaryImage,
          images: draft.images.length > 0 ? draft.images : [primaryImage],
          slug: `${(draft.make || 'toyota').toLowerCase()}-${(draft.model || 'yaris').toLowerCase()}-${rawYear}-${id}`,
          createdAt: now.toISOString(),
          category: draft.category,
          description: draft.description,
          features: draft.features,
          isMockData: true,
        };

        set({
          vehicles: [newVehicle, ...state.vehicles],
          draft: {
            ...draft,
            submissionStatus: 'pending_review',
            protocolNumber: randomProtocol,
            submittedAt: formattedDate,
          },
        });

        return newVehicle;
      },

      updateVehicle: (id, updates) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),

      submitRevision: (id, revisionData) =>
        set((state) => {
          const now = new Date();
          const formattedTimestamp = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
          return {
            vehicles: state.vehicles.map((v) => {
              if (v.id === id) {
                return {
                  ...v,
                  status: 'in_review' as const,
                  statusLabel: 'Em análise' as const,
                  pendingRevision: {
                    price: revisionData.price,
                    formattedPrice: `R$ ${revisionData.price.toLocaleString('pt-BR')}`,
                    mileageKm: revisionData.mileageKm,
                    description: revisionData.description,
                    features: revisionData.features,
                    submittedAt: formattedTimestamp,
                  },
                };
              }
              return v;
            }),
          };
        }),

      togglePause: (id) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) => {
            if (v.id === id) {
              const isCurrentlyActive = v.status === 'active';
              return {
                ...v,
                status: isCurrentlyActive ? ('paused' as const) : ('active' as const),
                statusLabel: isCurrentlyActive ? ('Pausado' as const) : ('Ativo' as const),
                expiresAtLabel: isCurrentlyActive ? 'Pausado' : v.expiresAt,
              };
            }
            return v;
          }),
        })),

      markAsSold: (id) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) => {
            if (v.id === id) {
              return {
                ...v,
                status: 'sold' as const,
                statusLabel: 'Vendido' as const,
                expiresAtLabel: 'Vendido',
                soldAt: new Date().toLocaleDateString('pt-BR'),
              };
            }
            return v;
          }),
        })),

      renewVehicle: (id) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) => {
            if (v.id === id) {
              return {
                ...v,
                status: 'active' as const,
                statusLabel: 'Ativo' as const,
                expiresAt: '18/12/2026',
                expiresAtLabel: '18/12/2026',
              };
            }
            return v;
          }),
        })),

      getVehicleById: (id) => {
        return get().vehicles.find((v) => v.id === id);
      },

      resetToFixtures: () =>
        set({
          vehicles: MOCK_DEALER_VEHICLES,
          draft: INITIAL_DEALER_DRAFT,
        }),
    }),
    {
      name: 'feira_dealer_inventory_v1',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    },
  ),
);
