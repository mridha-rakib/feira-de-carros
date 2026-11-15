'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { mockBrazilianLocations } from '@/lib/adapters/mock-commercial-catalog-data';
import type { BrazilianLocationRecord } from '@/lib/types/commercial-catalog-presentation';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Globe,
  Lock,
  MapPin,
  Navigation,
  Plus,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import * as React from 'react';
import { MobileSettingsRestrictedBanner } from '../components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '../components/SettingsHoldBanner';
import { SettingsSectionHeader } from '../components/SettingsSectionHeader';

const VALID_BRAZILIAN_UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export default function BrazilianLocationsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedUf, setSelectedUf] = React.useState<string>('all');
  const [selectedLocationId, setSelectedLocationId] = React.useState<string>('LOC-001');

  // Add location simulation state
  const [newCity, setNewCity] = React.useState('');
  const [newUf, setNewUf] = React.useState('MG');
  const [newRegion, setNewRegion] = React.useState('');
  const [simulationState, setSimulationState] = React.useState<
    'NONE' | 'ADD_PREVIEW' | 'DELETE_BLOCKED' | 'INVALID_UF'
  >('NONE');

  const ufs = React.useMemo(() => {
    const set = new Set<string>();
    for (const loc of mockBrazilianLocations) {
      set.add(loc.state);
    }
    return Array.from(set);
  }, []);

  const filteredLocations = React.useMemo(() => {
    return mockBrazilianLocations.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUf = selectedUf === 'all' || item.state === selectedUf;

      return matchesSearch && matchesUf;
    });
  }, [searchTerm, selectedUf]);

  const selectedLocation = React.useMemo(() => {
    return (
      filteredLocations.find((l) => l.id === selectedLocationId) ||
      mockBrazilianLocations.find((l) => l.id === selectedLocationId) ||
      filteredLocations[0]
    );
  }, [filteredLocations, selectedLocationId]);

  const handleSimulateAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUf = newUf.trim().toUpperCase();
    if (!VALID_BRAZILIAN_UFS.includes(cleanUf)) {
      setSimulationState('INVALID_UF');
      return;
    }
    setSimulationState('ADD_PREVIEW');
  };

  const handleSimulateDelete = () => {
    setSimulationState('DELETE_BLOCKED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Localidades Brasileiras']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="brazilian-locations-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Localidades e Praças de Atendimento"
          subtitle="Municípios homologados para anúncios, praça da feira física e centros regionais de vistoria."
          badgeLabel="ADM-D-049"
          figmaNodeId="341:4910"
        />

        {/* Mobile Restriction Notice */}
        <MobileSettingsRestrictedBanner moduleName="localidades e regiões" />

        {/* 4 Summary / KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Praças Homologadas
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">5 municípios</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Vale do Aço, BH e SP</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Sede Institucional
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-800 tracking-tight">Ipatinga, MG</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Padrão da plataforma</p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200/90 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Busca por Raio
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-900 tracking-tight">HOLD (SEARCH-005)</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
              Sem geolocalização ou GPS
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Seleção de Município
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">Manual</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Escolha explícita pelo usuário</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                data-testid="location-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cidade, estado ou código..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  data-testid="uf-filter-select"
                  value={selectedUf}
                  onChange={(e) => setSelectedUf(e.target.value)}
                  className="appearance-none text-xs bg-slate-50/70 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
                >
                  <option value="all">Todos os estados</option>
                  {ufs.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {(searchTerm || selectedUf !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedUf('all');
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
          {/* Left Column (7 cols): Locations Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Praças Homologadas</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Municípios autorizados para veiculação de anúncios e agendamento de vistorias
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {filteredLocations.length} de {mockBrazilianLocations.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" data-testid="locations-table">
                  <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                    <tr>
                      <th scope="col" className="py-3 px-4">
                        Cidade / Código
                      </th>
                      <th scope="col" className="py-3 px-3 text-center">
                        UF
                      </th>
                      <th scope="col" className="py-3 px-3">
                        Região
                      </th>
                      <th scope="col" className="py-3 px-3 text-center">
                        Anúncios
                      </th>
                      <th scope="col" className="py-3 px-4 text-right">
                        Tipo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLocations.map((loc) => {
                      const isSelected = selectedLocation?.id === loc.id;

                      return (
                        <tr
                          key={loc.id}
                          data-testid={`location-row-${loc.id}`}
                          tabIndex={0}
                          onClick={() => setSelectedLocationId(loc.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedLocationId(loc.id);
                            }
                          }}
                          className={`cursor-pointer transition-colors outline-none focus:bg-slate-100/70 ${
                            isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 hover:text-red-600 transition-colors flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {loc.city}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">{loc.id}</div>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">
                            {loc.state}
                          </td>
                          <td className="py-3 px-3 text-slate-600">{loc.region}</td>
                          <td className="py-3 px-3 text-center font-bold text-slate-700">
                            {loc.activeListingsCount}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {loc.isDefault ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Sede Principal
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                                Praça Ativa
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulation Add Location Form */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" />
                <span>Simulação de Cadastro de Nova Praça</span>
              </h3>

              <form onSubmit={handleSimulateAdd} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="new-city-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Município / Cidade
                    </label>
                    <input
                      id="new-city-input"
                      type="text"
                      placeholder="Ex: Governador Valadares"
                      value={newCity}
                      onChange={(e) => {
                        setNewCity(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-uf-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Estado (UF)
                    </label>
                    <input
                      id="new-uf-input"
                      type="text"
                      maxLength={2}
                      placeholder="MG"
                      value={newUf}
                      onChange={(e) => {
                        setNewUf(e.target.value.toUpperCase());
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900 uppercase"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-region-input"
                      className="block text-[10px] font-bold text-slate-600 mb-1"
                    >
                      Microrregião
                    </label>
                    <input
                      id="new-region-input"
                      type="text"
                      placeholder="Ex: Rio Doce"
                      value={newRegion}
                      onChange={(e) => {
                        setNewRegion(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                </div>

                {simulationState === 'INVALID_UF' && (
                  <div
                    data-testid="invalid-uf-alert"
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Sigla de Estado (UF) inválida. Informe uma das 27 UFs oficiais do Brasil.
                    </span>
                  </div>
                )}

                {simulationState === 'ADD_PREVIEW' && (
                  <div
                    data-testid="add-location-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Prévia de Cadastro Registrada</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      A proposta de inclusão de{' '}
                      <strong>
                        {newCity}, {newUf}
                      </strong>{' '}
                      foi simulada na interface. Nenhuma alteração nas praças persistidas foi
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
                  disabled={!newCity.trim() || !newUf.trim()}
                  data-testid="simulate-add-location-btn"
                  className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Localidade (Prévia)</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (5 cols): Selected Location Dossier */}
          <div className="lg:col-span-5 space-y-4">
            {selectedLocation && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 sticky top-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                    Praça Selecionada • {selectedLocation.id}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedLocation.city}, {selectedLocation.state}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Região: {selectedLocation.region}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Classificação:</span>
                    <span className="font-bold text-slate-800">
                      {selectedLocation.isDefault ? 'Sede da Feira (Padrão)' : 'Praça Regional'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Anúncios ativos vinculados:</span>
                    <span className="font-bold text-emerald-700">
                      {selectedLocation.activeListingsCount} veículos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Exclusão permitida:</span>
                    <span className="font-bold text-rose-700">Não (Vínculos ativos)</span>
                  </div>
                </div>

                {simulationState === 'DELETE_BLOCKED' && (
                  <div
                    data-testid="location-delete-blocked-result"
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs space-y-1"
                  >
                    <strong className="font-bold uppercase text-[11px] block">
                      REMOÇÃO DE LOCALIDADE BLOQUEADA
                    </strong>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      A praça <strong>{selectedLocation.city}</strong> possui{' '}
                      {selectedLocation.activeListingsCount} anúncios associados e registros
                      históricos vinculados. Cidades em uso não podem ser excluídas do catálogo.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  data-testid="simulate-delete-location-btn"
                  onClick={handleSimulateDelete}
                  className="w-full hidden lg:inline-flex items-center justify-center gap-2 py-2 px-3 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tentar Excluir Praça (Simulação)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH-005 Hold Banner */}
        <SettingsHoldBanner
          gateCode="SEARCH-005 / ADM-015"
          title="GEO-RADIUS HOLD · SELEÇÃO MANUAL ESTATUTÁRIA"
          description="A plataforma Feira de Carros adota seleção explícita de cidades e filtros estaduais. Filtros por raio de distância e cálculo de geolocalização automática por GPS estão congelados pelo gate SEARCH-005."
        />

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Cadastro territorial oficial v0.2 em conformidade com o SRS.
        </div>
      </div>
    </AdminShell>
  );
}
