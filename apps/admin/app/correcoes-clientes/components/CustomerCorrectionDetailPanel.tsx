'use client';

import type { CustomerCorrectionRecord } from '@/lib/types/customer-corrections-presentation';
import { ArrowRight, ExternalLink, FileCheck, FileText, Lock, Shield, User } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';

interface CustomerCorrectionDetailPanelProps {
  correction: CustomerCorrectionRecord | undefined;
}

export function CustomerCorrectionDetailPanel({ correction }: CustomerCorrectionDetailPanelProps) {
  if (!correction) {
    return (
      <div
        data-testid="customer-correction-detail-empty"
        className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-400 shadow-2xs"
      >
        <Shield className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-xs font-semibold">Nenhuma correção selecionada</p>
      </div>
    );
  }

  return (
    <div
      data-testid="customer-correction-detail-panel"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5 sticky top-6"
    >
      {/* Header */}
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
          Solicitação Selecionada • {correction.id}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {correction.customerName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Conta: <span className="font-mono">{correction.accountId}</span> •{' '}
              {correction.accountType}
            </p>
          </div>
          {correction.status === 'IN_REVIEW' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {correction.statusLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {correction.statusLabel}
            </span>
          )}
        </div>
      </div>

      {/* Field Modification Comparison Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Campo: {correction.fieldLabel}</span>
          {correction.isSensitive && (
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
              Sensível
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Valor Atual
            </span>
            <span className="font-mono text-slate-500 text-[11px] block truncate">
              {correction.currentValueMasked}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-0.5">
              Solicitado
            </span>
            <span className="font-mono font-bold text-slate-900 text-[11px] block truncate">
              {correction.requestedValueMasked}
            </span>
          </div>
        </div>
      </div>

      {/* Key-Value Details */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400">Data da solicitação</span>
          <span className="font-medium text-slate-700">{correction.date}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-400">Permissão RBAC</span>
          <span className="font-mono text-amber-700 font-semibold text-[11px]">
            {correction.isSensitive ? 'DENY_PENDING' : 'Triagem permitida'}
          </span>
        </div>

        <div className="py-1.5 border-b border-slate-100 space-y-1">
          <span className="text-slate-400 block">Justificativa apresentada:</span>
          <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            "{correction.justification}"
          </p>
        </div>

        <div className="py-1.5 space-y-1">
          <span className="text-slate-400 block flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verificação de titularidade:
          </span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {correction.identityVerificationStatus}
          </p>
        </div>
      </div>

      {/* Action Links */}
      <div className="pt-2 flex flex-col gap-2">
        <Link
          href={`/correcoes-clientes/${correction.id}`}
          data-testid="review-correction-btn"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Analisar correção (ADM-D-042)</span>
        </Link>

        <Link
          href="/usuarios"
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          <span>Ver perfil do usuário</span>
        </Link>
      </div>
    </div>
  );
}
