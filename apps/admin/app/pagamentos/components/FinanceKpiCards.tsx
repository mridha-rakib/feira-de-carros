import { Banknote, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type * as React from 'react';
import { FIGMA_FINANCE_METRICS, formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { PaymentMethod, PaymentStatus } from '../../../lib/types/finance-presentation';

interface FinanceKpiCardsProps {
  selectedStatus?: 'all' | PaymentStatus;
  selectedMethod?: 'all' | PaymentMethod;
  onFilterStatus?: (status: 'all' | PaymentStatus) => void;
  onFilterMethod?: (method: 'all' | PaymentMethod) => void;
  onNavigateCashLedger?: () => void;
}

export function FinanceKpiCards({
  selectedStatus = 'all',
  selectedMethod = 'all',
  onFilterStatus,
  onFilterMethod,
  onNavigateCashLedger,
}: FinanceKpiCardsProps) {
  return (
    <div
      data-testid="finance-kpis"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. Volume total transacionado */}
      <button
        type="button"
        onClick={() => {
          onFilterStatus?.('all');
          onFilterMethod?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedStatus === 'all' && selectedMethod === 'all'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Volume Transacionado
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {formatBrl(FIGMA_FINANCE_METRICS.totalTransactedBrl)}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Amostra de 5 transações</span>
          <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
            5 ordens
          </span>
        </div>
      </button>

      {/* 2. Transações confirmadas */}
      <button
        type="button"
        onClick={() => {
          onFilterStatus?.('CONFIRMED');
          onFilterMethod?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedStatus === 'CONFIRMED'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Transações Confirmadas
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {formatBrl(FIGMA_FINANCE_METRICS.confirmedVolumeBrl)}
          </span>
          <span className="text-xs text-emerald-600 font-medium">pagas</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Pix e Cartão confirmados</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {FIGMA_FINANCE_METRICS.confirmedCount} confirmadas
          </span>
        </div>
      </button>

      {/* 3. Pagamentos pendentes */}
      <button
        type="button"
        onClick={() => {
          onFilterStatus?.('PENDING');
          onFilterMethod?.('all');
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedStatus === 'PENDING'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pagamentos Pendentes
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-600">
            {formatBrl(FIGMA_FINANCE_METRICS.pendingVolumeBrl)}
          </span>
          <span className="text-xs text-amber-600 font-medium">a confirmar</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Aguardando balcão presencial</span>
          <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
            {FIGMA_FINANCE_METRICS.pendingCount} pendente
          </span>
        </div>
      </button>

      {/* 4. Recebimentos em dinheiro (Livro Caixa) */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCashLedger) {
            onNavigateCashLedger();
          } else {
            onFilterMethod?.('CASH');
          }
        }}
        className={`text-left p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
          selectedMethod === 'CASH'
            ? 'border-slate-900 ring-1 ring-slate-900/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Livro Caixa (Dinheiro)
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {formatBrl(FIGMA_FINANCE_METRICS.cashLedgerVolumeBrl)}
          </span>
          <span className="text-xs text-slate-400">espécie</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Recibos físicos de balcão</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {FIGMA_FINANCE_METRICS.cashLedgerCount} recibos
          </span>
        </div>
      </button>
    </div>
  );
}
