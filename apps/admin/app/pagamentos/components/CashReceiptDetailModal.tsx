'use client';

import {
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  FileText,
  Hash,
  Lock,
  MapPin,
  Shield,
  User,
  X,
} from 'lucide-react';
import type * as React from 'react';
import { formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { CashReceiptRecord } from '../../../lib/types/finance-presentation';

interface CashReceiptDetailModalProps {
  receipt: CashReceiptRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CashReceiptDetailModal({ receipt, isOpen, onClose }: CashReceiptDetailModalProps) {
  if (!isOpen || !receipt) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: custom modal overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="receipt-modal-title"
                  className="text-base font-mono font-bold text-slate-900"
                >
                  {receipt.id}
                </h2>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Auditado
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprovante de Entrada no Livro Caixa Presencial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Amount Callout */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                Valor Recebido em Espécie
              </span>
              <span className="text-2xl font-black text-slate-900">
                {formatBrl(receipt.amountReceivedBrl)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-mono block">Canhoto Físico:</span>
              <span className="text-sm font-mono font-bold text-slate-900">
                {receipt.physicalSlipNumber}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Data e hora do registro:</span>
              <span className="font-semibold text-slate-800">{receipt.receivedAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Local de recebimento:</span>
              <span className="font-semibold text-slate-800">{receipt.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Operador recebedor:</span>
              <span className="font-semibold text-slate-800">
                {receipt.operatorName} ({receipt.operatorId})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Perfil do operador:</span>
              <span className="font-mono text-slate-700">{receipt.operatorRole}</span>
            </div>
          </div>

          {/* Ad & Customer association */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Anúncio vinculado:</span>
              <span className="font-mono font-bold text-slate-900">{receipt.adId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Veículo:</span>
              <span className="font-medium text-slate-800">{receipt.vehicleTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Vendedor:</span>
              <span className="font-semibold text-slate-800">{receipt.sellerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Documento do pagador:</span>
              <span className="font-mono text-slate-700">{receipt.sellerDocumentMasked}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Plano contratado:</span>
              <span className="font-medium text-slate-800">{receipt.planName}</span>
            </div>
          </div>

          {/* Administrative notes */}
          <div className="space-y-1">
            <span className="font-semibold text-slate-700 block">Observações do Registro:</span>
            <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-600 leading-relaxed">
              {receipt.recordNotes}
            </p>
          </div>

          {/* Audit Hash */}
          <div className="p-3 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assinatura Criptográfica de Auditoria</span>
            </div>
            <div className="text-[10px] text-slate-400 break-all">{receipt.auditHash}</div>
          </div>

          {/* Immutability policy warning */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">
              Política de Imutabilidade (PAY-016 / PAY-017)
            </span>
            <p className="leading-relaxed">
              Este lançamento é definitivo e auditado. Edições, exclusões e estornos manuais no
              Livro Caixa são <strong>proibidos</strong> por normas contábeis da Feira de Carros.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <span className="text-xs text-slate-400">Consulta de Livro Caixa • ADM-D-027</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
