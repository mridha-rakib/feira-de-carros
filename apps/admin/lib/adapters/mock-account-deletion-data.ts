// =========================================================================
// B5B — MOCK ACCOUNT DELETION DATA (ADM-D-036, ADM-D-037)
// LGPD / Account Deletion Review & Compliance Fixtures
// DEMO DATA ONLY — no real deletions, identities or database operations.
// =========================================================================

import type {
  AccountDeletionDecisionOption,
  AccountDeletionKPI,
  AccountDeletionRecord,
} from '../types/account-deletion-presentation';

// ---------------------------------------------------------------------------
// Approved Metrics (Figma ADM-D-036 source-of-truth)
// ---------------------------------------------------------------------------
export const ACCOUNT_DELETION_KPI: AccountDeletionKPI = {
  totalRequests: 3,
  underReview: 2,
  retentionEvaluation: 1,
  executedDeletions: 0,
};

// ---------------------------------------------------------------------------
// Approved Sample Records (Figma ADM-D-036 & ADM-D-037)
// ---------------------------------------------------------------------------
export const mockAccountDeletionRequests: AccountDeletionRecord[] = [
  {
    id: 'EX-2026-0027',
    userName: 'Mariana Costa',
    userRoleLabel: 'Vendedora individual',
    userRole: 'seller',
    location: 'Ipatinga, MG',
    requestedAt: '25/10/2026',
    status: 'UNDER_REVIEW',
    statusLabel: 'Em análise',
    activeListingsCount: 3,
    activeListingsLabel: '3 anúncios',
    listingsImpactLabel: '3 - revisar efeitos',
    contactMasked: 'E-mail privado mascarado',
    phoneMasked: '(31) 9****-**27',
    documentMasked: 'CPF: ***.***.***-27',
    conversationsStatus: 'Retenção sob LGPD',
    dataDeletionStatus: 'Não realizada',
    authenticationStatus: 'Verificar no processamento',
    retentionStatus: 'PENDING',
    retentionStatusLabel: 'Pendente',
    decisionReviewer: 'Main Admin autorizado',
    validRequestStatus: 'Sujeito à verificação',
    publicListingsStatus: 'Remover após aprovação',
    linkedChatsStatus: 'LGPD / retenção legal',
    billingAuditStatus: 'Base legal a determinar',
    documentProtectionStatus: 'Restringir sempre',
    immediateDeletionStatus: 'Não autorizado',
    finalDecisionStatus: 'Ainda não concluída',
    indefiniteRetentionStatus: 'Não presumida',
    provenance: 'DEMO — Registro fictício; nenhuma exclusão de conta ou dados executada.',
  },
  {
    id: 'EX-DEMO-0028',
    userName: 'Lucas Ribeiro',
    userRoleLabel: 'Comprador',
    userRole: 'buyer',
    location: 'Coronel Fabriciano, MG',
    requestedAt: '25/10/2026',
    status: 'UNDER_REVIEW',
    statusLabel: 'Em análise',
    activeListingsCount: 0,
    activeListingsLabel: '0 anúncios',
    listingsImpactLabel: '0 - sem impacto',
    contactMasked: 'E-mail privado mascarado',
    phoneMasked: '(31) 9****-**28',
    documentMasked: 'CPF: ***.***.***-28',
    conversationsStatus: 'Retenção sob LGPD',
    dataDeletionStatus: 'Não realizada',
    authenticationStatus: 'Verificar no processamento',
    retentionStatus: 'PENDING',
    retentionStatusLabel: 'Pendente',
    decisionReviewer: 'Main Admin autorizado',
    validRequestStatus: 'Sujeito à verificação',
    publicListingsStatus: 'Nenhum anúncio vinculado',
    linkedChatsStatus: 'LGPD / retenção legal',
    billingAuditStatus: 'Base legal a determinar',
    documentProtectionStatus: 'Restringir sempre',
    immediateDeletionStatus: 'Não autorizado',
    finalDecisionStatus: 'Ainda não concluída',
    indefiniteRetentionStatus: 'Não presumida',
    provenance: 'DEMO — Registro fictício; nenhuma exclusão de conta ou dados executada.',
  },
  {
    id: 'EX-DEMO-0029',
    userName: 'Fernanda Rocha',
    userRoleLabel: 'Vendedora',
    userRole: 'seller',
    location: 'Timóteo, MG',
    requestedAt: '26/10/2026',
    status: 'RETENTION_EVALUATION',
    statusLabel: 'Correção',
    activeListingsCount: 2,
    activeListingsLabel: '2 anúncios',
    listingsImpactLabel: '2 - revisar efeitos',
    contactMasked: 'E-mail privado mascarado',
    phoneMasked: '(31) 9****-**29',
    documentMasked: 'CPF: ***.***.***-29',
    conversationsStatus: 'Retenção sob LGPD',
    dataDeletionStatus: 'Não realizada',
    authenticationStatus: 'Pendência de autenticação de titularidade',
    retentionStatus: 'EVALUATION',
    retentionStatusLabel: 'Em avaliação',
    decisionReviewer: 'Main Admin autorizado',
    validRequestStatus: 'Pendente de documentação',
    publicListingsStatus: '2 - aguardando regularização',
    linkedChatsStatus: 'LGPD / retenção legal',
    billingAuditStatus: 'Faturas pendentes em auditoria',
    documentProtectionStatus: 'Restringir sempre',
    immediateDeletionStatus: 'Não autorizado',
    finalDecisionStatus: 'Ainda não concluída',
    indefiniteRetentionStatus: 'Não presumida',
    provenance: 'DEMO — Registro fictício; nenhuma exclusão de conta ou dados executada.',
  },
];

// ---------------------------------------------------------------------------
// Approved Decision Options (ADM-D-037)
// ---------------------------------------------------------------------------
export const mockDeletionDecisionOptions: AccountDeletionDecisionOption[] = [
  {
    type: 'CONDITIONAL_APPROVAL',
    title: 'Aprovação condicionada',
    description:
      'Após checagens legais, retirar anúncios públicos; registrar decisão e política de minimização.',
    accentColor: 'emerald',
  },
  {
    type: 'REQUEST_DOCUMENTATION',
    title: 'Solicitar documentação',
    description: 'Pendência de autenticação, titularidade ou tratamento legal.',
    accentColor: 'amber',
  },
  {
    type: 'JUSTIFIED_DENIAL',
    title: 'Negar justificadamente',
    description: 'Somente com base legal e comunicação formal ao solicitante.',
    accentColor: 'rose',
  },
];

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
export function getAccountDeletionById(id: string): AccountDeletionRecord | null {
  return mockAccountDeletionRequests.find((r) => r.id === id) ?? null;
}
