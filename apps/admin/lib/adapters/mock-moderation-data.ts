// =========================================================================
// B5A — MOCK MODERATION DATA (ADM-D-032, 033, 034, 035)
// Source-of-truth fixture values per approved Figma and specification.
// DEMO DATA ONLY — no real reports, identities or moderation decisions.
// =========================================================================

import type {
  ConversationExcerpt,
  MobileModerationReport,
  ModerationDecisionPreview,
  ReportRecord,
} from '../types/moderation-presentation';

// ---------------------------------------------------------------------------
// Three fictional reports per specification
// ---------------------------------------------------------------------------
export const mockReports: ReportRecord[] = [
  {
    id: 'RPT-DEMO-008',
    adId: 'FC-2026-0121',
    vehicleTitle: 'Toyota Corolla 2021',
    vehicleImagePath: '/images/vehicles/demo/image.png',
    vehiclePriceBrl: 112900,
    sellerId: 'vale-auto-veiculos',
    sellerName: 'Vale Auto Veículos',
    sellerType: 'concessionaria',
    sellerCnpjMasked: 'Restrito / não público',
    sellerLocation: 'Coronel Fabriciano, MG',
    reportedAt: '24/10/2026',
    category: 'INCONSISTENT_AD_INFO',
    categoryLabel: 'Informações do anúncio',
    allegation:
      'Informações de quilometragem potencialmente inconsistentes. Comprador reporta discrepância entre quilometragem anunciada e histórico de manutenção apresentado durante visita.',
    reporterAlias: 'Comprador (ID protegido por LGPD)',
    status: 'UNDER_REVIEW',
    conclusionLabel: 'Não determinada',
    evidence: [
      {
        id: 'ev-1',
        label: 'Motivo relatado',
        value: 'Dados possivelmente divergentes',
        verified: false,
      },
      { id: 'ev-2', label: 'Prova vinculada', value: 'Apenas conteúdo reportado', verified: false },
      { id: 'ev-3', label: 'Estado', value: 'Aguardando análise humana', verified: false },
      { id: 'ev-4', label: 'Resultado atual', value: 'Anúncio não modificado', verified: false },
    ],
    auditTimeline: [
      {
        id: 'at-1',
        timestamp: '24/10/2026 09:14',
        title: 'Denúncia recebida',
        description: 'Protocolo RPT-DEMO-008 registrado automaticamente pelo sistema.',
        type: 'INFO',
        operator: 'Sistema (Auto)',
      },
      {
        id: 'at-2',
        timestamp: '24/10/2026 09:15',
        title: 'Triagem inicial',
        description: 'Denúncia encaminhada à fila de moderação para análise humana.',
        type: 'WARNING',
        operator: 'Sistema (Auto)',
      },
    ],
    conversationExcerpt: {
      reportId: 'RPT-DEMO-008',
      scopeNotice:
        'Trecho unilateral anexado pelo denunciante como evidência documental. Não constitui registro certificado de chat privado nem espelhamento de conversas da plataforma.',
      messages: [
        {
          id: 'msg-1',
          senderAlias: 'Comprador (ID protegido)',
          senderType: 'buyer',
          timestamp: '23/10/2026 14:30',
          content:
            'Boa tarde. Visitei o veículo hoje e percebi que a quilometragem marcada no painel difere do valor anunciado. O anúncio informa 48.000 km mas o hodômetro indica aproximadamente 61.000 km.',
          isExcerpt: true,
        },
        {
          id: 'msg-2',
          senderAlias: 'Vendedor (Vale Auto Veículos)',
          senderType: 'seller',
          timestamp: '23/10/2026 15:45',
          content:
            'Obrigado pelo contato. Verificaremos o dado. O veículo passou por revisão completa e toda documentação está disponível. Pode haver um erro na publicação do anúncio.',
          isExcerpt: true,
        },
      ],
      evidenceAuthStatus: 'PENDING_VERIFICATION',
      auditSummary:
        'Evidência documental unilateral submetida pelo denunciante para instrução do protocolo RPT-DEMO-008. Não constitui espelhamento de chat nem histórico certificado. Autenticidade não verificada independentemente.',
      permissionsNote:
        'Evidência documental unilateral submetida pelo denunciante. Main Admin: revisão de evidência autorizada para instrução. Support: DENY_PENDING. Não há acesso irrestrito a conversas privadas da plataforma.',
    },
    provenance: 'DEMO — Registro fictício; nenhuma denúncia real executada.',
  },
  {
    id: 'RPT-DEMO-009',
    adId: 'FC-2026-0142',
    vehicleTitle: 'Fiat Strada 2023',
    vehicleImagePath: '/images/vehicles/demo/pickup-fallback.svg',
    vehiclePriceBrl: 89900,
    sellerId: 'seller-demo-009',
    sellerName: 'Vendedor Particular',
    sellerType: 'particular',
    sellerCnpjMasked: 'Restrito / não público',
    sellerLocation: 'Ipatinga, MG',
    reportedAt: '25/10/2026',
    category: 'AD_DATA',
    categoryLabel: 'Dados de anúncio',
    allegation:
      'Dados do anúncio potencialmente incorretos. Fotos podem não corresponder ao veículo real.',
    reporterAlias: 'Comprador (ID protegido por LGPD)',
    status: 'UNDER_REVIEW',
    conclusionLabel: 'Não determinada',
    evidence: [
      {
        id: 'ev-1',
        label: 'Motivo relatado',
        value: 'Dados de anúncio inconsistentes',
        verified: false,
      },
      { id: 'ev-2', label: 'Prova vinculada', value: 'Apenas conteúdo reportado', verified: false },
      { id: 'ev-3', label: 'Estado', value: 'Aguardando análise humana', verified: false },
      { id: 'ev-4', label: 'Resultado atual', value: 'Anúncio não modificado', verified: false },
    ],
    auditTimeline: [
      {
        id: 'at-1',
        timestamp: '25/10/2026 10:02',
        title: 'Denúncia recebida',
        description: 'Protocolo RPT-DEMO-009 registrado automaticamente pelo sistema.',
        type: 'INFO',
        operator: 'Sistema (Auto)',
      },
    ],
    provenance: 'DEMO — Registro fictício; nenhuma denúncia real executada.',
  },
  {
    id: 'RPT-DEMO-010',
    adId: '',
    vehicleTitle: '',
    vehicleImagePath: undefined,
    vehiclePriceBrl: 0,
    sellerId: 'bruno-almeida',
    sellerName: 'Bruno Almeida',
    sellerType: 'particular',
    sellerCnpjMasked: 'Restrito / não público',
    sellerLocation: 'Timóteo, MG',
    reportedAt: '25/10/2026',
    category: 'SELLER_PROFILE_CORRECTION',
    categoryLabel: 'Solicitação de correção',
    allegation: 'Vendedor solicita correção de dados no próprio perfil de vendedor.',
    reporterAlias: 'Perfil vendedor: Bruno Almeida',
    status: 'CORRECTION_REQUESTED',
    conclusionLabel: 'Correção pendente',
    evidence: [
      { id: 'ev-1', label: 'Tipo', value: 'Correção de perfil', verified: true },
      { id: 'ev-2', label: 'Solicitante', value: 'Próprio vendedor', verified: true },
      { id: 'ev-3', label: 'Estado', value: 'Aguardando aprovação', verified: false },
    ],
    auditTimeline: [
      {
        id: 'at-1',
        timestamp: '25/10/2026 11:30',
        title: 'Solicitação recebida',
        description: 'Protocolo RPT-DEMO-010 criado por solicitação do próprio vendedor.',
        type: 'INFO',
        operator: 'Sistema (Auto)',
      },
    ],
    provenance: 'DEMO — Registro fictício; nenhuma denúncia real executada.',
  },
];

// ---------------------------------------------------------------------------
// Decision preview for RPT-DEMO-008 (ADM-D-035)
// ---------------------------------------------------------------------------
export const mockModerationDecision: ModerationDecisionPreview = {
  reportId: 'RPT-DEMO-008',
  reporterProtocol: 'RPT-DEMO-008',
  adId: 'FC-2026-0121',
  sellerName: 'Vale Auto Veículos',
  allegation: 'Informações de quilometragem potencialmente inconsistentes',
  evidenceStatus: 'Apenas conteúdo reportado — sem verificação independente',
  reviewer: 'Admin Principal',
  currentState: 'UNDER_REVIEW',
  justificationRequired: true,
  decisionOptions: [
    {
      type: 'NOT_SUBSTANTIATED',
      label: 'Denúncia não fundamentada',
      description:
        'Evidências apresentadas não são suficientes para confirmar violação. Relatório encerrado sem medidas restritivas.',
      consequences: [
        'Anúncio FC-2026-0121 permanece ativo',
        'Perfil do vendedor não alterado',
        'Protocolo arquivado com justificativa',
      ],
      requiresJustification: true,
    },
    {
      type: 'CORRECTION_REQUESTED',
      label: 'Solicitar correção',
      description:
        'Vendedor notificado para corrigir a informação de quilometragem dentro de 48 horas úteis.',
      consequences: [
        'Notificação enviada a Vale Auto Veículos',
        'Anúncio marcado "Aguardando correção"',
        'Protocolo em acompanhamento',
      ],
      requiresJustification: true,
    },
    {
      type: 'RESTRICTIVE_MEASURE',
      label: 'Medida restritiva',
      description:
        'Aplicação de restrição ao anúncio ou ao perfil do vendedor mediante autorização de alçada.',
      consequences: [
        'Requer autorização de Main Admin',
        'Medida documentada no histórico do vendedor',
        'Reversível mediante recurso',
      ],
      requiresJustification: true,
    },
  ],
  auditNote:
    'Nenhuma medida é executada automaticamente. Decisões ficam em estado de prévia demonstrativa até autorização de alçada. Sistema operacional em modo fail-closed.',
  blockedAuthorizationState: true,
};

// ---------------------------------------------------------------------------
// KPI helper values (ADM-D-032 source-of-truth)
// ---------------------------------------------------------------------------
export const MODERATION_KPI = {
  totalReports: 3,
  underReview: 2,
  corrections: 1,
  supportAccessLabel: 'DENY_PENDING',
} as const;

// ---------------------------------------------------------------------------
// Mobile Moderation KPIs & Fictional Alert Cards (ADM-M-005 source-of-truth)
// Node 447-9382: 7 pendentes, 2 urgentes, Support DENY_PENDING
// Kept strictly separate from the desktop queue dataset.
// ---------------------------------------------------------------------------
export const MODERATION_MOBILE_KPI = {
  pendingReports: 7,
  urgentReports: 2,
  mainAdminStatus: 'Revisão e leitura autorizada',
  supportStatus: 'DENY_PENDING',
} as const;

export const mockMobileModerationReports: MobileModerationReport[] = [
  {
    id: 'REP-DEMO-0021',
    adId: 'FC-2026-0121',
    vehicleTitle: 'Toyota Corolla 2021',
    vehiclePriceBrl: 112900,
    sellerName: 'Vale Auto Veículos',
    sellerDocumentMasked: 'CNPJ: Restrito / não público',
    sellerType: 'concessionaria',
    categoryLabel: 'Informações do anúncio divergentes',
    allegation:
      'Divergência apontada entre odômetro físico e quilometragem anunciada. Requer análise documental com concessionária.',
    reporterMasked: 'Comprador (ID protegido por LGPD)',
    reportedAt: '24/10/2026',
    statusLabel: 'Em análise',
    isUrgent: true,
    priorityLabel: 'Urgente',
    readOnlyNotice: 'Modo Leitura • Deliberação restrita ao terminal desktop',
  },
  {
    id: 'REP-DEMO-0022',
    adId: 'FC-2026-0142',
    vehicleTitle: 'Fiat Strada 2023',
    vehiclePriceBrl: 89900,
    sellerName: 'Particular',
    sellerDocumentMasked: 'CPF: ***.***.***-**',
    sellerType: 'particular',
    categoryLabel: 'Verificação de dados do anúncio',
    allegation:
      'Fotos submetidas podem não corresponder à versão descrita no anúncio. Aguardando verificação de evidência.',
    reporterMasked: 'Comprador (ID protegido por LGPD)',
    reportedAt: '25/10/2026',
    statusLabel: 'Em análise',
    isUrgent: false,
    priorityLabel: 'Pendente',
    readOnlyNotice: 'Modo Leitura • Deliberação restrita ao terminal desktop',
  },
];

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
export function getReportById(id: string): ReportRecord | null {
  return mockReports.find((r) => r.id === id) ?? null;
}

export function formatVehiclePrice(brl: number): string {
  if (brl === 0) return '—';
  return `R$ ${brl.toLocaleString('pt-BR')}`;
}
