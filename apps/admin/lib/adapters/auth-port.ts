import type { AuthSessionSummary, LoginRequest, UserProfile } from '@feira/api-client';

export interface AuthPort {
  login(request: LoginRequest): Promise<AuthSessionSummary>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
}
