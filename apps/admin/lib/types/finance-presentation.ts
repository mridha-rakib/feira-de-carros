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
