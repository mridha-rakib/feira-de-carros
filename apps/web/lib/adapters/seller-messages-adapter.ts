import type { Conversation } from '../types/seller-presentation';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'CONV-001',
    buyerId: 'BUYER-0891',
    buyerName: 'Carlos Eduardo',
    buyerInitials: 'CE',
    vehicleId: 'FC-2026-0042',
    vehicleTitle: 'Volkswagen Nivus Highline 2023',
    vehicleSubtitle: '1.0 200 TSI Automático • 32.000 km',
    vehiclePriceFormatted: 'R$ 109.900,00',
    vehicleLocation: 'Ipatinga / MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Ficou ótimo, obrigado! Podemos ver o carro no sábado pela manhã?',
    lastMessageTime: '10:42',
    unreadCount: 3,
    status: 'active',
    messages: [
      {
        id: 'MSG-001',
        sender: 'buyer',
        senderName: 'Carlos Eduardo',
        text: 'Olá! Tenho interesse no seu Nivus. O carro ainda está disponível?',
        time: '09:41',
      },
      {
        id: 'MSG-002',
        sender: 'seller',
        senderName: 'Mariana Silva',
        text: 'Olá, Carlos! Sim, o veículo está disponível. Tem interesse em agendar uma visita?',
        time: '09:47',
      },
      {
        id: 'MSG-003',
        sender: 'buyer',
        senderName: 'Carlos Eduardo',
        text: 'Ótimo! Poderia enviar mais fotos do interior do veículo?',
        time: '09:50',
      },
      {
        id: 'MSG-004',
        sender: 'seller',
        senderName: 'Mariana Silva',
        text: 'Aqui estão algumas fotos do interior.',
        time: '10:03',
        photos: [
          '/images/vehicles/demo/web027-thumb1.png',
          '/images/vehicles/demo/web027-thumb2.png',
          '/images/vehicles/demo/web028-thumb1.png',
        ],
      },
      {
        id: 'MSG-005',
        sender: 'buyer',
        senderName: 'Carlos Eduardo',
        text: 'Ficou ótimo, obrigado! Podemos ver o carro no sábado pela manhã?',
        time: '10:27',
      },
    ],
    isMockData: true,
  },
  {
    id: 'CONV-002',
    buyerId: 'BUYER-0892',
    buyerName: 'Mariana Santos',
    buyerInitials: 'MS',
    vehicleId: 'FC-2026-0042',
    vehicleTitle: 'Volkswagen Nivus Highline 2023',
    vehicleSubtitle: '1.0 200 TSI Automático • 32.000 km',
    vehiclePriceFormatted: 'R$ 109.900,00',
    vehicleLocation: 'Ipatinga / MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Olá! Aceita proposta de troca em outro veículo?',
    lastMessageTime: '09:15',
    unreadCount: 1,
    status: 'active',
    messages: [
      {
        id: 'MSG-010',
        sender: 'buyer',
        senderName: 'Mariana Santos',
        text: 'Olá! Aceita proposta de troca em outro veículo?',
        time: '09:15',
      },
    ],
    isMockData: true,
  },
  {
    id: 'CONV-003',
    buyerId: 'BUYER-0893',
    buyerName: 'Rafael Oliveira',
    buyerInitials: 'RO',
    vehicleId: 'FC-2026-0151',
    vehicleTitle: 'Volkswagen Polo Track 2023',
    vehicleSubtitle: '1.0 MPI Flex Manual • 28.500 km',
    vehiclePriceFormatted: 'R$ 74.900,00',
    vehicleLocation: 'Ipatinga / MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Boa tarde, qual a quilometragem atual do Polo?',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    status: 'active',
    messages: [
      {
        id: 'MSG-020',
        sender: 'buyer',
        senderName: 'Rafael Oliveira',
        text: 'Boa tarde, qual a quilometragem atual do Polo?',
        time: 'Ontem',
      },
      {
        id: 'MSG-021',
        sender: 'seller',
        senderName: 'Mariana Silva',
        text: 'Olá Rafael! Está exatamente com 28.500 km rodados.',
        time: 'Ontem',
      },
    ],
    isMockData: true,
  },
  {
    id: 'CONV-004',
    buyerId: 'BUYER-0894',
    buyerName: 'Ana Paula Ribeiro',
    buyerInitials: 'AR',
    vehicleId: 'FC-2026-0042',
    vehicleTitle: 'Volkswagen Nivus Highline 2023',
    vehicleSubtitle: '1.0 200 TSI Automático • 32.000 km',
    vehiclePriceFormatted: 'R$ 109.900,00',
    vehicleLocation: 'Ipatinga / MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'O carro possui todas as revisões feitas na concessionária?',
    lastMessageTime: '23 out',
    unreadCount: 0,
    status: 'active',
    messages: [
      {
        id: 'MSG-030',
        sender: 'buyer',
        senderName: 'Ana Paula Ribeiro',
        text: 'O carro possui todas as revisões feitas na concessionária?',
        time: '23 out',
      },
    ],
    isMockData: true,
  },
  {
    id: 'CONV-005',
    buyerId: 'BUYER-0895',
    buyerName: 'Bruno Mendes',
    buyerInitials: 'BM',
    vehicleId: 'FC-2026-0151',
    vehicleTitle: 'Volkswagen Polo Track 2023',
    vehicleSubtitle: '1.0 MPI Flex Manual • 28.500 km',
    vehiclePriceFormatted: 'R$ 74.900,00',
    vehicleLocation: 'Ipatinga / MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Consegue fazer um desconto se o pagamento for à vista via Pix?',
    lastMessageTime: '22 out',
    unreadCount: 0,
    status: 'active',
    messages: [
      {
        id: 'MSG-040',
        sender: 'buyer',
        senderName: 'Bruno Mendes',
        text: 'Consegue fazer um desconto se o pagamento for à vista via Pix?',
        time: '22 out',
      },
    ],
    isMockData: true,
  },
  {
    id: 'CONV-006',
    buyerId: 'BUYER-0896',
    buyerName: 'Felipe Costa',
    buyerInitials: 'FC',
    vehicleId: 'FC-2026-0042',
    vehicleTitle: 'Volkswagen Nivus Highline 2023',
    vehicleSubtitle: '1.0 200 TSI Automático • 32.000 km',
    vehiclePriceFormatted: 'R$ 109.900,00',
    vehicleLocation: 'Ipatinga / MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'O laudo cautelar está aprovado e disponível para consulta?',
    lastMessageTime: '21 out',
    unreadCount: 0,
    status: 'active',
    messages: [
      {
        id: 'MSG-050',
        sender: 'buyer',
        senderName: 'Felipe Costa',
        text: 'O laudo cautelar está aprovado e disponível para consulta?',
        time: '21 out',
      },
    ],
    isMockData: true,
  },
];

export function getConversations(filters?: {
  tab?: 'all' | 'unread' | 'archived';
  search?: string;
}): Conversation[] {
  let result = [...MOCK_CONVERSATIONS];

  if (filters?.tab === 'unread') {
    result = result.filter((c) => c.unreadCount > 0);
  } else if (filters?.tab === 'archived') {
    result = result.filter((c) => c.status === 'archived');
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.buyerName.toLowerCase().includes(q) ||
        c.vehicleTitle.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }

  return result;
}

export function getConversationById(id: string): Conversation | undefined {
  if (!id) return undefined;
  return MOCK_CONVERSATIONS.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getConversationMessages(conversationId: string) {
  const conv = getConversationById(conversationId);
  return conv ? [...conv.messages] : [];
}

export function getUnreadMessagesCount(): number {
  return MOCK_CONVERSATIONS.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
}
