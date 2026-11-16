'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCar,
  IconCheck,
  IconClock,
  IconCoin,
  IconCross,
  IconEye,
  IconInfo,
  IconShield,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getSellerOrderById } from '@/lib/adapters/seller-orders-adapter';
import type { OrderStatus, SellerOrder } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentStatusPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order] = useState<SellerOrder | null>(() => getSellerOrderById(orderId) || null);

  // QA Status simulator for reviewing all states in testing/demo environment
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(() => order?.status || 'PENDING');

  // If order not found, show safe Not Found state (Step 5)
  if (!order) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex flex-col">
        <SellerNavbar variant="seller" activeTab="anuncios" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#d6dfea] rounded-[16px] p-8 max-w-[600px] mx-auto text-center shadow-sm">
            <div className="size-16 rounded-full bg-[#fef2f2] text-[#c41217] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-8" />
            </div>
            <h1 className="text-[22px] font-bold text-[#111827] mb-2">Pedido não encontrado</h1>
            <p className="text-[14px] text-[#596679] mb-6">
              O pedido solicitado ({orderId}) não foi encontrado ou expirou.
            </p>
            <Link
              href="/vendedor/anuncios"
              className="inline-flex items-center gap-2 px-6 h-[46px] rounded-[10px] bg-[#c41217] text-white font-semibold text-[14px] hover:bg-[#a81014] transition-colors"
            >
              <IconArrowLeft className="size-4" />
              Voltar para Meus Anúncios
            </Link>
          </div>
        </main>
        <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col font-['Inter',sans-serif]">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-12">
        {/* Breadcrumb & Traceability Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <SellerBreadcrumb
            items={[
              { label: 'Início', href: '/' },
              { label: 'Meus anúncios', href: '/vendedor/anuncios' },
              { label: `Pedido ${order.id}`, active: false },
              { label: 'Estado do pagamento', active: true },
            ]}
          />
          <div className="flex items-center gap-2">
            {/* Developer QA Status Switcher for Visual Verification */}
            <select
              aria-label="Simulador de estado para QA"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
              className="text-xs bg-white border border-[#d6dfea] rounded-lg px-2 py-1 text-[#334155] cursor-pointer"
            >
              <option value="PENDING">QA: Pendente</option>
              <option value="PAID">QA: Confirmado (Pago)</option>
              <option value="FAILED">QA: Falhou</option>
              <option value="EXPIRED">QA: Expirado</option>
            </select>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f3ff] text-[#0066cc] text-[11px] font-semibold tracking-wide">
              <span>WEB-032 · Estado do Pagamento</span>
            </div>
          </div>
        </div>

        {/* 3-Stage Stepper with Stage 3 active (Figma 744:774) */}
        <div className="bg-white border border-[#d6dfea] rounded-[12px] p-3 sm:p-4 mb-8 shadow-sm">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {/* Stage 1: Plano */}
            <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[10px] p-3 flex flex-col items-center justify-center opacity-70">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-[#16a34a] text-white text-[12px] font-bold flex items-center justify-center">
                  ✓
                </span>
                <span className="text-[13px] sm:text-[15px] font-medium text-[#111827]">Plano</span>
              </div>
              <span className="text-[11px] sm:text-[12px] text-[#16a34a]">Concluído</span>
            </div>

            {/* Stage 2: Pagamento */}
            <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[10px] p-3 flex flex-col items-center justify-center opacity-70">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-[#16a34a] text-white text-[12px] font-bold flex items-center justify-center">
                  ✓
                </span>
                <span className="text-[13px] sm:text-[15px] font-medium text-[#111827]">
                  Pagamento
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] text-[#16a34a]">Iniciado</span>
            </div>

            {/* Stage 3: Estado (Active) */}
            <div className="bg-[#fff0f1] border border-[#fecaca] rounded-[10px] p-3 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-[#c41217] text-white text-[12px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-[13px] sm:text-[15px] font-semibold text-[#c41217]">
                  Estado
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] text-[#c41217] font-medium">
                Confirmação
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Vehicle & Status Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Status Card based on currentStatus */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-6 sm:p-8 shadow-sm">
              {currentStatus === 'PENDING' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-full bg-[#fff2dd] text-[#d97706] flex items-center justify-center shrink-0">
                      <IconClock className="size-7" />
                    </div>
                    <div>
                      <h1 className="text-[22px] sm:text-[25px] font-bold text-[#111827]">
                        Aguardando confirmação do pagamento
                      </h1>
                      <p className="text-[14px] text-[#596679] mt-1 leading-relaxed">
                        Seu pedido foi iniciado. Estamos aguardando a confirmação do pagamento pelo
                        provedor bancário.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#fff2dd] border border-[#fed7aa] flex items-start gap-3 text-[#92400e]">
                    <IconInfo className="size-5 shrink-0 mt-0.5 text-[#b45309]" />
                    <div className="text-[13px] leading-relaxed">
                      <span className="font-bold block mb-0.5">Confirmação em processamento</span>
                      Para Pix, a validação leva até 5 minutos. Em cartão de crédito, o retorno é
                      quase imediato dependendo do emissor.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStatus('PAID')}
                      className="px-6 h-[46px] rounded-[10px] bg-[#c41217] hover:bg-[#a81014] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <IconClock className="size-4" />
                      <span>Atualizar status agora</span>
                    </button>
                    <Link
                      href="/vendedor/anuncios"
                      className="px-6 h-[46px] rounded-[10px] bg-[#f8f9fb] border border-[#d6dfea] hover:bg-[#edf2f7] text-[#475569] font-semibold text-[14px] inline-flex items-center justify-center"
                    >
                      Voltar para Meus Anúncios
                    </Link>
                  </div>
                </div>
              )}

              {currentStatus === 'PAID' && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-full bg-[#e8f8ed] text-[#16a34a] flex items-center justify-center shrink-0">
                      <IconCheck className="size-7 stroke-[3]" />
                    </div>
                    <div>
                      <h1 className="text-[22px] sm:text-[25px] font-bold text-[#111827]">
                        Pagamento confirmado com sucesso!
                      </h1>
                      <p className="text-[14px] text-[#596679] mt-1 leading-relaxed">
                        A transação foi autenticada pelo provedor. O seu anúncio está ativo e
                        publicado na Feira de Carros.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#e8f8ed] border border-[#bbf7d0] flex items-start gap-3 text-[#166534]">
                    <IconCheck className="size-5 shrink-0 mt-0.5 text-[#16a34a]" />
                    <div className="text-[13px] leading-relaxed">
                      <span className="font-bold block mb-0.5">Anúncio Publicado e Ativo</span>
                      Seu veículo agora está visível para milhares de compradores na plataforma.
                      Acompanhe visualizações e contatos no painel.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                      href={`/vendedor/anuncios/${order.listingId}`}
                      className="px-6 h-[46px] rounded-[10px] bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <IconEye className="size-4" />
                      <span>Ver anúncio publicado</span>
                    </Link>
                    <Link
                      href="/vendedor/anuncios"
                      className="px-6 h-[46px] rounded-[10px] bg-[#f8f9fb] border border-[#d6dfea] hover:bg-[#edf2f7] text-[#475569] font-semibold text-[14px] inline-flex items-center justify-center"
                    >
                      Gerenciar Meus Anúncios
                    </Link>
                  </div>
                </div>
              )}

              {(currentStatus === 'FAILED' || currentStatus === 'EXPIRED') && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-full bg-[#fff0f1] text-[#c41217] flex items-center justify-center shrink-0">
                      <IconCross className="size-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h1 className="text-[22px] sm:text-[25px] font-bold text-[#111827]">
                        {currentStatus === 'FAILED'
                          ? 'O pagamento não foi concluído'
                          : 'Cobrança expirada'}
                      </h1>
                      <p className="text-[14px] text-[#596679] mt-1 leading-relaxed">
                        {currentStatus === 'FAILED'
                          ? 'A transação foi recusada pela instituição financeira ou houve instabilidade de rede.'
                          : 'O tempo limite para pagamento do código Pix foi excedido sem confirmação.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#fff0f1] border border-[#fecaca] flex items-start gap-3 text-[#991b1b]">
                    <IconAlert className="size-5 shrink-0 mt-0.5 text-[#c41217]" />
                    <div className="text-[13px] leading-relaxed">
                      <span className="font-bold block mb-0.5">Não se preocupe</span>
                      Seu anúncio permanece seguro e aprovado na moderação. Você pode tentar
                      novamente a qualquer momento com Pix ou outro cartão.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                      href={`/vendedor/pedidos/${order.id}/pix`}
                      className="px-6 h-[46px] rounded-[10px] bg-[#c41217] hover:bg-[#a81014] text-white font-semibold text-[14px] inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <IconCoin className="size-4" />
                      <span>Tentar novamente com Pix</span>
                    </Link>
                    <Link
                      href={`/vendedor/pedidos/${order.id}/cartao`}
                      className="px-6 h-[46px] rounded-[10px] bg-[#f8f9fb] border border-[#d6dfea] hover:bg-[#edf2f7] text-[#475569] font-semibold text-[14px] inline-flex items-center justify-center"
                    >
                      Tentar com Cartão
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Card Summary (Figma 2757:2362) */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="relative w-full sm:w-[180px] h-[120px] rounded-[10px] overflow-hidden bg-[#f1f5f9] shrink-0 border border-[#e2e8f0]">
                  <Image
                    src={order.listingImageUrl || '/images/vehicles/demo/fiat-strada-2023.jpg'}
                    alt={order.listingTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-[#596679] uppercase tracking-wider block mb-1">
                    Pedido #{order.id}
                  </span>
                  <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#111827] truncate">
                    {order.listingTitle}
                  </h3>
                  <p className="text-[13px] text-[#596679] mt-0.5">{order.listingSubtitle}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-3 mt-3 border-t border-[#e2e8f0] text-xs">
                    <div className="flex items-center gap-1.5 text-[#334155]">
                      <IconCalendar className="size-4 text-[#64748b]" />
                      <span className="font-semibold">{order.planName}</span>
                      <span className="text-[#64748b]">({order.durationDays} dias)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#334155]">
                      <IconCoin className="size-4 text-[#64748b]" />
                      <span className="font-extrabold text-[#111827]">{order.amountFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline (Figma 2757:2408) */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#e2e8f0]">
                <IconCalendar className="size-5 text-[#c41217]" />
                <h3 className="text-[17px] font-bold text-[#111827]">Linha do tempo do pedido</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                {/* Step 1 */}
                <div className="border border-[#e2e8f0] rounded-[10px] p-3 bg-[#f8fafc]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-5 rounded-full bg-[#16a34a] text-white text-[10px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-[12px] font-bold text-[#111827]">1. Criado</span>
                  </div>
                  <span className="text-[11px] text-[#64748b] block">
                    {order.createdAtFormatted}
                  </span>
                </div>

                {/* Step 2 */}
                <div className="border border-[#e2e8f0] rounded-[10px] p-3 bg-[#f8fafc]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-5 rounded-full bg-[#16a34a] text-white text-[10px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-[12px] font-bold text-[#111827]">2. Aprovado</span>
                  </div>
                  <span className="text-[11px] text-[#64748b] block">Moderação OK</span>
                </div>

                {/* Step 3 */}
                <div
                  className={`border rounded-[10px] p-3 ${
                    currentStatus === 'PAID'
                      ? 'bg-[#ecfdf5] border-[#bbf7d0]'
                      : currentStatus === 'PENDING'
                        ? 'bg-[#fffbeb] border-[#fde68a]'
                        : 'bg-[#fef2f2] border-[#fecaca]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`size-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                        currentStatus === 'PAID'
                          ? 'bg-[#16a34a]'
                          : currentStatus === 'PENDING'
                            ? 'bg-[#d97706]'
                            : 'bg-[#dc2626]'
                      }`}
                    >
                      {currentStatus === 'PAID' ? '✓' : currentStatus === 'PENDING' ? '⏳' : '✕'}
                    </span>
                    <span className="text-[12px] font-bold text-[#111827]">3. Pagamento</span>
                  </div>
                  <span className="text-[11px] text-[#64748b] block">
                    {currentStatus === 'PAID'
                      ? 'Confirmado'
                      : currentStatus === 'PENDING'
                        ? 'Aguardando'
                        : 'Não concluído'}
                  </span>
                </div>

                {/* Step 4 */}
                <div
                  className={`border rounded-[10px] p-3 ${
                    currentStatus === 'PAID'
                      ? 'bg-[#ecfdf5] border-[#bbf7d0]'
                      : 'bg-[#f8fafc] border-[#e2e8f0] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`size-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                        currentStatus === 'PAID' ? 'bg-[#16a34a]' : 'bg-[#94a3b8]'
                      }`}
                    >
                      {currentStatus === 'PAID' ? '✓' : '4'}
                    </span>
                    <span className="text-[12px] font-bold text-[#111827]">4. Publicado</span>
                  </div>
                  <span className="text-[11px] text-[#64748b] block">
                    {currentStatus === 'PAID' ? 'Ao vivo' : 'Aguardando'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Status Reference Cards (Figma 2757:2392) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-3">
              <h4 className="text-[15px] font-bold text-[#111827]">Estados do Pedido</h4>
              <p className="text-[12px] text-[#596679]">
                Significado de cada status no fluxo financeiro da plataforma:
              </p>

              {/* Status Reference: Pendente */}
              <div className="p-3.5 rounded-[10px] bg-[#fff2dd] border border-[#fed7aa] space-y-1">
                <div className="flex items-center gap-2">
                  <IconClock className="size-4 text-[#b45309]" />
                  <span className="text-[13px] font-bold text-[#92400e]">Pendente</span>
                </div>
                <p className="text-[12px] text-[#92400e]/90 leading-tight">
                  Aguardando confirmação segura pelo gateway de pagamentos.
                </p>
              </div>

              {/* Status Reference: Confirmado */}
              <div className="p-3.5 rounded-[10px] bg-[#e8f8ed] border border-[#bbf7d0] space-y-1">
                <div className="flex items-center gap-2">
                  <IconCheck className="size-4 text-[#16a34a]" />
                  <span className="text-[13px] font-bold text-[#166534]">Confirmado</span>
                </div>
                <p className="text-[12px] text-[#166534]/90 leading-tight">
                  Aprovado pelo provedor e ativado na plataforma.
                </p>
              </div>

              {/* Status Reference: Falhou / Expirou */}
              <div className="p-3.5 rounded-[10px] bg-[#fff0f1] border border-[#fecaca] space-y-1">
                <div className="flex items-center gap-2">
                  <IconCross className="size-4 text-[#c41217]" />
                  <span className="text-[13px] font-bold text-[#991b1b]">Falhou / Expirou</span>
                </div>
                <p className="text-[12px] text-[#991b1b]/90 leading-tight">
                  Pagamento não concluído. Não houve débito.
                </p>
              </div>
            </div>

            {/* Invariant Policy Assurance */}
            <div className="p-4 rounded-[12px] bg-[#e9f3ff] border border-[#d6dfea] text-[12px] text-[#1e40af] leading-relaxed">
              <span className="font-bold block mb-1">Importante</span>A moderação do anúncio, a
              confirmação do pagamento e a publicação são etapas distintas e independentes no
              backend.
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
