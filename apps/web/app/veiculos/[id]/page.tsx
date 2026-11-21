'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  type PublicVehicleItem,
  getPublicDealershipById,
  getPublicVehicleById,
} from '../../../lib/adapters/buyer-catalog-adapter';
import { startConversationFromListing } from '../../../lib/adapters/buyer-messages-adapter';
import { useBuyerStore } from '../../../stores/use-buyer-store';
import { MarketplaceFooter } from '../../components/MarketplaceFooter';
import { MarketplaceHeader } from '../../components/MarketplaceHeader';
import { ReportListingModal } from '../../components/ReportListingModal';
import {
  IconAlert,
  IconBuilding,
  IconCalendar,
  IconCar,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconCross,
  IconExternalLink,
  IconFlag,
  IconGauge,
  IconHeart,
  IconLock,
  IconMessageSquare,
  IconPhone,
  IconPin,
  IconShare,
  IconShield,
} from '../../components/SellerIcons';
import { SellerPhoneModal } from '../../components/SellerPhoneModal';

export default function VehicleDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { isFavorite, toggleFavorite, isAuthenticated, openAuthModal, buyerProfile } =
    useBuyerStore();
  const vehicle = getPublicVehicleById(id);

  // Gallery active index state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals state
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Message drawer state
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [messageText, setMessageText] = useState(
    'Olá! Tenho interesse no veículo e gostaria de agendar uma visita para vê-lo.',
  );
  const [messageSent, setMessageSent] = useState(false);
  const [createdConvId, setCreatedConvId] = useState<string | null>(null);

  const favorited = vehicle ? isFavorite(vehicle.id) : false;

  const handleFavoriteClick = () => {
    if (vehicle) {
      toggleFavorite(vehicle.id, `/veiculos/${vehicle.id}`);
    }
  };

  const handleOpenMessageDrawer = () => {
    if (!isAuthenticated) {
      openAuthModal(`/veiculos/${id}`);
      return;
    }
    setIsMessageDrawerOpen(true);
  };

  const handleShareClick = async () => {
    if (typeof window !== 'undefined') {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          setShareToast(true);
          setTimeout(() => setShareToast(false), 2500);
        }
      } catch {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      }
    }
  };

  // 404 Not Found State
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-between">
        <MarketplaceHeader />
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-md mx-auto bg-white border border-[#e0e6f0] rounded-[16px] p-8 shadow-xs">
            <div className="size-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4">
              <IconCar className="size-8 text-[#b91c1c]" />
            </div>
            <h1 className="text-[22px] font-bold text-[#14223b]">Veículo não encontrado</h1>
            <p className="text-[13px] text-[#62718a] mt-2 leading-relaxed">
              O anúncio que você está procurando pode ter sido finalizado ou o endereço informado
              está incorreto.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/veiculos"
                className="w-full h-[42px] bg-[#e0151f] hover:bg-[#b91c1c] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
              >
                Ver todos os veículos disponíveis
              </Link>
              <Link
                href="/"
                className="w-full h-[40px] bg-white border border-[#e0e6f0] hover:bg-[#f8f9fb] text-[#14223b] font-medium text-[13px] rounded-[8px] flex items-center justify-center transition-colors"
              >
                Voltar à página inicial
              </Link>
            </div>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  const dealership = vehicle.dealershipId ? getPublicDealershipById(vehicle.dealershipId) : null;
  const gallery = vehicle.galleryImages.length > 0 ? vehicle.galleryImages : [vehicle.imageUrl];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Breadcrumb matching Figma 733:179 */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#62718a] mb-5 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/" className="hover:text-[#14223b] transition-colors">
            Início
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link href="/veiculos" className="hover:text-[#14223b] transition-colors">
            Veículos
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link
            href={`/veiculos?marca=${vehicle.brand}`}
            className="hover:text-[#14223b] transition-colors"
          >
            {vehicle.brand}
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#14223b] font-medium truncate">{vehicle.title}</span>
        </nav>

        {/* Mobile Header (Title & Price before Gallery on small viewports) */}
        <div className="lg:hidden mb-4 bg-white p-4 rounded-[12px] border border-[#e0e6f0]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 mb-1.5">
                {vehicle.condition} · DEMO DATA
              </span>
              <h1 className="text-[20px] font-bold text-[#14223b] leading-tight">
                {vehicle.title}
              </h1>
              <p className="text-[12px] text-[#62718a] mt-0.5">{vehicle.version}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShareClick}
                className="p-2 rounded-full border border-[#e0e6f0] hover:bg-slate-50 text-[#62718a]"
                aria-label="Compartilhar"
              >
                <IconShare className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleFavoriteClick}
                className="p-2 rounded-full border border-[#e0e6f0] hover:bg-slate-50"
                aria-label={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              >
                <IconHeart
                  className={`size-4 ${favorited ? 'fill-[#e0151f] text-[#e0151f]' : 'text-[#62718a]'}`}
                />
              </button>
            </div>
          </div>
          <p className="text-[24px] font-black text-[#e0151f] mt-3">{vehicle.priceFormatted}</p>
        </div>

        {/* Two-Column Responsive Grid matching Figma 733:179 Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Gallery, Specs, Checklist, Description (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Gallery Card */}
            <div className="bg-white rounded-[14px] border border-[#e0e6f0] overflow-hidden p-3 sm:p-4 shadow-xs">
              {/* Main Photo Canvas */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[10px] overflow-hidden bg-slate-100">
                <Image
                  src={gallery[activeImageIndex]}
                  alt={`${vehicle.title} - Foto ${activeImageIndex + 1}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 840px"
                />

                {/* Counter Badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[12px] font-medium px-2.5 py-1 rounded-full">
                  {activeImageIndex + 1} / {gallery.length}
                </div>

                {/* Left/Right Arrow Navigation */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Foto anterior"
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Próxima foto"
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={`gallery-thumb-${vehicle.id}-${img}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative size-16 sm:size-20 rounded-[8px] overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#e0151f] scale-102 shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Miniatura ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Specs Sheet */}
            <div className="bg-white rounded-[14px] border border-[#e0e6f0] p-5 sm:p-6 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#14223b] mb-4">
                Ficha Técnica do Veículo
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Ano / Modelo</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">
                    {vehicle.yearManufacture}/{vehicle.yearModel}
                  </p>
                </div>

                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Quilometragem</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">
                    {vehicle.mileageFormatted}
                  </p>
                </div>

                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Câmbio</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">
                    {vehicle.transmission}
                  </p>
                </div>

                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Combustível</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">{vehicle.fuel}</p>
                </div>

                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Cor</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">{vehicle.color}</p>
                </div>

                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Carroceria</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">{vehicle.bodyType}</p>
                </div>

                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Final de placa</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">{vehicle.plateEnd}</p>
                </div>

                <div className="bg-[#f8f9fb] rounded-[10px] p-3 border border-[#e8ecf2]">
                  <p className="text-[11px] text-[#62718a]">Portas</p>
                  <p className="text-[14px] font-bold text-[#14223b] mt-0.5">
                    {vehicle.doors > 0 ? `${vehicle.doors} portas` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Block */}
            <div className="bg-white rounded-[14px] border border-[#e0e6f0] p-5 sm:p-6 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#14223b] mb-3">Descrição do Anunciante</h2>
              <p className="text-[13px] sm:text-[14px] text-[#48566a] leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* Items and Features Checklist */}
            <div className="bg-white rounded-[14px] border border-[#e0e6f0] p-5 sm:p-6 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#14223b] mb-4">Itens e Opcionais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {vehicle.features.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[13px] text-[#14223b]">
                    <div className="size-4 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center shrink-0">
                      <IconCheck className="size-2.5 text-[#059669] stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedência & Inspection Information Card */}
            <div className="bg-white rounded-[14px] border border-[#e0e6f0] p-5 sm:p-6 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center shrink-0">
                  <IconShield className="size-6 text-[#059669]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#14223b]">Procedência e Vistoria</h3>
                  <p className="text-[13px] text-[#48566a] mt-1 leading-relaxed">
                    Veículo com histórico regularizado. Consulte a documentação e solicite a
                    checagem do laudo cautelar presencialmente junto ao vendedor.
                  </p>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-[14px] border border-[#e0e6f0] p-5 sm:p-6 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#14223b] mb-2">Localização do Veículo</h2>
              <p className="text-[13px] text-[#62718a] flex items-center gap-1.5 mb-4">
                <IconPin className="size-4 text-[#e0151f]" />
                <span>
                  {vehicle.city}, {vehicle.state} · {vehicle.neighborhood}
                </span>
              </p>
              {/* Map Placeholder */}
              <div className="w-full h-[180px] rounded-[10px] bg-[#eef2f7] border border-[#dce3ec] flex flex-col items-center justify-center text-center p-4">
                <IconPin className="size-8 text-[#1463c7] mb-1.5" />
                <p className="text-[13px] font-semibold text-[#14223b]">
                  {vehicle.neighborhood}, {vehicle.city} - {vehicle.state}
                </p>
                <p className="text-[11px] text-[#62718a] max-w-sm mt-0.5">
                  Por razões de privacidade e segurança, o ponto exato de encontro é combinado
                  diretamente com o anunciante.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Price, Seller Box, CTAs, Report (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Desktop Price & Header Card */}
            <div className="hidden lg:block bg-white rounded-[14px] border border-[#e0e6f0] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {vehicle.condition} · DEMO DATA
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleShareClick}
                    className="p-2 rounded-full border border-[#e0e6f0] hover:bg-slate-50 text-[#62718a] transition-colors"
                    aria-label="Compartilhar"
                  >
                    <IconShare className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleFavoriteClick}
                    className="p-2 rounded-full border border-[#e0e6f0] hover:bg-slate-50 transition-colors"
                    aria-label={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                  >
                    <IconHeart
                      className={`size-4 ${favorited ? 'fill-[#e0151f] text-[#e0151f]' : 'text-[#62718a]'}`}
                    />
                  </button>
                </div>
              </div>

              {shareToast && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] p-2 rounded mb-2 text-center">
                  Link copiado para a área de transferência!
                </div>
              )}

              <h1 className="text-[22px] font-bold text-[#14223b] leading-tight">
                {vehicle.title}
              </h1>
              <p className="text-[12px] text-[#62718a] mt-0.5">{vehicle.version}</p>

              <div className="mt-4 pt-4 border-t border-[#e0e6f0]">
                <p className="text-[11px] text-[#62718a] uppercase font-semibold">Valor à vista</p>
                <p className="text-[28px] font-black text-[#e0151f] leading-none mt-1">
                  {vehicle.priceFormatted}
                </p>
              </div>
            </div>

            {/* Seller Contact Card matching Figma 733:179 & 1379:2327 */}
            <div className="bg-white rounded-[14px] border border-[#e0e6f0] p-5 sm:p-6 shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#62718a] mb-3">
                Informações do Vendedor
              </p>

              <div className="flex items-start gap-3.5 mb-4">
                <div className="size-12 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center shrink-0">
                  {vehicle.sellerType === 'concessionaria' ? (
                    <IconBuilding className="size-6 text-[#1463c7]" />
                  ) : (
                    <IconCar className="size-6 text-[#e0151f]" />
                  )}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#14223b]">{vehicle.sellerName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-[#48566a]">
                      {vehicle.sellerType === 'concessionaria'
                        ? 'Concessionária Cadastrada'
                        : 'Vendedor Particular'}
                    </span>
                  </div>
                  {vehicle.sellerResponseTime && (
                    <p className="text-[11px] text-[#62718a] mt-1 flex items-center gap-1">
                      <IconClock className="size-3 text-[#62718a]" />
                      <span>{vehicle.sellerResponseTime}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Dealership Showroom Link */}
              {dealership && (
                <div className="bg-[#f0f7ff] border border-[#cbe4fe] rounded-[8px] p-3 mb-4">
                  <p className="text-[11px] text-[#1e40af] font-medium">
                    Loja com estoque credenciado na Feira de Carros.
                  </p>
                  <Link
                    href={`/concessionarias/${dealership.id}`}
                    className="text-[12px] font-bold text-[#1463c7] hover:underline flex items-center gap-1 mt-1"
                  >
                    <span>Ver showroom da concessionária</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-2.5">
                {/* Ver Telefone CTA */}
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(true)}
                  className="w-full h-[46px] bg-[#e0151f] hover:bg-[#b91c1c] text-white font-bold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <IconPhone className="size-4" />
                  <span>Ver Telefone</span>
                </button>

                {/* Enviar Mensagem CTA */}
                <button
                  type="button"
                  onClick={handleOpenMessageDrawer}
                  className="w-full h-[42px] bg-white border border-[#e0e6f0] hover:bg-[#f8f9fb] text-[#14223b] font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
                >
                  <IconMessageSquare className="size-4 text-[#62718a]" />
                  <span>Enviar Mensagem</span>
                </button>
              </div>

              {/* Lead Telemetry / Interaction Barrier Note */}
              <p className="text-[10px] text-[#8c9ba5] text-center mt-3">
                O telefone é exibido sob demanda via clique para controle de telemetria e redução de
                coletas automatizadas.
              </p>
            </div>

            {/* Safety Advice Box */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[14px] p-4 text-left">
              <div className="flex items-start gap-2.5">
                <IconAlert className="size-5 text-[#d97706] shrink-0 mt-0.5" />
                <div className="text-[12px] text-[#92400e] leading-relaxed">
                  <strong className="block font-bold mb-0.5">Segurança em primeiro lugar:</strong>
                  Nunca faça depósitos antecipados. Encontre o vendedor em locais públicos e faça a
                  vistoria completa antes do pagamento.
                </div>
              </div>
            </div>

            {/* Report Listing CTA */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="text-[12px] font-medium text-[#62718a] hover:text-[#b91c1c] transition-colors inline-flex items-center gap-1.5"
              >
                <IconFlag className="size-3.5" />
                <span>Denunciar este anúncio</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Contact Bar matching Figma 733:208 */}
      <aside
        aria-label="Ações de contato rápidas"
        className="lg:hidden sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#e0e6f0] p-3 shadow-lg flex items-center justify-between gap-3"
      >
        <div>
          <p className="text-[10px] text-[#62718a] uppercase font-semibold">Valor à vista</p>
          <p className="text-[18px] font-black text-[#e0151f] leading-none">
            {vehicle.priceFormatted}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPhoneModalOpen(true)}
            className="h-[40px] px-4 bg-[#e0151f] text-white font-bold text-[12px] rounded-[7px] flex items-center gap-1.5 shadow-xs"
          >
            <IconPhone className="size-3.5" />
            <span>Ver Telefone</span>
          </button>

          <button
            type="button"
            onClick={handleOpenMessageDrawer}
            className="h-[40px] px-3 bg-white border border-[#e0e6f0] text-[#14223b] font-semibold text-[12px] rounded-[7px] flex items-center gap-1"
          >
            <IconMessageSquare className="size-3.5 text-[#62718a]" />
            <span className="hidden sm:inline">Mensagem</span>
          </button>
        </div>
      </aside>

      {/* Phone Disclosure Modal */}
      <SellerPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        vehicle={vehicle}
      />

      {/* Report Listing Modal */}
      <ReportListingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        vehicle={vehicle}
      />

      {/* Contact Message Modal / Drawer */}
      {isMessageDrawerOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 bg-[#0e1320]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMessageDrawerOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsMessageDrawerOpen(false);
          }}
        >
          <div className="bg-white rounded-[16px] max-w-[460px] w-full p-6 shadow-xl border border-[#e2e7ee] relative">
            <button
              type="button"
              onClick={() => setIsMessageDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#62718a] hover:text-[#14223b] rounded-full hover:bg-slate-100"
              aria-label="Fechar"
            >
              <IconCross className="size-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-[#eef5fc] flex items-center justify-center">
                <IconMessageSquare className="size-5 text-[#1463c7]" />
              </div>
              <div>
                <h3 id="message-drawer-title" className="text-[18px] font-bold text-[#14223b]">
                  Enviar mensagem ao vendedor
                </h3>
                <p className="text-[12px] text-[#62718a]">{vehicle.sellerName}</p>
              </div>
            </div>

            {!messageSent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (vehicle) {
                    const conv = startConversationFromListing(
                      {
                        id: vehicle.id,
                        title: vehicle.title,
                        priceFormatted: vehicle.priceFormatted,
                        city: vehicle.city,
                        state: vehicle.state,
                        sellerName: vehicle.sellerName,
                        sellerType: vehicle.sellerType,
                        imageUrl: vehicle.imageUrl,
                      },
                      messageText,
                      buyerProfile.fullName,
                    );
                    setCreatedConvId(conv.id);
                  }
                  setMessageSent(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="message-text"
                    className="block text-[12px] font-medium text-[#14223b] mb-1"
                  >
                    Sua mensagem
                  </label>
                  <textarea
                    id="message-text"
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    required
                    className="w-full p-3 bg-white border border-[#e0e6f0] rounded-[8px] text-[13px] text-[#14223b] focus:outline-none focus:border-[#b91c1c] resize-none"
                  />
                </div>

                <div className="bg-[#f8f9fb] border border-[#e2e7ee] rounded-[8px] p-3 text-[11px] text-[#62718a]">
                  Para sua segurança, nunca compartilhe senhas ou dados bancários pelo chat.
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsMessageDrawerOpen(false)}
                    className="px-4 h-[40px] bg-white border border-[#e0e6f0] text-[#14223b] text-[13px] font-medium rounded-[8px]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 h-[40px] bg-[#e0151f] hover:bg-[#b91c1c] text-white text-[13px] font-bold rounded-[8px]"
                  >
                    Enviar Mensagem
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <IconCheck className="size-6 text-emerald-600 stroke-[3]" />
                </div>
                <h4 className="text-[16px] font-bold text-[#14223b]">Mensagem enviada!</h4>
                <p className="text-[12px] text-[#62718a] mt-1 max-w-xs mx-auto">
                  Sua mensagem foi entregue ao anunciante. Você pode acompanhar todas as respostas
                  no seu canal de mensagens.
                </p>
                <div className="mt-5 space-y-2">
                  <Link
                    href={`/mensagens?id=${createdConvId || ''}`}
                    className="w-full h-[40px] bg-[#e0151f] hover:bg-[#b91c1c] text-white font-bold text-[13px] rounded-[8px] flex items-center justify-center transition-colors shadow-xs"
                  >
                    Abrir conversa em Mensagens →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMessageDrawerOpen(false);
                      setMessageSent(false);
                    }}
                    className="w-full h-[38px] bg-white border border-[#e0e6f0] text-[#14223b] font-medium text-[13px] rounded-[8px] hover:bg-slate-50 transition-colors"
                  >
                    Continuar navegando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <MarketplaceFooter />
    </div>
  );
}
