import { Filter, RotateCcw, Search } from 'lucide-react';
import type * as React from 'react';
import type { PaymentMethod, PaymentStatus } from '../../../lib/types/finance-presentation';

interface TransactionSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: 'all' | PaymentStatus;
  onStatusChange: (status: 'all' | PaymentStatus) => void;
  selectedMethod: 'all' | PaymentMethod;
  onMethodChange: (method: 'all' | PaymentMethod) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function TransactionSearchFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedMethod,
  onMethodChange,
  onResetFilters,
  filteredCount,
  totalCount,
}: TransactionSearchFiltersProps) {
  const hasActiveFilters =
    searchTerm.trim().length > 0 || selectedStatus !== 'all' || selectedMethod !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por ID (TX-...), código do anúncio (ANX-...), veículo ou cliente..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            aria-label="Filtrar por status de pagamento"
            onChange={(e) => onStatusChange(e.target.value as 'all' | PaymentStatus)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 text-slate-700 cursor-pointer transition-colors"
          >
            <option value="all">Todos os status</option>
            <option value="CONFIRMED">Confirmado / Pago</option>
            <option value="PENDING">Pendente</option>
            <option value="FAILED">Falhou</option>
            <option value="IN_DISPUTE">Em contestação</option>
          </select>

          {/* Payment Method filter */}
          <select
            value={selectedMethod}
            aria-label="Filtrar por método de pagamento"
            onChange={(e) => onMethodChange(e.target.value as 'all' | PaymentMethod)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 text-slate-700 cursor-pointer transition-colors"
          >
            <option value="all">Todos os métodos</option>
            <option value="PIX">Pix Instantâneo</option>
            <option value="CREDIT_CARD">Cartão de Crédito</option>
            <option value="CASH">Dinheiro (Balcão)</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Limpar todos os filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Counts Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Exibindo <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> transações da
            amostra (total: R$ 190,00)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Dados demonstrativos • Feira de Carros Finance
        </span>
      </div>
    </div>
  );
}
