import type { Vehicle } from '@feira/api-client';

export const mockVehicle: Vehicle = {
  id: 'veh-123e4567-e89b-12d3-a456-426614174000',
  sellerId: 'seller-1',
  dealershipId: 'dealer-1',
  make: 'Toyota',
  model: 'Corolla',
  version: '2.0 XEi Flex Automático',
  yearFabrication: 2023,
  yearModel: 2024,
  mileageKm: 18500,
  priceCents: 14290000, // R$ 142.900,00
  currency: 'BRL',
  fuelType: 'FLEX',
  transmission: 'AUTOMATIC',
  color: 'Prata Lunar',
  licensePlateLastDigit: '8',
  city: 'São Paulo',
  state: 'SP',
  description: 'Único dono, revisões feitas na concessionária, manual e chave reserva.',
  images: [
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
  ],
  status: 'PUBLISHED',
  featured: true,
  createdAt: '2026-10-15T10:00:00.000Z',
  updatedAt: '2026-10-15T10:00:00.000Z',
};
