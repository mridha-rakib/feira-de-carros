'use client';

import {
  createPublishedListingRevision,
  getSellerListingById,
} from '@/lib/adapters/seller-listings-adapter';
import type { SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { SellerBreadcrumb } from '../../../../components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCoin,
  IconEye,
  IconGauge,
  IconInfo,
  IconLock,
  IconSend,
  IconShield,
  IconTrendingDown,
  IconTrendingUp,
} from '../../../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../../../components/SellerNavbar';

export default function EditPublishedListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = (params?.id as string) || 'FDC-2026-0142';

  const [listing, setListing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Form states for proposed changes
  const [proposedPrice, setProposedPrice] = useState(() => {
    const data = getSellerListingById(listingId);
    if (!data) return '61900';
    if (data.pendingRevision) {
      return (data.pendingRevision.priceCents / 100).toString();
    }
    return (data.priceCents / 100).toString();
  });
  const [proposedMileage, setProposedMileage] = useState(() => {
    const data = getSellerListingById(listingId);
    if (!data) return '44700';
    if (data.pendingRevision) {
      return data.pendingRevision.mileageKm.toString();
    }
    return data.mileageKm.toString();
  });
  const [proposedDescription, setProposedDescription] = useState(() => {
    const data = getSellerListingById(listingId);
    if (!data) return '';
    if (data.pendingRevision) {
      return data.pendingRevision.description;
    }
    return data.description;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errors, setErrors] = useState<{ price?: string; mileage?: string; description?: string }>(
    {},
  );

  useEffect(() => {
    const data = getSellerListingById(listingId);
    if (data) {
      setListing(data);
      // Pre-fill with existing values or pending revision if exists
      if (data.pendingRevision) {
        setProposedPrice((data.pendingRevision.priceCents / 100).toString());
        setProposedMileage(data.pendingRevision.mileageKm.toString());
        setProposedDescription(data.pendingRevision.description);
      } else {
        setProposedPrice((data.priceCents / 100).toString());
        setProposedMileage(data.mileageKm.toString());
        setProposedDescription(data.description);
      }
    }
  }, [listingId]);

  // Derived price calculation & delta
  const priceStats = useMemo(() => {
    if (!listing) return null;
    const currentPrice = listing.priceCents / 100;
    const newPriceNum = Number.parseFloat(proposedPrice.replace(/\./g, '').replace(',', '.')) || 0;
    const diff = newPriceNum - currentPrice;
    const percent = currentPrice > 0 ? (diff / currentPrice) * 100 : 0;

    return {
      currentPriceFormatted: (listing.priceCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      proposedPriceFormatted: newPriceNum.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      diff,
      diffFormatted: Math.abs(diff).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      percentFormatted: `${percent > 0 ? '+' : ''}${percent.toFixed(2).replace('.', ',')}%`,
      isDecrease: diff < 0,
      isIncrease: diff > 0,
    };
  }, [listing, proposedPrice]);

  // Derived mileage calculation & delta
  const mileageStats = useMemo(() => {
    if (!listing) return null;
    const currentKm = listing.mileageKm;
    const newKm = Number.parseInt(proposedMileage.replace(/\D/g, ''), 10) || 0;
    const diff = newKm - currentKm;

    return {
      currentKmFormatted: `${currentKm.toLocaleString('pt-BR')} km`,
      proposedKmFormatted: `${newKm.toLocaleString('pt-BR')} km`,
      diff,
      diffFormatted: `${diff > 0 ? '+' : ''}${diff.toLocaleString('pt-BR')} km`,
      isDecrease: diff < 0,
      isIncrease: diff > 0,
    };
  }, [listing, proposedMileage]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f4f7fa] flex flex-col font-sans">
        <SellerNavbar variant="seller" activeTab="anuncios" />
        <div className="flex-1 max-w-4xl mx-auto py-16 px-4 text-center">
          <p className="text-gray-500">Carregando anúncio para edição...</p>
        </div>
      </div>
    );
  }

  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { price?: string; mileage?: string; description?: string } = {};

    const priceNum = Number.parseFloat(proposedPrice.replace(/\./g, '').replace(',', '.'));
    if (Number.isNaN(priceNum) || priceNum <= 1000) {
      newErrors.price = 'Informe um preço válido acima de R$ 1.000,00.';
    }

    const mileageNum = Number.parseInt(proposedMileage.replace(/\D/g, ''), 10);
    if (Number.isNaN(mileageNum) || mileageNum < 0) {
      newErrors.mileage = 'Informe uma quilometragem válida.';
    }

    if (!proposedDescription.trim() || proposedDescription.length < 20) {
      newErrors.description = 'A descrição precisa ter pelo menos 20 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const priceCents = Math.round(priceNum * 100);

    // CRITICAL: We call createPublishedListingRevision which does NOT overwrite the live version!
    const res = createPublishedListingRevision(listing.id, {
      priceCents,
      mileageKm: mileageNum,
      description: proposedDescription,
    });

    if (res.success) {
      // Redirect to comparison view (WEB-035)
      router.push(`/vendedor/anuncios/${listing.id}/revisoes`);
    } else {
      setIsSubmitting(false);
    }
  };

  const currentPhoto = listing.galleryImages[selectedPhotoIndex] || listing.imageUrl;

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
            { label: 'Editar anúncio publicado', active: true },
          ]}
          mobileShortLabel="Feira de Carros › Meus anúncios › Editar anúncio publicado"
        />

        {/* Heading (matching 2783:2189-2190 & mobile 1109:1689-1692) */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#111827] tracking-tight">
            Editar anúncio publicado
          </h1>
          <p className="text-sm sm:text-base text-[#41506a] mt-1">
            Faça alterações no seu anúncio. As mudanças serão analisadas antes de serem aplicadas.
          </p>
          <p className="text-xs font-semibold text-[#c41217] mt-1 md:hidden">
            WEB-034 · Preview demonstrativo
          </p>
        </div>

        {/* Mobile Notice Card (matching mobile 1109:1722-1724) */}
        <div className="bg-[#e8f2fe] border border-[#bdd7ff] rounded-[9px] p-3 mb-6 md:hidden">
          <p className="text-xs font-semibold text-[#121a2b]">Versão atual permanece pública</p>
          <p className="text-[11px] text-[#41506a] mt-0.5">
            Alterações só entram no anúncio depois da revisão administrativa. O veículo continua
            visível aos compradores.
          </p>
        </div>

        {/* Main Grid: Form/Editor & Sidebar (matching 2783:2191 & 2783:2277) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editor Card (lg:col-span-8) */}
          <form onSubmit={handleSubmitRevision} className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#d7e0ec] rounded-[11px] p-4 sm:p-6 shadow-2xs space-y-6">
              {/* Vehicle Summary Header (matching 2783:2192-2210) */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-full sm:w-64 space-y-2 shrink-0">
                  <div className="relative h-44 sm:h-40 rounded-[8px] overflow-hidden bg-gray-100 border border-[#d7e0ec]">
                    <Image
                      src={currentPhoto}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 256px"
                    />
                  </div>

                  {/* Thumbnails row */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {listing.galleryImages.map((photo, idx) => (
                      <button
                        key={photo}
                        type="button"
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative size-12 rounded-[6px] overflow-hidden shrink-0 border-2 transition-all ${
                          selectedPhotoIndex === idx
                            ? 'border-[#c41217]'
                            : 'border-[#d7e0ec] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={photo}
                          alt={`Miniatura ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#111827] truncate">
                    {listing.title}
                  </h2>
                  <p className="text-sm text-[#41506a]">
                    {listing.category} • {listing.fuel} • {listing.transmission}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e0f7e7] text-[#098a37]">
                      <IconCheck className="size-3.5 stroke-[3]" />
                      <span>Publicado</span>
                    </span>
                    <span className="text-xs text-[#41506a]">
                      Publicado em {listing.createdAtFormatted} {listing.createdAtTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current vs Proposed Values Preview Table (matching 2783:2211-2233) */}
              <div className="border border-[#d7e0ec] rounded-[9px] overflow-hidden bg-white">
                <div className="grid grid-cols-3 text-xs sm:text-sm font-semibold border-b border-[#d7e0ec]">
                  <div className="p-3 bg-gray-50 text-[#41506a]">Informação</div>
                  <div className="p-3 bg-gray-50 text-[#111827]">Versão atual (aprovada)</div>
                  <div className="p-3 bg-[#ffeced] text-[#c41217]">Nova versão (proposta)</div>
                </div>

                {/* Preço Row */}
                <div className="grid grid-cols-3 text-xs sm:text-sm border-b border-[#d7e0ec] items-center">
                  <div className="p-3 flex items-center gap-2 font-semibold text-[#111827]">
                    <IconCoin className="size-4 text-[#64748b]" />
                    <span>Preço</span>
                  </div>
                  <div className="p-3 text-[#111827]">{priceStats?.currentPriceFormatted}</div>
                  <div className="p-3 bg-[#fff5f6] font-semibold text-[#c41217] flex items-center gap-2">
                    <span>{priceStats?.proposedPriceFormatted}</span>
                    <IconArrowRight className="size-3 text-[#c41217]" />
                  </div>
                </div>

                {/* Quilometragem Row */}
                <div className="grid grid-cols-3 text-xs sm:text-sm items-center">
                  <div className="p-3 flex items-center gap-2 font-semibold text-[#111827]">
                    <IconGauge className="size-4 text-[#64748b]" />
                    <span>Quilometragem</span>
                  </div>
                  <div className="p-3 text-[#111827]">{mileageStats?.currentKmFormatted}</div>
                  <div className="p-3 bg-[#fff5f6] font-semibold text-[#c41217] flex items-center gap-2">
                    <span>{mileageStats?.proposedKmFormatted}</span>
                    <IconArrowRight className="size-3 text-[#c41217]" />
                  </div>
                </div>
              </div>

              {/* Editable Form Inputs (matching 2783:2235-2263) */}
              <div className="space-y-5 pt-3 border-t border-[#d7e0ec]">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#111827]">
                    Edite as informações
                  </h3>
                  <p className="text-xs sm:text-sm text-[#41506a] mt-0.5">
                    Altere apenas os dados que deseja atualizar. Os campos não editados permanecerão
                    iguais.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Proposed Price Input */}
                  <div>
                    <label
                      htmlFor="priceInput"
                      className="block text-xs sm:text-sm font-semibold text-[#111827] mb-1.5"
                    >
                      Preço do veículo <span className="text-[#c41217]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-3 text-sm text-[#41506a]">R$</span>
                        <input
                          id="priceInput"
                          type="text"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                          className={`w-full h-11 pl-9 pr-3 bg-white border rounded-[7px] text-sm font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#c41217] ${
                            errors.price ? 'border-red-500 bg-red-50' : 'border-[#d7e0ec]'
                          }`}
                          placeholder="61.900"
                        />
                      </div>

                      {/* Live Price Delta Badge (matching 2783:2245-2249) */}
                      {priceStats && priceStats.diff !== 0 && (
                        <div
                          className={`px-3 py-1 rounded-[8px] flex flex-col justify-center items-center text-xs shrink-0 ${
                            priceStats.isDecrease
                              ? 'bg-[#e0f7e7] text-[#098a37]'
                              : 'bg-[#ffeced] text-[#c41217]'
                          }`}
                        >
                          <div className="flex items-center gap-1 font-semibold">
                            {priceStats.isDecrease ? (
                              <IconTrendingDown className="size-3" />
                            ) : (
                              <IconTrendingUp className="size-3" />
                            )}
                            <span>{priceStats.percentFormatted}</span>
                          </div>
                          <span className="text-[10px]">{priceStats.diffFormatted}</span>
                        </div>
                      )}
                    </div>
                    {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
                    <p className="text-[11px] text-[#41506a] mt-1">
                      Preço atual: {priceStats?.currentPriceFormatted}
                    </p>
                  </div>

                  {/* Proposed Mileage Input */}
                  <div>
                    <label
                      htmlFor="mileageInput"
                      className="block text-xs sm:text-sm font-semibold text-[#111827] mb-1.5"
                    >
                      Quilometragem <span className="text-[#c41217]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          id="mileageInput"
                          type="text"
                          value={proposedMileage}
                          onChange={(e) => setProposedMileage(e.target.value)}
                          className={`w-full h-11 px-3 bg-white border rounded-[7px] text-sm font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#c41217] ${
                            errors.mileage ? 'border-red-500 bg-red-50' : 'border-[#d7e0ec]'
                          }`}
                          placeholder="44700"
                        />
                      </div>

                      {/* Live Mileage Delta Badge (matching 2783:2256-2259) */}
                      {mileageStats && mileageStats.diff !== 0 && (
                        <div
                          className={`px-3 py-1 rounded-[8px] flex items-center gap-1 text-xs font-semibold shrink-0 ${
                            mileageStats.isDecrease
                              ? 'bg-[#e0f7e7] text-[#098a37]'
                              : 'bg-[#ffeced] text-[#c41217]'
                          }`}
                        >
                          {mileageStats.isDecrease ? (
                            <IconTrendingDown className="size-3" />
                          ) : (
                            <IconTrendingUp className="size-3" />
                          )}
                          <span>{mileageStats.diffFormatted}</span>
                        </div>
                      )}
                    </div>
                    {errors.mileage && (
                      <p className="text-xs text-red-600 mt-1">{errors.mileage}</p>
                    )}
                    <p className="text-[11px] text-[#41506a] mt-1">
                      Atual: {mileageStats?.currentKmFormatted}
                    </p>
                  </div>
                </div>

                {/* Proposed Description Textarea */}
                <div>
                  <label
                    htmlFor="descriptionInput"
                    className="block text-xs sm:text-sm font-semibold text-[#111827] mb-1.5"
                  >
                    Descrição do veículo
                  </label>
                  <textarea
                    id="descriptionInput"
                    rows={4}
                    value={proposedDescription}
                    maxLength={1000}
                    onChange={(e) => setProposedDescription(e.target.value)}
                    className={`w-full p-3 bg-white border rounded-[7px] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#c41217] ${
                      errors.description ? 'border-red-500 bg-red-50' : 'border-[#d7e0ec]'
                    }`}
                    placeholder="Descreva as atualizações e detalhes do veículo..."
                  />
                  {errors.description && (
                    <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                  )}
                  <p className="text-[11px] text-[#41506a] text-right mt-1">
                    {proposedDescription.length} / 1.000
                  </p>
                </div>
              </div>

              {/* Action Bar (matching 2783:2264-2276) */}
              <div className="pt-4 border-t border-[#d7e0ec] flex flex-col sm:flex-row gap-3 items-center justify-between">
                <Link
                  href={`/vendedor/anuncios/${listing.id}`}
                  className="w-full sm:w-auto h-11 px-4 text-xs sm:text-sm font-medium text-[#41506a] hover:text-[#111827] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <IconArrowLeft className="size-4" />
                  <span>Voltar para o anúncio</span>
                </Link>

                <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="w-full sm:w-auto h-11 px-5 rounded-[7px] border border-[#d7e0ec] hover:bg-gray-50 text-[#111827] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <IconEye className="size-4" />
                    <span>Visualizar versão atual</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-11 px-6 rounded-[7px] bg-[#c41217] hover:bg-[#a81014] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
                  >
                    <IconSend className="size-4" />
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar alterações para análise'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Right Column: Explanatory Sidebars (lg:col-span-4) (matching 2783:2277-2317) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sidebar 1: Como funciona a edição? (matching 2783:2277-2291) */}
            <div className="bg-white border border-[#d7e0ec] rounded-[11px] p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5">
                <IconInfo className="size-5 text-[#111827]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#111827]">
                  Como funciona a edição?
                </h3>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#d7e0ec] text-xs sm:text-sm text-[#111827]">
                <div className="flex gap-2.5 items-start">
                  <div className="size-5 rounded-full bg-[#f0f4f9] text-[#111827] flex items-center justify-center shrink-0 mt-0.5">
                    <IconCheck className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>Você faz as alterações e envia para análise.</span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="size-5 rounded-full bg-[#f0f4f9] text-[#111827] flex items-center justify-center shrink-0 mt-0.5">
                    <IconCheck className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>Nossa equipe revisa as informações.</span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="size-5 rounded-full bg-[#f0f4f9] text-[#111827] flex items-center justify-center shrink-0 mt-0.5">
                    <IconCheck className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>Após a aprovação, o anúncio é atualizado automaticamente.</span>
                </div>
              </div>
            </div>

            {/* Sidebar 2: Importante (matching 2783:2292-2297) */}
            <div className="bg-[#e6f0ff] border border-[#bdd7ff] rounded-[10px] p-5 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#0369a1]">
                <IconInfo className="size-5" />
                <h3 className="text-base font-semibold text-[#111827]">Importante</h3>
              </div>
              <p className="text-xs sm:text-[13px] text-[#111827] leading-relaxed">
                A versão atual e aprovada do seu anúncio continua publicada e visível no site até
                que as alterações propostas sejam aprovadas pela equipe de moderação.
              </p>
            </div>

            {/* Sidebar 3: Dicas para aprovação (matching 2783:2298-2317) */}
            <div className="bg-white border border-[#d7e0ec] rounded-[11px] p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5">
                <IconShield className="size-5 text-[#111827]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#111827]">
                  Dicas para aprovação
                </h3>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#d7e0ec] text-xs sm:text-sm text-[#111827]">
                <div className="flex gap-2.5 items-start">
                  <IconCheck className="size-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>Mantenha as informações verdadeiras e atualizadas.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <IconCheck className="size-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>Use um preço compatível com o mercado.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <IconCheck className="size-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>Certifique-se de que a quilometragem está correta.</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <IconCheck className="size-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span>Evite alterações frequentes em um curto período.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Visualizar Versão Atual */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-[12px] p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scale-in">
              <div className="flex justify-between items-center border-b border-[#d7e0ec] pb-3">
                <h3 className="text-base font-bold text-[#111827]">Versão Atual Publicada</h3>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="relative h-44 rounded-[8px] overflow-hidden bg-gray-100">
                  <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#111827]">{listing.title}</h4>
                  <p className="text-lg font-bold text-[#111827] mt-1">{listing.priceFormatted}</p>
                  <p className="text-xs text-[#41506a] mt-0.5">
                    Quilometragem: {listing.mileageFormatted}
                  </p>
                </div>
                <p className="text-xs text-[#41506a] bg-gray-50 p-3 rounded-[6px] max-h-32 overflow-y-auto">
                  {listing.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-full h-10 rounded-[7px] bg-[#111827] hover:bg-black font-semibold text-xs text-white transition-colors"
              >
                Fechar visualização
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
