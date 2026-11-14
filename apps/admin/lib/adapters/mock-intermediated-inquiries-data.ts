import type {
  IntermediatedInquiryKpiSummary,
  IntermediatedInquiryRecord,
} from '../types/intermediated-inquiries-presentation';

export const INQUIRY_KPI_DATA: IntermediatedInquiryKpiSummary = {
  totalInquiries: 3,
  inMediationCount: 2,
  unregisteredOwnersCount: 3,
  staffAccessStatus: 'Condicional · DENY_PENDING',
};

export const mockIntermediatedInquiries: IntermediatedInquiryRecord[] = [
  {
    id: 'INQ-LEG-0021',
    advertisementId: 'LEG-2026-0007',
    vehicleTitle: 'Toyota Corolla 2021',
    vehiclePriceFormatted: 'R$ 109.900',
    vehicleImageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    ownerName: 'João Batista',
    hasOwnerAccount: false,
    ownerAccountNotice: 'Sem conta cadastrada na plataforma (Vendedor presencial da feira física)',
    buyerName: 'Lucas Ribeiro',
    representativeName: 'Main Admin — Feira de Carros',
    contactPhoneMasked: '(31) 9 0000-0000',
    status: 'IN_MEDIATION',
    statusLabel: 'Em mediação',
    lastMessageDate: '26/10/2026 às 16:40',
    conversationExcerpts: [
      {
        id: 'MSG-001',
        senderType: 'BUYER',
        senderName: 'Lucas Ribeiro',
        timestamp: '26/10/2026 às 16:30',
        content:
          'Olá! Tenho interesse no Toyota Corolla 2021 anunciado na feira. O veículo ainda está disponível para visita neste fim de semana em Ipatinga?',
      },
      {
        id: 'MSG-002',
        senderType: 'REPRESENTATIVE',
        senderName: 'Main Admin',
        senderRoleLabel: 'Representante Feira de Carros (Institucional)',
        timestamp: '26/10/2026 às 16:35',
        content:
          'Olá, Lucas! Sou o representante institucional da Feira de Carros. O veículo pertence ao Sr. João Batista, vendedor presencial da nossa feira. Estamos entrando em contato com o proprietário pelos canais autorizados para confirmar a disponibilidade de visita e retornaremos aqui com a resposta oficial.',
      },
      {
        id: 'MSG-003',
        senderType: 'BUYER',
        senderName: 'Lucas Ribeiro',
        timestamp: '26/10/2026 às 16:40',
        content:
          'Perfeito, fico no aguardo. Também gostaria de saber se aceita proposta à vista ou se avalia troca por um sedan seminovo.',
      },
      {
        id: 'MSG-004',
        senderType: 'SYSTEM_AUDIT',
        senderName: 'Sistema de Auditoria Institucional',
        timestamp: '26/10/2026 às 16:45',
        content:
          '[AUDITORIA INSTITUCIONAL] Contato estabelecido com o proprietário presencial João Batista via telefone institucional autorizado. Aguardando retorno com as condições de negociação.',
        isAuditMilestone: true,
      },
    ],
  },
  {
    id: 'INQ-LEG-0022',
    advertisementId: 'LEG-2026-0008',
    vehicleTitle: 'Honda HR-V 2020',
    vehiclePriceFormatted: 'R$ 98.500',
    vehicleImageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    ownerName: 'Marcos Silveira',
    hasOwnerAccount: false,
    ownerAccountNotice: 'Sem conta cadastrada na plataforma (Vendedor presencial da feira física)',
    buyerName: 'Fernanda Rocha',
    representativeName: 'Main Admin — Feira de Carros',
    contactPhoneMasked: '(31) 9 0000-0000',
    status: 'IN_MEDIATION',
    statusLabel: 'Em mediação',
    lastMessageDate: '25/10/2026 às 11:20',
    conversationExcerpts: [
      {
        id: 'MSG-101',
        senderType: 'BUYER',
        senderName: 'Fernanda Rocha',
        timestamp: '25/10/2026 às 11:10',
        content:
          'Bom dia! Gostaria de saber sobre a quilometragem e se o HR-V possui laudo cautelar aprovado.',
      },
      {
        id: 'MSG-102',
        senderType: 'REPRESENTATIVE',
        senderName: 'Main Admin',
        senderRoleLabel: 'Representante Feira de Carros (Institucional)',
        timestamp: '25/10/2026 às 11:20',
        content:
          'Olá, Fernanda! Encaminhamos sua consulta sobre a vistoria cautelar ao vendedor Marcos Silveira. Retornaremos em breve.',
      },
    ],
  },
  {
    id: 'INQ-LEG-0023',
    advertisementId: 'LEG-2026-0009',
    vehicleTitle: 'Fiat Strada Endurance 2023',
    vehiclePriceFormatted: 'R$ 82.000',
    vehicleImageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    ownerName: 'Antônio Carlos',
    hasOwnerAccount: false,
    ownerAccountNotice: 'Sem conta cadastrada na plataforma (Vendedor presencial da feira física)',
    buyerName: 'Bruno Almeida',
    representativeName: 'Main Admin — Feira de Carros',
    contactPhoneMasked: '(31) 9 0000-0000',
    status: 'AWAITING_CONTACT',
    statusLabel: 'Aguardando contato',
    lastMessageDate: '24/10/2026 às 14:15',
    conversationExcerpts: [
      {
        id: 'MSG-201',
        senderType: 'BUYER',
        senderName: 'Bruno Almeida',
        timestamp: '24/10/2026 às 14:15',
        content:
          'Boa tarde! A Fiat Strada ainda está disponível no pátio? Posso agendar vistoria para amanhã?',
      },
    ],
  },
];

export function getIntermediatedInquiryById(id: string): IntermediatedInquiryRecord | undefined {
  return mockIntermediatedInquiries.find((inq) => inq.id.toLowerCase() === id.toLowerCase());
}

export function listIntermediatedInquiries(): IntermediatedInquiryRecord[] {
  return [...mockIntermediatedInquiries];
}
