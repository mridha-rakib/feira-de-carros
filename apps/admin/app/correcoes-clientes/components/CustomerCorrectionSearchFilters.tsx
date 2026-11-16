'use client';

import type {
  CustomerCorrectionFieldType,
  CustomerCorrectionStatus,
} from '@/lib/types/customer-corrections-presentation';
import { Filter, RotateCcw, Search } from 'lucide-react';
import type * as React from 'react';

interface CustomerCorrectionSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: CustomerCorrectionStatus | 'all';
  onStatusChange: (status: CustomerCorrectionStatus | 'all') => void;
  selectedField: CustomerCorrectionFieldType | 'all';
  onFieldChange: (field: CustomerCorrectionFieldType | 'all') => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function CustomerCorrectionSearchFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedField,
  onFieldChange,
  onResetFilters,
  filteredCount,
  totalCount,
}: CustomerCorrectionSearchFiltersProps) {
  const hasActiveFilters = searchTerm !== '' || selectedStatus !== 'all' || selectedField !== 'all';

  return (
    <div
      data-testid="customer-correction-search-filters"
      className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            data-testid="correction-search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por protocolo (COR-DEMO-...), cliente ou ID da conta..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select
              data-testid="correction-status-filter"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as CustomerCorrectionStatus | 'all')}
              className="appearance-none text-xs bg-slate-50/70 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
            >
              <option value="all">Todas as situações</option>
              <option value="IN_REVIEW">Em análise</option>
              <option value="PENDING_EVIDENCE">Correção pendente</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Field Filter */}
          <div className="relative">
            <select
              data-testid="correction-field-filter"
              value={selectedField}
              onChange={(e) => onFieldChange(e.target.value as CustomerCorrectionFieldType | 'all')}
              className="appearance-none text-xs bg-slate-50/70 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
            >
              <option value="all">Todos os campos</option>
              <option value="TELEPHONE">Telefone</option>
              <option value="LOCALITY">Localidade</option>
              <option value="CNPJ_DOCUMENT">CNPJ restrito</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              data-testid="correction-reset-filters-btn"
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
          Exibindo <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> solicitações de
          correção
        </span>
        <span className="font-medium text-slate-400">
          Valores mascarados • Conformidade LGPD & Trilha de Auditoria
        </span>
      </div>
    </div>
  );
}
