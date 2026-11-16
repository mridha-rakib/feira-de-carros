'use client';

import { ArrowLeft, CheckCircle2, Shield, UserCheck } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';

interface AccountDeletionLgpdReviewCardProps {
  selectedId: string;
}

export function AccountDeletionLgpdReviewCard({ selectedId }: AccountDeletionLgpdReviewCardProps) {
  return (
    <div
      data-testid="deletion-lgpd-review-card"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
    >
      <h3 className="text-sm font-bold text-slate-900">Revisão LGPD antes de uma exclusão</h3>

      {/* 3 Status / Process Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Box 1: Identidade e titularidade (Blue) */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <UserCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Identidade e titularidade</span>
          </div>
          <p className="text-[11px] text-blue-800/90 leading-relaxed">
            Autenticação, origem do pedido e permissão verificadas.
          </p>
        </div>

        {/* Box 2: Dependências da conta (Orange/Amber) */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Dependências da conta</span>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-relaxed">
            Anúncios, pagamentos, conversas e retenções identificados.
          </p>
        </div>

        {/* Box 3: Decisão e execução (Green) */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Decisão e execução</span>
          </div>
          <p className="text-[11px] text-emerald-800/90 leading-relaxed">
            Direitos legais e retenção aprovados; resultado auditável.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/usuarios"
          data-testid="back-to-users-btn"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos usuários
        </Link>
        <Link
          href={`/exclusao-contas/${selectedId}`}
          data-testid="visualizar-confirmacao-btn"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/60 text-xs font-bold rounded-xl transition-colors"
        >
          Visualizar confirmação do pedido
        </Link>
      </div>
    </div>
  );
}
