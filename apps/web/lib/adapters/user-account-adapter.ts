import type { UserProfileData } from '../types/seller-presentation';

export const MOCK_USER_PROFILE: UserProfileData = {
  id: 'USR-2026-0914',
  fullName: 'Mariana Silva',
  email: 'mariana.silva@email.com',
  phone: '(31) 98765-4321',
  city: 'Ipatinga',
  state: 'MG',
  cpfMasked: '***.456.789-**',
  roleLabel: 'Vendedor aprovado (demo)',
  emailVerified: true,
  phoneVerified: true,
  notifications: {
    emailMarketing: false,
    whatsappAlerts: true,
    newMessages: true,
    statusUpdates: true,
  },
  isMockData: true,
};

export function getUserProfile(): UserProfileData {
  return { ...MOCK_USER_PROFILE };
}

export function updateUserProfile(
  updates: Partial<Omit<UserProfileData, 'notifications'>> & {
    notifications?: Partial<UserProfileData['notifications']>;
  },
): UserProfileData {
  if (updates.fullName) MOCK_USER_PROFILE.fullName = updates.fullName;
  if (updates.phone) MOCK_USER_PROFILE.phone = updates.phone;
  if (updates.city) MOCK_USER_PROFILE.city = updates.city;
  if (updates.state) MOCK_USER_PROFILE.state = updates.state;
  if (updates.notifications) {
    MOCK_USER_PROFILE.notifications = {
      ...MOCK_USER_PROFILE.notifications,
      ...updates.notifications,
    };
  }
  return { ...MOCK_USER_PROFILE };
}
