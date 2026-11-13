'use client';

import { ArrowLeft, Clock, FileCheck, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { mockRefundRequests } from '../../lib/adapters/mock-finance-data';
import type {
  RefundRequestRecord,
  RefundRequestStatus,
} from '../../lib/types/finance-presentation';
import { AdminPagination } from '../components/AdminPagination';
import { AdminShell } from '../components/AdminShell';
import { FinanceNavigationTabs } from '../pagamentos/components/FinanceNavigationTabs';
import { RefundDetailPanel } from './components/RefundDetailPanel';
import { RefundKpiCards } from './components/RefundKpiCards';
import { RefundSearchFilters } from './components/RefundSearchFilters';
import { RefundTable } from './components/RefundTable';

const PAGE_SIZE = 10;

export default function RefundsPage() {
  const router = useRouter();
  const [refunds] = React.useState<RefundRequestRecord[]>(mockRefundRequests);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | RefundRequestStatus>('all');
  const [selectedRefundId, setSelectedRefundId] = React.useState<string>(
    mockRefundRequests[0]?.id || '',
  );
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter change handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: 'all' | RefundRequestStatus) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // Filter logic
  const filteredRefunds = React.useMemo(() => {
    return refunds.filter((r) => {
      const matchesSearch =
        searchTerm === '' ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.vehicleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.sellerEmailMasked.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [refunds, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredRefunds.length / PAGE_SIZE) || 1;
  const paginatedRefunds = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRefunds.slice(start, start + PAGE_SIZE);
  }, [filteredRefunds, currentPage]);

  // Selected refund object
  const selectedRefund = React.useMemo(() => {
    return filteredRefunds.find((r) => r.id === selectedRefundId) || filteredRefunds[0] || null;
  }, [filteredRefunds, selectedRefundId]);

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Financeiro', 'Solicitações de Reembolso']}
      maxWidthClass="max-w-[1330px]"
    >
      <div className="space-y-6" data-testid="refunds-page-container">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Fila de Solicitações de Reembolso
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                ADM-D-028
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Triagem de protocolos de cancelamento. Prazo operacional de 3 dias úteis para parecer
              administrativo, observando o direito legal de arrependimento (CDC Art. 49: 7 dias
              corridos).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              Amostra: 3 protocolos (Total: R$ 110,00)
            </span>

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

        {/* Financial Subnavigation Tabs */}
        <FinanceNavigationTabs />

        {/* 4 KPI Cards */}
        <RefundKpiCards selectedStatus={selectedStatus} onFilterStatus={handleStatusChange} />

        {/* Search & Filters */}
        <RefundSearchFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredRefunds.length}
          totalRecords={refunds.length}
        />

        {/* Desktop Master-Detail Grid (1600px and 1366px without stacking) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Table Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <RefundTable
              refunds={paginatedRefunds}
              selectedRefundId={selectedRefund?.id || null}
              onSelectRefund={(r) => setSelectedRefundId(r.id)}
              onNavigateDetail={(id) => router.push(`/reembolsos/${id}`)}
            />

            {totalPages > 1 && (
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredRefunds.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* Right Detail Panel Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6">
              <RefundDetailPanel refund={selectedRefund} />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
