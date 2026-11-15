'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { mockBoostConfiguration } from '@/lib/adapters/mock-commercial-catalog-data';
import {
  AlertTriangle,
  ArrowRight,
  Car,
  CheckCircle2,
  Clock,
  Coins,
  ExternalLink,
  Flame,
  Lock,
  RotateCcw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { MobileSettingsRestrictedBanner } from '../components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '../components/SettingsHoldBanner';
import { SettingsSectionHeader } from '../components/SettingsSectionHeader';

export default function BoostConfigurationPage() {
  const boost = mockBoostConfiguration;

  const [editPrice, setEditPrice] = React.useState<number>(boost.priceBrl);
  const [editDays, setEditDays] = React.useState<number>(boost.durationDays);
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'PREVIEW_CONFIRMED'>(
    'NONE',
  );

  const handleSimulateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('PREVIEW_CONFIRMED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Destaque e Impulsionamento']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="boost-configuration-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Configuração de Destaque e Impulsionamento"
          subtitle="Regras comerciais da taxa de destaque semanal, critérios de elegibilidade e desvinculação."
          badgeLabel="ADM-D-046"
          figmaNodeId="325:3581"
          actionButton={
            <Link
              href="/anuncios"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              <Car className="w-4 h-4 text-slate-500" />
              <span>Ver Anúncios</span>
            </Link>
          }
        />

        {/* Mobile Restriction Notice */}
        <MobileSettingsRestrictedBanner moduleName="regras de impulsionamento" />

        {/* 4 Summary / KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Modalidade de Destaque
              </span>
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">1 modalidade</div>
            <p className="text-[11px] text-slate-500 mt-0.5">{boost.id} • Destaque 7 Dias</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Taxa de Ativação
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-800 tracking-tight font-mono">
              R$ {boost.priceBrl}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Pagamento confirmado (PIX/Cartão)
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Duração do Destaque
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {boost.durationDays} dias
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">
              Encerra com a venda do veículo
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/90 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Posicionamento
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-900 tracking-tight">Sem garantia</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
              Ranking e rotação dinâmicos
            </p>
          </div>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Parameters, Eligibility and Unresolved Governance */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Boost Specification Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block mb-0.5">
                    PARÂMETRO COMERCIAL • {boost.id}
                  </span>
                  <h2 className="text-lg font-black text-slate-900">{boost.title}</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  R$ {boost.priceBrl} por {boost.durationDays} dias
                </span>
              </div>

              {/* Four Invariant Rules */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Regras Contratuais e Governança do Destaque
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  {boost.rules.map((rule) => (
                    <div
                      key={rule}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5"
                    >
                      <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed text-slate-700 font-medium">
                        {rule}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Eligibility vs Ineligibility Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Eligible Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Critérios de Elegibilidade</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {boost.eligibleCriteria.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span className="text-[11px] leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ineligible Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Condições Inelegíveis</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {boost.ineligibleCriteria.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                      <span className="text-[11px] leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Example Listing Verification & Simulation */}
          <div className="lg:col-span-5 space-y-4">
            {/* Example Listing Reference Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Anúncio Demonstrativo de Teste
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {boost.exampleListingId}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {boost.exampleListingTitle}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Anúncio ativo no pátio de Ipatinga com taxa de destaque contratada.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status do anúncio base:</span>
                  <span className="font-bold text-emerald-700">Ativo / Aprovado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pagamento do destaque:</span>
                  <span className="font-bold text-emerald-700">Confirmado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dias restantes do destaque:</span>
                  <span className="font-bold text-blue-700">4 de 7 dias</span>
                </div>
              </div>

              <Link
                href="/anuncios"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <span>Localizar anúncio no módulo Anúncios</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Price Edit Simulation Form (Desktop only interactive) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                <span>Simulação de Parâmetros de Destaque</span>
              </h4>

              <form onSubmit={handleSimulateSave} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="boost-price-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Taxa Fixa (R$)
                    </label>
                    <input
                      id="boost-price-input"
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="boost-days-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Duração (dias)
                    </label>
                    <input
                      id="boost-days-input"
                      type="number"
                      value={editDays}
                      onChange={(e) => setEditDays(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-900"
                    />
                  </div>
                </div>

                {simulationState === 'PREVIEW_CONFIRMED' && (
                  <div
                    data-testid="boost-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Simulação Registrada — Modo Fail-Closed</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Proposta de ajuste de taxa para R$ {editPrice} ({editDays} dias) registrada na
                      interface. Nenhuma alteração de precificação foi salva em produção.
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
                  data-testid="simulate-save-boost-btn"
                  className="w-full hidden lg:inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Prévia de Ajuste Comercial</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Audit / Policy Notice */}
        <SettingsHoldBanner
          gateCode="ADV-006 / ADM-013"
          title="DESTAQUE SEM GARANTIA DE POSIÇÃO FIXA"
          description="A contratação do destaque aumenta a probabilidade de visualização por algoritmos de rotação uniforme. É proibido prometer posicionamento permanente em primeiro lugar ou fixação forçada de resultados."
        />

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Parâmetros de impulsionamento v0.2 em conformidade com o SRS.
        </div>
      </div>
    </AdminShell>
  );
}
