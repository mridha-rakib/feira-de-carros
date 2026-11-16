'use client';

import {
  getSellerListingById,
  resubmitListingCorrection,
  updateListingCorrectionDraft,
} from '@/lib/adapters/seller-listings-adapter';
import type { SellerListingDetail } from '@/lib/types/seller-presentation';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SellerBreadcrumb } from '../../../../components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconCamera,
  IconCheck,
  IconClock,
  IconFile,
  IconGauge,
  IconInfo,
  IconPlus,
  IconSend,
  IconTrash,
} from '../../../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../../../components/SellerNavbar';

export default function SellerListingCorrectionPage() {
  const params = useParams();
  const listingId = (params?.id as string) || 'FC-2026-0151';

  const [listing, setListing] = useState<SellerListingDetail | null>(
    () => getSellerListingById(listingId) || null,
  );
  const [mileageInput, setMileageInput] = useState(
    () => getSellerListingById(listingId)?.mileageKm.toString() || '32800',
  );
  const [descriptionInput, setDescriptionInput] = useState(
    () => getSellerListingById(listingId)?.description || '',
  );
  const [photos, setPhotos] = useState<string[]>(() => [
    ...(getSellerListingById(listingId)?.galleryImages || []),
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResubmitted, setIsResubmitted] = useState(false);
  const [errors, setErrors] = useState<{ mileage?: string; description?: string }>({});

  useEffect(() => {
    const data = getSellerListingById(listingId);
    if (data) {
      setListing(data);
      setMileageInput(data.mileageKm.toString());
      setDescriptionInput(data.description);
      setPhotos([...data.galleryImages]);
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

  const handleAddPhoto = () => {
    // Add vehicle photo fallback from demo assets
    const fallbackPhoto = '/images/vehicles/demo/web027-thumb2.png';
    setPhotos((prev) => [...prev, fallbackPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) {
      alert('O anúncio deve possuir pelo menos 1 foto.');
      return;
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { mileage?: string; description?: string } = {};

    const mileageNum = Number.parseInt(mileageInput.replace(/\D/g, ''), 10);
    if (Number.isNaN(mileageNum) || mileageNum < 0) {
      newErrors.mileage = 'Informe uma quilometragem válida.';
    }

    if (!descriptionInput.trim() || descriptionInput.length < 20) {
      newErrors.description = 'A descrição precisa ter pelo menos 20 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Update in-memory adapter state
    updateListingCorrectionDraft(listing.id, {
      mileageKm: mileageNum,
      description: descriptionInput,
    });

    const res = resubmitListingCorrection(listing.id);
    if (res.success && res.listing) {
      setListing(res.listing);
      setIsResubmitted(true);
    }
    setIsSubmitting(false);
  };

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
            { label: 'Correção do anúncio', active: true },
          ]}
          mobileShortLabel="Feira de Carros › Meus anúncios › Corrigir anúncio rejeitado"
        />

        {/* Heading (matching 2705:2610-2611 & mobile 1109:1520-1523) */}
        <div className="mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#101828] tracking-tight">
            Correção do anúncio
          </h1>
          <p className="text-sm sm:text-[15px] text-[#64748b] mt-1">
            Revise os pontos indicados pela equipe e reenvie o anúncio para análise.
          </p>
          <p className="text-xs font-semibold text-[#c41217] mt-1 md:hidden">
            WEB-027 · Preview demonstrativo
          </p>
        </div>

        {/* Stepper Timeline (matching 2705:2612-2622) */}
        <div className="bg-white border border-[#d7dfea] rounded-[10px] p-4 sm:p-6 mb-6 shadow-2xs">
          <div className="relative flex items-center justify-between max-w-3xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-[3px] bg-[#d7dfea] -z-0" />

            {/* Step 1: Enviado */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="size-8 rounded-full bg-[#15803d] text-white flex items-center justify-center shadow-xs">
                <IconCheck className="size-4 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#101828] mt-2">Enviado</span>
              <span className="text-[11px] text-[#64748b] hidden sm:block">24 out, 09:32</span>
            </div>

            {/* Step 2: Em análise */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`size-8 rounded-full flex items-center justify-center shadow-xs ${
                  isResubmitted ? 'bg-[#15803d] text-white' : 'bg-[#e2e8f0] text-[#475569]'
                }`}
              >
                {isResubmitted ? (
                  <IconCheck className="size-4 stroke-[3]" />
                ) : (
                  <IconClock className="size-4" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#101828] mt-2">
                Em análise
              </span>
              <span className="text-[11px] text-[#64748b] hidden sm:block">
                {isResubmitted ? 'Reenviado agora' : '24 out, 10:11'}
              </span>
            </div>

            {/* Step 3: Correção solicitada / Correções reenviadas */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`size-8 rounded-full flex items-center justify-center shadow-xs ${
                  isResubmitted
                    ? 'bg-[#e0f2fe] text-[#0369a1]'
                    : 'bg-[#fee2e2] text-[#c41217] border-2 border-[#c41217]'
                }`}
              >
                {isResubmitted ? (
                  <IconClock className="size-4" />
                ) : (
                  <IconAlert className="size-4 stroke-[2.5]" />
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold mt-2 ${
                  isResubmitted ? 'text-[#0369a1]' : 'text-[#c41217]'
                }`}
              >
                {isResubmitted ? 'Aguardando decisão' : 'Correção solicitada'}
              </span>
              <span className="text-[11px] text-[#64748b] hidden sm:block">
                {isResubmitted ? 'Fila do Main Admin' : '24 out, 14:27'}
              </span>
            </div>
          </div>
        </div>

        {/* Resubmitted Success View (matching Figma 701:457 / 701:483) */}
        {isResubmitted ? (
          <div className="bg-white border border-[#d7dfea] rounded-[10px] p-6 sm:p-8 shadow-xs max-w-3xl mx-auto text-center">
            <div className="size-16 rounded-full bg-[#ecfdf5] text-[#15803d] mx-auto flex items-center justify-center mb-4">
              <IconCheck className="size-8 stroke-[3]" />
            </div>
            <h2 className="text-2xl font-bold text-[#101828]">Correções reenviadas para análise</h2>
            <p className="text-[#64748b] text-sm sm:text-base mt-2 max-w-lg mx-auto">
              Seu anúncio <span className="font-semibold text-[#101828]">{listing.id}</span> foi
              atualizado e enviado com sucesso à equipe de moderação.
            </p>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-4 my-6 text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Veículo:</span>
                <span className="font-semibold text-[#101828]">{listing.title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Status atual:</span>
                <span className="font-semibold text-[#b86b0a]">Em análise</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Próxima etapa:</span>
                <span className="font-semibold text-[#101828]">Decisão da moderação</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vendedor/anuncios"
                className="bg-[#c41217] hover:bg-[#a81014] text-white font-semibold px-6 py-3 rounded-[7px] text-sm transition-colors shadow-xs"
              >
                Voltar aos meus anúncios
              </Link>
              <Link
                href={`/vendedor/anuncios/${listing.id}`}
                className="bg-white border border-[#d7dfea] hover:bg-gray-50 text-[#101828] font-semibold px-6 py-3 rounded-[7px] text-sm transition-colors"
              >
                Ver detalhes do anúncio
              </Link>
            </div>
          </div>
        ) : (
          /* Main 2-Column Grid (matching 2705:2623 & 2705:2683) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form & Corrections (lg:col-span-8) */}
            <form onSubmit={handleResubmit} className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#d7dfea] rounded-[10px] p-4 sm:p-6 shadow-2xs space-y-6">
                {/* Alert Banner (matching 2705:2624) */}
                <div className="bg-[#fff2dd] border border-[#fde4ba] rounded-[10px] p-4 flex gap-3.5 items-start">
                  <div className="size-6 text-[#b86b0a] shrink-0 mt-0.5">
                    <IconAlert className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-[17px] font-semibold text-[#101828]">
                      Correção solicitada
                    </h3>
                    <p className="text-xs sm:text-[14px] text-[#64748b] mt-0.5">
                      Seu anúncio precisa de ajustes antes de ser aprovado. Revise as observações da
                      moderação abaixo.
                    </p>
                  </div>
                </div>

                {/* Vehicle Summary Card (matching 2705:2629) */}
                <div className="bg-white border border-[#d7dfea] rounded-[10px] p-3 sm:p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="relative size-20 sm:w-28 sm:h-20 rounded-[8px] overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={listing.imageUrl}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 112px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-[17px] font-semibold text-[#101828] truncate">
                        {listing.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-[#64748b] mt-0.5">
                        {listing.brand} • {listing.category} • {listing.fuel} •{' '}
                        {listing.mileageFormatted}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#101828] mt-1 sm:hidden">
                        {listing.priceFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-lg font-semibold text-[#101828]">{listing.priceFormatted}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff2dd] text-[#b86b0a]">
                      Correção solicitada
                    </span>
                  </div>
                </div>

                {/* Team Comments / Rejection Reasons (matching 2705:2635-2651) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-[#101828]">
                    <IconFile className="size-5 text-[#64748b]" />
                    <h3 className="text-base sm:text-lg font-semibold">Comentários da equipe</h3>
                  </div>

                  <div className="space-y-2">
                    {listing.correction?.reasons.map((reason) => (
                      <div
                        key={reason}
                        className="bg-white border border-[#d7dfea] rounded-[10px] p-3 flex items-center gap-3 text-sm text-[#101828]"
                      >
                        <IconCamera className="size-5 text-[#c41217] shrink-0" />
                        <span>{reason}</span>
                      </div>
                    )) || (
                      <div className="bg-white border border-[#d7dfea] rounded-[10px] p-3 text-sm text-[#101828]">
                        Revise fotos e especificações do veículo.
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Edits Form (matching 2705:2652-2662) */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-base sm:text-lg font-semibold text-[#101828]">
                    Ajustes rápidos
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mileage */}
                    <div>
                      <label
                        htmlFor="mileageInput"
                        className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#101828] mb-1.5"
                      >
                        <IconGauge className="size-4 text-[#64748b]" />
                        <span>Quilometragem *</span>
                      </label>
                      <input
                        id="mileageInput"
                        type="text"
                        value={mileageInput}
                        onChange={(e) => setMileageInput(e.target.value)}
                        className={`w-full h-11 px-3 bg-white border rounded-[8px] text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#c41217] ${
                          errors.mileage ? 'border-red-500 bg-red-50' : 'border-[#d7dfea]'
                        }`}
                        placeholder="Ex: 32800"
                      />
                      {errors.mileage && (
                        <p className="text-xs text-red-600 mt-1">{errors.mileage}</p>
                      )}
                    </div>

                    {/* Price read-only note */}
                    <div>
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                        <IconFile className="size-4 text-[#64748b]" />
                        <span>Preço atual</span>
                      </span>
                      <div className="w-full h-11 px-3 bg-gray-50 border border-[#d7dfea] rounded-[8px] text-sm text-[#64748b] flex items-center justify-between">
                        <span>{listing.priceFormatted}</span>
                        <span className="text-[11px] text-[#64748b]">(Inalterado)</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="descriptionInput"
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#101828] mb-1.5"
                    >
                      <IconFile className="size-4 text-[#64748b]" />
                      <span>Descrição do veículo *</span>
                    </label>
                    <textarea
                      id="descriptionInput"
                      rows={4}
                      value={descriptionInput}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      className={`w-full p-3 bg-white border rounded-[8px] text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#c41217] ${
                        errors.description ? 'border-red-500 bg-red-50' : 'border-[#d7dfea]'
                      }`}
                      placeholder="Detalhar versão, opcionais e histórico de manutenção..."
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                    )}
                    <p className="text-[11px] text-[#64748b] text-right mt-1">
                      {descriptionInput.length} caracteres
                    </p>
                  </div>

                  {/* Photos Section (matching 2705:2663-2674) */}
                  <div>
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#101828] mb-2">
                      <IconCamera className="size-4 text-[#64748b]" />
                      <span>Fotos do veículo *</span>
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {photos.map((photoUrl, idx) => (
                        <div
                          key={photoUrl}
                          className="relative h-28 rounded-[8px] overflow-hidden border border-[#d7dfea] group bg-gray-100"
                        >
                          <Image
                            src={photoUrl}
                            alt={`Foto ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            aria-label={`Remover foto ${idx + 1}`}
                            className="absolute top-1.5 right-1.5 size-7 rounded-full bg-black/60 hover:bg-[#c41217] text-white flex items-center justify-center transition-colors"
                          >
                            <IconTrash className="size-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                            {idx === 0 ? 'Capa' : `Foto ${idx + 1}`}
                          </span>
                        </div>
                      ))}

                      {/* Add photo dropzone CTA */}
                      <button
                        type="button"
                        onClick={handleAddPhoto}
                        className="h-28 rounded-[8px] border-2 border-dashed border-[#b4c7dd] hover:border-[#c41217] bg-white flex flex-col items-center justify-center gap-1.5 p-2 text-center transition-colors group"
                      >
                        <div className="size-8 rounded-full bg-gray-50 group-hover:bg-red-50 flex items-center justify-center text-[#64748b] group-hover:text-[#c41217]">
                          <IconPlus className="size-5" />
                        </div>
                        <span className="text-xs font-semibold text-[#64748b] group-hover:text-[#c41217]">
                          Adicionar foto traseira
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons (matching 2705:2675-2682) */}
                <div className="pt-4 border-t border-[#d7dfea] flex flex-col-reverse sm:flex-row gap-3 items-center justify-between">
                  <Link
                    href="/vendedor/anuncios"
                    className="w-full sm:w-auto h-12 px-6 rounded-[7px] border border-[#d7dfea] hover:bg-gray-50 text-[#101828] font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <IconArrowLeft className="size-4" />
                    <span>Cancelar</span>
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 h-12 px-8 rounded-[7px] bg-[#c41217] hover:bg-[#a81014] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
                  >
                    <IconSend className="size-4" />
                    <span>{isSubmitting ? 'Enviando...' : 'Reenviar para análise'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Right Column: History & Policies (lg:col-span-4) (matching 2705:2683 & 2705:2703) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Review History Card */}
              <div className="bg-white border border-[#d7dfea] rounded-[10px] p-5 shadow-2xs space-y-5">
                <div className="flex items-center gap-2.5">
                  <IconClock className="size-5 text-[#101828]" />
                  <h3 className="text-lg font-semibold text-[#101828]">Histórico da revisão</h3>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#d7dfea]">
                  {listing.history?.map((item) => (
                    <div key={`${item.title}-${item.date}`} className="relative">
                      <div className="absolute -left-[19px] top-1 size-3 rounded-full bg-[#c41217] ring-4 ring-white" />
                      <h4 className="text-sm font-semibold text-[#101828]">{item.title}</h4>
                      <p className="text-xs text-[#64748b] mt-0.5">{item.date}</p>
                      <p className="text-xs text-[#64748b] mt-1">{item.description}</p>
                    </div>
                  )) || (
                    <div className="relative">
                      <div className="absolute -left-[19px] top-1 size-3 rounded-full bg-[#c41217] ring-4 ring-white" />
                      <h4 className="text-sm font-semibold text-[#101828]">Correção solicitada</h4>
                      <p className="text-xs text-[#64748b] mt-0.5">24 out 2026 às 14:27</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Version Policy Notice Card (matching 2705:2703) */}
              <div className="bg-white border border-[#d7dfea] rounded-[10px] p-5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <IconInfo className="size-5 text-[#0369a1]" />
                  <h3 className="text-base font-semibold text-[#101828]">
                    Versão pública do anúncio
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-[#64748b] leading-relaxed">
                  A versão aprovada permanece pública enquanto a nova alteração está em análise,
                  quando aplicável.
                </p>
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
