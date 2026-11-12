'use client';

import {
  AlertTriangle,
  Building2,
  Calendar,
  FileCheck,
  FileSpreadsheet,
  Info,
  Lock,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import * as React from 'react';
import {
  FIGMA_DISPUTES_METRICS,
  formatBrl,
  mockRevenueReport,
} from '../../lib/adapters/mock-finance-data';
import { AdminShell } from '../components/AdminShell';
import { FinanceNavigationTabs } from '../pagamentos/components/FinanceNavigationTabs';
import { DemoCsvExportButton } from './components/DemoCsvExportButton';
import { RevenueBreakdownTable } from './components/RevenueBreakdownTable';
import { RevenueChart } from './components/RevenueChart';
import { RevenueKpiCards } from './components/RevenueKpiCards';

export default function RevenueReportsPage() {
  return (
    <AdminShell
      breadcrumbs={['Admin', 'Financeiro', 'Relatórios de Receita']}
      maxWidthClass="max-w-[1330px]"
    >
      <div className="space-y-6" data-testid="revenue-reports-page-container">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Relatórios de Receita e Pagamentos
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ADM-D-031
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Demonstração analítica de receitas auferidas por contratação de planos e destaques
              veiculares.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DemoCsvExportButton />
          </div>
        </div>

        {/* Financial Subnavigation Tabs */}
        <FinanceNavigationTabs />

        {/* Financial Disclosure & Segregation Banner */}
        <div
          data-testid="revenue-governance-notice"
          className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs space-y-2 border border-slate-800"
        >
          <div className="flex items-center gap-2 font-bold text-white">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Nota de Governança Contábil e Segregação de Fundos (ADM-D-031)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-[11px] leading-relaxed">
            <p>
              • <strong>Modelo de Monetização:</strong> O portal Feira de Carros fatura
              exclusivamente sobre planos de anúncio e destaques pagos. O valor transacionado na
              compra e venda dos veículos físicos pelos particulares e concessionárias é negociado
              diretamente entre as partes (
              <strong>R$ 0,00 de intermediação financeira veicular</strong>).
            </p>
            <p>
              • <strong>Segregação Estrita:</strong> Fundos objeto de contestação bancária (R$
              130,00 em disputas) e solicitações de reembolso em análise (R$ 110,00) permanecem
              provisionados sob reserva cautelar e{' '}
              <strong>não são totalizados como receita garantida ou líquida</strong>.
            </p>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <RevenueKpiCards />

        {/* Interactive Responsive SVG Chart (1600px, 1366px, 768px, mobile) */}
        <RevenueChart />

        {/* Breakdown Accounting Table */}
        <RevenueBreakdownTable />
      </div>
    </AdminShell>
  );
}
