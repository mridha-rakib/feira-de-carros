'use client';

import { getSellerListingById, markListingAsSold } from '@/lib/adapters/seller-listings-adapter';
import type { SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SellerBreadcrumb } from '../../../components/SellerBreadcrumb';
import {
  IconArrowRight,
  IconCalendar,
  IconCar,
  IconCheck,
  IconClock,
  IconDroplet,
  IconEdit,
  IconEye,
  IconFile,
  IconFuel,
  IconGauge,
  IconGear,
  IconHeart,
  IconInfo,
  IconMessageSquare,
  IconPin,
  IconStar,
  IconTrendingUp,
} from '../../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../../components/SellerNavbar';
import { VehicleStatusBadge } from '../../../components/VehicleStatusBadge';

export default function SellerListingDetailPage() {
  const params = useParams();
  const listingId = (params?.id as string) || 'FDC-2026-0142';

  const [listing, setListing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const data = getSellerListingById(listingId);
    if (data) {
      setListing(data);
    }
  }, [listingId]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f4f7fa] flex flex-col font-sans">
        <SellerNavbar variant="seller" activeTab="anuncios" />
        <div className="flex-1 max-w-4xl mx-auto py-16 px-4 text-center">
          <p className="text-gray-500">Carregando detalhes do anúncio...</p>
        </div>
      </div>
    );
  }

  const handleConfirmSold = () => {
    const res = markListingAsSold(listing.id);
    if (res.success && res.listing) {
      setListing(res.listing);
      setShowSoldModal(false);
      setToastMessage('Anúncio marcado como vendido com sucesso!');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const currentPhoto = listing.galleryImages[selectedPhotoIndex] || listing.imageUrl;

  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col font-sans text-[#111827]">
      {/* Navbar: Approved Seller */}
      <SellerNavbar variant="seller" activeTab="anuncios" />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-16">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: 'Detalhes do anúncio', active: true },
          ]}
          mobileShortLabel="Feira de Carros › Meus anúncios › Detalhes do meu anúncio"
        />

        {/* Heading & Status (matching 2705:2713-2718 & mobile 1109:1603-1606) */}
        <div className="mt-2 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#101828] tracking-tight">
                Detalhes do anúncio
              </h1>
              <div className="hidden sm:block">
                <VehicleStatusBadge status={listing.status} label={listing.statusLabel} />
              </div>
            </div>
            <p className="text-sm sm:text-[15px] text-[#64748b] mt-1">
              Acompanhe o desempenho e gerencie o seu anúncio publicado.
            </p>
            <p className="text-xs font-semibold text-[#c41217] mt-1 md:hidden">
              WEB-028 · Preview demonstrativo
            </p>
          </div>

          <div className="sm:hidden">
            <VehicleStatusBadge status={listing.status} label={listing.statusLabel} />
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-[10px] bg-[#e7f7ed] border border-[#a3e6be] text-[#198754] flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <IconCheck className="size-5 stroke-[2.5]" />
              <span className="text-sm font-semibold">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-sm font-bold text-[#198754] hover:underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Card 1: Vehicle Gallery and Actions (matching 2705:2719-2744) */}
        <div className="bg-white border border-[#d7dfea] rounded-[10px] p-4 sm:p-6 mb-6 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Gallery Column (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative h-64 sm:h-80 w-full rounded-[8px] overflow-hidden bg-gray-100 border border-[#d7dfea]">
                <Image
                  src={currentPhoto}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Thumbnails row */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.galleryImages.map((photo, idx) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative size-16 sm:w-20 sm:h-14 rounded-[6px] overflow-hidden shrink-0 border-2 transition-all ${
                      selectedPhotoIndex === idx
                        ? 'border-[#c41217] ring-1 ring-[#c41217]'
                        : 'border-[#d7dfea] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title, Price, & Action Buttons Column (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-[27px] font-semibold text-[#101828]">
                  {listing.title}
                </h2>
                <p className="text-sm sm:text-base text-[#64748b] mt-1">
                  {listing.category} • {listing.fuel} • {listing.transmission}
                </p>

                <p className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#101828] mt-3">
                  {listing.priceFormatted}
                </p>

                <div className="flex items-center gap-1.5 text-sm text-[#64748b] mt-2">
                  <IconPin className="size-4 text-[#c41217]" />
                  <span>
                    {listing.city} / {listing.state}
                  </span>
                </div>
              </div>

              {/* Action Buttons (matching 2705:2733-2744) */}
              <div className="pt-4 border-t border-[#d7dfea] flex flex-wrap gap-3">
                {listing.status === 'CORRECTION_REQUESTED' ? (
                  <Link
                    href={`/vendedor/anuncios/${listing.id}/corrigir`}
                    className="flex-1 min-w-[180px] h-12 bg-[#c41217] hover:bg-[#a81014] text-white font-semibold rounded-[7px] flex items-center justify-center gap-2 text-sm transition-colors shadow-xs"
                  >
                    <IconEdit className="size-4" />
                    <span>Corrigir anúncio</span>
                  </Link>
                ) : (
                  <Link
                    href={`/vendedor/anuncios/${listing.id}/editar`}
                    className="flex-1 min-w-[180px] h-12 bg-[#c41217] hover:bg-[#a81014] text-white font-semibold rounded-[7px] flex items-center justify-center gap-2 text-sm transition-colors shadow-xs"
                  >
                    <IconEdit className="size-4" />
                    <span>Editar anúncio</span>
                  </Link>
                )}

                {listing.pendingRevision || listing.status === 'REVISED_PENDING' ? (
                  <Link
                    href={`/vendedor/anuncios/${listing.id}/revisoes`}
                    className="h-12 px-5 bg-[#e6f1ff] hover:bg-[#d5e6ff] text-[#1447e6] font-semibold rounded-[7px] flex items-center justify-center gap-2 text-sm border border-[#bdd7ff] transition-colors"
                  >
                    <IconClock className="size-4" />
                    <span>Ver revisões</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/vendedor/anuncios/${listing.id}/impulsionar`}
                      className="h-12 px-5 bg-white hover:bg-gray-50 text-[#101828] font-semibold rounded-[7px] flex items-center justify-center gap-2 text-sm border border-[#d7dfea] transition-colors"
                    >
                      <IconStar className="size-4 text-[#b86b0a]" />
                      <span>Destacar anúncio</span>
                    </Link>
                    <Link
                      href={`/vendedor/anuncios/${listing.id}/renovar`}
                      className="h-12 px-5 bg-white hover:bg-gray-50 text-[#101828] font-semibold rounded-[7px] flex items-center justify-center gap-2 text-sm border border-[#d7dfea] transition-colors"
                    >
                      <IconCalendar className="size-4 text-[#0066cc]" />
                      <span>Renovar</span>
                    </Link>
                  </>
                )}

                {listing.status !== 'SOLD' && (
                  <button
                    type="button"
                    onClick={() => setShowSoldModal(true)}
                    className="h-12 px-5 bg-white hover:bg-gray-50 text-[#101828] font-semibold rounded-[7px] flex items-center justify-center gap-2 text-sm border border-[#d7dfea] transition-colors"
                  >
                    <IconCheck className="size-4" />
                    <span>Marcar como vendido</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: 4 Key Performance Metrics (matching 2705:2745-2765) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#d7dfea] rounded-[10px] p-4 flex items-center gap-4 shadow-2xs">
            <div className="size-11 rounded-full bg-[#f0f4f9] text-[#101828] flex items-center justify-center shrink-0">
              <IconEye className="size-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#101828]">
                {listing.metrics.totalViews.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs sm:text-sm text-[#64748b]">Visualizações totais</p>
            </div>
          </div>

          <div className="bg-white border border-[#d7dfea] rounded-[10px] p-4 flex items-center gap-4 shadow-2xs">
            <div className="size-11 rounded-full bg-[#fdf2f2] text-[#c41217] flex items-center justify-center shrink-0">
              <IconHeart className="size-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#101828]">
                {listing.metrics.favorites}
              </p>
              <p className="text-xs sm:text-sm text-[#64748b]">Favoritos</p>
            </div>
          </div>

          <div className="bg-white border border-[#d7dfea] rounded-[10px] p-4 flex items-center gap-4 shadow-2xs">
            <div className="size-11 rounded-full bg-[#f0fdf4] text-[#15803d] flex items-center justify-center shrink-0">
              <IconMessageSquare className="size-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#101828]">
                {listing.metrics.messages}
              </p>
              <p className="text-xs sm:text-sm text-[#64748b]">Mensagens</p>
            </div>
          </div>

          <div className="bg-white border border-[#d7dfea] rounded-[10px] p-4 flex items-center gap-4 shadow-2xs">
            <div className="size-11 rounded-full bg-[#eff6ff] text-[#0369a1] flex items-center justify-center shrink-0">
              <IconTrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#101828]">
                +{listing.metrics.viewsLast7Days}
              </p>
              <p className="text-xs sm:text-sm text-[#64748b]">Visualizações (7 dias)</p>
            </div>
          </div>
        </div>

        {/* Lower Grid: Vehicle Specs & Sidebar (matching 2705:2766-2866) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Vehicle Details Grid (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-[#d7dfea] rounded-[10px] p-5 sm:p-6 shadow-2xs space-y-6">
            <div>
              <div className="flex items-center gap-2.5">
                <IconCar className="size-5 text-[#101828]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#101828]">
                  Dados do veículo
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Confira informações e descrição do anúncio.
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 pt-2 border-t border-[#d7dfea]">
              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconCar className="size-3.5 text-[#64748b]" />
                  <span>Categoria</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">{listing.category}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconCar className="size-3.5 text-[#64748b]" />
                  <span>Marca</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">{listing.brand}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconCar className="size-3.5 text-[#64748b]" />
                  <span>Modelo</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">{listing.model}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconCalendar className="size-3.5 text-[#64748b]" />
                  <span>Ano modelo</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">{listing.yearModel}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconCalendar className="size-3.5 text-[#64748b]" />
                  <span>Ano fabricação</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">
                  {listing.yearManufacture}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconGauge className="size-3.5 text-[#64748b]" />
                  <span>Quilometragem</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">
                  {listing.mileageFormatted}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconFuel className="size-3.5 text-[#64748b]" />
                  <span>Combustível</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">{listing.fuel}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconGear className="size-3.5 text-[#64748b]" />
                  <span>Câmbio</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">
                  {listing.transmission}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconDroplet className="size-3.5 text-[#64748b]" />
                  <span>Cor</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">{listing.color}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconCar className="size-3.5 text-[#64748b]" />
                  <span>Portas</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">{listing.doors}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748b] flex items-center gap-1.5">
                  <IconPin className="size-3.5 text-[#64748b]" />
                  <span>Cidade / UF</span>
                </p>
                <p className="text-sm font-semibold text-[#101828] mt-0.5">
                  {listing.city} / {listing.state}
                </p>
              </div>
            </div>

            {/* Description Paragraph (matching 2705:2826-2829) */}
            <div className="pt-4 border-t border-[#d7dfea]">
              <div className="flex items-center gap-2 mb-2">
                <IconFile className="size-4 text-[#64748b]" />
                <h4 className="text-sm font-semibold text-[#101828]">Descrição do veículo</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right Column: Listing Metadata & Boost Card (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Metadata Card (matching 2705:2830-2853) */}
            <div className="bg-white border border-[#d7dfea] rounded-[10px] p-5 shadow-2xs space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <IconInfo className="size-5 text-[#101828]" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#101828]">
                    Informações do anúncio
                  </h3>
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">Dados principais do anúncio.</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#d7dfea] text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#64748b]">Data de publicação:</span>
                  <span className="font-semibold text-[#101828]">{listing.createdAtFormatted}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#64748b]">Plano:</span>
                  <span className="font-semibold text-[#101828]">{listing.plan}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#64748b]">Validade:</span>
                  <span className="font-semibold text-[#101828]">{listing.expiresAtFormatted}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#64748b]">Código do anúncio:</span>
                  <span className="font-mono font-semibold text-[#101828]">{listing.id}</span>
                </div>
              </div>
            </div>

            {/* Boost & Promote Card (matching 2705:2854-2866) */}
            <div className="bg-[#fff2dd] border border-[#fde4ba] rounded-[10px] p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <IconStar className="size-6 text-[#b86b0a]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#101828]">
                  Quer mais visibilidade?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                Renove ou destaque seu anúncio para alcançar mais compradores em Ipatinga e região.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setToastMessage('Funcionalidade de destaque ativada para demonstração.')
                  }
                  className="flex-1 h-11 bg-[#c41217] hover:bg-[#a81014] text-white text-xs sm:text-sm font-semibold rounded-[7px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <IconStar className="size-4" />
                  <span>Destacar agora</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setToastMessage('Solicitação de renovação encaminhada com sucesso.')
                  }
                  className="flex-1 h-11 bg-white hover:bg-gray-50 text-[#101828] text-xs sm:text-sm font-semibold rounded-[7px] flex items-center justify-center gap-1.5 border border-[#d7dfea] transition-colors"
                >
                  <IconArrowRight className="size-4" />
                  <span>Renovar anúncio</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Confirm Mark as Sold */}
        {showSoldModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[12px] p-6 max-w-md w-full shadow-xl space-y-4 animate-scale-in">
              <div className="size-12 rounded-full bg-[#f3f4f6] text-[#4b5563] mx-auto flex items-center justify-center">
                <IconCheck className="size-6 stroke-[2.5]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#101828]">Marcar veículo como vendido?</h3>
                <p className="text-sm text-[#64748b] mt-1">
                  O anúncio <span className="font-semibold">{listing.title}</span> deixará de ser
                  exibido na busca pública para compradores.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSoldModal(false)}
                  className="flex-1 h-11 rounded-[7px] border border-[#d7dfea] font-semibold text-sm text-[#101828] hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSold}
                  className="flex-1 h-11 rounded-[7px] bg-[#101828] hover:bg-black font-semibold text-sm text-white transition-colors"
                >
                  Confirmar venda
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
