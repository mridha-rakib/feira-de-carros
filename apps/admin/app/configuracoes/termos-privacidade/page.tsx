'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockLegalDocuments } from '@/lib/adapters/mock-content-settings-data';
import type { LegalDocumentRecord } from '@/lib/types/content-settings-presentation';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  FileCheck,
  FileText,
  History,
  Lock,
  Scale,
  Send,
  Shield,
} from 'lucide-react';
import * as React from 'react';

export default function TermsAndPrivacyPage() {
  const [selectedDocId, setSelectedDocId] = React.useState<string>(mockLegalDocuments[0]?.id || '');
  const [draftClause, setDraftClause] = React.useState<string>('');
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'DRAFTED' | 'REQUESTED'>(
    'NONE',
  );

  const selectedDoc =
    mockLegalDocuments.find((d) => d.id === selectedDocId) || mockLegalDocuments[0];

  const handleSimulateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('DRAFTED');
  };

  const handleRequestApproval = () => {
    setSimulationState('REQUESTED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Termos e Privacidade']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-terms-privacy-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Termos de Uso e Política de Privacidade"
          subtitle="Gestão de minutas legais, regras de consentimento do consumidor e diretrizes de governança em conformidade com a LGPD."
          badgeLabel="ADM-D-053"
          figmaNodeId="354:6767"
        />

        {/* Mobile Restriction Banner */}
        <MobileSettingsRestrictedBanner moduleName="termos de uso e privacidade" />

        {/* LGPD / CL-002 / CL-003 HOLD Banner */}
        <SettingsHoldBanner
          gateCode="LGPD / CL-002 / CL-003"
          title="MINUTAS DEMONSTRATIVAS NÃO HOMOLOGADAS"
          description="Em conformidade com os requisitos CL-002, CL-003 e as diretrizes da LGPD (Lei nº 13.709/2018), os textos apresentados constituem minutas preliminares (versão 0.1) sujeitas a parecer jurídico formal antes da publicação em ambiente de produção. Nenhuma minuta possui eficácia jurídica definitiva no momento."
        />

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Minutas Cadastradas
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">2</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Termos de Uso e LGPD
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Versão Vigente
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">v0.1</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Rascunho de demonstração
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Idioma Oficial
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">pt-BR</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Português do Brasil</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Homologação Jurídica
            </span>
            <div className="text-2xl font-black text-amber-600 tracking-tight">PENDENTE</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Parecer em análise</div>
          </div>
        </div>

        {/* Document Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {mockLegalDocuments.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setSelectedDocId(doc.id);
                  setSimulationState('NONE');
                }}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`}
                />
                <span>{doc.title}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {doc.id}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid: Document Details + Revision History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Document Sections / Clauses */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-red-600" />
                    <h2 className="text-sm font-bold text-slate-900">{selectedDoc.title}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedDoc.summary}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                  {selectedDoc.statusLabel}
                </span>
              </div>

              {/* Sections List */}
              <div className="space-y-3" data-testid="legal-sections-list">
                {selectedDoc.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900">{sec.title}</h3>
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        {sec.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{sec.excerpt}</p>
                  </div>
                ))}
              </div>

              {/* Propose Clause Draft Form */}
              <form
                onSubmit={handleSimulateDraft}
                className="space-y-3 pt-3 border-t border-slate-100"
              >
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Proposta de Aditamento ou Nova Cláusula (Rascunho)</span>
                </h4>

                <div>
                  <label
                    htmlFor="clause-draft-textarea"
                    className="block text-[10px] font-bold text-slate-600 mb-1"
                  >
                    Texto da Cláusula Proposta
                  </label>
                  <textarea
                    id="clause-draft-textarea"
                    rows={3}
                    placeholder="Redija o texto da minuta jurídica para submissão ao parecer..."
                    value={draftClause}
                    onChange={(e) => {
                      setDraftClause(e.target.value);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>

                {simulationState === 'DRAFTED' && (
                  <div
                    data-testid="clause-draft-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Minuta Registrada em Ambiente Demonstrativo</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      A proposta de cláusula foi registrada localmente no rascunho de{' '}
                      {selectedDoc.id}. Em cumprimento ao requisito <strong>CL-002</strong>, nenhuma
                      alteração possui validade legal sem homologação da assessoria jurídica.
                    </p>
                  </div>
                )}

                {simulationState === 'REQUESTED' && (
                  <div
                    data-testid="approval-request-result"
                    className="p-3.5 rounded-xl bg-emerald-950 text-white text-xs space-y-1.5 border border-emerald-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Solicitação de Homologação Jurídica Enviada (Simulação)</span>
                    </div>
                    <p className="text-[11px] text-emerald-200 leading-relaxed">
                      Protocolo de parecer jurídico aberto sob número{' '}
                      <strong>LEG-2026-PARECER-01</strong>. A publicação do documento segue
                      bloqueada até conclusão formal.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Simular Nova Revisão de Rascunho
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestApproval}
                    className="w-full sm:w-auto py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Solicitar Homologação Jurídica</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column (4 cols): Metadata & Revision History */}
          <div className="lg:col-span-4 space-y-4">
            {/* Document Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-100 pb-2">
                Ficha Cadastral da Minuta
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">
                    Identificador do Documento
                  </span>
                  <span className="font-mono font-bold text-slate-900">{selectedDoc.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Versão do Rascunho</span>
                  <span className="font-bold text-slate-800">{selectedDoc.version}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Idioma</span>
                  <span className="font-semibold text-slate-700">{selectedDoc.language}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Última Revisão</span>
                  <span className="text-slate-600">{selectedDoc.lastRevised}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Vigência Efetiva</span>
                  <span className="text-amber-700 font-semibold">{selectedDoc.effectiveDate}</span>
                </div>
              </div>
            </div>

            {/* Audit Trail / History */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Histórico de Revisões e Auditoria
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {selectedDoc.auditTrail.map((item) => (
                  <div
                    key={`${item.date}-${item.actor}`}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-700">{item.actor}</span>
                      <span className="text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blocked Publication Notice */}
            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/60 space-y-2 text-xs text-red-900">
              <div className="flex items-center gap-1.5 font-bold text-red-800">
                <Lock className="w-4 h-4 text-red-600 shrink-0" />
                <span>Publicação Bloqueada</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-800/90">
                A publicação em produção de Termos de Uso e Política de Privacidade requer aprovação
                assinada pela assessoria jurídica e assinatura criptográfica do DPO responsável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
