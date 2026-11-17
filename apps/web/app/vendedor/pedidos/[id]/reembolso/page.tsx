'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconFile,
  IconInfo,
  IconSend,
  IconShield,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getSellerOrderById } from '@/lib/adapters/seller-orders-adapter';
import type { SellerOrder } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RefundRequestPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order] = useState<SellerOrder | null>(() => getSellerOrderById(orderId) || null);

  const [reason, setReason] = useState('Não desejo continuar a contratação');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
        <SellerNavbar variant="seller" activeTab="pagamentos" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#d6dfea] rounded-[16px] p-8 max-w-[600px] mx-auto text-center shadow-sm">
            <div className="size-16 rounded-full bg-[#fef2f2] text-[#c41217] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-8" />
            </div>
            <h1 className="text-[22px] font-bold text-[#111827] mb-2">Pedido não encontrado</h1>
            <p className="text-[14px] text-[#596679] mb-6">
              O pedido solicitado ({orderId}) não existe ou não pertence à sua conta de vendedor.
            </p>
            <Link
              href="/vendedor/pagamentos"
              className="inline-flex items-center gap-2 px-6 h-[46px] rounded-[10px] bg-[#c41217] text-white font-semibold text-[14px] hover:bg-[#a81014] transition-colors"
            >
              <IconArrowLeft className="size-4" />
              Voltar para Pagamentos
            </Link>
          </div>
        </main>
        <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
      </div>
    );
  }

  const handleSubmit = () => {
    if (!reason) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="pagamentos" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Pagamentos', href: '/vendedor/pagamentos' },
            { label: order.id, href: `/vendedor/pedidos/${order.id}/status` },
            { label: 'Solicitar reembolso' },
          ]}
        />

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827]">
              Solicitar cancelamento e reembolso
            </h1>
            <p className="text-[14px] text-[#596679] mt-1">
              Revise a cobrança e informe o motivo para submeter à revisão manual.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">
              Rota: /vendedor/pedidos/[id]/reembolso
            </span>
            <span className="text-[11px] text-[#16a34a] font-semibold">WEB-049 • REEMBOLSO</span>
          </div>
        </div>

        {/* 3 Lifecycle Steps (Figma 2802:2470) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-[12px] bg-[#f0f9ff] border border-[#0284c7] flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#0284c7] text-white font-bold text-[14px] flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#0369a1] block">1 · Solicitação</span>
              <span className="text-[12px] text-[#0284c7] font-semibold">Etapa atual</span>
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-white border border-[#d6dfea] flex items-center gap-3 opacity-70">
            <div className="size-9 rounded-full bg-gray-200 text-[#64748b] font-bold text-[14px] flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#111827] block">2 · Revisão manual</span>
              <span className="text-[12px] text-[#64748b]">Pendente de envio</span>
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-white border border-[#d6dfea] flex items-center gap-3 opacity-70">
            <div className="size-9 rounded-full bg-gray-200 text-[#64748b] font-bold text-[14px] flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <span className="text-[14px] font-bold text-[#111827] block">
                3 · Decisão e estorno
              </span>
              <span className="text-[12px] text-[#64748b]">Aguardando análise</span>
            </div>
          </div>
        </div>

        {/* Notice Banner (Figma 2802:2479) */}
        <div className="bg-[#fff2dd] border border-[#fed7aa] rounded-[12px] p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#ffedd5] text-[#b45309] shrink-0 mt-0.5">
            <IconInfo className="size-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#92400e]">Solicitação sujeita à análise</h3>
            <p className="text-[13px] text-[#92400e]/90 mt-0.5 leading-relaxed">
              O pedido de cancelamento e reembolso é submetido à auditoria manual. A elegibilidade
              depende do status de publicação e das diretrizes contratuais vigentes.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-white border border-[#bbf7d0] rounded-[16px] p-8 text-center shadow-sm max-w-[700px] mx-auto space-y-4">
            <div className="size-16 rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center mx-auto">
              <IconCheck className="size-8" />
            </div>
            <h2 className="text-[22px] font-bold text-[#111827]">
              Solicitação enviada para análise!
            </h2>
            <p className="text-[14px] text-[#596679] max-w-[500px] mx-auto">
              Seu pedido de reembolso para a fatura <strong>{order.id}</strong> foi protocolado com
              sucesso na simulação. Acompanhe o status no painel de reembolsos.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Link
                href="/vendedor/reembolsos"
                className="px-6 h-[46px] rounded-[10px] bg-[#c41217] text-white font-semibold text-[14px] hover:bg-[#a81014] transition-colors flex items-center gap-2"
              >
                Ver Histórico de Reembolsos
              </Link>
              <Link
                href="/vendedor/pagamentos"
                className="px-6 h-[46px] rounded-[10px] border border-[#cbd5e1] text-[#334155] font-semibold text-[14px] hover:bg-gray-50 transition-colors"
              >
                Voltar aos Pagamentos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Request Form (Figma 2802:2485) */}
            <div className="lg:col-span-8 bg-white border border-[#d6dfea] rounded-[16px] p-5 sm:p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">
                  01 · Pedido e motivo da solicitação
                </h2>
                <p className="text-[13px] text-[#596679] mt-1">
                  Confira as informações da cobrança antes de submeter à avaliação.
                </p>
              </div>

              {/* Vehicle Context */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="relative w-full sm:w-[160px] h-[100px] rounded-[8px] overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={order.listingImageUrl || '/images/vehicles/demo/web027-nivus.png'}
                    alt={order.listingTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-[16px] font-bold text-[#111827]">{order.listingTitle}</h3>
                  <p className="text-[13px] text-[#596679]">{order.listingSubtitle}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[12px] font-semibold text-[#111827]">
                      Pedido: {order.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#166534] text-[11px] font-bold border border-[#bbf7d0]">
                      {order.statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="refund-reason"
                    className="block text-[13px] font-bold text-[#111827] mb-1.5"
                  >
                    Motivo da solicitação *
                  </label>
                  <select
                    id="refund-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#cbd5e1] text-[14px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#c41217]"
                  >
                    <option value="Não desejo continuar a contratação">
                      Não desejo continuar a contratação
                    </option>
                    <option value="Veículo vendido antes do término do plano">
                      Veículo vendido antes do término do plano
                    </option>
                    <option value="Problemas técnicos na ativação do anúncio">
                      Problemas técnicos na ativação do anúncio
                    </option>
                    <option value="Cobrança indevida ou duplicada">
                      Cobrança indevida ou duplicada
                    </option>
                    <option value="Outro motivo">Outro motivo justificado</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="refund-details"
                    className="block text-[13px] font-bold text-[#111827] mb-1.5"
                  >
                    Detalhes para avaliação (opcional)
                  </label>
                  <textarea
                    id="refund-details"
                    rows={4}
                    placeholder="Descreva brevemente o motivo pelo qual solicita o reembolso..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#cbd5e1] text-[13px] text-[#111827] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c41217]"
                  />
                </div>

                {/* Submission Details Notice */}
                <div className="p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-3">
                  <IconInfo className="size-5 text-[#64748b] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[13px] font-bold text-[#111827]">
                      O que será enviado para análise?
                    </h5>
                    <p className="text-[12px] text-[#64748b] mt-0.5 leading-relaxed">
                      Referência do pedido ({order.id}), valor ({order.amountFormatted}), motivo
                      selecionado e histórico de publicação para auditoria interna.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/vendedor/pagamentos"
                  className="w-full sm:w-auto px-5 h-[46px] rounded-[10px] border border-[#cbd5e1] text-[#334155] font-semibold text-[14px] hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <IconArrowLeft className="size-4" />
                  Voltar ao histórico
                </Link>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-6 h-[46px] rounded-[10px] bg-[#c41217] hover:bg-[#a81014] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <IconSend className="size-4" />
                  Enviar solicitação (simulação)
                </button>
              </div>
            </div>

            {/* Right Column: Financial Summary (Figma 2802:2525) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <IconFile className="size-5 text-[#c41217]" />
                  <h4 className="text-[15px] font-bold text-[#111827]">02 · Resumo financeiro</h4>
                </div>

                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Referência</span>
                    <span className="font-semibold text-[#111827]">{order.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Veículo</span>
                    <span className="font-semibold text-[#111827] text-right truncate max-w-[180px]">
                      {order.listingTitle}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Pagamento</span>
                    <span className="font-semibold text-[#111827]">
                      {order.paymentMethod === 'PIX' ? 'Pix' : 'Cartão de Crédito'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Valor pago</span>
                    <span className="font-bold text-[#111827]">{order.amountFormatted}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#64748b]">Restituição estimada</span>
                    <span className="font-semibold text-[#2563eb]">A definir após análise</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#64748b]">Solicitante</span>
                    <span className="font-semibold text-[#111827]">Mariana Silva</span>
                  </div>
                </div>

                {/* No auto refund card */}
                <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                  <span className="text-[13px] font-bold text-[#111827] block">
                    Sem estorno automático
                  </span>
                  <p className="text-[12px] text-[#64748b] leading-tight">
                    A devolução não é imediata no gateway de pagamentos. Ela depende de parecer da
                    equipe de suporte financeiro.
                  </p>
                </div>
              </div>

              {/* Privacy Notice Card */}
              <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#16a34a]">
                  <IconShield className="size-5" />
                  <h4 className="text-[14px] font-bold text-[#111827]">
                    Privacidade e conformidade
                  </h4>
                </div>
                <p className="text-[12px] text-[#596679] leading-relaxed">
                  Não inclua dados bancários sensíveis, senhas ou dados de cartão nesta solicitação.
                  Se aprovado, o estorno ocorre na mesma modalidade de pagamento original.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
