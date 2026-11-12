'use client';

import { Banknote, FileCheck, RefreshCw, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { mockTransactions } from '../../lib/adapters/mock-finance-data';
import type {
  PaymentMethod,
  PaymentStatus,
  TransactionRecord,
} from '../../lib/types/finance-presentation';
import { AdminPagination } from '../components/AdminPagination';
import { AdminShell } from '../components/AdminShell';
import { FinanceKpiCards } from './components/FinanceKpiCards';
import { MobileFinanceSummary } from './components/MobileFinanceSummary';
import { TransactionDetailPanel } from './components/TransactionDetailPanel';
import { TransactionInspectionModal } from './components/TransactionInspectionModal';
import { TransactionSearchFilters } from './components/TransactionSearchFilters';
import { TransactionTable } from './components/TransactionTable';

const PAGE_SIZE = 10;

export default function PaymentsPage() {
  const router = useRouter();
  const [transactions] = React.useState<TransactionRecord[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | PaymentStatus>('all');
  const [selectedMethod, setSelectedMethod] = React.useState<'all' | PaymentMethod>('all');

  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string>(
    mockTransactions[0]?.id || '',
  );
  const [inspectingTransaction, setInspectingTransaction] =
    React.useState<TransactionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMobileReadOnly, setIsMobileReadOnly] = React.useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter change handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: 'all' | PaymentStatus) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleMethodChange = (method: 'all' | PaymentMethod) => {
    setSelectedMethod(method);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedMethod('all');
    setCurrentPage(1);
  };

  // Filtered transactions list
  const filteredTransactions = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const searchWords = term ? term.split(/\s+/).filter(Boolean) : [];

    return transactions.filter((t) => {
      const searchableText =
        `${t.id} ${t.orderId} ${t.adId} ${t.vehicleTitle} ${t.sellerName} ${t.sellerDocumentMasked}`.toLowerCase();
      const matchesSearch =
        searchWords.length === 0 || searchWords.every((word) => searchableText.includes(word));

      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const matchesMethod = selectedMethod === 'all' || t.method === selectedMethod;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [transactions, searchTerm, selectedStatus, selectedMethod]);

  // Paginated records
  const paginatedTransactions = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE) || 1;

  // Currently selected transaction for the right detail panel
  const selectedTransaction = React.useMemo(() => {
    return (
      transactions.find((t) => t.id === selectedTransactionId) || filteredTransactions[0] || null
    );
  }, [transactions, selectedTransactionId, filteredTransactions]);

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE FINANCIAL MONITORING (Figma ADM-M-009)                  */}
      {/* ============================================================== */}
      <MobileFinanceSummary
        transactions={transactions}
        onInspectTransaction={(tx) => {
          setInspectingTransaction(tx);
          setIsMobileReadOnly(true);
          setIsModalOpen(true);
        }}
      />

      {/* ============================================================== */}
      {/* DESKTOP FINANCIAL TRANSACTIONS (Figma ADM-D-024)               */}
      {/* ============================================================== */}
      <div
        data-testid="desktop-finance-management"
        className="hidden lg:block min-h-screen bg-slate-50"
      >
        <AdminShell
          breadcrumbs={['Admin', 'Financeiro', 'Transações de pagamentos']}
          maxWidthClass="max-w-[1330px]"
        >
          <div className="space-y-6">
            {/* Top Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Transações de Pagamentos
                  </h1>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    ADM-D-024
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Acompanhe e audite pagamentos de taxas de anúncio, destaques e confirmações de
                  balcão presencial.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Amostra: 5 transações (Confirmado: R$ 160,00)
                </span>

                {/* Direct Link to Cash Receipts Ledger (ADM-D-027) */}
                <Link
                  href="/pagamentos/dinheiro"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors shadow-2xs"
                  data-testid="nav-to-cash-ledger-btn"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Livro Caixa Dinheiro (ADM-D-027)</span>
                </Link>

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

            {/* 4 Summary KPI Cards */}
            <FinanceKpiCards
              selectedStatus={selectedStatus}
              selectedMethod={selectedMethod}
              onFilterStatus={handleStatusChange}
              onFilterMethod={handleMethodChange}
              onNavigateCashLedger={() => router.push('/pagamentos/dinheiro')}
            />

            {/* Filter Controls Bar */}
            <TransactionSearchFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
              selectedMethod={selectedMethod}
              onMethodChange={handleMethodChange}
              onResetFilters={handleResetFilters}
              filteredCount={filteredTransactions.length}
              totalCount={transactions.length}
            />

            {/* Split Screen Master-Detail Layout (Figma ADM-D-024 Corrected Design) */}
            {/* List panel: Exactly 740px in 1600px desktop, Detail panel: Exactly 521px */}
            <div className="flex flex-col 2xl:flex-row gap-6 items-start justify-between">
              {/* Left Column: Data Table & Pagination (740px calibrated in 1600px desktop) */}
              <div className="w-full 2xl:w-[740px] shrink-0 space-y-4">
                {paginatedTransactions.length > 0 ? (
                  <>
                    <TransactionTable
                      transactions={paginatedTransactions}
                      selectedTransactionId={selectedTransaction?.id || ''}
                      onSelectTransaction={(tx) => setSelectedTransactionId(tx.id)}
                      onViewDetails={(tx) => router.push(`/pagamentos/${tx.id}`)}
                    />

                    {/* Pagination Controls */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3">
                      <AdminPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={PAGE_SIZE}
                        totalItems={filteredTransactions.length}
                        itemName="transações"
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center text-slate-500 space-y-3">
                    <p className="font-semibold text-slate-700">Nenhuma transação encontrada</p>
                    <p className="text-xs text-slate-400">
                      Tente alterar os termos de busca ou limpar os filtros aplicados.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Selected Transaction Detail Panel (521px calibrated in 1600px desktop) */}
              <div className="w-full 2xl:w-[521px] shrink-0 sticky top-6">
                <TransactionDetailPanel transaction={selectedTransaction} />
              </div>
            </div>
          </div>
        </AdminShell>
      </div>

      {/* ============================================================== */}
      {/* FULL INSPECTION MODAL (Used for Mobile & Quick Inspection)     */}
      {/* ============================================================== */}
      <TransactionInspectionModal
        transaction={inspectingTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInspectingTransaction(null);
        }}
        readOnly={isMobileReadOnly}
      />
    </>
  );
}
