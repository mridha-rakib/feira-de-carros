'use client';

import { RefreshCw, ShieldAlert } from 'lucide-react';
import * as React from 'react';
import { mockCardDisputes } from '../../lib/adapters/mock-finance-data';
import type {
  CardDisputeRecord,
  ChargebackDisputeStatus,
} from '../../lib/types/finance-presentation';
import { AdminPagination } from '../components/AdminPagination';
import { AdminShell } from '../components/AdminShell';
import { FinanceNavigationTabs } from '../pagamentos/components/FinanceNavigationTabs';
import { DisputeDetailPanel } from './components/DisputeDetailPanel';
import { DisputeKpiCards } from './components/DisputeKpiCards';
import { DisputeSearchFilters } from './components/DisputeSearchFilters';
import { DisputeTable } from './components/DisputeTable';

const PAGE_SIZE = 10;

export default function CardDisputesPage() {
  const [disputes] = React.useState<CardDisputeRecord[]>(mockCardDisputes);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | ChargebackDisputeStatus>(
    'all',
  );
  const [selectedDisputeId, setSelectedDisputeId] = React.useState<string>(
    mockCardDisputes[0]?.id || '',
  );
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: 'all' | ChargebackDisputeStatus) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // Filtered disputes
  const filteredDisputes = React.useMemo(() => {
    return disputes.filter((d) => {
      const matchesSearch =
        searchTerm === '' ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.pspCaseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.cardBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.vehicleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || d.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [disputes, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredDisputes.length / PAGE_SIZE) || 1;
  const paginatedDisputes = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDisputes.slice(start, start + PAGE_SIZE);
  }, [filteredDisputes, currentPage]);

  // Selected dispute
  const selectedDispute = React.useMemo(() => {
    return filteredDisputes.find((d) => d.id === selectedDisputeId) || filteredDisputes[0] || null;
  }, [filteredDisputes, selectedDisputeId]);

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Financeiro', 'Contestações de Cartão']}
      maxWidthClass="max-w-[1330px]"
    >
      <div className="space-y-6" data-testid="disputes-page-container">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Disputas e Contestações de Cartão (Chargebacks)
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-100 text-red-800">
                ADM-D-030
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Gestão de contestações abertas por titulares junto às adquirentes e bandeiras. Valores
              em disputa não compõem receita garantida.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              Amostra: 3 disputas (Total: R$ 130,00)
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
        <DisputeKpiCards selectedStatus={selectedStatus} onFilterStatus={handleStatusChange} />

        {/* Search & Filters */}
        <DisputeSearchFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredDisputes.length}
          totalRecords={disputes.length}
        />

        {/* Desktop Master-Detail Grid (1600px and 1366px without stacking) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Table Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <DisputeTable
              disputes={paginatedDisputes}
              selectedDisputeId={selectedDispute?.id || null}
              onSelectDispute={(d) => setSelectedDisputeId(d.id)}
            />

            {totalPages > 1 && (
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredDisputes.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* Right Detail Panel Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6">
              <DisputeDetailPanel dispute={selectedDispute} />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
