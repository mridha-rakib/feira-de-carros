'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconInfo,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { DealerWizardStepper } from '@/app/components/dealership/DealerWizardStepper';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

const POPULAR_MAKES = [
  'Toyota',
  'Volkswagen',
  'Chevrolet',
  'Fiat',
  'Hyundai',
  'Honda',
  'Jeep',
  'Renault',
  'Nissan',
  'Ford',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volvo',
  'Chery',
  'BYD',
  'GWM',
  'Yamaha',
  'Scania',
];

const FUEL_TYPES = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Híbrido', 'Elétrico'];
const TRANSMISSION_TYPES = ['Automático', 'Manual', 'CVT', 'Automatizado'];
const COLOR_OPTIONS = ['Prata', 'Preto', 'Branco', 'Cinza', 'Vermelho', 'Azul', 'Outra'];

const AVAILABLE_FEATURES = [
  'Ar-condicionado',
  'Direção elétrica',
  'Vidros elétricos',
  'Travas elétricas',
  'Bancos de couro',
  'Central multimídia',
  'Câmera de ré',
  'Sensor de estacionamento',
  'Airbags frontais e laterais',
  'Freios ABS',
  'Rodas de liga leve',
  'Controle de estabilidade (ESP)',
  'Piloto automático',
  'Faróis de neblina / LED',
];

export default function DealerNovoAnuncioDetalhesPage() {
  const router = useRouter();
  const { draft, updateDraft, setDraftStep, toggleDraftFeature, loadDemoDraft } =
    useDealerInventoryStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!draft.make?.trim()) errs.make = 'Selecione ou informe a marca do veículo.';
    if (!draft.model?.trim()) errs.model = 'Informe o modelo do veículo.';
    if (!draft.version?.trim()) errs.version = 'Informe a versão e motorização.';
    if (!draft.yearFabrication) errs.yearFabrication = 'Informe o ano de fabricação.';
    if (!draft.yearModel) errs.yearModel = 'Informe o ano do modelo.';
    if (draft.mileageKm === '' || draft.mileageKm === undefined) {
      errs.mileageKm = 'Informe a quilometragem atual.';
    }
    if (!draft.licensePlate?.trim()) {
      errs.licensePlate = 'Informe a placa do veículo para conferência.';
    }
    if (!draft.price || Number(draft.price) <= 0) {
      errs.price = 'Informe um preço de venda válido.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setDraftStep(3);
    router.push('/concessionaria/anuncios/novo/fotos');
  };

  const handleLoadDemo = () => {
    loadDemoDraft();
    setErrors({});
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
          <span className="font-semibold text-[#17243f]">Detalhes</span>
        </div>

        {/* Wizard Stepper */}
        <DealerWizardStepper currentStep={2} />

        {/* Heading Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#17243f] tracking-tight">
              Dados e características do veículo
            </h1>
            <p className="text-[14px] text-[#697a95] mt-1">
              Preencha os atributos técnicos, opcionais e valor anunciado do veículo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadDemo}
            data-testid="btn-dealer-load-demo-step2"
            className="self-start sm:self-auto text-[12px] font-semibold text-[#b91c1c] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] px-3.5 py-2 rounded-[8px] flex items-center gap-1.5 transition-colors"
          >
            <IconSparkles className="size-3.5" />
            <span>Preencher demonstração</span>
          </button>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Card 1: Informações Principais */}
          <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
            <h2 className="text-[17px] font-bold text-[#17243f] mb-4 pb-2 border-b border-[#f1f5f9]">
              Identificação do Veículo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Marca */}
              <div>
                <label
                  htmlFor="dealer-make"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Marca <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  id="dealer-make"
                  list="popular-makes"
                  value={draft.make || ''}
                  onChange={(e) => updateDraft({ make: e.target.value })}
                  placeholder="Ex: Toyota, Honda, VW..."
                  data-testid="input-dealer-make"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
                <datalist id="popular-makes">
                  {POPULAR_MAKES.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
                {errors.make && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.make}</span>
                  </p>
                )}
              </div>

              {/* Modelo */}
              <div>
                <label
                  htmlFor="dealer-model"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Modelo <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  id="dealer-model"
                  type="text"
                  value={draft.model || ''}
                  onChange={(e) => updateDraft({ model: e.target.value })}
                  placeholder="Ex: Corolla, Civic, Onix..."
                  data-testid="input-dealer-model"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
                {errors.model && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.model}</span>
                  </p>
                )}
              </div>

              {/* Versão */}
              <div>
                <label
                  htmlFor="dealer-version"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Versão e Motorização <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  id="dealer-version"
                  type="text"
                  value={draft.version || ''}
                  onChange={(e) => updateDraft({ version: e.target.value })}
                  placeholder="Ex: 2.0 EXL 16V Flex Automático"
                  data-testid="input-dealer-version"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
                {errors.version && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.version}</span>
                  </p>
                )}
              </div>

              {/* Ano Fab */}
              <div>
                <label
                  htmlFor="dealer-year-fab"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Ano de Fabricação <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  id="dealer-year-fab"
                  type="number"
                  min={1970}
                  max={2030}
                  value={draft.yearFabrication || ''}
                  onChange={(e) => updateDraft({ yearFabrication: e.target.value })}
                  placeholder="Ex: 2022"
                  data-testid="input-dealer-year-fab"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
                {errors.yearFabrication && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.yearFabrication}</span>
                  </p>
                )}
              </div>

              {/* Ano Modelo */}
              <div>
                <label
                  htmlFor="dealer-year-model"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Ano do Modelo <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  id="dealer-year-model"
                  type="number"
                  min={1970}
                  max={2030}
                  value={draft.yearModel || ''}
                  onChange={(e) => updateDraft({ yearModel: e.target.value })}
                  placeholder="Ex: 2023"
                  data-testid="input-dealer-year-model"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
                {errors.yearModel && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.yearModel}</span>
                  </p>
                )}
              </div>

              {/* Quilometragem */}
              <div>
                <label
                  htmlFor="dealer-mileage"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Quilometragem (km) <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  id="dealer-mileage"
                  type="number"
                  min={0}
                  value={draft.mileageKm !== undefined ? draft.mileageKm : ''}
                  onChange={(e) => updateDraft({ mileageKm: e.target.value })}
                  placeholder="Ex: 28500"
                  data-testid="input-dealer-mileage"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
                {errors.mileageKm && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.mileageKm}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Especificações Técnicas & Preço */}
          <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
            <h2 className="text-[17px] font-bold text-[#17243f] mb-4 pb-2 border-b border-[#f1f5f9]">
              Especificações & Comercial
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Combustível */}
              <div>
                <label
                  htmlFor="dealer-fuel"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Combustível
                </label>
                <select
                  id="dealer-fuel"
                  value={draft.fuelType || 'Flex'}
                  onChange={(e) => updateDraft({ fuelType: e.target.value })}
                  data-testid="select-dealer-fuel"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] font-medium focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Câmbio */}
              <div>
                <label
                  htmlFor="dealer-trans"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Câmbio
                </label>
                <select
                  id="dealer-trans"
                  value={draft.transmission || 'Automático'}
                  onChange={(e) => updateDraft({ transmission: e.target.value })}
                  data-testid="select-dealer-transmission"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] font-medium focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                >
                  {TRANSMISSION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cor */}
              <div>
                <label
                  htmlFor="dealer-color"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Cor Predominante
                </label>
                <select
                  id="dealer-color"
                  value={draft.color || 'Prata'}
                  onChange={(e) => updateDraft({ color: e.target.value })}
                  data-testid="select-dealer-color"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] font-medium focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Placa */}
              <div>
                <label
                  htmlFor="dealer-plate"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Placa do Veículo <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  id="dealer-plate"
                  type="text"
                  maxLength={7}
                  value={draft.licensePlate || ''}
                  onChange={(e) => updateDraft({ licensePlate: e.target.value.toUpperCase() })}
                  placeholder="Ex: BRA2E19"
                  data-testid="input-dealer-plate"
                  className="w-full h-[44px] px-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] font-mono uppercase text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
                {errors.licensePlate && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.licensePlate}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Preço de Venda */}
            <div className="mt-4 pt-4 border-t border-[#f1f5f9]">
              <div className="max-w-[320px]">
                <label
                  htmlFor="dealer-price"
                  className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
                >
                  Preço de Venda (R$) <span className="text-[#b91c1c]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#697a95]">
                    R$
                  </span>
                  <input
                    id="dealer-price"
                    type="number"
                    min={1000}
                    value={draft.price !== undefined ? draft.price : ''}
                    onChange={(e) => updateDraft({ price: e.target.value })}
                    placeholder="124900"
                    data-testid="input-dealer-price"
                    className="w-full h-[46px] pl-10 pr-4 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[16px] font-bold text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                  />
                </div>
                {errors.price && (
                  <p className="text-[11px] text-[#b91c1c] mt-1 flex items-center gap-1">
                    <IconAlert className="size-3" />
                    <span>{errors.price}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Opcionais e Descrição */}
          <div className="bg-white border border-[#dee6f1] rounded-[14px] p-6 shadow-xs">
            <h2 className="text-[17px] font-bold text-[#17243f] mb-4 pb-2 border-b border-[#f1f5f9]">
              Itens de Série e Opcionais
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {AVAILABLE_FEATURES.map((feature) => {
                const isChecked = (draft.features || []).includes(feature);
                return (
                  <label
                    key={feature}
                    className={`flex items-center gap-2.5 p-2.5 rounded-[8px] border text-[12px] font-medium cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#eff6ff] border-[#93c5fd] text-[#1e40af]'
                        : 'bg-[#f8fafc] border-[#dee6f1] text-[#475569] hover:bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDraftFeature(feature)}
                      className="size-4 text-[#b91c1c] rounded border-gray-300 focus:ring-[#b91c1c]"
                    />
                    <span>{feature}</span>
                  </label>
                );
              })}
            </div>

            {/* Descrição Adicional */}
            <div>
              <label
                htmlFor="dealer-description"
                className="block text-[13px] font-semibold text-[#17243f] mb-1.5"
              >
                Descrição do Veículo (Opcional)
              </label>
              <textarea
                id="dealer-description"
                rows={4}
                value={draft.description || ''}
                onChange={(e) => updateDraft({ description: e.target.value })}
                placeholder="Destaque as principais qualidades do veículo: estado de conservação, histórico de revisões, garantias e laudos de vistoria cautelar..."
                data-testid="textarea-dealer-description"
                className="w-full p-3.5 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#dee6f1]">
            <Link
              href="/concessionaria/anuncios/novo"
              className="px-4 py-2 text-[13px] font-semibold text-[#697a95] hover:text-[#17243f] transition-colors flex items-center gap-1.5"
            >
              <IconArrowLeft className="size-4" />
              <span>Voltar para categoria</span>
            </Link>

            <button
              type="submit"
              data-testid="btn-continue-step3"
              className="px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] rounded-[8px] flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Continuar para fotos</span>
              <IconArrowRight className="size-4" />
            </button>
          </div>
        </form>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
