'use client';

import { AlertTriangle, ChevronRight, ExternalLink } from 'lucide-react';
import type * as React from 'react';
import type { AccountDeletionRecord } from '../../../lib/types/account-deletion-presentation';

interface AccountDeletionTableProps {
  records: AccountDeletionRecord[];
  selectedId: string | null;
  onSelectRecord: (record: AccountDeletionRecord) => void;
  onNavigateDetail: (id: string) => void;
}

export function AccountDeletionTable({
  records,
  selectedId,
  onSelectRecord,
  onNavigateDetail,
}: AccountDeletionTableProps) {
  if (records.length === 0) {
    return (
      <div
        data-testid="deletion-table-empty"
        className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3 shadow-2xs"
      >
        <p className="text-sm font-semibold text-slate-700">
          Nenhuma solicitação encontrada para os filtros aplicados
        </p>
        <p className="text-xs text-slate-400">
          Tente ajustar os termos de busca ou redefinir os filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table
            data-testid="account-deletion-table"
            className="w-full text-left border-collapse text-xs"
          >
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-3 px-4">
                  Protocolo / Conta
                </th>
                <th scope="col" className="py-3 px-4">
                  Recebido
                </th>
                <th scope="col" className="py-3 px-4">
                  Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Anúncios
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => {
                const isSelected = r.id === selectedId;

                return (
                  <tr
                    key={r.id}
                    data-testid={`deletion-row-${r.id}`}
                    onClick={() => onSelectRecord(r)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectRecord(r);
                      }
                    }}
                    tabIndex={0}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/60 hover:bg-amber-50/80' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Protocolo / Conta */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-slate-900 block">{r.id}</span>
                        <span className="text-[11px] text-slate-500 block">
                          {r.userName} · {r.userRoleLabel.toLowerCase()}
                        </span>
                      </div>
                    </td>

                    {/* Recebido */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600 font-semibold">
                      {r.requestedAt}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {r.status === 'UNDER_REVIEW' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Em análise
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Correção
                        </span>
                      )}
                    </td>

                    {/* Anúncios */}
                    <td className="py-3.5 px-4 text-blue-600 font-semibold text-[11px]">
                      {r.activeListingsLabel}
                    </td>

                    {/* Navigation arrow */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateDetail(r.id);
                        }}
                        data-testid={`navigate-deletion-detail-${r.id}`}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Ver detalhes da solicitação"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning Box Matching Figma ADM-D-036 */}
      <div
        data-testid="deletion-hold-warning"
        className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 space-y-1"
      >
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>NÃO APAGAR IMEDIATAMENTE</span>
        </div>
        <p className="text-[11px] text-amber-900/90 leading-relaxed">
          O pedido inicia revisão. Retenção de cobranças, auditoria, chats e obrigações legais pode
          impedir remoção imediata.
        </p>
      </div>
    </div>
  );
}
