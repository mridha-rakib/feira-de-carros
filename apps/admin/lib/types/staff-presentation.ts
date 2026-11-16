export type StaffRole = 'sales' | 'support' | 'main_admin';

export type StaffStatus = 'active' | 'suspended';

export interface StaffMember {
  id: string; // e.g. STF-DEMO-0001
  name: string;
  email: string;
  emailMasked: string;
  role: StaffRole;
  status: StaffStatus;
  department: string;
  location: string;
  createdAt: string;
  lastAccess: string;
  sensitivePermissionsState: 'DENY_PENDING' | 'AUTHORIZED';
  notes: string;
}

export interface StaffKpiSummary {
  totalStaff: number; // 4
  salesCount: number; // 2
  supportCount: number; // 2
  sensitiveOperationsHoldCount: number; // 12
}

export interface StaffPermissionMatrixItem {
  id: string;
  operation: string;
  mainAdmin: string;
  sales: string;
  support: string;
  policy: string;
  isSensitive: boolean;
  category: string;
}
