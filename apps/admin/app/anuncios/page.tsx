'use client';

import {
  AlertTriangle,
  BadgePercent,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Fuel,
  Gauge,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { mockModerationAds } from '../../lib/adapters/mock-b2-data';
import type {
  AdPlan,
  ModerationAd,
  ModerationAdStatus,
  SellerType,
} from '../../lib/types/b2-presentation';
import { AdminMobileNavigation } from '../components/AdminMobileNavigation';
import { AdminShell } from '../components/AdminShell';
import { ListingInspectionModal } from '../components/ListingInspectionModal';

export default function AdModerationPage() {
  const [ads, setAds] = React.useState<ModerationAd[]>(mockModerationAds);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | ModerationAdStatus>('all');
  const [selectedPlan, setSelectedPlan] = React.useState<'all' | AdPlan>('all');
  const [inspectingAd, setInspectingAd] = React.useState<ModerationAd | null>(null);

  // Filter ads list
  const filteredAds = React.useMemo(() => {
    return ads.filter((ad) => {
      const matchesSearch =
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || ad.status === selectedStatus;
      const matchesPlan = selectedPlan === 'all' || ad.plan === selectedPlan;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [ads, searchTerm, selectedStatus, selectedPlan]);

  // Metric counters
  const counts = React.useMemo(() => {
    const pending = ads.filter((a) => a.status === 'pending').length;
    const approved = ads.filter((a) => a.status === 'approved').length;
    const corrections = ads.filter((a) => a.status === 'corrections').length;
    const featured = ads.filter((a) => a.plan !== 'Básico').length;
    return { pending, approved, corrections, featured };
  }, [ads]);

  const handleDecision = (id: string, newStatus: ModerationAdStatus, reason?: string) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === id
          ? {
              ...ad,
              status: newStatus,
              rejectionReason: reason || ad.rejectionReason,
            }
          : ad,
      ),
    );
  };

  const getStatusBadge = (status: ModerationAdStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pendente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Aprovado
          </span>
        );
      case 'corrections':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            Correções
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            Recusado
          </span>
        );
    }
  };

  const getPlanBadge = (plan: AdPlan) => {
    switch (plan) {
      case 'Destaque Ouro':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
            Ouro
          </span>
        );
      case 'Destaque Prata':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            Prata
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
            Básico
          </span>
        );
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE AD MODERATION (Figma ADM-M-003)                         */}
      {/* ============================================================== */}
      <div
        className="block lg:hidden min-h-screen bg-slate-100 pb-24"
        data-testid="mobile-ad-moderation"
      >
        {/* Mobile Dark Header */}
        <header className="bg-[#0B111E] text-white p-4">
          <div className="flex items-center justify-between">
            <Image
              src="/brand/logo-white.png"
              alt="Feira de Carros"
              width={120}
              height={32}
              priority
              className="h-6 w-auto object-contain"
            />
            <div className="text-right">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                ADMIN • MOBILE WEB
              </span>
              <span className="text-[10px] text-slate-400">Anúncios • ADM-M-003</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ipatinga - MG</span>
            <span>Fila de Moderação</span>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* Mobile Title & Overview */}
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Moderação de Veículos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Validação de anúncios, checagem FIPE e conformidade.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Pendentes
              </span>
              <span className="text-2xl font-black text-amber-600">{counts.pending}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Destaques Pagos
              </span>
              <span className="text-2xl font-black text-slate-900">{counts.featured}</span>
            </div>
          </div>

          {/* Mobile Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar veículo, placa ou vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                  selectedStatus === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Todos ({ads.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('pending')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                  selectedStatus === 'pending'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Pendentes ({counts.pending})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('approved')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                  selectedStatus === 'approved'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Aprovados ({counts.approved})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('corrections')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                  selectedStatus === 'corrections'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Correções ({counts.corrections})
              </button>
            </div>
          </div>

          {/* Mobile Cards List */}
          <div className="space-y-3">
            {filteredAds.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl text-center border border-slate-200 text-slate-500 text-xs">
                Nenhum anúncio encontrado com os filtros selecionados.
              </div>
            ) : (
              filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] text-amber-600 font-bold">
                          {ad.code}
                        </span>
                        <span className="text-slate-400">•</span>
                        {getPlanBadge(ad.plan)}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">{ad.title}</h3>
                      <p className="text-xs text-slate-500">
                        {ad.year} • {ad.mileage} • {ad.transmission}
                      </p>
                    </div>
                    <div>{getStatusBadge(ad.status)}</div>
                  </div>

                  {/* Price & FIPE */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Preço Anunciado
                      </span>
                      <span className="text-sm font-black text-slate-900">{ad.priceFormatted}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Tabela FIPE
                      </span>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-xs font-semibold text-slate-700">
                          {ad.fipePriceFormatted}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1 rounded ${
                            ad.fipeVariation.startsWith('-')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ad.fipeVariation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller & Location */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Vendedor:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[180px]">
                        {ad.sellerName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Localidade:</span>
                      <span className="text-slate-800">{ad.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Placa:</span>
                      <span className="font-mono font-medium text-slate-800">{ad.plateMasked}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInspectingAd(ad)}
                    className="w-full py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Revisar anúncio
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fixed Mobile Navigation with Anuncios Active */}
        <AdminMobileNavigation />
      </div>

      {/* ============================================================== */}
      {/* DESKTOP AD MODERATION (Figma ADM-D-004)                        */}
      {/* ============================================================== */}
      <div className="hidden lg:block" data-testid="desktop-ad-moderation">
        <AdminShell breadcrumbs={['Admin', 'Anúncios']}>
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Moderação de Anúncios
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Fila de revisão técnica, conformidade de preço FIPE e moderação de veículos (Figma
                  ADM-D-004).
                </p>
              </div>

              {/* RBAC Callout Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                <span>Autorização exclusiva • Main Admin</span>
              </div>
            </div>

            {/* Metric KPI Cards Strip */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pendentes de Revisão
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.pending}
                </div>
                <p className="text-[11px] text-amber-700 mt-1 font-medium">
                  Aguardando moderação para publicação
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Anúncios Ativos
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.approved + 1248}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  +5,4% publicados neste mês no Vale do Aço
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Com Alteração Pendente
                  </span>
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.corrections + 6}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Revisões de preço e fotos enviadas
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Destaques Pagos
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.featured}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Planos Ouro e Prata priorizados</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar veículo, marca, modelo, código ou vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-slate-800"
                />
              </div>

              {/* Segmented Status Controls */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedStatus === 'all'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({ads.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedStatus === 'pending'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pendentes ({counts.pending})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('approved')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedStatus === 'approved'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Aprovados
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('corrections')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedStatus === 'corrections'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Correções
                </button>
              </div>

              {/* Plan Filter Select */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value as 'all' | AdPlan)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                >
                  <option value="all">Todos os Planos</option>
                  <option value="Básico">Básico</option>
                  <option value="Destaque Prata">Destaque Prata</option>
                  <option value="Destaque Ouro">Destaque Ouro</option>
                </select>
              </div>
            </div>

            {/* Desktop Table (Figma ADM-D-004) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                      <th className="py-3.5 px-4">Código / Veículo</th>
                      <th className="py-3.5 px-4">Preço Anunciado / FIPE</th>
                      <th className="py-3.5 px-4">Anunciante</th>
                      <th className="py-3.5 px-4">Plano</th>
                      <th className="py-3.5 px-4">Localidade</th>
                      <th className="py-3.5 px-4">Situação</th>
                      <th className="py-3.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredAds.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <p className="text-sm font-semibold">Nenhum anúncio encontrado</p>
                          <p className="text-xs mt-1">
                            Tente ajustar os filtros ou termos de pesquisa.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredAds.map((ad) => (
                        <tr key={ad.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-500">
                                <Car className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block group-hover:text-red-700 transition-colors">
                                  {ad.title}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                  <span className="font-mono text-amber-700 font-semibold">
                                    {ad.code}
                                  </span>
                                  <span>•</span>
                                  <span>{ad.year}</span>
                                  <span>•</span>
                                  <span>{ad.mileage}</span>
                                  <span>•</span>
                                  <span>{ad.transmission}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>
                              <span className="font-extrabold text-slate-900 block text-xs">
                                {ad.priceFormatted}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] mt-0.5">
                                <span className="text-slate-400">
                                  FIPE: {ad.fipePriceFormatted}
                                </span>
                                <span
                                  className={`font-semibold px-1 py-0.2 rounded ${
                                    ad.fipeVariation.startsWith('-')
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-amber-50 text-amber-800'
                                  }`}
                                >
                                  {ad.fipeVariation}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>
                              <div className="flex items-center gap-1 font-semibold text-slate-800">
                                <span>{ad.sellerName}</span>
                                {ad.sellerVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 capitalize">
                                {ad.sellerType === 'concessionaria'
                                  ? 'Concessionária'
                                  : 'Particular'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">{getPlanBadge(ad.plan)}</td>
                          <td className="py-3.5 px-4">
                            <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                              {ad.location}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">{getStatusBadge(ad.status)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setInspectingAd(ad)}
                              className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors shadow-2xs text-xs inline-flex items-center gap-1"
                            >
                              <span>Revisar</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Exibindo <strong>{filteredAds.length}</strong> de <strong>{ads.length}</strong>{' '}
                  anúncios em moderação
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  AMBIENTE DEMONSTRATIVO • Fila operacional
                </span>
              </div>
            </div>
          </div>
        </AdminShell>
      </div>

      {/* Inspection Modal */}
      <ListingInspectionModal
        ad={inspectingAd}
        isOpen={inspectingAd !== null}
        onClose={() => setInspectingAd(null)}
        onDecision={handleDecision}
      />
    </>
  );
}
