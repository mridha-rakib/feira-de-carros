'use client';

import { ExternalLink, ShieldAlert, User } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import type { AccountDeletionRecord } from '../../../lib/types/account-deletion-presentation';

interface AccountDeletionDetailPanelProps {
  record: AccountDeletionRecord | null;
  onNavigateDetail: (id: string) => void;
}

export function AccountDeletionDetailPanel({
  record,
  onNavigateDetail,
}: AccountDeletionDetailPanelProps) {
  if (!record) {
    return (
      <div
        data-testid="deletion-detail-panel-empty"
        className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center space-y-3 shadow-2xs"
      >
        <User className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-xs text-slate-400">Selecione uma solicitação para revisar detalhes</p>
      </div>
    );
  }

  return (
    <div
      data-testid={`deletion-detail-panel-${record.id}`}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
    >
      {/* Top Header */}
      <div>
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">
          REGISTRO SELECIONADO · {record.id}
        </span>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">{record.userName}</h3>
        <div className="mt-2">
          {record.status === 'UNDER_REVIEW' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Em análise
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Correção
            </span>
          )}
        </div>
      </div>

      {/* Spec Key-Value Attributes matching Figma ADM-D-036 */}
      <div className="divide-y divide-slate-100 text-xs">
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Protocolo</span>
          <span className="font-mono font-bold text-slate-800">{record.id}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Conta</span>
          <span className="font-semibold text-slate-800">{record.userName}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Papel</span>
          <span className="text-slate-700">{record.userRoleLabel}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Status</span>
          <span className="font-semibold text-slate-800">{record.statusLabel}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Data do pedido</span>
          <span className="text-slate-700">{record.requestedAt} (demo)</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Anúncios associados</span>
          <span className="font-medium text-slate-800">{record.listingsImpactLabel}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Conversas</span>
          <span className="text-slate-700">{record.conversationsStatus}</span>
        </div>
        <div className="py-2 flex justify-between items-center">
          <span className="text-slate-500">Exclusão de dados</span>
          <span className="text-slate-700">{record.dataDeletionStatus}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Link
          href={`/usuarios?search=${encodeURIComponent(record.userName)}`}
          className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
        >
          Ver perfil
        </Link>
        <button
          type="button"
          onClick={() => onNavigateDetail(record.id)}
          data-testid="revisar-retencao-btn"
          className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
        >
          Revisar retenção
        </button>
      </div>
    </div>
  );
}
