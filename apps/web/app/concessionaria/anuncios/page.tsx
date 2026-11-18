'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconCamera,
  IconClock,
  IconEye,
  IconPlus,
  IconSearch,
  IconSparkles,
} from '@/app/components/SellerIcons';
import { DealerInventoryMetricsCards } from '@/app/components/dealership/DealerInventoryMetricsCards';
import {
  type DealerModalType,
  DealerVehicleActionModal,
} from '@/app/components/dealership/DealerVehicleActionModal';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import {
  type DealerSortOption,
  type DealerVehicleListing,
  type DealerVehiclePlan,
  type DealerVehicleStatus,
  MOCK_DEALER_INVENTORY_METRICS,
  filterAndSortDealerVehicles,
} from '@/lib/adapters/mock-dealer-inventory';
import { useDealerInventoryStore } from '@/stores/use-dealer-inventory-store';
import { useDealerStore } from '@/stores/use-dealer-store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

export default function DealershipInventoryPage() {
  const { application, account } = useDealerStore();
  const { vehicles, togglePause, renewVehicle } = useDealerInventoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DealerVehicleStatus>('all');
  const [planFilter, setPlanFilter] = useState<'all' | DealerVehiclePlan>('all');
  const [sortBy, setSortBy] = useState<DealerSortOption>('latest');

  // Modal states for view / renew preview
  const [modalType, setModalType] = useState<DealerModalType>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<DealerVehicleListing | null>(null);

  // Filtered & Sorted listings
  const filteredVehicles = useMemo(() => {
    return filterAndSortDealerVehicles(vehicles, searchQuery, statusFilter, planFilter, sortBy);
  }, [vehicles, searchQuery, statusFilter, planFilter, sortBy]);

  // Dynamic metrics calculation based on current vehicles list
  const activeMetrics = useMemo(() => {
    const activeCount = vehicles.filter((v) => v.status === 'active').length;
    const inReviewCount = vehicles.filter((v) => v.status === 'in_review').length;
    const expiringCount = vehicles.filter((v) => v.status === 'expiring').length;
    const pausedCount = vehicles.filter((v) => v.status === 'paused').length;
    const soldCount = vehicles.filter((v) => v.status === 'sold').length;

    // Calculate aggregated views dynamically
    const totalViewsCalculated = vehicles.reduce((sum, v) => sum + (v.viewsCount || 0), 0);

    return {
      ...MOCK_DEALER_INVENTORY_METRICS,
      totalViews: Math.max(totalViewsCalculated, MOCK_DEALER_INVENTORY_METRICS.totalViews),
      totalVehicles: vehicles.length,
      activeVehicles: activeCount,
      inReviewVehicles: inReviewCount,
      expiringVehicles: expiringCount,
      pausedVehicles: pausedCount,
      soldVehicles: soldCount,
    };
  }, [vehicles]);

  const handleOpenModal = (type: DealerModalType, vehicle: DealerVehicleListing | null = null) => {
    setSelectedVehicle(vehicle);
    setModalType(type);
  };

  const handleConfirmRenew = (vehicleId: string) => {
    renewVehicle(vehicleId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPlanFilter('all');
    setSortBy('latest');
  };

  const isFiltered =
    searchQuery !== '' || statusFilter !== 'all' || planFilter !== 'all' || sortBy !== 'latest';

  const dealershipName =
    application.dealershipName || account?.dealershipName || 'Líder Veículos e Seminovos Ltda';
  const dealershipLocation = `${application.city || 'Ipatinga'} - ${application.state || 'MG'}`;

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[70px] py-8 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <span className="text-[#697a95]">Minha Concessionária</span>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Estoque</span>
        </div>

        {/* Navigation Tabs (Estoque / Perfil Público / Showroom) */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#dee6f1] pb-3 overflow-x-auto">
          <Link
            href="/concessionaria/anuncios"
            className="text-[13px] font-semibold text-[#b91c1c] bg-[#fee2e2]/60 px-3 py-1.5 rounded-[6px] transition-colors"
          >
            Estoque da frota
          </Link>
          <Link
            href="/concessionaria/perfil"
            className="text-[13px] font-medium text-[#697a95] hover:text-[#17243f] px-3 py-1.5 rounded-[6px] transition-colors"
          >
            Perfil público
          </Link>
          <Link
            href="/concessionarias/dealer-lider-seminovos"
            className="text-[13px] font-medium text-[#697a95] hover:text-[#17243f] px-3 py-1.5 rounded-[6px] transition-colors flex items-center gap-1.5 ml-auto"
          >
            <IconEye className="size-3.5" />
            <span>Ver showroom público</span>
          </Link>
        </div>

        {/* Page Header Heading with Title, Dealership Badge & Working New Listing CTA */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] sm:text-[32px] font-bold text-[#17243f] tracking-tight">
                Estoque da Concessionária
              </h1>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                Conta Ativa
              </span>
            </div>
            <p className="text-[14px] text-[#697a95] mt-1">
              {dealershipName} · {dealershipLocation}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/concessionaria/perfil"
              data-testid="btn-edit-profile-nav"
              className="bg-white border border-[#d2dce8] hover:bg-[#f8fafc] text-[#17243f] font-semibold text-[14px] h-[46px] px-4 rounded-[8px] flex items-center gap-2 transition-colors shadow-2xs"
            >
              <span>Editar perfil</span>
            </Link>
            <Link
              href="/concessionaria/anuncios/novo"
              data-testid="btn-new-listing"
              className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[14px] h-[46px] px-5 rounded-[8px] flex items-center gap-2 transition-colors shadow-xs"
            >
              <IconPlus className="size-4" />
              <span>Novo anúncio</span>
            </Link>
          </div>
        </div>

        {/* Analytics Summary Cards (Figma 1592:3472 & 1592:3701) */}
        <DealerInventoryMetricsCards metrics={activeMetrics} />

        {/* Inventory Management Card */}
        <div className="bg-white border border-[#dee6f1] rounded-[14px] shadow-xs overflow-hidden">
          {/* Controls Bar: Search Input, Status Filter, Plan Filter, Sorting */}
          <div className="p-4 sm:p-5 border-b border-[#dee6f1] bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar (Col 1-5) */}
              <div className="md:col-span-5 relative">
                <IconSearch className="size-4 text-[#8a99ad] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por marca, modelo ou placa..."
                  data-testid="input-dealer-search"
                  className="w-full h-[42px] pl-10 pr-4 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] placeholder-[#8a99ad] focus:outline-hidden focus:border-[#b91c1c] focus:bg-white transition-colors"
                />
              </div>

              {/* Status Filter Dropdown (Col 6-7) */}
              <div className="md:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | DealerVehicleStatus)}
                  data-testid="select-status-filter"
                  className="w-full h-[42px] px-3 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] font-medium focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativo</option>
                  <option value="in_review">Em análise</option>
                  <option value="expiring">Expirando</option>
                  <option value="paused">Pausado</option>
                  <option value="sold">Vendido</option>
                </select>
              </div>

              {/* Plan Filter Dropdown (Col 8-9) */}
              <div className="md:col-span-2">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as 'all' | DealerVehiclePlan)}
                  data-testid="select-plan-filter"
                  className="w-full h-[42px] px-3 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] font-medium focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                >
                  <option value="all">Todos os planos</option>
                  <option value="premium">Plano Premium</option>
                  <option value="essential">Plano Essencial</option>
                  <option value="none">Sem impulsionamento</option>
                </select>
              </div>

              {/* Sort Order Dropdown (Col 10-12) */}
              <div className="md:col-span-3 flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as DealerSortOption)}
                  data-testid="select-sort-order"
                  className="w-full h-[42px] px-3 bg-[#f8fafc] border border-[#d2dce8] rounded-[8px] text-[13px] text-[#17243f] font-medium focus:outline-hidden focus:border-[#b91c1c] transition-colors"
                >
                  <option value="latest">Mais recentes</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                  <option value="views_desc">Mais visualizados</option>
                </select>

                {isFiltered && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    data-testid="btn-clear-filters"
                    title="Limpar todos os filtros"
                    className="h-[42px] px-3 bg-gray-100 hover:bg-gray-200 text-[#475569] text-[12px] font-semibold rounded-[8px] whitespace-nowrap transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Table View (Figma 1592:3527) */}
          <div className="hidden md:block overflow-x-auto">
            <table
              className="w-full border-collapse text-left"
              data-testid="dealer-inventory-table"
            >
              <thead>
                <tr className="border-b border-[#dee6f1] bg-[#f8fafc] text-[12px] font-semibold text-[#697a95] uppercase tracking-wider">
                  <th scope="col" className="py-3.5 pl-6 pr-4 min-w-[340px]">
                    Veículo
                  </th>
                  <th scope="col" className="py-3.5 px-4 min-w-[120px]">
                    Preço
                  </th>
                  <th scope="col" className="py-3.5 px-4 min-w-[130px]">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4 min-w-[170px]">
                    Plano
                  </th>
                  <th scope="col" className="py-3.5 px-4 min-w-[150px]">
                    Validade
                  </th>
                  <th scope="col" className="py-3.5 px-4 min-w-[130px]">
                    Visualizações
                  </th>
                  <th scope="col" className="py-3.5 pr-6 pl-4 text-right min-w-[200px]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => {
                    const isActive = vehicle.status === 'active';
                    const isExpiring = vehicle.status === 'expiring';
                    const isPaused = vehicle.status === 'paused';
                    const isSold = vehicle.status === 'sold';
                    const hasRevision = Boolean(vehicle.pendingRevision);

                    return (
                      <tr
                        key={vehicle.id}
                        data-testid={`vehicle-row-${vehicle.id}`}
                        className="hover:bg-[#f8fafc]/80 transition-colors group"
                      >
                        {/* Column 1: Veículo */}
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3.5">
                            {/* Photo with photo count badge */}
                            <div className="relative w-[119px] h-[85px] rounded-[8px] overflow-hidden bg-[#e2e8f0] shrink-0 border border-[#dee6f1]">
                              <Image
                                src={vehicle.imageUrl}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-1.5 right-1.5 bg-[#182539]/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs">
                                <IconCamera className="size-3" />
                                <span>{vehicle.photoCount}</span>
                              </div>
                            </div>

                            {/* Title, version and metadata */}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-[15px] font-bold text-[#17243f] leading-snug">
                                  {vehicle.make} {vehicle.model}
                                </h3>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-[#475569] border border-gray-200">
                                  {vehicle.plate}
                                </span>
                              </div>
                              <p className="text-[12px] text-[#697a95] mt-0.5 line-clamp-1">
                                {vehicle.version}
                              </p>
                              <p className="text-[11px] text-[#8a99ad] mt-1">
                                {vehicle.year} · {vehicle.mileageKm.toLocaleString('pt-BR')} km ·{' '}
                                {vehicle.fuel} · {vehicle.transmission}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Preço */}
                        <td className="py-4 px-4">
                          <span className="text-[15px] font-bold text-[#17243f]">
                            {vehicle.formattedPrice}
                          </span>
                        </td>

                        {/* Column 3: Status Badge */}
                        <td className="py-4 px-4">
                          {vehicle.status === 'active' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e5f7ed] text-[#14865a] border border-[#a3e6c2]">
                              Ativo
                            </span>
                          )}
                          {vehicle.status === 'in_review' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eaf3ff] text-[#2265bb] border border-[#bfdbfe]">
                              Em análise
                            </span>
                          )}
                          {vehicle.status === 'expiring' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff3dc] text-[#d97706] border border-[#fde68a]">
                              Expirando
                            </span>
                          )}
                          {vehicle.status === 'paused' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f2f5fa] text-[#6e7890] border border-[#e2e8f0]">
                              Pausado
                            </span>
                          )}
                          {vehicle.status === 'sold' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]">
                              Vendido
                            </span>
                          )}
                        </td>

                        {/* Column 4: Plano */}
                        <td className="py-4 px-4">
                          {vehicle.plan === 'premium' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]">
                              <IconSparkles className="size-3" />
                              Plano Premium
                            </span>
                          )}
                          {vehicle.plan === 'essential' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd]">
                              Plano Essencial
                            </span>
                          )}
                          {vehicle.plan === 'none' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-normal bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]">
                              Sem impulsionamento
                            </span>
                          )}
                        </td>

                        {/* Column 5: Validade */}
                        <td className="py-4 px-4">
                          <span
                            className={`text-[12px] font-medium ${
                              isExpiring
                                ? 'text-[#d97706] font-semibold'
                                : vehicle.status === 'in_review' || isPaused || isSold
                                  ? 'text-[#8a99ad]'
                                  : 'text-[#17243f]'
                            }`}
                          >
                            {vehicle.expiresAtLabel}
                          </span>
                        </td>

                        {/* Column 6: Visualizações */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-[12px] text-[#697a95]">
                            <IconEye className="size-3.5 text-[#8a99ad]" />
                            <span>{vehicle.viewsCount.toLocaleString('pt-BR')}</span>
                          </div>
                        </td>

                        {/* Column 7: Ações */}
                        <td className="py-4 pr-6 pl-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Renovar action for expiring */}
                            {isExpiring && (
                              <button
                                type="button"
                                onClick={() => handleOpenModal('renew', vehicle)}
                                data-testid={`btn-renew-${vehicle.id}`}
                                className="px-2.5 py-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] text-[11px] font-semibold rounded-[6px] transition-colors"
                              >
                                Renovar
                              </button>
                            )}

                            {/* Pause / Activate Toggle */}
                            {isActive && (
                              <button
                                type="button"
                                onClick={() => togglePause(vehicle.id)}
                                data-testid={`btn-pause-${vehicle.id}`}
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#475569] text-[11px] font-medium rounded-[6px] transition-colors"
                              >
                                Pausar
                              </button>
                            )}

                            {isPaused && (
                              <button
                                type="button"
                                onClick={() => togglePause(vehicle.id)}
                                data-testid={`btn-activate-${vehicle.id}`}
                                className="px-2.5 py-1.5 bg-[#e5f7ed] hover:bg-[#cbf2dc] text-[#14865a] text-[11px] font-semibold rounded-[6px] transition-colors"
                              >
                                Ativar
                              </button>
                            )}

                            {/* Revision Comparison Link if pending revision */}
                            {hasRevision && (
                              <Link
                                href={`/concessionaria/anuncios/${vehicle.id}/revisoes`}
                                data-testid={`btn-revisions-${vehicle.id}`}
                                className="px-2.5 py-1.5 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] text-[11px] font-semibold rounded-[6px] transition-colors"
                              >
                                Revisão
                              </Link>
                            )}

                            {/* Direct Edit Route Link */}
                            <Link
                              href={`/concessionaria/anuncios/${vehicle.id}/editar`}
                              data-testid={`btn-edit-${vehicle.id}`}
                              className="px-2.5 py-1.5 bg-white border border-[#dee6f1] hover:bg-[#f8fafc] text-[#17243f] text-[11px] font-medium rounded-[6px] transition-colors"
                            >
                              Editar
                            </Link>

                            {/* Mark as Sold Link */}
                            {!isSold && (
                              <Link
                                href={`/concessionaria/anuncios/${vehicle.id}/vendido`}
                                data-testid={`btn-sold-${vehicle.id}`}
                                title="Marcar como vendido"
                                className="px-2 py-1.5 text-gray-500 hover:text-[#b91c1c] text-[11px] font-medium transition-colors"
                              >
                                Vendido
                              </Link>
                            )}

                            {/* View Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => handleOpenModal('view', vehicle)}
                              data-testid={`btn-view-${vehicle.id}`}
                              className="px-2.5 py-1.5 bg-white border border-[#dee6f1] hover:bg-[#f8fafc] text-[#b91c1c] text-[11px] font-semibold rounded-[6px] transition-colors"
                            >
                              Ver
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="max-w-[360px] mx-auto text-center">
                        <div className="size-12 rounded-full bg-[#f1f5f9] text-[#64748b] flex items-center justify-center mx-auto mb-3">
                          <IconSearch className="size-6" />
                        </div>
                        <h4 className="text-[16px] font-bold text-[#17243f]">
                          Nenhum veículo encontrado
                        </h4>
                        <p className="text-[13px] text-[#697a95] mt-1 leading-relaxed">
                          Não encontramos anúncios correspondentes aos filtros aplicados.
                        </p>
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="mt-4 px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[12px] font-semibold rounded-[6px] transition-colors"
                        >
                          Limpar todos os filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (Figma 1592:3701) */}
          <div
            className="md:hidden divide-y divide-[#dee6f1]"
            data-testid="dealer-inventory-mobile-list"
          >
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => {
                const isActive = vehicle.status === 'active';
                const isExpiring = vehicle.status === 'expiring';
                const isPaused = vehicle.status === 'paused';
                const isSold = vehicle.status === 'sold';
                const hasRevision = Boolean(vehicle.pendingRevision);

                return (
                  <div
                    key={vehicle.id}
                    data-testid={`mobile-card-${vehicle.id}`}
                    className="p-4 bg-white space-y-3"
                  >
                    {/* Top Row: Thumbnail + Title & Price */}
                    <div className="flex gap-3">
                      <div className="relative w-[110px] h-[85px] rounded-[8px] overflow-hidden bg-gray-100 shrink-0 border border-[#dee6f1]">
                        <Image
                          src={vehicle.imageUrl}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-[#182539]/90 text-white text-[9px] font-semibold px-1 py-0.5 rounded flex items-center gap-0.5">
                          <IconCamera className="size-2.5" />
                          <span>{vehicle.photoCount}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-[14px] font-bold text-[#17243f] truncate">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-[#475569]">
                            {vehicle.plate}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#697a95] truncate mt-0.5">
                          {vehicle.version}
                        </p>
                        <p className="text-[11px] text-[#8a99ad] mt-0.5">
                          {vehicle.year} · {vehicle.mileageKm.toLocaleString('pt-BR')} km
                        </p>
                        <p className="text-[15px] font-bold text-[#17243f] mt-1">
                          {vehicle.formattedPrice}
                        </p>
                      </div>
                    </div>

                    {/* Middle Row: Badges & Metrics */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#f1f5f9] text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {vehicle.status === 'active' && (
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-[#e5f7ed] text-[#14865a]">
                            Ativo
                          </span>
                        )}
                        {vehicle.status === 'in_review' && (
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-[#eaf3ff] text-[#2265bb]">
                            Em análise
                          </span>
                        )}
                        {vehicle.status === 'expiring' && (
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-[#fff3dc] text-[#d97706]">
                            Expirando
                          </span>
                        )}
                        {vehicle.status === 'paused' && (
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-[#f2f5fa] text-[#6e7890]">
                            Pausado
                          </span>
                        )}
                        {vehicle.status === 'sold' && (
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-[#f1f5f9] text-[#475569]">
                            Vendido
                          </span>
                        )}

                        <span className="text-[#64748b]">{vehicle.planLabel}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#697a95]">
                        <IconEye className="size-3 text-[#8a99ad]" />
                        <span>{vehicle.viewsCount.toLocaleString('pt-BR')} views</span>
                      </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9] flex-wrap">
                      {isExpiring && (
                        <button
                          type="button"
                          onClick={() => handleOpenModal('renew', vehicle)}
                          className="flex-1 py-2 bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] text-[12px] font-semibold rounded-[6px] text-center"
                        >
                          Renovar
                        </button>
                      )}

                      {isActive && (
                        <button
                          type="button"
                          onClick={() => togglePause(vehicle.id)}
                          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-[#475569] text-[12px] font-medium rounded-[6px] text-center"
                        >
                          Pausar
                        </button>
                      )}

                      {isPaused && (
                        <button
                          type="button"
                          onClick={() => togglePause(vehicle.id)}
                          className="flex-1 py-2 bg-[#e5f7ed] hover:bg-[#cbf2dc] text-[#14865a] text-[12px] font-semibold rounded-[6px] text-center"
                        >
                          Ativar
                        </button>
                      )}

                      {hasRevision && (
                        <Link
                          href={`/concessionaria/anuncios/${vehicle.id}/revisoes`}
                          className="flex-1 py-2 bg-[#eff6ff] text-[#2563eb] text-[12px] font-semibold rounded-[6px] text-center"
                        >
                          Revisão
                        </Link>
                      )}

                      <Link
                        href={`/concessionaria/anuncios/${vehicle.id}/editar`}
                        className="flex-1 py-2 bg-white border border-[#dee6f1] hover:bg-[#f8fafc] text-[#17243f] text-[12px] font-medium rounded-[6px] text-center"
                      >
                        Editar
                      </Link>

                      {!isSold && (
                        <Link
                          href={`/concessionaria/anuncios/${vehicle.id}/vendido`}
                          className="py-2 px-3 text-[#64748b] hover:text-[#b91c1c] text-[12px] font-medium text-center"
                        >
                          Vendido
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenModal('view', vehicle)}
                        className="py-2 px-3 bg-white border border-[#dee6f1] hover:bg-[#f8fafc] text-[#b91c1c] text-[12px] font-semibold rounded-[6px] text-center"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 px-4 text-center">
                <div className="size-12 rounded-full bg-[#f1f5f9] text-[#64748b] flex items-center justify-center mx-auto mb-3">
                  <IconSearch className="size-6" />
                </div>
                <h4 className="text-[16px] font-bold text-[#17243f]">Nenhum veículo encontrado</h4>
                <p className="text-[13px] text-[#697a95] mt-1 leading-relaxed">
                  Não encontramos anúncios correspondentes aos filtros aplicados.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-[#b91c1c] text-white text-[12px] font-semibold rounded-[6px]"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>

          {/* Footer of Table / List */}
          <div className="p-4 sm:px-6 bg-[#f8fafc] border-t border-[#dee6f1] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-[#697a95]">
            <p data-testid="inventory-footer-count">
              Mostrando{' '}
              <span className="font-semibold text-[#17243f]">{filteredVehicles.length}</span> de{' '}
              <span className="font-semibold text-[#17243f]">{vehicles.length}</span> veículos da
              frota
            </p>
            <p className="text-[11px] text-[#8a99ad]">
              Valores, fotos e métricas são dados ilustrativos para revisão do design. (DEMO DATA)
            </p>
          </div>
        </div>
      </main>

      <MarketplaceFooter />

      {/* Action and Information Modal */}
      <DealerVehicleActionModal
        type={modalType}
        vehicle={selectedVehicle}
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        onConfirmRenew={handleConfirmRenew}
      />
    </div>
  );
}
