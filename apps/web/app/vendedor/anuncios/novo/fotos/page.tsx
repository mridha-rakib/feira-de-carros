'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCamera,
  IconCheck,
  IconInfo,
  IconPlus,
  IconSparkles,
  IconTrash,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { SellerWizardStepper } from '@/app/components/SellerWizardStepper';
import { type ListingPlanType, useListingDraftStore } from '@/stores/use-listing-draft-store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DEMO_GALLERY_IMAGES = [
  '/images/vehicles/demo/toyota-corolla-2021-b6.jpg',
  '/images/vehicles/demo/fc-2026-0151-polo-front.jpg',
  '/images/vehicles/demo/vw-polo-2023.jpg',
  '/images/vehicles/demo/chevrolet-onix-2022.jpg',
  '/images/vehicles/demo/fiat-strada-2023.jpg',
  '/images/vehicles/demo/honda-cg-160-2022.jpg',
];

export default function NovoAnuncioFotosPage() {
  const router = useRouter();
  const { draft, addImage, removeImage, setCoverImage, setPlan, toggleBoost, setStep } =
    useListingDraftStore();

  const [photoError, setPhotoError] = useState<string | null>(null);

  const maxPhotos = draft.plan === 'basic' ? 5 : 10;
  const currentPhotoCount = draft.images.length;

  const handleAddSamplePhotos = () => {
    setPhotoError(null);
    for (const img of DEMO_GALLERY_IMAGES) {
      if (draft.images.length >= maxPhotos) break;
      if (!draft.images.includes(img)) {
        addImage(img);
      }
    }
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (currentPhotoCount >= maxPhotos) {
      setPhotoError(
        `O limite de ${maxPhotos} fotos para o ${draft.plan === 'basic' ? 'Plano Básico' : 'Plano Estendido'} foi atingido.`,
      );
      return;
    }

    // In local web preview, assign demo vehicle image or create blob URL
    for (let i = 0; i < files.length; i++) {
      if (draft.images.length + i >= maxPhotos) {
        setPhotoError(`Limite de ${maxPhotos} fotos atingido.`);
        break;
      }
      const fakeUrl = DEMO_GALLERY_IMAGES[(draft.images.length + i) % DEMO_GALLERY_IMAGES.length];
      addImage(fakeUrl);
    }
  };

  const handlePlanChange = (newPlan: ListingPlanType) => {
    setPhotoError(null);
    setPlan(newPlan);
  };

  const handleContinue = () => {
    if (draft.images.length === 0) {
      setPhotoError('Adicione pelo menos 1 foto do veículo para continuar.');
      return;
    }
    setStep(4);
    router.push('/vendedor/anuncios/novo/revisao');
  };

  // Pricing calculations
  const planBasePrice = draft.plan === 'basic' ? 30 : 50;
  const boostPrice = draft.hasBoost ? 10 : 0;
  const totalPrice = planBasePrice + boostPrice;

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
            { label: 'Fotos e plano', active: true },
          ]}
        />

        {/* Wizard Stepper Progress (Etapa 3 de 4) */}
        <div className="mt-4">
          <SellerWizardStepper currentStep={3} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Photo Upload and Plan Selection */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Photos Section */}
            <div className="bg-white border border-[#e2e7ee] rounded-[16px] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-[#e2e7ee]">
                <div>
                  <span className="text-[12px] font-bold text-[#b91c1c] uppercase tracking-wider block mb-1">
                    Passo 3 de 4
                  </span>
                  <h1 className="text-[22px] sm:text-[26px] font-bold text-[#111827]">
                    Fotos do veículo
                  </h1>
                  <p className="text-[14px] text-[#4b5563] mt-1">
                    Anúncios com boas fotos têm até 3x mais contatos de compradores.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#334155]">
                    {currentPhotoCount} de {maxPhotos} fotos
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSamplePhotos}
                    disabled={currentPhotoCount >= maxPhotos}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] hover:bg-[#fee2e2] disabled:opacity-50 transition-colors"
                  >
                    <IconSparkles className="size-3.5" />+ Fotos Demo
                  </button>
                </div>
              </div>

              {photoError && (
                <div className="mb-6 p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center gap-3 text-[13px] text-[#b91c1c]">
                  <IconAlert className="size-5 shrink-0" />
                  <span>{photoError}</span>
                </div>
              )}

              {/* Photo Upload Dropzone */}
              <label
                htmlFor="photo-upload-input"
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[16px] text-center cursor-pointer transition-colors ${
                  currentPhotoCount >= maxPhotos
                    ? 'border-[#cbd5e1] bg-[#f8fafc] cursor-not-allowed'
                    : 'border-[#b91c1c]/40 bg-[#fff5f5]/40 hover:bg-[#fff5f5] hover:border-[#b91c1c]'
                }`}
              >
                <div className="size-14 rounded-full bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center mb-3">
                  <IconCamera className="size-7" />
                </div>
                <span className="text-[15px] font-bold text-[#111827]">
                  {currentPhotoCount >= maxPhotos
                    ? 'Limite de fotos atingido'
                    : 'Clique ou arraste fotos aqui'}
                </span>
                <span className="text-xs text-[#64748b] mt-1">
                  PNG, JPG ou WEBP até 10MB cada · Formato horizontal recomendado
                </span>
                <input
                  id="photo-upload-input"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  disabled={currentPhotoCount >= maxPhotos}
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>

              {/* Thumbnails Grid */}
              {draft.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[14px] font-bold text-[#111827] mb-3">
                    Fotos adicionadas ({draft.images.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {draft.images.map((imgUrl: string, index: number) => {
                      const isCover = (draft.coverImageIndex ?? 0) === index;
                      return (
                        <div
                          key={imgUrl}
                          className={`group relative rounded-xl overflow-hidden border-2 aspect-[4/3] bg-[#f1f5f9] shadow-sm ${
                            isCover ? 'border-[#b91c1c] ring-2 ring-[#fee2e2]' : 'border-[#e2e8f0]'
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Foto do veículo ${index + 1}`}
                            fill
                            className="object-cover"
                          />

                          {/* Cover Badge */}
                          {isCover && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#b91c1c] text-white text-[10px] font-bold shadow">
                              Capa
                            </div>
                          )}

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="size-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow"
                                title="Remover foto"
                              >
                                <IconTrash className="size-4" />
                              </button>
                            </div>

                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => setCoverImage(index)}
                                className="w-full py-1 text-[11px] font-bold bg-white hover:bg-gray-100 text-[#111827] rounded shadow text-center"
                              >
                                Definir capa
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Plan Selection Section */}
            <div className="bg-white border border-[#e2e7ee] rounded-[16px] p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-[12px] font-bold text-[#b91c1c] uppercase tracking-wider block mb-1">
                  Planos de publicação
                </span>
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#111827]">
                  Escolha o plano de divulgação
                </h2>
                <p className="text-[14px] text-[#4b5563] mt-1">
                  Taxa única com prazo fixo e renovação manual. Sem renovação automática surpresa.
                </p>
              </div>

              {/* Plans Radio Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plano Básico */}
                <button
                  type="button"
                  onClick={() => handlePlanChange('basic')}
                  className={`text-left p-5 sm:p-6 rounded-[14px] border-2 transition-all flex flex-col justify-between ${
                    draft.plan === 'basic'
                      ? 'border-[#b91c1c] bg-[#fff5f5] ring-1 ring-[#b91c1c]'
                      : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#475569]">
                        Econômico
                      </span>
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center ${
                          draft.plan === 'basic'
                            ? 'border-[#b91c1c] bg-[#b91c1c] text-white'
                            : 'border-[#cbd5e1]'
                        }`}
                      >
                        {draft.plan === 'basic' && <IconCheck className="size-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#111827]">Plano Básico</h3>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-[28px] font-extrabold text-[#111827]">R$ 30,00</span>
                      <span className="text-xs text-[#64748b]">/ taxa única</span>
                    </div>

                    <ul className="space-y-2 text-[13px] text-[#334155] border-t border-[#e2e8f0] pt-3">
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>
                          <strong>30 dias</strong> de exibição ativa
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>
                          Até <strong>5 fotos</strong> no anúncio
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>Renovação manual sem pegadinhas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>Suporte padrão por e-mail</span>
                      </li>
                    </ul>
                  </div>
                </button>

                {/* Plano Estendido */}
                <button
                  type="button"
                  onClick={() => handlePlanChange('extended')}
                  className={`relative text-left p-5 sm:p-6 rounded-[14px] border-2 transition-all flex flex-col justify-between ${
                    draft.plan === 'extended'
                      ? 'border-[#b91c1c] bg-[#fff5f5] ring-1 ring-[#b91c1c]'
                      : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#16a34a] text-white text-[11px] font-bold shadow-sm">
                    Mais Vantajoso
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#dcfce7] text-[#166534]">
                        Melhor Custo-Benefício
                      </span>
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center ${
                          draft.plan === 'extended'
                            ? 'border-[#b91c1c] bg-[#b91c1c] text-white'
                            : 'border-[#cbd5e1]'
                        }`}
                      >
                        {draft.plan === 'extended' && <IconCheck className="size-3 stroke-[3]" />}
                      </div>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#111827]">Plano Estendido</h3>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-[28px] font-extrabold text-[#111827]">R$ 50,00</span>
                      <span className="text-xs text-[#64748b]">/ taxa única</span>
                    </div>

                    <ul className="space-y-2 text-[13px] text-[#334155] border-t border-[#e2e8f0] pt-3">
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>
                          <strong>60 dias</strong> de exibição ativa
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>
                          Até <strong>10 fotos</strong> no anúncio
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>Renovação manual sem pegadinhas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="size-4 text-[#16a34a] shrink-0" />
                        <span>Suporte prioritário</span>
                      </li>
                    </ul>
                  </div>
                </button>
              </div>

              {/* 3. Addon Destaque (Boost) */}
              <div className="mt-6 p-4 rounded-xl border border-[#fed7aa] bg-[#fffaf5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-[#ea580c] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <IconSparkles className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-bold text-[#9a3412]">
                        Adicionar Selo Destaque (+R$ 10,00)
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fed7aa] text-[#9a3412]">
                        7 dias
                      </span>
                    </div>
                    <p className="text-[12px] text-[#7c2d12] mt-0.5">
                      Seu anúncio ganha destaque visual e posicionamento prioritário no topo das
                      buscas durante os primeiros 7 dias.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleBoost}
                  className={`self-start sm:self-center px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                    draft.hasBoost
                      ? 'bg-[#ea580c] text-white hover:bg-[#c2410c]'
                      : 'bg-white border border-[#fed7aa] text-[#9a3412] hover:bg-[#ffedd5]'
                  }`}
                >
                  {draft.hasBoost ? '✓ Destaque Ativo' : '+ Adicionar Destaque'}
                </button>
              </div>

              {/* Summary Bar */}
              <div className="mt-6 pt-6 border-t border-[#e2e7ee] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#64748b]">Total da publicação:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[24px] font-black text-[#111827]">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-[#64748b]">
                      ({draft.plan === 'basic' ? 'Plano Básico R$ 30' : 'Plano Estendido R$ 50'}
                      {draft.hasBoost ? ' + Destaque R$ 10' : ''})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/vendedor/anuncios/novo/detalhes"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-center text-[14px] font-semibold text-[#4b5563] hover:text-[#111827] hover:bg-[#f1f5f9] rounded-lg transition-colors"
                  >
                    <IconArrowLeft className="size-4" />
                    <span>Voltar</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[15px] font-semibold transition-all shadow-sm hover:shadow"
                  >
                    <span>Avançar para Revisão</span>
                    <IconArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tips */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px] mb-3">
                <IconInfo className="size-5 text-[#b91c1c]" />
                <h3>Dicas para fotos que vendem</h3>
              </div>

              <ul className="space-y-3 text-[13px] text-[#4b5563] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Boa iluminação:</strong> fotografe de dia em
                    local claro e sem sombras excessivas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Ângulos recomendados:</strong> frente 3/4,
                    traseira 3/4, painel ligado, bancos e motor.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Sem custos ocultos:</strong> você só paga
                    após o anúncio ser aprovado pela moderação.
                  </span>
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
