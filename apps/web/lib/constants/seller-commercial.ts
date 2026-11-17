/**
 * Centralized Commercial Rules & Pricing for Seller Portal.
 * Approved in SRS / Figma specifications:
 * - Plano Básico: R$ 30,00 · 30 dias · Até 5 fotos · Renovação manual
 * - Plano Estendido: R$ 50,00 · 60 dias · Até 10 fotos · Renovação manual
 * - Destaque Promocional (Boost): R$ 10,00 · 7 dias
 *
 * PROVENANCE: Approved SRS v0.2 Commercial Rules & Figma Nodes (744:512, 744:599, 744:685, 744:774, 764:568, 764:660, 764:748)
 */

export interface SellerPlanDefinition {
  id: 'basic' | 'extended';
  name: string;
  badgeLabel: string;
  priceCents: number;
  priceFormatted: string;
  durationDays: number;
  maxPhotos: number;
  description: string;
  features: string[];
}

export interface SellerBoostDefinition {
  id: 'boost';
  name: string;
  badgeLabel: string;
  priceCents: number;
  priceFormatted: string;
  durationDays: number;
  description: string;
  features: string[];
}

export const SELLER_PLANS: Record<'basic' | 'extended', SellerPlanDefinition> = {
  basic: {
    id: 'basic',
    name: 'Plano Básico',
    badgeLabel: '30 dias',
    priceCents: 3000,
    priceFormatted: 'R$ 30,00',
    durationDays: 30,
    maxPhotos: 5,
    description: 'Ideal para vendedores que buscam rapidez com valor acessível.',
    features: [
      'Até 5 fotos do veículo',
      'Exibição ativa por 30 dias',
      'Painel de métricas e contatos',
      'Renovação manual após o período',
    ],
  },
  extended: {
    id: 'extended',
    name: 'Plano Estendido',
    badgeLabel: '60 dias · Mais econômico',
    priceCents: 5000,
    priceFormatted: 'R$ 50,00',
    durationDays: 60,
    maxPhotos: 10,
    description: 'Mais tempo de exposição e o dobro de fotos para acelerar sua venda.',
    features: [
      'Até 10 fotos em alta resolução',
      'Exibição ativa por 60 dias',
      'Maior tempo de exposição na categoria',
      'Painel de métricas completo',
      'Renovação manual com flexibilidade',
    ],
  },
};

export const SELLER_BOOST: SellerBoostDefinition = {
  id: 'boost',
  name: 'Destaque Promocional',
  badgeLabel: '7 dias · Destaque',
  priceCents: 1000,
  priceFormatted: 'R$ 10,00',
  durationDays: 7,
  description: 'Seu veículo no topo das buscas da categoria durante 7 dias corridos.',
  features: [
    'Posicionamento prioritário nos resultados de busca',
    'Selo visual exclusivo de Destaque',
    'Exposição ampliada na página inicial e categoria',
    'Sem renovação automática — controle 100% do vendedor',
  ],
};

/**
 * Format cents integer to BRL currency string (e.g. 3000 -> "R$ 30,00")
 */
export function formatBRL(cents: number): string {
  const value = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Safe retrieval of plan definition by key
 */
export function getPlanDefinition(planId: string): SellerPlanDefinition {
  if (planId === 'extended' || planId === '60') {
    return SELLER_PLANS.extended;
  }
  return SELLER_PLANS.basic;
}
