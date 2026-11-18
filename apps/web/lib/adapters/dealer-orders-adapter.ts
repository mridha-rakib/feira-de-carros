/**
 * Dealership Orders & Advertising Adapter
 * Deterministic presentation data for Dealership Advertising Checkout & Lifecycle (WEB-029 to WEB-033, WEB-036, WEB-037).
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES
 * Strictly isolated from Individual Seller (Mariana Silva) and Buyer accounts.
 */

export interface DealerOrder {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehiclePlate: string;
  vehiclePrice: string;
  vehicleImageUrl: string;
  type: 'plan' | 'boost' | 'renewal';
  planId?: 'essential' | 'premium';
  planName: string;
  amountFormatted: string;
  amountCents: number;
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
  pixCode?: string;
  pixQrCodeUrl?: string;
  cardLastFour?: string;
  createdAt: string;
  isMockData: true;
}

// In-memory / module-level cache for orders created in session
const ORDERS_MAP: Map<string, DealerOrder> = new Map([
  [
    'DLR-ORD-1001',
    {
      id: 'DLR-ORD-1001',
      vehicleId: 'dlr-veh-001',
      vehicleTitle: 'Honda Civic 2.0 EXL 2022',
      vehiclePlate: 'BRA2E19',
      vehiclePrice: 'R$ 124.900',
      vehicleImageUrl: '/images/vehicles/demo/sedan-fallback.svg',
      type: 'plan',
      planId: 'premium',
      planName: 'Plano Premium (60 dias + Destaque)',
      amountFormatted: 'R$ 89,90',
      amountCents: 8990,
      paymentMethod: 'PIX',
      status: 'pending',
      pixCode:
        '00020126580014br.gov.bcb.pix0136feiradecarros-lider-dlr1001520400005303986540589.905802BR5925LIDER VEICULOS SEMINOVOS6008IPATINGA62070503***6304ABCD',
      createdAt: new Date().toISOString(),
      isMockData: true,
    },
  ],
]);

export function getDealerOrderById(id: string): DealerOrder | undefined {
  if (typeof window !== 'undefined') {
    const raw = sessionStorage.getItem(`fdc_dealer_order_${id}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
  }
  return ORDERS_MAP.get(id);
}

export function saveDealerOrder(order: DealerOrder): void {
  ORDERS_MAP.set(order.id, order);
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`fdc_dealer_order_${order.id}`, JSON.stringify(order));
  }
}

export function createDealerOrder(params: {
  vehicleId: string;
  vehicleTitle: string;
  vehiclePlate: string;
  vehiclePrice: string;
  vehicleImageUrl: string;
  type: 'plan' | 'boost' | 'renewal';
  planId?: 'essential' | 'premium';
  paymentMethod: 'PIX' | 'CREDIT_CARD';
}): DealerOrder {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `DLR-ORD-${Date.now().toString().slice(-4)}${randomSuffix}`;

  let planName = 'Plano Essencial';
  let amountFormatted = 'R$ 49,90';
  let amountCents = 4990;

  if (params.type === 'boost') {
    planName = 'Impulsionamento Destaque (7 dias)';
    amountFormatted = 'R$ 29,90';
    amountCents = 2990;
  } else if (params.type === 'renewal') {
    planName = 'Renovação de Anúncio (+30 dias)';
    amountFormatted = 'R$ 49,90';
    amountCents = 4990;
  } else if (params.planId === 'premium') {
    planName = 'Plano Premium (60 dias + Destaque)';
    amountFormatted = 'R$ 89,90';
    amountCents = 8990;
  }

  const order: DealerOrder = {
    id,
    vehicleId: params.vehicleId,
    vehicleTitle: params.vehicleTitle,
    vehiclePlate: params.vehiclePlate,
    vehiclePrice: params.vehiclePrice,
    vehicleImageUrl: params.vehicleImageUrl,
    type: params.type,
    planId: params.planId,
    planName,
    amountFormatted,
    amountCents,
    paymentMethod: params.paymentMethod,
    status: 'pending',
    pixCode: `00020126580014br.gov.bcb.pix0136feiradecarros-lider-${id}5204000053039865405${(amountCents / 100).toFixed(2)}5802BR5925LIDER VEICULOS SEMINOVOS6008IPATINGA62070503***6304EFFE`,
    createdAt: new Date().toISOString(),
    isMockData: true,
  };

  saveDealerOrder(order);
  return order;
}

export function updateDealerOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'confirmed' | 'failed',
  cardLastFour?: string,
): DealerOrder | undefined {
  const order = getDealerOrderById(orderId);
  if (!order) return undefined;

  const updated: DealerOrder = {
    ...order,
    status,
    cardLastFour: cardLastFour || order.cardLastFour,
  };
  saveDealerOrder(updated);
  return updated;
}
