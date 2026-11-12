'use client';

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  FileCheck,
  FileText,
  Lock,
  MapPin,
  Shield,
  ShieldAlert,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { formatBrl, mockTransactions } from '../../../../lib/adapters/mock-finance-data';
import type { TransactionRecord } from '../../../../lib/types/finance-presentation';
import { AdminShell } from '../../../components/AdminShell';
import { CashConfirmationDialog } from '../../components/CashConfirmationDialog';

export default function CashRegistrationPage() {
  const params = useParams();
  const txId = typeof params?.id === 'string' ? params.id : '';

  const transaction = React.useMemo(() => {
    return mockTransactions.find((t) => t.id === txId) || null;
  }, [txId]);

  // Form states for cash registration preview
  const [receivedAmount] = React.useState<number>(transaction ? transaction.amountBrl : 30.0);
  const [receivedLocation, setReceivedLocation] = React.useState(
    'Balcão Feira de Carros — Ipatinga / MG',
  );
  const [operatorId] = React.useState('USR-ADM-001 (Admin Principal)');
  const [physicalSlipNumber, setPhysicalSlipNumber] = React.useState('CANHOTO-00415');
  const [recordNotes, setRecordNotes] = React.useState(
    'Pagamento em cédulas conferido no balcão presencial de atendimento em Ipatinga.',
  );
  const [receivedDate, setReceivedDate] = React.useState('15/01/2026 15:30');

  // Confirmation Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  if (!transaction) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Financeiro', 'Registro em Dinheiro', 'Não Encontrado']}>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Transação Não Encontrada</h2>
          <p className="text-xs text-slate-500">
            A transação {txId || ''} não foi localizada para lançamento em dinheiro.
          </p>
          <div className="pt-2">
            <Link
              href="/pagamentos"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Lista de Pagamentos</span>
            </Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Financeiro', 'Transações', transaction.id, 'Registrar Dinheiro']}
    >
      <div className="space-y-6 max-w-4xl mx-auto" data-testid="cash-registration-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href={`/pagamentos/${transaction.id}`}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Registrar Pagamento em Dinheiro
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                ADM-D-026
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Fluxo oficial de lançamento em espécie no balcão presencial • Exclusivo Administrador
              Principal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
              <Lock className="w-3.5 h-3.5 text-red-600" />
              Main Admin Desktop Only (ADM-020 / PAY-013)
            </span>
          </div>
        </div>

        {/* Eligible Ad & Customer Summary */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Car className="w-4 h-4 text-slate-400" />
            Resumo do Anúncio Elegível & Cobrança
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Anúncio:</span>
              <span className="font-mono font-bold text-slate-900">{transaction.adId}</span>
              <p className="text-slate-700 font-medium truncate mt-0.5">
                {transaction.vehicleTitle}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block">Cliente / Vendedor:</span>
              <span className="font-semibold text-slate-900">{transaction.sellerName}</span>
              <p className="font-mono text-slate-500 mt-0.5">{transaction.sellerDocumentMasked}</p>
            </div>

            <div>
              <span className="text-slate-400 block">Plano & Valor:</span>
              <span className="font-semibold text-slate-900">{transaction.planName}</span>
              <p className="text-base font-black text-slate-900 mt-0.5">
                {formatBrl(transaction.amountBrl)}
              </p>
            </div>
          </div>
        </div>

        {/* Duplicate-Record Warning Callout */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Atenção Contábil — Prevenção de Duplicidade (PAY-014)</span>
          </div>
          <p className="leading-relaxed">
            Certifique-se de que o pagamento referente a este anúncio não foi lançado anteriormente
            no Livro Caixa. Lançamentos manuais são auditados e exigem correspondência física com o
            canhoto impresso.
          </p>
        </div>

        {/* Cash Receipt Form Simulation */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-slate-100">
            <Banknote className="w-4 h-4 text-amber-600" />
            Dados do Recebimento Físico no Balcão
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Valor Recebido */}
            <div>
              <label
                htmlFor="cash-amount"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Valor Recebido em Dinheiro (BRL)
              </label>
              <div className="relative">
                <input
                  id="cash-amount"
                  type="text"
                  readOnly
                  value={formatBrl(receivedAmount)}
                  className="w-full px-3 py-2 text-sm font-bold bg-slate-100 border border-slate-200 rounded-xl text-slate-900 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Valor fixado pela ordem do anúncio.</p>
            </div>

            {/* Número do Canhoto Físico */}
            <div>
              <label
                htmlFor="slip-number"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Número do Recibo Físico / Canhoto Manual
              </label>
              <input
                id="slip-number"
                type="text"
                value={physicalSlipNumber}
                onChange={(e) => setPhysicalSlipNumber(e.target.value)}
                placeholder="Ex: CANHOTO-00415"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 font-mono font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Número impresso no talão de recibos do balcão.
              </p>
            </div>

            {/* Data e Hora */}
            <div>
              <label
                htmlFor="received-date"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Data e Hora do Recebimento
              </label>
              <input
                id="received-date"
                type="text"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden font-mono"
              />
            </div>

            {/* Local do Recebimento */}
            <div>
              <label
                htmlFor="received-location"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Local de Atendimento Presencial
              </label>
              <input
                id="received-location"
                type="text"
                value={receivedLocation}
                onChange={(e) => setReceivedLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
              />
            </div>

            {/* Operador Responsável */}
            <div className="sm:col-span-2">
              <label
                htmlFor="operator-id"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Identificação do Operador Staff (Assinatura Eletrônica)
              </label>
              <input
                id="operator-id"
                type="text"
                readOnly
                value={operatorId}
                className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-mono cursor-not-allowed"
              />
            </div>

            {/* Observações */}
            <div className="sm:col-span-2">
              <label
                htmlFor="record-notes"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Observações Administrativas do Registro
              </label>
              <textarea
                id="record-notes"
                rows={3}
                value={recordNotes}
                onChange={(e) => setRecordNotes(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Mandatory Confirmation Notice & Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Operação de demonstração supervisionada (Fail-Closed).
            </span>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              data-testid="submit-cash-registration-btn"
            >
              <Banknote className="w-4 h-4" />
              <span>Confirmar Recebimento em Espécie</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation & Blocked Dialog Flow (ADM-D-026: 231:1292 -> 231:1311) */}
      <CashConfirmationDialog
        transaction={transaction}
        physicalSlipNumber={physicalSlipNumber}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </AdminShell>
  );
}
