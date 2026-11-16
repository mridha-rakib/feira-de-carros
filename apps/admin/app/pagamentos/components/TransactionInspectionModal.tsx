'use client';

import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Shield,
  Tag,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { TransactionRecord } from '../../../lib/types/finance-presentation';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { TransactionStatusBadge } from './TransactionStatusBadge';

interface TransactionInspectionModalProps {
  transaction: TransactionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  readOnly?: boolean;
}

export function TransactionInspectionModal({
  transaction,
  isOpen,
  onClose,
  readOnly = false,
}: TransactionInspectionModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: custom modal overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="modal-title" className="text-lg font-mono font-bold text-slate-900">
                {transaction.id}
              </h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                ADM-D-025 • Inspeção
              </span>
              {readOnly && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Somente Leitura (ADM-021)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ordem de referência: {transaction.orderId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Top Status & Amount Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Valor Cobrado
              </span>
              <span className="text-xl font-black text-slate-900">
                {formatBrl(transaction.amountBrl)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Método
              </span>
              <PaymentMethodBadge method={transaction.method} size="sm" />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Status
              </span>
              <TransactionStatusBadge status={transaction.status} size="sm" />
            </div>
          </div>

          {/* Section: Customer / Seller */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Dados do Cliente / Faturamento
            </h3>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block">Nome / Razão Social:</span>
                  <span className="font-semibold text-slate-900">{transaction.sellerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tipo:</span>
                  <span className="font-semibold text-slate-700 capitalize">
                    {transaction.sellerType === 'concessionaria' ? 'Concessionária' : 'Particular'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Documento (LGPD):</span>
                  <span className="font-mono text-slate-700">
                    {transaction.sellerDocumentMasked}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Telefone:</span>
                  <span className="text-slate-700">{transaction.sellerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Ad & Vehicle */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400" />
              Anúncio Veicular Vinculado
            </h3>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900">{transaction.adId}</span>
                  <p className="text-slate-800 font-medium mt-0.5">{transaction.vehicleTitle}</p>
                </div>
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
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-500">
                <span>
                  Plano contratado: <strong>{transaction.planName}</strong>
                </span>
                <span>
                  Publicado: <strong>{transaction.adPublished ? 'Sim' : 'Não'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Section: Timeline Events */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Trilha de Auditoria & Eventos
            </h3>
            <div className="space-y-2">
              {transaction.timeline.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-3"
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
                      <span className="font-semibold text-slate-900">{evt.title}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{evt.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{evt.description}</p>
                    {evt.operator && (
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Operador: {evt.operator}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Separation Notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
            <strong>Regra de Independência:</strong> O pagamento confirmado e a moderação do anúncio
            são requisitos independentes. A quitação da taxa não substitui a validação de
            conformidade.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          <span className="text-xs text-slate-400">Modo de consulta • Feira de Carros Finance</span>
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
