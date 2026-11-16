'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockFeaturedAdvertisements } from '@/lib/adapters/mock-content-settings-data';
import type { FeaturedAdvertisementRecord } from '@/lib/types/content-settings-presentation';
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  ExternalLink,
  FileText,
  Lock,
  RefreshCw,
  Shield,
  SlidersHorizontal,
  Sparkles,
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
      breadcrumbs={['Admin', 'Configurações', 'Conteúdo em destaque na página inicial']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-featured-content-page">
        {/* Header matching Figma ADM-D-050 */}
        <SettingsSectionHeader
          title="Conteúdo em destaque na página inicial"
          subtitle="Anúncios elegíveis, vitrines e regras de ordenação para a homepage."
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

        {/* 4 Summary KPI Cards directly matching Figma node 342:5209 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {/* KPI 1: Anúncios elegíveis */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <Car className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Anúncios elegíveis</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">Ativos</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">
              Publicados após aprovação/pagamento
            </p>
          </div>

          {/* KPI 2: Vitrine da homepage */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <FileText className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Vitrine da homepage</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">
                  Curadoria
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">
              Seleção administrativa em revisão
            </p>
          </div>

          {/* KPI 3: Boost de anúncio */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <Shield className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Boost de anúncio</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">
                  R$ 10 · 7 dias
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Não é posicionamento garantido</p>
          </div>

          {/* KPI 4: Ordenação */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Ordenação</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">
                  Em definição
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">SEARCH-012 / rotação pendente</p>
          </div>
        </div>

        {/* Control and Source Integrity Card matching Figma node 342:5255 */}
        <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col gap-[11px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
              <Shield className="w-[20px] h-[20px] text-[#b91c1c]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#111827]">
              Gestão da vitrine da página inicial
            </h2>
          </div>
          <p className="text-[12px] font-normal text-[#64748b]">
            A homepage exibe anúncios elegíveis e pode apresentar conteúdo em destaque. A ordenação,
            rotação e prioridade entre promoção e curadoria ainda precisam de aprovação.
          </p>
          <div className="flex flex-wrap gap-[9px] pt-1">
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#b91c1c] hover:bg-[#a8121c] text-white text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Ver anúncio selecionado
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Revisar elegibilidade
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Abrir configurações de boost
            </button>
          </div>
        </div>

        {/* Main Content: Advertisements Table + Selected Ad Panel matching Figma node 342:5271 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Curated listing candidates matching Figma node 342:5272 */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                    <Car className="w-[20px] h-[20px] text-[#b91c1c]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111827]">
                    Anúncios para conteúdo em destaque
                  </h3>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  {mockFeaturedAdvertisements.length} elegíveis
                </span>
              </div>
              <p className="text-[12px] text-[#64748b]">
                Exemplos fictícios; nenhum posicionamento pago ou ranking publicado.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left" data-testid="featured-ads-table">
                  <thead>
                    <tr className="bg-[#f1f5f9] text-[10px] font-bold text-[#4b5563] uppercase tracking-wider rounded-[8px]">
                      <th className="py-[10px] pl-[10px]">ANÚNCIO / VEÍCULO</th>
                      <th className="py-[10px] px-2 w-[157px]">PREÇO</th>
                      <th className="py-[10px] pr-[10px]">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockFeaturedAdvertisements.map((ad) => {
                      const isSelected = ad.id === selectedAdId;
                      return (
                        <tr
                          key={ad.id}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedAdId(ad.id);
                              setSimulationState('NONE');
                            }
                          }}
                          onClick={() => {
                            setSelectedAdId(ad.id);
                            setSimulationState('NONE');
                          }}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#fff5f5]' : 'bg-[#f8fafc] hover:bg-slate-100'
                          }`}
                        >
                          <td className="py-[14px] pl-[10px]">
                            <div className="flex flex-col">
                              <span className="text-[12px] font-semibold text-[#111827]">
                                {ad.id}
                              </span>
                              <span className="text-[11px] font-normal text-[#4b5563]">
                                {ad.vehicleTitle}
                              </span>
                            </div>
                          </td>
                          <td className="py-[14px] px-2 text-[12px] font-medium text-[#344054]">
                            {ad.priceFormatted}
                          </td>
                          <td className="py-[14px] pr-[10px]">
                            <span className="inline-flex items-center gap-[7px] px-[11px] py-[4px] rounded-[12px] bg-[#ecfdf3] text-[#166534] text-[11px] font-semibold">
                              <span className="w-[7px] h-[7px] rounded-full bg-[#166534]" />
                              Ativo
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invariant Policy Checklist Card */}
            <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs space-y-3">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>Diretrizes de Vitrine e Governança Comercial</span>
              </h4>
              <ul className="space-y-2 text-[12px] text-[#4b5563]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f42524] shrink-0 mt-1.5" />
                  <span>
                    <strong>Elegibilidade restrita:</strong> Somente anúncios aprovados pela
                    moderação, com pagamento confirmado e sem sinalização de venda concretizada
                    concorrem aos espaços de destaque.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f42524] shrink-0 mt-1.5" />
                  <span>
                    <strong>Sem garantia de posição absoluta:</strong> A aquisição de destaque
                    proporciona rotação prioritária entre veículos impulsionados, mas não assegura a
                    primeira posição fixa permanente (SEARCH-012).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f42524] shrink-0 mt-1.5" />
                  <span>
                    <strong>Desvinculação automática:</strong> Caso o veículo seja vendido ou o
                    anúncio expirado, o destaque é encerrado sem estorno proporcional de valor.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (5 cols): Selected Ad Details matching Figma node 342:5323 */}
          <div className="lg:col-span-5 space-y-4">
            <div
              data-testid="selected-ad-panel"
              className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[11px] uppercase font-bold text-[#b91c1c]">
                  ANÚNCIO SELECIONADO · {selectedAd.id}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#111827]">
                  {selectedAd.priceFormatted}
                </span>
              </div>

              {/* Title & Badge */}
              <div>
                <h4 className="text-[18px] font-bold text-[#111827]">{selectedAd.vehicleTitle}</h4>
                <div className="mt-1">
                  <span className="inline-flex items-center gap-[7px] px-[11px] py-[4px] rounded-[12px] bg-[#ecfdf3] text-[#166534] text-[11px] font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#166534]" />
                    Ativo na vitrine
                  </span>
                </div>
              </div>

              {/* Divided Data Rows matching Figma FDC DataRow */}
              <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[13px]">
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Anúncio</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    {selectedAd.id}
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Vendedora</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    {selectedAd.sellerName}
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Tipo de anunciante</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    {selectedAd.sellerType === 'DEALERSHIP' ? 'Lojista' : 'Particular'}
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Localidade</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    {selectedAd.location}
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Plano / Destaque</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    {selectedAd.boostPlan}
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Status da rotação</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    SEARCH-012 / Elegível
                  </span>
                </div>
              </div>

              {/* Simulation Sandbox Form */}
              <form
                onSubmit={handleSimulateReorder}
                className="bg-slate-50 p-3.5 rounded-[10px] border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span className="text-[12px] font-bold text-[#111827]">
                    Simulador de Rotação (Frontend Sandbox)
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  Teste a alternância de slot da vitrine. Operação estritamente em memória local;
                  não persiste alterações em banco de dados.
                </p>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="slot-select"
                    className="text-[12px] text-[#4b5563] shrink-0 font-medium"
                  >
                    Posição estimada:
                  </label>
                  <select
                    id="slot-select"
                    value={simulationSlot}
                    onChange={(e) => setSimulationSlot(Number(e.target.value))}
                    className="flex-1 bg-white border border-[#d1d5db] rounded-[8px] px-2.5 py-1.5 text-[12px] text-[#111827]"
                  >
                    <option value={1}>Slot 1 (Topo rotativo)</option>
                    <option value={2}>Slot 2 (Vitrine intermediária)</option>
                    <option value={3}>Slot 3 (Vitrine rotativa)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111827] hover:bg-slate-800 text-white text-[12px] font-semibold py-2 rounded-[8px] transition-colors"
                >
                  Simular Posição no Grid
                </button>

                {simulationState === 'SIMULATED' && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[8px] text-[11px] text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Simulação aplicada: {selectedAd.id} no Slot {simulationSlot}. Nenhuma
                      alteração persistida.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
