'use client';

import { Filter, RotateCcw, Search, X } from 'lucide-react';
import * as React from 'react';
import type { RefundRequestStatus } from '../../../lib/types/finance-presentation';

interface RefundSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: 'all' | RefundRequestStatus;
  onStatusChange: (status: 'all' | RefundRequestStatus) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalRecords: number;
}

export function RefundSearchFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  totalFiltered,
  totalRecords,
}: RefundSearchFiltersProps) {
  const hasActiveFilters = searchTerm !== '' || selectedStatus !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por ID de solicitação, vendedor, anúncio ou transação..."
            data-testid="refund-search-input"
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as 'all' | RefundRequestStatus)}
              data-testid="refund-status-filter"
              className="appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
            >
              <option value="all">Todos os status</option>
              <option value="PENDING_REVIEW">Em Análise (CDC Art. 49)</option>
              <option value="HOLD_LEGAL">Retenção Jurídica (HOLD)</option>
              <option value="APPROVED">Aprovado</option>
              <option value="REJECTED">Recusado</option>
              <option value="REFUNDED">Concluído / Estornado</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              data-testid="refund-reset-filters-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Counter bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Mostrando <strong className="text-slate-800">{totalFiltered}</strong> de{' '}
          <strong className="text-slate-800">{totalRecords}</strong> solicitações de cancelamento
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Política: Prazo de 3 dias úteis para triagem
        </span>
      </div>
    </div>
  );
}
