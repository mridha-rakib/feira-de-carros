'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconCheck,
  IconEdit,
  IconEye,
  IconFile,
  IconHelpCircle,
  IconInfo,
  IconLock,
  IconMail,
  IconPhone,
  IconPin,
  IconShield,
  IconUser,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getUserProfile } from '@/lib/adapters/user-account-adapter';
import type { UserProfileData } from '@/lib/types/seller-presentation';
import Link from 'next/link';
import { useState } from 'react';

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState<UserProfileData>(() => getUserProfile());
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(profile.phone);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const [notifications, setNotifications] = useState(profile.notifications);

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setProfile((prev) => ({
      ...prev,
      phone: phoneValue,
      notifications,
    }));
    setIsEditingPhone(false);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Minha Conta', href: '/vendedor/conta' },
            { label: 'Configurações da Conta' },
          ]}
        />

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827]">
              Configurações da Conta
            </h1>
            <p className="text-[14px] text-[#596679] mt-1">
              Gerencie seus dados de acesso, informações cadastrais e preferências de notificação.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">
              Rota: /conta/configuracoes
            </span>
            <span className="text-[11px] text-[#16a34a] font-semibold">
              WEB-012 • CONTA COMPARTILHADA
            </span>
          </div>
        </div>

        {/* Scope Notice Banner (Figma 1099:1417) */}
        <div className="bg-white border border-[#d6dfea] rounded-[12px] p-4 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-[#e9f3ff] text-[#2563eb] shrink-0 mt-0.5">
            <IconShield className="size-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#111827]">Conta unificada da plataforma</h3>
            <p className="text-[13px] text-[#596679] mt-0.5 leading-relaxed">
              Os dados cadastrais abaixo são compartilhados entre seu perfil de comprador e vendedor
              na Feira de Carros. Para alteração de CPF ou razão social, consulte o suporte.
            </p>
          </div>
        </div>

        {/* Saved Feedback Alert */}
        {isSavedFeedback && (
          <div className="p-4 rounded-[12px] bg-[#ecfdf5] border border-[#bbf7d0] flex items-center gap-2 text-[13px] text-[#166534]">
            <IconCheck className="size-5 text-[#16a34a] shrink-0" />
            <span>Preferências e dados atualizados com sucesso (simulação).</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Profile Data & Preferences (Figma 1099:1426) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Dados da minha conta */}
            <div className="bg-white border border-[#d6dfea] rounded-[16px] p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-100 text-[#111827]">
                    <IconUser className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-[#111827]">Dados da minha conta</h2>
                    <p className="text-[12px] text-[#64748b]">
                      Informações de identificação do titular
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#ecfdf5] text-[#166534] text-[11px] font-bold border border-[#bbf7d0]">
                  {profile.roleLabel}
                </span>
              </div>

              <div className="divide-y divide-gray-100 text-[13px]">
                {/* Full name */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#64748b] font-medium w-48">Nome completo</span>
                  <span className="font-semibold text-[#111827] flex-1">{profile.fullName}</span>
                  <span className="text-[11px] text-[#94a3b8] italic">
                    Bloqueado para alteração
                  </span>
                </div>

                {/* Email */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#64748b] font-medium w-48">E-mail</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-semibold text-[#111827]">{profile.email}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#166534] font-semibold bg-[#ecfdf5] px-2 py-0.5 rounded">
                      <IconCheck className="size-3" /> Verificado
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[#64748b] font-medium w-48">Telefone celular</span>
                  <div className="flex-1 flex items-center gap-2">
                    {isEditingPhone ? (
                      <input
                        type="text"
                        value={phoneValue}
                        onChange={(e) => setPhoneValue(e.target.value)}
                        className="h-[36px] px-3 rounded-[8px] border border-[#cbd5e1] text-[13px] text-[#111827]"
                      />
                    ) : (
                      <>
                        <span className="font-semibold text-[#111827]">{profile.phone}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#166534] font-semibold bg-[#ecfdf5] px-2 py-0.5 rounded">
                          <IconCheck className="size-3" /> Verificado
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                    className="text-[12px] text-[#c41217] font-semibold hover:underline"
                  >
                    {isEditingPhone ? 'Cancelar' : 'Editar'}
                  </button>
                </div>

                {/* City / State */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#64748b] font-medium w-48">Cidade / UF</span>
                  <span className="font-semibold text-[#111827] flex-1">
                    {profile.city} / {profile.state}
                  </span>
                </div>

                {/* CPF */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[#64748b] font-medium w-48">CPF (mascarado)</span>
                  <span className="font-mono font-semibold text-[#111827] flex-1">
                    {profile.cpfMasked}
                  </span>
                  <span className="text-[11px] text-[#94a3b8] italic">Protegido por LGPD</span>
                </div>
              </div>
            </div>

            {/* Section 2: Preferências de Notificação */}
            <div className="bg-white border border-[#d6dfea] rounded-[16px] p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-[17px] font-bold text-[#111827]">Preferências de Notificação</h3>
              <p className="text-[13px] text-[#596679]">
                Escolha quais canais você deseja receber avisos sobre negociações e veículos.
              </p>

              <div className="divide-y divide-gray-100 pt-1">
                <label className="py-3 flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <span className="text-[13px] font-bold text-[#111827] block">
                      Alertas no WhatsApp sobre mensagens de compradores
                    </span>
                    <span className="text-[12px] text-[#64748b] block mt-0.5">
                      Receba aviso imediato quando um comprador mandar mensagem no chat interno.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.whatsappAlerts}
                    onChange={() => handleToggle('whatsappAlerts')}
                    className="size-5 rounded border-gray-300 text-[#c41217] focus:ring-[#c41217] cursor-pointer"
                  />
                </label>

                <label className="py-3 flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <span className="text-[13px] font-bold text-[#111827] block">
                      Notificações sobre status de anúncio por e-mail
                    </span>
                    <span className="text-[12px] text-[#64748b] block mt-0.5">
                      Avisos de aprovação na moderação, confirmação de pagamento e renovação.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.statusUpdates}
                    onChange={() => handleToggle('statusUpdates')}
                    className="size-5 rounded border-gray-300 text-[#c41217] focus:ring-[#c41217] cursor-pointer"
                  />
                </label>

                <label className="py-3 flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <span className="text-[13px] font-bold text-[#111827] block">
                      Novas mensagens no chat da plataforma
                    </span>
                    <span className="text-[12px] text-[#64748b] block mt-0.5">
                      Sons e notificações visuais na barra superior da plataforma.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newMessages}
                    onChange={() => handleToggle('newMessages')}
                    className="size-5 rounded border-gray-300 text-[#c41217] focus:ring-[#c41217] cursor-pointer"
                  />
                </label>

                <label className="py-3 flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <span className="text-[13px] font-bold text-[#111827] block">
                      E-mails informativos e novidades da Feira de Carros
                    </span>
                    <span className="text-[12px] text-[#64748b] block mt-0.5">
                      Dicas para vender mais rápido e relatórios de mercado automotivo.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailMarketing}
                    onChange={() => handleToggle('emailMarketing')}
                    className="size-5 rounded border-gray-300 text-[#c41217] focus:ring-[#c41217] cursor-pointer"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 h-[44px] rounded-[10px] bg-[#c41217] hover:bg-[#a81014] text-white font-semibold text-[13px] transition-colors cursor-pointer shadow-sm"
                >
                  Salvar preferências (simulação)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Security & Legal Links (Figma 1099:1667) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#111827]">
                <IconLock className="size-5 text-[#c41217]" />
                <h4 className="text-[15px] font-bold">Segurança e Acesso</h4>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                  <span className="text-[13px] font-bold text-[#111827] block">
                    Senha de acesso
                  </span>
                  <p className="text-[12px] text-[#64748b]">
                    Última alteração há 3 meses. Recomendamos senhas fortes.
                  </p>
                  <button
                    type="button"
                    onClick={() => alert('Fluxo de redefinição de senha demonstrativo')}
                    className="text-[12px] text-[#c41217] font-semibold hover:underline pt-1 inline-block"
                  >
                    Alterar senha
                  </button>
                </div>

                <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                  <span className="text-[13px] font-bold text-[#111827] block">
                    Autenticação em dois fatores (2FA)
                  </span>
                  <p className="text-[12px] text-[#64748b]">
                    Proteja sua conta contra acessos indevidos adicionando verificação por código.
                  </p>
                  <span className="text-[11px] text-[#16a34a] font-bold block pt-1">
                    Ativo via SMS/App
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-3">
              <h4 className="text-[15px] font-bold text-[#111827]">Atendimento e Termos</h4>

              <div className="space-y-2 text-[13px]">
                <Link
                  href="/privacidade"
                  className="flex items-center gap-2 p-2.5 rounded-[8px] hover:bg-gray-50 text-[#334155] font-medium"
                >
                  <IconFile className="size-4 text-[#64748b]" />
                  Termos de Uso e Privacidade (LGPD)
                </Link>

                <Link
                  href="/ajuda"
                  className="flex items-center gap-2 p-2.5 rounded-[8px] hover:bg-gray-50 text-[#334155] font-medium"
                >
                  <IconHelpCircle className="size-4 text-[#64748b]" />
                  Central de Ajuda e Suporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
