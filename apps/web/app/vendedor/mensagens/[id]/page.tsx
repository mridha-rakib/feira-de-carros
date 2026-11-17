'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconCheck,
  IconMoreHorizontal,
  IconPin,
  IconPlus,
  IconSend,
  IconShield,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getConversationById } from '@/lib/adapters/seller-messages-adapter';
import type { Conversation } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SellerConversationDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const convId = resolvedParams.id;

  const [conversation] = useState<Conversation | null>(() => getConversationById(convId) || null);

  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState(() => conversation?.messages || []);

  if (!conversation) {
    return (
      <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
        <SellerNavbar variant="seller" activeTab="mensagens" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#d6dfea] rounded-[16px] p-8 max-w-[600px] mx-auto text-center shadow-sm">
            <div className="size-16 rounded-full bg-[#fef2f2] text-[#c41217] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-8" />
            </div>
            <h1 className="text-[22px] font-bold text-[#111827] mb-2">Conversa não encontrada</h1>
            <p className="text-[14px] text-[#596679] mb-6">
              A conversa solicitada ({convId}) não existe ou não pertence à sua conta de vendedor.
            </p>
            <Link
              href="/vendedor/mensagens"
              className="inline-flex items-center gap-2 px-6 h-[46px] rounded-[10px] bg-[#c41217] text-white font-semibold text-[14px] hover:bg-[#a81014] transition-colors"
            >
              <IconArrowLeft className="size-4" />
              Voltar para Mensagens
            </Link>
          </div>
        </main>
        <SellerMobileBottomNav activeTab="mensagens" userRole="seller" />
      </div>
    );
  }

  const handleSend = () => {
    if (!replyText.trim()) return;
    const newMsg = {
      id: `MSG-${Date.now()}`,
      sender: 'seller' as const,
      senderName: 'Mariana Silva',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="mensagens" />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Mensagens', href: '/vendedor/mensagens' },
            { label: `Conversa com ${conversation.buyerName}` },
          ]}
        />

        {/* Vehicle Header Bar */}
        <div className="bg-white border border-[#d6dfea] rounded-[14px] p-3.5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/vendedor/mensagens"
              className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100 transition-colors"
              title="Voltar para a caixa de entrada"
            >
              <IconArrowLeft className="size-5" />
            </Link>
            <div className="relative size-12 rounded-[8px] overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={conversation.vehicleImageUrl}
                alt={conversation.vehicleTitle}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-[#111827]">{conversation.vehicleTitle}</h2>
              <p className="text-[12px] text-[#c41217] font-semibold">
                {conversation.vehiclePriceFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/vendedor/mensagens/${conversation.id}/acoes`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#cbd5e1] text-[12px] font-semibold text-[#475569] hover:bg-gray-50 transition-colors"
            >
              <IconShield className="size-3.5 text-[#64748b]" />
              <span className="hidden sm:inline">Ações de segurança</span>
            </Link>
          </div>
        </div>

        {/* Conversation Thread Container */}
        <div className="bg-white border border-[#d6dfea] rounded-[16px] shadow-sm flex flex-col h-[600px] overflow-hidden">
          {/* Buyer Identity Bar */}
          <div className="p-3.5 border-b border-[#e2e8f0] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#e2e8f0] text-[#334155] font-bold text-[14px] flex items-center justify-center">
                {conversation.buyerInitials}
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#111827]">{conversation.buyerName}</h3>
                <p className="text-[11px] text-[#64748b]">
                  Comprador interessado • Canal interno seguro
                </p>
              </div>
            </div>

            <Link
              href={`/vendedor/mensagens/${conversation.id}/acoes`}
              className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100"
            >
              <IconMoreHorizontal className="size-5" />
            </Link>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#e2e8f0] text-[#64748b] text-[11px] font-semibold">
                Hoje
              </span>
            </div>

            {messages.map((msg) => {
              const isSeller = msg.sender === 'seller';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-[14px] p-3 text-[13px] leading-relaxed shadow-xs ${
                      isSeller
                        ? 'bg-[#c41217] text-white rounded-tr-none'
                        : 'bg-white border border-[#e2e8f0] text-[#111827] rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.photos && msg.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/20">
                        {msg.photos.map((src) => (
                          <div
                            key={src}
                            className="relative h-[65px] rounded-[6px] overflow-hidden bg-black/20"
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
              className="size-10 rounded-[8px] bg-gray-100 hover:bg-gray-200 text-[#64748b] flex items-center justify-center shrink-0 transition-colors"
              title="Anexar foto do veículo"
            >
              <IconPlus className="size-4" />
            </button>
            <input
              type="text"
              placeholder="Digite uma mensagem para o comprador..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-[42px] px-3.5 rounded-[10px] bg-[#f8fafc] border border-[#cbd5e1] text-[13px] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c41217]"
            />
            <button
              type="button"
              onClick={handleSend}
              className="size-10 rounded-[8px] bg-[#c41217] hover:bg-[#a81014] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="Enviar mensagem"
            >
              <IconSend className="size-4" />
            </button>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="mensagens" userRole="seller" />
    </div>
  );
}
