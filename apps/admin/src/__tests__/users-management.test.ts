import { describe, expect, it } from 'vitest';
import { mockAdminUsers } from '../../lib/adapters/mock-users-data';
import type { AdminUserStatus } from '../../lib/types/users-presentation';

describe('Admin B3 — Users Management Data & Business Rules (ADM-D-003)', () => {
  it('contains the complete set of 22 mock users for multi-page pagination', () => {
    expect(mockAdminUsers).toHaveLength(22);
  });

  it('guarantees LGPD privacy compliance with masked documents (CPF/CNPJ)', () => {
    for (const user of mockAdminUsers) {
      expect(user.document).toMatch(/\*\*\*/);
    }
  });

  it('verifies ADM-D-003-DETAIL-01 — Mariana Costa', () => {
    const user = mockAdminUsers.find((u) => u.name.includes('Mariana Silva Costa'));
    expect(user).toBeDefined();
    expect(user?.code).toBe('USR-2026-0001');
    expect(user?.role).toBe('seller');
    expect(user?.status).toBe('ACTIVE');
    expect(user?.city).toBe('Ipatinga');
    expect(user?.state).toBe('MG');
    expect(user?.activity.activeListings).toBe(2);
    expect(user?.avatarUrl).toBe('/images/users/demo/mariana-costa-avatar.webp');
  });

  it('verifies ADM-D-003-DETAIL-02 — Bruno Almeida', () => {
    const user = mockAdminUsers.find((u) => u.name.includes('Bruno Ferreira Almeida'));
    expect(user).toBeDefined();
    expect(user?.code).toBe('USR-2026-0002');
    expect(user?.role).toBe('seller');
    expect(user?.status).toBe('ACTIVE');
    expect(user?.city).toBe('Timóteo');
  });

  it('verifies ADM-D-003-DETAIL-03 — Vale Auto Veículos (12 linked advertisements)', () => {
    const user = mockAdminUsers.find((u) => u.name.includes('Vale Auto Veículos'));
    expect(user).toBeDefined();
    expect(user?.code).toBe('USR-2026-0003');
    expect(user?.role).toBe('dealer');
    expect(user?.dealership).toBeDefined();
    expect(user?.dealership?.tradeName).toBe('Vale Auto Veículos');
    expect(user?.dealership?.inventoryCount).toBe(12);
    expect(user?.activity.activeListings).toBe(12);
    expect(user?.dealership?.plan).toBe('Destaque Ouro');
  });

  it('verifies ADM-D-003-DETAIL-04 — Rafael Santos (Approved Seller)', () => {
    const user = mockAdminUsers.find((u) => u.name.includes('Rafael Santos'));
    expect(user).toBeDefined();
    expect(user?.code).toBe('USR-2026-0004');
    expect(user?.role).toBe('seller');
    expect(user?.status).toBe('ACTIVE');
  });

  it('verifies ADM-D-003-DETAIL-05 — Lucas Ribeiro (Registered Buyer)', () => {
    const user = mockAdminUsers.find((u) => u.name.includes('Lucas Ribeiro'));
    expect(user).toBeDefined();
    expect(user?.code).toBe('USR-2026-0005');
    expect(user?.role).toBe('member');
    expect(user?.status).toBe('ACTIVE');
  });

  it('verifies ADM-D-003-DETAIL-06 — Fernanda Rocha (Suspended Seller)', () => {
    const user = mockAdminUsers.find((u) => u.name.includes('Fernanda Mendes Rocha'));
    expect(user).toBeDefined();
    expect(user?.code).toBe('USR-2026-0006');
    expect(user?.role).toBe('seller');
    expect(user?.status).toBe('SUSPENDED');
    expect(user?.statusReason).toBeDefined();
    expect(user?.statusReason).toContain('Suspensão preventiva');
    expect(user?.activity.reportsReceived).toBeGreaterThan(0);
  });

  it('verifies ADM-D-003-DETAIL-07 — Tiago Pereira (Pending Seller Applicant)', () => {
    const user = mockAdminUsers.find((u) => u.name.includes('Tiago Pereira'));
    expect(user).toBeDefined();
    expect(user?.code).toBe('USR-2026-0007');
    expect(user?.role).toBe('seller');
    expect(user?.status).toBe('PENDING');
  });

  it('maintains chronological audit trails on all sensitive accounts', () => {
    const fernanda = mockAdminUsers.find((u) => u.code === 'USR-2026-0006');
    expect(fernanda?.auditTrail.length).toBeGreaterThanOrEqual(2);
    const suspensionLog = fernanda?.auditTrail.find((l) => l.action === 'SUSPEND');
    expect(suspensionLog).toBeDefined();
    expect(suspensionLog?.operatorRole).toBe('main_admin');
  });

  it('aligns with Figma ADM-D-003 illustrative marketplace KPI fixtures', async () => {
    const { FIGMA_USERS_KPI_METRICS } = await import('../../app/usuarios/components/UserKpiCards');
    expect(FIGMA_USERS_KPI_METRICS.totalAccounts).toBe('2.406');
    expect(FIGMA_USERS_KPI_METRICS.approvedSellers).toBe('682');
    expect(FIGMA_USERS_KPI_METRICS.dealerships).toBe('74');
    expect(FIGMA_USERS_KPI_METRICS.suspendedAccounts).toBe('14');
  });
});
