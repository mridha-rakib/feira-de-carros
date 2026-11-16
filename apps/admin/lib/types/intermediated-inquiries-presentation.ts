export type InquiryStatus = 'IN_MEDIATION' | 'AWAITING_CONTACT' | 'RESOLVED';

export interface MediatedMessage {
  id: string;
  senderType: 'BUYER' | 'REPRESENTATIVE' | 'SYSTEM_AUDIT';
  senderName: string;
  senderRoleLabel?: string; // e.g. "Representante Feira de Carros (Main Admin)"
  timestamp: string;
  content: string;
  isAuditMilestone?: boolean;
}

export interface IntermediatedInquiryRecord {
  id: string; // e.g. INQ-LEG-0021
  advertisementId: string; // e.g. LEG-2026-0007
  vehicleTitle: string; // e.g. Toyota Corolla 2021
  vehiclePriceFormatted: string; // e.g. R$ 109.900
  vehicleImageUrl: string;
  ownerName: string; // e.g. João Batista
  hasOwnerAccount: boolean; // false
  ownerAccountNotice: string; // "Sem conta cadastrada na plataforma (Vendedor presencial)"
  buyerName: string; // e.g. Lucas Ribeiro
  representativeName: string; // "Main Admin — Feira de Carros"
  contactPhoneMasked: string; // "(31) 9 0000-0000"
  status: InquiryStatus;
  statusLabel: string;
  lastMessageDate: string;
  conversationExcerpts: MediatedMessage[];
}

export interface IntermediatedInquiryKpiSummary {
  totalInquiries: number; // 3
  inMediationCount: number; // 2
  unregisteredOwnersCount: number; // 3
  staffAccessStatus: string; // "Condicional · DENY_PENDING"
}
