export type PlanStatus = 'ACTIVE' | 'ARCHIVED';

export interface AdvertisementPlanRecord {
  id: string; // e.g. PLN-30D-05
  name: string; // Plano Básico, Plano Estendido
  priceBrl: number; // 30, 50
  durationDays: number; // 30, 60
  maxPhotos: number; // 5, 10
  videoAllowed: boolean; // false
  autoRenewal: boolean; // false
  status: PlanStatus;
  statusLabel: string;
  activeListingsCount: number;
  description: string;
  features: string[];
}

export interface BoostConfigurationRecord {
  id: string; // BST-07D-001
  title: string; // Destaque 7 Dias
  priceBrl: number; // 10
  durationDays: number; // 7
  status: 'ACTIVE' | 'DISABLED';
  statusLabel: string;
  activeBoostsCount: number;
  eligibleCriteria: string[];
  ineligibleCriteria: string[];
  rules: string[];
  exampleListingId: string; // FC-2026-0142
  exampleListingTitle: string; // Fiat Strada
}

export type CategoryStatus = 'ACTIVE' | 'LOCKED';

export interface VehicleCategoryRecord {
  id: string; // CAT-CAR, CAT-TRUCK, CAT-MOTO, CAT-OTHER
  name: string; // Carros, Caminhões, Motocicletas, Outros
  slug: string;
  status: CategoryStatus;
  statusLabel: string;
  activeModelsCount: number;
  totalListingsCount: number;
  mandatoryAttributes: string[];
  description: string;
}

export interface BrandModelRecord {
  id: string; // MOD-001 ...
  brand: string; // Toyota, Fiat, Chevrolet, Volkswagen, Honda
  model: string; // Corolla 2021, Strada Endurance 2023, Onix LT 2022, Polo Track, HR-V 2020
  categoryId: string; // CAT-CAR, etc.
  categoryName: string; // Carros
  yearReference: string;
  activeListingsCount: number;
  imageThumbnail?: string;
  status: 'ACTIVE' | 'LOCKED';
  statusLabel: string;
}

export interface BrazilianLocationRecord {
  id: string; // LOC-001 ...
  city: string; // Ipatinga, Timóteo, Coronel Fabriciano, Belo Horizonte, São Paulo
  state: string; // MG, SP
  isDefault: boolean; // Ipatinga is default
  region: string;
  activeListingsCount: number;
  status: 'ACTIVE';
  statusLabel: string;
}
