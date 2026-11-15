'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { mockAdvertisementPlans } from '@/lib/adapters/mock-commercial-catalog-data';
import type { AdvertisementPlanRecord } from '@/lib/types/commercial-catalog-presentation';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Coins,
  Edit3,
  FileCheck,
  Film,
  Lock,
  RefreshCw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { MobileSettingsRestrictedBanner } from '../components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '../components/SettingsHoldBanner';
import { SettingsSectionHeader } from '../components/SettingsSectionHeader';

export default function AdvertisementPlansPage() {
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>('PLN-30D-05');
  const selectedPlan = React.useMemo(() => {
    return mockAdvertisementPlans.find((p) => p.id === selectedPlanId) || mockAdvertisementPlans[0];
  }, [selectedPlanId]);

  // Demonstration edit state
  const [editPrice, setEditPrice] = React.useState<number>(selectedPlan.priceBrl);
  const [editDuration, setEditDuration] = React.useState<number>(selectedPlan.durationDays);
  const [editMaxPhotos, setEditMaxPhotos] = React.useState<number>(selectedPlan.maxPhotos);
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'REPRICING_PREVIEW'>(
    'NONE',
  );

  React.useEffect(() => {
    setEditPrice(selectedPlan.priceBrl);
    setEditDuration(selectedPlan.durationDays);
    setEditMaxPhotos(selectedPlan.maxPhotos);
    setSimulationState('NONE');
  }, [selectedPlan]);

  const handleSimulateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('REPRICING_PREVIEW');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Planos de Anúncios']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="advertisement-plans-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Planos de Anúncios Comerciais"
          subtitle="Tarifas de publicação, vigência de exposição e cotas de fotos para vendedores e lojistas."
          badgeLabel="ADM-D-045"
          figmaNodeId="325:3366"
        />

        {/* Mobile Restriction Notice */}
        <MobileSettingsRestrictedBanner moduleName="planos e tarifas comerciais" />

        {/* 4 Summary / KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Planos Cadastrados
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">2 modalidades</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Plano Básico e Plano Estendido</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Vigência Máxima
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">30 e 60 dias</div>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">Sem renovação automática</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Cota de Fotos
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">5 a 10 fotos</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Vídeo fora do baseline V1
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/90 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Repricing Governança
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-900 tracking-tight">HOLD (SMG-10)</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
              Preços bloqueados para edição real
            </p>
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Plans Table & Policies */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Catálogo de Planos Aprovados</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Selecione um plano para inspecionar os parâmetros comerciais e simular alteração
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                  Baseline V1
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" data-testid="plans-table">
                  <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                    <tr>
                      <th scope="col" className="py-3 px-4">
                        Plano / Código
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Preço
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Vigência
                      </th>
                      <th scope="col" className="py-3 px-3 text-center">
                        Fotos
                      </th>
                      <th scope="col" className="py-3 px-4 text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockAdvertisementPlans.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;

                      return (
                        <tr
                          key={plan.id}
                          data-testid={`plan-row-${plan.id}`}
                          tabIndex={0}
                          onClick={() => setSelectedPlanId(plan.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedPlanId(plan.id);
                            }
                          }}
                          className={`cursor-pointer transition-colors outline-none focus:bg-slate-100/70 ${
                            isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                              {plan.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">{plan.id}</div>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 font-mono text-[13px]">
                            R$ {plan.priceBrl}
                          </td>
                          <td className="py-3 px-3 text-slate-600">{plan.durationDays} dias</td>
                          <td className="py-3 px-3 text-center font-semibold text-slate-700">
                            Até {plan.maxPhotos}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {plan.statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invariant Policy Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Regras de Negócio e Invariantes dos Planos</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    Sem Plano Ilimitado
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Não há planos com vigência perpétua ou cotas infinitas. Todo anúncio requer
                    prazo fixo de 30 ou 60 dias.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    Sem Renovação Automática
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    A renovação automática não existe no modelo da plataforma. Cobranças recorrentes
                    são proibidas.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Film className="w-3.5 h-3.5 text-slate-400" />
                    Vídeo Fora do Baseline V1
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Upload ou vinculação de vídeos do YouTube/TikTok não são permitidos nesta
                    versão.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Aprovação Obrigatória
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    O pagamento confirmado e a aprovação do Main Admin são condições simultâneas
                    para publicação.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Plan Detail Panel & Edit Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5 sticky top-6">
              {/* Header */}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Plano Selecionado • {selectedPlan.id}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black font-mono text-red-600">
                      R$ {selectedPlan.priceBrl}
                    </div>
                    <span className="text-[10px] text-slate-400">taxa única</span>
                  </div>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Benefícios Incluídos
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedPlan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Simulation Edit Form (Desktop Only Interactive) */}
              <form
                onSubmit={handleSimulateSave}
                className="space-y-3 pt-2 border-t border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Simulação de Repricing (HOLD SMG-10)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                    Modo Leitura
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label
                      htmlFor="plan-price-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Preço (R$)
                    </label>
                    <input
                      id="plan-price-input"
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="plan-duration-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Dias
                    </label>
                    <input
                      id="plan-duration-input"
                      type="number"
                      value={editDuration}
                      onChange={(e) => setEditDuration(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="plan-photos-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Máx Fotos
                    </label>
                    <input
                      id="plan-photos-input"
                      type="number"
                      value={editMaxPhotos}
                      onChange={(e) => setEditMaxPhotos(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-900"
                    />
                  </div>
                </div>

                {simulationState === 'REPRICING_PREVIEW' && (
                  <div
                    data-testid="plan-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Simulação Bloqueada — Gate SMG-10</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      A proposta de alteração de tarifa para R$ {editPrice} ({editDuration} dias,{' '}
                      {editMaxPhotos} fotos) foi validada na interface. Nenhuma alteração de preço
                      foi persistida em produção.
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
                  data-testid="simulate-save-plan-btn"
                  className="w-full hidden lg:inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Prévia de Atualização Tarifária</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* SMG-10 Hold Banner */}
        <SettingsHoldBanner
          gateCode="SMG-10"
          title="REPRICING HOLD · TERMOS TARIFÁRIOS CONGELADOS"
          description="A alteração de preços e cotas de planos de anúncios para compras futuras depende de assinatura de governança comercial e deliberação formal da diretoria. Anúncios já pagos mantêm as condições contratadas até a expiração."
        />

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Planos de anúncios oficiais v0.2 em conformidade com o SRS.
        </div>
      </div>
    </AdminShell>
  );
}
