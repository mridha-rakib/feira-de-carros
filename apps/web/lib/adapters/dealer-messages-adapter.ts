/**
 * Dealership Messages Adapter
 * Deterministic presentation data for Dealership Messaging Console (WEB-045, WEB-046, WEB-048).
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES
 * Strictly isolated from Individual Seller (Mariana Silva) and Buyer accounts.
 */

export interface DealerMessageItem {
  id: string;
  sender: 'buyer' | 'dealer';
  senderName: string;
  text: string;
  time: string;
}

export interface DealerConversation {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerInitials: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleSubtitle: string;
  vehiclePlate: string;
  vehiclePriceFormatted: string;
  vehicleImageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'locked';
  lockedReason?: string;
  isBlocked?: boolean;
  blockReason?: string;
  messages: DealerMessageItem[];
  isMockData: true;
}

export const MOCK_DEALER_CONVERSATIONS: DealerConversation[] = [
  {
    id: 'DLR-CONV-001',
    buyerId: 'BUYER-DLR-01',
    buyerName: 'Carlos Eduardo Menezes',
    buyerInitials: 'CM',
    vehicleId: 'dlr-veh-001',
    vehicleTitle: 'Honda Civic 2.0 EXL 2022',
    vehicleSubtitle: 'Automático · 28.500 km · Flex',
    vehiclePlate: 'BRA2E19',
    vehiclePriceFormatted: 'R$ 124.900',
    vehicleImageUrl: '/images/vehicles/demo/sedan-fallback.svg',
    lastMessage: 'Perfeito! Gostaria de agendar para ver o Civic no sábado às 10h.',
    lastMessageTime: '10:45',
    unreadCount: 2,
    status: 'active',
    messages: [
      {
        id: 'DLR-MSG-001',
        sender: 'buyer',
        senderName: 'Carlos Eduardo Menezes',
        text: 'Olá! O Civic 2.0 EXL anunciado por R$ 124.900 ainda está disponível no showroom?',
        time: '09:30',
      },
      {
        id: 'DLR-MSG-002',
        sender: 'dealer',
        senderName: 'Líder Veículos Seminovos',
        text: 'Olá, Carlos! Sim, o Honda Civic está disponível em nossa loja no Horto em Ipatinga com laudo cautelar 100% aprovado.',
        time: '09:42',
      },
      {
        id: 'DLR-MSG-003',
        sender: 'buyer',
        senderName: 'Carlos Eduardo Menezes',
        text: 'Vocês aceitam veículo usado na troca com avaliação prévia?',
        time: '09:55',
      },
      {
        id: 'DLR-MSG-004',
        sender: 'dealer',
        senderName: 'Líder Veículos Seminovos',
        text: 'Com certeza! Trabalhamos com avaliação justa na troca e temos as melhores taxas bancárias parceiras. Deseja agendar um test-drive?',
        time: '10:15',
      },
      {
        id: 'DLR-MSG-005',
        sender: 'buyer',
        senderName: 'Carlos Eduardo Menezes',
        text: 'Perfeito! Gostaria de agendar para ver o Civic no sábado às 10h.',
        time: '10:45',
      },
    ],
    isMockData: true,
  },
  {
    id: 'DLR-CONV-002',
    buyerId: 'BUYER-DLR-02',
    buyerName: 'Camila Fernandes Rocha',
    buyerInitials: 'CR',
    vehicleId: 'dlr-veh-002',
    vehicleTitle: 'Toyota Corolla 2.0 XEi 2021',
    vehicleSubtitle: 'Automático · 42.300 km · Flex',
    vehiclePlate: 'RIO4A88',
    vehiclePriceFormatted: 'R$ 119.900',
    vehicleImageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    lastMessage: 'O carro possui manual e chave reserva com garantia de concessionária?',
    lastMessageTime: '08:20',
    unreadCount: 1,
    status: 'active',
    messages: [
      {
        id: 'DLR-MSG-010',
        sender: 'buyer',
        senderName: 'Camila Fernandes Rocha',
        text: 'Bom dia! Gostei muito do Corolla XEi. O carro possui manual e chave reserva com garantia de concessionária?',
        time: '08:20',
      },
    ],
    isMockData: true,
  },
  {
    id: 'DLR-CONV-003',
    buyerId: 'BUYER-DLR-03',
    buyerName: 'Lucas Barbosa Duarte',
    buyerInitials: 'LD',
    vehicleId: 'dlr-veh-003',
    vehicleTitle: 'Chevrolet Onix 1.0 Turbo Premier 2022',
    vehicleSubtitle: 'Automático · 35.000 km · Flex',
    vehiclePlate: 'SPX9F44',
    vehiclePriceFormatted: 'R$ 89.900',
    vehicleImageUrl: '/images/vehicles/demo/chevrolet-onix-2022.jpg',
    lastMessage: 'Obrigado pelo retorno. Vou verificar o financiamento com meu banco e aviso.',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    status: 'active',
    messages: [
      {
        id: 'DLR-MSG-020',
        sender: 'buyer',
        senderName: 'Lucas Barbosa Duarte',
        text: 'Olá! Este Onix Premier aceita entrada de 50% e o restante financiado?',
        time: 'Ontem 14:10',
      },
      {
        id: 'DLR-MSG-021',
        sender: 'dealer',
        senderName: 'Líder Veículos Seminovos',
        text: 'Olá, Lucas! Sim, trabalhamos com planos de 50% de entrada e parcelamento em até 48x. Se quiser, podemos simular sem compromisso.',
        time: 'Ontem 14:35',
      },
      {
        id: 'DLR-MSG-022',
        sender: 'buyer',
        senderName: 'Lucas Barbosa Duarte',
        text: 'Obrigado pelo retorno. Vou verificar o financiamento com meu banco e aviso.',
        time: 'Ontem 15:02',
      },
    ],
    isMockData: true,
  },
];
