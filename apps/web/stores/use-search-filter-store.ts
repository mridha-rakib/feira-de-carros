import type { VehicleFilters } from '@feira/api-client';
import { create } from 'zustand';

interface SearchFilterState {
  isFilterDrawerOpen: boolean;
  viewMode: 'grid' | 'list';
  filters: VehicleFilters;
  setFilterDrawerOpen: (open: boolean) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  updateFilter: <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) => void;
  resetFilters: () => void;
}

const initialFilters: VehicleFilters = {
  page: 1,
  limit: 20,
  sortBy: 'created_desc',
};

export const useSearchFilterStore = create<SearchFilterState>((set) => ({
  isFilterDrawerOpen: false,
  viewMode: 'grid',
  filters: initialFilters,
  setFilterDrawerOpen: (open) => set({ isFilterDrawerOpen: open }),
  setViewMode: (mode) => set({ viewMode: mode }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        page: key === 'page' ? (value as number) : 1, // Reset page when filtering
      },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));
