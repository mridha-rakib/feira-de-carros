/**
 * Public Buyer Catalog Adapter
 * Deterministic mock data for the public marketplace (Batches B1 & B2).
 * PROVENANCE: DEMO DATA / FIGMA REFERENCES (733:3, 733:51, 733:87, 733:179, 733:208, 1211:2395, 1211:2461, 1211:2518, 1212:3646, 1212:3890)
 *
 * In accordance with AGENTS.md:
 * - Only approved, published public listing fixtures.
 * - Private seller metrics, review comments, draft/rejected listings, and private seller PII are strictly excluded.
 * - Dealership profiles contain NO public CNPJ or fabricated commercial reputation metrics.
 * - Raw unmasked phone numbers are never embedded in static SSR HTML (anti-scraping protection).
 */

export interface PublicVehicleItem {
  id: string;
  title: string;
  brand: string;
  model: string;
  version: string;
  category: 'Carros' | 'Motos' | 'Caminhões';
  bodyType: 'Sedã' | 'Hatch' | 'SUV' | 'Picape' | 'Outro';
  priceCents: number;
  priceFormatted: string;
  yearModel: number;
  yearManufacture: number;
  mileageKm: number;
  mileageFormatted: string;
  fuel: 'Flex' | 'Gasolina' | 'Diesel' | 'Elétrico' | 'Híbrido';
  transmission: 'Automático' | 'Manual' | 'CVT';
  condition: 'Usado' | 'Novo';
  color: string;
  plateEnd: string;
  doors: number;
  description: string;
  features: string[];
  city: string;
  state: string;
  neighborhood: string;
  imageUrl: string;
  galleryImages: string[];
  featured: boolean;
  sellerType: 'particular' | 'concessionaria';
  sellerName: string;
  dealershipId?: string;
  sellerResponseTime?: string;
  contactPhoneMasked: string;
  contactPhoneFull: string;
  isMockData: true;
  isSold?: boolean;
  isUnavailable?: boolean;
}

export interface PublicDealership {
  id: string;
  name: string;
  tradingName: string;
  slug: string;
  bannerUrl: string;
  logoUrl: string;
  city: string;
  state: string;
  address: string;
  neighborhood: string;
  openingHours: string;
  description: string;
  phoneMasked: string;
  phoneFull: string;
  email: string;
  verifiedDealer: boolean;
  isMockData: true;
}

export interface BuyerLocation {
  city: string;
  state: string;
  label: string;
  isInitial?: boolean;
}

export const APPROVED_LOCATIONS: BuyerLocation[] = [
  { city: 'Ipatinga', state: 'MG', label: 'Ipatinga, MG', isInitial: true },
  { city: 'Coronel Fabriciano', state: 'MG', label: 'Coronel Fabriciano, MG' },
  { city: 'Timóteo', state: 'MG', label: 'Timóteo, MG' },
  { city: 'Governador Valadares', state: 'MG', label: 'Governador Valadares, MG' },
  { city: 'Belo Horizonte', state: 'MG', label: 'Belo Horizonte, MG' },
  { city: 'São Paulo', state: 'SP', label: 'São Paulo, SP' },
  { city: 'Rio de Janeiro', state: 'RJ', label: 'Rio de Janeiro, RJ' },
  { city: 'Curitiba', state: 'PR', label: 'Curitiba, PR' },
];

export const PUBLIC_DEALERSHIP_CATALOG: PublicDealership[] = [
  {
    id: 'dealer-lider-seminovos',
    name: 'Líder Veículos Seminovos',
    tradingName: 'Líder Veículos Ltda',
    slug: 'lider-veiculos-seminovos',
    bannerUrl: '/images/hero/hero-desktop.png',
    logoUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    city: 'Ipatinga',
    state: 'MG',
    address: 'Av. Castelo Branco, 1200',
    neighborhood: 'Horto',
    openingHours: 'Segunda a Sexta: 08:00 às 18:00 · Sábado: 08:00 às 13:00',
    description:
      'Mais de 15 anos de tradição em Ipatinga e no Vale do Aço. Veículos com procedência garantida, laudo cautelar e garantia de motor e câmbio.',
    phoneMasked: '(31) 3822-****',
    phoneFull: '(31) 3822-1000',
    email: 'contato@liderveiculos.com.br',
    verifiedDealer: true,
    isMockData: true,
  },
  {
    id: 'dealer-autocar-multimarcas',
    name: 'AutoCar Multimarcas',
    tradingName: 'AutoCar Comércio de Veículos',
    slug: 'autocar-multimarcas',
    bannerUrl: '/images/hero/hero-desktop.png',
    logoUrl: '/images/vehicles/demo/chevrolet-onix-2022.jpg',
    city: 'Ipatinga',
    state: 'MG',
    address: 'Av. Brasil, 450',
    neighborhood: 'Iguaçu',
    openingHours: 'Segunda a Sexta: 08:30 às 18:30 · Sábado: 08:30 às 12:30',
    description:
      'Especialistas em seminovos multimarcas e utilitários. Trabalhamos com as melhores taxas de financiamento da região.',
    phoneMasked: '(31) 3824-****',
    phoneFull: '(31) 3824-5500',
    email: 'vendas@autocarmultimarcas.com.br',
    verifiedDealer: true,
    isMockData: true,
  },
  {
    id: 'dealer-valedoaco-motors',
    name: 'Vale do Aço Motors',
    tradingName: 'Vale do Aço Motores e Veículos',
    slug: 'valedoaco-motors',
    bannerUrl: '/images/hero/hero-desktop.png',
    logoUrl: '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
    city: 'Ipatinga',
    state: 'MG',
    address: 'Rua Campinas, 310',
    neighborhood: 'Centro',
    openingHours: 'Segunda a Sexta: 08:00 às 18:00 · Sábado: 08:00 às 12:00',
    description:
      'Estoque selecionado de picapes, SUVs e veículos comerciais. Atendimento transparente e focado na sua satisfação.',
    phoneMasked: '(31) 3821-****',
    phoneFull: '(31) 3821-9900',
    email: 'atendimento@valedoacomotors.com.br',
    verifiedDealer: true,
    isMockData: true,
  },
];

export const PUBLIC_VEHICLE_CATALOG: PublicVehicleItem[] = [
  {
    id: 'veh-civic-2022',
    title: 'Honda Civic 2022',
    brand: 'Honda',
    model: 'Civic',
    version: '2.0 EXL Flex Automático',
    category: 'Carros',
    bodyType: 'Sedã',
    priceCents: 12490000,
    priceFormatted: 'R$ 124.900',
    yearModel: 2022,
    yearManufacture: 2022,
    mileageKm: 28500,
    mileageFormatted: '28.500 km',
    fuel: 'Flex',
    transmission: 'Automático',
    condition: 'Usado',
    color: 'Prata Metálico',
    plateEnd: '4',
    doors: 4,
    description:
      'Veículo impecável em estado de zero km. Único dono, todas as revisões realizadas na concessionária Honda autorizada. Manual do proprietário, chave reserva e estepe sem uso. Laudo cautelar aprovado sem qualquer apontamento.',
    features: [
      'Ar-condicionado digital dual zone',
      'Direção elétrica progressiva',
      'Freios ABS com EBD',
      'Airbags frontais, laterais e de cortina',
      'Câmera de ré com linhas dinâmicas',
      'Sensor de estacionamento dianteiro e traseiro',
      'Central multimídia com tela de 7" touch',
      'Apple CarPlay e Android Auto sem fio',
      'Bancos revestidos em couro',
      'Rodas de liga leve aro 17 diamantadas',
      'Piloto automático adaptativo',
      'Assistente de partida em rampa (HSA)',
      'Faróis em Full LED com acendimento automático',
      'Chave presencial Smart Key com botão Start/Stop',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Horto',
    imageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    galleryImages: [
      '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
      '/images/vehicles/demo/web027-thumb1.png',
      '/images/vehicles/demo/web027-thumb2.png',
      '/images/vehicles/demo/web028-thumb1.png',
    ],
    featured: true,
    sellerType: 'concessionaria',
    sellerName: 'Líder Veículos Seminovos',
    dealershipId: 'dealer-lider-seminovos',
    sellerResponseTime: 'Responde em até 15 minutos',
    contactPhoneMasked: '(31) 3822-****',
    contactPhoneFull: '(31) 3822-1000',
    isMockData: true,
  },
  {
    id: 'veh-corolla-2021',
    title: 'Toyota Corolla 2021',
    brand: 'Toyota',
    model: 'Corolla',
    version: '2.0 XEi Flex Automático Direct Shift',
    category: 'Carros',
    bodyType: 'Sedã',
    priceCents: 11990000,
    priceFormatted: 'R$ 119.900',
    yearModel: 2021,
    yearManufacture: 2021,
    mileageKm: 28500,
    mileageFormatted: '28.500 km',
    fuel: 'Flex',
    transmission: 'Automático',
    condition: 'Usado',
    color: 'Branco Polar',
    plateEnd: '8',
    doors: 4,
    description:
      'Corolla XEi extremamente conservado, uso familiar em rodovia. Motor 2.0 Dynamic Force de 177cv com câmbio CVT com engrenagem de partida. Pneus novos Michelin, revisões em dia com carimbo no manual.',
    features: [
      'Ar-condicionado automático digital',
      'Direção eletroassistida',
      '7 Airbags (frontais, laterais, cortina e joelho motorista)',
      'Controle de estabilidade VSC e tração TRC',
      'Multimídia Toyota Play com tela de 8"',
      'Faróis de neblina em LED',
      'Bancos de couro preto',
      'Paddle shifts para trocas no volante',
      'Espelho retrovisor eletrocrômico',
      'Sensor crepuscular',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Centro',
    imageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
    galleryImages: [
      '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
      '/images/vehicles/demo/web028-thumb1.png',
      '/images/vehicles/demo/web028-thumb2.png',
    ],
    featured: true,
    sellerType: 'particular',
    sellerName: 'Carlos Eduardo Mendes',
    sellerResponseTime: 'Responde em até 1 hora',
    contactPhoneMasked: '(31) 98765-****',
    contactPhoneFull: '(31) 98765-4321',
    isMockData: true,
  },
  {
    id: 'veh-onix-2023',
    title: 'Chevrolet Onix 2023',
    brand: 'Chevrolet',
    model: 'Onix',
    version: '1.0 Turbo Flex Premier Automático',
    category: 'Carros',
    bodyType: 'Hatch',
    priceCents: 8990000,
    priceFormatted: 'R$ 89.900',
    yearModel: 2023,
    yearManufacture: 2022,
    mileageKm: 15000,
    mileageFormatted: '15.000 km',
    fuel: 'Flex',
    transmission: 'Automático',
    condition: 'Usado',
    color: 'Cinza Manhattan',
    plateEnd: '2',
    doors: 4,
    description:
      'Onix Premier topo de linha. Equipado com carregador por indução, alerta de ponto cego, assistente de estacionamento semi-autônomo e Wi-Fi embarcado. IPVA 2026 integralmente pago.',
    features: [
      'Alerta de ponto cego',
      'Easy Park (estacionamento automático)',
      'Carregador sem fio para smartphone',
      '6 Airbags de série',
      'MyLink de 8" com espelhamento sem cabo',
      'Ar-condicionado digital',
      'Partida remota do motor pela chave',
      'Bancos bicolor em couro ecológico',
      'Sensor de chuva e luminosidade',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Iguaçu',
    imageUrl: '/images/vehicles/demo/chevrolet-onix-2022.jpg',
    galleryImages: [
      '/images/vehicles/demo/chevrolet-onix-2022.jpg',
      '/images/vehicles/demo/web027-thumb1.png',
    ],
    featured: true,
    sellerType: 'concessionaria',
    sellerName: 'AutoCar Multimarcas',
    dealershipId: 'dealer-autocar-multimarcas',
    sellerResponseTime: 'Responde em até 30 minutos',
    contactPhoneMasked: '(31) 3824-****',
    contactPhoneFull: '(31) 3824-5500',
    isMockData: true,
  },
  {
    id: 'veh-creta-2022',
    title: 'Hyundai Creta 2022',
    brand: 'Hyundai',
    model: 'Creta',
    version: '1.0 TGDI Flex Platinum Automático',
    category: 'Carros',
    bodyType: 'SUV',
    priceCents: 10990000,
    priceFormatted: 'R$ 109.900',
    yearModel: 2022,
    yearManufacture: 2022,
    mileageKm: 28500,
    mileageFormatted: '28.500 km',
    fuel: 'Flex',
    transmission: 'Automático',
    condition: 'Usado',
    color: 'Preto Onix',
    plateEnd: '5',
    doors: 4,
    description:
      'Creta Platinum com teto solar panorâmico, ventilação no banco do motorista e câmera 360 graus. Garantia de fábrica Hyundai ativa até 2027.',
    features: [
      'Teto solar panorâmico retrátil',
      'Câmera com visão 360 graus',
      'Banco do motorista com ventilação',
      'Freio de estacionamento eletrônico com Auto Hold',
      'Painel de instrumentos digital de 7"',
      'Central BlueNav de 10.25"',
      'Monitor de ponto cego com display no painel',
      'Faróis em LED adaptativos',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Horto',
    imageUrl: '/images/vehicles/demo/web028-hero.png',
    galleryImages: [
      '/images/vehicles/demo/web028-hero.png',
      '/images/vehicles/demo/web027-thumb2.png',
    ],
    featured: true,
    sellerType: 'concessionaria',
    sellerName: 'Líder Veículos Seminovos',
    dealershipId: 'dealer-lider-seminovos',
    sellerResponseTime: 'Responde em até 15 minutos',
    contactPhoneMasked: '(31) 3822-****',
    contactPhoneFull: '(31) 3822-1000',
    isMockData: true,
  },
  {
    id: 'veh-strada-2023',
    title: 'Fiat Strada 2023',
    brand: 'Fiat',
    model: 'Strada',
    version: '1.3 Volcano Cabine Dupla Flex',
    category: 'Carros',
    bodyType: 'Picape',
    priceCents: 10490000,
    priceFormatted: 'R$ 104.900',
    yearModel: 2023,
    yearManufacture: 2023,
    mileageKm: 21000,
    mileageFormatted: '21.000 km',
    fuel: 'Flex',
    transmission: 'Manual',
    condition: 'Usado',
    color: 'Vermelho Montecarlo',
    plateEnd: '1',
    doors: 4,
    description:
      'Picape cabine dupla para 5 ocupantes. Uso exclusivamente urbano e de passeio, caçamba intacta com capota marítima original e protetor de caçamba.',
    features: [
      'Capota marítima e santo antônio',
      'Faróis Full LED com DRL',
      'Direção elétrica',
      'Central Uconnect de 7" wireless',
      'Controle de tração avançado TC+',
      'Rodas de liga leve aro 16',
      'Bancos com acabamento em tecido e couro',
      'Sensor de estacionamento traseiro',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Centro',
    imageUrl: '/images/vehicles/demo/fiat-strada-2023.jpg',
    galleryImages: [
      '/images/vehicles/demo/fiat-strada-2023.jpg',
      '/images/vehicles/demo/web028-thumb1.png',
    ],
    featured: false,
    sellerType: 'concessionaria',
    sellerName: 'Vale do Aço Motors',
    dealershipId: 'dealer-valedoaco-motors',
    sellerResponseTime: 'Responde em até 1 hora',
    contactPhoneMasked: '(31) 3821-****',
    contactPhoneFull: '(31) 3821-9900',
    isMockData: true,
  },
  {
    id: 'veh-polo-2023',
    title: 'Volkswagen Polo 2023',
    brand: 'Volkswagen',
    model: 'Polo Track',
    version: '1.0 MPI Flex Manual',
    category: 'Carros',
    bodyType: 'Hatch',
    priceCents: 7490000,
    priceFormatted: 'R$ 74.900',
    yearModel: 2023,
    yearManufacture: 2023,
    mileageKm: 18000,
    mileageFormatted: '18.000 km',
    fuel: 'Flex',
    transmission: 'Manual',
    condition: 'Usado',
    color: 'Branco Cristal',
    plateEnd: '6',
    doors: 4,
    description:
      'Polo Track extremamente econômico e robusto. Ideal para o tráfego diário. Revisão de 10.000 km feita na concessionária VW.',
    features: [
      'Ar-condicionado analógico',
      'Direção elétrica',
      '4 Airbags (frontais e laterais)',
      'Controle eletrônico de estabilidade (ESC)',
      'Vidros elétricos dianteiros',
      'Travamento elétrico das portas',
      'Sistema de som com Bluetooth',
      'Assistente de partida em rampas',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Veneza',
    imageUrl: '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
    galleryImages: [
      '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
      '/images/vehicles/demo/vw-polo-2023.jpg',
    ],
    featured: false,
    sellerType: 'particular',
    sellerName: 'Mariana Silva Souza',
    sellerResponseTime: 'Responde em até 2 horas',
    contactPhoneMasked: '(31) 99123-****',
    contactPhoneFull: '(31) 99123-7890',
    isMockData: true,
  },
  {
    id: 'veh-compass-2022',
    title: 'Jeep Compass 2022',
    brand: 'Jeep',
    model: 'Compass',
    version: '1.3 T270 Turbo Flex Longitude Automático',
    category: 'Carros',
    bodyType: 'SUV',
    priceCents: 13990000,
    priceFormatted: 'R$ 139.900',
    yearModel: 2022,
    yearManufacture: 2021,
    mileageKm: 32000,
    mileageFormatted: '32.000 km',
    fuel: 'Flex',
    transmission: 'Automático',
    condition: 'Usado',
    color: 'Cinza Granite',
    plateEnd: '9',
    doors: 4,
    description:
      'SUV de referência nacional. Motor T270 com 185cv de potência e excelente torque. Quadro de instrumentos full digital e sistema de som Premium.',
    features: [
      'Painel de instrumentos full digital 10.25"',
      'Central multimídia de 10.1" com navegação embarcada',
      'Faróis Full LED com assinatura exclusiva',
      'Bancos em couro com ajuste elétrico',
      'Aletas no volante para troca de marcha',
      'Rodas em liga leve aro 18',
      'Sensor de chuva e crepuscular',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Horto',
    imageUrl: '/images/vehicles/demo/web027-nivus.png',
    galleryImages: [
      '/images/vehicles/demo/web027-nivus.png',
      '/images/vehicles/demo/web028-thumb2.png',
    ],
    featured: false,
    sellerType: 'concessionaria',
    sellerName: 'Líder Veículos Seminovos',
    dealershipId: 'dealer-lider-seminovos',
    sellerResponseTime: 'Responde em até 15 minutos',
    contactPhoneMasked: '(31) 3822-****',
    contactPhoneFull: '(31) 3822-1000',
    isMockData: true,
  },
  {
    id: 'veh-cg160-2022',
    title: 'Honda CG 160 Titan 2022',
    brand: 'Honda',
    model: 'CG 160',
    version: 'Titan FlexOne',
    category: 'Motos',
    bodyType: 'Outro',
    priceCents: 1750000,
    priceFormatted: 'R$ 17.500',
    yearModel: 2022,
    yearManufacture: 2022,
    mileageKm: 12000,
    mileageFormatted: '12.000 km',
    fuel: 'Flex',
    transmission: 'Manual',
    condition: 'Usado',
    color: 'Vermelho Perolizado',
    plateEnd: '3',
    doors: 0,
    description:
      'Moto em estado de nova, sem detalhes ou quedas. Partida elétrica, freio CBS a disco dianteiro e painel blackout digital completo.',
    features: [
      'Partida elétrica',
      'Freios CBS combinados com disco dianteiro',
      'Painel digital blackout com conta-giros',
      'Rodas de liga leve aro 18',
      'Injeção eletrônica PGM-FI',
      'Protetor de corrente',
    ],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Canaã',
    imageUrl: '/images/vehicles/demo/honda-cg-160-2022.jpg',
    galleryImages: ['/images/vehicles/demo/honda-cg-160-2022.jpg'],
    featured: false,
    sellerType: 'particular',
    sellerName: 'Rodrigo Antunes',
    sellerResponseTime: 'Responde em até 3 horas',
    contactPhoneMasked: '(31) 98456-****',
    contactPhoneFull: '(31) 98456-7890',
    isMockData: true,
  },
  {
    id: 'veh-volvo-fh540-2021',
    title: 'Volvo FH 540 2021',
    brand: 'Volvo',
    model: 'FH 540',
    version: '6x4 Globetrotter I-Shift',
    category: 'Caminhões',
    bodyType: 'Outro',
    priceCents: 68000000,
    priceFormatted: 'R$ 680.000',
    yearModel: 2021,
    yearManufacture: 2021,
    mileageKm: 240000,
    mileageFormatted: '240.000 km',
    fuel: 'Diesel',
    transmission: 'Automático',
    condition: 'Usado',
    color: 'Prata',
    plateEnd: '0',
    doors: 2,
    description:
      'Cavalo mecânico 6x4 cabine Globetrotter teto alto. Câmbio I-Shift automatizado, retarder hidráulico, defletor de ar original e plano de manutenção ouro Volvo.',
    features: [
      'Câmbio automatizado I-Shift de 12 marchas',
      'Cabine Globetrotter com cama e geladeira',
      'Freio motor VEB + Retarder',
      'Suspensão a ar de 8 bolsas',
      'Controle de cruzeiro adaptativo e sensor de faixa',
      'Tanques de combustível em alumínio de alta capacidade',
    ],
    city: 'Governador Valadares',
    state: 'MG',
    neighborhood: 'Distrito Industrial',
    imageUrl: '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
    galleryImages: ['/images/vehicles/demo/fc-2026-0151-polo-front.jpg'],
    featured: false,
    sellerType: 'concessionaria',
    sellerName: 'Vale do Aço Motors',
    dealershipId: 'dealer-valedoaco-motors',
    sellerResponseTime: 'Responde em até 1 hora',
    contactPhoneMasked: '(31) 3821-****',
    contactPhoneFull: '(31) 3821-9900',
    isMockData: true,
  },
  {
    id: 'veh-compass-2021-sold',
    title: 'Jeep Compass 2021',
    brand: 'Jeep',
    model: 'Compass',
    version: '2.0 Turbo Diesel Limited 4x4 Automático',
    category: 'Carros',
    bodyType: 'SUV',
    priceCents: 14500000,
    priceFormatted: 'R$ 145.000',
    yearModel: 2021,
    yearManufacture: 2021,
    mileageKm: 45000,
    mileageFormatted: '45.000 km',
    fuel: 'Diesel',
    transmission: 'Automático',
    condition: 'Usado',
    color: 'Branco Polar',
    plateEnd: '7',
    doors: 4,
    description:
      'Anúncio finalizado. Veículo comercializado recentemente pelo vendedor. Mantido na lista de favoritos para referência de preço.',
    features: ['Tração 4x4 integral', 'Teto solar panorâmico', 'Bancos em couro'],
    city: 'Ipatinga',
    state: 'MG',
    neighborhood: 'Canaã',
    imageUrl: '/images/vehicles/demo/web028-hero.png',
    galleryImages: ['/images/vehicles/demo/web028-hero.png'],
    featured: false,
    sellerType: 'particular',
    sellerName: 'Marcos Vinícius',
    contactPhoneMasked: '(31) 98888-****',
    contactPhoneFull: '(31) 98888-1111',
    isMockData: true,
    isSold: true,
    isUnavailable: true,
  },
];

export interface VehicleMatchAlert {
  id: string;
  savedSearchId: string;
  savedSearchTitle: string;
  vehicleId: string;
  vehicle: PublicVehicleItem;
  notifiedAt: string;
  isRead: boolean;
}

export const MOCK_BUYER_MATCH_ALERTS: VehicleMatchAlert[] = [
  {
    id: 'alert-match-01',
    savedSearchId: 'search-corolla-ipatinga',
    savedSearchTitle: 'Toyota Corolla em Ipatinga',
    vehicleId: 'veh-corolla-2021',
    vehicle:
      PUBLIC_VEHICLE_CATALOG.find((v) => v.id === 'veh-corolla-2021') ?? PUBLIC_VEHICLE_CATALOG[0],
    notifiedAt: 'Hoje às 09:42',
    isRead: false,
  },
  {
    id: 'alert-match-02',
    savedSearchId: 'search-corolla-ipatinga',
    savedSearchTitle: 'Toyota Corolla em Ipatinga',
    vehicleId: 'veh-civic-2022',
    vehicle:
      PUBLIC_VEHICLE_CATALOG.find((v) => v.id === 'veh-civic-2022') ?? PUBLIC_VEHICLE_CATALOG[0],
    notifiedAt: 'Ontem às 16:30',
    isRead: false,
  },
  {
    id: 'alert-match-03',
    savedSearchId: 'search-motos-mg',
    savedSearchTitle: 'Motos em Minas Gerais',
    vehicleId: 'veh-cg160-2022',
    vehicle:
      PUBLIC_VEHICLE_CATALOG.find((v) => v.id === 'veh-cg160-2022') ?? PUBLIC_VEHICLE_CATALOG[0],
    notifiedAt: '14 de maio às 11:15',
    isRead: true,
  },
  {
    id: 'alert-match-04',
    savedSearchId: 'search-picapes-auto',
    savedSearchTitle: 'Picapes automáticas até R$ 120.000',
    vehicleId: 'veh-strada-2023',
    vehicle:
      PUBLIC_VEHICLE_CATALOG.find((v) => v.id === 'veh-strada-2023') ?? PUBLIC_VEHICLE_CATALOG[0],
    notifiedAt: '10 de maio às 14:05',
    isRead: true,
  },
];

export function getBuyerMatchAlerts(): VehicleMatchAlert[] {
  return [...MOCK_BUYER_MATCH_ALERTS];
}

export interface SearchFilters {
  query?: string;
  category?: 'Carros' | 'Motos' | 'Caminhões' | 'Qualquer';
  brand?: string;
  model?: string;
  bodyType?: 'Sedã' | 'Hatch' | 'SUV' | 'Picape' | 'Qualquer';
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  fuel?: string;
  transmission?: string;
  condition?: string;
  city?: string;
  sortBy?: 'relevancia' | 'menor_preco' | 'maior_preco' | 'menor_km' | 'maior_ano' | 'recentes';
}

export type SearchQueryFilters = SearchFilters;

export function searchPublicCatalog(filters: SearchFilters): {
  results: PublicVehicleItem[];
  totalCount: number;
} {
  let list = PUBLIC_VEHICLE_CATALOG.filter((v) => !v.isSold);

  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.version.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q),
    );
  }

  if (filters.category && filters.category !== 'Qualquer') {
    list = list.filter((v) => v.category === filters.category);
  }

  if (filters.brand && filters.brand !== 'Qualquer') {
    list = list.filter((v) => v.brand.toLowerCase() === filters.brand?.toLowerCase());
  }

  if (filters.model && filters.model !== 'Qualquer') {
    list = list.filter((v) => v.model.toLowerCase() === filters.model?.toLowerCase());
  }

  if (filters.bodyType && filters.bodyType !== 'Qualquer') {
    list = list.filter((v) => v.bodyType === filters.bodyType);
  }

  if (filters.minPrice && filters.minPrice > 0) {
    list = list.filter((v) => v.priceCents >= (filters.minPrice ?? 0) * 100);
  }

  if (filters.maxPrice && filters.maxPrice > 0) {
    list = list.filter((v) => v.priceCents <= (filters.maxPrice ?? 0) * 100);
  }

  if (filters.minYear && filters.minYear > 0) {
    list = list.filter((v) => v.yearModel >= (filters.minYear ?? 0));
  }

  if (filters.maxYear && filters.maxYear > 0) {
    list = list.filter((v) => v.yearModel <= (filters.maxYear ?? 0));
  }

  if (filters.maxMileage && filters.maxMileage > 0) {
    list = list.filter((v) => v.mileageKm <= (filters.maxMileage ?? 0));
  }

  if (filters.fuel && filters.fuel !== 'Qualquer') {
    list = list.filter((v) => v.fuel.toLowerCase() === filters.fuel?.toLowerCase());
  }

  if (filters.transmission && filters.transmission !== 'Qualquer') {
    list = list.filter((v) => v.transmission.toLowerCase() === filters.transmission?.toLowerCase());
  }

  if (filters.condition && filters.condition !== 'Qualquer') {
    list = list.filter((v) => v.condition.toLowerCase() === filters.condition?.toLowerCase());
  }

  if (filters.city && filters.city !== 'Todas as cidades') {
    list = list.filter((v) => v.city.toLowerCase() === filters.city?.toLowerCase());
  }

  // Sorting
  switch (filters.sortBy) {
    case 'menor_preco':
      list.sort((a, b) => a.priceCents - b.priceCents);
      break;
    case 'maior_preco':
      list.sort((a, b) => b.priceCents - a.priceCents);
      break;
    case 'menor_km':
      list.sort((a, b) => a.mileageKm - b.mileageKm);
      break;
    case 'maior_ano':
      list.sort((a, b) => b.yearModel - a.yearModel);
      break;
    default:
      // default determinism
      break;
  }

  return {
    results: list,
    totalCount: list.length,
  };
}

export function getPublicVehicleById(id: string): PublicVehicleItem | undefined {
  return PUBLIC_VEHICLE_CATALOG.find((v) => v.id === id);
}

export function getFeaturedVehicles(): PublicVehicleItem[] {
  return PUBLIC_VEHICLE_CATALOG.filter((v) => v.featured);
}

export function getPublicDealershipById(id: string): PublicDealership | undefined {
  return PUBLIC_DEALERSHIP_CATALOG.find((d) => d.id === id || d.slug === id);
}

export function getVehiclesByDealershipId(dealershipId: string): PublicVehicleItem[] {
  return PUBLIC_VEHICLE_CATALOG.filter((v) => v.dealershipId === dealershipId);
}

export function getAllDealerships(): PublicDealership[] {
  return PUBLIC_DEALERSHIP_CATALOG;
}

/**
 * Mock interaction telemetry for anti-scraping and seller leads.
 * Records phone view event in memory/console without sending raw data to unauthenticated crawlers.
 */
export function recordPhoneRevealInteraction(
  vehicleId: string,
  sellerType: string,
): { status: 'recorded'; timestamp: string; vehicleId: string } {
  const timestamp = new Date().toISOString();
  if (typeof window !== 'undefined') {
    console.info(
      `[TELEMETRY] Phone revealed for vehicle=${vehicleId} sellerType=${sellerType} at=${timestamp}`,
    );
  }
  return {
    status: 'recorded',
    timestamp,
    vehicleId,
  };
}
