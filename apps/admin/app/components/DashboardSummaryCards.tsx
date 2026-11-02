'use client';

import { Car, CreditCard, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import * as React from 'react';
import type { DashboardSummaryMetrics } from '../../lib/types/dashboard-presentation';

interface DashboardSummaryCardsProps {
  metrics: DashboardSummaryMetrics;
  isMobile?: boolean;
}

export function DashboardSummaryCards({ metrics, isMobile = false }: DashboardSummaryCardsProps) {
  return (
    <div
      data-testid="summary-cards"
      className={`grid gap-4 ${
        isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
      }`}
    >
      {/* Card 1: Anúncios ativos */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">
            {isMobile ? 'Anúncios ativos' : 'Anúncios ativos'}
          </span>
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Car className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {metrics.activeListings.formatted}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metrics.activeListings.trend}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Vendedores aprovados */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">
            {isMobile ? 'Vendedores' : 'Vendedores aprovados'}
          </span>
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {metrics.approvedSellers.formatted}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isMobile ? 'Aprovados' : metrics.approvedSellers.trend}</span>
          </div>
        </div>
      </div>

      {/* Card 3: Aguardando aprovação */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">
            {isMobile ? 'Para analisar' : 'Aguardando aprovação'}
          </span>
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {metrics.pendingApprovals.formatted}
          </div>
          <div className="mt-2 text-xs font-medium text-amber-600">
            {isMobile ? '18 + 18 solicitações' : metrics.pendingApprovals.trend}
          </div>
        </div>
      </div>

      {/* Card 4: Receita confirmada */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">
            {isMobile ? 'Receita' : 'Receita confirmada'}
          </span>
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {metrics.confirmedRevenue.formatted}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isMobile ? 'Confirmada • bens' : metrics.confirmedRevenue.trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
