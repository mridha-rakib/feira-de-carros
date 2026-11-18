import {
  type DealerConversation,
  type DealerMessageItem,
  MOCK_DEALER_CONVERSATIONS,
} from '@/lib/adapters/dealer-messages-adapter';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DealerMessagesState {
  conversations: DealerConversation[];
  selectedConvId: string;
  activeTab: 'all' | 'unread' | 'archived';
  searchQuery: string;
  isReportingModalOpen: boolean;
  reportingTargetConvId: string | null;
  feedbackMessage: string | null;

  // Actions
  setSelectedConvId: (id: string) => void;
  setActiveTab: (tab: 'all' | 'unread' | 'archived') => void;
  setSearchQuery: (query: string) => void;
  sendMessage: (convId: string, text: string) => void;
  markAsRead: (convId: string) => void;
  archiveConversation: (convId: string) => void;
  unarchiveConversation: (convId: string) => void;
  openReportingModal: (convId: string) => void;
  closeReportingModal: () => void;
  reportAndBlockConversation: (convId: string, reason: string) => void;
  clearFeedback: () => void;
  resetToDefaults: () => void;
}

export const useDealerMessagesStore = create<DealerMessagesState>()(
  persist(
    (set, get) => ({
      conversations: MOCK_DEALER_CONVERSATIONS,
      selectedConvId: 'DLR-CONV-001',
      activeTab: 'all',
      searchQuery: '',
      isReportingModalOpen: false,
      reportingTargetConvId: null,
      feedbackMessage: null,

      setSelectedConvId: (id: string) => {
        set({ selectedConvId: id });
        get().markAsRead(id);
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      sendMessage: (convId: string, text: string) => {
        if (!text.trim()) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}`;

        const newMessage: DealerMessageItem = {
          id: `DLR-MSG-${Date.now()}`,
          sender: 'dealer',
          senderName: 'Líder Veículos Seminovos',
          text: text.trim(),
          time: timeStr,
        };

        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== convId) return conv;
            return {
              ...conv,
              lastMessage: text.trim(),
              lastMessageTime: timeStr,
              messages: [...conv.messages, newMessage],
            };
          }),
        }));
      },

      markAsRead: (convId: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== convId || conv.unreadCount === 0) return conv;
            return {
              ...conv,
              unreadCount: 0,
            };
          }),
        }));
      },

      archiveConversation: (convId: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== convId) return conv;
            return {
              ...conv,
              status: 'archived',
            };
          }),
          feedbackMessage: 'Conversa arquivada com sucesso.',
        }));
      },

      unarchiveConversation: (convId: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== convId) return conv;
            return {
              ...conv,
              status: 'active',
            };
          }),
          feedbackMessage: 'Conversa desarquivada.',
        }));
      },

      openReportingModal: (convId: string) => {
        set({
          isReportingModalOpen: true,
          reportingTargetConvId: convId,
        });
      },

      closeReportingModal: () => {
        set({
          isReportingModalOpen: false,
          reportingTargetConvId: null,
        });
      },

      reportAndBlockConversation: (convId: string, reason: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== convId) return conv;
            return {
              ...conv,
              isBlocked: true,
              blockReason: reason,
              status: 'locked',
              lockedReason: reason,
            };
          }),
          isReportingModalOpen: false,
          reportingTargetConvId: null,
          feedbackMessage: 'Contato denunciado e bloqueado com sucesso.',
        }));
      },

      clearFeedback: () => set({ feedbackMessage: null }),

      resetToDefaults: () => {
        set({
          conversations: MOCK_DEALER_CONVERSATIONS,
          selectedConvId: 'DLR-CONV-001',
          activeTab: 'all',
          searchQuery: '',
          isReportingModalOpen: false,
          reportingTargetConvId: null,
          feedbackMessage: null,
        });
      },
    }),
    {
      name: 'fdc_dealer_messages_store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    },
  ),
);
