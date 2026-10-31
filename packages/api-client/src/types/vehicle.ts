export type VehicleStatus =
  | 'DRAFT'
  | 'PENDING_MODERATION'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'SOLD'
  | 'ARCHIVED';

export type FuelType = 'GASOLINE' | 'ETHANOL' | 'FLEX' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';

export type TransmissionType = 'MANUAL' | 'AUTOMATIC' | 'CVT' | 'AUTOMATED';

export interface Vehicle {
  id: string;
  sellerId: string;
  dealershipId?: string;
  make: string;
  model: string;
  version: string;
  yearFabrication: number;
  yearModel: number;
  mileageKm: number;
  priceCents: number;
  currency: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  color: string;
  licensePlateLastDigit: string;
  city: string;
  state: string;
  description: string;
  images: string[];
  status: VehicleStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  state?: string;
  city?: string;
  status?: VehicleStatus;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'created_desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
