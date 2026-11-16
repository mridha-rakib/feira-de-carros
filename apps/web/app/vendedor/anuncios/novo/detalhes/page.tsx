'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconInfo,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { SellerWizardStepper } from '@/app/components/SellerWizardStepper';
import { useListingDraftStore } from '@/stores/use-listing-draft-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
const COLOR_OPTIONS = ['Prata', 'Preto', 'Branco', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Outra'];
const PLATE_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
  'Chave presencial / Start-Stop',
  'Teto solar',
];

export default function NovoAnuncioDetalhesPage() {
  const router = useRouter();
  const { draft, updateDraft, setStep, toggleFeature, loadDemoDraft } = useListingDraftStore();

  const [formData, setFormData] = useState({
    make: draft.make || '',
    model: draft.model || '',
    version: draft.version || '',
    yearFabrication: draft.yearFabrication || '2021',
    yearModel: draft.yearModel || '2022',
    mileageKm: draft.mileageKm || '',
    fuelType: draft.fuelType || 'Flex',
    transmission: draft.transmission || 'Automático',
    color: draft.color || 'Prata',
    licensePlateLastDigit: draft.licensePlateLastDigit || '',
    city: draft.city || 'São Paulo',
    state: draft.state || 'SP',
    price: draft.price || '',
    description: draft.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      make: draft.make || '',
      model: draft.model || '',
      version: draft.version || '',
      yearFabrication: draft.yearFabrication || '2021',
      yearModel: draft.yearModel || '2022',
      mileageKm: draft.mileageKm || '',
      fuelType: draft.fuelType || 'Flex',
      transmission: draft.transmission || 'Automático',
      color: draft.color || 'Prata',
      licensePlateLastDigit: draft.licensePlateLastDigit || '',
      city: draft.city || 'São Paulo',
      state: draft.state || 'SP',
      price: draft.price || '',
      description: draft.description || '',
    });
  }, [
    draft.make,
    draft.model,
    draft.version,
    draft.yearFabrication,
    draft.yearModel,
    draft.mileageKm,
    draft.fuelType,
    draft.transmission,
    draft.color,
    draft.licensePlateLastDigit,
    draft.city,
    draft.state,
    draft.price,
    draft.description,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.make.trim()) {
      newErrors.make = 'Informe a marca do veículo';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Informe o modelo do veículo';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Informe um preço válido maior que zero';
    }
    if (!formData.mileageKm && formData.mileageKm !== 0) {
      newErrors.mileageKm = 'Informe a quilometragem atual';
    }
    if (!formData.licensePlateLastDigit) {
      newErrors.licensePlateLastDigit = 'Selecione o dígito final da placa';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Informe a cidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateDraft({
      ...formData,
      price: Number(formData.price),
      mileageKm: Number(formData.mileageKm),
      yearFabrication: Number(formData.yearFabrication),
      yearModel: Number(formData.yearModel),
    });
    setStep(3);
    router.push('/vendedor/anuncios/novo/fotos');
  };

  const handleApplyDemo = () => {
    loadDemoDraft();
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
            { label: 'Ficha técnica', active: true },
          ]}
        />

        {/* Wizard Stepper Progress (Etapa 2 de 4) */}
        <div className="mt-4">
          <SellerWizardStepper currentStep={2} />
        </div>

        {/* Main Content Form */}
        <form
          onSubmit={handleContinue}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >
          <div className="lg:col-span-8 bg-white border border-[#e2e7ee] rounded-[16px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-[#e2e7ee]">
              <div>
                <span className="text-[12px] font-bold text-[#b91c1c] uppercase tracking-wider block mb-1">
                  Passo 2 de 4
                </span>
                <h1 className="text-[22px] sm:text-[26px] font-bold text-[#111827]">
                  Dados e características do veículo
                </h1>
                <p className="text-[14px] text-[#4b5563] mt-1">
                  Preencha as informações técnicas para que os compradores conheçam seu veículo em
                  detalhes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplyDemo}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] hover:bg-[#fee2e2] transition-colors"
                title="Preencher ficha técnica com exemplo Corolla"
              >
                <IconSparkles className="size-3.5" />
                Preencher Demo
              </button>
            </div>

            {/* Form Sections */}
            <div className="space-y-6">
              {/* Row 1: Marca & Modelo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="make-input"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Marca <span className="text-[#b91c1c]">*</span>
                  </label>
                  <input
                    id="make-input"
                    list="makes-list"
                    name="make"
                    type="text"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="Ex: Toyota, Honda, VW..."
                    className={`w-full h-[46px] px-3.5 rounded-[10px] border text-[14px] transition-colors outline-none focus:ring-2 focus:ring-[#b91c1c]/20 ${
                      errors.make
                        ? 'border-[#ef4444] bg-[#fef2f2]'
                        : 'border-[#cbd5e1] hover:border-[#94a3b8] focus:border-[#b91c1c]'
                    }`}
                  />
                  <datalist id="makes-list">
                    {POPULAR_MAKES.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                  {errors.make && (
                    <p className="text-[12px] text-[#ef4444] mt-1 font-medium">{errors.make}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="model-input"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Modelo <span className="text-[#b91c1c]">*</span>
                  </label>
                  <input
                    id="model-input"
                    name="model"
                    type="text"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ex: Corolla, Onix, Civic..."
                    className={`w-full h-[46px] px-3.5 rounded-[10px] border text-[14px] transition-colors outline-none focus:ring-2 focus:ring-[#b91c1c]/20 ${
                      errors.model
                        ? 'border-[#ef4444] bg-[#fef2f2]'
                        : 'border-[#cbd5e1] hover:border-[#94a3b8] focus:border-[#b91c1c]'
                    }`}
                  />
                  {errors.model && (
                    <p className="text-[12px] text-[#ef4444] mt-1 font-medium">{errors.model}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Versão */}
              <div>
                <label
                  htmlFor="version-input"
                  className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                >
                  Versão e Motorização
                </label>
                <input
                  id="version-input"
                  name="version"
                  type="text"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="Ex: 2.0 XEi 16V Flex Automático 4P"
                  className="w-full h-[46px] px-3.5 rounded-[10px] border border-[#cbd5e1] text-[14px] hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none focus:ring-2 focus:ring-[#b91c1c]/20"
                />
              </div>

              {/* Row 3: Ano Fabricação/Modelo & Quilometragem */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="year-fab-input"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Ano Fabricação
                  </label>
                  <input
                    id="year-fab-input"
                    name="yearFabrication"
                    type="number"
                    min="1960"
                    max="2027"
                    value={formData.yearFabrication}
                    onChange={handleChange}
                    className="w-full h-[46px] px-3.5 rounded-[10px] border border-[#cbd5e1] text-[14px] hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none focus:ring-2 focus:ring-[#b91c1c]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="year-model-input"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Ano Modelo
                  </label>
                  <input
                    id="year-model-input"
                    name="yearModel"
                    type="number"
                    min="1960"
                    max="2027"
                    value={formData.yearModel}
                    onChange={handleChange}
                    className="w-full h-[46px] px-3.5 rounded-[10px] border border-[#cbd5e1] text-[14px] hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none focus:ring-2 focus:ring-[#b91c1c]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mileage-input"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Quilometragem (km) <span className="text-[#b91c1c]">*</span>
                  </label>
                  <input
                    id="mileage-input"
                    name="mileageKm"
                    type="number"
                    min="0"
                    value={formData.mileageKm}
                    onChange={handleChange}
                    placeholder="Ex: 45000"
                    className={`w-full h-[46px] px-3.5 rounded-[10px] border text-[14px] transition-colors outline-none focus:ring-2 focus:ring-[#b91c1c]/20 ${
                      errors.mileageKm
                        ? 'border-[#ef4444] bg-[#fef2f2]'
                        : 'border-[#cbd5e1] hover:border-[#94a3b8] focus:border-[#b91c1c]'
                    }`}
                  />
                  {errors.mileageKm && (
                    <p className="text-[12px] text-[#ef4444] mt-1 font-medium">
                      {errors.mileageKm}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Combustível, Câmbio, Cor, Placa */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="fuel-type-select"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Combustível
                  </label>
                  <select
                    id="fuel-type-select"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full h-[46px] px-3 rounded-[10px] border border-[#cbd5e1] text-[14px] bg-white hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="transmission-select"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Câmbio
                  </label>
                  <select
                    id="transmission-select"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full h-[46px] px-3 rounded-[10px] border border-[#cbd5e1] text-[14px] bg-white hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none"
                  >
                    {TRANSMISSION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="color-select"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Cor
                  </label>
                  <select
                    id="color-select"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full h-[46px] px-3 rounded-[10px] border border-[#cbd5e1] text-[14px] bg-white hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="license-plate-select"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Final Placa <span className="text-[#b91c1c]">*</span>
                  </label>
                  <select
                    id="license-plate-select"
                    name="licensePlateLastDigit"
                    value={formData.licensePlateLastDigit}
                    onChange={handleChange}
                    className={`w-full h-[46px] px-3 rounded-[10px] border text-[14px] bg-white outline-none ${
                      errors.licensePlateLastDigit
                        ? 'border-[#ef4444] bg-[#fef2f2]'
                        : 'border-[#cbd5e1] hover:border-[#94a3b8] focus:border-[#b91c1c]'
                    }`}
                  >
                    <option value="">Selecione</option>
                    {PLATE_DIGITS.map((d) => (
                      <option key={d} value={d}>
                        Final {d}
                      </option>
                    ))}
                  </select>
                  {errors.licensePlateLastDigit && (
                    <p className="text-[12px] text-[#ef4444] mt-1 font-medium">
                      {errors.licensePlateLastDigit}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 5: Preço de Venda & Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-1">
                  <label
                    htmlFor="price-input"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Preço de Venda (R$) <span className="text-[#b91c1c]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748b]">
                      R$
                    </span>
                    <input
                      id="price-input"
                      name="price"
                      type="number"
                      min="1000"
                      step="100"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="125000"
                      className={`w-full h-[46px] pl-10 pr-3.5 rounded-[10px] border text-[15px] font-bold text-[#111827] outline-none ${
                        errors.price
                          ? 'border-[#ef4444] bg-[#fef2f2]'
                          : 'border-[#cbd5e1] hover:border-[#94a3b8] focus:border-[#b91c1c]'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-[12px] text-[#ef4444] mt-1 font-medium">{errors.price}</p>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="city-input"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Cidade <span className="text-[#b91c1c]">*</span>
                  </label>
                  <input
                    id="city-input"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ex: São Paulo"
                    className={`w-full h-[46px] px-3.5 rounded-[10px] border text-[14px] outline-none ${
                      errors.city
                        ? 'border-[#ef4444] bg-[#fef2f2]'
                        : 'border-[#cbd5e1] hover:border-[#94a3b8] focus:border-[#b91c1c]'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[12px] text-[#ef4444] mt-1 font-medium">{errors.city}</p>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="state-select"
                    className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                  >
                    Estado (UF)
                  </label>
                  <select
                    id="state-select"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full h-[46px] px-3 rounded-[10px] border border-[#cbd5e1] text-[14px] bg-white hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none"
                  >
                    {[
                      'SP',
                      'RJ',
                      'MG',
                      'PR',
                      'RS',
                      'SC',
                      'BA',
                      'PE',
                      'DF',
                      'GO',
                      'ES',
                      'CE',
                      'PA',
                    ].map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Opcionais e Recursos (Checklist Pills) */}
              <div className="pt-2">
                <span className="block text-[13px] font-bold text-[#1e293b] mb-2">
                  Itens e Opcionais do Veículo
                </span>
                <p className="text-[12px] text-[#64748b] mb-3">
                  Selecione os equipamentos presentes para valorizar seu anúncio.
                </p>

                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_FEATURES.map((feature) => {
                    const isChecked = draft.features?.includes(feature);
                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          isChecked
                            ? 'bg-[#fee2e2] text-[#991b1b] border-[#f87171] ring-1 ring-[#f87171]'
                            : 'bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]'
                        }`}
                      >
                        {isChecked && <IconCheck className="size-3.5 stroke-[3]" />}
                        <span>{feature}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Descrição / Observações */}
              <div className="pt-2">
                <label
                  htmlFor="desc-textarea"
                  className="block text-[13px] font-bold text-[#1e293b] mb-1.5"
                >
                  Descrição e Observações
                </label>
                <textarea
                  id="desc-textarea"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva detalhes como estado de conservação, histórico de revisões, garantias, opcionais diferenciados..."
                  className="w-full p-3.5 rounded-[10px] border border-[#cbd5e1] text-[14px] hover:border-[#94a3b8] focus:border-[#b91c1c] outline-none focus:ring-2 focus:ring-[#b91c1c]/20"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-[#e2e7ee] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <Link
                href="/vendedor/anuncios/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-center text-[14px] font-semibold text-[#4b5563] hover:text-[#111827] hover:bg-[#f1f5f9] rounded-lg transition-colors"
              >
                <IconArrowLeft className="size-4" />
                <span>Voltar para Categoria</span>
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[15px] font-semibold transition-all shadow-sm hover:shadow"
              >
                <span>Avançar para Fotos & Plano</span>
                <IconArrowRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Tips */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[16px] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px] mb-3">
                <IconInfo className="size-5 text-[#b91c1c]" />
                <h3>Por que informar todos os dados?</h3>
              </div>

              <ul className="space-y-3 text-[13px] text-[#4b5563] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Quilometragem real:</strong> compradores dão
                    preferência a anúncios com histórico e quilometragem precisos.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Preço competitivo:</strong> verifique a média
                    de mercado para o seu ano/versão para acelerar a venda.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="size-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                  <span>
                    <strong className="text-[#111827]">Itens de série:</strong> marcar os opcionais
                    aumenta a relevância nas buscas detalhadas.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </main>

      <SellerMobileBottomNav activeTab="criar" userRole="seller" />
    </div>
  );
}
