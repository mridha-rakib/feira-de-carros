import type {
  CustomerCorrectionKpiSummary,
  CustomerCorrectionRecord,
} from '../types/customer-corrections-presentation';

export const CUSTOMER_CORRECTION_KPIS: CustomerCorrectionKpiSummary = {
  totalRequests: 3,
  underReviewCount: 2,
  sensitivePendingCount: 1,
  reviewerRole: 'Main Admin',
};

export const mockCustomerCorrections: CustomerCorrectionRecord[] = [
  {
    id: 'COR-DEMO-0042',
    customerName: 'Mariana Costa',
    accountId: 'USR-2026-0042',
    accountType: 'Vendedora individual',
    fieldType: 'TELEPHONE',
    fieldLabel: 'Telefone',
    currentValueMasked: '(31) 9****-**42',
    requestedValueMasked: '(31) 9****-**18',
    status: 'IN_REVIEW',
    statusLabel: 'Em análise',
    date: '26/10/2026',
    justification: 'Troca de número corporativo para atendimento de compradores da plataforma.',
    identityVerificationStatus:
      'Documento de identidade e selfie confirmados no onboarding inicial.',
    isSensitive: true,
    permissionStatus: 'DENY_PENDING (Support) · Autorizado (Main Admin)',
    notes:
      'Solicitação aguarda aprovação de segurança do Main Admin para atualização do contato público de anúncios.',
  },
  {
    id: 'COR-DEMO-0043',
    customerName: 'Bruno Almeida',
    accountId: 'USR-2026-0043',
    accountType: 'Vendedor individual',
    fieldType: 'LOCALITY',
    fieldLabel: 'Localidade',
    currentValueMasked: 'Ipatinga - MG (Bairro Canaã)',
    requestedValueMasked: 'Ipatinga - MG (Bairro Cidade Nobre)',
    status: 'IN_REVIEW',
    statusLabel: 'Em análise',
    date: '25/10/2026',
    justification: 'Mudança de endereço residencial e ponto de vistoria de veículos.',
    identityVerificationStatus: 'Comprovante de residência recente anexado ao dossiê.',
    isSensitive: false,
    permissionStatus: 'Triagem Support permitida · Aprovação final Main Admin',
    notes: 'Atualização cadastral padrão sem impacto em dados fiscais ou bancários.',
  },
  {
    id: 'COR-DEMO-0044',
    customerName: 'Vale Auto Veículos',
    accountId: 'USR-2026-0044',
    accountType: 'Concessionária (Pessoa Jurídica)',
    fieldType: 'CNPJ_DOCUMENT',
    fieldLabel: 'CNPJ restrito',
    currentValueMasked: '12.***.***/0001-**',
    requestedValueMasked: '12.***.***/0002-** (Filial)',
    status: 'PENDING_EVIDENCE',
    statusLabel: 'Correção pendente',
    date: '24/10/2026',
    justification:
      'Transferência de faturamento e anúncios para nova filial localizada em Timóteo.',
    identityVerificationStatus:
      'Contrato social e cartão CNPJ da filial pendentes de conferência da junta comercial.',
    isSensitive: true,
    permissionStatus: 'Bloqueado (HOLD) · Exclusivo Main Admin',
    notes:
      'Operação de alta sensibilidade fiscal. Não autorizar antes de conferência formal na Receita Federal.',
  },
];

export function getCustomerCorrectionById(id: string): CustomerCorrectionRecord | undefined {
  return mockCustomerCorrections.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function listCustomerCorrections(): CustomerCorrectionRecord[] {
  return [...mockCustomerCorrections];
}
