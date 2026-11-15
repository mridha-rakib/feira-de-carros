'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockContactSettings } from '@/lib/adapters/mock-content-settings-data';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  FileText,
  Headphones,
  Lock,
  Mail,
  MapPin,
  PhoneCall,
  Shield,
} from 'lucide-react';
import * as React from 'react';

export default function ContactSettingsPage() {
  const [emailInput, setEmailInput] = React.useState('Aguardando cliente');
  const [phoneInput, setPhoneInput] = React.useState('Não fornecido');
  const [hoursInput, setHoursInput] = React.useState('A confirmar');
  const [addressInput, setAddressInput] = React.useState('Ipatinga, MG');
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'SIMULATED'>('NONE');

  const handleSimulateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('SIMULATED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Configurações de contato e suporte']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-contact-page">
        {/* Header matching Figma ADM-D-052 */}
        <SettingsSectionHeader
          title="Configurações de contato e suporte"
          subtitle="Canais de atendimento, dados públicos e roteamento autorizado."
          badgeLabel="ADM-D-052"
          figmaNodeId="341:5558"
        />

        {/* Mobile Restriction Banner */}
        <MobileSettingsRestrictedBanner moduleName="canais de contato e suporte" />

        {/* SMG-08 / SAC-001 HOLD Banner */}
        <SettingsHoldBanner
          gateCode="SMG-08 / SAC-001"
          title="CANAIS DE ATENDIMENTO PENDENTES DE FORMALIZAÇÃO"
          description="Em cumprimento aos requisitos SMG-08 e SAC-001, dados oficiais de contato (endereço físico, número 0800 e e-mail institucional homologado) estão em fase de validação jurídica e contratual. Dados apresentados são demonstrativos e nenhum canal externo é acionado."
        />

        {/* 4 Summary KPI Cards directly matching Figma node 342:5566 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {/* KPI 1: Canal principal */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <Shield className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Canal principal</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">Suporte</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Entrada pública de atendimento</p>
          </div>

          {/* KPI 2: Endereço oficial */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Endereço oficial</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">Pendente</span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Client validation required</p>
          </div>

          {/* KPI 3: Equipe */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <CreditCard className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Equipe</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">
                  Sales / Support
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Sem identidade compartilhada</p>
          </div>

          {/* KPI 4: Publicação */}
          <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col justify-between h-[122px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                <FileText className="w-[20px] h-[20px] text-[#b91c1c]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#64748b]">Publicação</span>
                <span className="text-[18px] font-bold text-[#101828] leading-tight">
                  Não aplicada
                </span>
              </div>
            </div>
            <p className="text-[11px] font-normal text-[#4b5563]">Conteúdo demonstrativo</p>
          </div>
        </div>

        {/* Support Control Card matching Figma node 342:5612 */}
        <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs flex flex-col gap-[11px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
              <Shield className="w-[20px] h-[20px] text-[#b91c1c]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#111827]">
              Conteúdo e canais de contato ao público
            </h2>
          </div>
          <p className="text-[12px] font-normal text-[#64748b]">
            Main Admin gere as instruções de contacto exibidas ao público. Email, telefone e
            horários abaixo são valores de interface demonstrativos, nunca canais confirmados do
            cliente.
          </p>
          <div className="flex flex-wrap gap-[9px] pt-1">
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#b91c1c] hover:bg-[#a8121c] text-white text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Ver cartão de contato
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Prévia de publicação
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-[#eef2f7] hover:bg-[#e2e8f0] text-[#344054] text-[12px] font-semibold px-[14px] py-[12px] rounded-[9px] transition-colors"
            >
              Ver gestão da equipe
            </button>
          </div>
        </div>

        {/* Main Content: Channel Data Rows + Public Preview Card matching Figma node 342:5628 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (6 cols): Configurable Data Rows matching Figma node 342:5629 */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs space-y-4">
              <div className="flex items-center gap-[10px] border-b border-slate-100 pb-3">
                <div className="w-[34px] h-[34px] rounded-[17px] bg-[#fff0f1] flex items-center justify-center shrink-0">
                  <FileText className="w-[20px] h-[20px] text-[#b91c1c]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#111827]">
                  Dados e conteúdo configurável
                </h3>
              </div>

              {/* Exact Divided Data Rows matching Figma FDC DataRow (342:5640 - 342:5712) */}
              <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[13px]">
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Canal</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Atendimento / Suporte
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Texto público</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Fale com a equipe Feira de Carros
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">E-mail oficial</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Aguardando cliente
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Telefone oficial</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Não fornecido
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Horários</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    A confirmar
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Cidade/UF de referência</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Ipatinga, MG
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Visibilidade</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Pública após aprovação
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Acesso</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Acesso mínimo necessário
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">CPF/CNPJ</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Restrito por campo
                  </span>
                </div>
                <div className="py-[7px] flex items-center justify-between">
                  <span className="text-[#4b5563] w-[180px]">Status</span>
                  <span className="font-semibold text-[#111827] flex-1 text-right">
                    Conteúdo não publicado
                  </span>
                </div>
              </div>

              {/* Form Sandbox for Local Simulation */}
              <form
                onSubmit={handleSimulateSave}
                className="space-y-3 bg-slate-50 p-3.5 rounded-[10px] border border-slate-200/80"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-slate-500" />
                  <span className="text-[12px] font-bold text-[#111827]">
                    Simular Atualização de Contato (Ambiente de Demonstração)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label htmlFor="ct-email" className="font-semibold text-[#4b5563] block mb-0.5">
                      E-mail Institucional:
                    </label>
                    <input
                      id="ct-email"
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-white border border-[#d1d5db] rounded-[6px] px-2 py-1 text-[12px] text-[#111827]"
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className="font-semibold text-[#4b5563] block mb-0.5">
                      Telefone Oficial:
                    </label>
                    <input
                      id="ct-phone"
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-white border border-[#d1d5db] rounded-[6px] px-2 py-1 text-[12px] text-[#111827]"
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-hours" className="font-semibold text-[#4b5563] block mb-0.5">
                      Horário de Atendimento:
                    </label>
                    <input
                      id="ct-hours"
                      type="text"
                      value={hoursInput}
                      onChange={(e) => setHoursInput(e.target.value)}
                      className="w-full bg-white border border-[#d1d5db] rounded-[6px] px-2 py-1 text-[12px] text-[#111827]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ct-address"
                      className="font-semibold text-[#4b5563] block mb-0.5"
                    >
                      Endereço / Comarca:
                    </label>
                    <input
                      id="ct-address"
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      className="w-full bg-white border border-[#d1d5db] rounded-[6px] px-2 py-1 text-[12px] text-[#111827]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-[#111827] hover:bg-slate-800 text-white text-[12px] font-semibold px-4 py-2 rounded-[8px] transition-colors"
                  >
                    Simular Alterações
                  </button>
                </div>

                {simulationState === 'SIMULATED' && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[8px] text-[11px] text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Dados de contato atualizados localmente. Publicação permanece bloqueada
                      (SMG-08).
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column (6 cols): Public Preview Card matching Figma node 342:5664 */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-[14px] border border-[#e8edf5] p-[18px] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[11px] uppercase font-bold text-[#b91c1c]">
                  PRÉVIA PÚBLICA DO CARTÃO DE ATENDIMENTO
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  DEMO DATA · VALIDAÇÃO PENDENTE
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-[12px] border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-[#b91c1c]" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#111827]">
                      Central de Atendimento ao Consumidor
                    </h4>
                    <p className="text-[11px] text-[#64748b]">
                      Feira de Carros — Regional Ipatinga / Vale do Aço
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-[12px] text-[#344054]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{emailInput}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{phoneInput}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{hoursInput}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{addressInput}</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200/80 rounded-[8px] text-[11px] text-amber-800">
                  <strong>Aviso ao Operador:</strong> Este cartão é uma projeção de interface. Não
                  utilize estas informações em canais oficiais ou material publicitário.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
