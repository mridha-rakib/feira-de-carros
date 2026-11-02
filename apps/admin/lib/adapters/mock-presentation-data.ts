import type {
  AttentionItem,
  ChartDataPoint,
  RecentListingItem,
  SimulatedRevenueMetrics,
} from '../types/dashboard-presentation';

export const mockSimulatedRevenue: SimulatedRevenueMetrics = {
  monthlyEstimatedRevenue: 48750,
  monthlyGrowthRate: 0.15,
  currency: 'BRL',
  averageTicket: 149.0,
  conversionRate: 0.042,
  provenance: 'SIMULATED_MOCK_DATA',
};

export const mockAttentionItems: AttentionItem[] = [
  {
    id: 'att-001',
    title: 'Verificação Cadastral de Concessionária',
    description:
      'Auto Shopping Leste Ltda (CNPJ 12.345.678/0001-90) aguarda validação de contrato social e credenciamento.',
    category: 'concessionaria',
    priority: 'media',
    timestamp: 'Há 3 horas',
    targetUrl: '/dealerships/att-001',
    actionLabel: 'Validar Concessionária',
    badgeLabel: 'Concessionária',
  },
  {
    id: 'att-002',
    title: 'Denúncia de Anúncio Suspeito (Possível Fraude)',
    description:
      'Toyota Hilux 2.8 TDI 4x4 anunciado por R$ 78.900 (62% abaixo da tabela FIPE). 4 denúncias registradas.',
    category: 'denuncia',
    priority: 'alta',
    timestamp: 'Há 45 min',
    targetUrl: '/vehicles/rev-002',
    actionLabel: 'Auditar Denúncia',
    badgeLabel: 'Urgente / Fraude',
  },
  {
    id: 'att-003',
    title: 'Solicitação de Reembolso Dentro do Prazo Legal',
    description:
      'Plano Destaque Premium 15 dias (ID #RB-2026-89) solicitado cancelamento sob Art. 49 CDC (7 dias).',
    category: 'reembolso',
    priority: 'media',
    timestamp: 'Ontem, 16:40',
    targetUrl: '/payments/refunds/att-003',
    actionLabel: 'Revisar Solicitação',
    badgeLabel: 'Reembolso CDC',
  },
];

export const mockRecentListings: RecentListingItem[] = [
  {
    id: 'lst-001',
    title: 'Toyota Corolla 2.0 XEi Flex Automático',
    details: '2024/2024 • Final 8 • Flex • Sedã',
    sellerName: 'Auto Shopping Leste Ltda',
    sellerType: 'Concessionária',
    price: 142900,
    priceFormatted: 'R$ 142.900',
    submittedAt: 'Hoje, 10:14',
    status: 'Pendente',
    category: 'Sedã',
  },
  {
    id: 'lst-002',
    title: 'Jeep Compass Longitude 1.3 T270 Turbo',
    details: '2023/2024 • Final 4 • Flex • SUV',
    sellerName: 'Marcos Vinícius Silva',
    sellerType: 'Particular',
    price: 158900,
    priceFormatted: 'R$ 158.900',
    submittedAt: 'Hoje, 09:42',
    status: 'Ativo',
    category: 'SUV',
  },
  {
    id: 'lst-003',
    title: 'BYD Dolphin Plus 60.48 kWh Elétrico',
    details: '2024/2024 • Final 1 • 100% Elétrico • Hatch',
    sellerName: 'Green Motors Ipatinga',
    sellerType: 'Concessionária',
    price: 169800,
    priceFormatted: 'R$ 169.800',
    submittedAt: 'Ontem, 17:30',
    status: 'Ativo',
    category: 'Elétrico',
  },
  {
    id: 'lst-004',
    title: 'Honda Civic Touring 1.5 Turbo Automático',
    details: '2022/2023 • Final 9 • Gasolina • Sedã',
    sellerName: 'Ana Beatriz Souza',
    sellerType: 'Particular',
    price: 138500,
    priceFormatted: 'R$ 138.500',
    submittedAt: 'Ontem, 15:18',
    status: 'Pendente',
    category: 'Sedã',
  },
  {
    id: 'lst-005',
    title: 'Chevrolet Onix Premier 1.0 Turbo Flex',
    details: '2023/2023 • Final 3 • Flex • Hatch',
    sellerName: 'Lucas Ferreira Rocha',
    sellerType: 'Particular',
    price: 89900,
    priceFormatted: 'R$ 89.900',
    submittedAt: 'Ontem, 11:05',
    status: 'Ativo',
    category: 'Hatch',
  },
];

export const mockChartData: ChartDataPoint[] = [
  { month: 'Mai', revenue: 34200, revenueFormatted: 'R$ 34.200', listings: 220 },
  { month: 'Jun', revenue: 38500, revenueFormatted: 'R$ 38.500', listings: 255 },
  { month: 'Jul', revenue: 41200, revenueFormatted: 'R$ 41.200', listings: 280 },
  { month: 'Ago', revenue: 44000, revenueFormatted: 'R$ 44.000', listings: 305 },
  { month: 'Set', revenue: 46800, revenueFormatted: 'R$ 46.800', listings: 325 },
  { month: 'Out', revenue: 48750, revenueFormatted: 'R$ 48.750', listings: 342 },
];
