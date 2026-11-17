'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconCheck,
  IconEye,
  IconFile,
  IconHelpCircle,
  IconInfo,
  IconLock,
  IconShield,
  IconUser,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import Link from 'next/link';

export default function LegalPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb
          items={[{ label: 'Início', href: '/' }, { label: 'Informações Legais e Privacidade' }]}
        />

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827]">
              Informações Legais e Privacidade
            </h1>
            <p className="text-[14px] text-[#596679] mt-1">
              Termos de uso da plataforma, diretrizes de privacidade e conformidade com a LGPD.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[12px] font-mono text-[#596679] block">Rota: /privacidade</span>
            <span className="text-[11px] text-[#16a34a] font-semibold">
              WEB-051 • JURÍDICO & LGPD
            </span>
          </div>
        </div>

        {/* Scope Notice Banner (Figma 1099:1657) */}
        <div className="bg-white border border-[#d6dfea] rounded-[12px] p-4 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-[#e9f3ff] text-[#2563eb] shrink-0 mt-0.5">
            <IconShield className="size-5" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#111827]">
              Segurança jurídica e transparência com o usuário
            </h3>
            <p className="text-[13px] text-[#596679] mt-0.5 leading-relaxed">
              Esta página consolida as diretrizes de tratamento de dados pessoais (Lei nº
              13.709/2018 - LGPD) e regras de utilização do marketplace Feira de Carros.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Legal Clauses & Terms (Figma 1099:1666) */}
          <div className="lg:col-span-8 bg-white border border-[#d6dfea] rounded-[16px] p-6 sm:p-8 shadow-sm space-y-8">
            {/* Header section */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gray-100 text-[#111827]">
                  <IconFile className="size-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827]">
                    Diretrizes Legais do Marketplace
                  </h2>
                  <p className="text-[12px] text-[#64748b]">
                    Versão 1.2 — Atualizada para conformidade contínua
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#ecfdf5] text-[#166534] text-[11px] font-bold border border-[#bbf7d0]">
                Publicação jurídica ativa
              </span>
            </div>

            {/* Section 1: Termos de Uso */}
            <section className="space-y-3">
              <h3 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#c41217] text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                Termos de Uso e Intermediação
              </h3>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                A <strong>Feira de Carros</strong> atua como plataforma digital de anúncios e
                aproximação entre compradores, vendedores particulares e concessionárias
                autorizadas. A plataforma não realiza compra própria de veículos nem garante a
                concretização de negociações financeiras diretas entre as partes.
              </p>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                O anunciante declara e garante a veracidade das informações prestadas sobre o
                veículo, incluindo ano, versão, quilometragem, histórico mecânico, titularidade e
                inexistência de ônus ou restrições judiciais não declaradas.
              </p>
            </section>

            {/* Section 2: Privacidade e LGPD */}
            <section className="space-y-3">
              <h3 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#c41217] text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                Privacidade e Proteção de Dados (LGPD)
              </h3>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                Em cumprimento à Lei Geral de Proteção de Dados (Lei nº 13.709/2018), coletamos
                apenas os dados estritamente necessários para viabilizar o cadastro, moderação e
                publicação segura dos anúncios:
              </p>
              <ul className="list-disc list-inside text-[13px] text-[#475569] space-y-1.5 pl-2">
                <li>
                  <strong>Dados cadastrais:</strong> Nome completo, CPF, e-mail, telefone e
                  cidade/UF para autenticação e prevenção de fraudes.
                </li>
                <li>
                  <strong>Dados do veículo:</strong> Placa (final exposto, completa restrita à
                  moderação), chassi e documentação para verificação cadastral.
                </li>
                <li>
                  <strong>Dados de navegação e telemetria:</strong> Registros de acesso (IP, data e
                  hora) em conformidade com o Marco Civil da Internet (Lei nº 12.965/2014).
                </li>
              </ul>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                Não comercializamos dados pessoais de usuários com anunciantes ou empresas
                parceiras.
              </p>
            </section>

            {/* Section 3: Cancelamentos e Reembolsos */}
            <section className="space-y-3">
              <h3 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#c41217] text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                Cancelamentos e Política de Reembolso
              </h3>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                A contratação de planos de publicação (Plano Básico ou Plano Estendido) e pacotes de
                impulsionamento em destaque configura prestação de serviços digitais imediatamente
                disponibilizada no ambiente online após aprovação pela moderação.
              </p>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                Caso o usuário deseje cancelar uma contratação, o pedido deverá ser protocolado pelo
                canal oficial de reembolso na plataforma. As análises levam em conta o tempo de
                veiculação efetivo e as razões informadas.
              </p>
            </section>

            {/* Section 4: Canal do Titular (DPO) */}
            <section className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-[16px] font-bold text-[#111827] flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#c41217] text-white text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                Canal de Atendimento ao Titular de Dados
              </h3>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                Para solicitar acesso aos seus dados pessoais, correção de inconsistências,
                anonimização ou exclusão definitiva da sua conta, entre em contato com nosso
                Encarregado pelo Tratamento de Dados (DPO) através da Central de Ajuda.
              </p>
            </section>
          </div>

          {/* Right Column: Information Security & Quick Links (Figma 1099:1704) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#16a34a]">
                <IconShield className="size-5" />
                <h4 className="text-[15px] font-bold text-[#111827]">Proteção de Informações</h4>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                  <span className="text-[13px] font-bold text-[#111827] block">
                    Criptografia e Segurança
                  </span>
                  <p className="text-[12px] text-[#64748b] leading-tight">
                    Todas as comunicações e pagamentos trafegam com protocolo criptográfico TLS 1.3.
                  </p>
                </div>

                <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                  <span className="text-[13px] font-bold text-[#111827] block">
                    Privacidade no Chat
                  </span>
                  <p className="text-[12px] text-[#64748b] leading-tight">
                    Telefone e e-mail pessoais não são visíveis para outros usuários no chat da
                    plataforma.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Card */}
            <div className="bg-white border border-[#d6dfea] rounded-[14px] p-5 shadow-sm space-y-3">
              <h4 className="text-[15px] font-bold text-[#111827]">Navegação Rápida</h4>

              <div className="space-y-2 text-[13px]">
                <Link
                  href="/ajuda"
                  className="flex items-center gap-2 p-2.5 rounded-[8px] hover:bg-gray-50 text-[#334155] font-medium"
                >
                  <IconHelpCircle className="size-4 text-[#64748b]" />
                  Central de Ajuda e FAQ
                </Link>

                <Link
                  href="/conta/configuracoes"
                  className="flex items-center gap-2 p-2.5 rounded-[8px] hover:bg-gray-50 text-[#334155] font-medium"
                >
                  <IconUser className="size-4 text-[#64748b]" />
                  Configurações da Minha Conta
                </Link>

                <Link
                  href="/vendedor/anuncios"
                  className="flex items-center gap-2 p-2.5 rounded-[8px] hover:bg-gray-50 text-[#c41217] font-semibold"
                >
                  Voltar para Meus Anúncios →
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
