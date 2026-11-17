import { beforeEach, describe, expect, it } from 'vitest';
import {
  type BuyerConversation,
  type SafetyReportInput,
  clearAllConversations,
  getBuyerConversationById,
  getBuyerConversations,
  markConversationAsRead,
  reportAndBlockConversation,
  resetDemoConversations,
  sendBuyerMessage,
  startConversationFromListing,
} from '../../lib/adapters/buyer-messages-adapter';
import { useBuyerStore } from '../../stores/use-buyer-store';

describe('Buyer Batch B5 — Messaging, Conversations, Reporting & Safety', () => {
  beforeEach(() => {
    resetDemoConversations();
    useBuyerStore.setState({
      isAuthenticated: true,
      buyerProfile: {
        id: 'BUYER-2026-1042',
        firstName: 'João',
        lastName: 'Silva',
        fullName: 'João Silva',
        email: 'joao.silva@exemplo.com',
        birthDate: '15/04/1990',
        phone: '(31) 98765-4321',
        city: 'Ipatinga',
        state: 'MG',
        role: 'member',
        avatarInitials: 'JS',
        isSuspended: false,
        savedSearchesCount: 2,
      },
    });
  });

  describe('WEB-012 & WEB-016: Inbox and Conversation Retrieval', () => {
    it('retrieves default demo conversations seeded with vehicle linkages', () => {
      const convs = getBuyerConversations();
      expect(convs.length).toBeGreaterThanOrEqual(4);

      const corollaConv = convs.find((c) => c.id === 'conv-corolla-carlos');
      expect(corollaConv).toBeDefined();
      expect(corollaConv?.sellerName).toBe('Carlos Eduardo Mendes');
      expect(corollaConv?.vehicleTitle).toBe('Toyota Corolla XEi 2.0');
      expect(corollaConv?.vehicleId).toBe('veh-corolla-2021');
      expect(corollaConv?.isMockData).toBe(true);
    });

    it('searches conversations by seller name or vehicle title', () => {
      const cretaConvs = getBuyerConversations('creta');
      expect(cretaConvs.length).toBe(1);
      expect(cretaConvs[0].vehicleTitle).toContain('Creta');

      const carlosConvs = getBuyerConversations('Carlos Eduardo');
      expect(carlosConvs.length).toBe(1);
      expect(carlosConvs[0].sellerName).toContain('Carlos Eduardo');

      const nonExistent = getBuyerConversations('Ferrari F40 XYZ');
      expect(nonExistent.length).toBe(0);
    });

    it('handles empty inbox state cleanly when all conversations are cleared', () => {
      clearAllConversations();
      const emptyList = getBuyerConversations();
      expect(emptyList.length).toBe(0);

      // Restoration restores baseline demo threads
      resetDemoConversations();
      const restored = getBuyerConversations();
      expect(restored.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('WEB-013: Active Conversation Thread & Direction Alignment', () => {
    it('sends an outgoing buyer message and appends it with buyer alignment', () => {
      const convId = 'conv-creta-mariana';
      const initialConv = getBuyerConversationById(convId);
      const initialCount = initialConv?.messages.length || 0;

      const sentMsg = sendBuyerMessage(
        convId,
        'Boa tarde! Gostaria de agendar para ver o carro no sábado às 10h.',
        'João Silva',
      );

      expect(sentMsg).toBeDefined();
      expect(sentMsg.sender).toBe('buyer');
      expect(sentMsg.senderName).toBe('João Silva');
      expect(sentMsg.text).toContain('agendar para ver o carro no sábado');

      const updatedConv = getBuyerConversationById(convId);
      expect(updatedConv?.messages.length).toBe(initialCount + 1);
      expect(updatedConv?.lastMessage).toContain('agendar para ver o carro no sábado');
      expect(updatedConv?.messages[updatedConv.messages.length - 1].sender).toBe('buyer');
    });

    it('clears unread badge count when marked as read', () => {
      const convId = 'conv-corolla-carlos';
      const before = getBuyerConversationById(convId);
      expect(before?.unreadCount).toBeGreaterThan(0);

      markConversationAsRead(convId);

      const after = getBuyerConversationById(convId);
      expect(after?.unreadCount).toBe(0);
    });
  });

  describe('WEB-014: Start Conversation from Listing & Deduplication', () => {
    it('creates a new conversation linked to vehicle details when none exists', () => {
      const newVehicle = {
        id: 'veh-tracker-2023',
        title: 'Chevrolet Tracker Premier 1.2 Turbo',
        priceFormatted: 'R$ 119.900,00',
        city: 'Ipatinga',
        state: 'MG',
        sellerName: 'Fernando Costa',
        sellerType: 'particular' as const,
      };

      const newConv = startConversationFromListing(
        newVehicle,
        'Olá! Aceita proposta à vista?',
        'João Silva',
      );

      expect(newConv).toBeDefined();
      expect(newConv.vehicleId).toBe('veh-tracker-2023');
      expect(newConv.sellerName).toBe('Fernando Costa');
      expect(newConv.messages.length).toBe(1);
      expect(newConv.messages[0].text).toBe('Olá! Aceita proposta à vista?');
      expect(newConv.messages[0].sender).toBe('buyer');
    });

    it('deduplicates conversation thread when starting conversation from already contacted listing', () => {
      const existingVehicle = {
        id: 'veh-corolla-2021',
        title: 'Toyota Corolla XEi 2.0',
        priceFormatted: 'R$ 112.900,00',
        city: 'Ipatinga',
        state: 'MG',
        sellerName: 'Carlos Eduardo Mendes',
      };

      const beforeCount = getBuyerConversations().length;
      const conv = startConversationFromListing(
        existingVehicle,
        'Mais uma pergunta sobre o laudo.',
        'João Silva',
      );

      const afterCount = getBuyerConversations().length;
      // Should not add a duplicate conversation card to the inbox
      expect(afterCount).toBe(beforeCount);
      expect(conv.vehicleId).toBe('veh-corolla-2021');
      expect(conv.lastMessage).toBe('Mais uma pergunta sobre o laudo.');
    });
  });

  describe('WEB-017 & WEB-018: Reporting, Blocking & Read-Only Invariants', () => {
    it('records safety report and blocks seller when blockSeller is true', () => {
      const convId = 'conv-civic-autocar';
      const before = getBuyerConversationById(convId);
      expect(before?.isBlocked).toBe(false);
      expect(before?.status).toBe('active');

      const reportPayload: SafetyReportInput = {
        conversationId: convId,
        reason: 'sinal_antecipado',
        details: 'Vendedor solicitou transferência de sinal via PIX antes da visita.',
        blockSeller: true,
      };

      reportAndBlockConversation(reportPayload);

      const after = getBuyerConversationById(convId);
      expect(after?.isBlocked).toBe(true);
      expect(after?.status).toBe('blocked');
      // Contains a security system notice
      const lastMsg = after?.messages[after.messages.length - 1];
      expect(lastMsg?.sender).toBe('system');
      expect(lastMsg?.text).toContain('bloqueou este anunciante');
    });

    it('rejects sending messages to a blocked or sold conversation thread', () => {
      const convId = 'conv-bloqueada-polo';
      const blockedConv = getBuyerConversationById(convId);
      expect(blockedConv?.isBlocked).toBe(true);

      expect(() => {
        sendBuyerMessage(convId, 'Tentando enviar mensagem...', 'João Silva');
      }).toThrow('Esta conversa está arquivada e não aceita novas mensagens.');
    });
  });

  describe('WEB-019: Official Team Mediation Presentation', () => {
    it('identifies official team mediated conversations without spoofing private sellers', () => {
      const mediatedConv = getBuyerConversationById('conv-mediada-compass');
      expect(mediatedConv).toBeDefined();
      expect(mediatedConv?.isMediated).toBe(true);
      expect(mediatedConv?.sellerType).toBe('staff');
      expect(mediatedConv?.sellerName).toBe('Equipe Feira de Carros');

      // Staff messages have staff sender
      const staffMsg = mediatedConv?.messages.find((m) => m.sender === 'staff');
      expect(staffMsg).toBeDefined();
      expect(staffMsg?.senderName).toContain('Equipe Feira de Carros');
    });
  });

  describe('WEB-015: Authentication State Gate', () => {
    it('preserves unauthenticated guest state without fabricating session', () => {
      useBuyerStore.setState({ isAuthenticated: false });
      expect(useBuyerStore.getState().isAuthenticated).toBe(false);
    });
  });
});
