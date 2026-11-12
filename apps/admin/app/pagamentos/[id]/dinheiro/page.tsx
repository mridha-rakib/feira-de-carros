'use client';

import { BrandLogo } from '@feira/ui';
import { AlertTriangle, ArrowLeft, Banknote, Car, Lock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { formatBrl, mockTransactions } from '../../../../lib/adapters/mock-finance-data';
import { AdminMobileNavigation } from '../../../components/AdminMobileNavigation';
import { AdminShell } from '../../../components/AdminShell';
import { CashConfirmationDialog } from '../../components/CashConfirmationDialog';
import { TransactionStatusBadge } from '../../components/TransactionStatusBadge';

export default function CashRegistrationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const txId = typeof params?.id === 'string' ? params.id : '';

  // Check role for unauthorized mock role tests (ADM-020 / PAY-013)
  const roleParam = searchParams?.get('role') || '';
  const isUnauthorizedRole =
    roleParam === 'support' || roleParam === 'sales' || roleParam === 'denied';

  const transaction = React.useMemo(() => {
    return mockTransactions.find((t) => t.id === txId) || null;
  }, [txId]);

  // Form states for cash registration preview
  const [receivedAmount] = React.useState<number>(transaction ? transaction.amountBrl : 30.0);
  const [receivedLocation, setReceivedLocation] = React.useState(
    'Balcão Feira de Carros — Ipatinga / MG',
  );
  const [operatorId] = React.useState(
    isUnauthorizedRole
      ? 'USR-STAFF-002 (Suporte / Sem Privilégio)'
      : 'USR-ADM-001 (Admin Principal)',
  );
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
    <>
      {/* ============================================================== */}
      {/* MOBILE RESTRICTED CASH VIEW (ADM-M-009 / ADM-020 / ADM-021)    */}
      {/* Strictly read-only, NO operational cash confirmation controls   */}
      {/* ============================================================== */}
      <div
        className="block lg:hidden min-h-screen bg-slate-900 text-slate-100 pb-28 select-none"
        data-testid="mobile-cash-registration-blocked"
      >
        {/* Mobile Header with Official 2026 Brand Logo */}
        <header className="px-4 pt-4 pb-3 border-b border-slate-800 bg-[#0B111E] sticky top-0 z-30">
          <div className="flex items-center justify-between mb-3">
            <BrandLogo variant="on-dark" priority width={138} height={28} className="h-7 w-auto" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                ADMIN • MOBILE WEB
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/pagamentos"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-base font-bold tracking-tight text-white">
                Registro em Dinheiro (Restrito)
              </h1>
            </div>
            <span className="text-[10px] font-mono bg-red-950/80 border border-red-800/80 text-red-300 px-2 py-0.5 rounded">
              ADM-021 • Bloqueado
            </span>
          </div>
        </header>

        <div className="p-4 space-y-4 max-w-lg mx-auto">
          {/* Security Alert: Prohibited Mobile Action */}
          <div
            className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs space-y-2"
            data-testid="mobile-cash-blocked-alert"
          >
            <div className="flex items-center gap-2 font-bold text-red-300">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>Terminal Móvel Restrito — Operação Proibida (ADM-020 / ADM-021)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-red-200/90">
              O registro de pagamento em dinheiro (Livro Caixa) e a confirmação de recebimento em
              espécie são operações estritamente proibidas em dispositivos móveis e restritas ao
              terminal desktop sob perfil Administrador Principal.
            </p>
            <p className="text-[10px] font-mono text-red-400 pt-1 border-t border-red-800/40">
              Política Fail-Closed: Nenhuma alteração de status de pagamento ou publicação de
              anúncio pode ser disparada através do terminal móvel.
            </p>
          </div>

          {/* Read-Only Transaction Inspection Card */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="text-[11px] font-mono font-bold text-white">{transaction.id}</span>
              <TransactionStatusBadge status={transaction.status} size="sm" />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Anúncio & Veículo:
                </span>
                <span className="font-semibold text-white">{transaction.adId}</span>
                <p className="text-slate-300 text-[11px] mt-0.5">{transaction.vehicleTitle}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Cliente / Vendedor:
                </span>
                <span className="font-semibold text-white">{transaction.sellerName}</span>
                <p className="font-mono text-slate-400 text-[11px]">
                  {transaction.sellerDocumentMasked}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 text-xs">Valor Pendente:</span>
                <span className="font-black text-amber-400 text-base">
                  {formatBrl(transaction.amountBrl)}
                </span>
              </div>
            </div>
          </div>

          {/* Return Action */}
          <Link
            href="/pagamentos"
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Transações de Pagamentos</span>
          </Link>
        </div>

        {/* Standard Mobile Bottom Navigation */}
        <AdminMobileNavigation />
      </div>

      {/* ============================================================== */}
      {/* DESKTOP CASH REGISTRATION FLOW (Figma ADM-D-026)               */}
      {/* ============================================================== */}
      <div className="hidden lg:block min-h-screen bg-slate-50">
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
                  Fluxo oficial de lançamento em espécie no balcão presencial • Exclusivo
                  Administrador Principal
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                  Main Admin Desktop Only (ADM-020 / PAY-013)
                </span>
              </div>
            </div>

            {/* Unauthorized Role Callout (PAY-013 / AUTH-019) */}
            {isUnauthorizedRole && (
              <div
                className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1.5"
                data-testid="unauthorized-desktop-alert"
              >
                <div className="flex items-center gap-2 font-bold text-red-950">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Acesso Não Autorizado — Perfil sem Privilégios (ADM-020 / PAY-013)</span>
                </div>
                <p className="leading-relaxed">
                  Seu perfil atual (Suporte / Vendas / Operador) possui permissão apenas de
                  visualização. O registro manual de recebimentos em espécie no Livro Caixa é
                  restrito exclusivamente ao <strong>Administrador Principal (Main Admin)</strong>.
                </p>
              </div>
            )}

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
                  <p className="font-mono text-slate-500 mt-0.5">
                    {transaction.sellerDocumentMasked}
                  </p>
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
                Certifique-se de que o pagamento referente a este anúncio não foi lançado
                anteriormente no Livro Caixa. Lançamentos manuais são auditados e exigem
                correspondência física com o canhoto impresso.
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
                  <p className="text-[11px] text-slate-400 mt-1">
                    Valor fixado pela ordem do anúncio.
                  </p>
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
                    readOnly={isUnauthorizedRole}
                    disabled={isUnauthorizedRole}
                    value={physicalSlipNumber}
                    onChange={(e) => setPhysicalSlipNumber(e.target.value)}
                    placeholder="Ex: CANHOTO-00415"
                    className={`w-full px-3 py-2 text-sm border rounded-xl font-mono font-bold ${
                      isUnauthorizedRole
                        ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20'
                    }`}
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
                    readOnly={isUnauthorizedRole}
                    disabled={isUnauthorizedRole}
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-xl font-mono ${
                      isUnauthorizedRole
                        ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden'
                    }`}
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
                    readOnly={isUnauthorizedRole}
                    disabled={isUnauthorizedRole}
                    value={receivedLocation}
                    onChange={(e) => setReceivedLocation(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-xl ${
                      isUnauthorizedRole
                        ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden'
                    }`}
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
                    readOnly={isUnauthorizedRole}
                    disabled={isUnauthorizedRole}
                    value={recordNotes}
                    onChange={(e) => setRecordNotes(e.target.value)}
                    className={`w-full p-3 text-xs border rounded-xl resize-none ${
                      isUnauthorizedRole
                        ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:outline-hidden'
                    }`}
                  />
                </div>
              </div>

              {/* Mandatory Confirmation Notice & Button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Operação de demonstração supervisionada (Fail-Closed).
                </span>

                {isUnauthorizedRole ? (
                  <div
                    className="px-4 py-2 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2"
                    data-testid="unauthorized-role-badge"
                  >
                    <Lock className="w-4 h-4 text-red-600" />
                    <span>Ação Bloqueada • Exclusivo Main Admin (403 Proibido)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    data-testid="submit-cash-registration-btn"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Confirmar Recebimento em Espécie</span>
                  </button>
                )}
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
      </div>
    </>
  );
}
