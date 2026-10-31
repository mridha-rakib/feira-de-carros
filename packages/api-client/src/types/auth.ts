/**
 * Authentic OpenAPI v0.2 / SRS v0.5 User Roles
 */
export type UserRole =
  | 'main_admin'
  | 'sales'
  | 'support'
  | 'member'
  | 'seller'
  | 'dealer'
  | 'public';

export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED' | 'DELETED';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accountStatus: AccountStatus;
  phone?: string;
  dealershipId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionClaim {
  sub: string;
  email: string;
  role: UserRole;
  dealershipId?: string;
  exp: number;
  iat: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthSessionSummary {
  user_id: string;
  authenticated: boolean;
  account_status?: string;
}

export interface ResponseLoginWithPassword {
  data: AuthSessionSummary;
  request_id: string;
  meta?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  field: string;
  reason: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  request_id: string;
  details?: ApiErrorDetail[];
}
