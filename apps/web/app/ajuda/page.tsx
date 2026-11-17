'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconAlert,
  IconArrowRight,
  IconCard,
  IconCheck,
  IconChevronDown,
  IconFile,
  IconHelpCircle,
  IconInfo,
  IconMail,
  IconMessageSquare,
  IconSearch,
  IconShield,
  IconUser,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import Link from 'next/link';
import { useState } from 'react';

interface FaqItem {
  id: string;
  category: 'anuncios' | 'pagamentos' | 'seguranca' | 'conta';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'anuncios',
    question: 'Como funciona o processo de moderação da Feira de Carros?',
    answer:
      'Todos os anúncios submetidos passam por validação visual e cadastral de fotos, placa, ano, versão e preço antes de serem exibidos na vitrine pública. A aprovação leva em média até 2 horas úteis.',
  },
  {
    id: 'faq-2',
    category: 'anuncios',
    question: 'Qual a diferença entre o Plano Básico e o Plano Estendido?',
    answer:
      'O Plano Básico custa R$ 30,00 e oferece 30 dias de veiculação com até 5 fotos. O Plano Estendido custa R$ 50,00 e oferece 60 dias de veiculação com até 10 fotos. Ambos contam com chat seguro com compradores.',
  },
  {
    id: 'faq-3',
    category: 'anuncios',
    question: 'O que acontece quando marco meu anúncio como vendido?',
    answer:
      'O anúncio é retirado imediatamente da vitrine de buscas públicas e seu destaque é encerrado. As conversas ativas no chat passam para modo somente leitura para preservar o histórico.',
  },
  {
    id: 'faq-4',
    category: 'pagamentos',
    question: 'Como funciona o pagamento via Pix e Cartão de Crédito?',
    answer:
      'O pagamento via Pix gera um QR Code com chave dinâmica processada pelo gateway de pagamento seguro. No cartão de crédito, o valor pode ser parcelado em até 3x sem juros.',
  },
  {
    id: 'faq-5',
    category: 'pagamentos',
    question: 'Como solicitar o cancelamento e reembolso de uma fatura?',
    answer:
      'Acesse o menu Pagamentos, localize a cobrança desejada e clique em Solicitar Reembolso. O pedido será protocolado e auditado manualmente pelo suporte financeiro.',
  },
  {
    id: 'faq-6',
    category: 'seguranca',
    question: 'Meus dados de contato (telefone e e-mail) são públicos?',
    answer:
      'Não. O comprador entra em contato inicialmente pelo chat interno seguro. Seus dados privados permanecem protegidos por padrão conforme as diretrizes da LGPD.',
  },
  {
    id: 'faq-7',
    category: 'seguranca',
    question: 'Como denunciar ou bloquear um comprador suspeito?',
    answer:
      'Dentro da conversa no chat, clique no menu de opções no topo direito e selecione "Ações de Segurança". Você poderá denunciar por motivo de fraude/spam ou bloquear novas mensagens.',
  },
  {
    id: 'faq-8',
    category: 'conta',
    question: 'Como atualizar meu telefone ou dados de notificação?',
    answer:
      'Acesse Configurações da Conta no menu superior do vendedor. Lá você pode editar seu telefone celular verificado e definir se deseja receber alertas pelo WhatsApp ou e-mail.',
  },
];

export default function AjudaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <SellerBreadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Central de Ajuda' }]} />

        {/* Hero Section with Search (Figma 1099:1536) */}
        <div className="bg-white border border-[#d6dfea] rounded-[20px] p-6 sm:p-10 shadow-sm text-center max-w-[900px] mx-auto space-y-4">
          <div className="size-14 rounded-full bg-[#fef2f2] text-[#c41217] flex items-center justify-center mx-auto">
            <IconHelpCircle className="size-8" />
          </div>

          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#111827]">
            Como podemos ajudar você hoje?
          </h1>
          <p className="text-[14px] text-[#596679] max-w-[600px] mx-auto">
            Tire dúvidas sobre criação de anúncios, moderação, pagamentos, planos e negociações na
            plataforma.
          </p>

          <div className="relative max-w-[600px] mx-auto pt-2">
            <IconSearch className="size-5 text-[#94a3b8] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Digite sua dúvida (ex: moderação, fotos, reembolso, pix)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-[48px] rounded-[12px] bg-[#f8fafc] border border-[#cbd5e1] text-[14px] text-[#111827] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c41217]"
            />
          </div>
        </div>

        {/* 4 Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#c41217] text-white shadow-xs'
                : 'bg-white border border-[#cbd5e1] text-[#475569] hover:bg-gray-50'
            }`}
          >
            Todas as dúvidas
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('anuncios')}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'anuncios'
                ? 'bg-[#c41217] text-white shadow-xs'
                : 'bg-white border border-[#cbd5e1] text-[#475569] hover:bg-gray-50'
            }`}
          >
            <IconFile className="size-4" />
            Anúncios e Aprovação
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('pagamentos')}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'pagamentos'
                ? 'bg-[#c41217] text-white shadow-xs'
                : 'bg-white border border-[#cbd5e1] text-[#475569] hover:bg-gray-50'
            }`}
          >
            <IconCard className="size-4" />
            Pagamentos e Reembolsos
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('seguranca')}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'seguranca'
                ? 'bg-[#c41217] text-white shadow-xs'
                : 'bg-white border border-[#cbd5e1] text-[#475569] hover:bg-gray-50'
            }`}
          >
            <IconShield className="size-4" />
            Mensagens e Segurança
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('conta')}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'conta'
                ? 'bg-[#c41217] text-white shadow-xs'
                : 'bg-white border border-[#cbd5e1] text-[#475569] hover:bg-gray-50'
            }`}
          >
            <IconUser className="size-4" />
            Conta e Cadastro
          </button>
        </div>

        {/* FAQ Accordion List & Support Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1200px] mx-auto">
          {/* FAQ Accordions (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white border border-[#d6dfea] rounded-[16px] p-8 text-center text-[#64748b]">
                Nenhum tópico de ajuda encontrado com o termo informado.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-[#d6dfea] rounded-[14px] shadow-xs overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-[15px] text-[#111827] hover:bg-[#f8fafc] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <IconChevronDown
                        className={`size-5 text-[#94a3b8] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#c41217]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-[13px] text-[#475569] leading-relaxed border-t border-gray-100 bg-[#f8fafc]/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Contact Support Sidebar (Figma 1099:1577) (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#d6dfea] rounded-[16px] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#c41217]">
                <IconMail className="size-5" />
                <h3 className="text-[15px] font-bold text-[#111827]">Atendimento Oficial</h3>
              </div>

              <p className="text-[12px] text-[#64748b] leading-relaxed">
                Não encontrou a resposta que precisava? Nossa equipe de suporte está pronta para
                ajudar.
              </p>

              <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1 text-[13px]">
                <span className="text-[#64748b] block text-[11px] font-bold uppercase">
                  E-mail de Suporte
                </span>
                <span className="font-semibold text-[#111827]">suporte@feiradecarros.com.br</span>
              </div>

              <div className="p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0] space-y-1 text-[13px]">
                <span className="text-[#64748b] block text-[11px] font-bold uppercase">
                  Horário de Funcionamento
                </span>
                <span className="font-semibold text-[#111827]">
                  Segunda a Sexta · 08h às 18h (BRT)
                </span>
              </div>

              <Link
                href="/privacidade"
                className="w-full py-2.5 rounded-[8px] border border-[#cbd5e1] text-[12px] font-semibold text-[#334155] hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <IconFile className="size-3.5" />
                Consultar Termos e LGPD
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
