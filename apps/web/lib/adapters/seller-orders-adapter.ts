import {
  SELLER_BOOST,
  SELLER_PLANS,
  formatBRL,
  getPlanDefinition,
} from '../constants/seller-commercial';
import type {
  PaymentHistoryItem,
  PaymentKpiMetrics,
  PaymentMethod,
  SellerOrder,
} from '../types/seller-presentation';

/**
 * Deterministic In-Memory Adapter for Seller Orders and Payment History.
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES (744:599, 744:685, 744:774, 764:568, 764:660, 764:748)
 *
 * In accordance with AGENTS.md rules & prompt specifications:
 * - PSP integration is on HOLD: no real financial transactions are executed or persisted.
 * - Unknown listing or order IDs return undefined (triggering a safe Not Found / Unavailable state).
 * - Centralized commercial pricing (Basic: R$ 30,00 / 30d, Extended: R$ 50,00 / 60d, Boost: R$ 10,00 / 7d).
 */

const INITIAL_ORDERS: SellerOrder[] = [
  {
    id: 'PED-2026-0812',
    listingId: 'FDC-2026-0105',
    listingTitle: 'Fiat Strada Endurance 2023',
    listingSubtitle: 'Picape • Flex • Manual',
    listingImageUrl: '/images/vehicles/demo/fiat-strada-2023.jpg',
    orderType: 'PLAN',
    planId: 'basic',
    planName: 'Plano Básico',
    durationDays: 30,
    amountCents: 3000,
    amountFormatted: 'R$ 30,00',
    paymentMethod: 'PIX',
    status: 'PENDING',
    statusLabel: 'Pendente',
    createdAt: '2026-10-24T10:20:00Z',
    createdAtFormatted: '24 out 2026 às 10:20',
    expiresAtFormatted: '25 out 2026 às 10:20',
    isMockData: true,
  },
  {
    id: 'PED-2026-0795',
    listingId: 'FDC-2026-0142',
    listingTitle: 'Volkswagen Polo Track 2023',
    listingSubtitle: 'Hatch • Flex • Manual',
    listingImageUrl: '/images/vehicles/demo/vw-polo-2023.jpg',
    orderType: 'PLAN',
    planId: 'extended',
    planName: 'Plano Estendido',
    durationDays: 60,
    amountCents: 5000,
    amountFormatted: 'R$ 50,00',
    paymentMethod: 'CREDIT_CARD',
    status: 'PAID',
    statusLabel: 'Confirmado',
    createdAt: '2026-10-22T14:15:00Z',
    createdAtFormatted: '22 out 2026 às 14:15',
    expiresAtFormatted: '22 dez 2026',
    isMockData: true,
  },
  {
    id: 'PED-2026-0740',
    listingId: 'FDC-2026-0118',
    listingTitle: 'Honda CG 160 2022',
    listingSubtitle: 'Motocicleta • Flex • Manual',
    listingImageUrl: '/images/vehicles/demo/honda-cg-160-2022.jpg',
    orderType: 'PLAN',
    planId: 'basic',
    planName: 'Plano Básico',
    durationDays: 30,
    amountCents: 3000,
    amountFormatted: 'R$ 30,00',
    paymentMethod: 'PIX',
    status: 'EXPIRED',
    statusLabel: 'Expirado',
    createdAt: '2026-10-18T09:00:00Z',
    createdAtFormatted: '18 out 2026 às 09:00',
    expiresAtFormatted: '19 out 2026 às 09:00',
    isMockData: true,
  },
  {
    id: 'PED-2026-0610',
    listingId: 'FC-2026-0151',
    listingTitle: 'Volkswagen Nivus Highline 2023',
    listingSubtitle: 'SUV • Flex • Automático',
    listingImageUrl: '/images/vehicles/demo/web028-hero.png',
    orderType: 'PLAN',
    planId: 'basic',
    planName: 'Plano Básico',
    durationDays: 30,
    amountCents: 3000,
    amountFormatted: 'R$ 30,00',
    paymentMethod: 'PIX',
    status: 'PENDING',
    statusLabel: 'Pendente',
    createdAt: '2026-10-24T14:30:00Z',
    createdAtFormatted: '24 out 2026 às 14:30',
    expiresAtFormatted: '25 out 2026 às 14:30',
    isMockData: true,
  },
];

const INITIAL_PAYMENT_HISTORY: PaymentHistoryItem[] = [
  {
    id: 'WEB-02876',
    orderId: 'PED-2026-0795',
    listingId: 'FC-2026-0151',
    listingTitle: 'Volkswagen Nivus Highline 2023',
    listingImageUrl: '/images/vehicles/demo/web028-hero.png',
    planOrBoostName: 'Plano Estendido (60 dias)',
    amountCents: 5000,
    amountFormatted: 'R$ 50,00',
    paymentMethod: 'CREDIT_CARD',
    paymentMethodLabel: 'Cartão de crédito',
    status: 'PAID',
    statusLabel: 'Pago',
    dateFormatted: '24 out 2026',
    expiresAtFormatted: '23 dez 2026',
    isMockData: true,
  },
  {
    id: 'WEB-02877',
    orderId: 'PED-2026-0812',
    listingId: 'FDC-2026-0105',
    listingTitle: 'Fiat Strada 2023',
    listingImageUrl: '/images/vehicles/demo/fiat-strada-2023.jpg',
    planOrBoostName: 'Plano Básico (30 dias)',
    amountCents: 3000,
    amountFormatted: 'R$ 30,00',
    paymentMethod: 'PIX',
    paymentMethodLabel: 'Pix',
    status: 'PENDING',
    statusLabel: 'Pendente',
    dateFormatted: '24 out 2026',
    expiresAtFormatted: '25 out 2026',
    isMockData: true,
  },
  {
    id: 'WEB-02878',
    orderId: 'PED-2026-0740',
    listingId: 'FDC-2026-0118',
    listingTitle: 'Honda CG 160 2022',
    listingImageUrl: '/images/vehicles/demo/honda-cg-160-2022.jpg',
    planOrBoostName: 'Plano Básico (30 dias)',
    amountCents: 3000,
    amountFormatted: 'R$ 30,00',
    paymentMethod: 'PIX',
    paymentMethodLabel: 'Pix',
    status: 'EXPIRED',
    statusLabel: 'Expirado',
    dateFormatted: '18 out 2026',
    expiresAtFormatted: '19 out 2026',
    isMockData: true,
  },
  {
    id: 'WEB-02879',
    orderId: 'PED-2026-0540',
    listingId: 'FDC-2026-0142',
    listingTitle: 'Volkswagen Polo Track 2023',
    listingImageUrl: '/images/vehicles/demo/vw-polo-2023.jpg',
    planOrBoostName: 'Plano Básico (30 dias)',
    amountCents: 3000,
    amountFormatted: 'R$ 30,00',
    paymentMethod: 'PIX',
    paymentMethodLabel: 'Pix',
    status: 'PAID',
    statusLabel: 'Pago',
    dateFormatted: '24 set 2026',
    expiresAtFormatted: '24 out 2026',
    isMockData: true,
  },
];

const ordersStore = [...INITIAL_ORDERS];
const historyStore = [...INITIAL_PAYMENT_HISTORY];

export function getSellerOrderById(id: string): SellerOrder | undefined {
  if (!id) return undefined;
  const cleanId = id.trim().toUpperCase();

  // Known demo aliases
  if (
    cleanId === '1' ||
    cleanId === 'DEMO' ||
    cleanId === 'WEB-030' ||
    cleanId === 'WEB-031' ||
    cleanId === 'WEB-032'
  ) {
    return ordersStore[0];
  }

  // Exact ID match or prefix match
  const found = ordersStore.find((order) => order.id.toUpperCase() === cleanId);
  if (found) return found;

  // Listing ID match
  return ordersStore.find((order) => order.listingId.toUpperCase() === cleanId);
}

export function createOrGetOrderForListing(
  listingId: string,
  planId: 'basic' | 'extended',
  paymentMethod: PaymentMethod = 'PIX',
  orderType: 'PLAN' | 'RENEWAL' | 'BOOST' = 'PLAN',
): SellerOrder {
  const plan = getPlanDefinition(planId);
  const existing = ordersStore.find(
    (o) => o.listingId === listingId && o.orderType === orderType && o.status === 'PENDING',
  );

  if (existing) {
    existing.planId = planId;
    existing.planName = plan.name;
    existing.durationDays = plan.durationDays;
    existing.amountCents = plan.priceCents;
    existing.amountFormatted = plan.priceFormatted;
    existing.paymentMethod = paymentMethod;
    return existing;
  }

  const newOrder: SellerOrder = {
    id: `PED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    listingId,
    listingTitle: 'Fiat Strada Endurance 2023',
    listingSubtitle: 'Picape • Flex • Manual',
    listingImageUrl: '/images/vehicles/demo/fiat-strada-2023.jpg',
    orderType,
    planId,
    planName: plan.name,
    durationDays: plan.durationDays,
    amountCents: plan.priceCents,
    amountFormatted: plan.priceFormatted,
    paymentMethod,
    status: 'PENDING',
    statusLabel: 'Pendente',
    createdAt: new Date().toISOString(),
    createdAtFormatted: 'Agora',
    isMockData: true,
  };

  ordersStore.push(newOrder);
  return newOrder;
}

export function getPaymentHistory(filters?: {
  search?: string;
  status?: string;
  plan?: string;
}): PaymentHistoryItem[] {
  let list = [...historyStore];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        item.listingTitle.toLowerCase().includes(q) ||
        item.planOrBoostName.toLowerCase().includes(q),
    );
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter((item) => item.status === filters.status);
  }

  if (filters?.plan && filters.plan !== 'all') {
    const planQuery = filters.plan.toLowerCase();
    list = list.filter((item) => item.planOrBoostName.toLowerCase().includes(planQuery));
  }

  return list;
}

export function getPaymentKpis(): PaymentKpiMetrics {
  const pendingCount = historyStore.filter((i) => i.status === 'PENDING').length;
  const confirmedCount = historyStore.filter((i) => i.status === 'PAID').length;
  const totalPaidCents = historyStore
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + i.amountCents, 0);

  return {
    pendingCount,
    confirmedCount,
    totalPaidCents,
    totalPaidFormatted: formatBRL(totalPaidCents),
    activePlansCount: confirmedCount,
  };
}
