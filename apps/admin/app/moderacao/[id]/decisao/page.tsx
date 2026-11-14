'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { ReportStatusBadge } from '@/app/moderacao/components/ReportStatusBadge';
import { getReportById, mockModerationDecision } from '@/lib/adapters/mock-moderation-data';
import type {
  ModerationDecisionOption,
  ModerationDecisionType,
} from '@/lib/types/moderation-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
  Scale,
  Shield,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function ModerationDecisionPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const report = React.useMemo(() => getReportById(id), [id]);

  const [selectedDecision, setSelectedDecision] = React.useState<ModerationDecisionType | null>(
    null,
  );
  const [justification, setJustification] = React.useState('');
  const [simulationState, setSimulationState] = React.useState<
    'NONE' | 'PREVIEW_SHOWN' | 'BLOCKED_RESULT'
  >('NONE');

  if (!report) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Denúncias', 'Não encontrado']}>
        <div
          data-testid="decision-report-not-found"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs"
        >
          <Shield className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Protocolo não encontrado</h2>
          <p className="text-xs text-slate-500">
            O protocolo "{id}" não foi localizado na base de denúncias.
          </p>
          <Link
            href="/moderacao"
            data-testid="back-from-decision-not-found"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Fila de Denúncias
          </Link>
        </div>
      </AdminShell>
    );
  }

  // Use the fixture decision data for RPT-DEMO-008; for other reports use a generic version
  const decision =
    report.id === mockModerationDecision.reportId
      ? mockModerationDecision
      : {
          ...mockModerationDecision,
          reportId: report.id,
          reporterProtocol: report.id,
          adId: report.adId,
          sellerName: report.sellerName,
          allegation: report.allegation,
          currentState: report.status,
        };

  const selectedOption = decision.decisionOptions.find(
    (o: ModerationDecisionOption) => o.type === selectedDecision,
  );

  const handleSimulateDecision = () => {
    if (!selectedDecision || !justification.trim()) return;
    setSimulationState('PREVIEW_SHOWN');
  };

  const handleConfirmSimulation = () => {
    // Fail-closed: never executes real decision
    setSimulationState('BLOCKED_RESULT');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Denúncias', report.id, 'Decisão de Moderação']}
      maxWidthClass="max-w-[1200px]"
    >
      <div className="space-y-6" data-testid="moderation-decision-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href={`/moderacao/${report.id}`}
                data-testid="back-to-report-from-decision-btn"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar para detalhes da denúncia"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Decisão de Moderação — {report.id}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                ADM-D-035
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Prévia de decisão. Nenhuma ação real é executada. Sistema em modo fail-closed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ReportStatusBadge status={report.status} size="md" />
          </div>
        </div>

        {/* Authorization Blocked Banner */}
        <div
          data-testid="decision-blocked-auth-banner"
          className="p-4 rounded-2xl bg-slate-900 text-white text-xs"
        >
          <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
            <Lock className="w-4 h-4 text-red-400 shrink-0" />
            <span>Autorização de Alçada Bloqueada — Nenhuma Decisão Será Executada</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{decision.auditNote}</p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left — Report Summary & Decision Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Report Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>Resumo para Decisão</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Protocolo do relatório
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {decision.reporterProtocol}
                  </span>
                </div>
                {decision.adId && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Anúncio e vendedor
                    </span>
                    <span className="font-mono font-semibold text-slate-800">{decision.adId}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {decision.sellerName}
                    </span>
                  </div>
                )}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Alegação
                  </span>
                  <span className="text-slate-800 leading-relaxed">{decision.allegation}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Status das evidências
                  </span>
                  <span className="text-slate-700">{decision.evidenceStatus}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Revisor
                  </span>
                  <span className="text-slate-800 font-semibold">{decision.reviewer}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Estado atual de moderação
                  </span>
                  <ReportStatusBadge status={decision.currentState} />
                </div>
              </div>
            </div>

            {/* Decision Options */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-slate-600" />
                  <span>Opções de Decisão</span>
                </h2>
                <span className="text-[11px] text-slate-500">Simulação demonstrativa apenas</span>
              </div>

              <div className="space-y-3">
                {decision.decisionOptions.map((option: ModerationDecisionOption) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => {
                      setSelectedDecision(option.type);
                      setSimulationState('NONE');
                    }}
                    data-testid={`decision-option-${option.type}`}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedDecision === option.type
                        ? option.type === 'NOT_SUBSTANTIATED'
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                          : option.type === 'CORRECTION_REQUESTED'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10'
                            : 'border-red-500 bg-red-50 ring-2 ring-red-500/10'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          selectedDecision === option.type
                            ? 'border-slate-900 bg-slate-900'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedDecision === option.type && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 mb-1">{option.label}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {option.description}
                        </p>
                        {selectedDecision === option.type && (
                          <div className="mt-3 space-y-1.5">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Consequências previstas:
                            </p>
                            <ul className="space-y-1">
                              {option.consequences.map((c: string) => (
                                <li
                                  key={c}
                                  className="flex items-start gap-1.5 text-[11px] text-slate-600"
                                >
                                  <span className="mt-0.5 shrink-0">•</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Justification Field */}
            {selectedDecision && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Justificativa Obrigatória
                </h2>
                <p className="text-xs text-slate-500">
                  Descreva a fundamentação técnica para a decisão selecionada. Campo obrigatório
                  para auditoria.
                </p>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  data-testid="decision-justification-input"
                  placeholder="Descreva a fundamentação técnica e evidências consideradas..."
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 resize-none placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{justification.length} caracteres</span>
                  <span>Mínimo recomendado: 50 caracteres</span>
                </div>
              </div>
            )}

            {/* Simulate Button */}
            {selectedDecision && simulationState === 'NONE' && (
              <button
                type="button"
                onClick={handleSimulateDecision}
                disabled={!justification.trim() || justification.length < 10}
                data-testid="simulate-decision-btn"
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl transition-colors"
              >
                Pré-visualizar Decisão (Simulação)
              </button>
            )}

            {/* Preview State */}
            {simulationState === 'PREVIEW_SHOWN' && selectedOption && (
              <div
                data-testid="decision-preview-state"
                className="bg-white rounded-2xl border border-amber-200 p-5 shadow-2xs space-y-4"
              >
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h2 className="text-sm font-bold">Prévia de Decisão — Não Executada</h2>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-amber-700 font-semibold">Decisão selecionada:</span>
                    <span className="font-bold text-amber-900">{selectedOption.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700 font-semibold">Protocolo:</span>
                    <span className="font-mono text-amber-900">{report.id}</span>
                  </div>
                  <div>
                    <span className="text-amber-700 font-semibold block mb-1">Justificativa:</span>
                    <blockquote className="italic text-amber-900 border-l-2 border-amber-500 pl-2">
                      "{justification}"
                    </blockquote>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Esta prévia é demonstrativa. Pressionar "Confirmar" resultará em estado bloqueado
                  — nenhuma ação real será executada.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmSimulation}
                    data-testid="confirm-decision-btn"
                    className="flex-1 py-2.5 px-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Confirmar (Demonstração)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulationState('NONE')}
                    data-testid="cancel-decision-preview-btn"
                    className="flex-1 py-2.5 px-3 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Blocked Result State */}
            {simulationState === 'BLOCKED_RESULT' && (
              <div
                data-testid="decision-blocked-result-state"
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Resultado Bloqueado — Autorização Necessária
                  </h2>
                </div>
                <div
                  data-testid="blocked-confirmation-state"
                  className="p-4 bg-slate-900 rounded-xl text-white text-xs space-y-2"
                >
                  <p className="font-bold text-slate-200">
                    Nenhuma ação de moderação foi executada.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Este protótipo opera em modo fail-closed. Nenhuma conta foi suspensa, nenhum
                    anúncio foi removido e nenhuma restrição foi aplicada. A autorização de alçada é
                    obrigatória para execução real de qualquer medida de moderação.
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-300 font-semibold">
                      Decisão bloqueada — backend não autorizado
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSimulationState('NONE');
                    setSelectedDecision(null);
                    setJustification('');
                  }}
                  data-testid="reset-decision-btn"
                  className="w-full py-2 px-3 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Redefinir simulação
                </button>
              </div>
            )}
          </div>

          {/* Right Column — Context & Audit Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Permission Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-600" />
                <span>Resumo de Permissões</span>
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-emerald-50 rounded-lg">
                  <span className="text-slate-600">Main Admin</span>
                  <span className="text-emerald-700 font-semibold">Prévia autorizada</span>
                </div>
                <div className="flex justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-slate-600">Support</span>
                  <span className="text-red-700 font-semibold">DENY_PENDING</span>
                </div>
                <div className="flex justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-slate-600">Sales</span>
                  <span className="text-red-700 font-semibold">DENY_PENDING</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Execução real</span>
                  <span className="text-slate-700 font-semibold">Backend bloqueado</span>
                </div>
              </div>
            </div>

            {/* Required Justification Note */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Justificativa Obrigatória</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Toda decisão de moderação — mesmo em modo demonstrativo — requer fundamentação
                    técnica explícita para fins de auditoria e rastreabilidade.
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Fields */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Campos de Auditoria
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Protocolo</span>
                  <span className="font-mono font-bold text-slate-800">{report.id}</span>
                </div>
                {report.adId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Anúncio</span>
                    <span className="font-mono text-slate-700">{report.adId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendedor</span>
                  <span className="text-slate-700">{report.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estado atual</span>
                  <ReportStatusBadge status={report.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Revisor</span>
                  <span className="text-slate-700">{decision.reviewer}</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              {report.conversationExcerpt && (
                <Link
                  href={`/moderacao/${report.id}/conversa`}
                  data-testid="navigate-conv-from-decision"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Revisar conversa vinculada
                </Link>
              )}
              <Link
                href={`/moderacao/${report.id}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para detalhes
              </Link>
              <Link
                href="/moderacao"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 font-medium text-xs rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Fila de denúncias
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Footer */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>AMBIENTE DEMONSTRATIVO</strong> — Nenhum usuário foi suspenso, nenhum anúncio
              removido e nenhuma conversa aberta por este protótipo. Decisões de moderação real
              requerem autorização de alçada e integração de backend aprovada.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
