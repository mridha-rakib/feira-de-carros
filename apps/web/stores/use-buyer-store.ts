import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BuyerLocationState {
  city: string;
  state: string;
  label: string;
}

export interface SavedSearchItem {
  id: string;
  title: string;
  summary: string;
  params: Record<string, string>;
  category?: 'Carros' | 'Motos' | 'Caminhões' | 'Qualquer';
  createdAt: string;
  alertsEnabled: boolean;
  newMatchesCount: number;
}

export interface NotificationPreferences {
  savedSearchAlerts: boolean;
  emailChannel: boolean;
  pushChannel: boolean;
  sellerMessages: boolean;
  promotionsNewsletters: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  lastUpdated?: string;
}

export const DEFAULT_SAVED_SEARCHES: SavedSearchItem[] = [
  {
    id: 'search-corolla-ipatinga',
    title: 'Toyota Corolla em Ipatinga',
    summary: 'Toyota Corolla · Automático · Ipatinga, MG',
    params: {
      marca: 'Toyota',
      modelo: 'Corolla',
      cidade: 'Ipatinga',
      transmissao: 'Automático',
    },
    category: 'Carros',
    createdAt: '12/05/2026',
    alertsEnabled: true,
    newMatchesCount: 2,
  },
  {
    id: 'search-motos-mg',
    title: 'Motos em Minas Gerais',
    summary: 'Motos · Todas as marcas · Ipatinga e região',
    params: {
      categoria: 'Motos',
      cidade: 'Ipatinga',
    },
    category: 'Motos',
    createdAt: '08/05/2026',
    alertsEnabled: true,
    newMatchesCount: 1,
  },
  {
    id: 'search-picapes-auto',
    title: 'Picapes automáticas até R$ 120.000',
    summary: 'Picape · Automático ou Manual · até R$ 120.000',
    params: {
      carroceria: 'Picape',
      maxPrice: '120000',
    },
    category: 'Carros',
    createdAt: '02/05/2026',
    alertsEnabled: false,
    newMatchesCount: 1,
  },
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  savedSearchAlerts: true,
  emailChannel: true,
  pushChannel: false,
  sellerMessages: true,
  promotionsNewsletters: false,
  frequency: 'immediate',
  lastUpdated: '15/05/2026 10:30',
};

export const DEFAULT_DEMO_FAVORITES = [
  'veh-corolla-2021',
  'veh-creta-2022',
  'veh-cg160-2022',
  'veh-compass-2021-sold',
];

export interface BuyerProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
  city: string;
  state: string;
  role: 'member';
  avatarInitials: string;
  isSuspended: boolean;
  savedSearchesCount: number;
}

const DEFAULT_BUYER_PROFILE: BuyerProfile = {
  id: 'BUYER-2026-1042',
  firstName: 'João',
  lastName: 'Silva',
  fullName: 'João Silva',
  email: 'joao.silva@exemplo.com',
  birthDate: '15/04/1990',
  phone: '(31) 98765-4321',
  city: 'Ipatinga',
  state: 'MG',
  role: 'member',
  avatarInitials: 'JS',
  isSuspended: false,
  savedSearchesCount: 2,
};

interface BuyerStoreState {
  location: BuyerLocationState;
  favorites: string[];
  savedSearches: SavedSearchItem[];
  notificationPreferences: NotificationPreferences;
  isLocationModalOpen: boolean;
  isAuthModalOpen: boolean;
  authModalRedirect: string;
  isAuthenticated: boolean;
  buyerProfile: BuyerProfile;
  setLocation: (city: string, state: string) => void;
  toggleFavorite: (vehicleId: string, currentPath?: string) => boolean;
  isFavorite: (vehicleId: string) => boolean;
  setFavorites: (favorites: string[]) => void;
  clearFavorites: () => void;
  restoreDemoFavorites: () => void;
  saveSearch: (
    title: string,
    params: Record<string, string>,
    category?: 'Carros' | 'Motos' | 'Caminhões' | 'Qualquer',
  ) => SavedSearchItem;
  deleteSavedSearch: (id: string) => void;
  toggleSearchAlert: (id: string) => void;
  updateNotificationPreferences: (updates: Partial<NotificationPreferences>) => void;
  resetNotificationPreferences: () => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  openAuthModal: (redirect?: string) => void;
  closeAuthModal: () => void;
  setAuthenticated: (value: boolean) => void;
  updateBuyerProfile: (updates: Partial<BuyerProfile>) => void;
  loginSimulation: (email?: string, name?: string) => void;
  logoutSimulation: () => void;
}

export const useBuyerStore = create<BuyerStoreState>()(
  persist(
    (set, get) => ({
      location: {
        city: 'Ipatinga',
        state: 'MG',
        label: 'Ipatinga, MG',
      },
      favorites: DEFAULT_DEMO_FAVORITES, // Seeded with initial favorites for registered member demonstration
      savedSearches: DEFAULT_SAVED_SEARCHES,
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
      isLocationModalOpen: false,
      isAuthModalOpen: false,
      authModalRedirect: '/veiculos',
      isAuthenticated: false, // Default guest visitor state per SRS AUTH-001/016
      buyerProfile: DEFAULT_BUYER_PROFILE,

      setLocation: (city: string, state: string) =>
        set({
          location: {
            city,
            state,
            label: `${city}, ${state}`,
          },
          isLocationModalOpen: false,
        }),

      /**
       * Favorites Authentication Gate (SRS WEB-001 / B1 Release Gate)
       * Favorites are strictly for authenticated Buyers (`member`).
       * If user is not authenticated, opens the auth gate modal and preserves guest state
       * without fabricating a backend session.
       */
      toggleFavorite: (vehicleId: string, currentPath?: string) => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) {
          set({
            isAuthModalOpen: true,
            authModalRedirect: currentPath || '/veiculos',
          });
          return false;
        }

        set((state) => {
          const exists = state.favorites.includes(vehicleId);
          return {
            favorites: exists
              ? state.favorites.filter((id) => id !== vehicleId)
              : [...state.favorites, vehicleId],
          };
        });
        return true;
      },

      isFavorite: (vehicleId: string) => get().favorites.includes(vehicleId),

      setFavorites: (favorites: string[]) => set({ favorites }),

      clearFavorites: () => set({ favorites: [] }),

      restoreDemoFavorites: () => set({ favorites: [...DEFAULT_DEMO_FAVORITES] }),

      saveSearch: (
        title: string,
        params: Record<string, string>,
        category?: 'Carros' | 'Motos' | 'Caminhões' | 'Qualquer',
      ) => {
        const newItem: SavedSearchItem = {
          id: `search-${Date.now()}`,
          title: title.trim() || 'Busca personalizada',
          summary: Object.entries(params)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' · '),
          params,
          category,
          createdAt: new Date().toLocaleDateString('pt-BR'),
          alertsEnabled: true,
          newMatchesCount: 0,
        };

        set((state) => ({
          savedSearches: [newItem, ...state.savedSearches],
          buyerProfile: {
            ...state.buyerProfile,
            savedSearchesCount: state.savedSearches.length + 1,
          },
        }));

        return newItem;
      },

      deleteSavedSearch: (id: string) =>
        set((state) => {
          const next = state.savedSearches.filter((item) => item.id !== id);
          return {
            savedSearches: next,
            buyerProfile: {
              ...state.buyerProfile,
              savedSearchesCount: next.length,
            },
          };
        }),

      toggleSearchAlert: (id: string) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((item) =>
            item.id === id ? { ...item, alertsEnabled: !item.alertsEnabled } : item,
          ),
        })),

      updateNotificationPreferences: (updates: Partial<NotificationPreferences>) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...updates,
            lastUpdated: new Date().toLocaleString('pt-BR'),
          },
        })),

      resetNotificationPreferences: () =>
        set({
          notificationPreferences: {
            ...DEFAULT_NOTIFICATION_PREFERENCES,
            lastUpdated: new Date().toLocaleString('pt-BR'),
          },
        }),

      openLocationModal: () => set({ isLocationModalOpen: true }),
      closeLocationModal: () => set({ isLocationModalOpen: false }),

      openAuthModal: (redirect?: string) =>
        set({
          isAuthModalOpen: true,
          authModalRedirect: redirect || '/veiculos',
        }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

      updateBuyerProfile: (updates: Partial<BuyerProfile>) =>
        set((state) => {
          const nextProfile = { ...state.buyerProfile, ...updates };
          if (updates.firstName || updates.lastName) {
            const f = updates.firstName ?? state.buyerProfile.firstName;
            const l = updates.lastName ?? state.buyerProfile.lastName;
            nextProfile.fullName = `${f} ${l}`.trim();
            nextProfile.avatarInitials = `${f[0] || ''}${l[0] || ''}`.toUpperCase();
          }
          return { buyerProfile: nextProfile };
        }),

      loginSimulation: (email?: string, name?: string) =>
        set((state) => {
          const profile = { ...state.buyerProfile };
          if (email) profile.email = email;
          if (name) {
            const parts = name.split(' ');
            profile.firstName = parts[0] || 'João';
            profile.lastName = parts.slice(1).join(' ') || 'Silva';
            profile.fullName = name;
            profile.avatarInitials =
              `${profile.firstName[0] || ''}${profile.lastName[0] || ''}`.toUpperCase();
          }
          return {
            isAuthenticated: true,
            isAuthModalOpen: false,
            buyerProfile: profile,
            // If favorites are empty, seed default demo favorites so user sees their saved list
            favorites: state.favorites.length > 0 ? state.favorites : [...DEFAULT_DEMO_FAVORITES],
          };
        }),

      logoutSimulation: () =>
        set({
          isAuthenticated: false,
        }),
    }),
    {
      name: 'fdc_buyer_preferences',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        location: state.location,
        favorites: state.favorites,
        savedSearches: state.savedSearches,
        notificationPreferences: state.notificationPreferences,
        // isAuthenticated and sensitive profile items are not persisted to avoid session spoofing
      }),
    },
  ),
);
