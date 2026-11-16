/**
 * Types for Seller Presentation Layer matching OpenAPI v0.2 and Figma WEB-016/018/019/020
 */

export type ApplicationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED';

export type SellerListingStatus =
  | 'PUBLISHED'
  | 'PENDING_REVIEW'
  | 'PENDING_PAYMENT'
  | 'REJECTED'
  | 'SOLD';

export interface SellerApplicantData {
  fullName: string;
  cpfMasked: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  registrationType: string;
  address?: string;
}

export interface SellerApplicationPresentation {
  id: string;
  protocol: string;
  status: ApplicationStatus;
  statusLabel: string;
  submittedAtFormatted: string;
  reviewedAtFormatted?: string;
  applicant: SellerApplicantData;
  correctionReason?: string;
  rejectionReason?: string;
  isMockData: boolean;
}

export interface SellerListingItem {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  model: string;
  category: string;
  fuel: string;
  mileageKm: number;
  mileageFormatted: string;
  priceCents: number;
  priceFormatted: string;
  status: SellerListingStatus;
  statusLabel: string;
  createdAtFormatted: string;
  createdAtTime: string;
  imageUrl: string;
  isMockData: boolean;
}

export interface SellerDashboardKpis {
  totalListings: number;
  publishedCount: number;
  underReviewCount: number;
  pendingPaymentCount: number;
}
