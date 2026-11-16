'use client';

import type {
  CustomerCorrectionKpiSummary,
  CustomerCorrectionStatus,
} from '@/lib/types/customer-corrections-presentation';
import { Clock, FileEdit, Lock, ShieldCheck } from 'lucide-react';
import type * as React from 'react';

interface CustomerCorrectionKpiCardsProps {
  summary: CustomerCorrectionKpiSummary;
  selectedStatus: CustomerCorrectionStatus | 'all';
  onFilterStatus: (status: CustomerCorrectionStatus | 'all') => void;
}

export function CustomerCorrectionKpiCards({
  summary,
  selectedStatus,
  onFilterStatus,
}: CustomerCorrectionKpiCardsProps) {
  return (
    <div
      data-testid="customer-correction-kpi-cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. Total Correction Requests */}
      <button
        type="button"
        onClick={() => onFilterStatus('all')}
        className={`text-left bg-white rounded-2xl border p-4.5 transition-all shadow-2xs hover:shadow-sm ${
          selectedStatus === 'all'
            ? 'border-slate-800 ring-2 ring-slate-800/10'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Pedidos de correção
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <FileEdit className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.totalRequests}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">Solicitações fictícias</p>
      </button>

      {/* 2. Under Review */}
      <button
        type="button"
        onClick={() => onFilterStatus(selectedStatus === 'IN_REVIEW' ? 'all' : 'IN_REVIEW')}
        className={`text-left bg-white rounded-2xl border p-4.5 transition-all shadow-2xs hover:shadow-sm ${
          selectedStatus === 'IN_REVIEW'
            ? 'border-amber-500 ring-2 ring-amber-500/10'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Em análise
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.underReviewCount}
        </div>
        <p className="text-[11px] text-amber-700 font-medium mt-0.5">Triagem sob verificação</p>
      </button>

      {/* 3. Sensitive Data / Permission Pending */}
      <button
        type="button"
        onClick={() =>
          onFilterStatus(selectedStatus === 'PENDING_EVIDENCE' ? 'all' : 'PENDING_EVIDENCE')
        }
        className={`text-left bg-white rounded-2xl border p-4.5 transition-all shadow-2xs hover:shadow-sm ${
          selectedStatus === 'PENDING_EVIDENCE'
            ? 'border-rose-500 ring-2 ring-rose-500/10'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">
            Permissão pendente
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-rose-900 tracking-tight">
          {summary.sensitivePendingCount}
        </div>
        <p className="text-[11px] text-rose-700 font-medium mt-0.5">Dado sensível sob HOLD</p>
      </button>

      {/* 4. Reviewer / Authorization */}
      <div className="text-left bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Revisor autorizado
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-bold text-slate-900 tracking-tight">
          {summary.reviewerRole}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Suporte: acesso condicional (DENY_PENDING)
        </p>
      </div>
    </div>
  );
}
