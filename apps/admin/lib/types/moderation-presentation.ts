// =========================================================================
// B5A — MODERATION TYPES (ADM-D-032, 033, 034, 035)
// =========================================================================

export type ReportStatus =
  | 'UNDER_REVIEW' // Em análise
  | 'CORRECTION_REQUESTED' // Correção solicitada
  | 'RESOLVED_NO_ACTION' // Encerrado sem medidas
  | 'RESOLVED_ACTION_TAKEN' // Encerrado com medidas
  | 'PENDING_EVIDENCE'; // Aguardando evidência

export type ReportCategory =
  | 'INCONSISTENT_AD_INFO' // Informações do anúncio divergentes
  | 'AD_DATA' // Dados de anúncio
  | 'SELLER_PROFILE_CORRECTION' // Correção de perfil do vendedor
  | 'FRAUD_SUSPICION' // Suspeita de fraude
  | 'INAPPROPRIATE_CONTENT'; // Conteúdo inadequado

export type ModerationDecisionType =
  | 'NOT_SUBSTANTIATED' // Denúncia não fundamentada
  | 'CORRECTION_REQUESTED' // Solicitar correção
  | 'RESTRICTIVE_MEASURE'; // Medida restritiva

export interface ReportAuditEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  operator?: string;
}

export interface ReportEvidenceItem {
  id: string;
  label: string;
  value: string;
  verified: boolean;
  masked?: boolean;
}

export interface ReportRecord {
  id: string; // e.g. RPT-DEMO-008
  adId: string; // e.g. FC-2026-0121
  vehicleTitle: string; // e.g. Toyota Corolla 2021
  vehicleImagePath?: string; // approved vehicle image path
  vehiclePriceBrl: number; // e.g. 112900
  sellerId: string;
  sellerName: string; // e.g. Vale Auto Veículos
  sellerType: 'concessionaria' | 'particular';
  sellerCnpjMasked: string; // Restrito / não público
  sellerLocation: string;
  reportedAt: string; // e.g. 24/10/2026
  category: ReportCategory;
  categoryLabel: string;
  allegation: string; // human-readable allegation
  reporterAlias: string; // anonymous / protected
  status: ReportStatus;
  conclusionLabel: string; // e.g. Não determinada
  evidence: ReportEvidenceItem[];
  auditTimeline: ReportAuditEvent[];
  conversationExcerpt?: ConversationExcerpt;
  provenance: string;
}

export interface ConversationMessage {
  id: string;
  senderAlias: string; // e.g. "Comprador (ID protegido)" or "Vendedor (Vale Auto)"
  senderType: 'buyer' | 'seller';
  timestamp: string;
  content: string;
  isExcerpt: boolean; // true = this is a limited excerpt
}

export interface ConversationExcerpt {
  reportId: string;
  scopeNotice: string; // notice about scope restriction
  messages: ConversationMessage[];
  evidenceAuthStatus: 'PENDING_VERIFICATION' | 'VERIFIED' | 'UNVERIFIABLE';
  auditSummary: string;
  permissionsNote: string;
}

export interface ModerationDecisionPreview {
  reportId: string;
  reporterProtocol: string;
  adId: string;
  sellerName: string;
  allegation: string;
  evidenceStatus: string;
  reviewer: string;
  currentState: ReportStatus;
  justificationRequired: boolean;
  decisionOptions: ModerationDecisionOption[];
  auditNote: string;
  blockedAuthorizationState: boolean;
}

export interface ModerationDecisionOption {
  type: ModerationDecisionType;
  label: string;
  description: string;
  consequences: string[];
  requiresJustification: boolean;
}

// =========================================================================
// Mobile Moderation Alert Card Fixture (ADM-M-005)
// =========================================================================
export interface MobileModerationReport {
  id: string; // e.g. REP-DEMO-0021
  adId?: string; // e.g. FC-2026-0121
  vehicleTitle?: string; // e.g. Toyota Corolla 2021
  vehiclePriceBrl?: number; // e.g. 112900
  sellerName: string; // e.g. Vale Auto Veículos
  sellerDocumentMasked: string; // e.g. CNPJ: Restrito / não público
  sellerType: 'concessionaria' | 'particular';
  categoryLabel: string; // e.g. Informações do anúncio divergentes
  allegation: string;
  reporterMasked: string; // e.g. Comprador (ID protegido por LGPD)
  reportedAt: string; // e.g. 24/10/2026
  statusLabel: string; // e.g. Em análise
  isUrgent: boolean;
  priorityLabel: string; // e.g. Urgente / Pendente
  readOnlyNotice: string;
}
