/**
 * Types for Seller Presentation Layer matching OpenAPI v0.2 and Figma WEB-016/018/019/020
 */

export type ApplicationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED';

export type SellerListingStatus =
  | 'PUBLISHED'
  | 'PENDING_REVIEW'
  | 'PENDING_PAYMENT'
  | 'CORRECTION_REQUESTED'
  | 'REVISED_PENDING'
  | 'REJECTED'
  | 'SOLD';

export interface SellerListingCorrection {
  reasons: string[];
  comments: string;
  requestedAt: string;
}

export interface SellerListingRevision {
  id: string;
  listingId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  createdAtFormatted: string;
  priceCents: number;
  priceFormatted: string;
  mileageKm: number;
  mileageFormatted: string;
  description: string;
  photos: string[];
}

export interface SellerListingDetail extends SellerListingItem {
  yearModel: number;
  yearManufacture: number;
  transmission: string;
  color: string;
  doors: number;
  city: string;
  state: string;
  description: string;
  plan: string;
  expiresAtFormatted: string;
  validityDays: number;
  galleryImages: string[];
  metrics: {
    totalViews: number;
    favorites: number;
    messages: number;
    viewsLast7Days: number;
  };
  correction?: SellerListingCorrection;
  pendingRevision?: SellerListingRevision;
  history?: Array<{
    date: string;
    title: string;
    description: string;
  }>;
}

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
