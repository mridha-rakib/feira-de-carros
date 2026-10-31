export type DealershipStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export type SubscriptionTier = 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export interface Dealership {
  id: string;
  name: string;
  tradingName: string;
  taxId: string; // CNPJ
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: DealershipStatus;
  subscriptionTier: SubscriptionTier;
  activeListingsCount: number;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
