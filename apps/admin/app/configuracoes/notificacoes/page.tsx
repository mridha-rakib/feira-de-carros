'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockNotificationTemplates } from '@/lib/adapters/mock-content-settings-data';
import type { NotificationTemplateRecord } from '@/lib/types/content-settings-presentation';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Code,
  CreditCard,
  Edit3,
  FileText,
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
      breadcrumbs={['Admin', 'Configurações', 'Modelos de notificação por e-mail e push']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-notifications-page">
        {/* Header matching Figma ADM-D-051 */}
        <SettingsSectionHeader
          title="Modelos de notificação por e-mail e push"
          subtitle="Categorias de eventos, prévia de conteúdo e controles de privacidade."
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

        {/* 4 Summary KPI Cards directly matching Figma node 342:5376 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {/* KPI 1: Eventos */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <FileText className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Eventos</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">
                  5 classes
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Amostra de notificações</p>
          </div>

          {/* KPI 2: Canais */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <Shield className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Canais</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">
                  E-mail / push
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">
              Conforme preferências e consentimento
            </p>
          </div>

          {/* KPI 3: Envios efetuados */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <CreditCard className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Envios efetuados</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">0</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Demonstração sem disparo</p>
          </div>

          {/* KPI 4: Cadência */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Cadência</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">Pendente</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">SMG-09 / privacidade</p>
          </div>
        </div>

        {/* Template Control Card matching Figma node 342:5422 */}
        <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col gap-[11px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
              <Shield className="w-[20px] h-[20px] text-[#b91c1c]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#111827]">Modelos por evento e canal</h2>
          </div>
          <p className="text-[12px] font-normal text-[#64748b]">
            Somente eventos aprovados; a configuração de template não ignora preferências do
            utilizador, consentimento aplicável ou regras de retenção e entrega.
          </p>
          <div className="flex flex-wrap gap-[9px] pt-1">
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#b91c1c] hover:bg-[#a8121c] text-white text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Ver mensagem de anúncio
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Prévia: editar modelo
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Regras de envio
            </button>
          </div>
        </div>

        {/* Main Content: Events Directory + Template Preview matching Figma node 342:5438 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (6 cols): Events Directory matching Figma node 342:5439 */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                    <FileText className="w-[20px] h-[20px] text-[#b91c1c]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111827]">
                    Eventos de notificação previstos
                  </h3>
                </div>
                <span className="text-[11px] text-[#64748b]">5 modelos</span>
              </div>
              <p className="text-[12px] text-[#64748b]">
                Disponibilidade de canal e momento do disparo sujeitos à política.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left" data-testid="notification-templates-table">
                  <thead>
                    <tr className="bg-[#f1f5f9] text-[10px] font-bold text-[#4b5563] uppercase tracking-wider rounded-[9px]">
                      <th className="py-[11px] pl-[10px]">EVENTO / CÓDIGO</th>
                      <th className="py-[11px] px-2">CANAL</th>
                      <th className="py-[11px] pr-[10px]">CONTROLO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'TPL-MSG-01', title: 'Nova mensagem', channel: 'E-mail / Push' },
                      {
                        id: 'TPL-SAVE-02',
                        title: 'Pesquisa salva: novo anúncio',
                        channel: 'E-mail / Push',
                      },
                      { id: 'TPL-EXP-03', title: 'Expiração do anúncio', channel: 'E-mail / Push' },
                      { id: 'TPL-PAY-04', title: 'Confirmação de pagamento', channel: 'E-mail' },
                      { id: 'TPL-DISP-05', title: 'Disputa de cobrança', channel: 'E-mail' },
                    ].map((row) => {
                      const isSelected = row.id === selectedTemplate.id;
                      const matchedRecord =
                        mockNotificationTemplates.find((t) => t.id === row.id) || selectedTemplate;
                      return (
                        <tr
                          key={row.id}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectTemplate(matchedRecord);
                            }
                          }}
                          onClick={() => handleSelectTemplate(matchedRecord)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#fff5f5]' : 'bg-[#f8fafc] hover:bg-slate-100'
                          }`}
                        >
                          <td className="py-[12px] pl-[10px]">
                            <div className="flex flex-col">
                              <span className="text-[12px] font-semibold text-[#111827]">
                                {row.title}
                              </span>
                              <span className="text-[11px] font-normal text-[#4b5563]">
                                {row.id}
                              </span>
                            </div>
                          </td>
                          <td className="py-[12px] px-2 text-[12px] text-[#64748b]">
                            {row.channel}
                          </td>
                          <td className="py-[12px] pr-[10px]">
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

              {/* Blue Notice banner matching Figma node 342:5499 */}
              <div className="bg-[#eff6ff] rounded-[9px] p-[13px] border border-blue-200/80 space-y-1">
                <p className="text-[11px] font-bold text-[#1d4ed8]">
                  DISPARO NÃO É AUTOMÁTICO NESTE PROTÓTIPO
                </p>
                <p className="text-[11px] text-[#1e40af]">
                  Conforme NOT-006 e NOT-007, mensagens são geradas sob demanda sem webhook externo
                  ou fila ativa.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Selected Template Preview matching Figma node 342:5483 */}
          <div className="lg:col-span-6 space-y-4">
            <div
              data-testid="selected-template-panel"
              className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[11px] uppercase font-bold text-[#b91c1c]">
                  MODELO SELECIONADO · {selectedTemplate.id}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#111827]">
                  {selectedTemplate.category}
                </span>
              </div>

              <div>
                <h4 className="text-[18px] font-bold text-[#111827]">{selectedTemplate.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-[7px] px-[11px] py-[4px] rounded-[12px] bg-[#fff7ed] text-[#c2410c] text-[11px] font-semibold">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#ea580c]" />
                    Pendente de homologação de canal
                  </span>
                </div>
              </div>

              {/* Divided Data Rows matching Figma FDC DataRow */}
              <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[13px]">
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Identificador</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    {selectedTemplate.id}
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Canais suportados</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    {selectedTemplate.channels.join(' e ')}
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Política LGPD</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Minimização de dados
                  </span>
                </div>
              </div>

              {/* Template Editor Simulator */}
              <form
                onSubmit={handleSimulateSave}
                className="space-y-3 bg-slate-50 p-3.5 rounded-[10px] border border-slate-200/80"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-slate-500" />
                  <span className="text-[12px] font-bold text-[#111827]">
                    Editor de Minuta do Template (Simulação Local)
                  </span>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="tpl-subject"
                    className="text-[11px] font-semibold text-[#4b5563] block"
                  >
                    Assunto do e-mail / Título do push:
                  </label>
                  <input
                    id="tpl-subject"
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-[8px] px-2.5 py-1.5 text-[12px] text-[#111827]"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="tpl-body"
                    className="text-[11px] font-semibold text-[#4b5563] block"
                  >
                    Corpo da mensagem (suporta tags homologadas):
                  </label>
                  <textarea
                    id="tpl-body"
                    rows={5}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-[8px] px-2.5 py-1.5 text-[12px] text-[#111827] font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#64748b]">
                    Variáveis: {selectedTemplate.variables.slice(0, 3).join(', ')}
                  </span>
                  <button
                    type="submit"
                    className="bg-[#111827] hover:bg-slate-800 text-white text-[12px] font-semibold px-4 py-2 rounded-[8px] transition-colors"
                  >
                    Salvar Rascunho
                  </button>
                </div>

                {simulationState === 'SAVED' && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[8px] text-[11px] text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Rascunho de {selectedTemplate.id} atualizado em memória local.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
