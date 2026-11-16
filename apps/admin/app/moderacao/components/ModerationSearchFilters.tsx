'use client';

import type { ReportCategory, ReportStatus } from '@/lib/types/moderation-presentation';
import { RefreshCw, Search } from 'lucide-react';
import * as React from 'react';

interface ModerationSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: 'all' | ReportCategory;
  onCategoryChange: (category: 'all' | ReportCategory) => void;
  selectedStatus: 'all' | ReportStatus;
  onStatusChange: (status: 'all' | ReportStatus) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalRecords: number;
  locationFilter: string;
  onLocationChange: (value: string) => void;
}

const CATEGORY_OPTIONS: { value: 'all' | ReportCategory; label: string }[] = [
  { value: 'all', label: 'Categoria — Todas' },
  { value: 'INCONSISTENT_AD_INFO', label: 'Informações do anúncio' },
  { value: 'AD_DATA', label: 'Dados de anúncio' },
  { value: 'SELLER_PROFILE_CORRECTION', label: 'Correção de perfil' },
  { value: 'FRAUD_SUSPICION', label: 'Suspeita de fraude' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Conteúdo inadequado' },
];

const STATUS_OPTIONS: { value: 'all' | ReportStatus; label: string }[] = [
  { value: 'all', label: 'Situação — Todas' },
  { value: 'UNDER_REVIEW', label: 'Em análise' },
  { value: 'CORRECTION_REQUESTED', label: 'Correção' },
  { value: 'RESOLVED_NO_ACTION', label: 'Encerrado' },
  { value: 'RESOLVED_ACTION_TAKEN', label: 'Medida aplicada' },
];

export function ModerationSearchFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  totalFiltered,
  totalRecords,
  locationFilter,
  onLocationChange,
}: ModerationSearchFiltersProps) {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    locationFilter !== '';

  return (
    <div className="space-y-3" data-testid="moderation-search-filters">
      {/* Search + Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar protocolo, anúncio ou denunciante"
            data-testid="moderation-search-input"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as 'all' | ReportCategory)}
            data-testid="moderation-category-filter"
            className="pl-9 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 appearance-none cursor-pointer text-slate-700 min-w-[200px]"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as 'all' | ReportStatus)}
            data-testid="moderation-status-filter"
            className="pl-9 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 appearance-none cursor-pointer text-slate-700 min-w-[180px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Ipatinga — MG"
            data-testid="moderation-location-filter"
            className="pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 placeholder:text-slate-400 min-w-[160px]"
          />
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span data-testid="moderation-results-count">
          Exibindo <strong className="text-slate-800">{totalFiltered}</strong> de{' '}
          <strong className="text-slate-800">{totalRecords}</strong> denúncias cadastradas
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            data-testid="moderation-reset-filters"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
