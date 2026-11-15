'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockFeaturedAdvertisements } from '@/lib/adapters/mock-content-settings-data';
import type { FeaturedAdvertisementRecord } from '@/lib/types/content-settings-presentation';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Lock,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Tag,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

export default function FeaturedContentPage() {
  const [selectedAdId, setSelectedAdId] = React.useState<string>(
    mockFeaturedAdvertisements[0]?.id || '',
  );
  const [simulationSlot, setSimulationSlot] = React.useState<number>(1);
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'SIMULATED'>('NONE');

  const selectedAd =
    mockFeaturedAdvertisements.find((a) => a.id === selectedAdId) || mockFeaturedAdvertisements[0];

  const handleSimulateReorder = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('SIMULATED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Destaques da Home']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-featured-content-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Destaques da Página Inicial"
          subtitle="Gestão de anúncios elegíveis à vitrine de destaques da homepage. Critérios de elegibilidade contratual e fail-closed ranking."
          badgeLabel="ADM-D-050"
          figmaNodeId="341:5126"
        />

        {/* Mobile Restriction Banner */}
        <MobileSettingsRestrictedBanner moduleName="destaques da página inicial" />

        {/* SEARCH-012 HOLD Banner */}
        <SettingsHoldBanner
          gateCode="SEARCH-012"
          title="POLÍTICA DE RANKING E DESTAQUES NÃO HOMOLOGADA"
          description="Em conformidade com o requisito SEARCH-012, a ordenação e rotação automática de destaques na página inicial dependem de homologação técnica dos algoritmos de busca. A contratação do destaque assegura elegibilidade, mas não garante a primeira posição absoluta nem substitui filtros de busca. Nenhuma reordenação em tempo real é executada em banco de dados."
        />

        {/* KPI Cards (4 summary cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Destaques Ativos na Home
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">3</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Vagas ocupadas: 3 de 6
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Espaços Elegíveis
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">6</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Vitrine rotativa de Ipatinga
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Destaques Contratados
            </span>
            <div className="text-2xl font-black text-red-600 tracking-tight">2</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Plano BST-07D-001 pago
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Em Fila de Rotação
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">1</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              Aguardando próximo ciclo
            </div>
          </div>
        </div>

        {/* Main Content: Advertisements Table + Selected Ad Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Table of Eligible Ads */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Anúncios com Destaque Contratado
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">3 anúncios elegíveis</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" data-testid="featured-ads-table">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-400">
                      <th className="pb-2.5">Veículo / Código</th>
                      <th className="pb-2.5">Anunciante</th>
                      <th className="pb-2.5">Preço</th>
                      <th className="pb-2.5">Destaque</th>
                      <th className="pb-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockFeaturedAdvertisements.map((ad) => {
                      const isSelected = ad.id === selectedAdId;
                      return (
                        <tr
                          key={ad.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-red-50/60 font-semibold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 pr-2">
                            <div className="flex items-center gap-2.5">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                                <Image
                                  src={ad.imageThumbnail}
                                  alt={ad.vehicleTitle}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-slate-900 font-bold">{ad.vehicleTitle}</div>
                                <div className="text-[10px] font-mono text-slate-500">{ad.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-2">
                            <div className="text-slate-800">{ad.sellerName}</div>
                            <div className="text-[10px] text-slate-400">{ad.location}</div>
                          </td>
                          <td className="py-3 pr-2 font-mono font-bold text-slate-900">
                            {ad.priceFormatted}
                          </td>
                          <td className="py-3 pr-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{ad.boostRemainingDays}d restantes</span>
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAdId(ad.id);
                                setSimulationState('NONE');
                              }}
                              className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                                isSelected
                                  ? 'bg-red-600 text-white font-bold'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                              }`}
                            >
                              {isSelected ? 'Selecionado' : 'Ver'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invariant Policy Checklist Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>Diretrizes de Vitrine e Governança Comercial</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>Elegibilidade restrita:</strong> Somente anúncios aprovados pela
                    moderação, com pagamento confirmado e sem sinalização de venda concretizada
                    concorrem aos espaços de destaque.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>Sem garantia de posição absoluta:</strong> A aquisição de destaque
                    proporciona rotação prioritária entre veículos impulsionados, mas não assegura a
                    primeira posição fixa permanente (SEARCH-012).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>Desvinculação automática:</strong> Caso o veículo seja vendido ou o
                    anúncio expirado, o destaque é encerrado sem estorno proporcional de valor.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (5 cols): Selected Ad Details & Simulation */}
          <div className="lg:col-span-5 space-y-4">
            <div
              data-testid="selected-ad-panel"
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Caso Selecionado • ADM-D-050
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  {selectedAd.id}
                </span>
              </div>

              {/* Photo & Title */}
              <div className="space-y-3">
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src={selectedAd.imageThumbnail}
                    alt={selectedAd.vehicleTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>Destaque Contratado</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedAd.vehicleTitle}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black font-mono text-red-600">
                      {selectedAd.priceFormatted}
                    </span>
                    <span className="text-xs text-slate-500">
                      {selectedAd.sellerName} • {selectedAd.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Eligibility Verification Checklist */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Validação de Critérios de Elegibilidade
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Anúncio aprovado na moderação</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Sim</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pagamento do plano confirmado</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Confirmado</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Veículo ativo no estoque</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Ativo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sem marcação de venda realizada</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Não vendido</span>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Vigência Restante</span>
                  <span className="font-bold text-slate-800">
                    {selectedAd.boostRemainingDays} dias restantes
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Posição Estimada</span>
                  <span className="font-bold text-blue-700">
                    Slot #{selectedAd.slotPositionPreview}
                  </span>
                </div>
              </div>

              {/* Link to Listing Details */}
              <Link
                href="/anuncios"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <span>Visualizar anúncio completo no módulo Anúncios</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {/* Reordering Simulation Form */}
              <form
                onSubmit={handleSimulateReorder}
                className="space-y-3 pt-3 border-t border-slate-100"
              >
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Simulação de Posicionamento na Vitrine</span>
                </h4>

                <div>
                  <label
                    htmlFor="slot-position-select"
                    className="block text-[10px] font-bold text-slate-600 mb-1"
                  >
                    Simular Ordem de Apresentação (Slot)
                  </label>
                  <select
                    id="slot-position-select"
                    value={simulationSlot}
                    onChange={(e) => {
                      setSimulationSlot(Number(e.target.value));
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-900"
                  >
                    <option value={1}>Slot #1 — Posição Primária de Vitrine</option>
                    <option value={2}>Slot #2 — Posição Secundária de Vitrine</option>
                    <option value={3}>Slot #3 — Posição Terciária de Vitrine</option>
                    <option value={4}>Slot #4 — Fila Rotativa de Impulsionados</option>
                  </select>
                </div>

                {simulationState === 'SIMULATED' && (
                  <div
                    data-testid="reorder-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Simulação Registrada — Modo Fail-Closed</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Proposta de posicionamento do anúncio <strong>{selectedAd.id}</strong> no Slot
                      #{simulationSlot} verificada na interface. Em conformidade com o requisito{' '}
                      <strong>SEARCH-012</strong>, nenhuma reordenação em banco de dados ou vitrine
                      pública foi executada.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Simular Reordenação da Vitrine
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
