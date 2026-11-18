'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconArrowRight,
  IconCar,
  IconCheck,
  IconInfo,
  IconMotorcycle,
  IconSparkles,
  IconTruck,
} from '@/app/components/SellerIcons';
import { DealerWizardStepper } from '@/app/components/dealership/DealerWizardStepper';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import {
  type DealerVehicleCategory,
  useDealerInventoryStore,
} from '@/stores/use-dealer-inventory-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface CategoryOption {
  id: DealerVehicleCategory;
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
    popularExamples: 'Ex: Corolla, Civic, Onix, Creta, Compass, Hilux',
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

export default function DealerNovoAnuncioCategoriaPage() {
  const router = useRouter();
  const { draft, setDraftCategory, setDraftStep, loadDemoDraft } = useDealerInventoryStore();

  const [selectedCategory, setSelectedCategory] = useState<DealerVehicleCategory>(
    draft.category || 'cars',
  );

  const handleSelect = (category: DealerVehicleCategory) => {
    setSelectedCategory(category);
    setDraftCategory(category);
  };

  const handleContinue = () => {
    setDraftCategory(selectedCategory);
    setDraftStep(2);
    router.push('/concessionaria/anuncios/novo/detalhes');
  };

  const handleLoadDemo = () => {
    loadDemoDraft();
    router.push('/concessionaria/anuncios/novo/detalhes');
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
          <span className="font-semibold text-[#17243f]">Novo Anúncio</span>
        </div>

        {/* Wizard Stepper */}
        <DealerWizardStepper currentStep={1} />

        {/* Heading Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17243f] tracking-tight">
              Escolha a categoria do veículo
            </h1>
            <p className="text-[14px] text-[#697a95] mt-1">
              Selecione o tipo de veículo para carregar os atributos técnicos e opcionais adequados.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadDemo}
            data-testid="btn-dealer-load-demo"
            className="self-start sm:self-auto text-[12px] font-semibold text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] px-3.5 py-2 rounded-[8px] flex items-center gap-1.5 transition-colors"
          >
            <IconSparkles className="size-3.5" />
            <span>Preencher demonstração</span>
          </button>
        </div>

        {/* Category Cards (Figma WEB-023 / 625:302) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                data-testid={`category-card-${cat.id}`}
                className={`p-6 rounded-[14px] border-2 text-left transition-all cursor-pointer relative bg-white flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#b91c1c] shadow-md ring-2 ring-[#fee2e2]'
                    : 'border-[#dee6f1] hover:border-[#cbd5e1] shadow-2xs'
                }`}
              >
                {/* Selection Indicator Check */}
                {isSelected && (
                  <div className="absolute top-4 right-4 size-6 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shadow-xs">
                    <IconCheck className="size-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      isSelected ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#f1f5f9] text-[#64748b]'
                    }`}
                  >
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-[17px] font-bold text-[#17243f]">{cat.title}</h3>
                  <p className="text-[13px] text-[#697a95] mt-1.5 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#f1f5f9] w-full">
                  <span className="text-[11px] font-medium text-[#8a99ad] block">
                    {cat.popularExamples}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Informational Callout */}
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[12px] p-4 mb-8 flex items-start gap-3">
          <IconInfo className="size-5 text-[#2563eb] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#1e40af] leading-relaxed">
            <p className="font-semibold">Cadastro de frota da concessionária</p>
            <p className="mt-0.5 text-[#3b82f6]">
              Os veículos cadastrados pela concessionária são publicados sob o CNPJ e a razão social
              homologados, mantendo conformidade com as diretrizes do ecossistema Feira de Carros.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#dee6f1]">
          <Link
            href="/concessionaria/anuncios"
            className="text-[13px] font-semibold text-[#697a95] hover:text-[#17243f] transition-colors"
          >
            Voltar para o estoque
          </Link>

          <button
            type="button"
            onClick={handleContinue}
            data-testid="btn-continue-step2"
            className="px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Continuar para detalhes</span>
            <IconArrowRight className="size-4" />
          </button>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
