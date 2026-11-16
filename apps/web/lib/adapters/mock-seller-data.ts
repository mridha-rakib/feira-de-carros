import type {
  SellerApplicationPresentation,
  SellerDashboardKpis,
  SellerListingItem,
} from '../types/seller-presentation';

/**
 * Deterministic presentation data for Seller Application and Dashboard.
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES (625:32, 625:99, 625:163, 625:225)
 */

export const MOCK_APPLICANT_DATA = {
  fullName: 'Mariana Silva',
  cpfMasked: '***.456.789-**',
  email: 'mariana.silva@example.com',
  phone: '(31) 9 8765-4321',
  city: 'Ipatinga',
  state: 'MG',
  registrationType: 'Vendedor (Pessoa física)',
  address: 'Av. José de Alencar, 1.250, Sala 04',
};

export const MOCK_SELLER_APPLICATION: SellerApplicationPresentation = {
  id: 'app-demo-001',
  protocol: 'SOL-2026-018',
  status: 'PENDING_REVIEW',
  statusLabel: 'Em análise',
  submittedAtFormatted: '24 out 2026, às 10:32',
  applicant: MOCK_APPLICANT_DATA,
  correctionReason: 'Endereço incompleto na solicitação.',
  isMockData: true,
};

export const MOCK_SELLER_APPLICATION_CORRECTION: SellerApplicationPresentation = {
  id: 'app-demo-002',
  protocol: 'SOL-2026-018',
  status: 'CORRECTION_REQUESTED',
  statusLabel: 'Correção solicitada',
  submittedAtFormatted: '24 out 2026, às 10:32',
  reviewedAtFormatted: '24 out 2026, às 16:47',
  applicant: {
    ...MOCK_APPLICANT_DATA,
    address: 'Av. José de Alencar, 1.250, Sala 04',
  },
  correctionReason: 'Endereço incompleto na solicitação.',
  isMockData: true,
};

export const MOCK_SELLER_APPLICATION_APPROVED: SellerApplicationPresentation = {
  id: 'app-demo-003',
  protocol: 'SOL-2026-018',
  status: 'APPROVED',
  statusLabel: 'Aprovado',
  submittedAtFormatted: '24 out 2026, às 10:32',
  reviewedAtFormatted: '24 out 2026, às 17:30',
  applicant: MOCK_APPLICANT_DATA,
  isMockData: true,
};

export const MOCK_SELLER_LISTINGS: SellerListingItem[] = [
  {
    id: 'FDC-2026-0142',
    title: 'VW Polo Track 2023',
    subtitle: 'Volkswagen · Hatch · Flex   |   45.300 km',
    brand: 'Volkswagen',
    model: 'Polo Track',
    category: 'Hatch',
    fuel: 'Flex',
    mileageKm: 45300,
    mileageFormatted: '45.300 km',
    priceCents: 7490000,
    priceFormatted: 'R$ 74.900,00',
    status: 'PUBLISHED',
    statusLabel: 'Publicado',
    createdAtFormatted: '24 out 2026',
    createdAtTime: 'às 14:20',
    imageUrl: '/images/vehicles/demo/vw-polo-2023.jpg',
    isMockData: true,
  },
  {
    id: 'FDC-2026-0105',
    title: 'Fiat Strada 2023',
    subtitle: 'Fiat · Picape · Flex   |   38.900 km',
    brand: 'Fiat',
    model: 'Strada',
    category: 'Picape',
    fuel: 'Flex',
    mileageKm: 38900,
    mileageFormatted: '38.900 km',
    priceCents: 10990000,
    priceFormatted: 'R$ 109.900,00',
    status: 'PENDING_REVIEW',
    statusLabel: 'Em análise',
    createdAtFormatted: '24 out 2026',
    createdAtTime: 'às 10:55',
    imageUrl: '/images/vehicles/demo/fiat-strada-2023.jpg',
    isMockData: true,
  },
  {
    id: 'FDC-2026-0118',
    title: 'Honda CG 160 2022',
    subtitle: 'Honda · Motocicleta · Flex   |   21.400 km',
    brand: 'Honda',
    model: 'CG 160',
    category: 'Motocicleta',
    fuel: 'Flex',
    mileageKm: 21400,
    mileageFormatted: '21.400 km',
    priceCents: 1350000,
    priceFormatted: 'R$ 13.500,00',
    status: 'PENDING_PAYMENT',
    statusLabel: 'Aguardando pagamento',
    createdAtFormatted: '23 out 2026',
    createdAtTime: 'às 18:07',
    imageUrl: '/images/vehicles/demo/honda-cg-160-2022.jpg',
    isMockData: true,
  },
];

export const MOCK_SELLER_KPIS: SellerDashboardKpis = {
  totalListings: 3,
  publishedCount: 1,
  underReviewCount: 1,
  pendingPaymentCount: 1,
};
