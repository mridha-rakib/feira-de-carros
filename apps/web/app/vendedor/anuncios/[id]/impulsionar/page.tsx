'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCard,
  IconCheck,
  IconEye,
  IconInfo,
  IconShield,
  IconSparkles,
  IconStar,
  IconTrendingUp,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getSellerListingById } from '@/lib/adapters/seller-listings-adapter';
import { SELLER_BOOST } from '@/lib/constants/seller-commercial';
import type { SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FeaturedBoostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [listing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );

  const [simulationActive, setSimulationActive] = useState(false);

  // If listing not found, show safe Not Found state (Step 5)
  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
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

  // Check if listing is eligible for boost (must be active/published)
  const isEligible = listing.status === 'PUBLISHED' || listing.status === 'REVISED_PENDING';

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col font-['Inter',sans-serif]">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-12">
        {/* Breadcrumb & Traceability Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <SellerBreadcrumb
            items={[
              { label: 'Início', href: '/' },
              { label: 'Meus anúncios', href: '/vendedor/anuncios' },
              { label: listing.title, href: `/vendedor/anuncios/${listing.id}` },
              { label: 'Impulsionar anúncio', active: true },
            ]}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f3ff] text-[#0066cc] text-[11px] font-semibold tracking-wide self-start sm:self-auto">
            <span>WEB-037 · Destaque Promocional (Boost)</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-[26px] md:text-[31px] font-semibold text-[#101828] tracking-tight">
            Impulsionar anúncio
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#43516b] mt-1">
            Destaque promocional sujeito a elegibilidade, preço aprovado e confirmação de pagamento.
          </p>
        </div>

        {/* Eligibility Blue Banner (Figma 2801:2400) */}
        <div className="bg-[#e3eeff] border border-[#b9d5ff] rounded-[11px] p-4 sm:p-5 mb-8 flex items-start gap-4">
          <div className="size-10 rounded-full bg-[#cce2ff] text-[#0066cc] flex items-center justify-center shrink-0">
            <IconInfo className="size-5" />
          </div>
          <div>
            <h2 className="text-[17px] sm:text-[19px] font-semibold text-[#101828]">
              O anúncio deve permanecer ativo
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#101828]/90 mt-0.5">
              O destaque não pode ser iniciado para anúncios inativos, vendidos, removidos ou com
              pagamento pendente.
            </p>
          </div>
        </div>

        {/* Ineligibility Alert if applicable */}
        {!isEligible && (
          <div className="bg-[#fff0f1] border border-[#fecaca] rounded-[12px] p-5 mb-6 flex items-start gap-3.5 text-[#991b1b]">
            <IconAlert className="size-5 shrink-0 mt-0.5 text-[#c41217]" />
            <div>
              <span className="font-bold block text-[15px] mb-1">
                Anúncio inelegível para destaque
              </span>
              <p className="text-[13px] leading-relaxed">
                Este veículo atualmente está com status{' '}
                <span className="font-semibold underline">{listing.statusLabel}</span>. Somente
                veículos com anúncio publicado e ativo podem ser impulsionados.
              </p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Boost Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0]">
                <IconStar className="size-6 text-[#f59e0b]" />
                <div>
                  <h3 className="text-[20px] font-semibold text-[#101828]">Solicitar destaque</h3>
                  <p className="text-[13px] text-[#43516b] mt-0.5">
                    Revise a proposta e confira os requisitos para impulsionar seu anúncio.
                  </p>
                </div>
              </div>

              {/* Vehicle Row */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="relative w-full sm:w-[220px] h-[140px] rounded-[10px] overflow-hidden bg-[#f1f5f9] shrink-0 border border-[#e2e8f0]">
                  <Image
                    src={listing.imageUrl || '/images/vehicles/demo/vw-polo-2023.jpg'}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[20px] sm:text-[23px] font-semibold text-[#101828] truncate">
                    {listing.title}
                  </h4>
                  <p className="text-[13px] text-[#43516b] mt-0.5">
                    {listing.id} · {listing.city} / {listing.state}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e0f7e6] text-[#087e3d] text-[12px] font-semibold mt-2.5">
                    <IconCheck className="size-3.5 stroke-[3]" />
                    <span>Publicado (demo)</span>
                  </div>
                </div>
              </div>

              {/* Boost Preview & Price Cards (Figma 2801:2420 / 2801:2425) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#f6f8fb] border border-[#d6dfea] rounded-[11px] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[12px] font-semibold text-[#64748b] block mb-1">
                      Prévia ilustrativa
                    </span>
                    <span className="text-[19px] font-bold text-[#c41217] block">
                      Destaque em resultados
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0d0] text-[#a96904] text-xs font-bold">
                      <IconSparkles className="size-3.5" />
                      <span>{SELLER_BOOST.durationDays} dias · Destaque</span>
                    </span>
                  </div>
                </div>

                <div className="bg-[#f6f8fb] border border-[#d6dfea] rounded-[11px] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[12px] font-semibold text-[#64748b] block mb-1">
                      Valor do destaque
                    </span>
                    <span className="text-[28px] font-black text-[#101828] block">
                      {SELLER_BOOST.priceFormatted}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748b] mt-2">
                    Preço fixo aprovado no catálogo para 7 dias corridos.
                  </p>
                </div>
              </div>

              {/* Requirements & Safeguards (Figma 2801:2433) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[16px] font-bold text-[#101828]">O que precisa acontecer?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-[#d6dfea] rounded-[10px] p-3.5 bg-white">
                    <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828] mb-1">
                      <IconShield className="size-4 text-[#16a34a]" />
                      <span>Elegibilidade</span>
                    </div>
                    <p className="text-[12px] text-[#43516b]">Anúncio ativo e aprovado.</p>
                  </div>

                  <div className="border border-[#d6dfea] rounded-[10px] p-3.5 bg-white">
                    <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828] mb-1">
                      <IconCard className="size-4 text-[#0066cc]" />
                      <span>Pagamento</span>
                    </div>
                    <p className="text-[12px] text-[#43516b]">Confirmado pelo PSP.</p>
                  </div>

                  <div className="border border-[#d6dfea] rounded-[10px] p-3.5 bg-white">
                    <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828] mb-1">
                      <IconTrendingUp className="size-4 text-[#f59e0b]" />
                      <span>Resultados</span>
                    </div>
                    <p className="text-[12px] text-[#43516b]">Sem garantia de venda.</p>
                  </div>
                </div>
              </div>

              {/* Sold vehicle alert (Figma 2801:2449) */}
              <div className="p-4 rounded-[10px] bg-[#fff0d0] border border-[#fed7aa] flex items-start gap-3 text-[#92400e]">
                <IconInfo className="size-5 shrink-0 mt-0.5 text-[#b45309]" />
                <div className="text-[13px] leading-relaxed">
                  <span className="font-bold block mb-0.5">Se o veículo for vendido</span>O destaque
                  encerra imediatamente quando o veículo for marcado como vendido ou desativado.
                </div>
              </div>

              {simulationActive && (
                <div className="p-4 rounded-[10px] bg-[#e8f8ed] border border-[#bbf7d0] text-[13px] text-[#166534]">
                  Solicitação de destaque registrada com sucesso no protótipo de QA.
                </div>
              )}

              {/* Buttons */}
              <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/vendedor/anuncios"
                  className="w-full sm:w-auto px-6 h-[46px] rounded-[10px] bg-white border border-[#d6dfea] hover:bg-[#f8fafc] text-[#101828] text-[14px] font-semibold inline-flex items-center justify-center gap-2"
                >
                  <IconArrowLeft className="size-4" />
                  <span>Voltar aos meus anúncios</span>
                </Link>

                <button
                  type="button"
                  disabled={!isEligible}
                  onClick={() => setSimulationActive(true)}
                  className="w-full sm:w-auto px-6 h-[46px] rounded-[10px] bg-[#c41217] hover:bg-[#a81014] disabled:bg-[#9ca3af] disabled:cursor-not-allowed text-white text-[14px] font-bold inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Continuar com destaque (demo)</span>
                  <IconArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Boost Summary & Disclaimers */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#e2e8f0]">
                <IconStar className="size-5 text-[#f59e0b]" />
                <h3 className="text-[18px] font-bold text-[#101828]">Resumo do destaque</h3>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[#43516b]">Anúncio</span>
                  <span className="font-semibold text-[#101828] text-right truncate max-w-[180px]">
                    {listing.id}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#43516b]">Duração proposta</span>
                  <span className="font-semibold text-[#101828]">
                    {SELLER_BOOST.durationDays} dias
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#43516b]">Valor</span>
                  <span className="font-bold text-[#c41217] text-[15px]">
                    {SELLER_BOOST.priceFormatted}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#43516b]">Status</span>
                  <span className="font-semibold text-[#a86b08] bg-[#fff2db] px-2 py-0.5 rounded-full text-xs">
                    {simulationActive ? 'Aguardando PSP' : 'Não iniciado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Disclaimer Box */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <IconInfo className="size-5 text-[#0066cc]" />
                <h4 className="text-[16px] font-bold text-[#101828]">Sem garantia comercial</h4>
              </div>
              <p className="text-[13px] text-[#43516b] leading-relaxed">
                O impulsionamento amplia o alcance visual e a exibição do anúncio nos filtros de
                busca, sem promessa de propostas, contatos ou venda do veículo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
