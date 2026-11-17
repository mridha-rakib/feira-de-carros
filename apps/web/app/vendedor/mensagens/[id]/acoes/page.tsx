'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconBan,
  IconCheck,
  IconEye,
  IconFlag,
  IconInfo,
  IconShield,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getConversationById } from '@/lib/adapters/seller-messages-adapter';
import type { Conversation } from '@/lib/types/seller-presentation';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConversationSafetyActionsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const convId = resolvedParams.id;

  const [conversation] = useState<Conversation | null>(() => getConversationById(convId) || null);

  const [reportReason, setReportReason] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

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

  const handleReport = () => {
    if (!reportReason) return;
    setActionFeedback(
      `Denúncia registrada com sucesso pelo motivo: "${reportReason}". O time de moderação analisará a conversa.`,
    );
  };

  const handleBlock = () => {
    setIsBlocked(true);
    setActionFeedback(
      `Participante ${conversation.buyerName} bloqueado com sucesso (simulação). Novas interações foram impedidas.`,
    );
  };

  const handleHide = () => {
    setIsHidden(true);
    setActionFeedback(
      'Conversa ocultada da sua caixa de entrada principal. Ela continuará arquivada.',
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="mensagens" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Mensagens', href: '/vendedor/mensagens' },
            {
              label: `Conversa com ${conversation.buyerName}`,
              href: `/vendedor/mensagens/${conversation.id}`,
            },
            { label: 'Ações de segurança' },
          ]}
        />

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827]">
              Escolha a ação nesta conversa
            </h1>
            <p className="text-[14px] text-[#596679] mt-1">
              {conversation.buyerName} • {conversation.vehicleTitle}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">
              Rota: /vendedor/mensagens/[id]/acoes
            </span>
            <span className="text-[11px] text-[#16a34a] font-semibold">WEB-048 • MODERAÇÃO</span>
          </div>
        </div>

        {/* Notice Banner (Figma 2802:2384) */}
        <div className="bg-[#fff2dd] border border-[#fed7aa] rounded-[12px] p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#ffedd5] text-[#b45309] shrink-0 mt-0.5">
            <IconAlert className="size-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#92400e]">
              Ações auditáveis e independentes
            </h3>
            <p className="text-[13px] text-[#92400e]/90 mt-0.5 leading-relaxed">
              Denunciar não significa bloquear; ocultar não destrói o histórico. Todas as ações são
              auditadas no backend para garantir a segurança mútua da plataforma.
            </p>
          </div>
        </div>

        {/* Feedback Alert if Action Triggered */}
        {actionFeedback && (
          <div className="p-4 rounded-[12px] bg-[#ecfdf5] border border-[#bbf7d0] flex items-center justify-between gap-3 text-[13px] text-[#166534]">
            <div className="flex items-center gap-2">
              <IconCheck className="size-5 text-[#16a34a] shrink-0" />
              <span>{actionFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionFeedback(null)}
              className="text-[#166534] font-bold hover:underline"
            >
              Fechar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3 Actions (Figma 2802:2386) */}
          <div className="lg:col-span-8 bg-white border border-[#d6dfea] rounded-[16px] p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <IconShield className="size-5 text-[#c41217]" />
              <h2 className="text-[18px] font-bold text-[#111827]">
                Ações de Proteção e Moderação
              </h2>
            </div>

            {/* Action 1: Denunciar (Figma 2802:2391) */}
            <div className="p-5 rounded-[14px] bg-[#f8fafc] border border-[#e2e8f0] space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#fee2e2] text-[#c41217] shrink-0">
                  <IconFlag className="size-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#111827]">
                    Denunciar mensagem ou conversa
                  </h3>
                  <p className="text-[13px] text-[#64748b] mt-0.5">
                    Envie o motivo para moderação. A moderação analisará o histórico sem alertar a
                    outra parte.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full sm:flex-1 h-[44px] px-3.5 rounded-[10px] bg-white border border-[#cbd5e1] text-[13px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#c41217]"
                >
                  <option value="">Selecione o motivo da denúncia ▾</option>
                  <option value="Tentativa de golpe ou fraude">Tentativa de golpe ou fraude</option>
                  <option value="Linguagem ofensiva ou assédio">
                    Linguagem ofensiva ou assédio
                  </option>
                  <option value="Envio de spam ou links externos">
                    Envio de spam ou links externos
                  </option>
                  <option value="Negociação suspeita fora da plataforma">
                    Negociação suspeita fora da plataforma
                  </option>
                  <option value="Outro motivo justificado">Outro motivo justificado</option>
                </select>

                <button
                  type="button"
                  onClick={handleReport}
                  disabled={!reportReason}
                  className={`w-full sm:w-auto px-5 h-[44px] rounded-[10px] font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors ${
                    reportReason
                      ? 'bg-[#c41217] hover:bg-[#a81014] text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <IconFlag className="size-4" />
                  Denunciar (simulação)
                </button>
              </div>
            </div>

            {/* Action 2: Bloquear (Figma 2802:2402) */}
            <div className="p-5 rounded-[14px] bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#fef3c7] text-[#b45309] shrink-0">
                  <IconBan className="size-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#111827]">Bloquear participante</h3>
                  <p className="text-[13px] text-[#64748b] mt-0.5">
                    Impede novas interações deste comprador com você em qualquer anúncio publicado.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBlock}
                  disabled={isBlocked}
                  className="px-5 h-[42px] rounded-[10px] border border-[#cbd5e1] bg-white text-[#334155] font-semibold text-[13px] hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <IconBan className="size-4 text-[#dc2626]" />
                  {isBlocked
                    ? 'Participante Bloqueado (demo)'
                    : 'Bloquear participante (simulação)'}
                </button>
              </div>
            </div>

            {/* Action 3: Ocultar (Figma 2802:2413) */}
            <div className="p-5 rounded-[14px] bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#e0f2fe] text-[#0369a1] shrink-0">
                  <IconEye className="size-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#111827]">Ocultar conversa</h3>
                  <p className="text-[13px] text-[#64748b] mt-0.5">
                    Remove da caixa de entrada sem destruir mensagens. Ficará disponível na aba
                    Arquivadas.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleHide}
                  disabled={isHidden}
                  className="px-5 h-[42px] rounded-[10px] border border-[#cbd5e1] bg-white text-[#334155] font-semibold text-[13px] hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <IconEye className="size-4 text-[#0284c7]" />
                  {isHidden ? 'Conversa Ocultada (demo)' : 'Ocultar conversa (simulação)'}
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href={`/vendedor/mensagens/${conversation.id}`}
                className="w-full sm:w-auto px-5 h-[44px] rounded-[10px] border border-[#cbd5e1] text-[#334155] font-semibold text-[13px] hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <IconArrowLeft className="size-4" />
                Voltar à conversa
              </Link>
              <span className="text-[12px] text-[#64748b]">
                Nenhuma ação real executada neste protótipo
              </span>
            </div>
          </div>

          {/* Right Column: User Protection & What Happens Next (Figma 2802:2430) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <IconShield className="size-5 text-[#16a34a]" />
                <h4 className="text-[15px] font-bold text-[#111827]">Proteção do usuário</h4>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#111827]">
                  <IconInfo className="size-4 text-[#0284c7]" />
                  <span>Estado da conversa</span>
                </div>
                <p className="text-[12px] text-[#64748b]">
                  {isBlocked
                    ? 'Participante bloqueado na sessão.'
                    : isHidden
                      ? 'Conversa oculta na caixa de entrada.'
                      : 'Nenhuma ação restritiva ativa.'}
                </p>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-[#64748b]">Denúncia</span>
                  <span className="font-semibold text-[#111827]">
                    {reportReason ? 'Registrada' : 'Sem registro'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-[#64748b]">Bloqueio</span>
                  <span className="font-semibold text-[#111827]">
                    {isBlocked ? 'Bloqueado' : 'Não bloqueado'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#64748b]">Conversa</span>
                  <span className="font-semibold text-[#111827]">
                    {isHidden ? 'Oculta' : 'Visível na caixa'}
                  </span>
                </div>
              </div>
            </div>

            {/* What happens next (Figma 2802:2449) */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-4">
              <h4 className="text-[15px] font-bold text-[#111827]">O que acontece depois?</h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#c41217] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="text-[13px] font-bold text-[#111827]">Revisão autorizada</h5>
                    <p className="text-[12px] text-[#64748b] leading-tight mt-0.5">
                      O time de moderação audita mensagens e evidências de forma confidencial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#c41217] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h5 className="text-[13px] font-bold text-[#111827]">Histórico preservado</h5>
                    <p className="text-[12px] text-[#64748b] leading-tight mt-0.5">
                      Mensagens não são apagadas para resguardar os direitos de ambas as partes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-[#c41217] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h5 className="text-[13px] font-bold text-[#111827]">Privacidade</h5>
                    <p className="text-[12px] text-[#64748b] leading-tight mt-0.5">
                      Dados de terceiros e informações de pagamento não são expostos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="mensagens" userRole="seller" />
    </div>
  );
}
