import { Filter, RefreshCw, Search, X } from 'lucide-react';
import * as React from 'react';
import type { AdminUserRole, AdminUserStatus } from '../../../lib/types/users-presentation';

interface UserSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: 'all' | AdminUserRole;
  onRoleChange: (role: 'all' | AdminUserRole) => void;
  selectedStatus: 'all' | AdminUserStatus;
  onStatusChange: (status: 'all' | AdminUserStatus) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export function UserSearchFilters({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  filteredCount,
  totalCount,
}: UserSearchFiltersProps) {
  const hasActiveFilters = searchTerm !== '' || selectedRole !== 'all' || selectedStatus !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar por nome, código, e-mail, telefone, CPF/CNPJ..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              aria-label="Limpar termo de busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              aria-label="Filtrar por papel"
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value as 'all' | AdminUserRole)}
              className="pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer appearance-none transition-colors"
            >
              <option value="all">Todos os papéis</option>
              <option value="member">Membros (Compradores)</option>
              <option value="seller">Vendedores particulares</option>
              <option value="dealer">Concessionárias</option>
              <option value="support">Suporte</option>
              <option value="sales">Comercial</option>
              <option value="main_admin">Admin Principal</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative flex items-center">
            <select
              aria-label="Filtrar por status"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as 'all' | AdminUserStatus)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer transition-colors"
            >
              <option value="all">Todos os status</option>
              <option value="ACTIVE">Ativo</option>
              <option value="PENDING">Pendente</option>
              <option value="SUSPENDED">Suspenso</option>
              <option value="BANNED">Bloqueado</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
              title="Redefinir todos os filtros"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Filter Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span>Exibindo</span>
          <span className="font-bold text-slate-900">{filteredCount}</span>
          <span>de</span>
          <span className="font-bold text-slate-900">{totalCount}</span>
          <span>registros da amostra local</span>
          <span className="text-slate-400 font-normal">(base total ilustrativa: 2.406 contas)</span>
        </div>
        {hasActiveFilters && (
          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200">
            Filtros ativos aplicados
          </span>
        )}
      </div>
    </div>
  );
}
