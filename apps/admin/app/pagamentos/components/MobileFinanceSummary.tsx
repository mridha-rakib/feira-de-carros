'use client';

import { BrandLogo } from '@feira/ui';
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Eye,
  Filter,
  Lock,
  Search,
  Shield,
  ShieldAlert,
} from 'lucide-react';
import * as React from 'react';
import { FIGMA_FINANCE_METRICS, formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { PaymentStatus, TransactionRecord } from '../../../lib/types/finance-presentation';
import { AdminMobileNavigation } from '../../components/AdminMobileNavigation';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { TransactionStatusBadge } from './TransactionStatusBadge';

interface MobileFinanceSummaryProps {
  transactions: TransactionRecord[];
  onInspectTransaction: (transaction: TransactionRecord) => void;
}

export function MobileFinanceSummary({
  transactions,
  onInspectTransaction,
}: MobileFinanceSummaryProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | PaymentStatus>('all');

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.adId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.sellerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  return (
    <div
      className="block lg:hidden min-h-screen bg-slate-900 text-slate-100 pb-28 select-none"
      data-testid="mobile-finance-management"
    >
      {/* 1. Mobile Header with Official 2026 Brand Logo */}
      <header className="px-4 pt-4 pb-3 border-b border-slate-800 bg-[#0B111E] sticky top-0 z-30">
        <div className="flex items-center justify-between mb-3">
          <BrandLogo variant="on-dark" priority width={138} height={28} className="h-7 w-auto" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
              ADMIN • MOBILE WEB
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              ADM-M-009
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-lg font-black tracking-tight text-white">Transações e Pagamentos</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoramento financeiro restrito a consulta em dispositivo móvel.
          </p>
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* 2. ADM-021 / AUTH-019 Financial Security Notice */}
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Terminal Móvel Restrito — Modo Leitura (ADM-021)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-200/90">
            Confirmações financeiras, recebimentos em dinheiro (Livro Caixa), estornos e alteração
            de status são{' '}
            <strong>exclusivos do terminal desktop sob perfil Administrador Principal</strong>.
          </p>
        </div>

        {/* 3. Alerts & Disputes Summary Banner */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Resumo de Alertas Financeiros
          </span>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-lg font-black text-amber-400 block">
                {FIGMA_FINANCE_METRICS.pendingCount}
              </span>
              <span className="text-[10px] text-amber-300 font-medium">Pendente Balcão</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50">
              <span className="text-lg font-black text-slate-300 block">
                {FIGMA_FINANCE_METRICS.disputeCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Disputas / Contestações
              </span>
            </div>
          </div>
        </div>

        {/* 4. Search and Filter Chips */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ID, anúncio ou cliente..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/90 text-white placeholder:text-slate-500 border border-slate-700 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todas ({transactions.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('CONFIRMED')}
              className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'CONFIRMED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Confirmadas ({FIGMA_FINANCE_METRICS.confirmedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Pendentes ({FIGMA_FINANCE_METRICS.pendingCount})
            </button>
          </div>
        </div>

        {/* 5. Masked Transaction Cards List */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2.5 transition-all"
              data-testid={`mobile-tx-card-${tx.id}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-white">{tx.id}</span>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{tx.adId}</div>
                </div>
                <TransactionStatusBadge status={tx.status} size="sm" />
              </div>

              <div className="text-xs text-slate-300 font-medium line-clamp-1">
                {tx.vehicleTitle}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/60">
                <div className="text-[11px] text-slate-400">
                  <span className="block text-slate-300 font-medium">{tx.sellerName}</span>
                  <span className="font-mono text-[10px]">{tx.sellerDocumentMasked}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">{formatBrl(tx.amountBrl)}</span>
                  <div className="text-[10px] text-slate-400">
                    {tx.method === 'PIX'
                      ? 'Pix'
                      : tx.method === 'CREDIT_CARD'
                        ? 'Cartão'
                        : 'Dinheiro'}
                  </div>
                </div>
              </div>

              {/* Read-only inspection button */}
              <button
                type="button"
                onClick={() => onInspectTransaction(tx)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Inspecionar Transação (Modo Leitura)</span>
              </button>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-800/40 rounded-2xl border border-slate-800">
              Nenhuma transação encontrada para os filtros selecionados.
            </div>
          )}
        </div>
      </div>

      {/* 6. Approved Mobile Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
