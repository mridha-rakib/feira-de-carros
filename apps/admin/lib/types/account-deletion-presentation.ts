// =========================================================================
// B5B — ACCOUNT DELETION TYPES (ADM-D-036, ADM-D-037)
// LGPD / Account Deletion Review & Compliance
// =========================================================================

export type AccountDeletionStatus =
  | 'UNDER_REVIEW' // Em análise (amber)
  | 'RETENTION_EVALUATION' // Correção / Retenção em avaliação (red/pink)
  | 'REMOVED_NO_ACTION'; // Remoções executadas (0 in demo)

export type AccountDeletionDecisionType =
  | 'CONDITIONAL_APPROVAL' // Aprovação condicionada
  | 'REQUEST_DOCUMENTATION' // Solicitar documentação
  | 'JUSTIFIED_DENIAL'; // Negar justificadamente

export interface AccountDeletionRecord {
  id: string; // e.g. EX-2026-0027
  userName: string; // e.g. Mariana Costa
  userRoleLabel: string; // e.g. Vendedora individual, Comprador, Vendedora
  userRole: 'seller' | 'buyer';
  location: string; // e.g. Ipatinga, MG
  requestedAt: string; // e.g. 25/10/2026
  status: AccountDeletionStatus;
  statusLabel: string; // e.g. Em análise, Correção
  activeListingsCount: number; // e.g. 3, 0, 2
  activeListingsLabel: string; // e.g. 3 anúncios, 0 anúncios, 2 anúncios
  listingsImpactLabel: string; // e.g. 3 - revisar efeitos, 0 - sem impacto
  contactMasked: string; // e.g. E-mail privado mascarado
  phoneMasked: string; // e.g. (31) 9****-**27
  documentMasked: string; // e.g. CPF: ***.***.***-27
  conversationsStatus: string; // e.g. Retenção sob LGPD / Retenção conforme política
  dataDeletionStatus: string; // e.g. Não realizada
  authenticationStatus: string; // e.g. Verificar no processamento
  retentionStatus: 'PENDING' | 'EVALUATION' | 'HOLD';
  retentionStatusLabel: string; // e.g. Pendente
  decisionReviewer: string; // e.g. Main Admin autorizado
  validRequestStatus: string; // e.g. Sujeito à verificação
  publicListingsStatus: string; // e.g. Remover após aprovação
  linkedChatsStatus: string; // e.g. LGPD / retenção legal
  billingAuditStatus: string; // e.g. Base legal a determinar
  documentProtectionStatus: string; // e.g. Restringir sempre
  immediateDeletionStatus: string; // e.g. Não autorizado
  finalDecisionStatus: string; // e.g. Ainda não concluída
  indefiniteRetentionStatus: string; // e.g. Não presumida
  provenance: string;
}

export interface AccountDeletionKPI {
  totalRequests: number; // 3
  underReview: number; // 2
  retentionEvaluation: number; // 1
  executedDeletions: number; // 0
}

export interface AccountDeletionDecisionOption {
  type: AccountDeletionDecisionType;
  title: string;
  description: string;
  badgeLabel?: string;
  accentColor: 'emerald' | 'amber' | 'rose';
}
