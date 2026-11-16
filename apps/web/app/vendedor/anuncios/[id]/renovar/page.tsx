'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCard,
  IconCheck,
  IconClock,
  IconCoin,
  IconFile,
  IconInfo,
  IconShield,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getSellerListingById } from '@/lib/adapters/seller-listings-adapter';
import { SELLER_PLANS } from '@/lib/constants/seller-commercial';
import type { SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ListingRenewalPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [listing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );

  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [simulationSuccess, setSimulationSuccess] = useState(false);

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

  const selectedPlan = selectedDuration === 30 ? SELLER_PLANS.basic : SELLER_PLANS.extended;

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
              { label: 'Renovar anúncio', active: true },
            ]}
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f3ff] text-[#0066cc] text-[11px] font-semibold tracking-wide self-start sm:self-auto">
            <span>WEB-036 · Renovação Manual</span>
          </div>
        </div>

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-[26px] md:text-[31px] font-semibold text-[#101828] tracking-tight">
            Renovar anúncio
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#43516b] mt-1">
            Renovação é manual e depende de elegibilidade, política e novo pagamento confirmado.
          </p>
        </div>

        {/* Eligibility Blue Banner (Figma 2801:2302) */}
        <div className="bg-[#e3eeff] border border-[#b9d5ff] rounded-[11px] p-4 sm:p-5 mb-8 flex items-start gap-4">
          <div className="size-10 rounded-full bg-[#cce2ff] text-[#0066cc] flex items-center justify-center shrink-0">
            <IconInfo className="size-5" />
          </div>
          <div>
            <h2 className="text-[17px] sm:text-[19px] font-semibold text-[#101828]">
              Verifique a elegibilidade antes de renovar
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#101828]/90 mt-0.5">
              Seu anúncio precisa estar ativo, em conformidade com as diretrizes e elegível para
              renovação no catálogo.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Renewal Details & Rules */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0]">
                <IconCalendar className="size-6 text-[#c41217]" />
                <div>
                  <h3 className="text-[20px] font-semibold text-[#101828]">
                    Renovação do meu anúncio
                  </h3>
                  <p className="text-[13px] text-[#43516b] mt-0.5">
                    Revise os detalhes do veículo e confira a proposta de renovação manual.
                  </p>
                </div>
              </div>

              {/* Vehicle Summary Row */}
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
                    <span>Publicado</span>
                  </div>
                </div>
              </div>

              {/* Validity Transition (Figma 2801:2324 / 2801:2332) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Validade atual */}
                <div className="bg-[#f6f8fb] border border-[#d6dfea] rounded-[11px] p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-[#101828] text-[13px] font-semibold mb-2">
                    <IconClock className="size-4 text-[#596679]" />
                    <span>Validade atual</span>
                  </div>
                  <span className="text-[14px] text-[#101828] font-medium">
                    {listing.expiresAtFormatted || 'Ativo · 30 dias restantes'}
                  </span>
                </div>

                {/* Renovação proposta */}
                <div className="bg-[#fff0f1] border border-[#f6b8bf] rounded-[11px] p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-[#c41217] text-[13px] font-semibold mb-2">
                    <IconCalendar className="size-4 text-[#c41217]" />
                    <span>Renovação proposta</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] text-[#101828] font-bold">
                      +{selectedDuration} dias
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDuration(30)}
                        className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                          selectedDuration === 30
                            ? 'bg-[#c41217] text-white'
                            : 'bg-white text-[#475569] border border-[#d6dfea]'
                        }`}
                      >
                        30 dias (R$ 30)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDuration(60)}
                        className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                          selectedDuration === 60
                            ? 'bg-[#c41217] text-white'
                            : 'bg-white text-[#475569] border border-[#d6dfea]'
                        }`}
                      >
                        60 dias (R$ 50)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditions Cards (Figma 2801:2338) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="border border-[#d6dfea] rounded-[10px] p-3.5 bg-white">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828] mb-1">
                    <IconClock className="size-4 text-[#0066cc]" />
                    <span>Renovação manual</span>
                  </div>
                  <p className="text-[12px] text-[#43516b]">
                    Você solicita somente quando desejar. Sem assinaturas.
                  </p>
                </div>

                <div className="border border-[#d6dfea] rounded-[10px] p-3.5 bg-white">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828] mb-1">
                    <IconShield className="size-4 text-[#16a34a]" />
                    <span>Elegibilidade</span>
                  </div>
                  <p className="text-[12px] text-[#43516b]">
                    Sujeita às regras da plataforma e status ativo do anúncio.
                  </p>
                </div>

                <div className="border border-[#d6dfea] rounded-[10px] p-3.5 bg-white">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828] mb-1">
                    <IconCard className="size-4 text-[#c41217]" />
                    <span>Novo pagamento</span>
                  </div>
                  <p className="text-[12px] text-[#43516b]">
                    Ativação somente após pagamento confirmado pelo gateway.
                  </p>
                </div>
              </div>

              {/* Grace period cutoff & no auto renewal warning */}
              <div className="p-4 rounded-[10px] bg-[#fff0d0] border border-[#fed7aa] flex items-start gap-3 text-[#92400e]">
                <IconAlert className="size-5 shrink-0 mt-0.5 text-[#b45309]" />
                <div className="text-[13px] leading-relaxed">
                  <span className="font-bold block mb-0.5">Sem renovação automática</span>
                  Importante: A renovação ocorre exclusivamente após a aprovação de elegibilidade e
                  confirmação do pagamento via PSP.
                </div>
              </div>

              {simulationSuccess && (
                <div className="p-4 rounded-[10px] bg-[#e8f8ed] border border-[#bbf7d0] text-[13px] text-[#166534]">
                  Simulação de renovação registrada com sucesso no protótipo de QA.
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href={`/vendedor/anuncios/${listing.id}`}
                  className="w-full sm:w-auto px-6 h-[46px] rounded-[10px] bg-white border border-[#d6dfea] hover:bg-[#f8fafc] text-[#101828] text-[14px] font-semibold inline-flex items-center justify-center gap-2"
                >
                  <IconArrowLeft className="size-4" />
                  <span>Voltar para o anúncio</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSimulationSuccess(true)}
                  className="w-full sm:w-auto px-6 h-[46px] rounded-[10px] bg-[#c41217] hover:bg-[#a81014] text-white text-[14px] font-bold inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Simular renovação manual</span>
                  <IconArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Renewal Summary & Auto Renewal Policy (Figma 2801:2367 / 2801:2389) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Summary Card */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#e2e8f0]">
                <IconFile className="size-5 text-[#c41217]" />
                <h3 className="text-[18px] font-bold text-[#101828]">Resumo da renovação</h3>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[#43516b]">Anúncio</span>
                  <span className="font-semibold text-[#101828] text-right truncate max-w-[180px]">
                    {listing.title}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#43516b]">Período de renovação</span>
                  <span className="font-semibold text-[#101828]">+{selectedDuration} dias</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#43516b]">Valor proposto</span>
                  <span className="font-bold text-[#c41217] text-[15px]">
                    {selectedPlan.priceFormatted}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#43516b]">Elegibilidade</span>
                  <span className="font-semibold text-[#a86b08] bg-[#fff2db] px-2 py-0.5 rounded-full text-xs">
                    Pendente
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#43516b]">Pagamento</span>
                  <span className="font-semibold text-[#64748b]">Não iniciado</span>
                </div>
              </div>
            </div>

            {/* Sidebar Notice: Sem Renovação Automática */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <IconInfo className="size-5 text-[#0066cc]" />
                <h4 className="text-[16px] font-bold text-[#101828]">Sem renovação automática</h4>
              </div>
              <p className="text-[13px] text-[#43516b] leading-relaxed">
                Você nunca será cobrado sem o seu consentimento ativo. Quando o período expirar, o
                anúncio é pausado e você decide se deseja renovar.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
