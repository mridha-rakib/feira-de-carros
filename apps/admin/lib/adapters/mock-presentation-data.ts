import type {
  AttentionSummary,
  DashboardSummaryMetrics,
  FigmaRecentListing,
  RevenueChartPoint,
} from '../types/dashboard-presentation';

/**
 * Exact visual demonstration data from approved Figma screenshots:
 * ADM-D-002 (39:2) & ADM-M-001 (446:9341).
 * Explicitly tagged as DEMO DATA provenance.
 */
export const figmaSummaryMetrics: DashboardSummaryMetrics = {
  activeListings: {
    count: 1248,
    formatted: '1.248',
    trend: '+5,4% este mês',
  },
  approvedSellers: {
    count: 682,
    formatted: '682',
    trend: '+25 nos últimos 30 dias',
  },
  pendingApprovals: {
    count: 36,
    formatted: '36',
    trend: '18 vendedores • 18 anúncios',
    sellersCount: 18,
    listingsCount: 18,
  },
  confirmedRevenue: {
    amount: 42580,
    formatted: 'R$ 42.580',
    trend: '+12,8% vs. mês anterior',
  },
  provenance: 'DEMO DATA',
};

export const figmaAttentionSummary: AttentionSummary = {
  sellerApplications: {
    count: 18,
    label: 'Solicitações de vendedores',
    detail: 'pendentes',
  },
  adsToReview: {
    count: 18,
    label: 'Anúncios para revisar',
    detail: 'consulta',
  },
  pendingPayments: {
    count: 12,
    label: 'Pagamentos pendentes',
    detail: 'alertas',
  },
};

export const figmaChartData: RevenueChartPoint[] = [
  { month: 'Mai', value: 18400, label: 'R$ 18.400' },
  { month: 'Jun', value: 24200, label: 'R$ 24.200' },
  { month: 'Jul', value: 29800, label: 'R$ 29.800' },
  { month: 'Ago', value: 35100, label: 'R$ 35.100' },
  { month: 'Set', value: 42580, label: 'R$ 42.580' },
];

export const figmaRecentListings: FigmaRecentListing[] = [
  {
    id: 'rec-001',
    adCode: 'FC-2026-0142',
    vehicleTitle: 'Fiat Strada 2023',
    sellerName: 'Mariana Costa',
    priceFormatted: 'R$ 82.300',
    status: 'Ativo',
    location: 'Ipatinga, MG',
  },
  {
    id: 'rec-002',
    adCode: 'FC-2026-0148',
    vehicleTitle: 'Chevrolet Onix 2022',
    sellerName: 'Bruno Almeida',
    priceFormatted: 'R$ 69.900',
    status: 'Ativo',
    location: 'Timóteo, MG',
  },
  {
    id: 'rec-003',
    adCode: 'FC-2026-0151',
    vehicleTitle: 'VW Polo Track 2023',
    sellerName: 'Vale Auto Veículos',
    priceFormatted: 'R$ 74.500',
    status: 'Em análise',
    location: 'Coronel Fabriciano, MG',
  },
  {
    id: 'rec-004',
    adCode: 'FC-2026-0153',
    vehicleTitle: 'Honda CG 160 2022',
    sellerName: 'Rafael Santos',
    priceFormatted: 'R$ 16.900',
    status: 'Pagamento pendente',
    location: 'Ipatinga, MG',
  },
];
