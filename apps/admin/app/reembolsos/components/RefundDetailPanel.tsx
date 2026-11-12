'use client';

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Scale,
  Shield,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { formatBrl, mapTxToPay } from '../../../lib/adapters/mock-finance-data';
import type { RefundRequestRecord } from '../../../lib/types/finance-presentation';
import { RefundStatusBadge } from './RefundTable';

interface RefundDetailPanelProps {
  refund: RefundRequestRecord | null;
}

export function RefundDetailPanel({ refund }: RefundDetailPanelProps) {
  if (!refund) {
    return (
      <div
        data-testid="refund-detail-panel-empty"
        className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
          <RotateCcw className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">Nenhuma solicitação selecionada</h3>
        <p className="text-xs text-slate-500">
          Clique em uma linha da tabela para visualizar o resumo de análise e critérios do CDC.
        </p>
      </div>
    );
  }

  const payRef = mapTxToPay(refund.transactionId);

  return (
    <div
      data-testid="refund-detail-panel"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {refund.id}
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">Ref {payRef}</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Resumo da Solicitação</h2>
        </div>
        <RefundStatusBadge status={refund.status} />
      </div>

      {/* Amount Callout */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Valor do Estorno
          </span>
          <span className="text-2xl font-black text-slate-900">{formatBrl(refund.amountBrl)}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 block uppercase">
            Método Original
          </span>
          <span className="text-xs font-bold text-slate-700">{refund.method}</span>
        </div>
      </div>

      {/* Solicitante / Contato */}
      <div className="space-y-2 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Dados do Solicitante</span>
        </h3>
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Nome:</span>
            <strong className="text-slate-800">{refund.sellerName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Documento:</span>
            <span className="font-mono text-slate-700">{refund.sellerDocumentMasked}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">E-mail:</span>
            <span className="text-slate-700">{refund.sellerEmailMasked}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Telefone:</span>
            <span className="text-slate-700">{refund.sellerPhone}</span>
          </div>
        </div>
      </div>

      {/* Anúncio e Plano */}
      <div className="space-y-2 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-slate-400" />
          <span>Veículo e Plano Vinculado</span>
        </h3>
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5">
          <div className="font-bold text-slate-900">{refund.vehicleTitle}</div>
          <div className="text-slate-500 text-[11px]">Plano: {refund.planName}</div>
          <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200/50">
            <span className="text-slate-500">Anúncio ID:</span>
            <span className="font-mono text-slate-700">{refund.adId}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Publicado em:</span>
            <span className="text-slate-700">{refund.adPublishedAt}</span>
          </div>
        </div>
      </div>

      {/* Justificativa */}
      <div className="space-y-1.5 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Motivo / Justificativa</span>
        </h3>
        <p className="p-3 bg-amber-50/60 text-amber-900 border border-amber-200/80 rounded-xl leading-relaxed text-xs">
          "{refund.reason}"
        </p>
      </div>

      {/* Critérios Preliminares (CDC Art. 49) */}
      <div className="space-y-2 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-slate-400" />
          <span>Critérios Legais (CDC Art. 49)</span>
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-600">Dentro dos 7 dias corridos:</span>
            {refund.reviewCriteria.withinSevenDays ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sim</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-red-700">
                <XCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Excedido</span>
              </span>
            )}
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-600">Serviço/Destaque consumido:</span>
            {refund.reviewCriteria.boostAlreadyConsumed ? (
              <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Sim (Audiência gerada)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Não consumido</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Policy HOLD Notice */}
      <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-1 border border-slate-800">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Política de Retenção e Auditoria</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Estornos não são automáticos. A liberação de valores exige protocolo com parecer jurídico
          assinado pelo compliance.
        </p>
      </div>

      {/* Link to Full Review Screen ADM-D-029 */}
      <Link
        href={`/reembolsos/${refund.id}`}
        data-testid="open-full-review-btn"
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
      >
        <span>Abrir Análise de Conformidade Completa</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
