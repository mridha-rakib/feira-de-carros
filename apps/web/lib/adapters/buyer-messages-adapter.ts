/**
 * Buyer Messages Adapter (Batch B5 - Buyer Messaging & Safety)
 * Implements deterministic mock data, thread management, safety reporting, and blocking.
 *
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES
 * - BUYER / WEB-012 (Inbox): Desktop 1168:202, Mobile 1168:266
 * - BUYER / WEB-013 (Active Conversation): Desktop 1168:310, Mobile 1168:369
 * - BUYER / WEB-014 (Start Conversation from Listing): Desktop 1168:419, Mobile 1168:458
 * - BUYER / WEB-015 (Login Required State): Desktop 1168:488, Mobile 1168:527
 * - BUYER / WEB-016 (Empty Inbox State): Desktop 1168:557, Mobile 1168:590
 * - BUYER / WEB-017 (Report & Block): Desktop 1168:614, Mobile 1168:658
 * - BUYER / WEB-018 (Read Only / Blocked / Sold Listing): Desktop 1168:693, Mobile 1168:746
 * - BUYER / WEB-019 (Team Mediated Conversation): Desktop 1168:790, Mobile 1168:846
 *
 * In accordance with AGENTS.md:
 * - FRONTEND ONLY. No real backend DB, WebSocket, or moderation APIs.
 * - Private seller PII and direct phone harvesting barriers are preserved.
 * - Clear provenance tags (DEMO DATA).
 */

export interface BuyerChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system' | 'staff';
  senderName: string;
  text: string;
  time: string;
  timestamp: number;
  isRead?: boolean;
}

export interface BuyerConversation {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerInitials: string;
  sellerType: 'particular' | 'concessionaria' | 'staff';
  sellerAvatarUrl?: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleSubtitle: string;
  vehiclePriceFormatted: string;
  vehicleLocation: string;
  vehicleImageUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked' | 'sold';
  isMediated?: boolean;
  isBlocked?: boolean;
  isSold?: boolean;
  messages: BuyerChatMessage[];
  isMockData: true;
}

export interface SafetyReportInput {
  conversationId: string;
  reason: 'fraude' | 'indisponivel' | 'sinal_antecipado' | 'ofensivo' | 'outro';
  details?: string;
  blockSeller: boolean;
}

export const INITIAL_BUYER_CONVERSATIONS: BuyerConversation[] = [
  {
    id: 'conv-corolla-carlos',
    sellerId: 'SELLER-2026-0042',
    sellerName: 'Carlos Eduardo Mendes',
    sellerInitials: 'CM',
    sellerType: 'particular',
    vehicleId: 'veh-corolla-2021',
    vehicleTitle: 'Toyota Corolla XEi 2.0',
    vehicleSubtitle: '2021/2022 · 45.000 km · Flex · Ipatinga, MG',
    vehiclePriceFormatted: 'R$ 112.900,00',
    vehicleLocation: 'Ipatinga, MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Ficou ótimo, obrigado! Podemos ver o carro no sábado pela manhã?',
    lastMessageTime: '10:42',
    unreadCount: 2,
    status: 'active',
    isMediated: false,
    isBlocked: false,
    messages: [
      {
        id: 'msg-001',
        sender: 'buyer',
        senderName: 'João Silva',
        text: 'Olá Carlos! Tenho interesse no seu Corolla. O veículo ainda está disponível?',
        time: '09:41',
        timestamp: Date.now() - 3600000 * 3,
        isRead: true,
      },
      {
        id: 'msg-002',
        sender: 'seller',
        senderName: 'Carlos Eduardo Mendes',
        text: 'Olá João! Sim, o carro está disponível e com todas as revisões em dia.',
        time: '09:48',
        timestamp: Date.now() - 3600000 * 2.8,
        isRead: true,
      },
      {
        id: 'msg-003',
        sender: 'buyer',
        senderName: 'João Silva',
        text: 'Excelente. A documentação do IPVA 2026 já está quitada?',
        time: '10:15',
        timestamp: Date.now() - 3600000 * 2.2,
        isRead: true,
      },
      {
        id: 'msg-004',
        sender: 'seller',
        senderName: 'Carlos Eduardo Mendes',
        text: 'Sim, IPVA 2026 100% pago e sem multas. Tem laudo cautelar aprovado.',
        time: '10:30',
        timestamp: Date.now() - 3600000 * 1.5,
        isRead: false,
      },
      {
        id: 'msg-005',
        sender: 'seller',
        senderName: 'Carlos Eduardo Mendes',
        text: 'Ficou ótimo, obrigado! Podemos ver o carro no sábado pela manhã?',
        time: '10:42',
        timestamp: Date.now() - 3600000 * 1.2,
        isRead: false,
      },
    ],
    isMockData: true,
  },
  {
    id: 'conv-creta-mariana',
    sellerId: 'SELLER-2026-0089',
    sellerName: 'Mariana Silva',
    sellerInitials: 'MS',
    sellerType: 'particular',
    vehicleId: 'veh-creta-2022',
    vehicleTitle: 'Hyundai Creta Prestige 2.0',
    vehicleSubtitle: '2022/2022 · 31.000 km · Flex · Ipatinga, MG',
    vehiclePriceFormatted: 'R$ 104.900,00',
    vehicleLocation: 'Ipatinga, MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Perfeito! Envio a foto do manual no final da tarde.',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    status: 'active',
    isMediated: false,
    isBlocked: false,
    messages: [
      {
        id: 'msg-creta-01',
        sender: 'buyer',
        senderName: 'João Silva',
        text: 'Boa tarde Mariana! O Creta possui garantia de fábrica ativa?',
        time: '14:20',
        timestamp: Date.now() - 86400000,
        isRead: true,
      },
      {
        id: 'msg-creta-02',
        sender: 'seller',
        senderName: 'Mariana Silva',
        text: 'Boa tarde! Sim, possui garantia até outubro de 2027.',
        time: '14:35',
        timestamp: Date.now() - 86400000 + 900000,
        isRead: true,
      },
      {
        id: 'msg-creta-03',
        sender: 'seller',
        senderName: 'Mariana Silva',
        text: 'Perfeito! Envio a foto do manual no final da tarde.',
        time: '14:40',
        timestamp: Date.now() - 86400000 + 1200000,
        isRead: true,
      },
    ],
    isMockData: true,
  },
  {
    id: 'conv-civic-autocar',
    sellerId: 'DEALER-2026-0001',
    sellerName: 'AutoCar Multimarcas',
    sellerInitials: 'AC',
    sellerType: 'concessionaria',
    vehicleId: 'veh-civic-2022',
    vehicleTitle: 'Honda Civic Touring 1.5 Turbo',
    vehicleSubtitle: '2021/2021 · 38.000 km · Gasolina · Coronel Fabriciano, MG',
    vehiclePriceFormatted: 'R$ 138.900,00',
    vehicleLocation: 'Coronel Fabriciano, MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Temos opções de financiamento com taxa especial para este modelo.',
    lastMessageTime: '15/05',
    unreadCount: 1,
    status: 'active',
    isMediated: false,
    isBlocked: false,
    messages: [
      {
        id: 'msg-civic-01',
        sender: 'buyer',
        senderName: 'João Silva',
        text: 'Olá! Aceitam carro na troca na compra deste Civic?',
        time: '11:10',
        timestamp: Date.now() - 86400000 * 2,
        isRead: true,
      },
      {
        id: 'msg-civic-02',
        sender: 'seller',
        senderName: 'AutoCar Multimarcas',
        text: 'Olá João! Sim, avaliamos seu veículo na troca mediante vistoria técnica.',
        time: '11:22',
        timestamp: Date.now() - 86400000 * 2 + 720000,
        isRead: true,
      },
      {
        id: 'msg-civic-03',
        sender: 'seller',
        senderName: 'AutoCar Multimarcas',
        text: 'Temos opções de financiamento com taxa especial para este modelo.',
        time: '11:25',
        timestamp: Date.now() - 86400000 * 2 + 900000,
        isRead: false,
      },
    ],
    isMockData: true,
  },
  {
    id: 'conv-mediada-compass',
    sellerId: 'STAFF-FEIRA-01',
    sellerName: 'Equipe Feira de Carros',
    sellerInitials: 'FC',
    sellerType: 'staff',
    vehicleId: 'veh-compass-2021-sold',
    vehicleTitle: 'Jeep Compass Limited 2021',
    vehicleSubtitle: '2021/2021 · 42.000 km · Flex · Ipatinga, MG',
    vehiclePriceFormatted: 'R$ 129.900,00',
    vehicleLocation: 'Ipatinga, MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'A mediação oficial foi concluída com sucesso. Obrigado pela cooperação.',
    lastMessageTime: '10/05',
    unreadCount: 0,
    status: 'active',
    isMediated: true,
    isBlocked: false,
    messages: [
      {
        id: 'msg-med-01',
        sender: 'staff',
        senderName: 'Equipe Feira de Carros (Mediação)',
        text: 'Olá João! Este canal foi iniciado para mediação técnica sobre o agendamento de vistoria do Jeep Compass.',
        time: '09:00',
        timestamp: Date.now() - 86400000 * 7,
        isRead: true,
      },
      {
        id: 'msg-med-02',
        sender: 'buyer',
        senderName: 'João Silva',
        text: 'Bom dia equipe! Já esclareci os pontos com o vendedor, muito obrigado pelo suporte.',
        time: '09:15',
        timestamp: Date.now() - 86400000 * 7 + 900000,
        isRead: true,
      },
      {
        id: 'msg-med-03',
        sender: 'staff',
        senderName: 'Equipe Feira de Carros (Mediação)',
        text: 'A mediação oficial foi concluída com sucesso. Obrigado pela cooperação.',
        time: '09:30',
        timestamp: Date.now() - 86400000 * 7 + 1800000,
        isRead: true,
      },
    ],
    isMockData: true,
  },
  {
    id: 'conv-bloqueada-polo',
    sellerId: 'SELLER-2026-0914',
    sellerName: 'Roberto Almeida',
    sellerInitials: 'RA',
    sellerType: 'particular',
    vehicleId: 'veh-polo-track-2023',
    vehicleTitle: 'Volkswagen Polo Track 1.0',
    vehicleSubtitle: '2023/2023 · 28.500 km · Manual · Ipatinga, MG',
    vehiclePriceFormatted: 'R$ 74.900,00',
    vehicleLocation: 'Ipatinga, MG',
    vehicleImageUrl: '/images/vehicles/demo/web027-nivus.png',
    lastMessage: 'Esta conversa está arquivada e não aceita novas mensagens.',
    lastMessageTime: '01/05',
    unreadCount: 0,
    status: 'blocked',
    isMediated: false,
    isBlocked: true,
    isSold: true,
    messages: [
      {
        id: 'msg-polo-01',
        sender: 'buyer',
        senderName: 'João Silva',
        text: 'Olá, o Polo ainda está disponível para visita?',
        time: '16:00',
        timestamp: Date.now() - 86400000 * 16,
        isRead: true,
      },
      {
        id: 'msg-polo-02',
        sender: 'seller',
        senderName: 'Roberto Almeida',
        text: 'Boa tarde, o veículo já foi vendido hoje cedo.',
        time: '16:10',
        timestamp: Date.now() - 86400000 * 16 + 600000,
        isRead: true,
      },
      {
        id: 'msg-polo-03',
        sender: 'system',
        senderName: 'Sistema Feira de Carros',
        text: 'Este anúncio foi marcado como VENDIDO pelo anunciante. A conversa foi arquivada.',
        time: '16:15',
        timestamp: Date.now() - 86400000 * 16 + 900000,
        isRead: true,
      },
    ],
    isMockData: true,
  },
];

const STORAGE_KEY = 'feira_buyer_conversations_v1';
const REPORTS_STORAGE_KEY = 'feira_buyer_safety_reports_v1';

// In-memory fallback
let memoryConversations: BuyerConversation[] = [...INITIAL_BUYER_CONVERSATIONS];
const memoryReports: SafetyReportInput[] = [];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function loadConversationsFromStorage(): BuyerConversation[] {
  if (!isBrowser()) return memoryConversations;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BUYER_CONVERSATIONS));
      return INITIAL_BUYER_CONVERSATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BUYER_CONVERSATIONS;
  } catch {
    return memoryConversations;
  }
}

function saveConversationsToStorage(items: BuyerConversation[]) {
  memoryConversations = items;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable
  }
}

/**
 * Get all buyer conversations with optional keyword search
 */
export function getBuyerConversations(query?: string): BuyerConversation[] {
  const items = loadConversationsFromStorage();
  if (!query || !query.trim()) return items;

  const q = query.toLowerCase().trim();
  return items.filter(
    (item) =>
      item.sellerName.toLowerCase().includes(q) ||
      item.vehicleTitle.toLowerCase().includes(q) ||
      item.lastMessage.toLowerCase().includes(q) ||
      item.messages.some((m) => m.text.toLowerCase().includes(q)),
  );
}

/**
 * Get conversation by ID
 */
export function getBuyerConversationById(id: string): BuyerConversation | undefined {
  const items = loadConversationsFromStorage();
  return items.find((item) => item.id === id);
}

/**
 * Send a new message in an active conversation thread
 */
export function sendBuyerMessage(
  conversationId: string,
  text: string,
  senderName = 'João Silva',
): BuyerChatMessage {
  const items = loadConversationsFromStorage();
  const convIndex = items.findIndex((c) => c.id === conversationId);

  if (convIndex === -1) {
    throw new Error(`Conversa não encontrada: ${conversationId}`);
  }

  const conv = items[convIndex];
  if (conv.status === 'blocked' || conv.isBlocked || conv.isSold) {
    throw new Error('Esta conversa está arquivada e não aceita novas mensagens.');
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const newMessage: BuyerChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'buyer',
    senderName,
    text: text.trim(),
    time: timeFormatted,
    timestamp: Date.now(),
    isRead: true,
  };

  const updatedConv: BuyerConversation = {
    ...conv,
    lastMessage: text.trim(),
    lastMessageTime: timeFormatted,
    messages: [...conv.messages, newMessage],
  };

  const newItems = [...items];
  newItems[convIndex] = updatedConv;
  saveConversationsToStorage(newItems);

  return newMessage;
}

/**
 * Start or open a conversation from a vehicle listing
 */
export function startConversationFromListing(
  vehicle: {
    id: string;
    title: string;
    priceFormatted: string;
    city: string;
    state: string;
    sellerName: string;
    sellerType?: 'particular' | 'concessionaria';
    imageUrl?: string;
  },
  initialMessage: string,
  buyerName = 'João Silva',
): BuyerConversation {
  const items = loadConversationsFromStorage();
  const existing = items.find((c) => c.vehicleId === vehicle.id);

  if (existing) {
    // If conversation already exists and not blocked, send message and return
    if (!existing.isBlocked && existing.status !== 'blocked') {
      sendBuyerMessage(existing.id, initialMessage, buyerName);
    }
    return getBuyerConversationById(existing.id) || existing;
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const newConvId = `conv-${vehicle.id}-${Date.now()}`;
  const firstMessage: BuyerChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'buyer',
    senderName: buyerName,
    text: initialMessage.trim(),
    time: timeFormatted,
    timestamp: Date.now(),
    isRead: true,
  };

  const newConversation: BuyerConversation = {
    id: newConvId,
    sellerId: `SELLER-${Date.now()}`,
    sellerName: vehicle.sellerName || 'Vendedor Anunciante',
    sellerInitials: (vehicle.sellerName || 'VA')
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
    sellerType: vehicle.sellerType || 'particular',
    vehicleId: vehicle.id,
    vehicleTitle: vehicle.title,
    vehicleSubtitle: `${vehicle.city}, ${vehicle.state}`,
    vehiclePriceFormatted: vehicle.priceFormatted,
    vehicleLocation: `${vehicle.city}, ${vehicle.state}`,
    vehicleImageUrl: vehicle.imageUrl || '/images/vehicles/demo/web027-nivus.png',
    lastMessage: initialMessage.trim(),
    lastMessageTime: timeFormatted,
    unreadCount: 0,
    status: 'active',
    isMediated: false,
    isBlocked: false,
    messages: [firstMessage],
    isMockData: true,
  };

  const updatedItems = [newConversation, ...items];
  saveConversationsToStorage(updatedItems);

  return newConversation;
}

/**
 * Report and optionally block a conversation/seller
 */
export function reportAndBlockConversation(report: SafetyReportInput): void {
  const items = loadConversationsFromStorage();
  const convIndex = items.findIndex((c) => c.id === report.conversationId);

  if (convIndex !== -1 && report.blockSeller) {
    const conv = items[convIndex];
    const systemNotice: BuyerChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: 'system',
      senderName: 'Sistema de Segurança Feira de Carros',
      text: 'Você bloqueou este anunciante. Nenhuma nova mensagem pode ser enviada ou recebida nesta conversa.',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      isRead: true,
    };

    items[convIndex] = {
      ...conv,
      isBlocked: true,
      status: 'blocked',
      lastMessage: 'Usuário bloqueado.',
      messages: [...conv.messages, systemNotice],
    };
    saveConversationsToStorage(items);
  }

  // Save report audit entry
  memoryReports.push(report);
  if (isBrowser()) {
    try {
      const existingReports = JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) || '[]');
      existingReports.push({ ...report, submittedAt: new Date().toISOString() });
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(existingReports));
    } catch {
      // storage unavailable
    }
  }
}

/**
 * Mark a conversation as read (clears unread badge count)
 */
export function markConversationAsRead(conversationId: string): void {
  const items = loadConversationsFromStorage();
  const convIndex = items.findIndex((c) => c.id === conversationId);
  if (convIndex !== -1 && items[convIndex].unreadCount > 0) {
    items[convIndex] = {
      ...items[convIndex],
      unreadCount: 0,
      messages: items[convIndex].messages.map((m) => ({ ...m, isRead: true })),
    };
    saveConversationsToStorage(items);
  }
}

/**
 * Delete or clear demo conversations (for testing / reset)
 */
export function resetDemoConversations(): void {
  saveConversationsToStorage([...INITIAL_BUYER_CONVERSATIONS]);
}

export function clearAllConversations(): void {
  saveConversationsToStorage([]);
}
