'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconArrowRight,
  IconCar,
  IconCheck,
  IconInfo,
  IconMotorcycle,
  IconSparkles,
  IconTruck,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { SellerWizardStepper } from '@/app/components/SellerWizardStepper';
import { type VehicleCategory, useListingDraftStore } from '@/stores/use-listing-draft-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CategoryOption {
  id: VehicleCategory;
  title: string;
  subtitle: string;
  icon: typeof IconCar;
  popularExamples: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'cars',
    title: 'Carros e utilitários',
    subtitle: 'Sedans, hatchbacks, SUVs, picapes, peruas e vans leves',
    icon: IconCar,
    popularExamples: 'Ex: Corolla, Onix, HB20, Compass, Hilux',
  },
  {
    id: 'motorcycles',
    title: 'Motocicletas',
    subtitle: 'Motos urbanas, scooters, esportivas, custom, trail e touring',
    icon: IconMotorcycle,
    popularExamples: 'Ex: Honda CG 160, Yamaha Fazer, BMW GS, PCX',
  },
  {
    id: 'trucks',
    title: 'Caminhões e pesados',
    subtitle: 'Caminhões leves, pesados, carretas, ônibus e vans comerciais',
    icon: IconTruck,
    popularExamples: 'Ex: Scania R450, Volvo FH, Mercedes Actros, VW Constellation',
  },
];

export default function NovoAnuncioCategoriaPage() {
  const router = useRouter();
  const { draft, setCategory, setStep, loadDemoDraft } = useListingDraftStore();
  const [selected, setSelected] = useState<VehicleCategory>(draft.category || 'cars');

  useEffect(() => {
    if (draft.category) {
      setSelected(draft.category);
    }
  }, [draft.category]);

  const handleSelect = (category: VehicleCategory) => {
    setSelected(category);
    setCategory(category);
  };

  const handleContinue = () => {
    setCategory(selected);
    setStep(2);
    router.push('/vendedor/anuncios/novo/detalhes');
  };

  const handleUseDemo = () => {
    loadDemoDraft();
    setSelected('cars');
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
            { label: 'Criar anúncio', active: true },
          ]}
        />

        {/* Wizard Stepper Progress (Etapa 1 de 4) */}
        <div className="mt-4">
          <SellerWizardStepper currentStep={1} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Category Selection Form */}
          <div className="lg:col-span-8 bg-white border border-[#e2e7ee] rounded-[16px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[12px] font-bold text-[#b91c1c] uppercase tracking-wider block mb-1">
                  Passo 1 de 4
                </span>
                <h1 className="text-[22px] sm:text-[26px] font-bold text-[#111827]">
                  Escolha a categoria do veículo
                </h1>
                <p className="text-[14px] text-[#4b5563] mt-1">
                  Selecione o tipo de veículo para que possamos carregar a ficha técnica e atributos
                  adequados.
                </p>
              </div>

              {/* Safe Demo Preset Trigger for Visual QA */}
              <button
                type="button"
                onClick={handleUseDemo}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] hover:bg-[#fee2e2] transition-colors"
                title="Preenche o assistente com dados de demonstração para testes"
              >
                <IconSparkles className="size-3.5" />
                Preencher Demo QA
              </button>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const isSelected = selected === cat.id;
                const IconComponent = cat.icon;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full text-left p-5 sm:p-6 rounded-[14px] border-2 transition-all flex items-start gap-4 sm:gap-5 ${
                      isSelected
                        ? 'border-[#b91c1c] bg-[#fff5f5] shadow-sm ring-1 ring-[#b91c1c]'
                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`size-12 sm:size-14 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#b91c1c] text-white' : 'bg-[#f1f5f9] text-[#64748b]'
                      }`}
                    >
                      <IconComponent className="size-6 sm:size-7" />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[16px] sm:text-[18px] font-bold text-[#111827]">
                          {cat.title}
                        </h2>
                        {/* Radio Check Circle */}
                        <div
                          className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                            isSelected
                              ? 'border-[#b91c1c] bg-[#b91c1c] text-white'
                              : 'border-[#cbd5e1] bg-white'
                          }`}
                        >
                          {isSelected && <IconCheck className="size-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[13px] sm:text-[14px] text-[#4b5563] mt-1 leading-normal">
                        {cat.subtitle}
                      </p>

                      <span className="inline-block text-[12px] text-[#64748b] mt-2 font-medium">
                        {cat.popularExamples}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-[#e2e7ee] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <Link
                href="/vendedor/anuncios"
                className="w-full sm:w-auto px-5 py-2.5 text-center text-[14px] font-semibold text-[#4b5563] hover:text-[#111827] hover:bg-[#f1f5f9] rounded-lg transition-colors"
              >
                Voltar para meus anúncios
              </Link>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[15px] font-semibold transition-all shadow-sm hover:shadow"
              >
                <span>Continuar para Detalhes</span>
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Tips & Guidelines (Desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px] mb-3">
                <IconInfo className="size-5 text-[#b91c1c]" />
                <h3>Dicas para um anúncio de sucesso</h3>
              </div>

              <ul className="space-y-3 text-[13px] text-[#4b5563] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Categoria precisa:</strong> escolha a
                    categoria exata para que compradores encontrem seu anúncio nos filtros de busca.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Ficha técnica:</strong> no próximo passo você
                    informará ano, modelo, versão e quilometragem.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Fotos de qualidade:</strong> prepare fotos
                    nítidas do exterior e interior para aumentar suas chances de venda.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[16px] p-5">
              <h4 className="text-[13px] font-bold text-[#166534] mb-1">
                Transparência Feira de Carros
              </h4>
              <p className="text-[12px] text-[#15803d] leading-relaxed">
                Todo anúncio passa por moderação antes de ser publicado. Nossos planos contam com
                taxa única de publicação sem comissões sobre a venda.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="criar" userRole="seller" />
    </div>
  );
}
