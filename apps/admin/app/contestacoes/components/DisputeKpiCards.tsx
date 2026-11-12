'use client';

import {
  AlertCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Lock,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import * as React from 'react';
import { FIGMA_DISPUTES_METRICS, formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { ChargebackDisputeStatus } from '../../../lib/types/finance-presentation';

interface DisputeKpiCardsProps {
  selectedStatus: 'all' | ChargebackDisputeStatus;
  onFilterStatus: (status: 'all' | ChargebackDisputeStatus) => void;
}

export function DisputeKpiCards({ selectedStatus, onFilterStatus }: DisputeKpiCardsProps) {
  const m = FIGMA_DISPUTES_METRICS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Total em Disputa */}
      <button
        type="button"
        onClick={() => onFilterStatus('all')}
        data-testid="kpi-total-disputes"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'all'
            ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total em Disputa
          </span>
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formatBrl(m.totalDisputedBrl)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            ({m.totalDisputesCount} casos)
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Saldo retido no PSP:</span>
          <span className="font-bold text-red-600">100% Cautelar</span>
        </div>
      </button>

      {/* KPI 2: Em Análise pela Adquirente */}
      <button
        type="button"
        onClick={() => onFilterStatus('UNDER_REVIEW')}
        data-testid="kpi-under-review-disputes"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'UNDER_REVIEW'
            ? 'border-amber-500 ring-2 ring-amber-500/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Sob Análise (Adquirente)
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-900 tracking-tight">
            {m.underReviewCount}
          </span>
          <span className="text-xs font-semibold text-amber-700">defesas enviadas</span>
        </div>
        <div className="mt-2 pt-2 border-t border-amber-50 flex items-center justify-between text-xs">
          <span className="text-amber-800">Valor em avaliação:</span>
          <span className="font-bold text-amber-900">{formatBrl(m.underReviewAmountBrl)}</span>
        </div>
      </button>

      {/* KPI 3: Evidência Pendente */}
      <button
        type="button"
        onClick={() => onFilterStatus('INCOMPLETE_EVIDENCE')}
        data-testid="kpi-incomplete-evidence-disputes"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'INCOMPLETE_EVIDENCE'
            ? 'border-red-500 ring-2 ring-red-500/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Evidência Incompleta
          </span>
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-700 animate-pulse">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-red-900 tracking-tight">
            {m.incompleteEvidenceCount}
          </span>
          <span className="text-xs font-semibold text-red-700">ação requerida</span>
        </div>
        <div className="mt-2 pt-2 border-t border-red-50 flex items-center justify-between text-xs">
          <span className="text-red-800">Prazo crítico:</span>
          <span className="font-bold text-red-900">
            {formatBrl(m.incompleteEvidenceAmountBrl)} (1 dia)
          </span>
        </div>
      </button>

      {/* KPI 4: Receita Garantida (Regra Estrita de Governança) */}
      <div
        data-testid="kpi-guaranteed-revenue-zero"
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-white shadow-2xs"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Receita Garantida
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400 tracking-tight">
            {formatBrl(m.guaranteedRevenueNoticeBrl)}
          </span>
          <span className="text-xs font-semibold text-slate-400">(Não contabilizado)</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Regra de Compliance:</span>
          <span className="font-bold text-slate-300">Fail-Closed / Retenção</span>
        </div>
      </div>
    </div>
  );
}
