'use client';

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Mail,
  Phone,
  Shield,
  ShieldAlert,
  Tag,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { formatBrl, mockTransactions } from '../../../lib/adapters/mock-finance-data';
import type { TransactionRecord } from '../../../lib/types/finance-presentation';
import { AdminShell } from '../../components/AdminShell';
import { PaymentMethodBadge } from '../components/PaymentMethodBadge';
import { TransactionStatusBadge } from '../components/TransactionStatusBadge';

export default function TransactionDetailPage() {
  const params = useParams();
  const txId = typeof params?.id === 'string' ? params.id : '';

  const transaction = React.useMemo(() => {
    return mockTransactions.find((t) => t.id === txId) || null;
  }, [txId]);

  if (!transaction) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Financeiro', 'Transação não encontrada']}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Transação Não Encontrada</h2>
          <p className="text-xs text-slate-500">
            O identificador {txId || 'informado'} não corresponde a nenhum registro na amostra
            financeira.
          </p>
          <div className="pt-2">
            <Link
              href="/pagamentos"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Lista de Pagamentos</span>
            </Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  const isPendingCash = transaction.status === 'PENDING' && transaction.method === 'CASH';

  return (
    <AdminShell breadcrumbs={['Admin', 'Financeiro', 'Transações', transaction.id]}>
      <div className="space-y-6 max-w-5xl mx-auto" data-testid="transaction-detail-view">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/pagamentos"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar para transações"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                {transaction.id}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                ADM-D-025
              </span>
              <TransactionStatusBadge status={transaction.status} size="md" />
            </div>
            <p className="text-xs text-slate-500">
              Ordem de referência:{' '}
              <strong className="font-mono text-slate-700">{transaction.orderId}</strong> • Criada
              em {transaction.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPendingCash && (
              <Link
                href={`/pagamentos/${transaction.id}/dinheiro`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                data-testid="detail-page-cash-preview-btn"
              >
                <Banknote className="w-4 h-4" />
                <span>Simular Registro em Dinheiro (ADM-D-026)</span>
              </Link>
            )}

            {transaction.method === 'CASH' && transaction.status === 'CONFIRMED' && (
              <Link
                href="/pagamentos/dinheiro"
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xl transition-colors"
              >
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Ver no Livro Caixa</span>
              </Link>
            )}
          </div>
        </div>

        {/* Top Cards: Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Valor da Transação
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {formatBrl(transaction.amountBrl)}
              </span>
              <span className="text-xs text-slate-400">BRL</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Finalidade:{' '}
              {transaction.purpose === 'FEATURED_BOOST'
                ? 'Destaque Promocional'
                : 'Taxa de Anúncio'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Método de Pagamento
            </span>
            <div className="mt-1">
              <PaymentMethodBadge method={transaction.method} size="md" />
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-2.5 truncate">
              Ref: {transaction.gatewayRef || 'N/A'}
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Plano Vinculado
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-1">
              <Tag className="w-4 h-4 text-slate-400" />
              <span>{transaction.planName}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Cobrança avulsa referente ao anúncio</p>
          </div>
        </div>

        {/* Two Columns: Customer & Advertisement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Customer Details */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                Dados do Cliente / Pagador
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {transaction.sellerType === 'concessionaria' ? 'Concessionária' : 'Particular'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nome:</span>
                <span className="font-semibold text-slate-900">{transaction.sellerName}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Documento (LGPD):</span>
                <span className="font-mono text-slate-700">{transaction.sellerDocumentMasked}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Telefone:</span>
                <span className="text-slate-700">{transaction.sellerPhone}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">E-mail:</span>
                <span className="font-mono text-slate-700">{transaction.sellerEmailMasked}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Advertisement & Vehicle */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-slate-400" />
                Anúncio Vinculado
              </h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  transaction.adStatus === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {transaction.adStatus === 'APPROVED' ? 'Aprovado' : 'Pendente de Moderação'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Identificador:</span>
                <span className="font-mono font-bold text-slate-900">{transaction.adId}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Veículo:</span>
                <span className="font-medium text-slate-900 text-right">
                  {transaction.vehicleTitle}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Placa Mascarada:</span>
                <span className="font-mono text-slate-700">{transaction.vehiclePlateMasked}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Publicado no Portal:</span>
                <span className="font-semibold text-slate-700">
                  {transaction.adPublished ? '✓ Sim, ativo online' : '✕ Não publicado'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/anuncios"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
              >
                <span>Inspecionar anúncio no painel de moderação</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Critical Rule Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Regra de Independência entre Pagamento e Moderação (Figma ADM-D-025)</span>
          </div>
          <p className="leading-relaxed">
            A liquidação financeira comprova apenas o pagamento da tarifa do anúncio ou destaque.
            Ela <strong>NÃO publica automaticamente o anúncio veicular</strong> nem substitui a
            análise de conformidade editorial, checagem documental e validação de placa.
          </p>
        </div>

        {/* Timeline & Audit Events */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-slate-400" />
            Histórico de Confirmação & Trilha de Auditoria
          </h2>

          <div className="space-y-3 pt-1">
            {transaction.timeline.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/70 text-xs flex items-start gap-3"
              >
                <div className="mt-0.5">
                  {evt.type === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : evt.type === 'WARNING' ? (
                    <Clock className="w-4 h-4 text-amber-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{evt.title}</span>
                    <span className="text-[11px] font-mono text-slate-400">{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">{evt.description}</p>
                  {evt.operator && (
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Operador: <strong className="text-slate-600">{evt.operator}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation / Actions */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            href="/pagamentos"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Lista de Pagamentos</span>
          </Link>

          {isPendingCash && (
            <Link
              href={`/pagamentos/${transaction.id}/dinheiro`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
            >
              <Banknote className="w-4 h-4" />
              <span>Simular Registro em Dinheiro (ADM-D-026)</span>
            </Link>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
