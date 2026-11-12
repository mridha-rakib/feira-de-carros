import { AlertTriangle, Building2, UserCheck, Users } from 'lucide-react';
import * as React from 'react';
import type { AdminUserRole, AdminUserStatus } from '../../../lib/types/users-presentation';

interface UserKpiCounts {
  total: number;
  members: number;
  sellersAndDealers: number;
  suspendedOrBanned: number;
}

interface UserKpiCardsProps {
  counts: UserKpiCounts;
  selectedRole?: 'all' | AdminUserRole;
  selectedStatus?: 'all' | AdminUserStatus;
  onFilterRole?: (role: 'all' | AdminUserRole) => void;
  onFilterStatus?: (status: 'all' | AdminUserStatus) => void;
}

export function UserKpiCards({
  counts,
  selectedRole = 'all',
  selectedStatus = 'all',
  onFilterRole,
  onFilterStatus,
}: UserKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total de Usuários */}
      <button
        type="button"
        onClick={() => {
          onFilterRole?.('all');
          onFilterStatus?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedRole === 'all' && selectedStatus === 'all'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total de Usuários
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{counts.total}</span>
          <span className="text-xs text-slate-400">cadastros</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Base ativa e pendente no Vale do Aço</p>
      </button>

      {/* 2. Membros / Compradores */}
      <button
        type="button"
        onClick={() => {
          onFilterRole?.('member');
          onFilterStatus?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedRole === 'member'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Membros / Compradores
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{counts.members}</span>
          <span className="text-xs text-emerald-600 font-medium">compradores</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Perfis de busca e favoritos</p>
      </button>

      {/* 3. Vendedores & Lojistas */}
      <button
        type="button"
        onClick={() => {
          onFilterRole?.('seller');
          onFilterStatus?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedRole === 'seller' || selectedRole === 'dealer'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Vendedores & Lojistas
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">{counts.sellersAndDealers}</span>
          <span className="text-xs text-sky-600 font-medium">anunciantes</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Particulares e concessionárias</p>
      </button>

      {/* 4. Suspensos / Bloqueados */}
      <button
        type="button"
        onClick={() => {
          onFilterRole?.('all');
          onFilterStatus?.('SUSPENDED');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedStatus === 'SUSPENDED' || selectedStatus === 'BANNED'
            ? 'border-red-600 ring-1 ring-red-600/20'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Suspensos / Bloqueados
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-red-600">{counts.suspendedOrBanned}</span>
          <span className="text-xs text-red-500 font-medium">restrições</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Exigem atenção da moderação</p>
      </button>
    </div>
  );
}
