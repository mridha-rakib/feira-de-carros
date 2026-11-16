import type {
  SellerListingDetail,
  SellerListingItem,
  SellerListingRevision,
} from '../types/seller-presentation';

/**
 * Deterministic In-Memory Adapter for Seller Listings & Revisions.
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES (698:401, 698:472, 698:547, 698:622, 701:457)
 * In accordance with AGENTS.md rules: all client mocks carry explicit DEMO DATA provenance.
 */

const INITIAL_DETAILED_LISTINGS: SellerListingDetail[] = [
  {
    id: 'FDC-2026-0142',
    title: 'Volkswagen Polo Track 2023',
    subtitle: 'Volkswagen · Hatch · Flex | 45.200 km',
    brand: 'Volkswagen',
    model: 'Polo Track',
    category: 'Hatch',
    fuel: 'Flex',
    mileageKm: 45200,
    mileageFormatted: '45.200 km',
    priceCents: 6390000,
    priceFormatted: 'R$ 63.900,00',
    status: 'PUBLISHED',
    statusLabel: 'Publicado',
    createdAtFormatted: '24 out 2026',
    createdAtTime: 'às 14:20',
    imageUrl: '/images/vehicles/demo/vw-polo-2023.jpg',
    yearModel: 2023,
    yearManufacture: 2023,
    transmission: 'Manual',
    color: 'Branco',
    doors: 4,
    city: 'Ipatinga',
    state: 'MG',
    description:
      'Volkswagen Polo Track 2023, em excelente estado de conservação. Motor 1.0 Flex, câmbio manual, direção elétrica, ar-condicionado, central multimídia, vidros elétricos e travas elétricas. Revisões em dia, documentação OK e pronto para rodar!',
    plan: 'Padrão',
    expiresAtFormatted: '24 nov 2026 (30 dias)',
    validityDays: 30,
    galleryImages: [
      '/images/vehicles/demo/vw-polo-2023.jpg',
      '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
      '/images/vehicles/demo/web027-thumb1.png',
      '/images/vehicles/demo/web027-thumb2.png',
    ],
    metrics: {
      totalViews: 1284,
      favorites: 47,
      messages: 12,
      viewsLast7Days: 96,
    },
    history: [
      {
        date: '24 out 2026 às 14:20',
        title: 'Anúncio publicado',
        description: 'Anúncio aprovado pela moderação e publicado na plataforma.',
      },
    ],
    isMockData: true,
  },
  {
    id: 'FC-2026-0151',
    title: 'Volkswagen Nivus Highline 2023',
    subtitle: 'Volkswagen · SUV · Flex | 32.800 km',
    brand: 'Volkswagen',
    model: 'Nivus Highline',
    category: 'SUV',
    fuel: 'Flex',
    mileageKm: 32800,
    mileageFormatted: '32.800 km',
    priceCents: 10990000,
    priceFormatted: 'R$ 109.900,00',
    status: 'CORRECTION_REQUESTED',
    statusLabel: 'Correção solicitada',
    createdAtFormatted: '24 out 2026',
    createdAtTime: 'às 09:32',
    imageUrl: '/images/vehicles/demo/web028-hero.png',
    yearModel: 2023,
    yearManufacture: 2023,
    transmission: 'Automático',
    color: 'Prata',
    doors: 4,
    city: 'Ipatinga',
    state: 'MG',
    description:
      'Volkswagen Nivus Highline 2023 com 32.800 km, em excelente estado de conservação. Versão topo de linha com painel digital, multimídia VW Play, ar-condicionado digital, rodas de liga leve, câmera de ré, controle de estabilidade e 6 airbags. Único dono, revisões em dia, manual e chave reserva.',
    plan: 'Padrão',
    expiresAtFormatted: 'Aguardando aprovação',
    validityDays: 30,
    galleryImages: [
      '/images/vehicles/demo/web028-hero.png',
      '/images/vehicles/demo/web027-thumb1.png',
      '/images/vehicles/demo/web027-thumb2.png',
    ],
    metrics: {
      totalViews: 0,
      favorites: 0,
      messages: 0,
      viewsLast7Days: 0,
    },
    correction: {
      reasons: [
        'Adicionar uma foto traseira do veículo.',
        'Atualizar a quilometragem para corresponder ao painel.',
        'Detalhar a versão e os opcionais na descrição.',
      ],
      comments:
        'Seu anúncio precisa de ajustes antes de ser aprovado. Revise as observações e reenvie as informações corretas.',
      requestedAt: '24 out 2026 às 14:27',
    },
    history: [
      {
        date: '24 out 2026 às 09:32',
        title: 'Anúncio enviado',
        description: 'Primeiro envio do anúncio para a equipe de moderação.',
      },
      {
        date: '24 out 2026 às 10:11',
        title: 'Em análise',
        description: 'O anúncio entrou na fila de análise da moderação.',
      },
      {
        date: '24 out 2026 às 14:27',
        title: 'Correção solicitada',
        description: 'Foi solicitada conferência de fotos e quilometragem.',
      },
    ],
    isMockData: true,
  },
  {
    id: 'FDC-2026-0189',
    title: 'Volkswagen Polo Track 2023',
    subtitle: 'Volkswagen · Hatch · Flex | 45.200 km',
    brand: 'Volkswagen',
    model: 'Polo Track',
    category: 'Hatch',
    fuel: 'Flex',
    mileageKm: 45200,
    mileageFormatted: '45.200 km',
    priceCents: 6390000,
    priceFormatted: 'R$ 63.900,00',
    status: 'REVISED_PENDING',
    statusLabel: 'Em revisão',
    createdAtFormatted: '10 out 2026',
    createdAtTime: 'às 14:27',
    imageUrl: '/images/vehicles/demo/vw-polo-2023.jpg',
    yearModel: 2023,
    yearManufacture: 2023,
    transmission: 'Manual',
    color: 'Branco',
    doors: 4,
    city: 'Ipatinga',
    state: 'MG',
    description:
      'Volkswagen Polo Track 2023, em excelente estado de conservação. Motor 1.0 Flex, câmbio manual, direção elétrica, ar-condicionado, central multimídia, vidros elétricos e travas elétricas.',
    plan: 'Padrão',
    expiresAtFormatted: '10 nov 2026',
    validityDays: 30,
    galleryImages: [
      '/images/vehicles/demo/vw-polo-2023.jpg',
      '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
    ],
    metrics: {
      totalViews: 840,
      favorites: 31,
      messages: 8,
      viewsLast7Days: 45,
    },
    pendingRevision: {
      id: 'rev-0189-01',
      listingId: 'FDC-2026-0189',
      status: 'PENDING',
      createdAt: '2026-10-24T15:00:00Z',
      createdAtFormatted: '24 out 2026 às 15:00',
      priceCents: 6190000,
      priceFormatted: 'R$ 61.900,00',
      mileageKm: 44700,
      mileageFormatted: '44.700 km',
      description:
        'Volkswagen Polo Track 2023, em excelente estado de conservação. Motor 1.0 Flex, câmbio manual, direção elétrica, ar-condicionado, central multimídia, vidros elétricos e travas elétricas. Revisões em dia, documentação OK e pronto para rodar! Valor promocional para fechamento rápido.',
      photos: [
        '/images/vehicles/demo/vw-polo-2023.jpg',
        '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
      ],
    },
    isMockData: true,
  },
  {
    id: 'FDC-2026-0105',
    title: 'Fiat Strada 2023',
    subtitle: 'Fiat · Picape · Flex | 38.900 km',
    brand: 'Fiat',
    model: 'Strada',
    category: 'Picape',
    fuel: 'Flex',
    mileageKm: 38900,
    mileageFormatted: '38.900 km',
    priceCents: 10990000,
    priceFormatted: 'R$ 109.900,00',
    status: 'PENDING_REVIEW',
    statusLabel: 'Em análise',
    createdAtFormatted: '24 out 2026',
    createdAtTime: 'às 10:55',
    imageUrl: '/images/vehicles/demo/fiat-strada-2023.jpg',
    yearModel: 2023,
    yearManufacture: 2023,
    transmission: 'Manual',
    color: 'Vermelho',
    doors: 2,
    city: 'Ipatinga',
    state: 'MG',
    description: 'Fiat Strada 2023 cabine simples com 38.900 km rodados.',
    plan: 'Padrão',
    expiresAtFormatted: 'Aguardando aprovação',
    validityDays: 30,
    galleryImages: ['/images/vehicles/demo/fiat-strada-2023.jpg'],
    metrics: { totalViews: 0, favorites: 0, messages: 0, viewsLast7Days: 0 },
    isMockData: true,
  },
  {
    id: 'FDC-2026-0118',
    title: 'Honda CG 160 2022',
    subtitle: 'Honda · Motocicleta · Flex | 21.400 km',
    brand: 'Honda',
    model: 'CG 160',
    category: 'Motocicleta',
    fuel: 'Flex',
    mileageKm: 21400,
    mileageFormatted: '21.400 km',
    priceCents: 1350000,
    priceFormatted: 'R$ 13.500,00',
    status: 'PENDING_PAYMENT',
    statusLabel: 'Aguardando pagamento',
    createdAtFormatted: '23 out 2026',
    createdAtTime: 'às 18:07',
    imageUrl: '/images/vehicles/demo/honda-cg-160-2022.jpg',
    yearModel: 2022,
    yearManufacture: 2022,
    transmission: 'Manual',
    color: 'Azul',
    doors: 0,
    city: 'Ipatinga',
    state: 'MG',
    description: 'Honda CG 160 Start 2022 em ótimo estado.',
    plan: 'Padrão',
    expiresAtFormatted: 'Aguardando pagamento',
    validityDays: 30,
    galleryImages: ['/images/vehicles/demo/honda-cg-160-2022.jpg'],
    metrics: { totalViews: 0, favorites: 0, messages: 0, viewsLast7Days: 0 },
    isMockData: true,
  },
];

// Persistent session clone for in-memory mutations
let currentListings = [...INITIAL_DETAILED_LISTINGS];

export function getSellerDetailedListings(): SellerListingDetail[] {
  return [...currentListings];
}

export function getSellerListingById(id: string): SellerListingDetail | undefined {
  // Normalize comparisons (handle case-insensitive and prefix variations e.g. web-028 -> FDC-2026-0142)
  const normalizedId = id.trim().toUpperCase();
  return (
    currentListings.find(
      (item) =>
        item.id.toUpperCase() === normalizedId ||
        (normalizedId.includes('CORRIGIR') && item.status === 'CORRECTION_REQUESTED') ||
        (normalizedId === '1' && item.id === 'FDC-2026-0142') ||
        (normalizedId === '2' && item.id === 'FC-2026-0151') ||
        (normalizedId === '3' && item.id === 'FDC-2026-0189'),
    ) || currentListings[0]
  );
}

export function updateListingCorrectionDraft(
  id: string,
  updates: {
    mileageKm?: number;
    description?: string;
    newPhoto?: string;
  },
): SellerListingDetail | undefined {
  const listing = getSellerListingById(id);
  if (!listing) return undefined;

  if (updates.mileageKm !== undefined) {
    listing.mileageKm = updates.mileageKm;
    listing.mileageFormatted = `${updates.mileageKm.toLocaleString('pt-BR')} km`;
  }
  if (updates.description !== undefined) {
    listing.description = updates.description;
  }
  if (updates.newPhoto) {
    listing.galleryImages = [...listing.galleryImages, updates.newPhoto];
  }

  return { ...listing };
}

export function resubmitListingCorrection(id: string): {
  success: boolean;
  listing?: SellerListingDetail;
  message: string;
} {
  const listing = getSellerListingById(id);
  if (!listing) {
    return { success: false, message: 'Anúncio não encontrado.' };
  }

  listing.status = 'PENDING_REVIEW';
  listing.statusLabel = 'Em análise';
  listing.history = [
    ...(listing.history || []),
    {
      date: 'Agora · Correções reenviadas',
      title: 'Correções reenviadas',
      description: 'O novo conteúdo foi enviado e aguarda análise do Main Admin.',
    },
  ];

  return {
    success: true,
    listing: { ...listing },
    message: 'Correções reenviadas com sucesso. Seu anúncio aguarda análise.',
  };
}

export function createPublishedListingRevision(
  id: string,
  proposed: {
    priceCents: number;
    mileageKm: number;
    description: string;
    photos?: string[];
  },
): {
  success: boolean;
  listing?: SellerListingDetail;
  revision?: SellerListingRevision;
  message: string;
} {
  const listing = getSellerListingById(id);
  if (!listing) {
    return { success: false, message: 'Anúncio não encontrado.' };
  }

  // CRITICAL ARCHITECTURAL INVARIANT:
  // We NEVER overwrite listing.priceCents or live data directly.
  // Instead we store the proposed changes inside pendingRevision and mark listing status.
  const revision: SellerListingRevision = {
    id: `rev-${Date.now()}`,
    listingId: listing.id,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    createdAtFormatted: 'Hoje, às 14:30',
    priceCents: proposed.priceCents,
    priceFormatted: (proposed.priceCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }),
    mileageKm: proposed.mileageKm,
    mileageFormatted: `${proposed.mileageKm.toLocaleString('pt-BR')} km`,
    description: proposed.description,
    photos: proposed.photos || [...listing.galleryImages],
  };

  listing.pendingRevision = revision;
  listing.status = 'REVISED_PENDING';
  listing.statusLabel = 'Em revisão';

  return {
    success: true,
    listing: { ...listing },
    revision,
    message: 'Alterações enviadas para análise com sucesso! A versão live permanece inalterada.',
  };
}

export function markListingAsSold(id: string): {
  success: boolean;
  listing?: SellerListingDetail;
  message: string;
} {
  const listing = getSellerListingById(id);
  if (!listing) {
    return { success: false, message: 'Anúncio não encontrado.' };
  }

  listing.status = 'SOLD';
  listing.statusLabel = 'Vendido';

  return {
    success: true,
    listing: { ...listing },
    message: 'Anúncio marcado como vendido com sucesso!',
  };
}

export function resetMockListings(): void {
  currentListings = JSON.parse(JSON.stringify(INITIAL_DETAILED_LISTINGS));
}
