'use client';

import { AlertTriangle, Clock, HelpCircle, RotateCcw, Scale, ShieldCheck } from 'lucide-react';
import * as React from 'react';
import { formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { RefundRequestStatus } from '../../../lib/types/finance-presentation';

interface RefundKpiCardsProps {
  selectedStatus: 'all' | RefundRequestStatus;
  onFilterStatus: (status: 'all' | RefundRequestStatus) => void;
}

export function RefundKpiCards({ selectedStatus, onFilterStatus }: RefundKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Total de Solicitações */}
      <button
        type="button"
        onClick={() => onFilterStatus('all')}
        data-testid="kpi-total-refunds"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'all'
            ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Solicitações
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">3</span>
          <span className="text-xs font-semibold text-slate-500">pedidos abertos</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Volume sob revisão:</span>
          <span className="font-bold text-slate-800">{formatBrl(110)}</span>
        </div>
      </button>

      {/* KPI 2: Em Análise Operacional (CDC Art. 49) */}
      <button
        type="button"
        onClick={() => onFilterStatus('PENDING_REVIEW')}
        data-testid="kpi-pending-refunds"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'PENDING_REVIEW'
            ? 'border-amber-500 ring-2 ring-amber-500/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Em Análise (Triagem: 3 dias)
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-900 tracking-tight">2</span>
          <span className="text-xs font-semibold text-amber-700">dentro do prazo</span>
        </div>
        <div className="mt-2 pt-2 border-t border-amber-50 flex items-center justify-between text-xs">
          <span className="text-amber-800">Direito legal (Art. 49):</span>
          <span className="font-bold text-amber-900">7 dias corridos</span>
        </div>
      </button>

      {/* KPI 3: Retenção Jurídica (HOLD) */}
      <button
        type="button"
        onClick={() => onFilterStatus('HOLD_LEGAL')}
        data-testid="kpi-hold-legal-refunds"
        className={`p-4 rounded-2xl bg-white border text-left transition-all hover:shadow-md cursor-pointer ${
          selectedStatus === 'HOLD_LEGAL'
            ? 'border-red-500 ring-2 ring-red-500/10 shadow-xs'
            : 'border-slate-200 shadow-2xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Retenção Jurídica (HOLD)
          </span>
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-red-900 tracking-tight">1</span>
          <span className="text-xs font-semibold text-red-700">bloqueio de política</span>
        </div>
        <div className="mt-2 pt-2 border-t border-red-50 flex items-center justify-between text-xs">
          <span className="text-red-800">Destaque usufruído:</span>
          <span className="font-bold text-red-900">{formatBrl(40)}</span>
        </div>
      </button>

      {/* KPI 4: Política de Análise Imparcial */}
      <div
        data-testid="kpi-policy-compliance"
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-white shadow-2xs"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Governança Financeira
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-400 tracking-tight">100%</span>
          <span className="text-xs font-semibold text-slate-300">auditado por humano</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Estorno automático:</span>
          <span className="font-bold text-amber-400">Desativado (Fail-Closed)</span>
        </div>
      </div>
    </div>
  );
}
