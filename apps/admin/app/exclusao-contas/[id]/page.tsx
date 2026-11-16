'use client';

import { AdminShell } from '@/app/components/AdminShell';
import {
  getAccountDeletionById,
  mockDeletionDecisionOptions,
} from '@/lib/adapters/mock-account-deletion-data';
import type {
  AccountDeletionDecisionOption,
  AccountDeletionDecisionType,
} from '@/lib/types/account-deletion-presentation';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileCheck,
  FileText,
  Layers,
  Lock,
  MessageSquare,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserX,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function AccountDeletionReviewPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const record = React.useMemo(() => getAccountDeletionById(id), [id]);

  const [selectedDecision, setSelectedDecision] =
    React.useState<AccountDeletionDecisionType>('CONDITIONAL_APPROVAL');
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'PREVIEW_CONFIRMED'>(
    'NONE',
  );

  // Not Found State
  if (!record) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Usuários', 'Não encontrado']}>
        <div
          data-testid="deletion-not-found-state"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs my-10"
        >
          <UserX className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Solicitação não encontrada</h2>
          <p className="text-xs text-slate-500">
            O protocolo de exclusão "{id}" não foi localizado na base de registros.
          </p>
          <Link
            href="/exclusao-contas"
            data-testid="back-to-queue-not-found-btn"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Fila de Exclusões
          </Link>
        </div>
      </AdminShell>
    );
  }

  const handleSimulateConfirmation = () => {
    setSimulationState('PREVIEW_CONFIRMED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Usuários', 'Análise de exclusão de conta']}
      maxWidthClass="max-w-[1330px]"
    >
      <div className="space-y-6" data-testid="account-deletion-review-page">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Análise de exclusão de conta
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                ADM-D-037
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Pedido selecionado, impacto público, retenção legal e decisão autorizada.
            </p>
          </div>
        </div>

        {/* 4 Top Metric / Status Cards matching Figma ADM-D-037 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Protocolo */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Protocolo
                </span>
                <span className="text-xl font-black font-mono text-slate-900 block">
                  {record.id}
                </span>
                <p className="text-xs text-slate-400 mt-1">Pedido de {record.userName}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 2: Anúncios associados */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Anúncios associados
                </span>
                <span className="text-2xl font-black text-slate-900 block">
                  {record.activeListingsCount}
                </span>
                <p className="text-xs text-slate-400 mt-1">Impacto público a revisar</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Layers className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 3: Situação */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Situação
                </span>
                <span className="text-xl font-black text-slate-900 block">
                  {record.statusLabel}
                </span>
                <p className="text-xs text-slate-400 mt-1">Sem exclusão automática</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 4: Retenção */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Retenção
                </span>
                <span className="text-xl font-black text-slate-900 block">
                  {record.retentionStatusLabel}
                </span>
                <p className="text-xs text-slate-400 mt-1">Avaliação LGPD obrigatória</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">
              PEDIDO DE EXCLUSÃO DE CONTA · {record.id}
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {record.userName}
              </h2>
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
            <p className="text-xs text-slate-500 mt-1">
              {record.userRoleLabel} - {record.location} - dados fictícios
            </p>
          </div>

          <Link
            href="/exclusao-contas"
            data-testid="back-to-queue-btn"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors self-start md:self-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Fila de pedidos
          </Link>
        </div>

        {/* Two Columns: Dados Completos da Solicitação & Retenção e Efeitos da Decisão */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Dados completos da solicitação */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Dados completos da solicitação</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Protocolo</span>
                <span className="font-mono font-bold text-slate-800">{record.id}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Solicitante</span>
                <span className="font-semibold text-slate-800">{record.userName}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Perfil</span>
                <span className="text-slate-700">{record.userRoleLabel}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Recebido em</span>
                <span className="text-slate-700">{record.requestedAt} - exemplo</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Contato</span>
                <span className="text-slate-700">{record.contactMasked}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Anúncios associados</span>
                <span className="font-medium text-slate-800">{record.listingsImpactLabel}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Mensagens</span>
                <span className="text-slate-700">{record.conversationsStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Autenticação</span>
                <span className="text-slate-700">{record.authenticationStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Estado</span>
                <span className="font-semibold text-slate-800">{record.statusLabel}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Retenção e efeitos da decisão */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Retenção e efeitos da decisão</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Revisor</span>
                <span className="font-semibold text-slate-800">{record.decisionReviewer}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Pedido válido</span>
                <span className="text-slate-700">{record.validRequestStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Anúncios públicos</span>
                <span className="text-slate-700">{record.publicListingsStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Chats vinculados</span>
                <span className="text-slate-700">{record.linkedChatsStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Cobranças e auditoria</span>
                <span className="text-slate-700">{record.billingAuditStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">CPF/CNPJ</span>
                <span className="text-slate-700">{record.documentProtectionStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Apagamento imediato</span>
                <span className="font-semibold text-red-700">{record.immediateDeletionStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Decisão final</span>
                <span className="text-slate-700">{record.finalDecisionStatus}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500">Retenção indefinida</span>
                <span className="text-slate-700">{record.indefiniteRetentionStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Impacto sobre publicações e dados */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Impacto sobre publicações e dados
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                A aprovação da exclusão deve retirar anúncios públicos ativos. Tratamento de chats,
                pagamentos e trilhas auditáveis segue as obrigações legais aplicáveis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {/* Box 1: Anúncios associados */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
              <strong className="text-blue-900 block font-bold">
                Anúncios associados - {record.activeListingsCount}
              </strong>
              <p className="text-[11px] text-blue-800/90 leading-relaxed">
                Confirmar estado e remover anúncios públicos quando aprovado; nenhum removido no
                demo.
              </p>
            </div>

            {/* Box 2: Dados de comunicação */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs space-y-1">
              <strong className="text-amber-900 block font-bold">Dados de comunicação</strong>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Conversas e contatos sujeitos à política de retenção e direitos dos titulares.
              </p>
            </div>

            {/* Box 3: Registros legais */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1">
              <strong className="text-emerald-900 block font-bold">Registros legais</strong>
              <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                Verificar base legal, prazos e minimização antes de anonimizar/eliminar.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE RESTRICTION VIEW (lg:hidden)                           */}
        {/* Deliberation controls locked on mobile devices                  */}
        {/* ============================================================== */}
        <div
          data-testid="mobile-deletion-decision-restricted"
          className="lg:hidden p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800 shadow-2xs"
        >
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Lock className="w-5 h-5 shrink-0" />
            <span>Deliberação de Exclusão Bloqueada em Ambiente Móvel (ADM-019 / ADM-021)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            A deliberação, prévia de confirmação e homologação de descarte de dados pessoais são
            bloqueadas em dispositivos móveis e tablets.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Acesse o terminal desktop corporativo homologado (largura mínima de 1024px) com perfil
            Main Admin para deliberar.
          </p>
          <div className="pt-2">
            <Link
              href="/exclusao-contas"
              className="inline-flex items-center justify-center w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Voltar à fila de pedidos
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP DECISION SECTION (hidden lg:block)                     */}
        {/* Decisão e confirmação do Main Admin                             */}
        {/* ============================================================== */}
        <div
          data-testid="desktop-deletion-decision-section"
          className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>Decisão e confirmação do Main Admin</span>
          </h3>

          {/* 3 Decision Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockDeletionDecisionOptions.map((opt: AccountDeletionDecisionOption) => {
              const isSelected = selectedDecision === opt.type;

              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    setSelectedDecision(opt.type);
                    setSimulationState('NONE');
                  }}
                  data-testid={`deletion-decision-option-${opt.type}`}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? opt.accentColor === 'emerald'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : opt.accentColor === 'amber'
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                          : 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <strong className="text-xs font-bold text-slate-900 block mb-1">
                    {opt.title}
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{opt.description}</p>
                </button>
              );
            })}
          </div>

          {/* Simulation Preview / Result Box */}
          {simulationState === 'PREVIEW_CONFIRMED' && (
            <div
              data-testid="deletion-simulation-result"
              className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
            >
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Simulação Registrada — Modo Fail-Closed (REL-06)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Opção selecionada:{' '}
                <strong>
                  {mockDeletionDecisionOptions.find((o) => o.type === selectedDecision)?.title}
                </strong>
                . A prévia de confirmação foi processada com sucesso no protótipo demonstrativo.
                Nenhuma alteração persistente ou remoção definitiva de registros foi efetuada no
                banco de dados.
              </p>
              <button
                type="button"
                onClick={() => setSimulationState('NONE')}
                className="text-[11px] font-bold text-amber-400 hover:underline pt-1 block"
              >
                Redefinir simulação
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSimulateConfirmation}
              data-testid="previa-confirmacao-btn"
              className="py-2.5 px-5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
            >
              Prévia de confirmação
            </button>
            <Link
              href="/exclusao-contas"
              className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Voltar à fila
            </Link>
          </div>
        </div>

        {/* Demo Audit Banner Matching Figma ADM-D-037 */}
        <div
          data-testid="deletion-hold-banner"
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950"
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase tracking-wide">
                REL-06 · HOLD DE RETENÇÃO LGPD - NÃO EXECUTADO
              </strong>
              <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                A solicitação de exclusão é uma função confirmada; a retenção por tipo de dado e o
                resultado de execução dependem de revisão legal e autorização do backend. Nenhum
                dado foi apagado.
              </p>
            </div>
          </div>
        </div>

        {/* LGPD Footer Note */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Registros e colaboradores fictícios; nenhuma operação
          administrativa executada.
        </div>
      </div>
    </AdminShell>
  );
}
