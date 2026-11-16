'use client';

import type { StaffKpiSummary, StaffRole, StaffStatus } from '@/lib/types/staff-presentation';
import { Headphones, ShieldAlert, ShoppingBag, Users } from 'lucide-react';
import type * as React from 'react';

interface StaffKpiCardsProps {
  summary: StaffKpiSummary;
  selectedRole: StaffRole | 'all';
  selectedStatus: StaffStatus | 'all';
  onFilterRole: (role: StaffRole | 'all') => void;
  onFilterStatus: (status: StaffStatus | 'all') => void;
}

export function StaffKpiCards({
  summary,
  selectedRole,
  selectedStatus,
  onFilterRole,
  onFilterStatus,
}: StaffKpiCardsProps) {
  return (
    <div
      data-testid="staff-kpi-cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. Total Staff Accounts */}
      <button
        type="button"
        onClick={() => {
          onFilterRole('all');
          onFilterStatus('all');
        }}
        className={`text-left bg-white rounded-2xl border p-4.5 transition-all shadow-2xs hover:shadow-sm ${
          selectedRole === 'all' && selectedStatus === 'all'
            ? 'border-slate-800 ring-2 ring-slate-800/10'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Contas de equipe
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.totalStaff}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">Colaboradores cadastrados</p>
      </button>

      {/* 2. Sales Accounts */}
      <button
        type="button"
        onClick={() => onFilterRole(selectedRole === 'sales' ? 'all' : 'sales')}
        className={`text-left bg-white rounded-2xl border p-4.5 transition-all shadow-2xs hover:shadow-sm ${
          selectedRole === 'sales'
            ? 'border-blue-600 ring-2 ring-blue-600/10'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Equipe Vendas
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.salesCount}
        </div>
        <p className="text-[11px] text-blue-600 font-medium mt-0.5">
          Operação comercial e revendas
        </p>
      </button>

      {/* 3. Support Accounts */}
      <button
        type="button"
        onClick={() => onFilterRole(selectedRole === 'support' ? 'all' : 'support')}
        className={`text-left bg-white rounded-2xl border p-4.5 transition-all shadow-2xs hover:shadow-sm ${
          selectedRole === 'support'
            ? 'border-indigo-600 ring-2 ring-indigo-600/10'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Equipe Suporte
          </span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Headphones className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.supportCount}
        </div>
        <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Atendimento e moderação</p>
      </button>

      {/* 4. Sensitive Operations / Hold Notice */}
      <div className="text-left bg-white rounded-2xl border border-amber-200/90 p-4.5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Operações sensíveis
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-amber-900 tracking-tight">
          {summary.sensitiveOperationsHoldCount} em HOLD
        </div>
        <p className="text-[11px] text-amber-700 font-medium mt-0.5">
          DENY_PENDING • Exclusivo Main Admin
        </p>
      </div>
    </div>
  );
}
