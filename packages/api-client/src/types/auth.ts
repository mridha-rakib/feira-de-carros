export type UserRole =
  | 'BUYER'
  | 'SELLER'
  | 'DEALER_OWNER'
  | 'DEALER_STAFF'
  | 'SUPER_ADMIN'
  | 'SALES_AGENT'
  | 'SUPPORT_REP';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
