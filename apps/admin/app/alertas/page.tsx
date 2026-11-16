'use client';

import { BrandLogo } from '@feira/ui';
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  FileCheck,
  Lock,
  Scale,
  Shield,
  ShieldAlert,
  Smartphone,
  User,
} from 'lucide-react';
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
  const urgentDispute = mockCardDisputes.find((d) => d.status === 'INCOMPLETE_EVIDENCE');
  const reviewDispute = mockCardDisputes.find((d) => d.id === 'DSP-2026-0001');
  const pendingRefund = mockRefundRequests.find((r) => r.status === 'PENDING_REVIEW');
  const pendingCashTx = mockTransactions.find((t) => t.id === 'TX-2026-0005');

  return (
    <div
      data-testid="mobile-financial-alerts-page"
      className="lg:hidden min-h-screen bg-slate-100 text-slate-800 pb-24 select-none"
    >
      {/* Approved Dark Mobile Header (Figma ADM-M-006) */}
      <header className="bg-[#0B111E] text-white p-4">
        <div className="flex items-center justify-between">
          <BrandLogo variant="on-dark" priority width={130} height={26} className="h-6 w-auto" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              ADM-M-006
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Ipatinga - MG</span>
          <span>Ambiente Demonstrativo (LGPD)</span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Alertas Financeiros</h1>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoramento móvel em modo leitura. Operações financeiras restritas ao terminal
            desktop.
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
            Por política estrita de governança contábil, estornos, homologação de chargebacks e
            confirmação de dinheiro em espécie são{' '}
            <strong>bloqueados em dispositivos móveis</strong>. Acesse o desktop com credencial
            autorizada para deliberar.
          </p>
        </div>

        {/* Quick KPI Strip Matching Approved Figma ADM-M-006 Values (12 Pending, 3 Disputes) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Approved Metric 1: 12 Pending Payments */}
          <div
            data-testid="mobile-kpi-pending-payments"
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left"
          >
            <div className="flex items-center gap-1.5 text-amber-600 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Pagamentos</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">12</span>
              <span className="text-xs font-semibold text-amber-700">pendentes</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
              Aguardando conciliação / balcão
            </div>
          </div>

          {/* Approved Metric 2: 3 Card Disputes */}
          <div
            data-testid="mobile-kpi-card-disputes"
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left"
          >
            <div className="flex items-center gap-1.5 text-red-600 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Contestações</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">3</span>
              <span className="text-xs font-semibold text-red-600">em disputa</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
              {formatBrl(FIGMA_DISPUTES_METRICS.totalDisputedBrl)} sob custódia
            </div>
          </div>
        </div>

        {/* Operational Read-Only Alert Cards */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Notificações Operacionais Prioritárias
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Modo Leitura</span>
          </div>

          {/* Alert Card 1: Urgent Chargeback with Incomplete Evidence */}
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
                      Disputa de Cartão — Evidência Pendente
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
                <span className="text-slate-500 text-[11px]">
                  Titular: <strong className="text-slate-800">{urgentDispute.sellerName}</strong> (
                  {urgentDispute.sellerDocumentMasked})
                </span>
                <span className="font-extrabold text-red-700">
                  {formatBrl(urgentDispute.amountBrl)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Modo Leitura • Envio de defesa restrito ao terminal desktop</span>
              </div>
            </div>
          )}

          {/* Alert Card 2: Chargeback Under Review */}
          {reviewDispute && (
            <div
              data-testid="alert-card-chargeback-review"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Contestação em Julgamento na Bandeira
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {reviewDispute.id} • {reviewDispute.cardBrand} ••••{' '}
                      {reviewDispute.cardLastFour}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {reviewDispute.pspDeadline}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {reviewDispute.disputeReason}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500 text-[11px]">
                  Titular: <strong className="text-slate-800">{reviewDispute.sellerName}</strong> (
                  {reviewDispute.sellerDocumentMasked})
                </span>
                <span className="font-extrabold text-slate-900">
                  {formatBrl(reviewDispute.amountBrl)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Modo Leitura • Saldo retido preventivamente no PSP</span>
              </div>
            </div>
          )}

          {/* Alert Card 3: Refund in Operational Triage (CDC Art. 49) */}
          {pendingRefund && (
            <div
              data-testid="alert-card-refund-review"
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Reembolso — Direito de Arrependimento (CDC Art. 49)
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {pendingRefund.id} • Ref {pendingRefund.transactionId}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Triagem: 3 dias úteis
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Solicitação de cancelamento tempestivo dentro dos 7 dias corridos do Art. 49 do CDC.
                Destaque veicular pausado preventivamente.
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500 text-[11px]">
                  Vendedora: <strong className="text-slate-800">{pendingRefund.sellerName}</strong>{' '}
                  ({pendingRefund.sellerDocumentMasked})
                </span>
                <span className="font-extrabold text-slate-900">
                  {formatBrl(pendingRefund.amountBrl)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Modo Leitura • Parecer administrativo restrito ao desktop</span>
              </div>
            </div>
          )}

          {/* Alert Card 4: Cash Payment Awaiting Counter */}
          {pendingCashTx && (
            <div
              data-testid={`alert-card-cash-pending-${pendingCashTx.id}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Ordem em Dinheiro Aguardando Balcão
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400">
                      {pendingCashTx.id} • Balcão Ipatinga - MG
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Pendente Balcão
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500 text-[11px]">
                  Cliente: <strong className="text-slate-800">{pendingCashTx.sellerName}</strong> (
                  {pendingCashTx.sellerDocumentMasked})
                </span>
                <span className="font-extrabold text-slate-900">
                  {formatBrl(pendingCashTx.amountBrl)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Modo Leitura • Confirmação de recebimento bloqueada no celular</span>
              </div>
            </div>
          )}
        </div>

        {/* Audit footer note */}
        <div className="p-3 text-center text-[10px] text-slate-400 space-y-1">
          <div>Feira de Carros Admin 2026 • Visualização Mobile Auditada (ADM-M-006)</div>
          <div className="text-[9px] text-slate-400 font-mono">
            Dados cadastrais mascarados em conformidade com a LGPD (Lei 13.709/2018)
          </div>
        </div>
      </main>

      {/* Existing Mobile Bottom Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
