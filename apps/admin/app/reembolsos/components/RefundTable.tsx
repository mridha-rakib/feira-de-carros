'use client';

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  RotateCcw,
  Scale,
  Shield,
  Tag,
  User,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { formatBrl } from '../../../lib/adapters/mock-finance-data';
import type {
  RefundRequestRecord,
  RefundRequestStatus,
} from '../../../lib/types/finance-presentation';

interface RefundTableProps {
  refunds: RefundRequestRecord[];
  selectedRefundId: string | null;
  onSelectRefund: (refund: RefundRequestRecord) => void;
  onNavigateDetail?: (id: string) => void;
}

export function RefundStatusBadge({ status }: { status: RefundRequestStatus }) {
  switch (status) {
    case 'PENDING_REVIEW':
      return (
        <span
          data-testid="refund-status-pending"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200"
        >
          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
          <span>Em Análise</span>
        </span>
      );
    case 'HOLD_LEGAL':
      return (
        <span
          data-testid="refund-status-hold"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200"
        >
          <Scale className="w-3 h-3 text-red-600" />
          <span>Retenção Jurídica</span>
        </span>
      );
    case 'APPROVED':
      return (
        <span
          data-testid="refund-status-approved"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Aprovado</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span
          data-testid="refund-status-rejected"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300"
        >
          <AlertTriangle className="w-3 h-3 text-slate-600" />
          <span>Recusado</span>
        </span>
      );
    case 'REFUNDED':
      return (
        <span
          data-testid="refund-status-refunded"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"
        >
          <RotateCcw className="w-3 h-3 text-blue-600" />
          <span>Concluído / Estornado</span>
        </span>
      );
    default:
      return null;
  }
}

export function RefundTable({
  refunds,
  selectedRefundId,
  onSelectRefund,
  onNavigateDetail,
}: RefundTableProps) {
  if (refunds.length === 0) {
    return (
      <div
        data-testid="refund-table-empty"
        className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
          <RotateCcw className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Nenhuma solicitação de reembolso encontrada
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Não há registros que correspondam aos filtros de pesquisa selecionados.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="refund-table-container"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Solicitação</th>
              <th className="py-3 px-4">Cliente / Vendedor</th>
              <th className="py-3 px-4">Veículo / Plano</th>
              <th className="py-3 px-4">Valor & Método</th>
              <th className="py-3 px-4">Data & Prazo</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {refunds.map((refund) => {
              const isSelected = selectedRefundId === refund.id;

              return (
                <tr
                  key={refund.id}
                  data-testid={`refund-row-${refund.id}`}
                  tabIndex={0}
                  onClick={() => onSelectRefund(refund)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectRefund(refund);
                    }
                  }}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Solicitação ID */}
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{refund.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Ref: {refund.transactionId}
                    </span>
                  </td>

                  {/* Cliente / Vendedor */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{refund.sellerName}</div>
                    <div className="text-[11px] text-slate-500">{refund.sellerDocumentMasked}</div>
                  </td>

                  {/* Veículo / Plano */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div
                      className="font-semibold text-slate-800 truncate"
                      title={refund.vehicleTitle}
                    >
                      {refund.vehicleTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{refund.planName}</div>
                  </td>

                  {/* Valor & Método */}
                  <td className="py-3.5 px-4 font-medium">
                    <span className="text-slate-900 font-extrabold text-xs block">
                      {formatBrl(refund.amountBrl)}
                    </span>
                    <span className="inline-block text-[10px] font-semibold text-slate-500 uppercase">
                      {refund.method}
                    </span>
                  </td>

                  {/* Data & Prazo */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{refund.requestedAt}</span>
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span className="truncate max-w-[140px]" title={refund.legalDeadline}>
                        {refund.legalDeadline}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <RefundStatusBadge status={refund.status} />
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRefund(refund);
                        }}
                        data-testid={`preview-refund-${refund.id}`}
                        className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                        title="Ver resumo lateral"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/reembolsos/${refund.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateDetail) onNavigateDetail(refund.id);
                        }}
                        data-testid={`detail-refund-link-${refund.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                        title="Abrir análise detalhada ADM-D-029"
                      >
                        <span>Revisar</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
