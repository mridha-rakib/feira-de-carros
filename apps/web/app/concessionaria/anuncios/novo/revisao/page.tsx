'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconEdit,
  IconEye,
  IconInfo,
  IconShield,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { DealerWizardStepper } from '@/app/components/dealership/DealerWizardStepper';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import { useDealerStore } from '@/stores/use-dealer-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function DealerNovoAnuncioRevisaoPage() {
  const router = useRouter();
  const { draft, submitDraft, resetDraft } = useDealerInventoryStore();
  const { application, account } = useDealerStore();

  const [activeImageIndex, setActiveImageIndex] = useState(draft.coverImageIndex || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(
    draft.submissionStatus === 'pending_review',
  );
  const [protocol, setProtocol] = useState(draft.protocolNumber || '');

  const dealershipName =
    application.dealershipName || account?.dealershipName || 'Líder Veículos e Seminovos Ltda';
  const dealershipCity = application.city || 'Ipatinga';
  const dealershipState = application.state || 'MG';

  // Fallback defaults if accessed directly
  const vehicleMake = draft.make || 'Toyota';
  const vehicleModel = draft.model || 'Yaris';
  const vehicleVersion = draft.version || '1.5 XLS 16V Flex Automático';
  const vehiclePrice = Number(draft.price) || 98900;
  const vehicleKm =
    draft.mileageKm !== undefined && draft.mileageKm !== '' ? Number(draft.mileageKm) : 19500;
  const vehicleYearFab = draft.yearFabrication || 2023;
  const vehicleYearMod = draft.yearModel || 2024;
  const vehicleFuel = draft.fuelType || 'Flex';
  const vehicleTransmission = draft.transmission || 'Automático';
  const vehiclePlate = draft.licensePlate || 'BRA9E88';
  const vehicleFeatures =
    draft.features && draft.features.length > 0
      ? draft.features
      : [
          'Ar-condicionado digital',
          'Direção elétrica',
          'Vidros elétricos',
          'Airbag duplo',
          'Freios ABS',
        ];
  const vehicleDescription =
    draft.description ||
    'Veículo seminovo inspecionado com garantia da concessionária e laudo cautelar aprovado.';
  const vehicleImages =
    draft.images.length > 0 ? draft.images : ['/images/vehicles/demo/toyota-corolla-2021-b6.jpg'];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitDraft();
      setProtocol(
        draft.protocolNumber || `PROT-DLR-202611-${Math.floor(1000 + Math.random() * 9000)}`,
      );
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    }, 400);
  };

  const handleCreateAnother = () => {
    resetDraft();
    setSubmissionSuccess(false);
    router.push('/concessionaria/anuncios/novo');
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
        <MarketplaceHeader />
        <DealershipSubNav activeItem="concessionarias" />

        <main className="flex-1 max-w-[800px] w-full mx-auto px-4 sm:px-6 py-12 pb-24">
          <div
            className="bg-white border border-[#dee6f1] rounded-[16px] p-8 shadow-md text-center"
            data-testid="submission-success-card"
          >
            {/* Success Icon */}
            <div className="size-16 rounded-full bg-[#ecfdf5] border-2 border-[#a7f3d0] text-[#059669] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <IconCheck className="size-8 stroke-[3]" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0]">
              Veículo Enviado para Análise
            </span>

            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#17243f] mt-3">
              Anúncio enviado com sucesso!
            </h1>
            <p className="text-[14px] text-[#697a95] mt-2 max-w-[560px] mx-auto leading-relaxed">
              O veículo foi adicionado ao estoque da sua concessionária e já está visível com status{' '}
              <strong className="text-[#2563eb]">Em análise</strong>.
            </p>

            {/* Protocol and Summary Box */}
            <div className="mt-6 p-5 bg-[#f8fafc] border border-[#dee6f1] rounded-[12px] text-left max-w-[560px] mx-auto space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                <div>
                  <span className="text-[11px] text-[#8a99ad] uppercase font-bold tracking-wider block">
                    Protocolo de Homologação
                  </span>
                  <span
                    className="text-[16px] font-mono font-bold text-[#17243f]"
                    data-testid="protocol-number"
                  >
                    {protocol}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eaf3ff] text-[#2265bb] border border-[#bfdbfe]">
                  Em análise (VEH-016)
                </span>
              </div>

              <div className="text-[13px] text-[#334155] space-y-1">
                <p>
                  <strong>Veículo:</strong> {vehicleMake} {vehicleModel} {vehicleVersion}
                </p>
                <p>
                  <strong>Preço anunciado:</strong> R$ {vehiclePrice.toLocaleString('pt-BR')}
                </p>
                <p>
                  <strong>Concessionária:</strong> {dealershipName} ({dealershipCity} -{' '}
                  {dealershipState})
                </p>
                <p>
                  <strong>Placa:</strong> {vehiclePlate} · <strong>Km:</strong>{' '}
                  {vehicleKm.toLocaleString('pt-BR')} km
                </p>
              </div>
            </div>

            {/* Next steps action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/concessionaria/anuncios"
                data-testid="btn-go-to-inventory"
                className="w-full sm:w-auto px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Ver meu estoque atualizado</span>
                <IconArrowRight className="size-4" />
              </Link>

              <button
                type="button"
                onClick={handleCreateAnother}
                data-testid="btn-create-another"
                className="w-full sm:w-auto px-5 py-3 bg-white border border-[#dee6f1] hover:bg-[#f8fafc] text-[#17243f] font-semibold text-[14px] rounded-[8px] transition-colors"
              >
                Cadastrar outro veículo
              </button>
            </div>
          </div>
        </main>

        <MarketplaceFooter />
      </div>
    );
  }

  // REVIEW & PREVIEW SCREEN
  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1020px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link href="/concessionaria/anuncios" className="hover:text-[#17243f] transition-colors">
            Estoque
          </Link>
          <span>›</span>
          <Link
            href="/concessionaria/anuncios/novo"
            className="hover:text-[#17243f] transition-colors"
          >
            Novo Anúncio
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Revisão</span>
        </div>

        {/* Wizard Stepper */}
        <DealerWizardStepper currentStep={4} />

        {/* Heading Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17243f] tracking-tight">
              Revisão e confirmação do anúncio
            </h1>
            <p className="text-[14px] text-[#697a95] mt-1">
              Confira todos os dados cadastrados antes de enviar o veículo para o estoque.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Photos Gallery Preview (Col 1-2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#17243f] mb-4 pb-2 border-b border-[#f1f5f9]">
                Galeria de Fotos
              </h2>

              {/* Main Photo Display */}
              <div className="relative aspect-16/10 rounded-[10px] overflow-hidden bg-gray-100 border border-[#dee6f1] mb-3">
                <Image
                  src={vehicleImages[activeImageIndex] || vehicleImages[0]}
                  alt={`${vehicleMake} ${vehicleModel}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnails Row */}
              {vehicleImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {vehicleImages.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative size-16 rounded-[8px] overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#b91c1c] ring-2 ring-[#fee2e2]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Miniatura ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details Overview */}
            <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-[#f1f5f9]">
                <div>
                  <h3 className="text-[20px] font-bold text-[#17243f]">
                    {vehicleMake} {vehicleModel}
                  </h3>
                  <p className="text-[13px] text-[#697a95] mt-0.5">{vehicleVersion}</p>
                </div>
                <Link
                  href="/concessionaria/anuncios/novo/detalhes"
                  className="text-[12px] font-semibold text-[#b91c1c] hover:underline flex items-center gap-1"
                >
                  <IconEdit className="size-3.5" />
                  <span>Editar</span>
                </Link>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#f8fafc] rounded-[10px] text-[13px] mb-4">
                <div>
                  <span className="text-[11px] text-[#8a99ad] block">Ano</span>
                  <span className="font-semibold text-[#17243f]">
                    {vehicleYearFab}/{vehicleYearMod}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8a99ad] block">Km</span>
                  <span className="font-semibold text-[#17243f]">
                    {vehicleKm.toLocaleString('pt-BR')} km
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8a99ad] block">Câmbio</span>
                  <span className="font-semibold text-[#17243f]">{vehicleTransmission}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#8a99ad] block">Combustível</span>
                  <span className="font-semibold text-[#17243f]">{vehicleFuel}</span>
                </div>
              </div>

              {/* Features Chips */}
              <div className="mb-4">
                <span className="text-[12px] font-semibold text-[#697a95] block mb-2">
                  Itens e Opcionais Selecionados ({vehicleFeatures.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {vehicleFeatures.map((feat) => (
                    <span
                      key={feat}
                      className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-[#f1f5f9] text-[#475569]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              {vehicleDescription && (
                <div className="pt-3 border-t border-[#f1f5f9]">
                  <span className="text-[12px] font-semibold text-[#697a95] block mb-1">
                    Descrição do Anúncio:
                  </span>
                  <p className="text-[13px] text-[#334155] leading-relaxed whitespace-pre-line">
                    {vehicleDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing, Dealership & Moderation Notice (Col 3) */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#697a95] block">
                Preço Anunciado
              </span>
              <p
                className="text-[30px] font-bold text-[#17243f] mt-1"
                data-testid="review-vehicle-price"
              >
                R$ {vehiclePrice.toLocaleString('pt-BR')}
              </p>
              <div className="mt-3 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] text-[12px] text-[#166534] flex items-center gap-2">
                <IconSparkles className="size-4 text-[#16a34a] shrink-0" />
                <span>Plano Premium da concessionária incluso</span>
              </div>
            </div>

            {/* Dealership Info Card */}
            <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#697a95] block mb-2">
                Anunciante Responsável
              </span>
              <div className="p-3 bg-[#f8fafc] rounded-[10px] space-y-1.5 text-[13px]">
                <p className="font-bold text-[#17243f]">{dealershipName}</p>
                <p className="text-[#697a95]">
                  {dealershipCity} - {dealershipState}
                </p>
                <p className="text-[11px] text-[#8a99ad]">
                  Placa vinculada: <span className="font-mono font-semibold">{vehiclePlate}</span>
                </p>
              </div>
            </div>

            {/* Moderation & Security Disclaimer */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[14px] p-5 space-y-2 text-[12px] text-[#1e40af]">
              <div className="flex items-center gap-2 font-bold text-[#1d4ed8]">
                <IconShield className="size-4" />
                <span>Política de Integridade (VEH-016)</span>
              </div>
              <p className="leading-relaxed text-[#2563eb]">
                Ao submeter o veículo, ele será inserido no seu estoque com status{' '}
                <strong>Em análise</strong> e entrará na fila de revisão do marketplace antes da
                publicação na vitrine aberta.
              </p>
            </div>

            {/* Submit Action Box */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                data-testid="btn-submit-dealer-listing"
                className="w-full py-3.5 bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-50 text-white font-bold text-[15px] rounded-[10px] shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Enviando anúncio...</span>
                ) : (
                  <>
                    <span>Publicar anúncio no estoque</span>
                    <IconArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#dee6f1]">
          <Link
            href="/concessionaria/anuncios/novo/fotos"
            className="px-4 py-2 text-[13px] font-semibold text-[#697a95] hover:text-[#17243f] transition-colors flex items-center gap-1.5"
          >
            <IconArrowLeft className="size-4" />
            <span>Voltar para fotos</span>
          </Link>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
