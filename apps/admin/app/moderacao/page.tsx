'use client';

import { AdminPagination } from '@/app/components/AdminPagination';
import { AdminShell } from '@/app/components/AdminShell';
import { ModerationKpiCards } from '@/app/moderacao/components/ModerationKpiCards';
import { ModerationSearchFilters } from '@/app/moderacao/components/ModerationSearchFilters';
import { ReportDetailPanel } from '@/app/moderacao/components/ReportDetailPanel';
import { ReportTable } from '@/app/moderacao/components/ReportTable';
import { mockReports } from '@/lib/adapters/mock-moderation-data';
import type {
  ReportCategory,
  ReportRecord,
  ReportStatus,
} from '@/lib/types/moderation-presentation';
import { AlertTriangle, MessageSquareWarning, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

const PAGE_SIZE = 10;

export default function ModerationQueuePage() {
  const router = useRouter();
  const [reports] = React.useState<ReportRecord[]>(mockReports);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | ReportCategory>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | ReportStatus>('all');
  const [locationFilter, setLocationFilter] = React.useState('');
  const [selectedReportId, setSelectedReportId] = React.useState<string>(mockReports[0]?.id || '');
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: 'all' | ReportCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: 'all' | ReportStatus) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setLocationFilter('');
    setCurrentPage(1);
  };

  const filteredReports = React.useMemo(() => {
    return reports.filter((r) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        q === '' ||
        r.id.toLowerCase().includes(q) ||
        r.adId.toLowerCase().includes(q) ||
        r.vehicleTitle.toLowerCase().includes(q) ||
        r.sellerName.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;

      const locationQ = locationFilter.toLowerCase();
      const matchesLocation =
        locationQ === '' || r.sellerLocation.toLowerCase().includes(locationQ);

      return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
    });
  }, [reports, searchTerm, selectedCategory, selectedStatus, locationFilter]);

  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE) || 1;
  const paginatedReports = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, currentPage]);

  const selectedReport = React.useMemo(() => {
    return filteredReports.find((r) => r.id === selectedReportId) || filteredReports[0] || null;
  }, [filteredReports, selectedReportId]);

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Denúncias', 'Fila de denúncias e moderação']}
      maxWidthClass="max-w-[1330px]"
    >
      <div className="space-y-6" data-testid="moderation-queue-page">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Fila de denúncias e moderação
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                ADM-D-032
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Anúncios, vendedores e denúncias; acesso sensível condicionado por permissão.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Atualizar filtros"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <ModerationKpiCards selectedStatus={selectedStatus} onFilterStatus={handleStatusChange} />

        {/* Search & Filters */}
        <ModerationSearchFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredReports.length}
          totalRecords={reports.length}
          locationFilter={locationFilter}
          onLocationChange={handleLocationChange}
        />

        {/* Desktop Master-Detail Layout */}
        <div>
          {/* Section Label */}
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-800">Denúncias recebidas</h2>
            <p className="text-xs text-slate-500">
              Relatos de anúncio/vendedor, com evidências submetidas pelo denunciante; mensagens
              privadas protegidas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Table Column */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <ReportTable
                reports={paginatedReports}
                selectedReportId={selectedReport?.id || null}
                onSelectReport={(r) => setSelectedReportId(r.id)}
                onNavigateDetail={(id) => router.push(`/moderacao/${id}`)}
              />

              {totalPages > 1 && (
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredReports.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>

            {/* Detail Panel Column */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-6">
                <ReportDetailPanel report={selectedReport} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Read-Only Notice */}
        <div className="lg:hidden p-4 rounded-2xl bg-slate-900 text-white text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-300 mb-1">
            <MessageSquareWarning className="w-4 h-4 text-amber-400" />
            <span>Moderação — Acesso móvel somente leitura</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Nenhuma ação de moderação disponível em dispositivos móveis. Use o painel desktop para
            revisar e pré-visualizar decisões.
          </p>
        </div>

        {/* Demo Footer */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>SMG-08 / REL-07 — ACESSO SENSÍVEL PENDENTE</strong>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Nenhum usuário foi suspenso, nenhum anúncio removido e nenhuma conversa aberta por
                este protótipo. Páginas de report detail, conversation review e disposition serão
                módulos separados sob aprovação.
              </p>
            </div>
          </div>
        </div>

        {/* LGPD Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Registros fictícios; nenhum recebimento, cancelamento ou membrete
          executado.
        </div>
      </div>
    </AdminShell>
  );
}
