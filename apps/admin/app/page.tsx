'use client';

import { ApiError } from '@feira/api-client';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import {
  figmaAttentionSummary,
  figmaChartData,
  figmaRecentListings,
  figmaSummaryMetrics,
} from '../lib/adapters/mock-presentation-data';
import { useDashboardOverview } from '../lib/hooks/use-dashboard-overview';
import { isProductionEnvironment } from '../lib/security/environment';
import { type MockScenario, getSafeScenario } from '../lib/security/scenario-validator';
import { AdminMobileOverview } from './components/AdminMobileOverview';
import { AdminShell } from './components/AdminShell';
import { DashboardErrorState } from './components/DashboardErrorState';
import { DashboardLoadingState } from './components/DashboardLoadingState';
import { DashboardRevenueChart } from './components/DashboardRevenueChart';
import { DashboardSummaryCards } from './components/DashboardSummaryCards';
import { RecentListingsTable } from './components/RecentListingsTable';
import { RequiresAttentionPanel } from './components/RequiresAttentionPanel';

function AdminOverviewContent() {
  const searchParams = useSearchParams();

  const isProduction = isProductionEnvironment();

  // Audit Finding F-04: Strict scenario validation & production gating
  const requestedScenario = searchParams.get('scenario');
  const safeScenario = React.useMemo(
    () => getSafeScenario(requestedScenario, isProduction),
    [requestedScenario, isProduction],
  );

  const activeScenario: MockScenario = safeScenario || 'success';

  // TanStack Query hook for server state retrieval & error handling (Finding F-02)
  const { data, isLoading, error, refetch } = useDashboardOverview(
    isProduction ? undefined : activeScenario,
  );

  // Derive summary metrics from server data when available, while preserving approved Figma presentation
  const summaryMetrics = React.useMemo(() => {
    if (activeScenario === 'empty' || (data && data.total_users === 0)) {
      return {
        ...figmaSummaryMetrics,
        activeListings: { count: 0, formatted: '0', trend: '0% este mês' },
        approvedSellers: { count: 0, formatted: '0', trend: '0 nos últimos 30 dias' },
        pendingApprovals: {
          count: 0,
          formatted: '0',
          trend: '0 vendedores • 0 anúncios',
          sellersCount: 0,
          listingsCount: 0,
        },
        confirmedRevenue: { amount: 0, formatted: 'R$ 0', trend: '0% vs. mês anterior' },
      };
    }

    if (data) {
      const revenue = (data as unknown as { confirmed_revenue?: number }).confirmed_revenue;
      return {
        ...figmaSummaryMetrics,
        activeListings: {
          ...figmaSummaryMetrics.activeListings,
          count: data.active_listings,
          formatted: data.active_listings.toLocaleString('pt-BR'),
        },
        approvedSellers: {
          ...figmaSummaryMetrics.approvedSellers,
          count: data.total_users,
          formatted: data.total_users.toLocaleString('pt-BR'),
        },
        pendingApprovals: {
          ...figmaSummaryMetrics.pendingApprovals,
          count: data.pending_approvals,
          formatted: data.pending_approvals.toLocaleString('pt-BR'),
        },
        confirmedRevenue: {
          ...figmaSummaryMetrics.confirmedRevenue,
          amount: revenue ?? 0,
          formatted:
            revenue != null
              ? `R$ ${revenue.toLocaleString('pt-BR')}`
              : isProduction
                ? 'Em apuração'
                : figmaSummaryMetrics.confirmedRevenue.formatted,
        },
        provenance: 'LIVE BACKEND' as const,
      };
    }

    if (isProduction) {
      return {
        activeListings: { count: 0, formatted: '—', trend: 'Aguardando backend' },
        approvedSellers: { count: 0, formatted: '—', trend: 'Aguardando backend' },
        pendingApprovals: {
          count: 0,
          formatted: '—',
          trend: 'Aguardando backend',
          sellersCount: 0,
          listingsCount: 0,
        },
        confirmedRevenue: { amount: 0, formatted: '—', trend: 'Aguardando backend' },
        provenance: 'PENDING BACKEND' as const,
      };
    }

    return figmaSummaryMetrics;
  }, [data, activeScenario, isProduction]);

  // Handle Error States (401, 403, 500, 503)
  if (error) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : undefined;

    return (
      <AdminShell>
        <DashboardErrorState statusCode={statusCode} message={message} onRetry={() => refetch()} />
      </AdminShell>
    );
  }

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE OVERVIEW (Figma ADM-M-001)                               */}
      {/* ============================================================== */}
      <div className="block lg:hidden" data-testid="mobile-dashboard">
        <AdminMobileOverview metrics={summaryMetrics} attention={figmaAttentionSummary} />
      </div>

      {/* ============================================================== */}
      {/* DESKTOP OVERVIEW (Figma ADM-D-002)                              */}
      {/* ============================================================== */}
      <div className="hidden lg:block" data-testid="desktop-dashboard">
        <AdminShell>
          {isLoading ? (
            <DashboardLoadingState />
          ) : (
            <div className="space-y-6">
              {/* Page Title & Subtitle (Figma ADM-D-002) */}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Visão geral
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Acompanhe anúncios, vendedores, pagamentos e pendências em um só lugar.
                </p>
              </div>

              {/* 4 Summary Cards (Figma ADM-D-002) */}
              <DashboardSummaryCards metrics={summaryMetrics} isMobile={false} />

              {/* Middle Row: Revenue Chart + Requires Attention Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex flex-col">
                  <DashboardRevenueChart data={figmaChartData} />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <RequiresAttentionPanel attention={figmaAttentionSummary} isMobile={false} />
                </div>
              </div>

              {/* Bottom Row: Recent Listings Table */}
              <RecentListingsTable listings={figmaRecentListings} />

              {/* Approved Figma Disclaimer Note */}
              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  AMBIENTE DEMONSTRATIVO • Dados e nomes fictícios; imagens vinculares ilustrativas
                  geradas, não fotos de veículos reais.
                </p>
              </div>
            </div>
          )}
        </AdminShell>
      </div>
    </>
  );
}

export default function AdminOverviewPage() {
  return (
    <React.Suspense
      fallback={
        <AdminShell>
          <DashboardLoadingState />
        </AdminShell>
      }
    >
      <AdminOverviewContent />
    </React.Suspense>
  );
}
