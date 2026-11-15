'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { MobileSettingsRestrictedBanner } from '@/app/configuracoes/components/MobileSettingsRestrictedBanner';
import { SettingsHoldBanner } from '@/app/configuracoes/components/SettingsHoldBanner';
import { SettingsSectionHeader } from '@/app/configuracoes/components/SettingsSectionHeader';
import { mockContactSettings } from '@/lib/adapters/mock-content-settings-data';
import {
  AlertTriangle,
  Building2,
  Clock,
  Edit3,
  Eye,
  Headphones,
  Lock,
  Mail,
  MapPin,
  PhoneCall,
  Shield,
  ShieldAlert,
} from 'lucide-react';
import * as React from 'react';

export default function ContactSettingsPage() {
  const [emailInput, setEmailInput] = React.useState(mockContactSettings.officialEmail);
  const [phoneInput, setPhoneInput] = React.useState(mockContactSettings.officialPhone);
  const [hoursInput, setHoursInput] = React.useState(mockContactSettings.businessHours);
  const [addressInput, setAddressInput] = React.useState(mockContactSettings.physicalAddress);
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'SIMULATED'>('NONE');

  const handleSimulateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('SIMULATED');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Configurações', 'Contato e Suporte']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="settings-contact-page">
        {/* Header */}
        <SettingsSectionHeader
          title="Canais de Atendimento e Suporte"
          subtitle="Configuração dos pontos de contato institucionais, horários de atendimento e roteamento ao suporte ao consumidor."
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

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Status dos Canais
            </span>
            <div className="text-xl font-black text-amber-600 tracking-tight">Em Validação</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Homologação pendente</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Praça de Referência
            </span>
            <div className="text-xl font-black text-slate-900 tracking-tight">Ipatinga - MG</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Sede Vale do Aço</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Nível de Atendimento
            </span>
            <div className="text-xl font-black text-slate-900 tracking-tight">N1 Triagem</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Encaminhamento interno
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Controle de Acesso
            </span>
            <div className="text-xl font-black text-red-600 tracking-tight">Main Admin</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Suporte / Vendas restrito
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Channel Configuration Form */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Canais Institucionais de Atendimento
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  ADM-D-052
                </span>
              </div>

              <form onSubmit={handleSimulateSave} className="space-y-4">
                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="contact-email-input"
                      className="text-[10px] font-bold text-slate-600 uppercase"
                    >
                      E-mail Oficial de Atendimento
                    </label>
                    <span className="text-[10px] text-amber-600 font-medium">
                      Pendente de validação MX
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="contact-email-input"
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {mockContactSettings.emailStatus}
                  </p>
                </div>

                {/* Phone / VoIP Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="contact-phone-input"
                      className="text-[10px] font-bold text-slate-600 uppercase"
                    >
                      Telefone / Central VoIP / WhatsApp
                    </label>
                    <span className="text-[10px] text-amber-600 font-medium">
                      Aguardando linha 0800
                    </span>
                  </div>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="contact-phone-input"
                      type="text"
                      value={phoneInput}
                      onChange={(e) => {
                        setPhoneInput(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {mockContactSettings.phoneStatus}
                  </p>
                </div>

                {/* Business Hours Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="contact-hours-input"
                      className="text-[10px] font-bold text-slate-600 uppercase"
                    >
                      Horário de Funcionamento do SAC
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Horário oficial</span>
                  </div>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="contact-hours-input"
                      type="text"
                      value={hoursInput}
                      onChange={(e) => {
                        setHoursInput(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {mockContactSettings.hoursStatus}
                  </p>
                </div>

                {/* Physical Address Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="contact-address-input"
                      className="text-[10px] font-bold text-slate-600 uppercase"
                    >
                      Endereço Institucional (Ponto Físico de Apoio)
                    </label>
                    <span className="text-[10px] text-amber-600 font-medium">Em contratação</span>
                  </div>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="contact-address-input"
                      type="text"
                      value={addressInput}
                      onChange={(e) => {
                        setAddressInput(e.target.value);
                        setSimulationState('NONE');
                      }}
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {mockContactSettings.addressStatus}
                  </p>
                </div>

                {simulationState === 'SIMULATED' && (
                  <div
                    data-testid="contact-simulation-result"
                    className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Atualização Registrada em Demonstração</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Os canais de suporte propostos foram atualizados na prévia do painel. Conforme
                      o requisito <strong>SMG-08 / SAC-001</strong>, a publicação para o público
                      permanece bloqueada até a homologação formal de CNPJ e telefonia.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Simular Atualização de Canais de Suporte
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (5 cols): Consumer View Preview & Permissions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Public Page Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Prévia da Central de Ajuda do Comprador</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  Visualização Pública
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900">Precisa de Ajuda?</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Central de Atendimento ao Comprador e Vendedor
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="font-medium">{emailInput}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <PhoneCall className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="font-mono font-medium">{phoneInput}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{hoursInput}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{addressInput}</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                * Links telefônicos e de e-mail encontram-se desativados no ambiente demonstrativo
                para evitar falsas tentativas de contato.
              </p>
            </div>

            {/* RBAC & Routing Policy Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Roteamento de Chamados e Perfis Restritos</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>Main Admin:</strong> Possui atribuição exclusiva para parametrizar canais
                  e definir horários de atendimento da plataforma.
                </p>
                <p>
                  <strong>Suporte / Vendas:</strong> Operadores nos perfis Support e Sales possuem
                  apenas visualização de leitura dos canais, mantendo status{' '}
                  <span className="font-mono font-bold text-red-700">DENY_PENDING</span> para edição
                  de contatos públicos institucionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
