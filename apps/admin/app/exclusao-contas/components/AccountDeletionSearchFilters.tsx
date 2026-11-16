'use client';

import { Filter, MapPin, RotateCcw, Search, X } from 'lucide-react';
import type * as React from 'react';
import type { AccountDeletionStatus } from '../../../lib/types/account-deletion-presentation';

interface AccountDeletionSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: 'all' | AccountDeletionStatus;
  onStatusChange: (status: 'all' | AccountDeletionStatus) => void;
  selectedCategory: 'all' | 'seller' | 'buyer';
  onCategoryChange: (category: 'all' | 'seller' | 'buyer') => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalRecords: number;
}

export function AccountDeletionSearchFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  locationFilter,
  onLocationChange,
  onResetFilters,
  totalFiltered,
  totalRecords,
}: AccountDeletionSearchFiltersProps) {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedStatus !== 'all' ||
    selectedCategory !== 'all' ||
    locationFilter !== '';

  return (
    <div
      data-testid="account-deletion-filters"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar usuário ou protocolo"
            data-testid="deletion-search-input"
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Limpar pesquisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Status Dropdown */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as 'all' | AccountDeletionStatus)}
            data-testid="deletion-status-filter"
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Situação - Todas</option>
            <option value="UNDER_REVIEW">Em análise</option>
            <option value="RETENTION_EVALUATION">Retenção em avaliação</option>
          </select>
        </div>

        {/* 3. Category Dropdown */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as 'all' | 'seller' | 'buyer')}
            data-testid="deletion-category-filter"
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Categoria - Todas</option>
            <option value="seller">Vendedores</option>
            <option value="buyer">Compradores</option>
          </select>
        </div>

        {/* 4. Location input / indicator */}
        <div className="relative flex items-center">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Ipatinga - MG"
            data-testid="deletion-location-filter"
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              data-testid="deletion-reset-filters-btn"
              className="ml-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
              title="Redefinir filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Counter bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Mostrando <strong className="text-slate-800">{totalFiltered}</strong> de{' '}
          <strong className="text-slate-800">{totalRecords}</strong> pedidos fictícios
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Retenção LGPD condicionada a alçada
        </span>
      </div>
    </div>
  );
}
