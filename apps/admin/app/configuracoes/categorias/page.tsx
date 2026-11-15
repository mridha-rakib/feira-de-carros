'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { mockVehicleCategories } from '@/lib/adapters/mock-commercial-catalog-data';
import type { VehicleCategoryRecord } from '@/lib/types/commercial-catalog-presentation';
import {
  AlertTriangle,
  ArrowRight,
  Car,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Layers,
  Lock,
  Plus,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { MobileSettingsRestrictedBanner } from '../components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '../components/SettingsHoldBanner';
import { SettingsSectionHeader } from '../components/SettingsSectionHeader';

export default function VehicleCategoriesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>('CAT-CAR');
  const selectedCategory = React.useMemo(() => {
    return (
      mockVehicleCategories.find((c) => c.id === selectedCategoryId) || mockVehicleCategories[0]
    );
  }, [selectedCategoryId]);

  const [editName, setEditName] = React.useState(selectedCategory.name);
  const [editDesc, setEditDesc] = React.useState(selectedCategory.description);
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'CATEGORY_PREVIEW'>('NONE');

  React.useEffect(() => {
    setEditName(selectedCategory.name);
    setEditDesc(selectedCategory.description);
    setSimulationState('NONE');
  }, [selectedCategory]);

  const handleSimulateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('CATEGORY_PREVIEW');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Categorias de Veículos']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="vehicle-categories-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Categorias de Veículos"
          subtitle="Taxonomia homologada de veículos do baseline V1 e atributos cadastrais obrigatórios."
          badgeLabel="ADM-D-047"
          figmaNodeId="325:3796"
          actionButton={
            <Link
              href="/configuracoes/marcas-modelos"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              <Car className="w-4 h-4 text-slate-500" />
              <span>Ver Marcas e Modelos</span>
            </Link>
          }
        />

        {/* Mobile Restriction Notice */}
        <MobileSettingsRestrictedBanner moduleName="categorias de veículos" />

        {/* 4 Summary / KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Categorias Oficiais
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">4 categorias</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Carros, Caminhões, Motos, Outros</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Escopo do Catálogo
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">Fechado V1</div>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">Sem famílias avulsas</p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/90 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Atributos Obrigatórios
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-900 tracking-tight">HOLD (SMG-07)</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
              Campos protegidos contra exclusão
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Anúncios Vinculados
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-800 tracking-tight">
              2.406 veículos
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Base ativa na plataforma
            </p>
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Categories Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Taxonomia de Veículos V1</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Famílias de veículos aceitas para cadastro e vistoria no pátio da feira
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                  4 Classes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" data-testid="categories-table">
                  <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                    <tr>
                      <th scope="col" className="py-3 px-4">
                        Categoria / Código
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Slug URL
                      </th>
                      <th scope="col" className="py-3 px-3 text-center">
                        Modelos V1
                      </th>
                      <th scope="col" className="py-3 px-3 text-center">
                        Anúncios
                      </th>
                      <th scope="col" className="py-3 px-4 text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockVehicleCategories.map((cat) => {
                      const isSelected = selectedCategoryId === cat.id;

                      return (
                        <tr
                          key={cat.id}
                          data-testid={`category-row-${cat.id}`}
                          tabIndex={0}
                          onClick={() => setSelectedCategoryId(cat.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedCategoryId(cat.id);
                            }
                          }}
                          className={`cursor-pointer transition-colors outline-none focus:bg-slate-100/70 ${
                            isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                              {cat.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">{cat.id}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600">/{cat.slug}</td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700">
                            {cat.activeModelsCount}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-500">
                            {cat.totalListingsCount}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {cat.statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Note Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800 font-bold block">
                Catálogo Fechado — Exclusivo Main Admin
              </strong>
              <p className="text-[11px] leading-relaxed">
                A adição de novas famílias de veículos (ex: Embarcações, Aeronaves) está
                expressamente vedada no baseline V1 da plataforma. A taxonomia foi padronizada para
                atender às feiras automotivas presenciais e concessionárias regionais.
              </p>
            </div>
          </div>

          {/* Right Column (5 cols): Selected Category Dossier & Attributes */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5 sticky top-6">
              {/* Header */}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Categoria Selecionada • {selectedCategory.id}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {selectedCategory.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedCategory.description}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    /{selectedCategory.slug}
                  </span>
                </div>
              </div>

              {/* Mandatory Attributes Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Atributos Obrigatórios do Formulário (HOLD SMG-07)
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-700">
                  {selectedCategory.mandatoryAttributes.map((attr) => (
                    <div key={attr} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-medium">{attr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Preview Form */}
              <form
                onSubmit={handleSimulateSave}
                className="space-y-3 pt-2 border-t border-slate-100"
              >
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Simulação de Edição Cadastral</span>
                </h4>

                <div>
                  <label
                    htmlFor="category-name-input"
                    className="block text-[10px] font-bold text-slate-600 mb-1"
                  >
                    Nome de Exibição
                  </label>
                  <input
                    id="category-name-input"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category-desc-input"
                    className="block text-[10px] font-bold text-slate-600 mb-1"
                  >
                    Descrição da Categoria
                  </label>
                  <textarea
                    id="category-desc-input"
                    rows={2}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                {simulationState === 'CATEGORY_PREVIEW' && (
                  <div
                    data-testid="category-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Simulação Registrada — Modo Fail-Closed</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Proposta de alteração da categoria <strong>{editName}</strong> validada na
                      interface. Nenhuma exclusão ou alteração de anúncios publicados foi realizada.
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
                  data-testid="simulate-save-category-btn"
                  className="w-full hidden lg:inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Prévia de Edição de Categoria</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* SMG-07 Hold Banner */}
        <SettingsHoldBanner
          gateCode="SMG-07"
          title="MANDATORY FIELDS HOLD · ESTRUTURA DE ATRIBUTOS CONGELADA"
          description="Os atributos obrigatórios definidos por categoria são essenciais para filtros de pesquisa e conformidade legal de anúncios. É vedada a exclusão de campos cadastrais sem validação de retrocompatibilidade com anúncios já publicados."
        />

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Taxonomia oficial v0.2 em conformidade com o SRS.
        </div>
      </div>
    </AdminShell>
  );
}
