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
  IconFile,
  IconFuel,
  IconGauge,
  IconInfo,
  IconShield,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getSellerListingById } from '@/lib/adapters/seller-listings-adapter';
import { createOrGetOrderForListing } from '@/lib/adapters/seller-orders-adapter';
import {
  SELLER_PLANS,
  type SellerPlanDefinition,
  formatBRL,
} from '@/lib/constants/seller-commercial';
import type { PaymentMethod, SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PlanSelectionPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;
  const router = useRouter();

  const [listing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );

  const [selectedPlanId, setSelectedPlanId] = useState<'basic' | 'extended'>('basic');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('PIX');
  const [photoLimitError, setPhotoLimitError] = useState<string | null>(null);

  // If listing not found, show safe Not Found state (Step 5)
  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] flex flex-col">
        <SellerNavbar variant="seller" activeTab="anuncios" />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-12">
          <div className="bg-white border border-[#d6dfea] rounded-[16px] p-8 max-w-[600px] mx-auto text-center shadow-sm">
            <div className="size-16 rounded-full bg-[#fef2f2] text-[#c41217] flex items-center justify-center mx-auto mb-4">
              <IconAlert className="size-8" />
            </div>
            <h1 className="text-[22px] font-bold text-[#111827] mb-2">Anúncio não encontrado</h1>
            <p className="text-[14px] text-[#596679] mb-6">
              O anúncio solicitado ({listingId}) não existe ou não pertence à sua conta de vendedor.
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

  const selectedPlan: SellerPlanDefinition = SELLER_PLANS[selectedPlanId];
  const photoCount = listing.galleryImages?.length || 1;

  const handleSelectPlan = (planId: 'basic' | 'extended') => {
    const targetPlan = SELLER_PLANS[planId];
    if (photoCount > targetPlan.maxPhotos) {
      setPhotoLimitError(
        `Este anúncio possui ${photoCount} fotos. O ${targetPlan.name} permite no máximo ${targetPlan.maxPhotos} fotos. Remova fotos excedentes ou escolha o Plano Estendido.`,
      );
      return;
    }
    setPhotoLimitError(null);
    setSelectedPlanId(planId);
  };

  const handleContinueToPayment = () => {
    // Check photo count safeguard
    if (photoCount > selectedPlan.maxPhotos) {
      setPhotoLimitError(
        `O limite de ${selectedPlan.maxPhotos} fotos foi excedido (${photoCount} fotos presentes). Ajuste o plano ou as fotos antes de prosseguir.`,
      );
      return;
    }

    const order = createOrGetOrderForListing(listing.id, selectedPlanId, selectedPaymentMethod);
    if (selectedPaymentMethod === 'PIX') {
      router.push(`/vendedor/pedidos/${order.id}/pix`);
    } else {
      router.push(`/vendedor/pedidos/${order.id}/cartao`);
    }
  };

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
              { label: listing.title, href: `/vendedor/anuncios/${listing.id}` },
              { label: 'Planos para publicar', active: true },
            ]}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f3ff] text-[#0066cc] text-[11px] font-semibold tracking-wide self-start sm:self-auto">
            <span>WEB-029 · Seleção de Plano</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-[26px] md:text-[32px] font-semibold text-[#111827] tracking-tight">
            Planos para publicar
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#596679] mt-1">
            Escolha um plano para publicar seu anúncio e ampliar sua visibilidade.
          </p>
        </div>

        {/* 3-Stage Stepper (Figma 744:538 / 1138:1971) */}
        <div className="bg-white border border-[#d6dfea] rounded-[12px] p-3 sm:p-4 mb-8 shadow-sm">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {/* Stage 1: Plano */}
            <div className="bg-[#fff0f1] border border-[#fecaca] rounded-[10px] p-3 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-[#c41217] text-white text-[12px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-[13px] sm:text-[15px] font-semibold text-[#c41217]">
                  Plano
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] text-[#c41217] font-medium">
                Etapa atual
              </span>
            </div>

            {/* Stage 2: Pagamento */}
            <div className="bg-[#f8f9fb] border border-[#e2e8f0] rounded-[10px] p-3 flex flex-col items-center justify-center opacity-70">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-[#e2e8f0] text-[#64748b] text-[12px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-[13px] sm:text-[15px] font-medium text-[#64748b]">
                  Pagamento
                </span>
              </div>
              <span className="text-[11px] sm:text-[12px] text-[#64748b]">Próxima etapa</span>
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
          {/* Left Column: Vehicle Summary & Plan Options */}
          <div className="lg:col-span-8 space-y-6">
            {/* Vehicle Header Card */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="relative w-full sm:w-[220px] h-[140px] rounded-[10px] overflow-hidden bg-[#f1f5f9] shrink-0 border border-[#e2e8f0]">
                  <Image
                    src={listing.imageUrl || '/images/vehicles/demo/fiat-strada-2023.jpg'}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-medium flex items-center gap-1">
                    <IconCar className="size-3" />
                    <span>{photoCount} fotos</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-[#596679] uppercase tracking-wider">
                      Cód. {listing.id}
                    </span>
                    <span className="size-1 rounded-full bg-[#cbd5e1]" />
                    <span className="text-[11px] font-semibold text-[#16a34a] bg-[#ecfdf5] px-2 py-0.5 rounded-full">
                      Aprovado na Moderação
                    </span>
                  </div>

                  <h2 className="text-[20px] sm:text-[23px] font-semibold text-[#111827] truncate">
                    {listing.title}
                  </h2>
                  <p className="text-[14px] text-[#596679] mb-4">{listing.subtitle}</p>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#e2e8f0] text-xs">
                    <div>
                      <span className="text-[#64748b] block">Ano</span>
                      <span className="font-semibold text-[#111827]">
                        {listing.yearModel || '2023'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748b] block">Km</span>
                      <span className="font-semibold text-[#111827]">
                        {listing.mileageKm
                          ? `${listing.mileageKm.toLocaleString('pt-BR')} km`
                          : '38.900 km'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748b] block">Combustível</span>
                      <span className="font-semibold text-[#111827]">{listing.fuel || 'Flex'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Limit Warning Alert if any */}
            {photoLimitError && (
              <div className="bg-[#fff0f1] border border-[#fecaca] rounded-[12px] p-4 flex items-start gap-3 text-[#991b1b]">
                <IconAlert className="size-5 shrink-0 mt-0.5 text-[#c41217]" />
                <div className="text-[13px] leading-relaxed">
                  <span className="font-bold block mb-0.5">Compatibilidade com fotos</span>
                  {photoLimitError}
                </div>
              </div>
            )}

            {/* Plans Selection Section */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Escolha o plano</h3>
                <p className="text-[13px] text-[#596679]">
                  Selecione a duração ideal para seu veículo. Sem assinatura ou renovação
                  automática.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Plano Básico */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan('basic')}
                  className={`text-left p-5 rounded-[12px] border-2 transition-all relative flex flex-col justify-between ${
                    selectedPlanId === 'basic'
                      ? 'border-[#c41217] bg-[#fff0f1]/40 shadow-sm'
                      : 'border-[#d6dfea] hover:border-[#cbd5e1] bg-white'
                  }`}
                >
                  {selectedPlanId === 'basic' && (
                    <span className="absolute top-3 right-3 size-6 rounded-full bg-[#c41217] text-white flex items-center justify-center">
                      <IconCheck className="size-3.5 stroke-[3]" />
                    </span>
                  )}
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] text-[11px] font-bold mb-2">
                      {SELLER_PLANS.basic.badgeLabel}
                    </span>
                    <h4 className="text-[17px] font-bold text-[#111827]">
                      {SELLER_PLANS.basic.name}
                    </h4>
                    <p className="text-[12px] text-[#596679] mt-1 mb-3">
                      {SELLER_PLANS.basic.description}
                    </p>
                    <div className="text-[24px] font-extrabold text-[#c41217] mb-4">
                      {SELLER_PLANS.basic.priceFormatted}
                      <span className="text-[12px] font-normal text-[#64748b] ml-1">/ 30 dias</span>
                    </div>
                  </div>

                  <ul className="space-y-2 border-t border-[#e2e8f0] pt-3 text-[12px] text-[#334155]">
                    {SELLER_PLANS.basic.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <IconCheck className="size-3.5 text-[#16a34a] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </button>

                {/* Plano Estendido */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan('extended')}
                  className={`text-left p-5 rounded-[12px] border-2 transition-all relative flex flex-col justify-between ${
                    selectedPlanId === 'extended'
                      ? 'border-[#c41217] bg-[#fff0f1]/40 shadow-sm'
                      : 'border-[#d6dfea] hover:border-[#cbd5e1] bg-white'
                  }`}
                >
                  {selectedPlanId === 'extended' && (
                    <span className="absolute top-3 right-3 size-6 rounded-full bg-[#c41217] text-white flex items-center justify-center">
                      <IconCheck className="size-3.5 stroke-[3]" />
                    </span>
                  )}
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold mb-2">
                      {SELLER_PLANS.extended.badgeLabel}
                    </span>
                    <h4 className="text-[17px] font-bold text-[#111827]">
                      {SELLER_PLANS.extended.name}
                    </h4>
                    <p className="text-[12px] text-[#596679] mt-1 mb-3">
                      {SELLER_PLANS.extended.description}
                    </p>
                    <div className="text-[24px] font-extrabold text-[#c41217] mb-4">
                      {SELLER_PLANS.extended.priceFormatted}
                      <span className="text-[12px] font-normal text-[#64748b] ml-1">/ 60 dias</span>
                    </div>
                  </div>

                  <ul className="space-y-2 border-t border-[#e2e8f0] pt-3 text-[12px] text-[#334155]">
                    {SELLER_PLANS.extended.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <IconCheck className="size-3.5 text-[#16a34a] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Forma de pagamento</h3>
                <p className="text-[13px] text-[#596679]">
                  Escolha como prefere realizar o pagamento para a ativação do anúncio.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Pix */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('PIX')}
                  className={`p-4 rounded-[12px] border-2 text-left flex items-start gap-3 transition-all ${
                    selectedPaymentMethod === 'PIX'
                      ? 'border-[#c41217] bg-[#fff0f1]/30'
                      : 'border-[#d6dfea] hover:border-[#cbd5e1] bg-white'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-[#f1f5f9] text-[#111827]">
                    <IconCoin className="size-5" />
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-[#111827] block">Pix</span>
                    <span className="text-[12px] text-[#596679] block">
                      Aprovação instantânea via QR Code ou código copia e cola.
                    </span>
                  </div>
                </button>

                {/* Cartão de Crédito */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('CREDIT_CARD')}
                  className={`p-4 rounded-[12px] border-2 text-left flex items-start gap-3 transition-all ${
                    selectedPaymentMethod === 'CREDIT_CARD'
                      ? 'border-[#c41217] bg-[#fff0f1]/30'
                      : 'border-[#d6dfea] hover:border-[#cbd5e1] bg-white'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-[#f1f5f9] text-[#111827]">
                    <IconCard className="size-5" />
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-[#111827] block">
                      Cartão de crédito
                    </span>
                    <span className="text-[12px] text-[#596679] block">
                      Ambiente seguro hospedado pelo provedor de pagamentos.
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Figma 744:548 / 1138:1993) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e2e8f0]">
                <IconFile className="size-5 text-[#c41217]" />
                <h3 className="text-[18px] font-bold text-[#111827]">Resumo do pedido</h3>
              </div>

              <div className="space-y-3.5 text-[13px]">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[#64748b]">Anúncio</span>
                  <span className="font-semibold text-[#111827] text-right truncate max-w-[180px]">
                    {listing.title}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Plano escolhido</span>
                  <span className="font-semibold text-[#111827]">{selectedPlan.name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Duração do anúncio</span>
                  <span className="font-semibold text-[#111827]">
                    {selectedPlan.durationDays} dias
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Limite de fotos</span>
                  <span className="font-semibold text-[#111827]">
                    Até {selectedPlan.maxPhotos} fotos
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Forma de pagamento</span>
                  <span className="font-semibold text-[#111827]">
                    {selectedPaymentMethod === 'PIX' ? 'Pix' : 'Cartão de crédito'}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-baseline">
                  <span className="font-bold text-[#111827] text-[15px]">Total a pagar</span>
                  <span className="text-[24px] font-black text-[#c41217]">
                    {selectedPlan.priceFormatted}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className="w-full h-[50px] inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#c41217] hover:bg-[#a81014] text-white text-[15px] font-bold transition-all shadow-sm hover:shadow"
                >
                  <span>Continuar para pagamento</span>
                  <IconArrowRight className="size-4" />
                </button>

                <p className="text-[11px] text-center text-[#64748b] mt-2.5 leading-normal">
                  Renovação 100% manual. Não realizamos cobranças automáticas no cartão.
                </p>
              </div>

              {/* Informative Assurance Note (Figma 2757:2247) */}
              <div className="mt-5 p-3 rounded-[10px] bg-[#e9f3ff] border border-[#d6dfea] flex items-start gap-2.5 text-[11px] text-[#1e40af] leading-relaxed">
                <IconInfo className="size-4 shrink-0 mt-0.5 text-[#2563eb]" />
                <span>
                  A cobrança é gerada em ambiente demonstrativo com provedor de pagamentos em espera
                  (PSP HOLD).
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
