/**
 * Centralized Commercial Rules & Pricing for Dealership Fleet Portal.
 * Approved in SRS / Figma specifications:
 * - Plano Essencial: R$ 49,90 · 30 dias · Até 8 fotos · Listagem no showroom
 * - Plano Premium: R$ 89,90 · 60 dias · Até 20 fotos · Destaque de estoque
 * - Destaque Promocional (Boost / Impulsionar): R$ 29,90 · 7 dias
 * - Renovação de Anúncio: R$ 49,90 · +30 dias
 *
 * PROVENANCE: Approved SRS v0.2 Commercial Rules & Figma Nodes (744:512, 744:599, 744:685, 744:774, 764:660, 764:748)
 * Explicitly isolated from Individual Seller tier (seller-commercial.ts).
 */

export interface DealerPlanDefinition {
  id: 'essential' | 'premium';
  name: string;
  badgeLabel: string;
  priceCents: number;
  priceFormatted: string;
  durationDays: number;
  maxPhotos: number;
  description: string;
  features: string[];
}

export interface DealerBoostDefinition {
  id: 'boost';
  name: string;
  badgeLabel: string;
  priceCents: number;
  priceFormatted: string;
  durationDays: number;
  description: string;
  features: string[];
}

export interface DealerRenewalDefinition {
  id: 'renewal';
  name: string;
  badgeLabel: string;
  priceCents: number;
  priceFormatted: string;
  durationDays: number;
  description: string;
  features: string[];
}

export const DEALER_PLANS: Record<'essential' | 'premium', DealerPlanDefinition> = {
  essential: {
    id: 'essential',
    name: 'Plano Essencial',
    badgeLabel: '30 dias',
    priceCents: 4990,
    priceFormatted: 'R$ 49,90',
    durationDays: 30,
    maxPhotos: 8,
    description: 'Publicação individual de alta qualidade para giro rápido de estoque.',
    features: [
      '30 dias de exibição ativa',
      'Até 8 fotos do veículo',
      'Listagem no showroom da loja',
      'Canal de mensagens direto com compradores',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Plano Premium',
    badgeLabel: '60 dias · Mais Vendido',
    priceCents: 8990,
    priceFormatted: 'R$ 89,90',
    durationDays: 60,
    maxPhotos: 20,
    description:
      'Máxima visibilidade com destaque na busca e dobro de duração para veículos de alto valor.',
    features: [
      '60 dias de exibição ativa',
      'Até 20 fotos em alta resolução',
      'Selo visual de Destaque na busca',
      'Prioridade na ordenação de estoque',
      'Canal de mensagens e WhatsApp integrados',
      'Relatório de visualizações e contatos',
    ],
  },
};

export const DEALER_BOOST: DealerBoostDefinition = {
  id: 'boost',
  name: 'Impulsionamento Destaque',
  badgeLabel: '7 dias · Destaque',
  priceCents: 2990,
  priceFormatted: 'R$ 29,90',
  durationDays: 7,
  description: 'Destaque no topo das buscas e recomendados por 7 dias corridos.',
  features: [
    'Posicionamento prioritário no topo da busca',
    'Badge visual "Destaque" de alta visibilidade',
    'Até 150% mais visualizações estimadas [ILUSTRATIVO]',
    'Contatos direcionados para o painel de mensagens',
  ],
};

export const DEALER_RENEWAL: DealerRenewalDefinition = {
  id: 'renewal',
  name: 'Renovação de Anúncio',
  badgeLabel: '+30 dias',
  priceCents: 4990,
  priceFormatted: 'R$ 49,90',
  durationDays: 30,
  description: 'Mantenha seu anúncio ativo no estoque por mais 30 dias com métricas preservadas.',
  features: [
    'Mais 30 dias de exibição ativa',
    'Preservação do histórico e métricas acumuladas',
    'Continuidade nas mensagens em andamento',
    'Sem perda de posicionamento indexado',
  ],
};

export const DEALER_DEMO_TAG = 'DADOS DE DEMONSTRAÇÃO';

/**
 * Returns the maximum permitted photos based on selected dealership plan.
 */
export function getDealerMaxPhotos(plan?: string): number {
  if (plan === 'essential') {
    return DEALER_PLANS.essential.maxPhotos;
  }
  return DEALER_PLANS.premium.maxPhotos;
}

/**
 * Format cents integer to BRL currency string (e.g. 4990 -> "R$ 49,90")
 */
export function formatDealerBRL(cents: number): string {
  const value = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
