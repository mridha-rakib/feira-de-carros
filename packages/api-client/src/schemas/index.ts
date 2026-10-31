import { z } from 'zod';

export const VehicleFiltersSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  minYear: z.number().int().min(1950).optional(),
  maxYear: z.number().int().optional(),
  maxMileage: z.number().nonnegative().optional(),
  fuelType: z.enum(['GASOLINE', 'ETHANOL', 'FLEX', 'DIESEL', 'HYBRID', 'ELECTRIC']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'CVT', 'AUTOMATED']).optional(),
  state: z.string().length(2).optional(),
  city: z.string().optional(),
  status: z
    .enum(['DRAFT', 'PENDING_MODERATION', 'PUBLISHED', 'REJECTED', 'SOLD', 'ARCHIVED'])
    .optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z
    .enum(['price_asc', 'price_desc', 'year_desc', 'mileage_asc', 'created_desc'])
    .optional(),
});

export const CreateVehicleSchema = z.object({
  make: z.string().min(2, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  version: z.string().min(1, 'Versão é obrigatória'),
  yearFabrication: z.number().int().min(1950),
  yearModel: z.number().int().min(1950),
  mileageKm: z.number().nonnegative(),
  priceCents: z.number().positive('Preço deve ser maior que zero'),
  fuelType: z.enum(['GASOLINE', 'ETHANOL', 'FLEX', 'DIESEL', 'HYBRID', 'ELECTRIC']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'CVT', 'AUTOMATED']),
  color: z.string().min(2),
  licensePlateLastDigit: z.string().length(1),
  city: z.string().min(2),
  state: z.string().length(2),
  description: z.string().min(10, 'Descrição mínima de 10 caracteres'),
  images: z.array(z.string().url()).min(1, 'Ao menos uma foto é necessária'),
});

export const CreateLeadSchema = z.object({
  vehicleId: z.string().uuid(),
  buyerName: z.string().min(3, 'Nome completo é necessário'),
  buyerEmail: z.string().email('E-mail inválido'),
  buyerPhone: z.string().min(10, 'Telefone inválido'),
  message: z.string().max(500).optional(),
});
