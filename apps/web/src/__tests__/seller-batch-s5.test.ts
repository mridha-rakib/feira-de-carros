import { describe, expect, it } from 'vitest';
import { getListingAnalytics } from '../../lib/adapters/seller-analytics-adapter';
import {
  getConversationById,
  getConversationMessages,
  getConversations,
  getUnreadMessagesCount,
} from '../../lib/adapters/seller-messages-adapter';
import {
  createRefundRequest,
  getRefundById,
  getRefundByOrderId,
  getRefundKpis,
  getRefundsList,
} from '../../lib/adapters/seller-refunds-adapter';
import { getUserProfile, updateUserProfile } from '../../lib/adapters/user-account-adapter';

describe('Seller Frontend Batch S5 — Final Screens Test Suite', () => {
  // ==========================================
  // WEB-039: Listing Analytics Tests
  // ==========================================
  describe('WEB-039: Listing Analytics & Metrics', () => {
    it('returns 7-day metric summaries and daily trends for a valid listing', () => {
      const analytics = getListingAnalytics('FC-2026-0151');
      expect(analytics).toBeDefined();
      expect(analytics?.listingId).toBe('FC-2026-0151');
      expect(analytics?.totalDetailViews).toBeGreaterThan(0);
      expect(analytics?.totalImpressions).toBeGreaterThanOrEqual(analytics?.totalDetailViews || 0);
      expect(analytics?.dailyMetrics.length).toBe(7);

      // Verify daily data shape
      for (const day of analytics?.dailyMetrics || []) {
        expect(day.date).toBeDefined();
        expect(day.dayLabel).toBeDefined();
        expect(day.impressions).toBeGreaterThanOrEqual(0);
        expect(day.detailViews).toBeGreaterThanOrEqual(0);
        expect(day.contactsStarted).toBeGreaterThanOrEqual(0);
      }
    });

    it('strictly returns undefined for an unknown listing ID (enforcing data isolation)', () => {
      const unknown = getListingAnalytics('NONEXISTENT-999');
      expect(unknown).toBeUndefined();

      const anotherUnknown = getListingAnalytics('OTHER-USER-VEHICLE-1234');
      expect(anotherUnknown).toBeUndefined();
    });

    it('returns undefined for empty listing ID', () => {
      const missing = getListingAnalytics('');
      expect(missing).toBeUndefined();
    });
  });

  // ==========================================
  // WEB-045 & WEB-046: Buyer/Seller Messaging Tests
  // ==========================================
  describe('WEB-045 & WEB-046: Messaging & Conversations', () => {
    it('returns conversations list with correct buyer and vehicle details', () => {
      const convs = getConversations();
      expect(convs.length).toBeGreaterThanOrEqual(5);

      const first = convs[0];
      expect(first.id).toBeDefined();
      expect(first.buyerName).toBeDefined();
      expect(first.buyerInitials).toBeDefined();
      expect(first.vehicleTitle).toBeDefined();
      expect(first.vehiclePriceFormatted).toBeDefined();
      expect(first.status).toBeDefined();
    });

    it('filters conversations by tab (unread, archived)', () => {
      const unreadConvs = getConversations({ tab: 'unread' });
      for (const conv of unreadConvs) {
        expect(conv.unreadCount).toBeGreaterThan(0);
      }

      const archivedConvs = getConversations({ tab: 'archived' });
      for (const conv of archivedConvs) {
        expect(conv.status).toBe('archived');
      }
    });

    it('filters conversations by search term', () => {
      const searched = getConversations({ search: 'Nivus' });
      expect(searched.length).toBeGreaterThan(0);
      for (const c of searched) {
        const matches =
          c.vehicleTitle.includes('Nivus') ||
          c.buyerName.includes('Nivus') ||
          c.lastMessage.includes('Nivus');
        expect(matches).toBe(true);
      }
    });

    it('computes unread messages count accurately', () => {
      const unread = getUnreadMessagesCount();
      const convs = getConversations();
      const expectedUnread = convs.reduce((acc, c) => acc + c.unreadCount, 0);
      expect(unread).toBe(expectedUnread);
      expect(unread).toBeGreaterThanOrEqual(0);
    });

    it('retrieves conversation by ID with valid messages thread', () => {
      const conv = getConversationById('CONV-001');
      expect(conv).toBeDefined();
      expect(conv?.buyerName).toContain('Carlos');

      const messages = getConversationMessages('CONV-001');
      expect(messages.length).toBeGreaterThan(0);

      // Verify alternating or valid sender roles
      const senders = new Set(messages.map((m) => m.sender));
      expect(senders.has('buyer')).toBe(true);
      expect(senders.has('seller')).toBe(true);
    });

    it('returns undefined for nonexistent conversation ID', () => {
      const nonExistent = getConversationById('CONV-NOT-FOUND');
      expect(nonExistent).toBeUndefined();
    });

    it('returns empty array when querying messages for unknown conversation', () => {
      const messages = getConversationMessages('CONV-UNKNOWN');
      expect(messages).toEqual([]);
    });
  });

  // ==========================================
  // WEB-049 & WEB-050: Refunds Tests
  // ==========================================
  describe('WEB-049 & WEB-050: Refund Management & Verification', () => {
    it('returns list of seller refunds with valid Brazilian status formatting', () => {
      const refunds = getRefundsList();
      expect(refunds.length).toBeGreaterThanOrEqual(2);

      for (const r of refunds) {
        expect(['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']).toContain(r.status);
        expect(r.amountFormatted).toMatch(/R\$\s*\d+,\d{2}/);
        expect(r.id).toMatch(/^REF-/);
        expect(r.orderId).toBeDefined();
      }
    });

    it('retrieves refund by ID and by Order ID correctly', () => {
      const refund = getRefundById('REF-2026-001');
      expect(refund).toBeDefined();
      expect(refund?.id).toBe('REF-2026-001');
      expect(refund?.status).toBe('UNDER_REVIEW');

      const byOrder = getRefundByOrderId('PED-DEMO-2026-015');
      expect(byOrder).toBeDefined();
      expect(byOrder?.id).toBe('REF-2026-001');
    });

    it('returns undefined for unknown refund ID or order ID', () => {
      const missing = getRefundById('REF-NONEXISTENT');
      expect(missing).toBeUndefined();

      const missingOrder = getRefundByOrderId('ORDER-NONEXISTENT');
      expect(missingOrder).toBeUndefined();
    });

    it('calculates refund KPIs correctly', () => {
      const kpis = getRefundKpis();
      expect(kpis.totalCount).toBeGreaterThanOrEqual(2);
      expect(kpis.pendingCount).toBeGreaterThanOrEqual(1);
      expect(kpis.totalApprovedFormatted).toMatch(/R\$\s*\d+,\d{2}/);
    });

    it('creates a new pending refund request with proper protocol', () => {
      const newRefund = createRefundRequest({
        orderId: 'PED-TEST-999',
        listingId: 'FC-2026-0151',
        listingTitle: 'Volkswagen Polo Track 2023',
        planName: 'Plano Básico',
        amountCents: 3000,
        amountFormatted: 'R$ 30,00',
        paymentMethod: 'Pix',
        reason: 'Veículo vendido antes do término do plano',
        details: 'Vendido fora da plataforma em 3 dias.',
      });

      expect(newRefund).toBeDefined();
      expect(newRefund.status).toBe('REQUESTED');
      expect(newRefund.statusLabel).toBe('Solicitação recebida');
      expect(newRefund.id).toMatch(/^REF-2026-\d{3}$/);
      expect(newRefund.orderId).toBe('PED-TEST-999');

      // Verify it can be retrieved now
      const retrieved = getRefundById(newRefund.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(newRefund.id);
    });
  });

  // ==========================================
  // WEB-012: User Account & Settings Tests
  // ==========================================
  describe('WEB-012: User Account Settings & Profile Security', () => {
    it('returns user profile with masked CPF to protect PII', () => {
      const profile = getUserProfile();
      expect(profile).toBeDefined();
      expect(profile.fullName).toBe('Mariana Silva');
      expect(profile.email).toBe('mariana.silva@email.com');

      // CPF MUST be masked
      expect(profile.cpfMasked).toMatch(/\*\*\*\.\d{3}\.\d{3}-\*\*/);
    });

    it('allows updating editable fields (phone, name, notification preferences)', () => {
      const updated = updateUserProfile({
        phone: '(31) 98888-7777',
        notifications: {
          emailMarketing: true,
          whatsappAlerts: false,
        },
      });

      expect(updated.phone).toBe('(31) 98888-7777');
      expect(updated.notifications.emailMarketing).toBe(true);
      expect(updated.notifications.whatsappAlerts).toBe(false);

      // Verify persistence via getter
      const fresh = getUserProfile();
      expect(fresh.phone).toBe('(31) 98888-7777');
      expect(fresh.notifications.whatsappAlerts).toBe(false);

      // Verify CPF remains masked and cannot be erased
      expect(fresh.cpfMasked).toMatch(/\*\*\*\.\d{3}\.\d{3}-\*\*/);
    });
  });
});
