import { AlertTriangle, Building2, ShieldCheck, Users } from 'lucide-react';
import * as React from 'react';
import type { AdminUserRole, AdminUserStatus } from '../../../lib/types/users-presentation';

export interface UserKpiCounts {
  total: number;
  members: number;
  sellers: number;
  dealers: number;
  sellersAndDealers: number;
  suspendedOrBanned: number;
}

export const FIGMA_USERS_KPI_METRICS = {
  totalAccounts: '2.406',
  approvedSellers: '682',
  dealerships: '74',
  suspendedAccounts: '14',
} as const;

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
      {/* 1. Total de contas (Figma ADM-D-003: 2.406) */}
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
            Total de contas
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {FIGMA_USERS_KPI_METRICS.totalAccounts}
          </span>
          <span className="text-xs text-slate-400">contas</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Base total de contas</span>
          <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
            Amostra: {counts.total}
          </span>
        </div>
      </button>

      {/* 2. Vendedores aprovados (Figma ADM-D-003: 682) */}
      <button
        type="button"
        onClick={() => {
          onFilterRole?.('seller');
          onFilterStatus?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedRole === 'seller'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Vendedores aprovados
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {FIGMA_USERS_KPI_METRICS.approvedSellers}
          </span>
          <span className="text-xs text-emerald-600 font-medium">aprovados</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Particulares com CNH</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            Amostra: {counts.sellers}
          </span>
        </div>
      </button>

      {/* 3. Concessionárias (Figma ADM-D-003: 74) */}
      <button
        type="button"
        onClick={() => {
          onFilterRole?.('dealer');
          onFilterStatus?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedRole === 'dealer'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Concessionárias
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {FIGMA_USERS_KPI_METRICS.dealerships}
          </span>
          <span className="text-xs text-sky-600 font-medium">lojistas</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Lojas e revendas</span>
          <span className="font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
            Amostra: {counts.dealers}
          </span>
        </div>
      </button>

      {/* 4. Contas suspensas (Figma ADM-D-003: 14) */}
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
            Contas suspensas
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-red-600">
            {FIGMA_USERS_KPI_METRICS.suspendedAccounts}
          </span>
          <span className="text-xs text-red-500 font-medium">restrições</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Sob moderação preventiva</span>
          <span className="font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
            Amostra: {counts.suspendedOrBanned}
          </span>
        </div>
      </button>
    </div>
  );
}
