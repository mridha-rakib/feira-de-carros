'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconCross,
  IconEye,
  IconInfo,
  IconLock,
  IconSearch,
  IconSend,
  IconShield,
} from '@/app/components/SellerIcons';
import { DealerConsoleTabs } from '@/app/components/dealership/DealerConsoleTabs';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerMessagesStore } from '@/stores/use-dealer-messages-store';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useMemo, useState } from 'react';

const REPORT_REASONS = [
  'Tentativa de golpe ou fraude financeira',
  'Comportamento abusivo ou linguagem ofensiva',
  'Spam comercial ou divulgação não autorizada',
  'Solicitação de dados bancários suspeitos',
  'Outro motivo relevante',
];

const QUICK_RESPONSES = [
  'Olá! Sim, o veículo está disponível em nosso showroom para visita.',
  'Trabalhamos com avaliação justa do seu seminovo na troca!',
  'Temos simulação de financiamento com taxas promocionais parceiras.',
];

export default function DealershipMessagesPage() {
  const {
    conversations,
    selectedConvId,
    activeTab,
    searchQuery,
    isReportingModalOpen,
    reportingTargetConvId,
    feedbackMessage,
    setSelectedConvId,
    setActiveTab,
    setSearchQuery,
    sendMessage,
    archiveConversation,
    unarchiveConversation,
    openReportingModal,
    closeReportingModal,
    reportAndBlockConversation,
    clearFeedback,
  } = useDealerMessagesStore();

  const [messageInput, setMessageInput] = useState('');
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (activeTab === 'unread' && c.unreadCount === 0) return false;
      if (activeTab === 'archived' && c.status !== 'archived') return false;
      if (activeTab === 'all' && c.status === 'archived') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          c.buyerName.toLowerCase().includes(q) ||
          c.vehicleTitle.toLowerCase().includes(q) ||
          c.vehiclePlate.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === selectedConvId) ||
      filteredConversations[0] ||
      conversations[0]
    );
  }, [conversations, selectedConvId, filteredConversations]);

  const handleSelectConv = (id: string) => {
    setSelectedConvId(id);
    setMobileView('thread');
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConversation || activeConversation.isBlocked) return;
    sendMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleQuickResponse = (text: string) => {
    if (!activeConversation || activeConversation.isBlocked) return;
    sendMessage(activeConversation.id, text);
  };

  const handleConfirmReport = () => {
    if (!reportingTargetConvId) return;
    reportAndBlockConversation(reportingTargetConvId, selectedReason);
  };

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans text-[#16243c]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[58px] py-6 pb-20">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#63738e] mb-4"
        >
          <Link href="/" className="hover:text-[#16243c] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link href="/concessionaria/anuncios" className="hover:text-[#16243c] transition-colors">
            Minha concessionária
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#16243c]">Mensagens</span>
        </nav>

        {/* Navigation Tabs */}
        <DealerConsoleTabs activeTab="mensagens" />

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            data-testid="dealer-messages-feedback"
            className="mb-4 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-3 rounded-[8px] text-[13px] flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <IconInfo className="size-4 shrink-0 text-[#2563eb]" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearFeedback}
              className="text-[#64748b] hover:text-[#1e293b] font-medium text-[12px]"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Page Title & Stats */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#16243c] tracking-tight">
              Mensagens & Negociações
            </h1>
            <p className="text-[14px] text-[#63738e] mt-1">
              Atenda compradores interessados nos veículos do seu showroom.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] bg-white border border-[#dee6f1] text-[#63738e] px-3 py-1.5 rounded-full font-medium">
              Total: {conversations.length} conversas
            </span>
          </div>
        </div>

        {/* Main Messenger Grid (Figma WEB-045 & WEB-046) */}
        <div className="bg-white border border-[#dee6f1] rounded-[14px] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
          {/* LEFT COLUMN: Conversation List (Col 1-5) */}
          <div
            className={`md:col-span-5 lg:col-span-4 border-r border-[#dee6f1] flex flex-col bg-white ${
              mobileView === 'thread' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search Bar & Filter Tabs */}
            <div className="p-3.5 border-b border-[#dee6f1] bg-[#f8fafc] space-y-3">
              <div className="relative">
                <IconSearch className="size-4 text-[#8a99ad] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar comprador ou veículo..."
                  data-testid="input-search-conversations"
                  className="w-full h-[38px] pl-9 pr-3 bg-white border border-[#d2dce8] rounded-[8px] text-[13px] text-[#16243c] placeholder-[#8a99ad] focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                />
              </div>

              {/* Tabs: Todas / Não lidas / Arquivadas */}
              <div className="flex items-center gap-1.5 text-[12px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-[#16243c] text-white'
                      : 'bg-white border border-[#d2dce8] text-[#63738e] hover:bg-[#f1f6fd]'
                  }`}
                >
                  Todas ({conversations.filter((c) => c.status !== 'archived').length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unread')}
                  className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors ${
                    activeTab === 'unread'
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-white border border-[#d2dce8] text-[#63738e] hover:bg-[#f1f6fd]'
                  }`}
                >
                  Não lidas (
                  {conversations.filter((c) => c.unreadCount > 0 && c.status !== 'archived').length}
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('archived')}
                  className={`px-3 py-1.5 rounded-[6px] font-medium transition-colors ${
                    activeTab === 'archived'
                      ? 'bg-[#16243c] text-white'
                      : 'bg-white border border-[#d2dce8] text-[#63738e] hover:bg-[#f1f6fd]'
                  }`}
                >
                  Arquivadas ({conversations.filter((c) => c.status === 'archived').length})
                </button>
              </div>
            </div>

            {/* Conversation List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#edf2f7]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-[#8a99ad] text-[13px]">
                  Nenhuma conversa encontrada nesta categoria.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSelectConv(conv.id)}
                      data-testid={`conv-item-${conv.id}`}
                      className={`w-full text-left p-3.5 flex gap-3 transition-colors ${
                        isSelected
                          ? 'bg-[#fee2e2]/40 border-l-4 border-l-[#b91c1c]'
                          : 'hover:bg-[#f8fafc]'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="size-10 rounded-full bg-[#e2e8f0] text-[#1e293b] font-bold text-[13px] flex items-center justify-center shrink-0">
                        {conv.buyerInitials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-[13px] text-[#16243c] truncate">
                            {conv.buyerName}
                          </span>
                          <span className="text-[11px] text-[#8a99ad] shrink-0">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        {/* Vehicle chip */}
                        <div className="text-[11px] font-medium text-[#b91c1c] truncate mt-0.5">
                          {conv.vehicleTitle} ({conv.vehiclePlate})
                        </div>

                        <p className="text-[12px] text-[#63738e] truncate mt-1">
                          {conv.isBlocked ? (
                            <span className="text-[#dc2626] italic flex items-center gap-1">
                              <IconLock className="size-3 inline" /> Bloqueado
                            </span>
                          ) : (
                            conv.lastMessage
                          )}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {conv.unreadCount > 0 && (
                        <div className="shrink-0 self-center">
                          <span className="size-5 rounded-full bg-[#b91c1c] text-white text-[10px] font-bold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Thread (Col 6-12) */}
          <div
            className={`md:col-span-7 lg:col-span-8 flex flex-col bg-[#fdfefe] ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* Thread Top Bar (Figma WEB-046) */}
                <div className="p-3.5 sm:p-4 border-b border-[#dee6f1] bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      className="md:hidden text-[#63738e] hover:text-[#16243c] p-1 rounded-md"
                    >
                      ← Voltar
                    </button>

                    <div className="size-9 rounded-full bg-[#e2e8f0] text-[#1e293b] font-bold text-[13px] flex items-center justify-center shrink-0">
                      {activeConversation.buyerInitials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-[14px] sm:text-[15px] text-[#16243c] truncate">
                          {activeConversation.buyerName}
                        </h2>
                        {activeConversation.isBlocked && (
                          <span className="text-[10px] bg-[#fee2e2] text-[#991b1b] px-2 py-0.5 rounded-full font-bold">
                            Bloqueado
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] sm:text-[12px] text-[#63738e] truncate flex items-center gap-2">
                        <span className="font-medium text-[#16243c]">
                          {activeConversation.vehicleTitle}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[#b91c1c]">
                          {activeConversation.vehiclePriceFormatted}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Dropdown / Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {activeConversation.status === 'archived' ? (
                      <button
                        type="button"
                        onClick={() => unarchiveConversation(activeConversation.id)}
                        className="text-[12px] text-[#2563eb] hover:bg-[#eff6ff] px-2.5 py-1.5 rounded-[6px] border border-[#bfdbfe] transition-colors"
                      >
                        Desarquivar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => archiveConversation(activeConversation.id)}
                        data-testid="btn-archive-conv"
                        className="text-[12px] text-[#63738e] hover:text-[#16243c] hover:bg-[#f1f6fd] px-2.5 py-1.5 rounded-[6px] border border-[#d2dce8] transition-colors"
                      >
                        Arquivar
                      </button>
                    )}

                    {!activeConversation.isBlocked && (
                      <button
                        type="button"
                        onClick={() => openReportingModal(activeConversation.id)}
                        data-testid="btn-open-report-modal"
                        className="text-[12px] text-[#b91c1c] hover:bg-[#fee2e2]/60 px-2.5 py-1.5 rounded-[6px] border border-[#fca5a5] transition-colors flex items-center gap-1"
                      >
                        <IconShield className="size-3.5" />
                        <span>Denunciar e Bloquear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#f8fafc]/50">
                  {/* System Trust & Safety Banner */}
                  <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-[8px] p-3 text-center text-[12px] text-[#1e40af]">
                    <strong>Negociação Segura Feira de Carros:</strong> Nunca compartilhe dados de
                    acesso nem realize transferências bancárias sem antes ver o veículo pessoalmente
                    na concessionária.
                  </div>

                  {/* Message Bubbles */}
                  {activeConversation.messages.map((msg) => {
                    const isDealer = msg.sender === 'dealer';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isDealer ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-[12px] px-4 py-2.5 shadow-2xs text-[13px] leading-relaxed ${
                            isDealer
                              ? 'bg-[#b91c1c] text-white rounded-br-none'
                              : 'bg-white border border-[#dee6f1] text-[#16243c] rounded-bl-none'
                          }`}
                        >
                          <div className="text-[11px] font-semibold mb-1 opacity-85">
                            {msg.senderName}
                          </div>
                          <div>{msg.text}</div>
                        </div>
                        <span className="text-[10px] text-[#8a99ad] mt-1 px-1">{msg.time}</span>
                      </div>
                    );
                  })}

                  {/* Blocked Conversation Notice */}
                  {activeConversation.isBlocked && (
                    <div
                      data-testid="blocked-conversation-alert"
                      className="bg-[#fef2f2] border border-[#fecaca] rounded-[10px] p-4 text-center space-y-1.5 my-4"
                    >
                      <div className="font-bold text-[13px] text-[#991b1b] flex items-center justify-center gap-1.5">
                        <IconLock className="size-4" />
                        <span>Contato bloqueado e conversa encerrada</span>
                      </div>
                      <p className="text-[12px] text-[#7f1d1d]">
                        Motivo: {activeConversation.blockReason || 'Violação dos termos de uso'}.
                        Não é possível enviar ou receber novas mensagens.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Response Chips (WEB-046) */}
                {!activeConversation.isBlocked && (
                  <div className="px-4 py-2 bg-[#f8fafc] border-t border-[#dee6f1] flex items-center gap-2 overflow-x-auto text-[11px]">
                    <span className="text-[#8a99ad] shrink-0 font-medium">Respostas rápidas:</span>
                    {QUICK_RESPONSES.map((qr) => (
                      <button
                        key={qr}
                        type="button"
                        onClick={() => handleQuickResponse(qr)}
                        className="bg-white border border-[#d2dce8] hover:border-[#b91c1c] hover:text-[#b91c1c] text-[#475569] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Input Bar */}
                <div className="p-3 sm:p-4 border-t border-[#dee6f1] bg-white">
                  {activeConversation.isBlocked ? (
                    <div className="text-center py-2 text-[13px] text-[#8a99ad] italic">
                      Esta conversa está bloqueada. Para desbloquear contate o suporte.
                    </div>
                  ) : (
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Digite sua resposta para o comprador..."
                        data-testid="input-dealer-reply"
                        className="flex-1 h-[44px] px-4 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#16243c] placeholder-[#8a99ad] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        data-testid="btn-dealer-send-reply"
                        className="h-[44px] px-5 bg-[#b91c1c] hover:bg-[#991b1b] disabled:bg-[#d2dce8] disabled:cursor-not-allowed text-white font-semibold text-[13px] rounded-[8px] flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <IconSend className="size-4" />
                        <span className="hidden sm:inline">Enviar</span>
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-[#8a99ad] text-[14px]">
                Selecione uma conversa para visualizar o histórico de negociação.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Denunciar e Bloquear Contato (Figma WEB-048) */}
        {isReportingModalOpen && (
          <div
            data-testid="modal-report-block"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            role="presentation"
            aria-modal="true"
            aria-labelledby="report-modal-title"
          >
            <div className="bg-white rounded-[14px] max-w-[500px] w-full p-6 shadow-xl border border-[#dee6f1] space-y-5 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#dee6f1]">
                <div className="flex items-center gap-2 text-[#991b1b]">
                  <IconShield className="size-5" />
                  <h3 id="report-modal-title" className="font-bold text-[16px] text-[#16243c]">
                    Denunciar e Bloquear Contato
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeReportingModal}
                  aria-label="Fechar modal"
                  className="text-[#8a99ad] hover:text-[#16243c]"
                >
                  <IconCross className="size-4" />
                </button>
              </div>

              <div className="text-[13px] text-[#63738e] leading-relaxed">
                Ao denunciar e bloquear este comprador, a conversa será encerrada imediatamente e o
                usuário não poderá mais enviar mensagens para a sua concessionária.
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="select-report-reason"
                  className="block text-[12px] font-semibold text-[#16243c]"
                >
                  Selecione o motivo da denúncia:
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-2.5 p-2.5 rounded-[8px] border border-[#d2dce8] hover:bg-[#f8fafc] cursor-pointer text-[13px] text-[#16243c]"
                    >
                      <input
                        type="radio"
                        name="report_reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="accent-[#b91c1c]"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dee6f1]">
                <button
                  type="button"
                  onClick={closeReportingModal}
                  className="px-4 py-2 border border-[#d2dce8] text-[#63738e] hover:text-[#16243c] text-[13px] font-semibold rounded-[8px] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReport}
                  data-testid="btn-confirm-report-block"
                  className="px-5 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[13px] font-semibold rounded-[8px] transition-colors shadow-xs"
                >
                  Confirmar e Bloquear
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <MarketplaceFooter />
    </div>
  );
}
