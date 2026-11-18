'use client';

import { MarketplaceFooter } from '@/app/components/MarketplaceFooter';
import { MarketplaceHeader } from '@/app/components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconInfo,
  IconMail,
  IconPhone,
  IconPin,
  IconShield,
  IconUser,
} from '@/app/components/SellerIcons';
import { DealershipHelperModal } from '@/app/components/dealership/DealershipHelperModal';
import { DealershipStatusActionModal } from '@/app/components/dealership/DealershipStatusActionModal';
import { DealershipSubNav } from '@/app/components/dealership/DealershipSubNav';
import type { AccountStatus } from '@/lib/adapters/shared-auth-registry';
import { useDealerStore } from '@/stores/use-dealer-store';
import Link from 'next/link';
import React, { useState } from 'react';

export default function DealershipStatusPage() {
  const { application, simulateStatus } = useDealerStore();

  const [isStatusActionModalOpen, setIsStatusActionModalOpen] = useState(false);
  const [isHelperModalOpen, setIsHelperModalOpen] = useState(false);

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case 'active':
        return {
          label: 'Aprovado · Ativo',
          bg: 'bg-[#ecfdf5]',
          border: 'border-[#a7f3d0]',
          text: 'text-[#065f46]',
        };
      case 'correction_required':
        return {
          label: 'Correção necessária',
          bg: 'bg-[#fff7ed]',
          border: 'border-[#fed7aa]',
          text: 'text-[#9a3412]',
        };
      case 'suspended':
        return {
          label: 'Conta suspensa',
          bg: 'bg-[#fef2f2]',
          border: 'border-[#fecaca]',
          text: 'text-[#991b1b]',
        };
      case 'rejected':
        return {
          label: 'Não aprovado',
          bg: 'bg-[#f8fafc]',
          border: 'border-[#e2e8f0]',
          text: 'text-[#475569]',
        };
      default:
        return {
          label: 'Em análise manual',
          bg: 'bg-[#fffbeb]',
          border: 'border-[#fde68a]',
          text: 'text-[#92400e]',
        };
    }
  };

  const badge = getStatusBadge(application.status);

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-sans text-[#17243f]">
      <MarketplaceHeader />
      <DealershipSubNav activeItem="concessionarias" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[70px] py-6 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#697a95] mb-4">
          <Link href="/" className="hover:text-[#17243f] transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link
            href="/concessionaria/solicitacao"
            className="hover:text-[#17243f] transition-colors"
          >
            Cadastro de anunciante
          </Link>
          <span>›</span>
          <span className="font-semibold text-[#17243f]">Status da solicitação</span>
        </div>

        {/* Header Heading & Protocol */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] sm:text-[33px] font-semibold text-[#17243f] leading-tight">
                Acompanhamento da solicitação
              </h1>
              <span
                className={`text-[12px] font-semibold px-3 py-1 rounded-full border ${badge.bg} ${badge.border} ${badge.text}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-[13px] sm:text-[14px] text-[#697a95] mt-1 font-mono">
              Protocolo: <strong className="text-[#17243f]">{application.protocol}</strong> ·
              Enviado em: {application.submittedAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsStatusActionModalOpen(true)}
              className="text-[12px] font-semibold text-[#17243f] bg-white border border-[#dee6f1] hover:bg-[#f8fafc] px-3.5 py-2 rounded-[8px] transition-colors"
            >
              Ações do anúncio
            </button>
            <button
              type="button"
              onClick={() => setIsHelperModalOpen(true)}
              className="text-[12px] font-medium text-[#215c9d] bg-[#e8f1ff] hover:bg-[#d9e8ff] px-3.5 py-2 rounded-[8px] flex items-center gap-1.5 transition-colors"
            >
              <IconInfo className="size-3.5" />
              <span>Ajuda</span>
            </button>
          </div>
        </div>

        {/* QA State Switcher Strip (Testing & Homologation) */}
        <div className="bg-[#f0f4f8] border border-[#d8e2ee] rounded-[10px] p-3 mb-6 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="font-bold text-[#1e293b] uppercase tracking-wider mr-2">
            Simular Estado (Homologação QA):
          </span>
          <button
            type="button"
            onClick={() => simulateStatus('pending_approval')}
            className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
              application.status === 'pending_approval'
                ? 'bg-[#92400e] text-white'
                : 'bg-white hover:bg-[#e2e8f0] text-[#1e293b]'
            }`}
          >
            Pendente
          </button>
          <button
            type="button"
            onClick={() => simulateStatus('correction_required')}
            className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
              application.status === 'correction_required'
                ? 'bg-[#9a3412] text-white'
                : 'bg-white hover:bg-[#e2e8f0] text-[#1e293b]'
            }`}
          >
            Correção Necessária
          </button>
          <button
            type="button"
            onClick={() => simulateStatus('active')}
            className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
              application.status === 'active'
                ? 'bg-[#065f46] text-white'
                : 'bg-white hover:bg-[#e2e8f0] text-[#1e293b]'
            }`}
          >
            Aprovado (Ativo)
          </button>
          <button
            type="button"
            onClick={() => simulateStatus('suspended')}
            className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors ${
              application.status === 'suspended'
                ? 'bg-[#991b1b] text-white'
                : 'bg-white hover:bg-[#e2e8f0] text-[#1e293b]'
            }`}
          >
            Suspenso
          </button>
        </div>

        {/* Conditional Status Banners */}
        {application.status === 'correction_required' && (
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-[12px] p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <IconAlert className="size-5 text-[#ea580c] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#9a3412] text-[15px]">
                  Correção solicitada pela moderação
                </h3>
                <p className="text-[13px] text-[#7c2d12] mt-0.5 leading-relaxed">
                  {application.rejectionReason ||
                    'Razão social divergente do cartão CNPJ da Receita Federal e comprovante de endereço desatualizado.'}
                </p>
              </div>
            </div>
            <Link
              href="/concessionaria/solicitacao/corrigir"
              className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-[13px] rounded-[8px] shrink-0 flex items-center gap-2 transition-colors"
            >
              <span>Corrigir dados</span>
              <IconArrowRight className="size-4" />
            </Link>
          </div>
        )}

        {application.status === 'active' && (
          <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-[12px] p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <IconCheck className="size-5 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#065f46] text-[15px]">
                  Cadastro de concessionária aprovado!
                </h3>
                <p className="text-[13px] text-[#047857] mt-0.5 leading-relaxed">
                  Sua empresa está autorizada a cadastrar e gerenciar anúncios de veículos no
                  marketplace.
                </p>
              </div>
            </div>
            <Link
              href="/concessionaria/anuncios"
              className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-[13px] rounded-[8px] shrink-0 flex items-center gap-2 transition-colors"
            >
              <span>Ver meu estoque</span>
              <IconArrowRight className="size-4" />
            </Link>
          </div>
        )}

        {application.status === 'suspended' && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-[12px] p-5 mb-6 flex items-start gap-3">
            <IconAlert className="size-5 text-[#dc2626] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#991b1b] text-[15px]">
                Conta temporariamente suspensa
              </h3>
              <p className="text-[13px] text-[#b91c1c] mt-0.5 leading-relaxed">
                Esta conta encontra-se suspensa para análise de conformidade cadastral e comercial.
                Entre em contato com o suporte institucional para esclarecimentos.
              </p>
            </div>
          </div>
        )}

        {/* Two-Column Grid: Timeline & Summary (Left) & Support Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Application Process Timeline & Submitted Data Summary */}
          <div className="lg:col-span-8 space-y-6">
            {/* Review Progress Tracker */}
            <div className="bg-white border border-[#dee6f1] rounded-[13px] p-6 shadow-xs">
              <h2 className="font-semibold text-[#17243f] text-[18px] mb-4">
                Etapas do processo de aprovação
              </h2>

              <div className="space-y-6">
                {/* Step 1: Recebimento */}
                <div className="flex items-start gap-4">
                  <div className="size-[32px] rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#17243f] text-[14px]">
                      Solicitação recebida
                    </h4>
                    <p className="text-[12px] text-[#697a95] mt-0.5">
                      Os dados da concessionária e do responsável foram gravados com sucesso.
                    </p>
                    <span className="text-[11px] text-[#059669] font-medium mt-1 inline-block">
                      Concluído em {application.submittedAt}
                    </span>
                  </div>
                </div>

                {/* Step 2: Análise manual */}
                <div className="flex items-start gap-4">
                  <div
                    className={`size-[32px] rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${
                      application.status === 'active'
                        ? 'bg-[#059669] text-white'
                        : application.status === 'correction_required'
                          ? 'bg-[#ea580c] text-white'
                          : 'bg-[#f59e0b] text-white animate-pulse'
                    }`}
                  >
                    {application.status === 'active' ? '✓' : '2'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#17243f] text-[14px]">
                      Validação fiscal do CNPJ e dados
                    </h4>
                    <p className="text-[12px] text-[#697a95] mt-0.5">
                      Verificação cadastral junto à Receita Federal e validação dos dados de
                      contato.
                    </p>
                    <span
                      className={`text-[11px] font-medium mt-1 inline-block ${
                        application.status === 'active'
                          ? 'text-[#059669]'
                          : application.status === 'correction_required'
                            ? 'text-[#ea580c]'
                            : 'text-[#d97706]'
                      }`}
                    >
                      {application.status === 'active'
                        ? 'Validado com sucesso'
                        : application.status === 'correction_required'
                          ? 'Aguardando correção pelo anunciante'
                          : 'Em análise manual pela moderação'}
                    </span>
                  </div>
                </div>

                {/* Step 3: Habilitação */}
                <div className="flex items-start gap-4">
                  <div
                    className={`size-[32px] rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${
                      application.status === 'active'
                        ? 'bg-[#059669] text-white'
                        : 'bg-[#eff4f9] text-[#697a95]'
                    }`}
                  >
                    {application.status === 'active' ? '✓' : '3'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#17243f] text-[14px]">
                      Habilitação do portal e anúncios
                    </h4>
                    <p className="text-[12px] text-[#697a95] mt-0.5">
                      Acesso liberado ao painel de estoque, métricas e publicação de veículos.
                    </p>
                    <span
                      className={`text-[11px] font-medium mt-1 inline-block ${
                        application.status === 'active' ? 'text-[#059669]' : 'text-[#697a95]'
                      }`}
                    >
                      {application.status === 'active' ? 'Conta liberada' : 'Pendente de aprovação'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Application Data Summary */}
            <div className="bg-white border border-[#dee6f1] rounded-[13px] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#17243f] text-[18px]">
                  Dados cadastrais informados
                </h2>
                {application.status === 'correction_required' && (
                  <Link
                    href="/concessionaria/solicitacao/corrigir"
                    className="text-[12px] font-semibold text-[#b91c1c] hover:underline"
                  >
                    Editar dados
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13px]">
                <div className="p-3 bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0]">
                  <div className="flex items-center gap-2 text-[#697a95] text-[11px] font-semibold uppercase mb-1">
                    <IconUser className="size-3.5" />
                    <span>Responsável</span>
                  </div>
                  <p className="font-medium text-[#17243f]">{application.fullName}</p>
                  <p className="text-[12px] text-[#697a95] mt-0.5">{application.email}</p>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0]">
                  <div className="flex items-center gap-2 text-[#697a95] text-[11px] font-semibold uppercase mb-1">
                    <IconBuilding className="size-3.5" />
                    <span>Concessionária</span>
                  </div>
                  <p className="font-medium text-[#17243f]">{application.dealershipName}</p>
                  <p className="text-[12px] text-[#697a95] mt-0.5">
                    CNPJ: {application.cnpjMasked}
                  </p>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0]">
                  <div className="flex items-center gap-2 text-[#697a95] text-[11px] font-semibold uppercase mb-1">
                    <IconPhone className="size-3.5" />
                    <span>Contato Anúncios</span>
                  </div>
                  <p className="font-medium text-[#17243f]">{application.phone}</p>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-[8px] border border-[#e2e8f0]">
                  <div className="flex items-center gap-2 text-[#697a95] text-[11px] font-semibold uppercase mb-1">
                    <IconPin className="size-3.5" />
                    <span>Localização da Loja</span>
                  </div>
                  <p className="font-medium text-[#17243f]">{application.address}</p>
                  <p className="text-[12px] text-[#697a95] mt-0.5">
                    {application.city} - {application.state}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#eff6ff] rounded-[8px] flex items-center gap-2.5 text-[#1e40af] text-[11px]">
                <IconShield className="size-4 shrink-0 text-[#2563eb]" />
                <span>
                  Por motivos de privacidade e conformidade (SEC-003), o CNPJ completo é de uso
                  interno restrito e não é exibido no perfil público da loja.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Institutional Support & Timeline Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#dee6f1] rounded-[13px] p-6 shadow-xs">
              <h3 className="font-semibold text-[#17243f] text-[18px] mb-3">
                Atendimento ao Anunciante
              </h3>
              <p className="text-[12px] text-[#697a95] leading-relaxed mb-4">
                Dúvidas sobre o prazo de aprovação ou documentação exigida? Nossa equipe comercial e
                de suporte está à disposição.
              </p>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center gap-2.5 text-[#17243f]">
                  <IconMail className="size-4 text-[#b91c1c]" />
                  <span>anuncios@feiradecarros.com.br</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#17243f]">
                  <IconPhone className="size-4 text-[#b91c1c]" />
                  <span>(31) 3822-0000 · Seg a Sex, 8h às 18h</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#dee6f1]">
                <Link
                  href="/ajuda"
                  className="text-[12px] font-semibold text-[#215c9d] hover:underline"
                >
                  Central de Ajuda da Feira de Carros ›
                </Link>
              </div>
            </div>

            <div className="bg-[#fff0f0] border border-[#fecaca] rounded-[13px] p-5">
              <h4 className="font-semibold text-[#b91c1c] text-[13px] mb-1">
                Aviso de Análise Manual
              </h4>
              <p className="text-[11px] text-[#7f1d1d] leading-relaxed">
                Todas as solicitações de concessionárias passam por triagem individual para garantir
                a procedência e segurança do marketplace. O prazo médio de retorno é de até 1 dia
                útil.
              </p>
            </div>
          </div>
        </div>
      </main>

      <MarketplaceFooter />

      {/* Action modal matching Figma 1629:3592 */}
      <DealershipStatusActionModal
        isOpen={isStatusActionModalOpen}
        onClose={() => setIsStatusActionModalOpen(false)}
      />

      {/* Helper Guidance Modal matching Figma 1629:3604 */}
      <DealershipHelperModal
        isOpen={isHelperModalOpen}
        onClose={() => setIsHelperModalOpen(false)}
      />
    </div>
  );
}
