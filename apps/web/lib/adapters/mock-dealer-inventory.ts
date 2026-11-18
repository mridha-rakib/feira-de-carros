/**
 * Deterministic presentation data for Dealership Inventory Overview (WEB-021).
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES (1592:3472 Desktop, 1592:3701 Mobile)
 * All data strictly isolated from individual seller data.
 */

export type DealerVehicleStatus = 'active' | 'in_review' | 'expiring' | 'paused' | 'sold';
export type DealerVehiclePlan = 'premium' | 'essential' | 'none';

export interface DealerVehiclePendingRevision {
  price: number;
  formattedPrice: string;
  mileageKm: number;
  description?: string;
  features?: string[];
  submittedAt: string;
}

export interface DealerVehicleListing {
  id: string;
  plate: string;
  make: string;
  model: string;
  version: string;
  year: number;
  mileageKm: number;
  fuel: string;
  transmission: string;
  color: string;
  price: number;
  formattedPrice: string;
  status: DealerVehicleStatus;
  statusLabel: 'Ativo' | 'Em análise' | 'Expirando' | 'Pausado' | 'Vendido';
  plan: DealerVehiclePlan;
  planLabel: 'Plano Premium' | 'Plano Essencial' | 'Sem impulsionamento';
  expiresAt: string;
  expiresAtLabel: string;
  viewsCount: number;
  viewsLabel: string;
  photoCount: number;
  imageUrl: string;
  images?: string[];
  slug: string;
  createdAt: string;
  category?: 'cars' | 'motorcycles' | 'trucks';
  description?: string;
  features?: string[];
  pendingRevision?: DealerVehiclePendingRevision;
  soldAt?: string;
  isBoosted?: boolean;
  boostedUntil?: string;
  boostedAt?: string;
  isMockData: boolean;
}

export interface DealerInventoryMetrics {
  totalViews: number;
  viewsToday: number;
  topOrigins: string[];
  topOriginsLabel: string;
  totalVehicles: number;
  activeVehicles: number;
  inReviewVehicles: number;
  expiringVehicles: number;
  pausedVehicles: number;
  soldVehicles?: number;
  isMockData: boolean;
}

export const MOCK_DEALER_INVENTORY_METRICS: DealerInventoryMetrics = {
  totalViews: 12840,
  viewsToday: 482,
  topOrigins: ['Ipatinga, MG', 'Belo Horizonte, MG'],
  topOriginsLabel: 'Ipatinga, MG · Belo Horizonte, MG',
  totalVehicles: 5,
  activeVehicles: 2,
  inReviewVehicles: 1,
  expiringVehicles: 1,
  pausedVehicles: 1,
  isMockData: true,
};

export const MOCK_DEALER_VEHICLES: DealerVehicleListing[] = [
  {
    id: 'dlr-veh-001',
    plate: 'BRA2E19',
    make: 'Honda',
    model: 'Civic',
    version: '2.0 EXL 16V Flex 4P Automático',
    year: 2022,
    mileageKm: 28500,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Cinza',
    price: 124900,
    formattedPrice: 'R$ 124.900',
    status: 'active',
    statusLabel: 'Ativo',
    plan: 'premium',
    planLabel: 'Plano Premium',
    expiresAt: '15/11/2026',
    expiresAtLabel: '15/11/2026',
    viewsCount: 2340,
    viewsLabel: '2.340 visualizações',
    photoCount: 12,
    imageUrl: '/images/vehicles/demo/sedan-fallback.svg',
    slug: 'honda-civic-2022-dlr001',
    createdAt: '2026-10-15T10:00:00Z',
    isMockData: true,
  },
  {
    id: 'dlr-veh-002',
    plate: 'RIO4A88',
    make: 'Toyota',
    model: 'Corolla',
    version: '2.0 XEi 16V Flex 4P Automático',
    year: 2021,
    mileageKm: 42300,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Branco',
    price: 119900,
    formattedPrice: 'R$ 119.900',
    status: 'in_review',
    statusLabel: 'Em análise',
    plan: 'essential',
    planLabel: 'Plano Essencial',
    expiresAt: 'Aguardando aprovação',
    expiresAtLabel: 'Aguardando aprovação',
    viewsCount: 892,
    viewsLabel: '892 visualizações',
    photoCount: 15,
    imageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    slug: 'toyota-corolla-2021-dlr002',
    createdAt: '2026-10-20T14:30:00Z',
    isMockData: true,
  },
  {
    id: 'dlr-veh-003',
    plate: 'SPX9F44',
    make: 'Chevrolet',
    model: 'Onix',
    version: '1.0 Turbo Flex Premier Automático',
    year: 2023,
    mileageKm: 18200,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Vermelho',
    price: 89900,
    formattedPrice: 'R$ 89.900',
    status: 'expiring',
    statusLabel: 'Expirando',
    plan: 'premium',
    planLabel: 'Plano Premium',
    expiresAt: 'Expira em 3 dias',
    expiresAtLabel: 'Expira em 3 dias',
    viewsCount: 1756,
    viewsLabel: '1.756 visualizações',
    photoCount: 10,
    imageUrl: '/images/vehicles/demo/chevrolet-onix-2022.jpg',
    slug: 'chevrolet-onix-2023-dlr003',
    createdAt: '2026-09-18T09:15:00Z',
    isMockData: true,
  },
  {
    id: 'dlr-veh-004',
    plate: 'BHZ7D31',
    make: 'Hyundai',
    model: 'Creta',
    version: '1.0 TGDI Flex Comfort Automático',
    year: 2022,
    mileageKm: 36800,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Prata',
    price: 102900,
    formattedPrice: 'R$ 102.900',
    status: 'paused',
    statusLabel: 'Pausado',
    plan: 'none',
    planLabel: 'Sem impulsionamento',
    expiresAt: 'Pausado',
    expiresAtLabel: 'Pausado',
    viewsCount: 420,
    viewsLabel: '420 visualizações',
    photoCount: 14,
    imageUrl: '/images/vehicles/demo/suv-fallback.svg',
    slug: 'hyundai-creta-2022-dlr004',
    createdAt: '2026-08-10T11:45:00Z',
    isMockData: true,
  },
  {
    id: 'dlr-veh-005',
    plate: 'MGX5K12',
    make: 'Volkswagen',
    model: 'Polo',
    version: '1.0 TSI Comfortline Total Flex Automático',
    year: 2020,
    mileageKm: 49100,
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Preto',
    price: 76900,
    formattedPrice: 'R$ 76.900',
    status: 'active',
    statusLabel: 'Ativo',
    plan: 'essential',
    planLabel: 'Plano Essencial',
    expiresAt: '28/11/2026',
    expiresAtLabel: '28/11/2026',
    viewsCount: 1034,
    viewsLabel: '1.034 visualizações',
    photoCount: 11,
    imageUrl: '/images/vehicles/demo/vw-polo-2023.jpg',
    slug: 'volkswagen-polo-2020-dlr005',
    createdAt: '2026-10-01T16:20:00Z',
    isMockData: true,
  },
];

export type DealerSortOption = 'latest' | 'price_asc' | 'price_desc' | 'views_desc';

export function filterAndSortDealerVehicles(
  items: DealerVehicleListing[],
  query: string,
  statusFilter: 'all' | DealerVehicleStatus,
  planFilter: 'all' | DealerVehiclePlan,
  sortBy: DealerSortOption = 'latest',
): DealerVehicleListing[] {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = items.filter((vehicle) => {
    // 1. Text Search Query Filter
    if (normalizedQuery) {
      const matchMake = vehicle.make.toLowerCase().includes(normalizedQuery);
      const matchModel = vehicle.model.toLowerCase().includes(normalizedQuery);
      const matchVersion = vehicle.version.toLowerCase().includes(normalizedQuery);
      const matchPlate = vehicle.plate.toLowerCase().includes(normalizedQuery);
      const matchCombined = `${vehicle.make} ${vehicle.model}`
        .toLowerCase()
        .includes(normalizedQuery);

      if (!matchMake && !matchModel && !matchVersion && !matchPlate && !matchCombined) {
        return false;
      }
    }

    // 2. Status Filter
    if (statusFilter !== 'all' && vehicle.status !== statusFilter) {
      return false;
    }

    // 3. Plan Filter
    if (planFilter !== 'all' && vehicle.plan !== planFilter) {
      return false;
    }

    return true;
  });

  // 4. Sorting
  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'views_desc':
        return b.viewsCount - a.viewsCount;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}
