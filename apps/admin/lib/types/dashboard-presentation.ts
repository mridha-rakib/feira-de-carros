/**
 * Typed presentation data for visual dashboard fields (ADM-D-002, ADM-M-001)
 *
 * In compliance with AGENTS.md rule 4 and OpenAPI v0.2 contract:
 * Visual fields without approved backend endpoints must be explicitly tagged
 * as simulated presentation mocks (DEMO DATA) and never claimed as real financial statistics.
 */

export interface SimulatedRevenueMetrics {
  monthlyEstimatedRevenue: number;
  monthlyGrowthRate: number;
  currency: 'BRL';
  averageTicket: number;
  conversionRate: number;
  provenance: 'SIMULATED_MOCK_DATA';
}

export type AttentionPriority = 'alta' | 'media' | 'baixa';
export type AttentionCategory = 'concessionaria' | 'denuncia' | 'reembolso' | 'seguranca';

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  category: AttentionCategory;
  priority: AttentionPriority;
  timestamp: string;
  targetUrl: string;
  actionLabel: string;
  badgeLabel: string;
}

export type ListingStatus = 'Ativo' | 'Pendente' | 'Em Análise';

export interface RecentListingItem {
  id: string;
  title: string;
  details: string; // e.g. "2024/2024 • Final 8 • Flex"
  sellerName: string;
  sellerType: 'Particular' | 'Concessionária';
  price: number;
  priceFormatted: string;
  submittedAt: string;
  status: ListingStatus;
  category: string;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  revenueFormatted: string;
  listings: number;
}
