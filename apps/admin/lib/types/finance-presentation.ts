export type PaymentStatus = 'CONFIRMED' | 'PENDING' | 'FAILED' | 'IN_DISPUTE' | 'REFUNDED';

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'CASH';

export type PaymentPurpose = 'AD_PLAN' | 'FEATURED_BOOST' | 'RENEWAL';

export interface PaymentTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  operator?: string;
}

export interface TransactionRecord {
  id: string; // e.g. TX-2026-0001
  orderId: string; // e.g. ORD-2026-0081
  adId: string; // e.g. ANX-2026-0151
  vehicleTitle: string;
  vehiclePlateMasked: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'particular' | 'concessionaria';
  sellerDocumentMasked: string;
  sellerEmailMasked: string;
  sellerPhone: string;
  planName: string;
  purpose: PaymentPurpose;
  amountBrl: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  confirmedAt?: string;
  gatewayRef?: string;
  operatorName?: string;
  operatorRole?: string;
  adStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'DRAFT' | 'REJECTED';
  adPublished: boolean;
  timeline: PaymentTimelineEvent[];
  provenance: string;
}

export interface CashReceiptRecord {
  id: string; // e.g. REC-2026-0001
  transactionId: string; // e.g. TX-2026-0003
  orderId: string;
  adId: string;
  vehicleTitle: string;
  sellerName: string;
  sellerDocumentMasked: string;
  sellerType: 'particular' | 'concessionaria';
  amountReceivedBrl: number;
  planName: string;
  receivedAt: string;
  location: string;
  operatorId: string;
  operatorName: string;
  operatorRole: string;
  physicalSlipNumber: string;
  auditHash: string;
  status: 'REGISTERED_AUDITED';
  recordNotes: string;
}

export interface FinanceKpiMetrics {
  totalTransactedBrl: number;
  totalTransactionsCount: number;
  confirmedVolumeBrl: number;
  confirmedCount: number;
  pendingVolumeBrl: number;
  pendingCount: number;
  cashLedgerVolumeBrl: number;
  cashLedgerCount: number;
  disputeCount: number;
}

// =========================================================================
// B4B — REFUNDS, CHARGEBACKS & REVENUE REPORT TYPES (ADM-D-028, 029, 030, 031, ADM-M-006)
// =========================================================================

export type RefundRequestStatus =
  | 'PENDING_REVIEW' // Em análise (prazo de 3 dias úteis)
  | 'HOLD_LEGAL' // Retenção jurídica / Validação de elegibilidade CDC Art. 49
  | 'APPROVED_DEMO' // Deferido em ambiente demonstrativo
  | 'REJECTED_DEMO' // Indeferido em ambiente demonstrativo
  | 'APPROVED'
  | 'REJECTED'
  | 'REFUNDED';

export interface RefundReviewCriteria {
  withinSevenDays: boolean;
  boostAlreadyConsumed: boolean;
  eligibleForRefund: boolean;
  rejectionReasonOption?: string;
}

export interface RefundRequestRecord {
  id: string; // e.g. CXL-DEMO-001
  transactionId: string; // e.g. TX-2026-0001 (mapped to PAY-2026-0001)
  orderId: string; // e.g. ORD-2026-0081
  adId: string; // e.g. ANX-2026-0151
  vehicleTitle: string;
  sellerId: string;
  sellerName: string;
  sellerDocumentMasked: string;
  sellerEmailMasked: string;
  sellerPhone: string;
  planName: string;
  amountBrl: number;
  method: PaymentMethod;
  requestedAt: string;
  adPublishedAt: string;
  legalDeadline: string; // e.g. "3 dias úteis (Análise CDC Art. 49)"
  reason: string;
  status: RefundRequestStatus;
  reviewCriteria: RefundReviewCriteria;
  auditTimeline: PaymentTimelineEvent[];
  notes?: string;
  provenance: string;
}

export type ChargebackDisputeStatus =
  | 'UNDER_REVIEW' // Em análise adquirente / contestação aberta
  | 'INCOMPLETE_EVIDENCE' // Documentação comprobatória pendente
  | 'RESOLVED_FAVORABLE' // Contestação revertida a favor do marketplace
  | 'RESOLVED_UNFAVORABLE' // Chargeback consolidado pelo emissor
  | 'WON'
  | 'LOST';

export interface CardDisputeRecord {
  id: string; // e.g. DSP-2026-0001
  transactionId: string; // e.g. TX-2026-0002 / PAY-2026-0002
  orderId: string;
  adId: string;
  vehicleTitle: string;
  sellerName: string;
  sellerDocumentMasked: string;
  cardBrand: 'Mastercard' | 'Visa' | 'Elo';
  cardLastFour: string;
  amountBrl: number;
  disputedAt: string;
  pspCaseId: string; // e.g. "CHG-CIELO-98214"
  pspDeadline: string; // e.g. "5 dias restantes"
  disputeReason: string;
  status: ChargebackDisputeStatus;
  evidenceSubmitted: boolean;
  timeline: PaymentTimelineEvent[];
  provenance: string;
}

export interface RevenueMonthlyMetric {
  monthKey: string; // e.g. "2026-05"
  monthLabel: string; // e.g. "Maio 2026"
  amountBrl: number; // e.g. 4200.0
  plansAmountBrl: number;
  boostsAmountBrl: number;
  activeAdsCount: number;
}

export interface RevenueReportMetrics {
  totalConfirmedRevenueBrl: number; // Exactly R$ 42.580,00
  periodLabel: string; // "Maio – Outubro 2026"
  activeAdvertisementsCount: number; // Exactly 1.248
  vehicleSalesProcessedBrl: number; // Exactly R$ 0,00 (Marketplace does not process vehicle transactions)
  monthlyData: RevenueMonthlyMetric[];
}

export interface TransactionReferenceMap {
  internalTxId: string; // TX-2026-*
  figmaPayId: string; // PAY-2026-*
  sellerName: string;
  amountBrl: number;
}
