'use client';

import {
  MOCK_SELLER_APPLICATION,
  MOCK_SELLER_APPLICATION_CORRECTION,
} from '@/lib/adapters/mock-seller-data';
import type { ApplicationStatus } from '@/lib/types/seller-presentation';
import Link from 'next/link';
import { useState } from 'react';
import { SellerBreadcrumb } from '../../../components/SellerBreadcrumb';
import {
  IconCalendar,
  IconCard,
  IconCheck,
  IconClock,
  IconEdit,
  IconFile,
  IconInfo,
  IconPin,
  IconUser,
} from '../../../components/SellerIcons';
import { SellerMobileBottomNav } from '../../../components/SellerMobileBottomNav';
import { SellerNavbar } from '../../../components/SellerNavbar';
import { SellerStepProgress } from '../../../components/SellerStepProgress';

export default function SellerApplicationStatusPage() {
  const isDevOrQA = process.env.NODE_ENV !== 'production';
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('PENDING_REVIEW');

  // In production, the application status is strictly backend-authoritative.
  // Developer simulation is isolated to development/test environments and never confers backend permissions.
  const effectiveStatus = isDevOrQA ? selectedStatus : MOCK_SELLER_APPLICATION.status;

  const application =
    effectiveStatus === 'CORRECTION_REQUESTED'
      ? MOCK_SELLER_APPLICATION_CORRECTION
      : MOCK_SELLER_APPLICATION;

  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col font-sans text-[#111827]">
      {/* Navbar */}
      <SellerNavbar variant="applicant" activeTab="cadastro" />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-16">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meu cadastro', href: '/vendedor/solicitacao/status' },
            { label: 'Acompanhamento da solicitação', active: true },
          ]}
          mobileShortLabel="Meu cadastro › Revisão"
        />

        {/* Heading */}
        <div className="mt-2 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-semibold text-[#111827] tracking-tight">
              Acompanhamento da solicitação
            </h1>
            <p className="text-sm sm:text-base text-[#5b6475] mt-1">
              Acompanhe o status da sua solicitação de vendedor e veja a próxima etapa.
            </p>
            <p className="text-xs font-semibold text-[#c21c24] mt-1 md:hidden">
              WEB-018 · Etapa 2 de 3
            </p>
          </div>

          {/* Interactive State Simulator Pill (Restricted to Dev & QA Environments) */}
          {isDevOrQA && (
            <div className="bg-white border border-[#dbe1e8] p-1.5 rounded-lg flex items-center gap-1.5 self-start shadow-xs text-xs">
              <span className="text-[#5b6475] font-medium px-2 hidden sm:inline">
                Simular Estado (QA):
              </span>
              <button
                type="button"
                onClick={() => setSelectedStatus('PENDING_REVIEW')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  effectiveStatus === 'PENDING_REVIEW'
                    ? 'bg-[#ba660a] text-white shadow-xs'
                    : 'text-[#5b6475] hover:bg-gray-100'
                }`}
              >
                Em análise
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('CORRECTION_REQUESTED')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  effectiveStatus === 'CORRECTION_REQUESTED'
                    ? 'bg-[#b91c1c] text-white shadow-xs'
                    : 'text-[#5b6475] hover:bg-gray-100'
                }`}
              >
                Correção solicitada
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('APPROVED')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  effectiveStatus === 'APPROVED'
                    ? 'bg-[#159055] text-white shadow-xs'
                    : 'text-[#5b6475] hover:bg-gray-100'
                }`}
              >
                Aprovado
              </button>
            </div>
          )}
        </div>

        {/* Step Progress & Timeline */}
        <SellerStepProgress
          currentStep={effectiveStatus === 'CORRECTION_REQUESTED' ? 3 : 2}
          showStepperLine
          stepStatus={effectiveStatus}
        />

        {/* 2-Column Content Layout (930px left + 406px right on 1440px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          {/* Left Column: Detail Card & Alert Banner (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-[#dbe1e8] rounded-[12px] p-6 sm:p-8 shadow-sm">
            {/* Status Alert Banner */}
            {effectiveStatus === 'PENDING_REVIEW' && (
              <div className="bg-[#fff2da] border border-[#f5d99d] rounded-[10px] p-5 sm:p-6 flex items-start gap-4 mb-8">
                <div className="size-[35px] text-[#ba660a] shrink-0 mt-0.5">
                  <IconClock className="size-full" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-[21px] font-semibold text-[#111827]">
                    Em análise
                  </h2>
                  <p className="text-xs sm:text-[15px] text-[#5b6475] mt-1 leading-relaxed">
                    Sua solicitação está em análise pela nossa equipe. Assim que tivermos um
                    resultado, você será notificado por e-mail e na plataforma.
                  </p>
                </div>
              </div>
            )}

            {effectiveStatus === 'CORRECTION_REQUESTED' && (
              <div className="bg-[#fff2da] border border-[#f2d799] rounded-[10px] p-5 sm:p-6 flex items-start gap-4 mb-8">
                <div className="size-[35px] text-[#b91c1c] shrink-0 mt-0.5">
                  <IconEdit className="size-full" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-[21px] font-semibold text-[#b91c1c]">
                    Correção solicitada
                  </h2>
                  <p className="text-xs sm:text-[15px] text-[#5b6475] mt-1 leading-relaxed">
                    Nossa equipe revisou seu cadastro e solicitou o ajuste de alguns dados para
                    aprovação:{' '}
                    <strong className="text-[#111827]">{application.correctionReason}</strong>
                  </p>
                </div>
              </div>
            )}

            {effectiveStatus === 'APPROVED' && (
              <div className="bg-[#e8f8ef] border border-[#b2e5c8] rounded-[10px] p-5 sm:p-6 flex items-start gap-4 mb-8">
                <div className="size-[35px] text-[#159055] shrink-0 mt-0.5">
                  <IconCheck className="size-full" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-[21px] font-semibold text-[#159055]">
                    Cadastro Aprovado!
                  </h2>
                  <p className="text-xs sm:text-[15px] text-[#5b6475] mt-1 leading-relaxed">
                    Parabéns! Sua solicitação de vendedor foi aprovada com sucesso. Você já tem
                    acesso completo ao painel de anúncios e pode começar a publicar seus veículos.
                  </p>
                </div>
              </div>
            )}

            {/* Application Data Details */}
            <h3 className="text-xl sm:text-[24px] font-semibold text-[#111827] mb-4">
              Detalhes da solicitação
            </h3>

            <div className="bg-white border border-[#dbe1e8] rounded-[9px] p-4 sm:p-5 divide-y divide-[#dbe1e8]">
              {/* Protocolo */}
              <div className="flex flex-col sm:flex-row sm:items-center py-3 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconFile className="size-5 text-[#5b6475]" />
                  <span className="text-sm text-[#5b6475]">Protocolo</span>
                </div>
                <div className="text-base font-semibold text-[#111827]">{application.protocol}</div>
              </div>

              {/* Data da solicitação */}
              <div className="flex flex-col sm:flex-row sm:items-center py-3 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconCalendar className="size-5 text-[#5b6475]" />
                  <span className="text-sm text-[#5b6475]">Data da solicitação</span>
                </div>
                <div className="text-base font-semibold text-[#111827]">
                  {application.submittedAtFormatted}
                </div>
              </div>

              {/* Solicitante */}
              <div className="flex flex-col sm:flex-row sm:items-center py-3 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconUser className="size-5 text-[#5b6475]" />
                  <span className="text-sm text-[#5b6475]">Solicitante</span>
                </div>
                <div className="text-base font-semibold text-[#111827]">
                  {application.applicant.fullName}
                </div>
              </div>

              {/* Tipo de cadastro */}
              <div className="flex flex-col sm:flex-row sm:items-center py-3 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconCard className="size-5 text-[#5b6475]" />
                  <span className="text-sm text-[#5b6475]">Tipo de cadastro</span>
                </div>
                <div className="text-base font-semibold text-[#111827]">
                  {application.applicant.registrationType}
                </div>
              </div>

              {/* Cidade / UF */}
              <div className="flex flex-col sm:flex-row sm:items-center py-3 gap-2 sm:gap-6">
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <IconPin className="size-5 text-[#5b6475]" />
                  <span className="text-sm text-[#5b6475]">Cidade / UF</span>
                </div>
                <div className="text-base font-semibold text-[#111827]">
                  {application.applicant.city}, {application.applicant.state}
                </div>
              </div>
            </div>

            {/* Contextual Action Button */}
            {effectiveStatus === 'CORRECTION_REQUESTED' && (
              <Link
                href="/vendedor/solicitacao/corrigir"
                className="mt-6 w-full border border-[#b91c1c] text-[#b91c1c] hover:bg-red-50 font-semibold h-[56px] rounded-[7px] flex items-center justify-center gap-3 transition-colors text-[16px] shadow-xs"
              >
                <IconEdit className="size-5" />
                <span>Ver solicitação de correção</span>
              </Link>
            )}

            {effectiveStatus === 'APPROVED' && (
              <Link
                href="/vendedor/anuncios"
                className="mt-6 w-full bg-[#159055] hover:bg-[#127a48] text-white font-semibold h-[56px] rounded-[7px] flex items-center justify-center gap-3 transition-colors text-[16px] shadow-xs"
              >
                <IconCheck className="size-5" />
                <span>Ir para Meus Anúncios</span>
              </Link>
            )}

            {effectiveStatus === 'PENDING_REVIEW' && (
              <Link
                href="/vendedor/solicitacao/corrigir"
                className="mt-6 w-full border border-[#b91c1c] text-[#b91c1c] hover:bg-red-50 font-semibold h-[56px] rounded-[7px] flex items-center justify-center gap-3 transition-colors text-[16px]"
              >
                <IconEdit className="size-5" />
                <span>Ver solicitação de correção</span>
              </Link>
            )}
          </div>

          {/* Right Column: Etapas e próximos passos (lg:col-span-4, matching 2678:2232) */}
          <div className="lg:col-span-4 bg-white border border-[#dbe1e8] rounded-[12px] p-6 sm:p-7 shadow-sm">
            <h3 className="text-lg sm:text-[23px] font-semibold text-[#111827] mb-6">
              Etapas e próximos passos
            </h3>

            <div className="space-y-8 relative">
              {/* Vertical connector line */}
              <div className="absolute left-[17px] top-[24px] bottom-[24px] w-[2px] bg-[#dbe1e8]" />

              {/* Step 1 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="size-9 rounded-full bg-[#159055] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <IconCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-[17px] font-semibold text-[#111827]">
                    Solicitação concluída
                  </h4>
                  <p className="text-xs sm:text-[15px] text-[#5b6475] mt-1 leading-relaxed">
                    Seus dados foram enviados com sucesso.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative z-10">
                <div
                  className={`size-9 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                    effectiveStatus === 'PENDING_REVIEW'
                      ? 'bg-[#ba660a] text-white'
                      : effectiveStatus === 'APPROVED'
                        ? 'bg-[#159055] text-white'
                        : 'bg-[#b91c1c] text-white'
                  }`}
                >
                  <IconClock className="size-5" />
                </div>
                <div>
                  <h4
                    className={`text-base sm:text-[17px] font-semibold ${
                      effectiveStatus === 'PENDING_REVIEW' ? 'text-[#ba660a]' : 'text-[#111827]'
                    }`}
                  >
                    Revisão em andamento
                  </h4>
                  <p className="text-xs sm:text-[15px] text-[#5b6475] mt-1 leading-relaxed">
                    Nossa equipe está analisando suas informações.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative z-10">
                <div
                  className={`size-9 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                    effectiveStatus === 'APPROVED'
                      ? 'bg-[#159055] text-white'
                      : effectiveStatus === 'CORRECTION_REQUESTED'
                        ? 'bg-[#b91c1c] text-white'
                        : 'bg-[#f4f7fa] border border-[#dbe1e8] text-[#5b6475]'
                  }`}
                >
                  <IconInfo className="size-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-[17px] font-semibold text-[#111827]">
                    Resultado pendente
                  </h4>
                  <p className="text-xs sm:text-[15px] text-[#5b6475] mt-1 leading-relaxed">
                    Você será informado da aprovação ou sobre eventuais correções necessárias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <SellerMobileBottomNav activeTab="cadastro" userRole="applicant" />
    </div>
  );
}
