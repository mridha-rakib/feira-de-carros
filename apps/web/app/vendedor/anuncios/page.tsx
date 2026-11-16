'use client';

import { MOCK_SELLER_KPIS, MOCK_SELLER_LISTINGS } from '@/lib/adapters/mock-seller-data';
import type { SellerListingItem, SellerListingStatus } from '@/lib/types/seller-presentation';
import { filterAndSortSellerListings } from '@/lib/utils/seller-listing-filters';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SellerBreadcrumb } from '../../components/SellerBreadcrumb';
import {
  IconCar,
  IconCard,
  IconCheck,
  IconClock,
  IconMoreHorizontal,
  IconPlus,
  IconSearch,
} from '../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../components/SellerNavbar';
import { VehicleStatusBadge } from '../../components/VehicleStatusBadge';

export default function SellerListingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SellerListingStatus>('ALL');
  const [sortBy, setSortBy] = useState<'latest' | 'price_asc' | 'price_desc'>('latest');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const kpis = MOCK_SELLER_KPIS;
  const initialListings = MOCK_SELLER_LISTINGS;

  // Filter & Sort Logic using shared production utility
  const filteredListings = useMemo(() => {
    return filterAndSortSellerListings(initialListings, searchQuery, statusFilter, sortBy);
  }, [initialListings, searchQuery, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col font-sans text-[#111827]">
      {/* Navbar: Approved Seller */}
      <SellerNavbar variant="seller" activeTab="anuncios" />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-16">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meus anúncios', active: true },
          ]}
          mobileShortLabel="Feira de Carros › Meus anúncios"
        />

        {/* Heading & Top CTA (matching 2678:2351-2353) */}
        <div className="mt-2 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#111827] tracking-tight">
              Meus anúncios
            </h1>
            <p className="text-sm sm:text-base text-[#5b6475] mt-1">
              Gerencie seus anúncios, acompanhe os status e mantenha seus veículos sempre
              atualizados.
            </p>
            <p className="text-xs font-semibold text-[#b91c1c] mt-1 md:hidden">
              WEB-020 · Preview demonstrativo
            </p>
          </div>

          <Link
            href="/vendedor/anuncios/novo"
            className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold h-[56px] px-6 rounded-[7px] hidden md:flex items-center gap-3 transition-colors shadow-sm shrink-0 text-[16px]"
          >
            <IconPlus className="size-5" />
            <span>Criar anúncio</span>
          </Link>
        </div>

        {/* Mobile Quick Overview Metrics (matching 627:355) */}
        <div className="grid grid-cols-3 gap-2 md:hidden mb-4">
          <div className="bg-white p-3 rounded-[10px] shadow-2xs border border-[#e2e7ee]">
            <p className="text-2xl font-bold text-[#111827]">{kpis.publishedCount}</p>
            <p className="text-[11px] font-semibold text-[#5b6475] mt-1">Publicado</p>
          </div>
          <div className="bg-white p-3 rounded-[10px] shadow-2xs border border-[#e2e7ee]">
            <p className="text-2xl font-bold text-[#111827]">{kpis.underReviewCount}</p>
            <p className="text-[11px] font-semibold text-[#5b6475] mt-1">Em análise</p>
          </div>
          <div className="bg-white p-3 rounded-[10px] shadow-2xs border border-[#e2e7ee]">
            <p className="text-2xl font-bold text-[#111827]">{kpis.pendingPaymentCount}</p>
            <p className="text-[11px] font-semibold text-[#5b6475] mt-1">Pendente</p>
          </div>
        </div>

        {/* Mobile Create Button */}
        <div className="md:hidden mb-6">
          <Link
            href="/vendedor/anuncios/novo"
            className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold h-[47px] rounded-[10px] flex items-center justify-center gap-2 text-sm shadow-xs"
          >
            <IconPlus className="size-4" />
            <span>Criar anúncio</span>
          </Link>
        </div>

        {/* Desktop KPI Metric Cards (matching 2678:2357-2384) */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* KPI 1: Anúncios */}
          <div className="bg-white border border-[#dbe1e8] rounded-[12px] p-5 shadow-xs flex items-start gap-4">
            <div className="size-9 rounded-lg bg-red-50 text-[#b91c1c] flex items-center justify-center shrink-0">
              <IconCar className="size-6" />
            </div>
            <div>
              <p className="text-[30px] font-semibold text-[#111827] leading-tight">
                {kpis.totalListings}
              </p>
              <p className="text-[17px] font-semibold text-[#111827]">Anúncios</p>
              <p className="text-[13px] text-[#5b6475] mt-0.5">Total de anúncios criados</p>
            </div>
          </div>

          {/* KPI 2: Publicado */}
          <div className="bg-white border border-[#dbe1e8] rounded-[12px] p-5 shadow-xs flex items-start gap-4">
            <div className="size-9 rounded-lg bg-green-50 text-[#159055] flex items-center justify-center shrink-0">
              <IconCheck className="size-6 stroke-[3]" />
            </div>
            <div>
              <p className="text-[30px] font-semibold text-[#111827] leading-tight">
                {kpis.publishedCount}
              </p>
              <p className="text-[17px] font-semibold text-[#111827]">Publicado</p>
              <p className="text-[13px] text-[#5b6475] mt-0.5">Ativo no site</p>
            </div>
          </div>

          {/* KPI 3: Em análise */}
          <div className="bg-white border border-[#dbe1e8] rounded-[12px] p-5 shadow-xs flex items-start gap-4">
            <div className="size-9 rounded-lg bg-amber-50 text-[#b86a0b] flex items-center justify-center shrink-0">
              <IconClock className="size-6" />
            </div>
            <div>
              <p className="text-[30px] font-semibold text-[#111827] leading-tight">
                {kpis.underReviewCount}
              </p>
              <p className="text-[17px] font-semibold text-[#111827]">Em análise</p>
              <p className="text-[13px] text-[#5b6475] mt-0.5">Aguardando aprovação</p>
            </div>
          </div>

          {/* KPI 4: Aguardando pagamento */}
          <div className="bg-white border border-[#dbe1e8] rounded-[12px] p-5 shadow-xs flex items-start gap-4">
            <div className="size-9 rounded-lg bg-amber-50 text-[#b86a0b] flex items-center justify-center shrink-0">
              <IconCard className="size-6" />
            </div>
            <div>
              <p className="text-[30px] font-semibold text-[#111827] leading-tight">
                {kpis.pendingPaymentCount}
              </p>
              <p className="text-[17px] font-semibold text-[#111827]">Aguardando pagamento</p>
              <p className="text-[13px] text-[#5b6475] mt-0.5">Pendente para publicação</p>
            </div>
          </div>
        </div>

        {/* Card: Listings Table & Filters (matching 2678:2385) */}
        <div className="bg-white border border-[#dbe1e8] rounded-[12px] p-4 sm:p-6 shadow-sm">
          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
            {/* Search Input (matching 2678:2386) */}
            <div className="md:col-span-6 lg:col-span-6 bg-white border border-[#dbe1e8] rounded-[8px] h-[52px] px-3.5 flex items-center gap-3">
              <IconSearch className="size-5 text-[#5b6475] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por veículo, marca ou modelo..."
                className="bg-transparent text-[15px] text-[#111827] w-full outline-none placeholder:text-[#5b6475]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#5b6475] hover:text-[#111827]"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Status Filter (matching 2678:2391) */}
            <div className="md:col-span-3 lg:col-span-3">
              <label htmlFor="filter-status-select" className="sr-only">
                Filtrar por status
              </label>
              <select
                id="filter-status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | SellerListingStatus)}
                className="w-full bg-white border border-[#dbe1e8] rounded-[8px] h-[52px] px-3.5 text-[15px] text-[#111827] outline-none cursor-pointer"
              >
                <option value="ALL">Todos os status</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="PENDING_REVIEW">Em análise</option>
                <option value="PENDING_PAYMENT">Aguardando pagamento</option>
              </select>
            </div>

            {/* Sort Select (matching 2678:2393) */}
            <div className="md:col-span-3 lg:col-span-3">
              <label htmlFor="sort-listings-select" className="sr-only">
                Ordenar anúncios
              </label>
              <select
                id="sort-listings-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'price_asc' | 'price_desc')}
                className="w-full bg-white border border-[#dbe1e8] rounded-[8px] h-[52px] px-3.5 text-[15px] text-[#111827] outline-none cursor-pointer"
              >
                <option value="latest">Mais recentes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
            </div>
          </div>

          {/* Desktop Listings Table */}
          <div className="hidden md:block overflow-x-auto">
            {/* Table Header (matching 2678:2395) */}
            <div className="bg-[#eaeff4] rounded-[6px] h-[49px] px-4 grid grid-cols-12 items-center text-[15px] font-semibold text-[#111827]">
              <div className="col-span-5">Veículo</div>
              <div className="col-span-2">Preço</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Data de criação</div>
              <div className="col-span-1 text-right">Ações</div>
            </div>

            {/* Table Rows */}
            {filteredListings.length > 0 ? (
              <div className="divide-y divide-[#dbe1e8] mt-2">
                {filteredListings.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 px-4 grid grid-cols-12 items-center hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Col: Veículo (Col 1-5) */}
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="relative h-[90px] w-[150px] rounded-[8px] overflow-hidden bg-gray-100 shrink-0 border border-[#e2e7ee]">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      </div>
                      <div>
                        <h4 className="text-[17px] font-semibold text-[#111827]">{item.title}</h4>
                        <p className="text-[13px] text-[#5b6475] mt-1">{item.subtitle}</p>
                        <span className="text-[11px] text-[#8e98a8] font-mono mt-0.5 block">
                          ID: {item.id}
                        </span>
                      </div>
                    </div>

                    {/* Col: Preço (Col 6-7) */}
                    <div className="col-span-2">
                      <span className="text-[17px] font-semibold text-[#111827]">
                        {item.priceFormatted}
                      </span>
                    </div>

                    {/* Col: Status (Col 8-9) */}
                    <div className="col-span-2">
                      <VehicleStatusBadge status={item.status} label={item.statusLabel} />
                    </div>

                    {/* Col: Data de criação (Col 10-11) */}
                    <div className="col-span-2">
                      <p className="text-[14px] font-semibold text-[#111827]">
                        {item.createdAtFormatted}
                      </p>
                      <p className="text-[13px] text-[#5b6475]">{item.createdAtTime}</p>
                    </div>

                    {/* Col: Ações (Col 12) */}
                    <div className="col-span-1 text-right relative">
                      <button
                        type="button"
                        aria-label={`Ações para ${item.title}`}
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-2 border border-[#dbe1e8] hover:bg-gray-100 rounded-[8px] inline-flex items-center justify-center transition-colors text-[#111827]"
                      >
                        <IconMoreHorizontal className="size-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg border border-[#e2e7ee] z-30 text-left">
                          <Link
                            href={`/vendedor/anuncios/${item.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setActiveMenuId(null)}
                          >
                            Visualizar anúncio
                          </Link>
                          <Link
                            href={`/vendedor/anuncios/${item.id}/editar`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setActiveMenuId(null)}
                          >
                            Editar anúncio
                          </Link>
                          {item.status === 'PUBLISHED' && (
                            <Link
                              href={`/vendedor/anuncios/${item.id}/impulsionar`}
                              className="block px-4 py-2 text-sm text-[#b91c1c] font-medium hover:bg-red-50"
                              onClick={() => setActiveMenuId(null)}
                            >
                              Impulsionar anúncio
                            </Link>
                          )}
                          {item.status === 'PENDING_PAYMENT' && (
                            <Link
                              href={`/vendedor/pedidos/${item.id}/pix`}
                              className="block px-4 py-2 text-sm text-amber-700 font-medium hover:bg-amber-50"
                              onClick={() => setActiveMenuId(null)}
                            >
                              Efetuar pagamento
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <IconCar className="size-12 mx-auto text-[#8e98a8] mb-3 opacity-50" />
                <h4 className="text-base font-semibold text-[#111827]">
                  Nenhum anúncio encontrado
                </h4>
                <p className="text-sm text-[#5b6475] mt-1">
                  Tente alterar seus filtros ou termos de busca.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-4 text-sm font-semibold text-[#b91c1c] hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>

          {/* Mobile Listing Cards (matching 627:369-389) */}
          <div className="md:hidden space-y-4">
            <h3 className="text-base font-bold text-[#111827]">Anúncios da minha conta</h3>

            {filteredListings.length > 0 ? (
              filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f4f8fb] border border-[#e2e7ee] rounded-[9px] p-3 flex gap-3 items-start"
                >
                  <div className="w-[110px] shrink-0">
                    <div className="relative h-[85px] w-full rounded-[8px] overflow-hidden bg-gray-200">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="110px"
                      />
                    </div>
                    <span className="text-[9px] text-[#5b6475] block mt-1">Foto ilustrativa</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-[#111827] truncate">{item.title}</h4>
                    <p className="text-[10px] text-[#5b6475] font-mono mt-0.5">{item.id}</p>
                    <p className="text-[13px] font-bold text-[#111827] mt-1">
                      {item.priceFormatted}
                    </p>

                    <div className="mt-1.5">
                      <VehicleStatusBadge status={item.status} label={item.statusLabel} />
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#e2e7ee] flex items-center justify-between">
                      <span className="text-[10px] text-[#5b6475]">{item.createdAtFormatted}</span>
                      <Link
                        href={`/vendedor/anuncios/${item.id}`}
                        className="text-[11px] font-semibold text-[#b91c1c] hover:underline"
                      >
                        Consultar estado
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-[#111827]">Nenhum anúncio encontrado</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-2 text-xs font-semibold text-[#b91c1c]"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
