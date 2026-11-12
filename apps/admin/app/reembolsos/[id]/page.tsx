'use client';

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Info,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { formatBrl, mapTxToPay, mockRefundRequests } from '../../../lib/adapters/mock-finance-data';
import type { RefundRequestRecord } from '../../../lib/types/finance-presentation';
import { AdminShell } from '../../components/AdminShell';
import { RefundStatusBadge } from '../components/RefundTable';

export default function RefundReviewDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const refund = React.useMemo(() => {
    return mockRefundRequests.find((r) => r.id === id) || mockRefundRequests[0] || null;
  }, [id]);

  const [simulationState, setSimulationState] = React.useState<
    'NONE' | 'APPROVED_PREVIEW' | 'REJECTED_PREVIEW' | 'HOLD_PREVIEW'
  >('NONE');

  if (!refund) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Financeiro', 'Reembolsos', 'Não encontrado']}>
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto">
          <RotateCcw className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">
            Solicitação de Reembolso não encontrada
          </h2>
          <p className="text-xs text-slate-500">
            O protocolo "{id}" não existe na base de dados de demonstração.
          </p>
          <Link
            href="/reembolsos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Fila de Reembolsos</span>
          </Link>
        </div>
      </AdminShell>
    );
  }

  const payRef = mapTxToPay(refund.transactionId);

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Financeiro', 'Solicitações de Reembolso', refund.id]}
      maxWidthClass="max-w-[1240px]"
    >
      <div className="space-y-6" data-testid="refund-detail-review-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href="/reembolsos"
                data-testid="back-to-refunds-btn"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar para a fila"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Análise de Reembolso — Protocolo {refund.id}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                ADM-D-029
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Dossiê de avaliação jurídica e conformidade consumerista (Art. 49 da Lei 8.078/1990).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RefundStatusBadge status={refund.status} />
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              SLA: 3 dias úteis
            </span>
          </div>
        </div>

        {/* Legal Policy Warning Banner (HOLD) */}
        <div
          data-testid="refund-policy-hold-banner"
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs space-y-1.5"
        >
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Retenção de Segurança — Estornos Requerem Aprovação de Alçada (ADM-019)</span>
          </div>
          <p className="leading-relaxed text-amber-900/90">
            Esta interface destina-se{' '}
            <strong>exclusivamente à auditoria e instrução do parecer</strong>. Nenhum valor é
            debitado da conta gráfica ou transferido via PSP sem homologação do responsável
            financeiro e assinatura digital do parecer de encerramento.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Dossier Details & Criteria (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Dados Gerais da Contratação</span>
                </h2>
                <span className="text-xs font-mono text-slate-500">
                  Data solicitação: {refund.requestedAt}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Valor Original Pago
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {formatBrl(refund.amountBrl)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Método: {refund.method}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Transação Vinculada
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-800">
                    {refund.transactionId}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    Ref PSP: {payRef}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Prazo Legal (CDC)
                  </span>
                  <span className="text-sm font-bold text-amber-700">3 dias úteis</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {refund.legalDeadline}
                  </span>
                </div>
              </div>

              {/* Justification quote */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Motivo Informado pelo Cliente:
                </span>
                <blockquote className="p-3 bg-slate-50 rounded-xl border-l-4 border-amber-500 text-xs text-slate-800 italic">
                  "{refund.reason}"
                </blockquote>
              </div>
            </div>

            {/* Consumer Protection Criteria Checklist (CDC Art. 49) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Matriz de Critérios Consumeristas (CDC Art. 49)</span>
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Parecer Técnico
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Criterion 1 */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5 pr-4">
                    <strong className="text-slate-800 block">
                      1. Direito de arrependimento tempestivo (até 7 dias corridos)
                    </strong>
                    <p className="text-slate-500 text-[11px]">
                      A contratação e a solicitação ocorreram dentro do intervalo estipulado pelo
                      Código de Defesa do Consumidor.
                    </p>
                  </div>
                  <div className="shrink-0">
                    {refund.reviewCriteria.withinSevenDays ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Em conformidade</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-800 font-bold text-[11px]">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Prazo expirado</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Criterion 2 */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5 pr-4">
                    <strong className="text-slate-800 block">
                      2. Fruição do serviço de publicidade digital
                    </strong>
                    <p className="text-slate-500 text-[11px]">
                      Verificação se o anúncio já recebeu impressões substanciais, visualizações de
                      telefone ou contatos de compradores.
                    </p>
                  </div>
                  <div className="shrink-0">
                    {refund.reviewCriteria.boostAlreadyConsumed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Serviço consumido</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Não usufruído</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Criterion 3 */}
                <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="space-y-0.5 pr-4">
                    <strong className="text-slate-800 block">
                      3. Validação de duplicidade ou contestação bancária
                    </strong>
                    <p className="text-slate-500 text-[11px]">
                      Garantia de que não há chargeback aberto junto à bandeira em paralelo para o
                      mesmo valor.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sem conflito ativo</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>Trilha de Auditoria do Protocolo</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  {refund.auditTimeline.length} eventos registrados
                </span>
              </div>

              <div className="space-y-3 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {refund.auditTimeline.map((evt) => (
                  <div key={evt.id} className="relative pl-4 space-y-1 text-xs">
                    <div
                      className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white ${
                        evt.type === 'SUCCESS'
                          ? 'bg-emerald-500'
                          : evt.type === 'WARNING'
                            ? 'bg-amber-500'
                            : evt.type === 'ALERT'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 font-bold">{evt.title}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{evt.description}</p>
                    <div className="text-[10px] text-slate-400">
                      Operador: <span className="font-semibold">{evt.operator}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Dossier & Administrative Simulation Preview (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer & Ad Dossier Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-slate-600" />
                <span>Titular & Veículo Vinculado</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">
                    Cliente / Vendedor
                  </span>
                  <div className="font-bold text-slate-900">{refund.sellerName}</div>
                  <div className="text-slate-500 text-[11px] font-mono">
                    {refund.sellerDocumentMasked}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{refund.sellerEmailMasked}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{refund.sellerPhone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">
                    Veículo Anunciado
                  </span>
                  <div className="font-semibold text-slate-900">{refund.vehicleTitle}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ID: {refund.adId}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Publicado: {refund.adPublishedAt}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Preview Actions (Non-mutating Fail-Closed) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Simulação de Decisão (Mock)
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  Ferramenta de instrução prévia. Operações reais permanecem bloqueadas.
                </p>
              </div>

              {simulationState === 'APPROVED_PREVIEW' && (
                <div
                  data-testid="simulation-approved-preview"
                  className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1"
                >
                  <strong className="block font-bold">Prévia: Deferimento Integral</strong>
                  <p className="text-[11px]">
                    Simulação de estorno de {formatBrl(refund.amountBrl)} via Pix. Nenhuma ordem
                    bancária emitida (Demonstração).
                  </p>
                </div>
              )}

              {simulationState === 'REJECTED_PREVIEW' && (
                <div
                  data-testid="simulation-rejected-preview"
                  className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-800 space-y-1"
                >
                  <strong className="block font-bold">Prévia: Indeferimento Fundamentado</strong>
                  <p className="text-[11px]">
                    Simulação de recusa com base no Art. 49 c/c fruição comprovada de veiculação.
                  </p>
                </div>
              )}

              {simulationState === 'HOLD_PREVIEW' && (
                <div
                  data-testid="simulation-hold-preview"
                  className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1"
                >
                  <strong className="block font-bold">Prévia: Retenção Jurídica Confirmada</strong>
                  <p className="text-[11px]">
                    Protocolo encaminhado para a assessoria jurídica para parecer em 5 dias úteis.
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSimulationState('APPROVED_PREVIEW')}
                  data-testid="simulate-approve-btn"
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  Simular Deferimento do Estorno
                </button>

                <button
                  type="button"
                  onClick={() => setSimulationState('REJECTED_PREVIEW')}
                  data-testid="simulate-reject-btn"
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
                >
                  Simular Indeferimento Técnico
                </button>

                <button
                  type="button"
                  onClick={() => setSimulationState('HOLD_PREVIEW')}
                  data-testid="simulate-hold-btn"
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
                >
                  Manter Retenção Jurídica (HOLD)
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                Invariante do Sistema: Não persistir cancelamentos reais em banco de dados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
