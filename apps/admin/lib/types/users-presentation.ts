/**
 * Types for Admin B3 operations:
 * - ADM-D-003: User Management Directory & Account Dossier Panel
 * - ADM-D-003-DETAIL-01 to 07: Specific User Detail Reference States
 * - ADM-D-009: Suspension & Block Action Review
 * - ADM-M-008: Mobile User Directory & Inspection
 */

export type AdminUserRole = 'main_admin' | 'sales' | 'support' | 'member' | 'seller' | 'dealer';

export type AdminUserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';

export interface DealershipProfile {
  id: string;
  tradeName: string; // Nome fantasia (ex: Vale Auto Veículos)
  corporateName: string; // Razão social
  cnpj: string; // CNPJ mascarado para LGPD
  inventoryCount: number;
  plan: 'Básico' | 'Destaque Prata' | 'Destaque Ouro';
  address: string;
  city: string;
  state: string;
  phone: string;
  logoUrl?: string;
}

export interface UserActivitySummary {
  activeListings: number;
  totalListings: number;
  favoritesCount: number;
  savedSearchesCount: number;
  reportsReceived: number;
  lastActiveDate: string;
}

export interface UserStatusAuditEntry {
  id: string;
  timestamp: string;
  action: 'ACTIVATE' | 'SUSPEND' | 'BAN' | 'CREATE';
  fromStatus: AdminUserStatus;
  toStatus: AdminUserStatus;
  reason: string;
  operator: string;
  operatorRole: string;
}

export interface AdminUserRecord {
  id: string;
  code: string; // ex: USR-2026-0001
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  document: string; // Masked CPF/CNPJ (LGPD compliance)
  city: string;
  state: string;
  registeredAt: string;
  lastAccessAt: string;
  verified: boolean;
  statusReason?: string;
  avatarUrl?: string;
  dealership?: DealershipProfile;
  activity: UserActivitySummary;
  auditTrail: UserStatusAuditEntry[];
}
