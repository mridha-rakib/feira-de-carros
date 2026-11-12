'use client';

import { BrandLogo } from '@feira/ui';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  Lock,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  Smartphone,
  User,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import {
  FIGMA_DISPUTES_METRICS,
  formatBrl,
  mockCardDisputes,
  mockRefundRequests,
  mockTransactions,
} from '../../lib/adapters/mock-finance-data';
import { AdminMobileNavigation } from '../components/AdminMobileNavigation';

export default function MobileFinancialAlertsPage() {
  const pendingTransactions = mockTransactions.filter((t) => t.status === 'PENDING');
  const urgentDispute = mockCardDisputes.find((d) => d.status === 'INCOMPLETE_EVIDENCE');
  const pendingRefund = mockRefundRequests.find((r) => r.status === 'PENDING_REVIEW');
  const holdRefund = mockRefundRequests.find((r) => r.status === 'HOLD_LEGAL');

  return (
    <div
      data-testid="mobile-financial-alerts-page"
      className="min-h-screen bg-slate-50 pb-24 select-none"
    >
      {/* Mobile Header with Official 2026 Brand Logo */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <BrandLogo variant="on-light" priority width={132} height={26} className="h-6 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
              ADM-M-006
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Page Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Alertas Financeiros
            </h1>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <p className="text-xs text-slate-500">
            Painel móvel de monitoramento em tempo real de contestações, reembolsos e pendências.
          </p>
        </div>

        {/* Security / Restriction Warning Banner (ADM-019 / ADM-021) */}
        <div
          data-testid="mobile-restrictions-banner"
          className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800 shadow-xs"
        >
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Operações Restritas no Ambiente Móvel (ADM-019)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Por política de segurança financeira, estornos, homologação de chargebacks e confirmação
            de cédulas no caixa são <strong>bloqueados em dispositivos móveis</strong>. Acesse o
            terminal desktop para deliberar.
          </p>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-red-600 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Contestações</span>
            </div>
            <span className="text-lg font-black text-slate-900 block">
              {formatBrl(FIGMA_DISPUTES_METRICS.totalDisputedBrl)}
            </span>
            <span className="text-[10px] text-slate-500">
              {FIGMA_DISPUTES_METRICS.totalDisputesCount} casos abertos
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-600 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Reembolsos</span>
            </div>
            <span className="text-lg font-black text-slate-900 block">{formatBrl(110)}</span>
            <span className="text-[10px] text-slate-500">
              {mockRefundRequests.length} solicitações CDC
            </span>
          </div>
        </div>

        {/* Alert Cards Section */}
        <div className="space-y-3 pt-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Notificações Operacionais Prioritárias
          </h2>

          {/* Alert 1: Urgent Chargeback with Incomplete Evidence */}
          {urgentDispute && (
            <div
              data-testid="alert-card-chargeback-urgent"
              className="p-4 rounded-2xl bg-white border border-red-200 shadow-2xs space-y-2.5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Disputa Crítica de Cartão
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {urgentDispute.id} • {urgentDispute.cardBrand} ••••{' '}
                      {urgentDispute.cardLastFour}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 animate-pulse">
                  {urgentDispute.pspDeadline}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {urgentDispute.disputeReason}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Titular: <strong className="text-slate-800">{urgentDispute.sellerName}</strong>
                </span>
                <span className="font-extrabold text-red-700">
                  {formatBrl(urgentDispute.amountBrl)}
                </span>
              </div>
            </div>
          )}

          {/* Alert 2: CDC Refund Request in Review */}
          {pendingRefund && (
            <div
              data-testid="alert-card-refund-review"
              className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-2.5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Reembolso em Triagem CDC
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {pendingRefund.id} • Ref {pendingRefund.transactionId}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  SLA: 3 dias úteis
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Direito de arrependimento tempestivo (Art. 49). Vendedora solicitou cancelamento
                preventivo de plano de destaque.
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Vendedor: <strong className="text-slate-800">{pendingRefund.sellerName}</strong>
                </span>
                <span className="font-extrabold text-slate-900">
                  {formatBrl(pendingRefund.amountBrl)}
                </span>
              </div>
            </div>
          )}

          {/* Alert 3: Legal Hold Policy */}
          {holdRefund && (
            <div
              data-testid="alert-card-refund-hold"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Retenção Jurídica Ativa (HOLD)
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {holdRefund.id} • {holdRefund.vehicleTitle}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                  Parecer Pendente
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{holdRefund.notes}</p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Titular: <strong className="text-slate-800">{holdRefund.sellerName}</strong>
                </span>
                <span className="font-extrabold text-slate-900">
                  {formatBrl(holdRefund.amountBrl)}
                </span>
              </div>
            </div>
          )}

          {/* Alert 4: Cash Payment Awaiting Counter */}
          {pendingTransactions.map((tx) => (
            <div
              key={tx.id}
              data-testid={`alert-card-cash-pending-${tx.id}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Aguardando Pagamento em Espécie
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {tx.id} • Balcão Ipatinga - MG
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Pendente
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">
                  Cliente: <strong className="text-slate-800">{tx.sellerName}</strong>
                </span>
                <span className="font-extrabold text-slate-900">{formatBrl(tx.amountBrl)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Audit footer note */}
        <div className="p-3 text-center text-[10px] text-slate-400">
          Feira de Carros Admin 2026 • Ambiente Móvel de Visualização Auditada
        </div>
      </main>

      {/* Existing Mobile Bottom Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
