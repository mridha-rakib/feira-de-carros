/**
 * Types for B7B Final Settings & Content Screens:
 * - ADM-D-050: Homepage Featured Content (/configuracoes/destaques)
 * - ADM-D-051: Notification Templates (/configuracoes/notificacoes)
 * - ADM-D-052: Contact & Support (/configuracoes/contato)
 * - ADM-D-053: Terms & Privacy (/configuracoes/termos-privacidade)
 * - ADM-M-011: Mobile Settings (/configuracoes)
 * - ADM-M-012: Mobile Admin Profile (/perfil)
 */

export interface FeaturedAdvertisementRecord {
  id: string; // e.g. FC-2026-0142
  vehicleTitle: string; // e.g. Fiat Strada Endurance 2023
  sellerName: string; // e.g. Mariana Costa
  sellerType: 'INDIVIDUAL' | 'DEALERSHIP';
  location: string; // e.g. Ipatinga, MG
  priceFormatted: string; // e.g. R$ 82.900
  imageThumbnail: string; // cropped vehicle photo
  status: 'ACTIVE' | 'PENDING' | 'INELIGIBLE';
  statusLabel: string;
  boostPlan: string; // e.g. BST-07D-001 (7 dias)
  boostRemainingDays: number;
  boostPaid: boolean;
  isSold: boolean;
  isApproved: boolean;
  eligibilityCriteria: {
    isApproved: boolean;
    isPaid: boolean;
    isActive: boolean;
    isUnsold: boolean;
  };
  slotPositionPreview: number;
  rotationStatus: string;
}

export interface NotificationTemplateRecord {
  id: string; // e.g. TPL-MSG-01
  name: string;
  category: 'Comunicação' | 'Alertas' | 'Ciclo de Anúncio' | 'Financeiro';
  channels: Array<'EMAIL' | 'PUSH'>;
  status: 'ACTIVE' | 'DRAFT';
  statusLabel: string;
  subject: string;
  bodyText: string;
  variables: string[];
  privacyLevel: string;
  lastModified: string;
}

export interface ContactSettingsRecord {
  officialEmail: string;
  emailStatus: string;
  officialPhone: string;
  phoneStatus: string;
  businessHours: string;
  hoursStatus: string;
  headquartersCity: string;
  headquartersState: string;
  physicalAddress: string;
  addressStatus: string;
  supportRoutingLevel: string;
  permissionRequired: string;
}

export interface LegalDocumentRecord {
  id: string; // LEGAL-TERMS | LEGAL-PRIVACY
  title: string;
  version: string;
  language: string;
  status: 'DRAFT_PENDING_APPROVAL' | 'IN_REVIEW';
  statusLabel: string;
  lastRevised: string;
  effectiveDate: string;
  summary: string;
  sections: Array<{
    id: string;
    title: string;
    excerpt: string;
  }>;
  auditTrail: Array<{
    date: string;
    actor: string;
    action: string;
  }>;
}

export interface AdminProfileRecord {
  id: string; // ADM-DEMO-0001
  name: string; // Admin principal
  role: string; // Main Admin
  roleBadge: string;
  emailMasked: string; // a***@exemplo.com
  location: string; // Ipatinga, MG
  assignedUnit: string;
  lastLogin: string;
  sessionStatus: string;
  mfaStatus: string;
}
