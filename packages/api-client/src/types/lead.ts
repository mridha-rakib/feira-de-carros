export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'IN_NEGOTIATION' | 'WON' | 'LOST';

export interface Lead {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  dealershipId?: string;
  sellerId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message?: string;
  status: LeadStatus;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
}
