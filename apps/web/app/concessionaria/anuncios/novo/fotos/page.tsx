'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCamera,
  IconCheck,
  IconInfo,
  IconPlus,
  IconSparkles,
  IconStar,
  IconTrash,
} from '@/app/components/SellerIcons';
import { DealerWizardStepper } from '@/app/components/dealership/DealerWizardStepper';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

const DEMO_DEALER_GALLERY_IMAGES = [
  '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
  '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
  '/images/vehicles/demo/vw-polo-2023.jpg',
  '/images/vehicles/demo/chevrolet-onix-2022.jpg',
  '/images/vehicles/demo/fiat-strada-2023.jpg',
  '/images/vehicles/demo/honda-cg-160-2022.jpg',
];

export default function DealerNovoAnuncioFotosPage() {
  const router = useRouter();
  const { draft, addDraftImage, removeDraftImage, setDraftCoverImage, setDraftStep } =
    useDealerInventoryStore();

  const [photoError, setPhotoError] = useState<string | null>(null);

  const maxPhotos = 10;
  const currentPhotoCount = draft.images.length;

  const handleAddSamplePhotos = () => {
    setPhotoError(null);
    for (const img of DEMO_DEALER_GALLERY_IMAGES) {
      if (draft.images.length >= maxPhotos) break;
      if (!draft.images.includes(img)) {
        addDraftImage(img);
      }
    }
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (currentPhotoCount >= maxPhotos) {
      setPhotoError(`O limite máximo de ${maxPhotos} fotos para a concessionária foi atingido.`);
      return;
    }

    const availableSlots = maxPhotos - currentPhotoCount;
    const filesToAdd = Array.from(files).slice(0, availableSlots);

    for (const file of filesToAdd) {
      const localUrl = URL.createObjectURL(file);
      addDraftImage(localUrl);
    }

    // Reset input
    e.target.value = '';
  };

  const handleContinue = () => {
    if (draft.images.length === 0) {
      setPhotoError('Adicione pelo menos 1 foto para prosseguir com a publicação do veículo.');
      return;
    }
    setDraftStep(4);
    router.push('/concessionaria/anuncios/novo/revisao');
  };

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
          <span className="font-semibold text-[#17243f]">Fotos</span>
        </div>

        {/* Wizard Stepper */}
        <DealerWizardStepper currentStep={3} />

        {/* Heading Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17243f] tracking-tight">
              Fotos do veículo
            </h1>
            <p className="text-[14px] text-[#697a95] mt-1">
              Adicione fotos com boa iluminação e selecione a imagem de capa principal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddSamplePhotos}
              data-testid="btn-add-sample-photos"
              className="text-[12px] font-semibold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] border border-[#bfdbfe] px-3.5 py-2 rounded-[8px] flex items-center gap-1.5 transition-colors"
            >
              <IconCamera className="size-3.5" />
              <span>Adicionar fotos de exemplo</span>
            </button>
          </div>
        </div>

        {/* Photo Upload Zone */}
        <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#17243f]">Galeria de Fotos</span>
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569]">
                {currentPhotoCount} de {maxPhotos} fotos
              </span>
            </div>
            <p className="text-[12px] text-[#8a99ad]">
              Formatos aceitos: JPG, PNG, WEBP. A primeira foto ou a marcada com estrela será a
              capa.
            </p>
          </div>

          {photoError && (
            <div className="mb-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[8px] text-[12px] text-[#b91c1c] flex items-center gap-2">
              <IconAlert className="size-4 shrink-0" />
              <span>{photoError}</span>
            </div>
          )}

          {/* Grid of uploaded photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {/* Upload Button Box */}
            {currentPhotoCount < maxPhotos && (
              <label
                htmlFor="photo-upload-input"
                data-testid="dropzone-upload-box"
                className="aspect-4/3 rounded-[10px] border-2 border-dashed border-[#cbd5e1] hover:border-[#b91c1c] bg-[#f8fafc] hover:bg-[#fef2f2]/40 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors group"
              >
                <div className="size-10 rounded-full bg-white border border-[#cbd5e1] group-hover:border-[#fecaca] text-[#64748b] group-hover:text-[#b91c1c] flex items-center justify-center mb-1.5 shadow-2xs transition-colors">
                  <IconPlus className="size-5" />
                </div>
                <span className="text-[12px] font-bold text-[#17243f] group-hover:text-[#b91c1c]">
                  Adicionar foto
                </span>
                <span className="text-[10px] text-[#8a99ad] mt-0.5">Clique ou arraste</span>
                <input
                  id="photo-upload-input"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleSimulateUpload}
                  className="hidden"
                  data-testid="input-dealer-photo-file"
                />
              </label>
            )}

            {/* Photo Cards */}
            {draft.images.map((imgUrl, index) => {
              const isCover = (draft.coverImageIndex || 0) === index;
              return (
                <div
                  key={imgUrl}
                  data-testid={`photo-card-${index}`}
                  className={`aspect-4/3 rounded-[10px] overflow-hidden relative border group bg-gray-100 ${
                    isCover ? 'border-[#b91c1c] ring-2 ring-[#fee2e2]' : 'border-[#dee6f1]'
                  }`}
                >
                  <Image src={imgUrl} alt={`Foto ${index + 1}`} fill className="object-cover" />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] shadow-xs flex items-center gap-1">
                      <IconStar className="size-3 fill-white" />
                      <span>Capa</span>
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => setDraftCoverImage(index)}
                        title="Definir como foto de capa"
                        data-testid={`btn-set-cover-${index}`}
                        className="p-1.5 bg-white/90 hover:bg-white text-[#17243f] rounded-[6px] text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <IconStar className="size-3.5" />
                        <span>Capa</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeDraftImage(index)}
                      title="Remover foto"
                      data-testid={`btn-remove-photo-${index}`}
                      className="p-1.5 bg-white/90 hover:bg-[#fef2f2] text-[#b91c1c] rounded-[6px] transition-colors shadow-xs"
                    >
                      <IconTrash className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informational Callout */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] p-4 mb-8 flex items-start gap-3">
          <IconInfo className="size-5 text-[#64748b] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#475569] leading-relaxed">
            <p className="font-semibold text-[#17243f]">Diretrizes de Fotos da Concessionária</p>
            <p className="mt-0.5 text-[12px] text-[#64748b]">
              Veículos com fotos nítidas do exterior, interior e painel de instrumentos recebem até
              3x mais visualizações e contatos de compradores qualificados. As fotos são processadas
              localmente durante esta sessão demonstrativa.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#dee6f1]">
          <Link
            href="/concessionaria/anuncios/novo/detalhes"
            className="px-4 py-2 text-[13px] font-semibold text-[#697a95] hover:text-[#17243f] transition-colors flex items-center gap-1.5"
          >
            <IconArrowLeft className="size-4" />
            <span>Voltar para detalhes</span>
          </Link>

          <button
            type="button"
            onClick={handleContinue}
            data-testid="btn-continue-step4"
            className="px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Continuar para revisão</span>
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
