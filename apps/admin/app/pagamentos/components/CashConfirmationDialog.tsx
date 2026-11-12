'use client';

import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Lock,
  Shield,
  ShieldAlert,
  X,
} from 'lucide-react';
import * as React from 'react';
import { formatBrl } from '../../../lib/adapters/mock-finance-data';
import type { TransactionRecord } from '../../../lib/types/finance-presentation';

export type CashDialogStep =
  | 'CONFIRM' // STATE / ADM-D-026 / Confirmar cash presencial (node 231:1292)
  | 'BLOCKED'; // STATE / ADM-D-026 / Bloqueio sem recibo confirmado (node 231:1311)

interface CashConfirmationDialogProps {
  transaction: TransactionRecord;
  physicalSlipNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CashConfirmationDialog({
  transaction,
  physicalSlipNumber,
  isOpen,
  onClose,
}: CashConfirmationDialogProps) {
  const [step, setStep] = React.useState<CashDialogStep>('CONFIRM');

  // Reset step whenever opened
  React.useEffect(() => {
    if (isOpen) {
      setStep('CONFIRM');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: custom modal overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cash-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {step === 'CONFIRM' ? (
          // =========================================================================
          // STEP 1: STATE / ADM-D-026 / Confirmar cash presencial (node 231:1292)
          // =========================================================================
          <div data-testid="cash-dialog-confirm-state" className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="cash-dialog-title" className="font-bold text-slate-900 text-sm">
                    Confirmar Recebimento em Espécie
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    ADM-D-026 • Confirmação de Balcão
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Verificação de Responsabilidade Contábil</span>
              </div>
              <p className="leading-relaxed">
                Você está registrando o recebimento físico de{' '}
                <strong>{formatBrl(transaction.amountBrl)}</strong> em moeda corrente (espécie) no
                balcão de atendimento. Certifique-se de que as cédulas foram conferidas e guardadas
                no cofre administrativo.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Transação de referência:</span>
                <span className="font-mono font-bold text-slate-900">{transaction.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Anúncio vinculado:</span>
                <span className="font-mono font-semibold text-slate-700">{transaction.adId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cliente / Vendedor:</span>
                <span className="font-semibold text-slate-800">{transaction.sellerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Canhoto / Recibo manual:</span>
                <span className="font-mono font-bold text-slate-900">
                  {physicalSlipNumber || 'CANHOTO-00415'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <span className="font-semibold text-slate-700">Valor em dinheiro:</span>
                <span className="font-black text-slate-900 text-base">
                  {formatBrl(transaction.amountBrl)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setStep('BLOCKED')}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs"
                data-testid="cash-dialog-confirm-button"
              >
                Prosseguir com Confirmação
              </button>
            </div>
          </div>
        ) : (
          // =========================================================================
          // STEP 2: STATE / ADM-D-026 / Bloqueio sem recibo confirmado (node 231:1311)
          // =========================================================================
          <div data-testid="cash-dialog-blocked-state" className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase tracking-wider">
                Operação Não Executada • Fail-Closed (ADM-D-026)
              </span>
              <h3 className="font-black text-slate-900 text-base mt-2">
                Bloqueio de Segurança / Modo Demonstração
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-sm mx-auto">
                A gravação permanente de recebimento em espécie e emissão fiscal está bloqueada
                nesta versão de demonstração.{' '}
                <strong>Nenhum valor foi persistido no banco de dados</strong> e o anúncio permanece
                aguardando confirmação.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-500">
                <span>Estado da transação:</span>
                <span className="font-bold text-amber-700">Mantido como PENDENTE</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Estado do anúncio:</span>
                <span className="font-bold text-slate-700">Pendente de Moderação (Inalterado)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Recibo contábil gerado:</span>
                <span className="font-bold text-red-600">NENHUM (Não gerado)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                data-testid="cash-dialog-dismiss-button"
              >
                Entendido, Fechar Visualização
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
