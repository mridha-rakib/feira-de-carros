'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCar,
  IconCard,
  IconCheck,
  IconClock,
  IconCoin,
  IconEye,
  IconFile,
  IconInfo,
  IconLock,
  IconQrCode,
  IconShield,
  IconSparkles,
  IconStar,
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

export default function PixCheckoutPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order] = useState<SellerOrder | null>(() => getSellerOrderById(orderId) || null);

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
              { label: 'Pagamento Pix', active: true },
            ]}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f3ff] text-[#0066cc] text-[11px] font-semibold tracking-wide self-start sm:self-auto">
            <span>WEB-030 · Checkout Pix (Demonstração)</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-[26px] md:text-[32px] font-semibold text-[#111827] tracking-tight">
            Detalhes do pagamento
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#596679] mt-1">
            Conclua o pagamento para ativar ou destacar o seu anúncio na plataforma.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Vehicle Selection, Payment Methods & Pix Placeholder */}
          <div className="lg:col-span-8 space-y-6">
            {/* Selected Vehicle Card */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <IconCar className="size-5 text-[#c41217]" />
                  <h2 className="text-[18px] font-semibold text-[#111827]">Anúncio selecionado</h2>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff2db] text-[#a86b08] text-[12px] font-semibold">
                  <IconClock className="size-3.5" />
                  <span>{order.statusLabel}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="relative w-full sm:w-[200px] h-[130px] rounded-[10px] overflow-hidden bg-[#f1f5f9] shrink-0 border border-[#e2e8f0]">
                  <Image
                    src={order.listingImageUrl || '/images/vehicles/demo/fiat-strada-2023.jpg'}
                    alt={order.listingTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[19px] sm:text-[22px] font-semibold text-[#111827] truncate">
                    {order.listingTitle}
                  </h3>
                  <p className="text-[14px] font-semibold text-[#a86b08] mt-1">
                    {order.planName} · {order.durationDays} dias
                  </p>
                  <p className="text-[13px] text-[#596679] mt-0.5">{order.listingSubtitle}</p>
                  <div className="text-[24px] font-black text-[#111827] mt-3">
                    {order.amountFormatted}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Switcher (Figma 2724:2456 / 2724:2461) */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Forma de pagamento</h3>
                <p className="text-[13px] text-[#596679]">
                  Escolha como deseja pagar pela publicação do anúncio.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Pix (Active) */}
                <div className="border-2 border-[#c41217] bg-[#fff0f1]/30 p-4 rounded-[12px] flex flex-col justify-between relative cursor-default">
                  <span className="absolute top-2.5 right-2.5 size-5 rounded-full bg-[#c41217] text-white flex items-center justify-center">
                    <IconCheck className="size-3 stroke-[3]" />
                  </span>
                  <div className="p-2 rounded-lg bg-white border border-[#fecaca] text-[#c41217] w-fit mb-2">
                    <IconCoin className="size-5" />
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-[#111827] block">Pix</span>
                    <span className="text-[11px] text-[#596679]">Instantâneo</span>
                  </div>
                </div>

                {/* Cartão de crédito (Link) */}
                <Link
                  href={`/vendedor/pedidos/${order.id}/cartao`}
                  className="border border-[#d6dfea] hover:border-[#c41217] p-4 rounded-[12px] flex flex-col justify-between transition-colors bg-white group"
                >
                  <div className="p-2 rounded-lg bg-[#f1f5f9] text-[#64748b] group-hover:text-[#c41217] w-fit mb-2">
                    <IconCard className="size-5" />
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-[#111827] block">
                      Cartão de crédito
                    </span>
                    <span className="text-[11px] text-[#596679]">Conforme emissor</span>
                  </div>
                </Link>

                {/* Boleto (Disabled) */}
                <div className="border border-[#e2e8f0] bg-[#f8fafc] p-4 rounded-[12px] flex flex-col justify-between opacity-60 cursor-not-allowed">
                  <div className="p-2 rounded-lg bg-[#e2e8f0] text-[#94a3b8] w-fit mb-2">
                    <IconFile className="size-5" />
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-[#94a3b8] block">
                      Boleto bancário
                    </span>
                    <span className="text-[11px] text-[#94a3b8]">Compensação 1-3 dias</span>
                  </div>
                </div>
              </div>

              {/* CRITICAL PSP RESTRICTION PLACEHOLDER (Figma 2724:2472) */}
              <div className="mt-6 border border-[#d6dfea] rounded-[12px] p-5 sm:p-6 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {/* Non-payable Demo Placeholder Box */}
                  <div className="w-[180px] h-[180px] bg-[#f2f6fb] border border-[#d6dfea] rounded-[10px] flex flex-col items-center justify-center text-center p-3 shrink-0">
                    <div className="size-12 rounded-full bg-[#e2e8f0] text-[#64748b] flex items-center justify-center mb-2">
                      <IconInfo className="size-6 text-[#596679]" />
                    </div>
                    <span className="text-[13px] font-bold text-[#596679] leading-tight">
                      QR Pix indisponível
                    </span>
                    <span className="text-[10px] text-[#64748b] mt-1 leading-tight">
                      Aguardando provedor (PSP HOLD)
                    </span>
                  </div>

                  {/* Explanatory Details & Copy Box */}
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <h4 className="text-[18px] font-bold text-[#111827]">Pague com Pix</h4>
                      <p className="text-[13px] text-[#596679] mt-0.5">
                        Um QR Code e código válido somente serão emitidos pelo provedor de
                        pagamentos autorizado.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="pix-code-field"
                        className="text-[12px] font-semibold text-[#111827] block mb-1"
                      >
                        Código do Pix (Copia e Cola)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="pix-code-field"
                          type="text"
                          readOnly
                          value="Aguardando geração segura de cobrança pelo provedor"
                          className="flex-1 h-[42px] px-3 rounded-[8px] bg-[#f2f6fb] border border-[#d6dfea] text-[12px] text-[#596679] cursor-not-allowed font-mono select-none"
                        />
                        <button
                          type="button"
                          disabled
                          className="h-[42px] px-4 rounded-[8px] bg-[#e2e8f0] text-[#94a3b8] text-[12px] font-semibold cursor-not-allowed shrink-0"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>

                    {/* Explicit Security Alert */}
                    <div className="p-2.5 rounded-[8px] bg-[#fff0f1] border border-[#fecaca] text-[12px] text-[#c41217] font-medium">
                      Nenhum código Pix real gerado neste protótipo. Não efetue transferências.
                    </div>
                  </div>
                </div>

                {/* Platform Policy Callout (Figma 2724:2485) */}
                <div className="mt-4 p-3.5 rounded-[10px] bg-[#e5f4ff] border border-[#b9e0ff] flex items-start gap-2.5 text-[12px] text-[#0066cc]">
                  <IconShield className="size-4 shrink-0 mt-0.5 text-[#0066cc]" />
                  <span>
                    Pagamento e publicação dependem de confirmação autenticada do provedor e
                    aprovação prévia do anúncio.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Action */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e2e8f0]">
                <IconFile className="size-5 text-[#c41217]" />
                <h3 className="text-[18px] font-bold text-[#111827]">Resumo do pedido</h3>
              </div>

              <div className="space-y-3.5 text-[13px]">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[#64748b]">Anúncio</span>
                  <span className="font-semibold text-[#111827] text-right truncate max-w-[180px]">
                    {order.listingTitle}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Plano</span>
                  <span className="font-semibold text-[#111827]">{order.planName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Período</span>
                  <span className="font-semibold text-[#111827]">{order.durationDays} dias</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Subtotal</span>
                  <span className="font-semibold text-[#111827]">{order.amountFormatted}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Taxa de serviço</span>
                  <span className="font-semibold text-[#16a34a]">R$ 0,00</span>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-baseline">
                  <span className="font-bold text-[#111827] text-[15px]">Total</span>
                  <span className="text-[24px] font-black text-[#c41217]">
                    {order.amountFormatted}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e2e8f0] space-y-3">
                <Link
                  href={`/vendedor/pedidos/${order.id}/status`}
                  className="w-full h-[50px] inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#c41217] hover:bg-[#a81014] text-white text-[14px] font-bold transition-all shadow-sm"
                >
                  <span>Verificar status do pagamento</span>
                  <IconArrowRight className="size-4" />
                </Link>

                <Link
                  href={`/vendedor/anuncios/${order.listingId}/plano`}
                  className="w-full h-[42px] inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#f8f9fb] border border-[#d6dfea] hover:bg-[#edf2f7] text-[#475569] text-[13px] font-semibold transition-colors"
                >
                  <IconArrowLeft className="size-3.5" />
                  <span>Alterar plano ou forma de pagamento</span>
                </Link>
              </div>
            </div>

            {/* Plan Benefits Sidebar Card (Figma 2724:2517) */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <IconStar className="size-5 text-[#f59e0b]" />
                <h4 className="text-[16px] font-bold text-[#111827]">Benefícios do seu plano</h4>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-[#ecfdf5] text-[#16a34a] shrink-0">
                    <IconEye className="size-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#111827] block">Mais visibilidade</span>
                    <span className="text-[#64748b]">
                      Sua publicação ativa e destacada na busca.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-[#ecfdf5] text-[#16a34a] shrink-0">
                    <IconCalendar className="size-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#111827] block">
                      Validade de {order.durationDays} dias
                    </span>
                    <span className="text-[#64748b]">
                      Período completo de exibição com renovação manual.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-[#ecfdf5] text-[#16a34a] shrink-0">
                    <IconShield className="size-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#111827] block">Segurança total</span>
                    <span className="text-[#64748b]">Sem renovações automáticas inesperadas.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
