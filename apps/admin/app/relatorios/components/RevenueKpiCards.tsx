'use client';

import {
  AlertTriangle,
  ArrowUpRight,
  Car,
  Coins,
  DollarSign,
  Info,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import * as React from 'react';
import {
  FIGMA_DISPUTES_METRICS,
  formatBrl,
  mockRevenueReport,
} from '../../../lib/adapters/mock-finance-data';

export function RevenueKpiCards() {
  const r = mockRevenueReport;
  const provisionsBrl = FIGMA_DISPUTES_METRICS.totalDisputedBrl + 110; // R$ 130 disputes + R$ 110 refunds

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Receita Confirmada */}
      <div
        data-testid="kpi-confirmed-revenue"
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Receita Confirmada
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formatBrl(r.totalConfirmedRevenueBrl)}
          </span>
          <span className="inline-flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +181%
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Período auditado:</span>
          <span className="font-bold text-slate-800">{r.periodLabel}</span>
        </div>
      </div>

      {/* KPI 2: Anúncios Ativos Monetizados */}
      <div
        data-testid="kpi-active-ads-monetized"
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Anúncios Ativos
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Car className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {r.activeAdvertisementsCount.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs font-semibold text-slate-500">veículos</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Média por anúncio:</span>
          <span className="font-bold text-slate-800">
            {formatBrl(r.totalConfirmedRevenueBrl / r.activeAdvertisementsCount)}
          </span>
        </div>
      </div>

      {/* KPI 3: Vendas de Veículos Processadas (Regra de Marketplace) */}
      <div
        data-testid="kpi-vehicle-sales-zero"
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Vendas Intermediadas
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-700 tracking-tight">
            {formatBrl(r.vehicleSalesProcessedBrl)}
          </span>
          <span className="text-xs font-semibold text-slate-400">(Zero GMV)</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Modelo de Negócio:</span>
          <span className="font-semibold text-slate-700">Classificados / Planos</span>
        </div>
      </div>

      {/* KPI 4: Provisões e Segregação de Risco */}
      <div
        data-testid="kpi-provisions-segregated"
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xs text-left text-white"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Provisão de Risco
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400 tracking-tight">
            {formatBrl(provisionsBrl)}
          </span>
          <span className="text-xs font-semibold text-slate-400">segregado</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Disputas + Reembolsos:</span>
          <span className="font-bold text-slate-300">Não integrado à receita</span>
        </div>
      </div>
    </div>
  );
}
