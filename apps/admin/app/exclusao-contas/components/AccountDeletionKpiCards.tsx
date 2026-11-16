'use client';

import {
  AlertTriangle,
  Archive,
  Clock,
  FileText,
  ShieldAlert,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import type * as React from 'react';
import { ACCOUNT_DELETION_KPI } from '../../../lib/adapters/mock-account-deletion-data';
import type { AccountDeletionStatus } from '../../../lib/types/account-deletion-presentation';

interface AccountDeletionKpiCardsProps {
  selectedStatus?: string;
  onFilterStatus?: (status: AccountDeletionStatus) => void;
}

export function AccountDeletionKpiCards({
  selectedStatus,
  onFilterStatus,
}: AccountDeletionKpiCardsProps) {
  return (
    <div
      data-testid="account-deletion-kpi-cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. Pedidos de exemplo (3) */}
      <div
        data-testid="kpi-total-requests"
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow relative"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Pedidos de exemplo
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {ACCOUNT_DELETION_KPI.totalRequests}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Fila fictícia</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Em análise (2) */}
      <button
        type="button"
        onClick={() => onFilterStatus?.('UNDER_REVIEW')}
        data-testid="kpi-under-review"
        className={`bg-white text-left rounded-2xl border p-5 shadow-2xs hover:shadow-xs transition-all relative ${
          selectedStatus === 'UNDER_REVIEW'
            ? 'border-amber-500 ring-2 ring-amber-500/20'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Em análise
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {ACCOUNT_DELETION_KPI.underReview}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Sem exclusão imediata</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </button>

      {/* 3. Retenção em avaliação (1) */}
      <button
        type="button"
        onClick={() => onFilterStatus?.('RETENTION_EVALUATION')}
        data-testid="kpi-retention-evaluation"
        className={`bg-white text-left rounded-2xl border p-5 shadow-2xs hover:shadow-xs transition-all relative ${
          selectedStatus === 'RETENTION_EVALUATION'
            ? 'border-red-500 ring-2 ring-red-500/20'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Retenção em avaliação
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {ACCOUNT_DELETION_KPI.retentionEvaluation}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Regras LGPD aplicáveis</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </button>

      {/* 4. Remoções executadas (0) */}
      <div
        data-testid="kpi-executed-deletions"
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-shadow relative"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Remoções executadas
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {ACCOUNT_DELETION_KPI.executedDeletions}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Nenhuma ação real</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <Archive className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
