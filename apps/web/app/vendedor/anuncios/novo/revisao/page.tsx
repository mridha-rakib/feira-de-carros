'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconEdit,
  IconEye,
  IconInfo,
  IconPin,
  IconSend,
  IconShield,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { SellerWizardStepper } from '@/app/components/SellerWizardStepper';
import { useListingDraftStore } from '@/stores/use-listing-draft-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NovoAnuncioRevisaoPage() {
  const router = useRouter();
  const { draft, submitListing, resetDraft } = useListingDraftStore();

  const [activeImageIndex, setActiveImageIndex] = useState(draft.coverImageIndex || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(
    draft.submissionStatus === 'pending_review',
  );
  const [protocol, setProtocol] = useState(draft.protocolNumber || '');

  // Fallback vehicle info if accessed directly without filling
  const vehicleTitle =
    draft.make && draft.model ? `${draft.make} ${draft.model}` : 'Toyota Corolla 2.0 XEi Flex';
  const vehicleVersion = draft.version || '2.0 XEi 16V Flex Automático';
  const vehiclePrice = draft.price && Number(draft.price) > 0 ? Number(draft.price) : 124900;
  const vehicleKm =
    draft.mileageKm !== undefined && draft.mileageKm !== '' ? Number(draft.mileageKm) : 42500;
  const vehicleYearFab = draft.yearFabrication || 2021;
  const vehicleYearMod = draft.yearModel || 2022;
  const vehicleFuel = draft.fuelType || 'Flex';
  const vehicleTransmission = draft.transmission || 'Automático';
  const vehicleColor = draft.color || 'Prata';
  const vehiclePlate = draft.licensePlateLastDigit || '6';
  const vehicleLocation = `${draft.city || 'São Paulo'} - ${draft.state || 'SP'}`;
  const vehicleFeatures =
    draft.features && draft.features.length > 0
      ? draft.features
      : [
          'Ar-condicionado digital',
          'Direção elétrica',
          'Vidros elétricos nas 4 portas',
          'Travas elétricas',
          'Bancos em couro',
          'Central multimídia',
          'Câmera de ré',
          'Airbags frontais e laterais',
          'Freios ABS',
        ];
  const vehicleDescription =
    draft.description ||
    'Veículo em excelente estado de conservação, único dono, revisões em dia na concessionária autorizada. Laudo cautelar aprovado.';

  const displayImages =
    draft.images && draft.images.length > 0
      ? draft.images
      : ['/images/vehicles/demo/toyota-corolla-2021-b6.jpg'];

  const currentHeroImage = displayImages[activeImageIndex] || displayImages[0];

  const planBasePrice = draft.plan === 'basic' ? 30 : 50;
  const boostPrice = draft.hasBoost ? 10 : 0;
  const totalPrice = planBasePrice + boostPrice;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedProtocol = submitListing();
      setProtocol(generatedProtocol);
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    }, 600);
  };

  const handleStartNew = () => {
    resetDraft();
    router.push('/vendedor/anuncios/novo');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <SellerNavbar variant="seller" activeTab="criar" />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-12">
        {/* Breadcrumb Navigation */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: 'Criar anúncio', href: '/vendedor/anuncios/novo' },
            { label: 'Revisão final', active: true },
          ]}
        />

        {/* Wizard Stepper Progress (Etapa 4 de 4) */}
        <div className="mt-4">
          <SellerWizardStepper currentStep={4} />
        </div>

        {/* Success Modal / Banner if Submitted */}
        {submissionSuccess && (
          <div className="mb-8 bg-[#f0fdf4] border-2 border-[#86efac] rounded-[20px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="size-16 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-md">
                <IconCheck className="size-8 stroke-[3]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="px-3 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                    Em moderação
                  </span>
                  <span className="text-xs text-[#166534] font-medium">
                    Protocolo: <strong className="font-mono">{protocol}</strong>
                  </span>
                </div>

                <h2 className="text-[22px] sm:text-[24px] font-bold text-[#14532d]">
                  Anúncio enviado para análise com sucesso!
                </h2>

                <p className="text-[14px] text-[#166534] mt-2 leading-relaxed">
                  Seu anúncio está na fila de moderação e será revisado em até 24 horas úteis. Assim
                  que aprovado, você receberá a confirmação por e-mail e o anúncio ficará visível
                  publicamente na plataforma.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Link
                    href="/vendedor/anuncios"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-[14px] font-bold transition-colors shadow-sm"
                  >
                    Ver Meus Anúncios
                  </Link>

                  <button
                    type="button"
                    onClick={handleStartNew}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white border border-[#bbf7d0] hover:bg-[#dcfce7] text-[#15803d] text-[14px] font-semibold transition-colors"
                  >
                    Criar outro anúncio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Full Vehicle Listing Preview */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header info bar */}
            <div className="bg-white border border-[#e2e7ee] rounded-[16px] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a] inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#f59e0b] animate-pulse" />
                    Rascunho · Não publicado
                  </span>
                  {draft.hasBoost && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#ffedd5] text-[#9a3412] inline-flex items-center gap-1">
                      <IconSparkles className="size-3.5" />
                      Destaque 7d
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/vendedor/anuncios/novo/detalhes"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#b91c1c] hover:underline"
                  >
                    <IconEdit className="size-3.5" />
                    Editar dados
                  </Link>
                </div>
              </div>

              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <h1 className="text-[22px] sm:text-[28px] font-extrabold text-[#111827]">
                    {vehicleTitle}
                  </h1>
                  <p className="text-[14px] text-[#4b5563] mt-0.5">{vehicleVersion}</p>
                  <p className="text-xs text-[#64748b] flex items-center gap-1 mt-1">
                    <IconPin className="size-3.5" />
                    {vehicleLocation}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-[#64748b] block">Preço de venda</span>
                  <span className="text-[26px] sm:text-[30px] font-black text-[#b91c1c]">
                    R$ {vehiclePrice.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Image Preview & Gallery */}
              <div className="mt-6 space-y-3">
                <div className="relative w-full aspect-[16/10] rounded-[14px] overflow-hidden bg-[#0f172a] shadow-inner">
                  <Image
                    src={currentHeroImage}
                    alt={vehicleTitle}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                    Foto {activeImageIndex + 1} de {displayImages.length}
                  </div>
                </div>

                {displayImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {displayImages.map((imgUrl: string, idx: number) => (
                      <button
                        key={imgUrl}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative size-16 sm:size-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#b91c1c] ring-2 ring-[#fee2e2]'
                            : 'border-[#e2e8f0] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Miniatura ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
                <h3 className="text-[16px] font-bold text-[#111827] mb-4">
                  Especificações principais
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[11px] font-semibold text-[#64748b] block uppercase">
                      Ano Fab / Mod
                    </span>
                    <span className="text-[15px] font-bold text-[#111827] mt-0.5 block">
                      {vehicleYearFab} / {vehicleYearMod}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[11px] font-semibold text-[#64748b] block uppercase">
                      Quilometragem
                    </span>
                    <span className="text-[15px] font-bold text-[#111827] mt-0.5 block">
                      {vehicleKm.toLocaleString('pt-BR')} km
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[11px] font-semibold text-[#64748b] block uppercase">
                      Câmbio
                    </span>
                    <span className="text-[15px] font-bold text-[#111827] mt-0.5 block">
                      {vehicleTransmission}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[11px] font-semibold text-[#64748b] block uppercase">
                      Combustível
                    </span>
                    <span className="text-[15px] font-bold text-[#111827] mt-0.5 block">
                      {vehicleFuel}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[11px] font-semibold text-[#64748b] block uppercase">
                      Cor
                    </span>
                    <span className="text-[15px] font-bold text-[#111827] mt-0.5 block">
                      {vehicleColor}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[11px] font-semibold text-[#64748b] block uppercase">
                      Final da Placa
                    </span>
                    <span className="text-[15px] font-bold text-[#111827] mt-0.5 block">
                      Final {vehiclePlate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Features */}
              <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
                <h3 className="text-[16px] font-bold text-[#111827] mb-3">
                  Itens do veículo ({vehicleFeatures.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {vehicleFeatures.map((f: string) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#334155] text-xs font-semibold"
                    >
                      <IconCheck className="size-3.5 text-[#16a34a]" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
                <h3 className="text-[16px] font-bold text-[#111827] mb-2">Descrição do anúncio</h3>
                <p className="text-[14px] text-[#334155] leading-relaxed whitespace-pre-line bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                  {vehicleDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Commercial Summary & Submit Card */}
          <div className="lg:col-span-4 space-y-5">
            {/* Plan and Pricing Summary */}
            <div className="bg-white border border-[#e2e7ee] rounded-[16px] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] mb-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Resumo do Plano</h3>
                <Link
                  href="/vendedor/anuncios/novo/fotos"
                  className="text-xs font-semibold text-[#b91c1c] hover:underline"
                >
                  Alterar plano
                </Link>
              </div>

              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">
                    {draft.plan === 'basic'
                      ? 'Plano Básico (30 dias)'
                      : 'Plano Estendido (60 dias)'}
                  </span>
                  <span className="font-bold text-[#111827]">
                    R$ {planBasePrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {draft.hasBoost && (
                  <div className="flex justify-between items-center text-[#9a3412]">
                    <span className="flex items-center gap-1 text-xs font-semibold">
                      <IconSparkles className="size-3.5" />
                      Destaque no Topo (7 dias)
                    </span>
                    <span className="font-bold">
                      + R$ {boostPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-baseline">
                  <span className="font-bold text-[#111827]">Valor Total</span>
                  <span className="text-[22px] font-black text-[#b91c1c]">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Moderation Policy Notice */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[12px] text-[#475569] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-[#1e293b] mb-1">
                  <IconShield className="size-4 text-[#16a34a]" />
                  <span>Moderação Segura</span>
                </div>
                O pagamento é realizado somente após a aprovação das fotos e dados pela equipe Feira
                de Carros.
              </div>

              {/* Submit CTA Button */}
              <div className="mt-6 pt-4 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  disabled={isSubmitting || submissionSuccess}
                  onClick={handleSubmit}
                  className="w-full h-[50px] inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#b91c1c] hover:bg-[#991b1b] disabled:bg-[#9ca3af] text-white text-[15px] font-bold transition-all shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando para análise...
                    </span>
                  ) : submissionSuccess ? (
                    <span className="inline-flex items-center gap-2">
                      <IconCheck className="size-5" />
                      Anúncio Enviado!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <IconSend className="size-4" />
                      Enviar para Moderação
                    </span>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#64748b] mt-2">
                  Ao enviar, você concorda com os Termos de Uso e Política de Moderação de Anúncios.
                </p>
              </div>
            </div>

            {/* Quick Navigation / Step Links */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] p-5">
              <h4 className="text-[13px] font-bold text-[#1e293b] mb-3">Etapas do assistente</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/vendedor/anuncios/novo"
                    className="flex items-center justify-between text-[#475569] hover:text-[#b91c1c] py-1"
                  >
                    <span>
                      1. Categoria:{' '}
                      {draft.category === 'cars'
                        ? 'Carros'
                        : draft.category === 'motorcycles'
                          ? 'Motos'
                          : 'Caminhões'}
                    </span>
                    <span className="font-semibold text-[#b91c1c]">Editar</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vendedor/anuncios/novo/detalhes"
                    className="flex items-center justify-between text-[#475569] hover:text-[#b91c1c] py-1"
                  >
                    <span>2. Ficha Técnica e Opcionais</span>
                    <span className="font-semibold text-[#b91c1c]">Editar</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vendedor/anuncios/novo/fotos"
                    className="flex items-center justify-between text-[#475569] hover:text-[#b91c1c] py-1"
                  >
                    <span>3. Fotos ({displayImages.length}) & Plano</span>
                    <span className="font-semibold text-[#b91c1c]">Editar</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="criar" userRole="seller" />
    </div>
  );
}
