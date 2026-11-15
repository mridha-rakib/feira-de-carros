'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockNotificationTemplates } from '@/lib/adapters/mock-content-settings-data';
import type { NotificationTemplateRecord } from '@/lib/types/content-settings-presentation';
import {
  Bell,
  CheckCircle2,
  Code,
  Edit3,
  Lock,
  Mail,
  Send,
  Shield,
  Smartphone,
} from 'lucide-react';
import * as React from 'react';

export default function NotificationTemplatesPage() {
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>(
    mockNotificationTemplates[0]?.id || '',
  );
  const [editSubject, setEditSubject] = React.useState<string>(
    mockNotificationTemplates[0]?.subject || '',
  );
  const [editBody, setEditBody] = React.useState<string>(
    mockNotificationTemplates[0]?.bodyText || '',
  );
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'SAVED'>('NONE');

  const selectedTemplate =
    mockNotificationTemplates.find((t) => t.id === selectedTemplateId) ||
    mockNotificationTemplates[0];

  const handleSelectTemplate = (template: NotificationTemplateRecord) => {
    setSelectedTemplateId(template.id);
    setEditSubject(template.subject);
    setEditBody(template.bodyText);
    setSimulationState('NONE');
  };

  const handleSimulateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('SAVED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Modelos de Notificação']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-notifications-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Modelos de Notificação e Mensageria"
          subtitle="Gestão de templates transacionais de e-mail e push. Minimização de dados pessoais e disparo sob estrito fail-closed."
          badgeLabel="ADM-D-051"
          figmaNodeId="341:5342"
        />

        {/* Mobile Restriction Banner */}
        <MobileSettingsRestrictedBanner moduleName="modelos de notificação" />

        {/* SMG-09 / NOT-006 / NOT-007 HOLD Banner */}
        <SettingsHoldBanner
          gateCode="SMG-09 / NOT-006 / NOT-007"
          title="DISPARO DE NOTIFICAÇÕES E AUTOMAÇÃO EM HOLD"
          description="Em cumprimento aos requisitos SMG-09, NOT-006 e NOT-007, o envio real de e-mails, SMS e notificações push está suspenso até a homologação dos provedores transacionais e políticas de opt-in/LGPD. Nenhuma mensagem externa é disparada por este painel."
        />

        {/* KPI Cards (4 summary cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Templates Configurados
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">5</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Modelos transacionais ativos
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Canais Homologados
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">2</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">E-mail e Push Mobile</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Disparos em Background
            </span>
            <div className="text-2xl font-black text-red-600 tracking-tight">0</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">HOLD SMG-09 ativo</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Conformidade LGPD
            </span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">100%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Minimização de dados
            </div>
          </div>
        </div>

        {/* Main Grid: Template List + Template Details / Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (6 cols): Templates Table */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-bold text-slate-900">Eventos de Notificação</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">5 eventos do sistema</span>
              </div>

              <div className="space-y-2" data-testid="notification-templates-list">
                {mockNotificationTemplates.map((template) => {
                  const isSelected = template.id === selectedTemplateId;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      className={`p-3.5 rounded-xl border transition-all text-left w-full cursor-pointer ${
                        isSelected
                          ? 'bg-red-50/50 border-red-300 ring-1 ring-red-200'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {template.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {template.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Categoria: {template.category}
                          </p>
                        </div>

                        {/* Channel Badges */}
                        <div className="flex items-center gap-1">
                          {template.channels.includes('EMAIL') && (
                            <span
                              title="Canal E-mail"
                              className="w-5 h-5 rounded flex items-center justify-center bg-blue-50 text-blue-700"
                            >
                              <Mail className="w-3 h-3" />
                            </span>
                          )}
                          {template.channels.includes('PUSH') && (
                            <span
                              title="Canal Push Mobile"
                              className="w-5 h-5 rounded flex items-center justify-center bg-purple-50 text-purple-700"
                            >
                              <Smartphone className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{template.privacyLevel}</span>
                        <span className="font-semibold text-emerald-600">
                          {template.statusLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy Invariant Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Diretrizes de Privacidade e LGPD em Mensageria</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>Vedada a exposição de dados sensíveis:</strong> CPF, CNPJ, dados de
                    cartão ou endereços residenciais não podem ser incluídos em variáveis de
                    templates.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>
                    <strong>Transacionais estritos:</strong> E-mails de notificação são estritamente
                    transacionais e não realizam campanhas publicitárias não solicitadas (SPAM).
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (6 cols): Selected Template Details & Simulation Form */}
          <div className="lg:col-span-6 space-y-4">
            <div
              data-testid="selected-template-panel"
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Modelo Selecionado • ADM-D-051
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedTemplate.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  {selectedTemplate.id}
                </span>
              </div>

              {/* Personalization Variables Reference */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-slate-400" />
                  <span>Variáveis Dinâmicas Homologadas</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate.variables.map((v) => (
                    <span
                      key={v}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Edit Template Form */}
              <form onSubmit={handleSimulateSave} className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edição e Parametrização do Conteúdo</span>
                </h4>

                <div>
                  <label
                    htmlFor="template-subject-input"
                    className="block text-[10px] font-bold text-slate-600 mb-1"
                  >
                    Assunto do E-mail / Título do Push
                  </label>
                  <input
                    id="template-subject-input"
                    type="text"
                    value={editSubject}
                    onChange={(e) => {
                      setEditSubject(e.target.value);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="template-body-textarea"
                    className="block text-[10px] font-bold text-slate-600 mb-1"
                  >
                    Corpo da Notificação (Mensagem)
                  </label>
                  <textarea
                    id="template-body-textarea"
                    rows={6}
                    value={editBody}
                    onChange={(e) => {
                      setEditBody(e.target.value);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-sans text-slate-900 leading-relaxed"
                  />
                </div>

                {simulationState === 'SAVED' && (
                  <div
                    data-testid="template-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Simulação Registrada — Modo Fail-Closed</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Proposta de alteração do modelo <strong>{selectedTemplate.id}</strong>{' '}
                      validada na interface. Em observância aos requisitos{' '}
                      <strong>SMG-09, NOT-006 e NOT-007</strong>, nenhum e-mail ou disparo push é
                      acionado no ambiente demonstrativo.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Simular Atualização de Template
                  </button>

                  <button
                    type="button"
                    disabled
                    title="Disparo real desabilitado sob HOLD SMG-09"
                    className="w-full sm:w-auto py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar Teste (Bloqueado)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
