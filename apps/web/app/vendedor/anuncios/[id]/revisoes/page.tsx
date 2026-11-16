'use client';

import { getSellerListingById } from '@/lib/adapters/seller-listings-adapter';
import type { SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SellerBreadcrumb } from '../../../../components/SellerBreadcrumb';
import {
  IconArrowLeft,
  IconCalendar,
  IconCar,
  IconCheck,
  IconClock,
  IconCoin,
  IconEdit,
  IconFile,
  IconFuel,
  IconGauge,
  IconInfo,
  IconShield,
} from '../../../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../../../components/SellerNavbar';

export default function PendingRevisionComparisonPage() {
  const params = useParams();
  const listingId = (params?.id as string) || 'FDC-2026-0189';

  const [listing, setListing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );

  useEffect(() => {
    const data = getSellerListingById(listingId);
    if (data) {
      setListing(data);
    }
  }, [listingId]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f3f7fc] flex flex-col font-sans">
        <SellerNavbar variant="seller" activeTab="anuncios" />
        <div className="flex-1 max-w-4xl mx-auto py-16 px-4 text-center">
          <p className="text-gray-500">Carregando comparação de versões...</p>
        </div>
      </div>
    );
  }

  // Use pending revision or fallback simulation for demonstration
  const revision = listing.pendingRevision || {
    id: 'rev-demo-01',
    listingId: listing.id,
    status: 'PENDING' as const,
    createdAt: '2026-10-24T15:00:00Z',
    createdAtFormatted: '24 out 2026 às 15:00',
    priceCents: 6190000,
    priceFormatted: 'R$ 61.900,00',
    mileageKm: 44700,
    mileageFormatted: '44.700 km',
    description: listing.description,
    photos: listing.galleryImages,
  };

  const isPriceChanged = revision.priceCents !== listing.priceCents;
  const isMileageChanged = revision.mileageKm !== listing.mileageKm;
  const isDescriptionChanged = revision.description.trim() !== listing.description.trim();

  return (
    <div className="min-h-screen bg-[#f3f7fc] flex flex-col font-sans text-[#111827]">
      {/* Navbar: Approved Seller */}
      <SellerNavbar variant="seller" activeTab="anuncios" />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-16">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: 'Comparação de versões', active: true },
          ]}
          mobileShortLabel="Feira de Carros › Meus anúncios › Comparar versões"
        />

        {/* Heading (matching 2756:2281-2282 & mobile 1109:1773-1776) */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#111827] tracking-tight">
            Comparar versões em análise
          </h1>
          <p className="text-sm sm:text-base text-[#576379] mt-1">
            Confira lado a lado a versão atual publicada e as alterações solicitadas.
          </p>
          <p className="text-xs font-semibold text-[#c41217] mt-1 md:hidden">
            WEB-035 · Preview demonstrativo
          </p>
        </div>

        {/* Mobile Notice Banner (matching mobile 1109:1806-1808) */}
        <div className="bg-[#fff3e5] border border-[#fde4ba] rounded-[9px] p-3 mb-6 md:hidden">
          <p className="text-xs font-semibold text-[#121a2b]">Atualização em análise</p>
          <p className="text-[11px] text-[#616f82] mt-0.5">
            O preço publicado continua {listing.priceFormatted} até decisão do Main Admin.
          </p>
        </div>

        {/* 3-Column Layout (matching 2756:2283, 2756:2297, 2756:2353) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Published Vehicle Card (lg:col-span-4) (matching 2756:2283-2296) */}
          <div className="lg:col-span-4 bg-white border border-[#d6dfeb] rounded-[11px] p-5 shadow-2xs space-y-4">
            <div className="relative h-56 sm:h-64 w-full rounded-[9px] overflow-hidden bg-gray-100 border border-[#d6dfeb]">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#111827]">{listing.title}</h2>

              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff3dc] text-[#b37406]">
                  <IconClock className="size-3.5" />
                  <span>Em revisão</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#576379] mt-3">
                {listing.category} • {listing.id}
              </p>
            </div>

            {/* Notice: Live version remains active */}
            <div className="bg-[#e6f1ff] border border-[#bdd7ff] rounded-[9px] p-3.5 flex gap-2.5 items-start">
              <IconInfo className="size-5 text-[#0369a1] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#111827] leading-relaxed">
                A versão publicada continua ativa durante a análise e visível aos compradores.
              </p>
            </div>
          </div>

          {/* Column 2: Field Changes Comparison Table (lg:col-span-5) (matching 2756:2297-2352) */}
          <div className="lg:col-span-5 bg-white border border-[#d6dfeb] rounded-[11px] p-5 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5">
              <IconFile className="size-5 text-[#111827]" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#111827]">
                Comparação de versões
              </h3>
            </div>

            {/* Comparison Table */}
            <div className="border border-[#d6dfeb] rounded-[9px] overflow-hidden">
              <div className="grid grid-cols-12 text-xs font-semibold bg-[#f4f6fa] border-b border-[#d6dfeb] text-[#111827] py-2.5 px-3">
                <div className="col-span-4">Informação</div>
                <div className="col-span-4">Publicado</div>
                <div className="col-span-4 text-[#c41217]">Proposta</div>
              </div>

              {/* Preço Row */}
              <div className="grid grid-cols-12 text-xs sm:text-sm border-b border-[#d6dfeb] items-center p-3">
                <div className="col-span-4 flex items-center gap-1.5 font-semibold text-[#111827]">
                  <IconCoin className="size-4 text-[#576379]" />
                  <span>Preço</span>
                </div>
                <div className="col-span-4 text-[#111827]">{listing.priceFormatted}</div>
                <div className="col-span-4">
                  <span
                    className={`inline-block px-2 py-1 rounded font-semibold text-xs ${
                      isPriceChanged ? 'bg-[#fff0f1] text-[#c41217]' : 'bg-white text-[#111827]'
                    }`}
                  >
                    {revision.priceFormatted}
                  </span>
                </div>
              </div>

              {/* Quilometragem Row */}
              <div className="grid grid-cols-12 text-xs sm:text-sm border-b border-[#d6dfeb] items-center p-3">
                <div className="col-span-4 flex items-center gap-1.5 font-semibold text-[#111827]">
                  <IconGauge className="size-4 text-[#576379]" />
                  <span>Quilometragem</span>
                </div>
                <div className="col-span-4 text-[#111827]">{listing.mileageFormatted}</div>
                <div className="col-span-4">
                  <span
                    className={`inline-block px-2 py-1 rounded font-semibold text-xs ${
                      isMileageChanged ? 'bg-[#fff0f1] text-[#c41217]' : 'bg-white text-[#111827]'
                    }`}
                  >
                    {revision.mileageFormatted}
                  </span>
                </div>
              </div>

              {/* Ano Modelo Row */}
              <div className="grid grid-cols-12 text-xs sm:text-sm border-b border-[#d6dfeb] items-center p-3">
                <div className="col-span-4 flex items-center gap-1.5 font-semibold text-[#111827]">
                  <IconCalendar className="size-4 text-[#576379]" />
                  <span>Ano modelo</span>
                </div>
                <div className="col-span-4 text-[#111827]">{listing.yearModel}</div>
                <div className="col-span-4 text-[#111827] px-2 py-1">{listing.yearModel}</div>
              </div>

              {/* Versão Row */}
              <div className="grid grid-cols-12 text-xs sm:text-sm border-b border-[#d6dfeb] items-center p-3">
                <div className="col-span-4 flex items-center gap-1.5 font-semibold text-[#111827]">
                  <IconCar className="size-4 text-[#576379]" />
                  <span>Versão</span>
                </div>
                <div className="col-span-4 text-[#111827]">{listing.model}</div>
                <div className="col-span-4 text-[#111827] px-2 py-1">{listing.model}</div>
              </div>

              {/* Combustível Row */}
              <div className="grid grid-cols-12 text-xs sm:text-sm border-b border-[#d6dfeb] items-center p-3">
                <div className="col-span-4 flex items-center gap-1.5 font-semibold text-[#111827]">
                  <IconFuel className="size-4 text-[#576379]" />
                  <span>Combustível</span>
                </div>
                <div className="col-span-4 text-[#111827]">{listing.fuel}</div>
                <div className="col-span-4 text-[#111827] px-2 py-1">{listing.fuel}</div>
              </div>

              {/* Descrição Row */}
              <div className="p-3 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xs text-[#111827]">Descrição proposta:</p>
                  {isDescriptionChanged && (
                    <span className="text-[10px] font-semibold text-[#c41217] bg-[#fff0f1] px-2 py-0.5 rounded">
                      Alterada
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#475569] bg-white p-2.5 rounded border border-[#e2e8f0] whitespace-pre-wrap leading-relaxed">
                  {revision.description}
                </p>
              </div>
            </div>

            {/* Notice banner below table (matching 2756:2344) */}
            <div className="bg-[#e6f1ff] border border-[#bdd7ff] rounded-[9px] p-3 flex gap-2.5 items-start">
              <IconInfo className="size-5 text-[#0369a1] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#111827]">
                A publicação atual não será alterada antes da aprovação pela moderação.
              </p>
            </div>

            {/* Return Button (matching 2756:2349) */}
            <div className="pt-2">
              <Link
                href="/vendedor/anuncios"
                className="w-full h-12 rounded-[7px] border border-[#d6dfeb] hover:bg-gray-50 text-[#111827] font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <IconArrowLeft className="size-4" />
                <span>Voltar aos meus anúncios</span>
              </Link>
            </div>
          </div>

          {/* Column 3: Review Outcomes & Publication Info (lg:col-span-3) (matching 2756:2353-2375) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Card 1: Possíveis resultados */}
            <div className="bg-white border border-[#d6dfeb] rounded-[11px] p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5">
                <IconShield className="size-5 text-[#111827]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#111827]">
                  Possíveis resultados
                </h3>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#d6dfeb]">
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#111827]">
                    <IconCheck className="size-4 text-[#15803d]" />
                    <span>Aprovada</span>
                  </div>
                  <p className="text-xs text-[#576379] mt-0.5 pl-5.5">
                    A versão aprovada substitui a atual automaticamente.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#111827]">
                    <IconInfo className="size-4 text-[#0369a1]" />
                    <span>Reprovada</span>
                  </div>
                  <p className="text-xs text-[#576379] mt-0.5 pl-5.5">
                    O anúncio original permanece ativo sem alterações.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#111827]">
                    <IconEdit className="size-4 text-[#b86b0a]" />
                    <span>Ajustes solicitados</span>
                  </div>
                  <p className="text-xs text-[#576379] mt-0.5 pl-5.5">
                    Você poderá corrigir os pontos indicados e reenviar.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Publicação preservada (matching 2756:2370) */}
            <div className="bg-[#e6f1ff] border border-[#bdd7ff] rounded-[11px] p-5 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#0369a1]">
                <IconInfo className="size-5" />
                <h3 className="text-base font-semibold text-[#111827]">Publicação preservada</h3>
              </div>
              <p className="text-xs sm:text-[13px] text-[#111827] leading-relaxed">
                As mudanças somente serão aplicadas após revisão e aprovação pela equipe do Main
                Admin.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
