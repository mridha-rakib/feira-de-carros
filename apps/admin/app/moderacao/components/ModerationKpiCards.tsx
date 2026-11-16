'use client';

import { MODERATION_KPI } from '@/lib/adapters/mock-moderation-data';
import type { ReportStatus } from '@/lib/types/moderation-presentation';
import { AlertTriangle, Eye, MessageSquareWarning, RotateCcw, ShieldAlert } from 'lucide-react';
import * as React from 'react';

interface ModerationKpiCardsProps {
  selectedStatus: 'all' | ReportStatus;
  onFilterStatus: (status: 'all' | ReportStatus) => void;
}

export function ModerationKpiCards({ selectedStatus, onFilterStatus }: ModerationKpiCardsProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      data-testid="moderation-kpi-cards"
    >
      {/* KPI 1 — Total de Denúncias */}
      <button
        type="button"
        onClick={() => onFilterStatus('all')}
        data-testid="kpi-total-reports"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'all'
            ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Denúncias (amostra)
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <MessageSquareWarning className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {MODERATION_KPI.totalReports}
          </span>
          <span className="text-xs font-semibold text-slate-500">Fila demonstrativa</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          Registros ficícios para demonstração
        </div>
      </button>

      {/* KPI 2 — Em Análise */}
      <button
        type="button"
        onClick={() => onFilterStatus('UNDER_REVIEW')}
        data-testid="kpi-under-review"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'UNDER_REVIEW'
            ? 'border-amber-500 ring-2 ring-amber-500/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Em análise
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-900 tracking-tight">
            {MODERATION_KPI.underReview}
          </span>
          <span className="text-xs font-semibold text-amber-700">Triagem pelo Main Admin</span>
        </div>
        <div className="mt-2 pt-2 border-t border-amber-50 text-xs text-amber-700">
          Análise humana obrigatória
        </div>
      </button>

      {/* KPI 3 — Correções */}
      <button
        type="button"
        onClick={() => onFilterStatus('CORRECTION_REQUESTED')}
        data-testid="kpi-corrections"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'CORRECTION_REQUESTED'
            ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Correções
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-blue-900 tracking-tight">
            {MODERATION_KPI.corrections}
          </span>
          <span className="text-xs font-semibold text-blue-700">Solicitação de existência</span>
        </div>
        <div className="mt-2 pt-2 border-t border-blue-50 text-xs text-blue-700">
          Aguardando resposta do vendedor
        </div>
      </button>

      {/* KPI 4 — Acesso Support (DENY_PENDING) */}
      <div
        data-testid="kpi-support-access"
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-white shadow-2xs"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Acesso Support
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-red-400 tracking-tight">
            {MODERATION_KPI.supportAccessLabel}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
          Sem permissão adicional aprovada
        </div>
      </div>
    </div>
  );
}
