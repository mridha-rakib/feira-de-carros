'use client';

import type {
  InquiryStatus,
  IntermediatedInquiryKpiSummary,
} from '@/lib/types/intermediated-inquiries-presentation';
import { Lock, MessageSquare, ShieldAlert, UserX, Users } from 'lucide-react';
import type * as React from 'react';

interface InquiryKpiCardsProps {
  summary: IntermediatedInquiryKpiSummary;
  selectedStatus: InquiryStatus | 'all';
  onFilterStatus: (status: InquiryStatus | 'all') => void;
}

export function InquiryKpiCards({ summary, selectedStatus, onFilterStatus }: InquiryKpiCardsProps) {
  return (
    <div
      data-testid="inquiry-kpi-cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. Total Inquiries */}
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
            Consultas registradas
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.totalInquiries}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">Fila demonstrativa</p>
      </button>

      {/* 2. In Mediation */}
      <button
        type="button"
        onClick={() => onFilterStatus(selectedStatus === 'IN_MEDIATION' ? 'all' : 'IN_MEDIATION')}
        className={`text-left bg-white rounded-2xl border p-4.5 transition-all shadow-2xs hover:shadow-sm ${
          selectedStatus === 'IN_MEDIATION'
            ? 'border-blue-500 ring-2 ring-blue-500/10'
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Em atendimento
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.inMediationCount}
        </div>
        <p className="text-[11px] text-blue-600 font-medium mt-0.5">Mediação institucional ativa</p>
      </button>

      {/* 3. Unregistered Legacy Owners */}
      <div className="text-left bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Sem conta de proprietário
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {summary.unregisteredOwnersCount}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">Anúncios da feira física presencial</p>
      </div>

      {/* 4. Staff Access Status */}
      <div className="text-left bg-white rounded-2xl border border-amber-200/90 p-4.5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Acesso de operadores
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-base font-black font-mono text-amber-900 tracking-tight">
          DENY_PENDING
        </div>
        <p className="text-[11px] text-amber-800 font-medium mt-0.5">
          Operação exclusiva Main Admin (HOLD)
        </p>
      </div>
    </div>
  );
}
