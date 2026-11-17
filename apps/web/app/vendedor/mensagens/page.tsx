'use client';

import {
  IconCheck,
  IconClock,
  IconEdit,
  IconExternalLink,
  IconFile,
  IconInfo,
  IconMoreHorizontal,
  IconPin,
  IconPlus,
  IconSearch,
  IconSend,
  IconStar,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getConversations } from '@/lib/adapters/seller-messages-adapter';
import type { Conversation } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function SellerMessagesInboxPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations] = useState<Conversation[]>(() => getConversations());
  const [selectedConvId, setSelectedConvId] = useState<string>('CONV-001');
  const [replyText, setReplyText] = useState('');

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'unread' && c.unreadCount === 0) return false;
    if (activeTab === 'archived' && c.status !== 'archived') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.buyerName.toLowerCase().includes(q) ||
        c.vehicleTitle.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedConversation =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="mensagens" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Top Header / Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#e2e8f0]">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111827]">
              Mensagens e Negociações
            </h1>
            <p className="text-[13px] text-[#596679]">
              Converse com compradores interessados nos seus veículos publicados.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">
              Rota: /vendedor/mensagens
            </span>
            <span className="text-[11px] text-[#16a34a] font-semibold">WEB-045 • MENSAGENS</span>
          </div>
        </div>

        {/* Notice Banner (Figma 791:720) */}
        <div className="bg-[#e9f3ff] border border-[#d6dfea] rounded-[12px] p-3.5 flex items-start gap-3">
          <IconInfo className="size-5 text-[#2563eb] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#1e40af] leading-relaxed">
            <span className="font-bold">Privacidade do vendedor: </span>O comprador inicia a
            conversa a partir do anúncio. Seus dados de contato direto (telefone e e-mail) não são
            expostos publicamente.
          </div>
        </div>

        {/* 3-Column Layout on Desktop (Figma 2725:2191) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-280px)] min-h-[650px]">
          {/* Column 1: Conversations List (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-[#d6dfea] rounded-[16px] shadow-sm flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-3.5 border-b border-[#e2e8f0]">
              <div className="relative">
                <IconSearch className="size-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 h-[40px] rounded-[10px] bg-[#f8fafc] border border-[#cbd5e1] text-[13px] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c41217]"
                />
              </div>

              {/* Tabs: Todas, Não lidas, Arquivadas */}
              <div className="flex items-center gap-1.5 mt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
                    activeTab === 'all'
                      ? 'bg-[#c41217] text-white'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Todas ({conversations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unread')}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors flex items-center gap-1 ${
                    activeTab === 'unread'
                      ? 'bg-[#c41217] text-white'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Não lidas
                  <span className="size-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('archived')}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
                    activeTab === 'archived'
                      ? 'bg-[#c41217] text-white'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Arquivadas
                </button>
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9]">
              {filteredConversations.length === 0 ? (
                <div className="py-12 text-center text-[#64748b] text-[13px]">
                  Nenhuma conversa encontrada.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedConversation.id;
                  return (
                    <button
                      type="button"
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full text-left p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#fef2f2] border-l-4 border-l-[#c41217]'
                          : 'hover:bg-[#f8fafc]'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="size-11 rounded-full bg-[#e2e8f0] text-[#334155] font-bold text-[14px] flex items-center justify-center shrink-0">
                        {conv.buyerInitials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-[14px] font-bold text-[#111827] truncate">
                            {conv.buyerName}
                          </h4>
                          <span className="text-[11px] text-[#94a3b8] shrink-0 font-medium">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-[12px] font-medium text-[#c41217] truncate">
                          {conv.vehicleTitle}
                        </p>
                        <p className="text-[12px] text-[#64748b] truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {conv.unreadCount > 0 && (
                        <span className="size-5 rounded-full bg-[#c41217] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Active Chat Area (Figma 2725:2191) (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#d6dfea] rounded-[16px] shadow-sm flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-[#e2e8f0] text-[#334155] font-bold text-[13px] flex items-center justify-center">
                  {selectedConversation.buyerInitials}
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#111827]">
                    {selectedConversation.buyerName}
                  </h3>
                  <p className="text-[11px] text-[#64748b]">
                    Comprador • {selectedConversation.vehicleTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/vendedor/mensagens/${selectedConversation.id}/acoes`}
                  className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100 hover:text-[#111827] transition-colors"
                  title="Ações de moderação e segurança"
                >
                  <IconMoreHorizontal className="size-5" />
                </Link>
              </div>
            </div>

            {/* Chat Messages Scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
              <div className="text-center">
                <span className="px-3 py-1 rounded-full bg-[#e2e8f0] text-[#64748b] text-[11px] font-semibold">
                  Hoje
                </span>
              </div>

              {selectedConversation.messages.map((msg) => {
                const isSeller = msg.sender === 'seller';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[14px] p-3 text-[13px] leading-relaxed shadow-xs ${
                        isSeller
                          ? 'bg-[#c41217] text-white rounded-tr-none'
                          : 'bg-white border border-[#e2e8f0] text-[#111827] rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Photo Attachments */}
                      {msg.photos && msg.photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/20">
                          {msg.photos.map((src) => (
                            <div
                              key={src}
                              className="relative h-[60px] rounded-[6px] overflow-hidden bg-black/20"
                            >
                              <Image src={src} alt="Foto interna" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <span
                        className={`text-[10px] block text-right mt-1 font-medium ${
                          isSeller ? 'text-white/80' : 'text-[#94a3b8]'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Composer */}
            <div className="p-3 border-t border-[#e2e8f0] bg-white flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="size-9 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[#64748b] flex items-center justify-center shrink-0 transition-colors"
                title="Anexar foto do veículo"
              >
                <IconPlus className="size-4" />
              </button>
              <input
                type="text"
                placeholder="Digite uma mensagem para o comprador..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 h-[40px] px-3.5 rounded-[10px] bg-[#f8fafc] border border-[#cbd5e1] text-[13px] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c41217]"
              />
              <button
                type="button"
                className="size-9 rounded-[8px] bg-[#c41217] hover:bg-[#a81014] text-white flex items-center justify-center shrink-0 transition-colors"
                title="Enviar mensagem"
              >
                <IconSend className="size-4" />
              </button>
            </div>
          </div>

          {/* Column 3: Vehicle Context & Quick Actions (Figma 2725:2232) (lg:col-span-3) */}
          <div className="hidden lg:flex lg:col-span-3 bg-white border border-[#d6dfea] rounded-[16px] p-5 shadow-sm flex-col overflow-y-auto space-y-4">
            <div className="relative w-full h-[140px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={selectedConversation.vehicleImageUrl}
                alt={selectedConversation.vehicleTitle}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-[#111827]">
                {selectedConversation.vehicleTitle}
              </h3>
              <p className="text-[18px] font-bold text-[#c41217] mt-1">
                {selectedConversation.vehiclePriceFormatted}
              </p>
              <div className="flex items-center gap-1.5 text-[12px] text-[#64748b] mt-1">
                <IconPin className="size-3.5 text-gray-400" />
                <span>{selectedConversation.vehicleLocation}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e2e8f0] space-y-2">
              <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                Ações do Anúncio
              </span>

              <Link
                href={`/vendedor/anuncios/${selectedConversation.vehicleId}`}
                className="w-full py-2.5 px-3 rounded-[8px] border border-[#cbd5e1] text-[12px] font-semibold text-[#334155] hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <IconExternalLink className="size-3.5" />
                Ver anúncio completo
              </Link>

              <Link
                href={`/vendedor/anuncios/${selectedConversation.vehicleId}/editar`}
                className="w-full py-2.5 px-3 rounded-[8px] border border-[#cbd5e1] text-[12px] font-semibold text-[#334155] hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <IconEdit className="size-3.5" />
                Editar anúncio
              </Link>

              <Link
                href={`/vendedor/anuncios/${selectedConversation.vehicleId}/impulsionar`}
                className="w-full py-2.5 px-3 rounded-[8px] border border-[#cbd5e1] text-[12px] font-semibold text-[#334155] hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <IconStar className="size-3.5 text-amber-500" />
                Destacar anúncio
              </Link>

              <Link
                href={`/vendedor/anuncios/${selectedConversation.vehicleId}/vendido`}
                className="w-full py-2.5 px-3 rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] text-[12px] font-semibold text-[#166534] hover:bg-[#dcfce7] flex items-center justify-center gap-1.5"
              >
                <IconCheck className="size-3.5 text-[#16a34a]" />
                Marcar como vendido
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="mensagens" userRole="seller" />
    </div>
  );
}
