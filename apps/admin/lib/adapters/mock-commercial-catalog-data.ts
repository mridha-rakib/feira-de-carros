import type {
  AdvertisementPlanRecord,
  BoostConfigurationRecord,
  BrandModelRecord,
  BrazilianLocationRecord,
  VehicleCategoryRecord,
} from '../types/commercial-catalog-presentation';

export const mockAdvertisementPlans: AdvertisementPlanRecord[] = [
  {
    id: 'PLN-30D-05',
    name: 'Plano Básico',
    priceBrl: 30,
    durationDays: 30,
    maxPhotos: 5,
    videoAllowed: false,
    autoRenewal: false,
    status: 'ACTIVE',
    statusLabel: 'Ativo',
    activeListingsCount: 1420,
    description:
      'Anúncio padrão com 30 dias de vigência na vitrine e até 5 fotografias em alta resolução.',
    features: [
      '30 dias de exibição contínua na vitrine pública',
      'Até 5 fotos de alta resolução',
      'Exibição em buscas por marca, modelo e cidade',
      'Formulário direto de contato com comprador',
      'Sem renovação automática (cobrança única)',
      'Vídeo não permitido no baseline V1',
    ],
  },
  {
    id: 'PLN-60D-10',
    name: 'Plano Estendido',
    priceBrl: 50,
    durationDays: 60,
    maxPhotos: 10,
    videoAllowed: false,
    autoRenewal: false,
    status: 'ACTIVE',
    statusLabel: 'Ativo',
    activeListingsCount: 986,
    description: 'Maior prazo de exposição (60 dias) com cota expandida de até 10 fotografias.',
    features: [
      '60 dias de exibição contínua na vitrine pública',
      'Até 10 fotos detalhadas do veículo',
      'Maior visibilidade em buscas e filtros refinados',
      'Destaque no card com selo de vistoria presencial',
      'Sem renovação automática (cobrança única)',
      'Vídeo não permitido no baseline V1',
    ],
  },
];

export const mockBoostConfiguration: BoostConfigurationRecord = {
  id: 'BST-07D-001',
  title: 'Destaque 7 Dias',
  priceBrl: 10,
  durationDays: 7,
  status: 'ACTIVE',
  statusLabel: 'Ativo',
  activeBoostsCount: 38,
  eligibleCriteria: [
    'Anúncio base deve estar aprovado e com status ativo na plataforma',
    'Pagamento da taxa de impulsionamento confirmado via PIX ou Cartão',
    'Sem pendências de moderação ou evidências de denúncia em aberto',
    'Veículo disponível no pátio físico ou verificado pelo proprietário',
  ],
  ineligibleCriteria: [
    'Anúncios em moderação, rascunho ou com pagamento base pendente',
    'Veículos já marcados como vendidos ou cancelados',
    'Anúncios suspensos por violação de regras da plataforma',
  ],
  rules: [
    'A falha no pagamento do destaque NÃO desativa o anúncio base.',
    'A venda do veículo encerra imediatamente o impulsionamento ativo.',
    'Não há reembolso proporcional de impulsionamento após a venda do veículo.',
    'A plataforma não garante posição fixa ou topo incondicional (ranking dinâmico).',
  ],
  exampleListingId: 'FC-2026-0142',
  exampleListingTitle: 'Fiat Strada Endurance 2023',
};

export const mockVehicleCategories: VehicleCategoryRecord[] = [
  {
    id: 'CAT-CAR',
    name: 'Carros',
    slug: 'carros',
    status: 'ACTIVE',
    statusLabel: 'Ativo',
    activeModelsCount: 5,
    totalListingsCount: 1840,
    mandatoryAttributes: [
      'Marca e Modelo',
      'Ano de Fabricação / Modelo',
      'Quilometragem (km)',
      'Preço (R$)',
      'Tipo de Combustível',
      'Câmbio (Manual / Automático)',
      'Cor Predominante',
    ],
    description: 'Veículos de passeio, sedans, hatchbacks, SUVs e minivans.',
  },
  {
    id: 'CAT-TRUCK',
    name: 'Caminhões',
    slug: 'caminhoes',
    status: 'ACTIVE',
    statusLabel: 'Ativo',
    activeModelsCount: 2,
    totalListingsCount: 215,
    mandatoryAttributes: [
      'Marca e Modelo',
      'Ano de Fabricação / Modelo',
      'Quilometragem (km)',
      'Preço (R$)',
      'Capacidade de Carga (ton)',
      'Tração (4x2 / 6x2 / 6x4)',
      'Tipo de Carroceria',
    ],
    description: 'Veículos pesados, caminhões leves, médios e cavalos mecânicos.',
  },
  {
    id: 'CAT-MOTO',
    name: 'Motocicletas',
    slug: 'motocicletas',
    status: 'ACTIVE',
    statusLabel: 'Ativo',
    activeModelsCount: 3,
    totalListingsCount: 310,
    mandatoryAttributes: [
      'Marca e Modelo',
      'Ano de Fabricação / Modelo',
      'Cilindrada (cc)',
      'Quilometragem (km)',
      'Preço (R$)',
      'Partida (Elétrica / Pedal)',
    ],
    description: 'Motos urbanas, esportivas, scooters e modelos de trilha.',
  },
  {
    id: 'CAT-OTHER',
    name: 'Outros',
    slug: 'outros',
    status: 'ACTIVE',
    statusLabel: 'Ativo',
    activeModelsCount: 1,
    totalListingsCount: 41,
    mandatoryAttributes: [
      'Identificação / Tipo',
      'Ano / Referência',
      'Preço (R$)',
      'Descrição Detalhada',
    ],
    description: 'Reboques, carretinhas, veículos utilitários especiais e agrícolas.',
  },
];

export const mockBrandModels: BrandModelRecord[] = [
  {
    id: 'MOD-001',
    brand: 'Toyota',
    model: 'Corolla 2021',
    categoryId: 'CAT-CAR',
    categoryName: 'Carros',
    yearReference: '2021/2021',
    activeListingsCount: 28,
    imageThumbnail: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    status: 'LOCKED',
    statusLabel: 'Bloqueado p/ exclusão',
  },
  {
    id: 'MOD-002',
    brand: 'Fiat',
    model: 'Strada Endurance 2023',
    categoryId: 'CAT-CAR',
    categoryName: 'Carros',
    yearReference: '2023/2023',
    activeListingsCount: 42,
    imageThumbnail: '/images/vehicles/demo/pickup-fallback.svg',
    status: 'LOCKED',
    statusLabel: 'Bloqueado p/ exclusão',
  },
  {
    id: 'MOD-003',
    brand: 'Chevrolet',
    model: 'Onix LT 2022',
    categoryId: 'CAT-CAR',
    categoryName: 'Carros',
    yearReference: '2022/2022',
    activeListingsCount: 35,
    imageThumbnail: '/images/vehicles/demo/hatch-fallback.svg',
    status: 'LOCKED',
    statusLabel: 'Bloqueado p/ exclusão',
  },
  {
    id: 'MOD-004',
    brand: 'Volkswagen',
    model: 'Polo Track',
    categoryId: 'CAT-CAR',
    categoryName: 'Carros',
    yearReference: '2023/2024',
    activeListingsCount: 19,
    imageThumbnail: '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
    status: 'LOCKED',
    statusLabel: 'Bloqueado p/ exclusão',
  },
  {
    id: 'MOD-005',
    brand: 'Honda',
    model: 'HR-V 2020',
    categoryId: 'CAT-CAR',
    categoryName: 'Carros',
    yearReference: '2020/2020',
    activeListingsCount: 14,
    imageThumbnail: '/images/vehicles/demo/suv-fallback.svg',
    status: 'LOCKED',
    statusLabel: 'Bloqueado p/ exclusão',
  },
];

export const mockBrazilianLocations: BrazilianLocationRecord[] = [
  {
    id: 'LOC-001',
    city: 'Ipatinga',
    state: 'MG',
    isDefault: true,
    region: 'Vale do Aço (Sede)',
    activeListingsCount: 1420,
    status: 'ACTIVE',
    statusLabel: 'Sede da Feira',
  },
  {
    id: 'LOC-002',
    city: 'Timóteo',
    state: 'MG',
    isDefault: false,
    region: 'Vale do Aço',
    activeListingsCount: 340,
    status: 'ACTIVE',
    statusLabel: 'Ativo',
  },
  {
    id: 'LOC-003',
    city: 'Coronel Fabriciano',
    state: 'MG',
    isDefault: false,
    region: 'Vale do Aço',
    activeListingsCount: 290,
    status: 'ACTIVE',
    statusLabel: 'Ativo',
  },
  {
    id: 'LOC-004',
    city: 'Belo Horizonte',
    state: 'MG',
    isDefault: false,
    region: 'Região Metropolitana',
    activeListingsCount: 280,
    status: 'ACTIVE',
    statusLabel: 'Ativo',
  },
  {
    id: 'LOC-005',
    city: 'São Paulo',
    state: 'SP',
    isDefault: false,
    region: 'Grande SP',
    activeListingsCount: 76,
    status: 'ACTIVE',
    statusLabel: 'Ativo',
  },
];

export function getAdvertisementPlanById(id: string): AdvertisementPlanRecord | undefined {
  return mockAdvertisementPlans.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export function getVehicleCategoryById(id: string): VehicleCategoryRecord | undefined {
  return mockVehicleCategories.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getBrandModelById(id: string): BrandModelRecord | undefined {
  return mockBrandModels.find((m) => m.id.toLowerCase() === id.toLowerCase());
}

export function getBrazilianLocationById(id: string): BrazilianLocationRecord | undefined {
  return mockBrazilianLocations.find((l) => l.id.toLowerCase() === id.toLowerCase());
}
