import type {
  AdminProfileRecord,
  ContactSettingsRecord,
  FeaturedAdvertisementRecord,
  LegalDocumentRecord,
  NotificationTemplateRecord,
} from '../types/content-settings-presentation';

export const mockFeaturedAdvertisements: FeaturedAdvertisementRecord[] = [
  {
    id: 'FC-2026-0142',
    vehicleTitle: 'Fiat Strada Endurance 2023',
    sellerName: 'Mariana Costa',
    sellerType: 'INDIVIDUAL',
    location: 'Ipatinga, MG',
    priceFormatted: 'R$ 82.900',
    imageThumbnail: '/images/vehicles/demo/fiat-strada-2023.jpg',
    status: 'ACTIVE',
    statusLabel: 'Elegível / Em exibição',
    boostPlan: 'BST-07D-001 (7 dias)',
    boostRemainingDays: 5,
    boostPaid: true,
    isSold: false,
    isApproved: true,
    eligibilityCriteria: {
      isApproved: true,
      isPaid: true,
      isActive: true,
      isUnsold: true,
    },
    slotPositionPreview: 1,
    rotationStatus: 'Rotação ativa na home (SEARCH-012)',
  },
  {
    id: 'FC-2026-0148',
    vehicleTitle: 'Chevrolet Onix LT 2022',
    sellerName: 'Carlos Eduardo',
    sellerType: 'INDIVIDUAL',
    location: 'Ipatinga, MG',
    priceFormatted: 'R$ 69.900',
    imageThumbnail: '/images/vehicles/demo/chevrolet-onix-2022.jpg',
    status: 'ACTIVE',
    statusLabel: 'Elegível / Em exibição',
    boostPlan: 'BST-07D-001 (7 dias)',
    boostRemainingDays: 3,
    boostPaid: true,
    isSold: false,
    isApproved: true,
    eligibilityCriteria: {
      isApproved: true,
      isPaid: true,
      isActive: true,
      isUnsold: true,
    },
    slotPositionPreview: 2,
    rotationStatus: 'Rotação ativa na home (SEARCH-012)',
  },
  {
    id: 'FC-2026-0152',
    vehicleTitle: 'Honda CG 160 2022',
    sellerName: 'Lucas Mendes',
    sellerType: 'INDIVIDUAL',
    location: 'Timóteo, MG',
    priceFormatted: 'R$ 16.900',
    imageThumbnail: '/images/vehicles/demo/honda-cg-160-2022.jpg',
    status: 'ACTIVE',
    statusLabel: 'Elegível / Em fila',
    boostPlan: 'BST-07D-001 (7 dias)',
    boostRemainingDays: 7,
    boostPaid: true,
    isSold: false,
    isApproved: true,
    eligibilityCriteria: {
      isApproved: true,
      isPaid: true,
      isActive: true,
      isUnsold: true,
    },
    slotPositionPreview: 3,
    rotationStatus: 'Em fila de rotação (SEARCH-012)',
  },
];

export const mockNotificationTemplates: NotificationTemplateRecord[] = [
  {
    id: 'TPL-MSG-01',
    name: 'Nova mensagem no anúncio',
    category: 'Comunicação',
    channels: ['EMAIL', 'PUSH'],
    status: 'ACTIVE',
    statusLabel: 'Ativo / Homologado',
    subject: 'Feira de Carros: Você recebeu uma nova mensagem sobre {{titulo_anuncio}}',
    bodyText:
      'Olá, {{nome_destinatario}}!\n\nVocê recebeu uma nova mensagem de um comprador interessado no seu veículo {{titulo_anuncio}}.\n\nPara responder com segurança, acesse a central de mensagens oficial da Feira de Carros pelo link abaixo.\n\nLembre-se: nunca compartilhe senhas, códigos SMS ou realize transferências financeiras fora do ambiente oficial.',
    variables: [
      '{{nome_destinatario}}',
      '{{titulo_anuncio}}',
      '{{nome_remetente}}',
      '{{link_mensagem}}',
    ],
    privacyLevel: 'LGPD Nível 1 - Somente primeiro nome e identificador do anúncio',
    lastModified: '28/10/2026 14:15 por Main Admin',
  },
  {
    id: 'TPL-SAVE-02',
    name: 'Busca salva: novo veículo compatível',
    category: 'Alertas',
    channels: ['EMAIL', 'PUSH'],
    status: 'ACTIVE',
    statusLabel: 'Ativo / Homologado',
    subject: 'Novo veículo no radar: {{titulo_anuncio}} em {{cidade_veiculo}}',
    bodyText:
      'Olá, {{nome_destinatario}}!\n\nUm novo anúncio compatível com o seu alerta de busca foi publicado no pátio da Feira de Carros:\n\nVeículo: {{titulo_anuncio}}\nPreço: {{preco_veiculo}}\nLocalidade: {{cidade_veiculo}}\n\nConfira os detalhes e fotos do veículo antes que ele seja reservado.',
    variables: [
      '{{nome_destinatario}}',
      '{{titulo_anuncio}}',
      '{{preco_veiculo}}',
      '{{cidade_veiculo}}',
      '{{link_anuncio}}',
    ],
    privacyLevel: 'LGPD Nível 1 - Preferências de busca auditadas sem dados sensíveis',
    lastModified: '25/10/2026 11:30 por Main Admin',
  },
  {
    id: 'TPL-EXP-03',
    name: 'Expiração iminente de anúncio',
    category: 'Ciclo de Anúncio',
    channels: ['EMAIL', 'PUSH'],
    status: 'ACTIVE',
    statusLabel: 'Ativo / Homologado',
    subject: 'Aviso: seu anúncio {{codigo_anuncio}} expirará em {{dias_restantes}} dias',
    bodyText:
      'Olá, {{nome_destinatario}}!\n\nInformamos que o período de veiculação do anúncio {{codigo_anuncio}} ({{titulo_anuncio}}) se encerrará em {{dias_restantes}} dias.\n\nCaso o veículo ainda não tenha sido negociado, você poderá renovar a veiculação com um novo plano pelo painel administrativo.\n\nSe o veículo já foi vendido, lembre-se de marcar o anúncio como vendido para manter seu histórico positivo.',
    variables: [
      '{{nome_destinatario}}',
      '{{codigo_anuncio}}',
      '{{titulo_anuncio}}',
      '{{dias_restantes}}',
      '{{link_renovacao}}',
    ],
    privacyLevel: 'LGPD Nível 1 - Notificação transacional operacional',
    lastModified: '22/10/2026 09:40 por Main Admin',
  },
  {
    id: 'TPL-PAY-04',
    name: 'Confirmação de pagamento',
    category: 'Financeiro',
    channels: ['EMAIL', 'PUSH'],
    status: 'ACTIVE',
    statusLabel: 'Ativo / Homologado',
    subject: 'Pagamento confirmado: Protocolo {{protocolo_pagamento}}',
    bodyText:
      'Olá, {{nome_destinatario}}!\n\nConfirmamos a aprovação do pagamento referente ao plano {{nome_plano}} do anúncio {{codigo_anuncio}}.\n\nValor recebido: {{valor_formatado}}\nProtocolo de liquidação: {{protocolo_pagamento}}\n\nSeu anúncio já está disponível publicamente para milhares de compradores da região.',
    variables: [
      '{{nome_destinatario}}',
      '{{protocolo_pagamento}}',
      '{{nome_plano}}',
      '{{codigo_anuncio}}',
      '{{valor_formatado}}',
    ],
    privacyLevel: 'LGPD Nível 2 - Mascaramento obrigatório de dados de pagamento',
    lastModified: '20/10/2026 16:50 por Main Admin',
  },
  {
    id: 'TPL-DISP-05',
    name: 'Contestação de pagamento / Chargeback',
    category: 'Financeiro',
    channels: ['EMAIL'],
    status: 'ACTIVE',
    statusLabel: 'Ativo / Homologado',
    subject: 'Notificação de contestação financeira: Protocolo {{protocolo_contestacao}}',
    bodyText:
      'Prezado(a) {{nome_destinatario}},\n\nRegistramos uma notificação de contestação financeira emitida pela operadora de pagamento a respeito da transação {{protocolo_pagamento}}.\n\nPara assegurar a conformidade da sua conta e regularizar a situação dentro do prazo de 3 dias úteis, acesse os detalhes do protocolo pelo link abaixo.\n\nCaso tenha dúvidas, nossa equipe de suporte está à disposição.',
    variables: [
      '{{nome_destinatario}}',
      '{{protocolo_contestacao}}',
      '{{protocolo_pagamento}}',
      '{{prazo_defesa}}',
      '{{link_contestacao}}',
    ],
    privacyLevel: 'LGPD Nível 3 - Canal restrito a titular com autenticação em dois fatores',
    lastModified: '18/10/2026 18:20 por Main Admin',
  },
];

export const mockContactSettings: ContactSettingsRecord = {
  officialEmail: 'suporte@feiradecarros.com.br',
  emailStatus: 'Pendente de validação de domínio MX/SPF/DKIM (@feiradecarros.com.br)',
  officialPhone: '0800 000 0000 / (31) 3820-0000',
  phoneStatus: 'Aguardando contratação e homologação de linha VoIP institucional',
  businessHours: 'Segunda a Sexta-feira, das 08h00 às 18h00 (Horário de Brasília)',
  hoursStatus: 'Proposta preliminar — Sujeita a validação com equipe de atendimento',
  headquartersCity: 'Ipatinga',
  headquartersState: 'MG',
  physicalAddress: 'Av. Pedro Linhares Gomes, Centro Comercial — Ipatinga, MG',
  addressStatus: 'Ponto de atendimento presencial em fase de regularização contratual',
  supportRoutingLevel: 'N1 Triagem Comercial / N2 Atendimento Jurídico e Moderação',
  permissionRequired: 'Exclusivo Main Admin — Acesso restrito para Support e Sales',
};

export const mockLegalDocuments: LegalDocumentRecord[] = [
  {
    id: 'LEGAL-TERMS',
    title: 'Termos e Condições Gerais de Uso da Plataforma',
    version: 'v0.1 (Demonstração / Rascunho Inicial)',
    language: 'pt-BR (Português do Brasil)',
    status: 'DRAFT_PENDING_APPROVAL',
    statusLabel: 'Rascunho v0.1 — Parecer Jurídico Pendente',
    lastRevised: '28/10/2026 às 15:30 por Main Admin',
    effectiveDate: 'Pendente de publicação no lançamento oficial V1',
    summary:
      'Regula o acesso, cadastramento de usuários particulares e lojistas, publicação de anúncios, planos comerciais, cobrança de taxas de destaque e regras de conduta na plataforma Feira de Carros.',
    sections: [
      {
        id: 'SEC-01',
        title: '1. Objeto e Natureza da Plataforma',
        excerpt:
          'A Feira de Carros é uma plataforma tecnológica de classificados que conecta compradores e vendedores de veículos automotores. A plataforma não é proprietária dos veículos anunciados e não atua como compradora ou vendedora direta das mercadorias, ressalvados serviços de intermediação contratados.',
      },
      {
        id: 'SEC-02',
        title: '2. Cadastro, Veracidade e Responsabilidade dos Anunciantes',
        excerpt:
          'Os anunciantes declaram sob as penas da lei a veracidade das informações veiculares cadastradas (ano, quilometragem, histórico de sinistro e restrições financeiras). Anúncios com divergência de chassi ou titularidade serão bloqueados pela moderação.',
      },
      {
        id: 'SEC-03',
        title: '3. Planos Comerciais e Taxas de Destaque',
        excerpt:
          'A contratação de planos de veiculação (30 ou 60 dias) e destaques (7 dias) não garante a realização da venda nem confere garantia de primeira colocação nos resultados de busca, que seguem critérios dinâmicos de relevância e data.',
      },
      {
        id: 'SEC-04',
        title: '4. Direito de Arrependimento e Reembolsos',
        excerpt:
          'Em conformidade com o Artigo 49 do Código de Defesa do Consumidor, o contratante de serviços digitais que não tenha usufruído integralmente do serviço poderá solicitar cancelamento no prazo legal de 7 (sete) dias corridos a partir da contratação.',
      },
    ],
    auditTrail: [
      {
        date: '28/10/2026 15:30',
        actor: 'Main Admin',
        action:
          'Atualização do rascunho com cláusula de CDC Art. 49 e exclusão de renovação automática.',
      },
      {
        date: '15/10/2026 10:00',
        actor: 'Main Admin',
        action: 'Criação do rascunho v0.1 inicial dos Termos de Uso.',
      },
    ],
  },
  {
    id: 'LEGAL-PRIVACY',
    title: 'Política de Privacidade e Proteção de Dados Pessoais (LGPD)',
    version: 'v0.1 (Demonstração / Rascunho Inicial)',
    language: 'pt-BR (Português do Brasil)',
    status: 'DRAFT_PENDING_APPROVAL',
    statusLabel: 'Rascunho v0.1 — Parecer Jurídico Pendente',
    lastRevised: '28/10/2026 às 16:15 por Main Admin',
    effectiveDate: 'Pendente de publicação no lançamento oficial V1',
    summary:
      'Estabelece as diretrizes de tratamento, coleta, retenção legal, minimização e direitos dos titulares de dados pessoais na Feira de Carros, em conformidade com a Lei nº 13.709/2018 (LGPD).',
    sections: [
      {
        id: 'SEC-P01',
        title: '1. Bases Legais e Finalidades do Tratamento',
        excerpt:
          'Tratamos dados pessoais exclusivamente para: execução de contrato (anúncios e planos), cumprimento de obrigação legal e regulatória (Marco Civil da Internet e obrigações fiscais), e legítimo interesse para prevenção a fraudes.',
      },
      {
        id: 'SEC-P02',
        title: '2. Minimização e Mascaramento de Dados Sensíveis',
        excerpt:
          'Dados cadastrais como CPF, CNPJ, dados bancários e endereço físico do anunciante não são exibidos publicamente na plataforma aberta, sendo protegidos por controles rígidos de RBAC com perfis restritos de acesso.',
      },
      {
        id: 'SEC-P03',
        title: '3. Solicitações de Exclusão e Prazos de Retenção',
        excerpt:
          'O titular possui o direito de solicitar a eliminação dos seus dados pessoais. A exclusão de contas acarreta a desativação de anúncios públicos, contudo registros de auditoria, logs de conexão e comprovantes fiscais serão retidos pelos prazos prescricionais legais.',
      },
      {
        id: 'SEC-P04',
        title: '4. Canal de Atendimento do Encarregado (DPO)',
        excerpt:
          'O titular de dados poderá exercer seus direitos de confirmação, acesso, correção ou eliminação através do canal oficial do Encarregado de Proteção de Dados: privacidade@feiradecarros.com.br.',
      },
    ],
    auditTrail: [
      {
        date: '28/10/2026 16:15',
        actor: 'Main Admin',
        action:
          'Inclusão da tabela de retenção de logs conforme Marco Civil da Internet (Art. 15).',
      },
      {
        date: '15/10/2026 11:20',
        actor: 'Main Admin',
        action: 'Criação do rascunho v0.1 inicial da Política de Privacidade.',
      },
    ],
  },
];

export const mockAdminProfile: AdminProfileRecord = {
  id: 'ADM-DEMO-0001',
  name: 'Admin principal',
  role: 'Main Admin',
  roleBadge: 'Acesso Total (Backoffice)',
  emailMasked: 'a***@exemplo.com',
  location: 'Ipatinga, MG',
  assignedUnit: 'Pátio Central Ipatinga — Vale do Aço',
  lastLogin: '15/11/2026 às 12:00',
  sessionStatus: 'Sessão Local Ativa (Demonstração)',
  mfaStatus: 'Autenticação Obrigatória em Produção (MFA Pendente)',
};
