'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  PUBLIC_VEHICLE_CATALOG,
  type PublicVehicleItem,
} from '../../lib/adapters/buyer-catalog-adapter';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { PublicVehicleCard } from '../components/PublicVehicleCard';
import {
  IconAlert,
  IconArrowRight,
  IconCar,
  IconCheck,
  IconCross,
  IconHeart,
  IconLock,
  IconMotorcycle,
  IconSearch,
  IconShield,
  IconTrash,
  IconTruck,
  IconUser,
} from '../components/SellerIcons';

export default function BuyerFavoritesPage() {
  const { favorites, isAuthenticated, loginSimulation, clearFavorites, restoreDemoFavorites } =
    useBuyerStore();

  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Carros' | 'Motos' | 'Caminhões'>(
    'Todos',
  );
  const [sortBy, setSortBy] = useState<
    'recentes' | 'menor_preco' | 'maior_preco' | 'menor_km' | 'maior_ano'
  >('recentes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Look up full vehicle objects from catalog for each favorite ID
  const favoritedVehicles = useMemo(() => {
    return favorites
      .map((id) => PUBLIC_VEHICLE_CATALOG.find((v) => v.id === id))
      .filter((v): v is PublicVehicleItem => Boolean(v));
  }, [favorites]);

  // Counts by category
  const counts = useMemo(() => {
    return {
      Todos: favoritedVehicles.length,
      Carros: favoritedVehicles.filter((v) => v.category === 'Carros').length,
      Motos: favoritedVehicles.filter((v) => v.category === 'Motos').length,
      Caminhões: favoritedVehicles.filter((v) => v.category === 'Caminhões').length,
    };
  }, [favoritedVehicles]);

  // Filtered & Sorted list
  const displayVehicles = useMemo(() => {
    let list = [...favoritedVehicles];

    if (activeCategory !== 'Todos') {
      list = list.filter((v) => v.category === activeCategory);
    }

    if (sortBy === 'menor_preco') {
      list.sort((a, b) => a.priceCents - b.priceCents);
    } else if (sortBy === 'maior_preco') {
      list.sort((a, b) => b.priceCents - a.priceCents);
    } else if (sortBy === 'menor_km') {
      list.sort((a, b) => a.mileageKm - b.mileageKm);
    } else if (sortBy === 'maior_ano') {
      list.sort((a, b) => b.yearModel - a.yearModel);
    }

    return list;
  }, [favoritedVehicles, activeCategory, sortBy]);

  const unavailableCount = useMemo(() => {
    return favoritedVehicles.filter((v) => v.isSold || v.isUnavailable).length;
  }, [favoritedVehicles]);

  const handleSimulateLogin = () => {
    loginSimulation();
    if (typeof document !== 'undefined') {
      document.cookie = 'fdc_web_session=mock-buyer-session; path=/; max-age=86400';
    }
    setFeedbackToast('Sessão simulada com sucesso! Acessando favoritos.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleClearAll = () => {
    if (confirm('Tem certeza que deseja remover todos os veículos dos favoritos?')) {
      clearFavorites();
      setFeedbackToast('Todos os favoritos foram removidos.');
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#68788e] mb-4"
        >
          <Link href="/" className="hover:text-[#17223a] transition-colors">
            Início
          </Link>
          <span>/</span>
          <span className="text-[#17223a] font-medium">Meus Favoritos</span>
        </nav>

        {/* FEEDBACK TOAST */}
        {feedbackToast && (
          <output
            aria-live="polite"
            className="mb-4 bg-[#101d34] text-white text-[13px] px-4 py-2.5 rounded-[8px] shadow-lg flex items-center justify-between animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <IconCheck className="size-4 text-[#22c55e]" />
              <span>{feedbackToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackToast(null)}
              className="text-[#94a3b8] hover:text-white"
            >
              <IconCross className="size-4" />
            </button>
          </output>
        )}

        {/* CASE 1: UN僱THENTICATED GUEST -> FIGMA 840:317 (DESKTOP) / 840:646 (MOBILE) */}
        {!isAuthenticated && (
          <div className="max-w-[760px] mx-auto py-8 sm:py-14 text-center">
            <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-8 sm:p-12 shadow-sm">
              <div className="size-20 mx-auto rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#e0151f] mb-6">
                <IconHeart className="size-10" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                Figma 840:317 • WEB-004
              </span>

              <h1 className="text-[24px] sm:text-[32px] font-bold text-[#14223b] mt-4 tracking-tight">
                Entre para acessar seus favoritos
              </h1>

              <p className="text-[14px] sm:text-[16px] text-[#62718a] max-w-[520px] mx-auto mt-2 leading-relaxed">
                Salve veículos para acompanhar alterações de preço, comparar opcionais e acessar sua
                lista em qualquer dispositivo.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
                <Link
                  href="/entrar?redirect=/favoritos"
                  className="w-full sm:w-auto min-w-[200px] h-[46px] bg-[#e0151f] hover:bg-[#c41217] text-white text-[14px] font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <IconLock className="size-4" />
                  <span>Entrar na minha conta</span>
                </Link>

                <Link
                  href="/cadastrar?redirect=/favoritos"
                  className="w-full sm:w-auto min-w-[200px] h-[46px] bg-white hover:bg-slate-50 border border-[#cbd5e1] text-[#14223b] text-[14px] font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-colors"
                >
                  <IconUser className="size-4" />
                  <span>Criar conta grátis</span>
                </Link>
              </div>

              {/* DEMO / SIMULATION SHORTCUT FOR REVIEWERS (NON-PRODUCTION ONLY) */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-8 pt-6 border-t border-[#f1f5f9] flex flex-col items-center">
                  <p className="text-[12px] text-[#64748b] mb-2 font-mono">
                    Ambiente de Demonstração / QA:
                  </p>
                  <button
                    type="button"
                    onClick={handleSimulateLogin}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[8px] text-[12px] font-semibold text-[#1e293b] transition-colors"
                  >
                    <span>Simular login como João Silva (Ver favoritos cadastrados)</span>
                    <IconArrowRight className="size-3.5 text-[#e0151f]" />
                  </button>
                </div>
              )}
            </div>

            {/* Platform Trust Note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#64748b]">
              <IconShield className="size-4 text-[#16a34a]" />
              <span>
                Seus dados de navegação são protegidos. Apenas membros autenticados têm
                sincronização de favoritos.
              </span>
            </div>
          </div>
        )}

        {/* CASE 2: AUTHENTICATED BUT EMPTY FAVORITES -> FIGMA 840:110 (DESKTOP) / 840:527 (MOBILE) */}
        {isAuthenticated && favoritedVehicles.length === 0 && (
          <div className="max-w-[760px] mx-auto py-8 sm:py-14 text-center">
            <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-8 sm:p-12 shadow-sm">
              <div className="size-20 mx-auto rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] mb-6">
                <IconHeart className="size-10" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                Figma 840:110 • WEB-004 EMPTY STATE
              </span>

              <h1 className="text-[24px] sm:text-[30px] font-bold text-[#14223b] mt-4 tracking-tight">
                Você ainda não tem nenhum veículo favorito
              </h1>

              <p className="text-[14px] sm:text-[16px] text-[#62718a] max-w-[500px] mx-auto mt-2 leading-relaxed">
                Navegue pelo catálogo público e clique no ícone de coração para salvar os carros,
                motos ou caminhões que mais gostar.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
                <Link
                  href="/veiculos"
                  className="w-full sm:w-auto min-w-[220px] h-[46px] bg-[#e0151f] hover:bg-[#c41217] text-white text-[14px] font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <IconSearch className="size-4" />
                  <span>Explorar todos os veículos</span>
                </Link>

                <button
                  type="button"
                  onClick={restoreDemoFavorites}
                  className="w-full sm:w-auto min-w-[220px] h-[46px] bg-white hover:bg-slate-50 border border-[#cbd5e1] text-[#14223b] text-[14px] font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Restaurar favoritos de demonstração</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CASE 3: AUTHENTICATED WITH FAVORITES -> FIGMA 733:232 (DESKTOP) / 733:274 (MOBILE) */}
        {isAuthenticated && favoritedVehicles.length > 0 && (
          <div className="space-y-6">
            {/* Header with Title and Counts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[24px] sm:text-[30px] font-bold text-[#14223b] tracking-tight">
                    Meus Favoritos
                  </h1>
                  <span className="bg-[#fee2e2] text-[#e0151f] text-[13px] font-bold px-2.5 py-0.5 rounded-full">
                    {favoritedVehicles.length} {favoritedVehicles.length === 1 ? 'salvo' : 'salvos'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    DEMO DATA
                  </span>
                </div>
                <p className="text-[13px] sm:text-[14px] text-[#62718a] mt-1">
                  Acompanhe os veículos que você salvou para comparar ou entrar em contato.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[12px] font-semibold text-[#b91c1c] hover:text-[#991b1b] flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] hover:bg-[#fee2e2] transition-colors"
                >
                  <IconTrash className="size-3.5" />
                  <span>Limpar todos</span>
                </button>
                <Link
                  href="/veiculos"
                  className="text-[12px] font-semibold text-[#14223b] hover:text-[#e0151f] flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white border border-[#e2e8f0] transition-colors shadow-xs"
                >
                  <span>+ Explorar mais veículos</span>
                </Link>
              </div>
            </div>

            {/* Unavailable Listings Notice (if any) */}
            {unavailableCount > 0 && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[10px] p-3.5 flex items-start gap-3 text-[#92400e]">
                <IconAlert className="size-5 shrink-0 mt-0.5 text-[#d97706]" />
                <div className="text-[13px]">
                  <p className="font-semibold">
                    {unavailableCount}{' '}
                    {unavailableCount === 1 ? 'veículo indisponível' : 'veículos indisponíveis'}
                  </p>
                  <p className="text-[#b45309] text-[12px] mt-0.5">
                    Este anúncio foi vendido ou finalizado pelo vendedor. O veículo permanece salvo
                    para sua referência de preços, mas não aceita novos contatos.
                  </p>
                </div>
              </div>
            )}

            {/* Filter Chips Bar & Sort Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e2e8f0]">
              {/* Category Chips matching Figma 733:232 */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {(['Todos', 'Carros', 'Motos', 'Caminhões'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`h-[36px] px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeCategory === cat
                        ? 'bg-[#14223b] text-white shadow-xs'
                        : 'bg-white border border-[#cbd5e1] text-[#475569] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    {cat === 'Carros' && <IconCar className="size-3.5" />}
                    {cat === 'Motos' && <IconMotorcycle className="size-3.5" />}
                    {cat === 'Caminhões' && <IconTruck className="size-3.5" />}
                    <span>{cat}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                        activeCategory === cat
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-[#475569]'
                      }`}
                    >
                      {counts[cat]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort & View Mode */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="sort-select"
                  className="text-[12px] text-[#62718a] whitespace-nowrap hidden sm:inline"
                >
                  Ordenar por:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | 'recentes'
                        | 'menor_preco'
                        | 'maior_preco'
                        | 'menor_km'
                        | 'maior_ano',
                    )
                  }
                  className="h-[36px] px-3 bg-white border border-[#cbd5e1] rounded-[8px] text-[12px] font-medium text-[#14223b] outline-none focus:ring-1 focus:ring-[#b91c1c]"
                >
                  <option value="recentes">Mais recentes</option>
                  <option value="menor_preco">Menor preço</option>
                  <option value="maior_preco">Maior preço</option>
                  <option value="menor_km">Menor km</option>
                  <option value="maior_ano">Ano mais novo</option>
                </select>

                <div className="hidden sm:flex items-center border border-[#cbd5e1] rounded-[8px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[#14223b] text-white'
                        : 'text-[#62718a] hover:bg-slate-50'
                    }`}
                    aria-label="Visualização em grade"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[#14223b] text-white'
                        : 'text-[#62718a] hover:bg-slate-50'
                    }`}
                    aria-label="Visualização em lista"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle Grid or List matching Figma 733:232 / 733:274 */}
            {displayVehicles.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-8 text-center text-[#62718a]">
                <p className="text-[14px]">Nenhum veículo nesta categoria.</p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('Todos')}
                  className="mt-2 text-[#e0151f] text-[13px] font-semibold underline"
                >
                  Ver todos os favoritos
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayVehicles.map((vehicle) => (
                  <PublicVehicleCard key={vehicle.id} vehicle={vehicle} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-w-[960px]">
                {displayVehicles.map((vehicle) => (
                  <PublicVehicleCard key={vehicle.id} vehicle={vehicle} variant="horizontal" />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <MarketplaceFooter />
    </div>
  );
}
