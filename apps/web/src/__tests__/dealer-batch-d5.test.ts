import {
  createDealerOrder,
  getDealerOrderById,
  saveDealerOrder,
  updateDealerOrderStatus,
} from '@/lib/adapters/dealer-orders-adapter';
import {
  DEALER_BOOST,
  DEALER_PLANS,
  DEALER_RENEWAL,
  formatDealerBRL,
  getDealerMaxPhotos,
} from '@/lib/constants/dealer-commercial';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import { useDealerMessagesStore } from '@/stores/use-dealer-messages-store';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Dealer Batch D5 Unit Tests — Messaging, Advertising Plans, Renewal, Boost & Isolation', () => {
  beforeEach(() => {
    useDealerMessagesStore.getState().resetToDefaults();
    useDealerInventoryStore.getState().resetToFixtures();
  });

  describe('Dealership Messaging Store (WEB-045, WEB-046, WEB-048)', () => {
    it('1. should initialize with deterministic dealership conversations', () => {
      const state = useDealerMessagesStore.getState();
      expect(state.conversations.length).toBeGreaterThanOrEqual(3);

      const conv1 = state.conversations.find((c) => c.id === 'DLR-CONV-001');
      expect(conv1).toBeDefined();
      expect(conv1?.buyerName).toBe('Carlos Eduardo Menezes');
      expect(conv1?.vehicleTitle).toContain('Honda Civic');
      expect(conv1?.unreadCount).toBe(2);
      expect(conv1?.status).toBe('active');
    });

    it('2. should mark a conversation as read and zero out unreadCount', () => {
      const store = useDealerMessagesStore.getState();
      expect(store.conversations.find((c) => c.id === 'DLR-CONV-001')?.unreadCount).toBe(2);

      store.markAsRead('DLR-CONV-001');

      const updated = useDealerMessagesStore
        .getState()
        .conversations.find((c) => c.id === 'DLR-CONV-001');
      expect(updated?.unreadCount).toBe(0);
    });

    it('3. should append a dealer response message and update lastMessage timestamp', () => {
      const store = useDealerMessagesStore.getState();
      const prevMessageCount =
        store.conversations.find((c) => c.id === 'DLR-CONV-001')?.messages.length || 0;

      store.sendMessage(
        'DLR-CONV-001',
        'Sim, temos condições especiais para financiamento este sábado!',
      );

      const updated = useDealerMessagesStore
        .getState()
        .conversations.find((c) => c.id === 'DLR-CONV-001');
      expect(updated?.messages.length).toBe(prevMessageCount + 1);

      const lastMsg = updated?.messages[updated.messages.length - 1];
      expect(lastMsg?.sender).toBe('dealer');
      expect(lastMsg?.senderName).toBe('Líder Veículos Seminovos');
      expect(lastMsg?.text).toBe('Sim, temos condições especiais para financiamento este sábado!');
      expect(updated?.lastMessage).toBe(
        'Sim, temos condições especiais para financiamento este sábado!',
      );
    });

    it('4. should archive and unarchive conversations', () => {
      const store = useDealerMessagesStore.getState();
      store.archiveConversation('DLR-CONV-002');

      let conv = useDealerMessagesStore
        .getState()
        .conversations.find((c) => c.id === 'DLR-CONV-002');
      expect(conv?.status).toBe('archived');

      store.unarchiveConversation('DLR-CONV-002');
      conv = useDealerMessagesStore.getState().conversations.find((c) => c.id === 'DLR-CONV-002');
      expect(conv?.status).toBe('active');
    });

    it('5. should open and close reporting & blocking modal', () => {
      const store = useDealerMessagesStore.getState();
      expect(store.isReportingModalOpen).toBe(false);

      store.openReportingModal('DLR-CONV-001');
      expect(useDealerMessagesStore.getState().isReportingModalOpen).toBe(true);
      expect(useDealerMessagesStore.getState().reportingTargetConvId).toBe('DLR-CONV-001');

      store.closeReportingModal();
      expect(useDealerMessagesStore.getState().isReportingModalOpen).toBe(false);
      expect(useDealerMessagesStore.getState().reportingTargetConvId).toBeNull();
    });

    it('6. should report and block a contact, setting status to locked (WEB-048)', () => {
      const store = useDealerMessagesStore.getState();
      store.reportAndBlockConversation('DLR-CONV-003', 'Tentativa de golpe ou fraude financeira');

      const blockedConv = useDealerMessagesStore
        .getState()
        .conversations.find((c) => c.id === 'DLR-CONV-003');
      expect(blockedConv?.isBlocked).toBe(true);
      expect(blockedConv?.blockReason).toBe('Tentativa de golpe ou fraude financeira');
      expect(blockedConv?.status).toBe('locked');
      expect(blockedConv?.lockedReason).toBe('Tentativa de golpe ou fraude financeira');
      expect(useDealerMessagesStore.getState().isReportingModalOpen).toBe(false);
      expect(useDealerMessagesStore.getState().feedbackMessage).toContain('bloqueado com sucesso');
    });

    it('7. should filter conversations by search query and active tab', () => {
      const store = useDealerMessagesStore.getState();
      store.setSearchQuery('Civic');
      expect(useDealerMessagesStore.getState().searchQuery).toBe('Civic');

      store.setActiveTab('unread');
      expect(useDealerMessagesStore.getState().activeTab).toBe('unread');
    });
  });

  describe('Dealership Advertising Plans & Inventory Lifecycle (WEB-021, WEB-029, WEB-036, WEB-037)', () => {
    it('8. should update vehicle plan to essential or premium', () => {
      const store = useDealerInventoryStore.getState();
      store.updateVehiclePlan('dlr-veh-001', 'essential');

      let vehicle = useDealerInventoryStore.getState().getVehicleById('dlr-veh-001');
      expect(vehicle?.plan).toBe('essential');
      expect(vehicle?.planLabel).toBe('Plano Essencial');

      store.updateVehiclePlan('dlr-veh-001', 'premium');
      vehicle = useDealerInventoryStore.getState().getVehicleById('dlr-veh-001');
      expect(vehicle?.plan).toBe('premium');
      expect(vehicle?.planLabel).toBe('Plano Premium');
    });

    it('9. should boost vehicle, setting isBoosted and incrementing views (WEB-036)', () => {
      const store = useDealerInventoryStore.getState();
      const initialViews =
        useDealerInventoryStore.getState().getVehicleById('dlr-veh-002')?.viewsCount || 0;

      store.boostVehicle('dlr-veh-002');

      const boosted = useDealerInventoryStore.getState().getVehicleById('dlr-veh-002');
      expect(boosted?.isBoosted).toBe(true);
      expect(boosted?.boostedUntil).toBeDefined();
      expect(boosted?.viewsCount).toBe(initialViews + 150);
      expect(boosted?.viewsLabel).toContain('visualizações');
    });

    it('10. should renew vehicle listing, extending expiration (WEB-037)', () => {
      const store = useDealerInventoryStore.getState();
      store.renewVehicle('dlr-veh-003');

      const renewed = useDealerInventoryStore.getState().getVehicleById('dlr-veh-003');
      expect(renewed?.status).toBe('active');
      expect(renewed?.statusLabel).toBe('Ativo');
      expect(renewed?.expiresAt).toBe('18/12/2026');
    });
  });

  describe('Dealership Orders & Payment Adapter (WEB-030 to WEB-033)', () => {
    it('11. should create order for plan selection with correct amount', () => {
      const order = createDealerOrder({
        vehicleId: 'dlr-veh-001',
        vehicleTitle: 'Honda Civic 2.0 EXL 2022',
        vehiclePlate: 'BRA2E19',
        vehiclePrice: 'R$ 124.900',
        vehicleImageUrl: '/images/vehicles/demo/sedan-fallback.svg',
        type: 'plan',
        planId: 'premium',
        paymentMethod: 'PIX',
      });

      expect(order.id).toMatch(/^DLR-ORD-/);
      expect(order.amountFormatted).toBe('R$ 89,90');
      expect(order.amountCents).toBe(8990);
      expect(order.status).toBe('pending');
      expect(order.pixCode).toContain('br.gov.bcb.pix');
    });

    it('12. should create order for boost with R$ 29,90 amount', () => {
      const order = createDealerOrder({
        vehicleId: 'dlr-veh-002',
        vehicleTitle: 'Toyota Corolla 2.0 XEi 2021',
        vehiclePlate: 'RIO4A88',
        vehiclePrice: 'R$ 119.900',
        vehicleImageUrl: '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
        type: 'boost',
        paymentMethod: 'CREDIT_CARD',
      });

      expect(order.amountFormatted).toBe('R$ 29,90');
      expect(order.amountCents).toBe(2990);
      expect(order.type).toBe('boost');
    });

    it('13. should create order for renewal with R$ 49,90 amount', () => {
      const order = createDealerOrder({
        vehicleId: 'dlr-veh-003',
        vehicleTitle: 'Chevrolet Onix 1.0 Turbo 2022',
        vehiclePlate: 'SPX9F44',
        vehiclePrice: 'R$ 89.900',
        vehicleImageUrl: '/images/vehicles/demo/chevrolet-onix-2022.jpg',
        type: 'renewal',
        paymentMethod: 'PIX',
      });

      expect(order.amountFormatted).toBe('R$ 49,90');
      expect(order.amountCents).toBe(4990);
      expect(order.type).toBe('renewal');
    });

    it('14. should update order status to confirmed and retrieve it (WEB-032)', () => {
      const order = createDealerOrder({
        vehicleId: 'dlr-veh-001',
        vehicleTitle: 'Honda Civic 2.0 EXL 2022',
        vehiclePlate: 'BRA2E19',
        vehiclePrice: 'R$ 124.900',
        vehicleImageUrl: '/images/vehicles/demo/sedan-fallback.svg',
        type: 'plan',
        planId: 'premium',
        paymentMethod: 'CREDIT_CARD',
      });

      const updated = updateDealerOrderStatus(order.id, 'confirmed', '5812');
      expect(updated?.status).toBe('confirmed');
      expect(updated?.cardLastFour).toBe('5812');

      const fetched = getDealerOrderById(order.id);
      expect(fetched?.status).toBe('confirmed');
      expect(fetched?.cardLastFour).toBe('5812');
    });
  });

  describe('Data Isolation & Persona Separation (AUTH-022 Invariant)', () => {
    it('15. should ensure dealership conversations and messages never reference seller Mariana Silva', () => {
      const conversations = useDealerMessagesStore.getState().conversations;
      for (const conv of conversations) {
        expect(conv.buyerName).not.toBe('Mariana Silva');
        for (const msg of conv.messages) {
          if (msg.sender === 'dealer') {
            expect(msg.senderName).toBe('Líder Veículos Seminovos');
            expect(msg.senderName).not.toContain('Mariana');
          }
        }
      }
    });

    it('16. should ensure dealership orders use DLR prefix and never collide with seller orders', () => {
      const order = createDealerOrder({
        vehicleId: 'dlr-veh-001',
        vehicleTitle: 'Honda Civic',
        vehiclePlate: 'BRA2E19',
        vehiclePrice: 'R$ 124.900',
        vehicleImageUrl: '/images/vehicles/demo/sedan-fallback.svg',
        type: 'plan',
        planId: 'premium',
        paymentMethod: 'PIX',
      });

      expect(order.id.startsWith('DLR-ORD-')).toBe(true);
      expect(order.id.startsWith('ORD-')).toBe(false);
    });

    it('17. should resolve dealership photo quotas dynamically by plan (8 for essential, 20 for premium)', () => {
      expect(getDealerMaxPhotos('essential')).toBe(8);
      expect(getDealerMaxPhotos('premium')).toBe(20);
      expect(getDealerMaxPhotos(undefined)).toBe(20);
      expect(DEALER_PLANS.essential.maxPhotos).toBe(8);
      expect(DEALER_PLANS.premium.maxPhotos).toBe(20);
    });

    it('18. should strictly conform to dealership commercial pricing baseline', () => {
      expect(DEALER_PLANS.essential.priceCents).toBe(4990);
      expect(DEALER_PLANS.premium.priceCents).toBe(8990);
      expect(DEALER_BOOST.priceCents).toBe(2990);
      expect(DEALER_RENEWAL.priceCents).toBe(4990);

      expect(formatDealerBRL(4990)).toContain('49,90');
      expect(formatDealerBRL(8990)).toContain('89,90');
      expect(formatDealerBRL(2990)).toContain('29,90');
    });
  });
});
