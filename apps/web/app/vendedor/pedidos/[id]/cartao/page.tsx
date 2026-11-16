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
  IconCoin,
  IconFile,
  IconInfo,
  IconLock,
  IconShield,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getSellerOrderById } from '@/lib/adapters/seller-orders-adapter';
import type { SellerOrder } from '@/lib/types/seller-presentation';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CardCheckoutPage({ params }: PageProps) {
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
              { label: 'Cartão de crédito', active: true },
            ]}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f3ff] text-[#0066cc] text-[11px] font-semibold tracking-wide self-start sm:self-auto">
            <span>WEB-031 · Checkout Cartão (PSP Demonstrativo)</span>
          </div>
        </div>

        {/* 3-Stage Stepper (Figma 744:685) */}
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

            {/* Stage 2: Pagamento (Active) */}
            <div className="bg-[#fff0f1] border border-[#fecaca] rounded-[10px] p-3 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-[#c41217] text-white text-[12px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-[13px] sm:text-[15px] font-semibold text-[#c41217]">
                  Pagamento
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] text-[#c41217] font-medium">
                Etapa atual
              </span>
            </div>

            {/* Stage 3: Estado */}
            <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[10px] p-3 flex flex-col items-center justify-center opacity-70">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-[#e2e8f0] text-[#64748b] text-[12px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-[13px] sm:text-[15px] font-medium text-[#64748b]">
                  Estado
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] text-[#64748b]">Confirmação</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Card Form Fields & Security Assurances */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-start gap-3 pb-4 border-b border-[#e2e8f0]">
                <div className="p-2.5 rounded-xl bg-[#fff0f1] text-[#c41217] shrink-0">
                  <IconLock className="size-6" />
                </div>
                <div>
                  <h1 className="text-[20px] sm:text-[23px] font-bold text-[#111827]">
                    Pagamento com cartão de crédito
                  </h1>
                  <p className="text-[13px] text-[#596679] mt-0.5">
                    Campos seguros protegidos — não coletamos nem armazenamos PAN ou CVV neste
                    formulário.
                  </p>
                </div>
              </div>

              {/* Form fields mockup matching Figma 2757:2276 */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="cardholder-name"
                    className="text-[14px] font-semibold text-[#111827] block mb-1.5"
                  >
                    Nome impresso no cartão <span className="text-[#c41217]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="cardholder-name"
                      type="text"
                      disabled
                      placeholder="Ex.: João da Silva"
                      className="w-full h-[50px] pl-11 pr-4 rounded-[8px] bg-[#f8f9fb] border border-[#d6dfea] text-[14px] text-[#64748b] cursor-not-allowed select-none"
                    />
                    <IconLock className="size-4 text-[#94a3b8] absolute left-4 top-4" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="card-number"
                    className="text-[14px] font-semibold text-[#111827] block mb-1.5"
                  >
                    Número do cartão <span className="text-[#c41217]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="card-number"
                      type="text"
                      disabled
                      placeholder="•••• •••• •••• ••••"
                      className="w-full h-[50px] pl-11 pr-4 rounded-[8px] bg-[#f8f9fb] border border-[#d6dfea] text-[14px] text-[#64748b] cursor-not-allowed select-none font-mono"
                    />
                    <IconCard className="size-4 text-[#94a3b8] absolute left-4 top-4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="card-validity"
                      className="text-[14px] font-semibold text-[#111827] block mb-1.5"
                    >
                      Validade <span className="text-[#c41217]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="card-validity"
                        type="text"
                        disabled
                        placeholder="MM / AA"
                        className="w-full h-[50px] pl-11 pr-4 rounded-[8px] bg-[#f8f9fb] border border-[#d6dfea] text-[14px] text-[#64748b] cursor-not-allowed select-none"
                      />
                      <IconCalendar className="size-4 text-[#94a3b8] absolute left-4 top-4" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="card-cvv"
                      className="text-[14px] font-semibold text-[#111827] block mb-1.5"
                    >
                      Código de segurança (CVV) <span className="text-[#c41217]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="card-cvv"
                        type="text"
                        disabled
                        placeholder="•••"
                        className="w-full h-[50px] pl-11 pr-4 rounded-[8px] bg-[#f8f9fb] border border-[#d6dfea] text-[14px] text-[#64748b] cursor-not-allowed select-none font-mono"
                      />
                      <IconLock className="size-4 text-[#94a3b8] absolute left-4 top-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Assurance Box (Figma 2757:2299) */}
              <div className="p-4 sm:p-5 rounded-[10px] bg-[#e8f8ed] border border-[#c2ecd0] flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-[#d1f4dd] text-[#16a34a] shrink-0 mt-0.5">
                  <IconShield className="size-5" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#111827]">Pagamento seguro via PSP</h4>
                  <p className="text-[13px] text-[#334155] mt-0.5 leading-relaxed">
                    O processamento, tokenização e criptografia devem ocorrer diretamente em
                    componentes hospedados pelo provedor de pagamento certificado PCI-DSS. Esta tela
                    atua como protótipo de demonstração seguro.
                  </p>
                </div>
              </div>

              {/* Switch payment method option */}
              <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#596679]">
                <span>Prefere pagar instantaneamente com Pix?</span>
                <Link
                  href={`/vendedor/pedidos/${order.id}/pix`}
                  className="font-semibold text-[#c41217] hover:underline inline-flex items-center gap-1"
                >
                  <IconCoin className="size-3.5" />
                  Ir para pagamento Pix
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Navigation */}
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
                  <span className="text-[#64748b]">Duração</span>
                  <span className="font-semibold text-[#111827]">{order.durationDays} dias</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Forma de pagamento</span>
                  <span className="font-semibold text-[#111827]">Cartão de crédito</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Subtotal</span>
                  <span className="font-semibold text-[#111827]">{order.amountFormatted}</span>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-baseline">
                  <span className="font-bold text-[#111827] text-[15px]">Total a pagar</span>
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
                  <span>Continuar (Demonstração)</span>
                  <IconArrowRight className="size-4" />
                </Link>

                <p className="text-[11px] text-center text-[#64748b] leading-normal">
                  Nenhuma cobrança real é efetuada no cartão antes da liberação do gateway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
