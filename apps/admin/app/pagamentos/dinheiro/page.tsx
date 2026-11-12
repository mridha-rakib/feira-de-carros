'use client';

import {
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Lock,
  RefreshCw,
  Search,
  Shield,
  Tag,
  User,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import {
  FIGMA_FINANCE_METRICS,
  formatBrl,
  mockCashReceipts,
} from '../../../lib/adapters/mock-finance-data';
import type { CashReceiptRecord } from '../../../lib/types/finance-presentation';
import { AdminPagination } from '../../components/AdminPagination';
import { AdminShell } from '../../components/AdminShell';
import { CashReceiptDetailModal } from '../components/CashReceiptDetailModal';

const PAGE_SIZE = 10;

export default function CashReceiptsLedgerPage() {
  const [receipts] = React.useState<CashReceiptRecord[]>(mockCashReceipts);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedOperator, setSelectedOperator] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Selected receipt for inspection modal
  const [inspectingReceipt, setInspectingReceipt] = React.useState<CashReceiptRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedOperator('all');
    setCurrentPage(1);
  };

  // Filtered receipts
  const filteredReceipts = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const searchWords = term ? term.split(/\s+/).filter(Boolean) : [];

    return receipts.filter((r) => {
      const searchableText =
        `${r.id} ${r.adId} ${r.physicalSlipNumber} ${r.vehicleTitle} ${r.sellerName} ${r.sellerDocumentMasked} ${r.operatorName}`.toLowerCase();
      const matchesSearch =
        searchWords.length === 0 || searchWords.every((word) => searchableText.includes(word));

      const matchesOperator =
        selectedOperator === 'all' || r.operatorName.includes(selectedOperator);

      return matchesSearch && matchesOperator;
    });
  }, [receipts, searchTerm, selectedOperator]);

  // Paginated records
  const paginatedReceipts = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReceipts.slice(start, start + PAGE_SIZE);
  }, [filteredReceipts, currentPage]);

  const totalPages = Math.ceil(filteredReceipts.length / PAGE_SIZE) || 1;

  return (
    <AdminShell breadcrumbs={['Admin', 'Financeiro', 'Livro Caixa em Dinheiro']}>
      <div className="space-y-6 max-w-6xl mx-auto" data-testid="cash-receipts-ledger-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/pagamentos"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar para Transações"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Livro Caixa — Recebimentos em Dinheiro
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ADM-D-027
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Histórico imutável de recebimentos presenciais em cédulas auditados no balcão de
              atendimento.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Total em Espécie: {formatBrl(FIGMA_FINANCE_METRICS.cashLedgerVolumeBrl)} (3 recibos)
            </span>

            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Atualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Immutability Policy Banner */}
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs space-y-1.5 border border-slate-800">
          <div className="flex items-center gap-2 font-bold text-white">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Livro Caixa Presencial — Integridade e Imutabilidade (PAY-016 / PAY-017)</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            Os registros de dinheiro presencial são escriturados e auditados com assinatura
            criptográfica. Nesta tela, lançamentos históricos são exibidos{' '}
            <strong>estritamente em modo leitura</strong>. Edições, cancelamentos ou exclusões
            manuais são bloqueados para conformidade contábil.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar por recibo (REC-...), canhoto, anúncio, cliente ou operador..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            {/* Operator Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedOperator}
                aria-label="Filtrar por operador"
                onChange={(e) => {
                  setSelectedOperator(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
              >
                <option value="all">Todos os operadores</option>
                <option value="Admin Principal">Admin Principal (USR-ADM-001)</option>
              </select>

              {(searchTerm || selectedOperator !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Exibindo <strong>{filteredReceipts.length}</strong> de{' '}
              <strong>{receipts.length}</strong> recibos de balcão (total:{' '}
              {formatBrl(FIGMA_FINANCE_METRICS.cashLedgerVolumeBrl)})
            </span>
            <span className="font-mono text-slate-400">Balcão Feira de Carros • Ipatinga MG</span>
          </div>
        </div>

        {/* Cash Receipts Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse text-xs"
              data-testid="cash-receipts-table"
            >
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-semibold text-[11px] uppercase tracking-wider select-none">
                  <th scope="col" className="py-3 px-3.5">
                    Recibo / Data
                  </th>
                  <th scope="col" className="py-3 px-3.5">
                    Canhoto Físico
                  </th>
                  <th scope="col" className="py-3 px-3.5">
                    Anúncio / Veículo
                  </th>
                  <th scope="col" className="py-3 px-3.5">
                    Cliente / Vendedor
                  </th>
                  <th scope="col" className="py-3 px-3.5">
                    Operador Staff
                  </th>
                  <th scope="col" className="py-3 px-3.5 text-right">
                    Valor em Espécie
                  </th>
                  <th scope="col" className="py-3 px-3.5 text-center">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {paginatedReceipts.map((rc) => (
                  <tr
                    key={rc.id}
                    tabIndex={0}
                    className="hover:bg-slate-50/80 bg-white transition-colors cursor-pointer"
                    onClick={() => {
                      setInspectingReceipt(rc);
                      setIsModalOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setInspectingReceipt(rc);
                        setIsModalOpen(true);
                      }
                    }}
                    data-testid={`cash-receipt-row-${rc.id}`}
                  >
                    {/* Recibo / Data */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Banknote className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-slate-900">{rc.id}</span>
                          <div className="text-[11px] text-slate-400 mt-0.5">{rc.receivedAt}</div>
                        </div>
                      </div>
                    </td>

                    {/* Canhoto Físico */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {rc.physicalSlipNumber}
                      </span>
                    </td>

                    {/* Anúncio / Veículo */}
                    <td className="py-3 px-3.5">
                      <div className="max-w-[200px]">
                        <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-1 py-0.5 rounded">
                          {rc.adId}
                        </span>
                        <div
                          className="text-slate-800 font-medium truncate mt-0.5"
                          title={rc.vehicleTitle}
                        >
                          {rc.vehicleTitle}
                        </div>
                      </div>
                    </td>

                    {/* Cliente / Vendedor */}
                    <td className="py-3 px-3.5">
                      <div className="max-w-[160px]">
                        <div
                          className="font-semibold text-slate-900 truncate"
                          title={rc.sellerName}
                        >
                          {rc.sellerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {rc.sellerDocumentMasked}
                        </div>
                      </div>
                    </td>

                    {/* Operador Staff */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{rc.operatorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rc.operatorId}</div>
                    </td>

                    {/* Valor em Espécie */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <span className="font-black text-slate-900 text-sm">
                        {formatBrl(rc.amountReceivedBrl)}
                      </span>
                      <div className="text-[10px] text-emerald-600 font-medium">em cédulas</div>
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectingReceipt(rc);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Ver Recibo</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedReceipts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Nenhum recibo em dinheiro localizado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={filteredReceipts.length}
              itemName="recibos"
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Read-Only Receipt Inspection Modal */}
      <CashReceiptDetailModal
        receipt={inspectingReceipt}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInspectingReceipt(null);
        }}
      />
    </AdminShell>
  );
}
