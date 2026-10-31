import type { VehicleFilters } from '../types/vehicle';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

export const adminKeys = {
  all: ['admin'] as const,
  overview: () => [...adminKeys.all, 'overview'] as const,
  listings: () => [...adminKeys.all, 'listings'] as const,
  sellerApplications: () => [...adminKeys.all, 'seller-applications'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
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
