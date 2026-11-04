/**
 * Types for Admin B2 operations:
 * - ADM-D-005 & ADM-M-002: Seller Approval Queue & Verification Detail
 * - ADM-D-014 & ADM-M-003: Advertisements Moderation Queue & Review Detail
 */

export type SellerApplicationStatus = 'pending' | 'approved' | 'rejected' | 'corrections';

export type SellerType = 'particular' | 'concessionaria';

export interface SellerApplication {
  id: string;
  code: string;
  name: string;
  tradeName?: string;
  email: string;
  phone: string;
  type: SellerType;
  document: string; // Masked for privacy (LGPD compliance)
  city: string;
  state: string;
  submittedAt: string;
  status: SellerApplicationStatus;
  documentProofName: string;
  addressProofName: string;
  activeInventoryCount?: number;
  rejectionReason?: string;
  verifiedAt?: string;
}

export type ModerationAdStatus = 'pending' | 'approved' | 'rejected' | 'corrections';

export type AdPlan = 'Básico' | 'Destaque Prata' | 'Destaque Ouro';

export interface ModerationAd {
  id: string;
  code: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceFormatted: string;
  fipePrice: number;
  fipePriceFormatted: string;
  fipeVariation: string;
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  plateMasked: string;
  location: string;
  sellerName: string;
  sellerType: SellerType;
  sellerVerified: boolean;
  plan: AdPlan;
  status: ModerationAdStatus;
  submittedAt: string;
  photos: string[];
  description: string;
  rejectionReason?: string;
}
