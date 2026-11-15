'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { mockBrandModels } from '@/lib/adapters/mock-commercial-catalog-data';
import type { BrandModelRecord } from '@/lib/types/commercial-catalog-presentation';
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Filter,
  Layers,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { MobileSettingsRestrictedBanner } from '../components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '../components/SettingsHoldBanner';
import { SettingsSectionHeader } from '../components/SettingsSectionHeader';

export default function BrandsModelsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedBrand, setSelectedBrand] = React.useState<string>('all');
  const [selectedModelId, setSelectedModelId] = React.useState<string>('MOD-001');

  // Simulation states
  const [newBrand, setNewBrand] = React.useState('');
  const [newModel, setNewModel] = React.useState('');
  const [simulationState, setSimulationState] = React.useState<
    'NONE' | 'ADD_PREVIEW' | 'DELETE_BLOCKED'
  >('NONE');

  const brands = React.useMemo(() => {
    const set = new Set<string>();
    for (const m of mockBrandModels) {
      set.add(m.brand);
    }
    return Array.from(set);
  }, []);

  const filteredModels = React.useMemo(() => {
    return mockBrandModels.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [searchTerm, selectedBrand]);

  const selectedModel = React.useMemo(() => {
    return (
      filteredModels.find((m) => m.id === selectedModelId) ||
      mockBrandModels.find((m) => m.id === selectedModelId) ||
      filteredModels[0]
    );
  }, [filteredModels, selectedModelId]);

  const handleSimulateAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim() || !newModel.trim()) return;
    setSimulationState('ADD_PREVIEW');
  };

  const handleSimulateDelete = () => {
    setSimulationState('DELETE_BLOCKED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Marcas e Modelos']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="brands-models-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Catálogo de Marcas e Modelos"
          subtitle="Tabela de referência automotiva para cadastro de anúncios e filtros padronizados de busca."
          badgeLabel="ADM-D-048"
          figmaNodeId="325:4011"
        />

        {/* Mobile Restriction Notice */}
        <MobileSettingsRestrictedBanner moduleName="marcas e modelos" />

        {/* 4 Summary / KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Modelos de Referência
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">5 modelos V1</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Toyota, Fiat, GM, VW, Honda</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Montadoras Cadastradas
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">5 marcas</div>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">
              Principais fabricantes nacionais
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Exclusão Protegida
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-900 tracking-tight">Bloqueada</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
              Modelos com anúncios ativos
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Validação Anti-Duplicidade
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 tracking-tight">Ativa</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Impede registros redundantes</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                data-testid="brand-model-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por marca, modelo ou código..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  data-testid="brand-filter-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none text-xs bg-slate-50/70 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
                >
                  <option value="all">Todas as marcas</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {(searchTerm || selectedBrand !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBrand('all');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Modelos Catalogados</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Selecione para inspecionar vínculos ativos e restrições
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {filteredModels.length} de {mockBrandModels.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" data-testid="brands-models-table">
                  <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                    <tr>
                      <th scope="col" className="py-3 px-4">
                        Marca / Modelo
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Categoria
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Ano Ref.
                      </th>
                      <th scope="col" className="py-3 px-3 text-center">
                        Anúncios
                      </th>
                      <th scope="col" className="py-3 px-4 text-right">
                        Proteção
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredModels.map((item) => {
                      const isSelected = selectedModel?.id === item.id;

                      return (
                        <tr
                          key={item.id}
                          data-testid={`model-row-${item.id}`}
                          tabIndex={0}
                          onClick={() => setSelectedModelId(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedModelId(item.id);
                            }
                          }}
                          className={`cursor-pointer transition-colors outline-none focus:bg-slate-100/70 ${
                            isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                              {item.brand} {item.model}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">{item.id}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{item.categoryName}</td>
                          <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                            {item.yearReference}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700">
                            {item.activeListingsCount}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              <Lock className="w-3 h-3 text-amber-600" />
                              Bloqueado
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Add Simulation Form */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" />
                <span>Simulação de Cadastro de Novo Modelo</span>
              </h3>

              <form onSubmit={handleSimulateAdd} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="new-brand-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Marca / Fabricante
                    </label>
                    <input
                      id="new-brand-input"
                      type="text"
                      placeholder="Ex: Hyundai"
                      value={newBrand}
                      onChange={(e) => {
                        setNewBrand(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-model-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Modelo / Versão
                    </label>
                    <input
                      id="new-model-input"
                      type="text"
                      placeholder="Ex: HB20 1.0 Comfort"
                      value={newModel}
                      onChange={(e) => {
                        setNewModel(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                </div>

                {simulationState === 'ADD_PREVIEW' && (
                  <div
                    data-testid="add-model-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Prévia de Cadastro Registrada</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      A proposta de inclusão do modelo{' '}
                      <strong>
                        {newBrand} {newModel}
                      </strong>{' '}
                      foi simulada com sucesso. Nenhuma alteração no catálogo persistido foi
                      efetuada.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSimulationState('NONE')}
                      className="text-[10px] font-bold text-amber-400 hover:underline pt-1 block"
                    >
                      Redefinir simulação
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!newBrand.trim() || !newModel.trim()}
                  data-testid="simulate-add-model-btn"
                  className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Modelo (Prévia)</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (5 cols): Selected Model Dossier */}
          <div className="lg:col-span-5 space-y-4">
            {selectedModel && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 sticky top-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                    Modelo Selecionado • {selectedModel.id}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedModel.brand} {selectedModel.model}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Categoria: {selectedModel.categoryName} • Ano Referência:{' '}
                    {selectedModel.yearReference}
                  </p>
                </div>

                {/* Corolla Image Preview if Available */}
                {selectedModel.imageThumbnail && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={selectedModel.imageThumbnail}
                      alt={`${selectedModel.brand} ${selectedModel.model}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Referência Visual Catalogada
                    </div>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Anúncios vinculados:</span>
                    <span className="font-bold text-slate-800">
                      {selectedModel.activeListingsCount} veículos ativos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Exclusão permitida:</span>
                    <span className="font-bold text-rose-700">Não (Bloqueio referencial)</span>
                  </div>
                </div>

                {simulationState === 'DELETE_BLOCKED' && (
                  <div
                    data-testid="delete-blocked-result"
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs space-y-1"
                  >
                    <strong className="font-bold uppercase text-[11px] block">
                      EXCLUSÃO BLOQUEADA PELO SISTEMA
                    </strong>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      O modelo <strong>{selectedModel.model}</strong> possui{' '}
                      {selectedModel.activeListingsCount} anúncios publicados ativos. A remoção de
                      modelos em uso é proibida para garantir a integridade referencial do catálogo.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  data-testid="simulate-delete-model-btn"
                  onClick={handleSimulateDelete}
                  className="w-full hidden lg:inline-flex items-center justify-center gap-2 py-2 px-3 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tentar Excluir Modelo (Simulação)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Audit Hold Banner */}
        <SettingsHoldBanner
          gateCode="ADM-015 / VEH-003"
          title="INTEGRIDADE REFERENCIAL DO CATÁLOGO DE MODELOS"
          description="Modelos de veículos vinculados a anúncios existentes na base não podem ser excluídos ou ter suas montadoras alteradas. Qualquer ajuste cadastral deve manter compatibilidade com registros de histórico de vistorias e contratos."
        />

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Catálogo oficial v0.2 em conformidade com o SRS.
        </div>
      </div>
    </AdminShell>
  );
}
