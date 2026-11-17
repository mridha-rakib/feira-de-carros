import type { RefundRequest } from '../types/seller-presentation';

export const MOCK_REFUNDS: RefundRequest[] = [
  {
    id: 'REF-2026-001',
    orderId: 'PED-DEMO-2026-015',
    listingId: 'FC-2026-0151',
    listingTitle: 'Volkswagen Polo Track 2023',
    listingImageUrl: '/images/vehicles/demo/web027-nivus.png',
    amountCents: 8990,
    amountFormatted: 'R$ 89,90',
    paymentMethod: 'Pix (cenário demo)',
    applicantName: 'Mariana Silva',
    reason: 'Não desejo continuar a contratação',
    details:
      'Solicito a análise do cancelamento desta contratação dentro da política da plataforma.',
    status: 'UNDER_REVIEW',
    statusLabel: 'Em revisão manual',
    requestedAtFormatted: '26/10/2026 às 14:32',
    isMockData: true,
  },
  {
    id: 'REF-2026-002',
    orderId: 'PED-2026-0810',
    listingId: 'FC-2026-0042',
    listingTitle: 'Volkswagen Nivus Highline 2023',
    listingImageUrl: '/images/vehicles/demo/web027-nivus.png',
    amountCents: 3000,
    amountFormatted: 'R$ 30,00',
    paymentMethod: 'Cartão de Crédito',
    applicantName: 'Mariana Silva',
    reason: 'Veículo vendido antes do término do plano',
    details: 'Carro vendido no particular no dia seguinte ao pagamento.',
    status: 'REQUESTED',
    statusLabel: 'Solicitação recebida',
    requestedAtFormatted: '24/10/2026 às 09:15',
    isMockData: true,
  },
];

export function getRefundsList(): RefundRequest[] {
  return [...MOCK_REFUNDS];
}

export function getRefundById(id: string): RefundRequest | undefined {
  if (!id) return undefined;
  return MOCK_REFUNDS.find((r) => r.id === id);
}

export function getRefundByOrderId(orderId: string): RefundRequest | undefined {
  if (!orderId) return undefined;
  return MOCK_REFUNDS.find((r) => r.orderId === orderId);
}

export function getRefundKpis() {
  const totalCount = MOCK_REFUNDS.length;
  const pendingCount = MOCK_REFUNDS.filter(
    (r) => r.status === 'UNDER_REVIEW' || r.status === 'REQUESTED',
  ).length;
  const approvedCount = MOCK_REFUNDS.filter((r) => r.status === 'APPROVED').length;
  const totalApprovedCents = MOCK_REFUNDS.filter((r) => r.status === 'APPROVED').reduce(
    (acc, r) => acc + r.amountCents,
    0,
  );

  return {
    totalCount,
    pendingCount,
    approvedCount,
    totalApprovedCents,
    totalApprovedFormatted: `R$ ${(totalApprovedCents / 100).toFixed(2).replace('.', ',')}`,
  };
}

export function createRefundRequest(input: {
  orderId: string;
  listingId: string;
  listingTitle: string;
  listingImageUrl?: string;
  planName?: string;
  amountCents: number;
  amountFormatted: string;
  paymentMethod: string;
  reason: string;
  details?: string;
}): RefundRequest {
  const newReq: RefundRequest = {
    id: `REF-2026-${String(MOCK_REFUNDS.length + 1).padStart(3, '0')}`,
    orderId: input.orderId,
    listingId: input.listingId,
    listingTitle: input.listingTitle,
    listingImageUrl: input.listingImageUrl || '/images/vehicles/demo/web027-nivus.png',
    amountCents: input.amountCents,
    amountFormatted: input.amountFormatted,
    paymentMethod: input.paymentMethod,
    applicantName: 'Mariana Silva',
    reason: input.reason,
    details: input.details || '',
    status: 'REQUESTED',
    statusLabel: 'Solicitação recebida',
    requestedAtFormatted: new Date().toLocaleDateString('pt-BR'),
    isMockData: true,
  };
  MOCK_REFUNDS.unshift(newReq);
  return newReq;
}
