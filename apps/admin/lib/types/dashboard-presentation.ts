/**
 * Typed presentation data for visual dashboard fields (ADM-D-002, ADM-M-001)
 *
 * In compliance with AGENTS.md rule 4 and OpenAPI v0.2 contract:
 * Visual fields without approved backend endpoints must be explicitly tagged
 * as demonstration fixtures (DEMO DATA) and never claimed as real factual financial data.
 */

export interface DashboardSummaryMetrics {
  activeListings: {
    count: number;
    formatted: string;
    trend: string;
  };
  approvedSellers: {
    count: number;
    formatted: string;
    trend: string;
  };
  pendingApprovals: {
    count: number;
    formatted: string;
    trend: string;
    sellersCount: number;
    listingsCount: number;
  };
  confirmedRevenue: {
    amount: number;
    formatted: string;
    trend: string;
  };
  provenance: 'DEMO DATA';
}

export interface AttentionSummary {
  sellerApplications: {
    count: number;
    label: string;
    detail: string;
  };
  adsToReview: {
    count: number;
    label: string;
    detail: string;
  };
  pendingPayments: {
    count: number;
    label: string;
    detail: string;
  };
}

export interface RevenueChartPoint {
  month: string;
  value: number;
  label: string;
}

export type FigmaListingStatus = 'Ativo' | 'Em análise' | 'Pagamento pendente';

export interface FigmaRecentListing {
  id: string;
  adCode: string;
  vehicleTitle: string;
  sellerName: string;
  priceFormatted: string;
  status: FigmaListingStatus;
  location: string;
}
