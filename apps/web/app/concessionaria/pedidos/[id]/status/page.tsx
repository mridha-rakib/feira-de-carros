'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconEye,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { type DealerOrder, getDealerOrderById } from '@/lib/adapters/dealer-orders-adapter';
import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DealershipPaymentStatusPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<DealerOrder | null>(null);

  useEffect(() => {
    const loaded = getDealerOrderById(orderId);
    if (loaded) {
      setOrder(loaded);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans">
        <MarketplaceHeader />
        <DealershipSubNav activeItem="concessionarias" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#dee6f1] rounded-[16px] p-8 max-w-[560px] mx-auto text-center shadow-xs">
            <div className="size-14 rounded-full bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-6" />
            </div>
            <h1 className="text-[20px] font-bold text-[#16243c] mb-2">Pedido não encontrado</h1>
            <p className="text-[13px] text-[#63738e] mb-6">
              O pedido ({orderId}) não foi encontrado.
            </p>
            <Link
              href="/concessionaria/anuncios"
              className="inline-flex items-center gap-2 px-6 h-[44px] rounded-[8px] bg-[#b91c1c] text-white font-semibold text-[13px] hover:bg-[#991b1b] transition-colors"
            >
              <IconArrowLeft className="size-4" />
              <span>Voltar ao estoque</span>
            </Link>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fd] flex flex-col font-sans text-[#16243c]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[760px] w-full mx-auto px-4 sm:px-6 py-8 pb-20">
        {/* Status Card (Figma WEB-032 & WEB-033) */}
        <div className="bg-white border border-[#dee6f1] rounded-[18px] p-6 sm:p-10 text-center shadow-xs mb-6">
          {/* Status Icon */}
          <div className="size-18 sm:size-20 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center mx-auto mb-5 border-4 border-[#a7f3d0]/50">
            <IconCheck className="size-10" />
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#059669] bg-[#d1fae5] px-3 py-1 rounded-full mb-3">
            Transação Confirmada
          </span>

          <h1
            data-testid="heading-payment-confirmed"
            className="text-[26px] sm:text-[32px] font-bold text-[#16243c] tracking-tight mb-2"
          >
            Pagamento Realizado com Sucesso!
          </h1>
          <p className="text-[14px] text-[#63738e] max-w-[480px] mx-auto mb-8">
            Os benefícios contratados já estão ativos para o veículo no showroom da sua
            concessionária.
          </p>

          {/* Receipt / Order Info Box */}
          <div className="bg-[#f8fafc] border border-[#dee6f1] rounded-[14px] p-5 text-left space-y-3 mb-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <span className="text-[12px] text-[#63738e]">Código da transação</span>
              <span className="text-[13px] font-mono font-semibold text-[#16243c]">{order.id}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <span className="text-[12px] text-[#63738e]">Item ativado</span>
              <span className="text-[13px] font-bold text-[#b91c1c]">{order.planName}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <span className="text-[12px] text-[#63738e]">Veículo beneficiado</span>
              <span className="text-[13px] font-medium text-[#16243c]">
                {order.vehicleTitle} ({order.vehiclePlate})
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <span className="text-[12px] text-[#63738e]">Forma de pagamento</span>
              <span className="text-[13px] font-medium text-[#16243c]">
                {order.paymentMethod === 'PIX'
                  ? 'PIX Instantâneo'
                  : `Cartão de Crédito final ${order.cardLastFour || '4242'}`}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[13px] font-bold text-[#16243c]">Valor pago</span>
              <span className="text-[18px] font-extrabold text-[#059669]">
                {order.amountFormatted}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[500px] mx-auto">
            <Link
              href="/concessionaria/anuncios"
              data-testid="btn-back-to-inventory"
              className="h-[46px] px-6 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Ver no estoque</span>
              <IconArrowRight className="size-4" />
            </Link>

            <Link
              href="/concessionaria/mensagens"
              className="h-[46px] px-6 bg-white border border-[#d2dce8] hover:bg-[#f1f6fd] text-[#16243c] font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
            >
              <span>Ir para mensagens</span>
            </Link>
          </div>
        </div>

        {/* Showroom Link Banner */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[12px] p-4 flex items-center justify-between gap-4 text-[13px]">
          <div className="text-[#1e40af]">
            Deseja conferir como os compradores visualizam este veículo?
          </div>
          <Link
            href="/lojas/lider-seminovos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Abrir Showroom</span>
            <IconEye className="size-4" />
          </Link>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
