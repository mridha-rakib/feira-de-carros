import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Building2,
  Calendar,
  Car,
  ExternalLink,
  FileCheck,
  FileText,
  Mail,
  Phone,
  Shield,
  Tag,
  User,
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { TransactionRecord } from '../../../lib/types/finance-presentation';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { TransactionStatusBadge } from './TransactionStatusBadge';

interface TransactionDetailPanelProps {
  transaction: TransactionRecord | null;
}

export function TransactionDetailPanel({ transaction }: TransactionDetailPanelProps) {
  if (!transaction) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 text-center text-slate-400">
        <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
        <p className="text-sm font-medium">Selecione uma transação para inspecionar os detalhes.</p>
      </div>
    );
  }

  const isPendingCash = transaction.status === 'PENDING' && transaction.method === 'CASH';

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5"
      data-testid="selected-transaction-detail-panel"
    >
      {/* Panel Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono font-bold text-lg text-slate-900">{transaction.id}</h3>
            <span className="text-[11px] font-mono text-slate-400">{transaction.orderId}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Criada em {transaction.createdAt}</p>
        </div>
        <TransactionStatusBadge status={transaction.status} size="md" />
      </div>

      {/* Amount and Plan Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/70">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Valor Cobrado
          </span>
          <PaymentMethodBadge method={transaction.method} size="sm" />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900">
            {formatBrl(transaction.amountBrl)}
          </span>
          <span className="text-xs text-slate-500 font-medium">taxa de serviço</span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>{transaction.planName}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {transaction.purpose === 'FEATURED_BOOST'
              ? 'Destaque Ouro/Prata'
              : transaction.purpose === 'RENEWAL'
                ? 'Renovação'
                : 'Taxa Anúncio'}
          </span>
        </div>
      </div>

      {/* Customer / Seller Section */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          Cliente / Vendedor
        </span>
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">{transaction.sellerName}</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
              {transaction.sellerType === 'concessionaria' ? 'Concessionária' : 'Particular'}
            </span>
          </div>
          <div className="text-slate-500 flex items-center justify-between">
            <span>Documento:</span>
            <span className="font-mono text-slate-700">{transaction.sellerDocumentMasked}</span>
          </div>
          <div className="text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              Telefone:
            </span>
            <span className="text-slate-700">{transaction.sellerPhone}</span>
          </div>
          <div className="text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              E-mail:
            </span>
            <span className="font-mono text-slate-700">{transaction.sellerEmailMasked}</span>
          </div>
        </div>
      </div>

      {/* Associated Advertisement Section */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-slate-400" />
          Anúncio Vinculado
        </span>
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-900">{transaction.adId}</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                transaction.adStatus === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {transaction.adStatus === 'APPROVED'
                ? 'Aprovado na Moderação'
                : 'Pendente de Moderação'}
            </span>
          </div>
          <div className="text-slate-800 font-medium">{transaction.vehicleTitle}</div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
            <span>Status no portal:</span>
            <span className="font-semibold text-slate-700">
              {transaction.adPublished ? '✓ Publicado online' : '✕ Não publicado'}
            </span>
          </div>
          <div className="pt-1">
            <Link
              href="/anuncios"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
            >
              <span>Ver anúncio na fila de moderação</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Critical Business Separation Notice */}
      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-950">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Regra de Independência (Figma / SRS)</span>
        </div>
        <p className="leading-relaxed">
          A confirmação de pagamento e a aprovação editorial são requisitos{' '}
          <strong>independentes</strong>. O pagamento confirmado{' '}
          <strong>NÃO publica automaticamente</strong> o anúncio sem aprovação veicular.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2 border-t border-slate-100">
        {/* Full Details Navigation (ADM-D-025) */}
        <Link
          href={`/pagamentos/${transaction.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
        >
          <span>Ver Detalhes Completos (ADM-D-025)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Cash Registration Trigger (ADM-D-026) for Pending Cash */}
        {isPendingCash && (
          <Link
            href={`/pagamentos/${transaction.id}/dinheiro`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
            data-testid="simulate-cash-registration-btn"
          >
            <Banknote className="w-4 h-4" />
            <span>Simular Registro em Dinheiro (ADM-D-026)</span>
          </Link>
        )}

        {/* Link to Cash Ledger if confirmed cash */}
        {transaction.method === 'CASH' && transaction.status === 'CONFIRMED' && (
          <Link
            href="/pagamentos/dinheiro"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xl transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consultar no Livro Caixa (ADM-D-027)</span>
          </Link>
        )}
      </div>
    </div>
  );
}
