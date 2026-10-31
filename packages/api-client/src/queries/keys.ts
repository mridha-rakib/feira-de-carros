import type { VehicleFilters } from '../types/vehicle';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters?: VehicleFilters) => [...vehicleKeys.lists(), filters ?? {}] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  featured: () => [...vehicleKeys.all, 'featured'] as const,
};

export const dealershipKeys = {
  all: ['dealerships'] as const,
  lists: () => [...dealershipKeys.all, 'list'] as const,
  detail: (idOrSlug: string) => [...dealershipKeys.all, 'detail', idOrSlug] as const,
  inventory: (dealershipId: string) => [...dealershipKeys.all, 'inventory', dealershipId] as const,
};

export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  detail: (id: string) => [...leadKeys.all, 'detail', id] as const,
};
