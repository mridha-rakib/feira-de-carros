'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockLegalDocuments } from '@/lib/adapters/mock-content-settings-data';
import type { LegalDocumentRecord } from '@/lib/types/content-settings-presentation';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  FileCheck,
  FileText,
  History,
  Lock,
  Scale,
  Send,
  Shield,
  Users,
} from 'lucide-react';
import * as React from 'react';

export default function TermsAndPrivacyPage() {
  const [selectedDocId, setSelectedDocId] = React.useState<string>(
    mockLegalDocuments[0]?.id || 'LEGAL-TERMS',
  );
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'REQUESTED'>('NONE');

  const selectedDoc =
    mockLegalDocuments.find((d) => d.id === selectedDocId) || mockLegalDocuments[0];

  const handleRequestApproval = () => {
    setSimulationState('REQUESTED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Termos de uso e política de privacidade']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-terms-privacy-page">
        {/* Header matching Figma ADM-D-053 */}
        <SettingsSectionHeader
          title="Termos de uso e política de privacidade"
          subtitle="Versões de documentos, revisão jurídica, publicação autorizada e histórico de alterações."
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

        {/* 4 Summary KPI Cards directly matching Figma node 355:6879 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {/* KPI 1: Documentos */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] px-[19px] py-[18px] shadow-xs flex flex-col justify-between h-[124px]">
            <div className="flex items-center gap-[9px]">
              <div className="w-[36px] h-[36px] rounded-[18px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <FileText className="w-[22px] h-[22px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#667085]">Documentos</span>
                <span className="text-[19px] font-bold text-[#101828] leading-tight">2</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Termos de uso + Privacidade</p>
          </div>

          {/* KPI 2: Versões atuais */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] px-[19px] py-[18px] shadow-xs flex flex-col justify-between h-[124px]">
            <div className="flex items-center gap-[9px]">
              <div className="w-[36px] h-[36px] rounded-[18px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <Shield className="w-[22px] h-[22px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#667085]">Versões atuais</span>
                <span className="text-[19px] font-bold text-[#101828] leading-tight">
                  Rascunhos
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Sem publicação validada</p>
          </div>

          {/* KPI 3: Aprovação legal */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] px-[19px] py-[18px] shadow-xs flex flex-col justify-between h-[124px]">
            <div className="flex items-center gap-[9px]">
              <div className="w-[36px] h-[36px] rounded-[18px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-[22px] h-[22px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#667085]">Aprovação legal</span>
                <span className="text-[19px] font-bold text-[#101828] leading-tight">Pendente</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Texto e vigência não assinados</p>
          </div>

          {/* KPI 4: Mudanças efetivas */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] px-[19px] py-[18px] shadow-xs flex flex-col justify-between h-[124px]">
            <div className="flex items-center gap-[9px]">
              <div className="w-[36px] h-[36px] rounded-[18px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <CreditCard className="w-[22px] h-[22px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#667085]">Mudanças efetivas</span>
                <span className="text-[19px] font-bold text-[#101828] leading-tight">0</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Nenhuma revisão publicada</p>
          </div>
        </div>

        {/* Legal Policy Control Card matching Figma node 355:6925 */}
        <div className="bg-white rounded-[14px] border border-[#e8edf5] px-[19px] py-[18px] shadow-xs flex flex-col gap-[11px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[36px] h-[36px] rounded-[18px] bg-[#fff0f1] flex items-center justify-center shrink-0">
              <Shield className="w-[22px] h-[22px] text-[#b91c1c]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#101828]">Controle de documentos legais</h2>
          </div>
          <p className="text-[12px] font-normal text-[#64748b]">
            A política pública depende de texto final, base legal, data de vigência, retenção LGPD e
            aprovação do cliente/profissional responsável. Este é um fluxo de publicação de
            documentos, não um parecer jurídico.
          </p>
          <div className="flex flex-wrap gap-[11px] pt-1">
            <button
              type="button"
              onClick={() => setSelectedDocId('LEGAL-TERMS')}
              className="bg-[#b91c1c] hover:bg-[#a8121c] text-white text-[12px] font-semibold px-[15px] py-[12px] rounded-[9px] transition-colors"
            >
              Ver Termos de uso
            </button>
            <button
              type="button"
              onClick={() => setSelectedDocId('LEGAL-PRIVACY')}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[15px] py-[12px] rounded-[9px] transition-colors"
            >
              Ver Política de Privacidade
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[15px] py-[12px] rounded-[9px] transition-colors"
            >
              Histórico e publicação
            </button>
          </div>
        </div>

        {/* Main Content: Document Registry + Policy Record Details matching Figma node 355:6941 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (6 cols): Document Registry matching Figma node 355:6942 */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-[14px] border border-[#e8edf5] px-[19px] py-[18px] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[36px] h-[36px] rounded-[18px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                    <FileText className="w-[22px] h-[22px] text-[#b91c1c]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#101828]">Documentos do portal</h3>
                </div>
                <span className="text-[11px] text-[#64748b]">2 minutas</span>
              </div>
              <p className="text-[12px] text-[#64748b]">
                Dados ilustrativos. Nenhuma data de publicação, aceite do usuário ou versão jurídica
                é presumida.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left" data-testid="legal-documents-table">
                  <thead>
                    <tr className="bg-[#f1f5f9] text-[10px] font-bold text-[#4b5563] uppercase tracking-wider rounded-[8px]">
                      <th className="py-[11px] pl-[10px]">DOCUMENTO / ID</th>
                      <th className="py-[11px] px-2 w-[129px]">VERSÃO</th>
                      <th className="py-[11px] pr-[10px]">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'LEGAL-TERMS', title: 'Termos de uso', version: '0.1 · demo' },
                      {
                        id: 'LEGAL-PRIVACY',
                        title: 'Política de Privacidade',
                        version: '0.1 · demo',
                      },
                    ].map((doc) => {
                      const isSelected = doc.id === selectedDoc.id;
                      return (
                        <tr
                          key={doc.id}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedDocId(doc.id);
                              setSimulationState('NONE');
                            }
                          }}
                          onClick={() => {
                            setSelectedDocId(doc.id);
                            setSimulationState('NONE');
                          }}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#fff5f5]' : 'bg-[#f8fafc] hover:bg-slate-100'
                          }`}
                        >
                          <td className="py-[19px] pl-[10px]">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-semibold text-[#111827]">
                                {doc.title}
                              </span>
                              <span className="text-[11px] font-normal text-[#4b5563]">
                                {doc.id}
                              </span>
                            </div>
                          </td>
                          <td className="py-[19px] px-2 text-[12px] text-[#1d4ed8]">
                            {doc.version}
                          </td>
                          <td className="py-[19px] pr-[10px]">
                            <span className="inline-flex items-center gap-[7px] px-[11px] py-[4px] rounded-[12px] bg-[#fff7ed] text-[#c2410c] text-[11px] font-semibold">
                              <span className="w-[7px] h-[7px] rounded-full bg-[#ea580c]" />
                              Pendente
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Amber Notice matching Figma node 355:6975 */}
              <div className="bg-[#fff7ed] rounded-[10px] p-[14px] border border-amber-200/80 space-y-1">
                <p className="text-[11px] font-bold text-[#92400e]">TEXTO LEGAL NÃO APROVADO</p>
                <p className="text-[12px] text-[#92400e]">
                  A interface não pressupõe Termos/Política já publicados. Link público, retenção e
                  direitos do titular exigem aprovação, revisão de impacto e versionamento.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Selected Document Details matching Figma node 355:6943 */}
          <div className="lg:col-span-6 space-y-4">
            <div
              data-testid="selected-document-panel"
              className="bg-white rounded-[14px] border border-[#e8edf5] px-[19px] py-[18px] shadow-xs space-y-4"
            >
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[11px] uppercase font-bold text-[#b91c1c] block">
                  DOCUMENTO SELECIONADO · {selectedDoc.id}
                </span>
                <h4 className="text-[21px] font-bold text-[#101828] mt-1">{selectedDoc.title}</h4>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-[7px] px-[11px] py-[4px] rounded-[12px] bg-[#fff7ed] text-[#c2410c] text-[11px] font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#ea580c]" />
                    Pendente de aprovação legal
                  </span>
                </div>
              </div>

              {/* Exact Divided Data Rows matching Figma node 355:6983 */}
              <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[13px]">
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Versão (demo)</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    0.1 — rascunho
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Publicação</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Não confirmada
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Data de vigência</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Pendente de aprovação
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Responsável</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Main Admin / revisão legal
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Idioma</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Português do Brasil
                  </span>
                </div>
              </div>

              {/* Section Preview & Draft Simulator */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-[10px] border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span className="text-[12px] font-bold text-[#111827]">
                    Minuta Preliminar (Rascunho de Avaliação)
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-relaxed">{selectedDoc.summary}</p>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedDoc.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className="p-2 bg-white rounded-[6px] border border-slate-200 text-[11px]"
                    >
                      <div className="font-bold text-[#111827]">{sec.title}</div>
                      <p className="text-[#4b5563] mt-0.5 line-clamp-2">{sec.excerpt}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleRequestApproval}
                    className="w-full bg-[#111827] hover:bg-slate-800 text-white text-[12px] font-semibold py-2 rounded-[8px] transition-colors"
                  >
                    Simular Envio para Parecer Jurídico
                  </button>
                </div>

                {simulationState === 'REQUESTED' && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[8px] text-[11px] text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Solicitação simulada. Publicação permanece estritamente bloqueada até parecer
                      formal.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
