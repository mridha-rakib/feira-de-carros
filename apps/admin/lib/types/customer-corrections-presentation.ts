export type CustomerCorrectionStatus = 'IN_REVIEW' | 'PENDING_EVIDENCE' | 'COMPLETED';

export type CustomerCorrectionFieldType = 'TELEPHONE' | 'LOCALITY' | 'CNPJ_DOCUMENT';

export interface CustomerCorrectionRecord {
  id: string; // e.g. COR-DEMO-0042
  customerName: string;
  accountId: string; // e.g. USR-2026-0042
  accountType: string; // Vendedora individual, Concessionária, etc.
  fieldType: CustomerCorrectionFieldType;
  fieldLabel: string; // Telefone, Localidade, CNPJ restrito
  currentValueMasked: string;
  requestedValueMasked: string;
  status: CustomerCorrectionStatus;
  statusLabel: string;
  date: string;
  justification: string;
  identityVerificationStatus: string;
  isSensitive: boolean;
  permissionStatus: string; // e.g. "DENY_PENDING (Support) · Autorizado (Main Admin)"
  notes: string;
}

export interface CustomerCorrectionKpiSummary {
  totalRequests: number; // 3
  underReviewCount: number; // 2
  sensitivePendingCount: number; // 1
  reviewerRole: string; // Main Admin
}
