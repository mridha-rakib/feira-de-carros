'use client';

import type { InquiryStatus } from '@/lib/types/intermediated-inquiries-presentation';
import { Filter, RotateCcw, Search } from 'lucide-react';
import type * as React from 'react';

interface InquirySearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: InquiryStatus | 'all';
  onStatusChange: (status: InquiryStatus | 'all') => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function InquirySearchFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  filteredCount,
  totalCount,
}: InquirySearchFiltersProps) {
  const hasActiveFilters = searchTerm !== '' || selectedStatus !== 'all';

  return (
    <div
      data-testid="inquiry-search-filters"
      className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            data-testid="inquiry-search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por protocolo (INQ-LEG-...), comprador ou veículo..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select
              data-testid="inquiry-status-filter"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as InquiryStatus | 'all')}
              className="appearance-none text-xs bg-slate-50/70 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
            >
              <option value="all">Todas as situações</option>
              <option value="IN_MEDIATION">Em mediação</option>
              <option value="AWAITING_CONTACT">Aguardando contato</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              data-testid="inquiry-reset-filters-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          Exibindo <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> consultas da
          feira
        </span>
        <span className="font-medium text-slate-400">
          Mediação Institucional • Proibida personificação de proprietário
        </span>
      </div>
    </div>
  );
}
