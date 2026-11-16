'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { getCustomerCorrectionById } from '@/lib/adapters/mock-customer-corrections-data';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  FileEdit,
  FileText,
  Lock,
  Phone,
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

export default function CustomerCorrectionReviewPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const record = React.useMemo(() => getCustomerCorrectionById(id), [id]);

  const [simulationState, setSimulationState] = React.useState<
    'NONE' | 'APPROVE_PREVIEW' | 'REJECT_PREVIEW'
  >('NONE');

  // Not Found State
  if (!record) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Usuários', 'Correções', 'Não encontrado']}>
        <div
          data-testid="correction-not-found-state"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs my-10"
        >
          <UserX className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Solicitação não encontrada</h2>
          <p className="text-xs text-slate-500">
            O protocolo de correção "{id}" não foi localizado na base de registros.
          </p>
          <Link
            href="/correcoes-clientes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Fila de Correções
          </Link>
        </div>
      </AdminShell>
    );
  }

  const handleSimulateApprove = () => {
    setSimulationState('APPROVE_PREVIEW');
  };

  const handleSimulateReject = () => {
    setSimulationState('REJECT_PREVIEW');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Usuários', 'Correções', record.id]}
      maxWidthClass="max-w-[1280px]"
    >
      <div className="space-y-6" data-testid="customer-correction-review-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/correcoes-clientes"
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Voltar à fila"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Análise de correção de dados
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ADM-D-042
              </span>
            </div>
            <p className="text-sm text-slate-500 pl-8">
              Comparativo de alterações, validação de titularidade e decisão autorizada.
            </p>
          </div>

          <div className="flex items-center gap-3 pl-8 sm:pl-0">
            <Link
              href="/correcoes-clientes"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              Voltar à fila
            </Link>
          </div>
        </div>

        {/* Mobile Restriction Banner on < 1024px */}
        <div
          data-testid="mobile-correction-review-restricted"
          className="lg:hidden p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
              DECISÃO RESTRITA AO DESKTOP (ADM-019)
            </strong>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              A aprovação ou recusa de alterações cadastrais de clientes é exclusiva do terminal
              desktop pelo Main Admin. Dispositivos móveis operam em modo somente leitura.
            </p>
          </div>
        </div>

        {/* 4 Summary Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Protocolo da Solicitação
            </span>
            <div className="text-base font-black font-mono text-slate-900">{record.id}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Submetido em {record.date}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Titular da Conta
            </span>
            <div className="text-base font-black text-slate-900">{record.customerName}</div>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">{record.accountId}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Campo em Correção
            </span>
            <div className="text-base font-black text-slate-900">{record.fieldLabel}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {record.isSensitive ? 'Dado sensível (HOLD)' : 'Dado não crítico'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">
              Situação da Decisão
            </span>
            <div className="text-base font-black text-amber-900">{record.statusLabel}</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">Sem alteração direta</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Comparison, Justification & Decisions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Visual Comparison Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-red-600" />
                <span>Comparativo de Alteração Cadastral</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Value Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Valor Atual Registrado
                  </span>
                  <div className="text-sm font-mono font-bold text-slate-600">
                    {record.currentValueMasked}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Dado ativo vinculado a anúncios públicos e perfil.
                  </p>
                </div>

                {/* Requested Value Box */}
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-300 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center justify-between">
                    <span>Novo Valor Solicitado</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Pendente
                    </span>
                  </span>
                  <div className="text-sm font-mono font-bold text-emerald-950">
                    {record.requestedValueMasked}
                  </div>
                  <p className="text-[11px] text-emerald-800/80">
                    Novo contato/registro a ser adotado caso aprovado pelo Main Admin.
                  </p>
                </div>
              </div>
            </div>

            {/* Justification & Verification Dossier */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Justificativa e Evidências Documentais</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-800 font-bold block text-[11px]">
                    Motivo declarado pelo cliente:
                  </strong>
                  <p className="text-slate-700 leading-relaxed">"{record.justification}"</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-800 font-bold block text-[11px]">
                    Validação de identidade e titularidade:
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    {record.identityVerificationStatus}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-800 font-bold block text-[11px]">
                    Notas de triagem interna:
                  </strong>
                  <p className="text-slate-600 leading-relaxed">{record.notes}</p>
                </div>
              </div>
            </div>

            {/* Simulation Feedback Alert */}
            {simulationState === 'APPROVE_PREVIEW' && (
              <div
                data-testid="correction-approve-simulation-result"
                className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
              >
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Prévia de Aprovação Processada — Modo Fail-Closed (REL-07)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A prévia de aprovação para a alteração de <strong>{record.fieldLabel}</strong> de{' '}
                  <strong>{record.customerName}</strong> foi simulada no ambiente de demonstração.
                  Nenhum dado real foi alterado no banco de dados e nenhuma sincronização externa
                  ocorreu.
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

            {simulationState === 'REJECT_PREVIEW' && (
              <div
                data-testid="correction-reject-simulation-result"
                className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
              >
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Prévia de Recusa Registrada</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A recusa fundamentada da solicitação <strong>{record.id}</strong> foi simulada com
                  sucesso. O cliente receberia a justificativa nos canais cadastrados após aprovação
                  do Main Admin em produção.
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

            {/* Decision Controls (Desktop only interactive) */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Decisão do Main Admin</span>
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-testid="approve-correction-btn"
                  onClick={handleSimulateApprove}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprovar alteração (Prévia)</span>
                </button>

                <button
                  type="button"
                  data-testid="reject-correction-btn"
                  onClick={handleSimulateReject}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Negar justificadamente</span>
                </button>

                <Link
                  href="/correcoes-clientes"
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ml-auto"
                >
                  Voltar à fila
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): RBAC & Audit Policies */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Políticas de Segurança e RBAC</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-800 font-bold block text-[11px]">
                    Status de Permissão
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                    {record.permissionStatus}
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 space-y-1">
                  <strong className="text-amber-900 font-bold block text-[11px]">
                    Proteção de Dados Sensíveis
                  </strong>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Telefones e documentos são mascarados para evitar vazamentos involuntários na
                    interface de atendimento.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-800 font-bold block text-[11px]">
                    Imutabilidade dos Logs
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Toda consulta ou alteração de dados gera registro rastreável com autor,
                    timestamp e hash da solicitação.
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Hold Banner */}
            <div
              data-testid="correction-audit-hold-banner"
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950"
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold uppercase tracking-wide">
                    REL-07 · ALTERAÇÃO CADASTRAL NÃO EXECUTADA
                  </strong>
                  <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                    Demonstração frontend apenas. A modificação definitiva de dados sensíveis de
                    clientes requer autorização corporativa do Main Admin e backend de produção.
                    Nenhuma informação foi alterada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Registros fictícios; conformidade rigorosa com normas LGPD e
          controle de acesso RBAC.
        </div>
      </div>
    </AdminShell>
  );
}
