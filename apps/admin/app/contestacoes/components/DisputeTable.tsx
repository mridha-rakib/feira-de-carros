'use client';

import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Lock,
  Scale,
  ShieldAlert,
  User,
  XCircle,
} from 'lucide-react';
import * as React from 'react';
import { formatBrl, mapTxToPay } from '../../../lib/adapters/mock-finance-data';
import type {
  CardDisputeRecord,
  ChargebackDisputeStatus,
} from '../../../lib/types/finance-presentation';

interface DisputeTableProps {
  disputes: CardDisputeRecord[];
  selectedDisputeId: string | null;
  onSelectDispute: (dispute: CardDisputeRecord) => void;
}

export function DisputeStatusBadge({
  status,
}: {
  status: ChargebackDisputeStatus;
}) {
  switch (status) {
    case 'UNDER_REVIEW':
      return (
        <span
          data-testid="dispute-status-under-review"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200"
        >
          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
          <span>Sob Análise</span>
        </span>
      );
    case 'INCOMPLETE_EVIDENCE':
      return (
        <span
          data-testid="dispute-status-incomplete-evidence"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200 animate-pulse"
        >
          <AlertCircle className="w-3 h-3 text-red-600" />
          <span>Evidência Pendente</span>
        </span>
      );
    case 'WON':
      return (
        <span
          data-testid="dispute-status-won"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Ganho</span>
        </span>
      );
    case 'LOST':
      return (
        <span
          data-testid="dispute-status-lost"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300"
        >
          <XCircle className="w-3 h-3 text-slate-600" />
          <span>Perdido / Debitado</span>
        </span>
      );
    default:
      return null;
  }
}

export function DisputeTable({ disputes, selectedDisputeId, onSelectDispute }: DisputeTableProps) {
  if (disputes.length === 0) {
    return (
      <div
        data-testid="dispute-table-empty"
        className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Nenhuma contestação encontrada</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Não há registros de chargeback que correspondam aos filtros de pesquisa selecionados.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="dispute-table-container"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Disputa & Caso</th>
              <th className="py-3 px-4">Titular / Vendedor</th>
              <th className="py-3 px-4">Cartão & Bandeira</th>
              <th className="py-3 px-4">Valor em Risco</th>
              <th className="py-3 px-4">Prazo PSP</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {disputes.map((dispute) => {
              const isSelected = selectedDisputeId === dispute.id;
              const payRef = mapTxToPay(dispute.transactionId);

              return (
                <tr
                  key={dispute.id}
                  data-testid={`dispute-row-${dispute.id}`}
                  tabIndex={0}
                  onClick={() => onSelectDispute(dispute)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectDispute(dispute);
                    }
                  }}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Disputa & Caso */}
                  <td className="py-3.5 px-4 font-medium">
                    <div className="font-mono font-bold text-slate-900">{dispute.id}</div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {dispute.pspCaseId}
                    </span>
                  </td>

                  {/* Titular */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{dispute.sellerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {dispute.sellerDocumentMasked}
                    </div>
                  </td>

                  {/* Cartão & Bandeira */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                      <span>{dispute.cardBrand}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      •••• {dispute.cardLastFour}
                    </div>
                  </td>

                  {/* Valor Disputado */}
                  <td className="py-3.5 px-4 font-medium">
                    <span className="text-red-700 font-extrabold text-xs block">
                      {formatBrl(dispute.amountBrl)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{payRef}</span>
                  </td>

                  {/* Prazo PSP */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span
                        className={
                          dispute.status === 'INCOMPLETE_EVIDENCE' ? 'text-red-600 font-bold' : ''
                        }
                      >
                        {dispute.pspDeadline}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Abertura: {dispute.disputedAt.split(' ')[0]}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <DisputeStatusBadge status={dispute.status} />
                  </td>

                  {/* Ação */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDispute(dispute);
                      }}
                      data-testid={`inspect-dispute-btn-${dispute.id}`}
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Inspecionar detalhes da contestação"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
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
