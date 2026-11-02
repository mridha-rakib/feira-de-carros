'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import type { AttentionSummary } from '../../lib/types/dashboard-presentation';

interface RequiresAttentionPanelProps {
  attention: AttentionSummary;
  isMobile?: boolean;
}

export function RequiresAttentionPanel({
  attention,
  isMobile = false,
}: RequiresAttentionPanelProps) {
  if (isMobile) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Mobile Header with Icon */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Requer atenção</h2>
        </div>

        {/* Counts List */}
        <div className="divide-y divide-slate-100 text-sm">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-600">Solicitações de vendedores</span>
            <span className="font-semibold text-slate-900">
              {attention.sellerApplications.count} • {attention.sellerApplications.detail}
            </span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-600">Anúncios para revisão</span>
            <span className="font-semibold text-slate-900">
              {attention.adsToReview.count} • {attention.adsToReview.detail}
            </span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-600">Pagamentos pendentes</span>
            <span className="font-semibold text-slate-900">
              {attention.pendingPayments.count} • {attention.pendingPayments.detail}
            </span>
          </div>
        </div>

        {/* Action Buttons from Figma ADM-M-001 */}
        <div className="space-y-2 pt-1">
          <Link
            href="/vendedores"
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Ver fila de vendedores
          </Link>
          <Link
            href="/anuncios"
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Ver revisão de anúncios
          </Link>
          <Link
            href="/pagamentos"
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Ver alertas financeiros
          </Link>
        </div>
      </div>
    );
  }

  // Desktop ADM-D-002 layout
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-5">Requer atenção</h2>

        <div className="space-y-4">
          {/* Item 1 */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">
              {attention.sellerApplications.count}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {attention.sellerApplications.label}
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">
              {attention.adsToReview.count}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {attention.adsToReview.label}
            </span>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              {attention.pendingPayments.count}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {attention.pendingPayments.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
