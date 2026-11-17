'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type BuyerChatMessage,
  type BuyerConversation,
  type SafetyReportInput,
  clearAllConversations,
  getBuyerConversationById,
  getBuyerConversations,
  markConversationAsRead,
  reportAndBlockConversation,
  resetDemoConversations,
  sendBuyerMessage,
} from '../../lib/adapters/buyer-messages-adapter';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { ReportConversationModal } from '../components/ReportConversationModal';
import {
  IconAlert,
  IconArrowLeft,
  IconBan,
  IconBuilding,
  IconCar,
  IconCheck,
  IconClock,
  IconExternalLink,
  IconFlag,
  IconLock,
  IconMessageSquare,
  IconMoreHorizontal,
  IconSend,
  IconShield,
  IconUser,
} from '../components/SellerIcons';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams?.get('id') || '';

  const { isAuthenticated, buyerProfile, loginSimulation, setAuthenticated } = useBuyerStore();

  const handleSimulateLogin = () => {
    loginSimulation();
    if (typeof document !== 'undefined') {
      document.cookie = 'fdc_web_session=mock-buyer-session; path=/; max-age=86400';
    }
  };

  const [conversations, setConversations] = useState<BuyerConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>(initialConvId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [inputMessage, setInputMessage] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check cookie session on mount to synchronize with authenticated SSR cookies
  useEffect(() => {
    if (typeof document !== 'undefined' && document.cookie.includes('fdc_web_session=')) {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  // Load conversations
  const refreshConversations = useCallback(() => {
    const list = getBuyerConversations();
    setConversations(list);
    return list;
  }, []);

  useEffect(() => {
    const list = refreshConversations();
    if (initialConvId) {
      setSelectedConvId(initialConvId);
      markConversationAsRead(initialConvId);
    } else if (list.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      // On desktop, auto-select first conversation
      setSelectedConvId(list[0].id);
      markConversationAsRead(list[0].id);
    }
  }, [initialConvId, refreshConversations]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConvId);
  }, [conversations, selectedConvId]);

  const activeMessagesCount = activeConversation?.messages.length ?? 0;

  // Scroll to bottom when active conversation changes or new message added
  useEffect(() => {
    if (activeMessagesCount > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessagesCount]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    let list = conversations;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.sellerName.toLowerCase().includes(q) ||
          c.vehicleTitle.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q) ||
          c.messages.some((m) => m.text.toLowerCase().includes(q)),
      );
    }
    if (filterTab === 'unread') {
      list = list.filter((c) => c.unreadCount > 0);
    }
    return list;
  }, [conversations, searchQuery, filterTab]);

  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    markConversationAsRead(id);
    refreshConversations();
    setIsOptionsOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    try {
      sendBuyerMessage(activeConversation.id, inputMessage, buyerProfile.fullName);
      setInputMessage('');
      refreshConversations();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Não foi possível enviar a mensagem.';
      setFeedbackToast(errorMsg);
      setTimeout(() => setFeedbackToast(null), 3500);
    }
  };

  const handleReportSubmit = (report: SafetyReportInput) => {
    reportAndBlockConversation(report);
    refreshConversations();
    setFeedbackToast('Denúncia recebida. Obrigado por colaborar com a segurança.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // 1. UNAUTHENTICATED STATE (Figma 1168:488 Desktop / 1168:527 Mobile)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-between">
        <MarketplaceHeader />

        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
          {/* Breadcrumb */}
          <nav aria-label="Navegação estrutural" className="mb-4">
            <ol className="flex items-center gap-1.5 text-[12px] text-[#62718a]">
              <li>
                <Link href="/" className="hover:text-[#14223b] transition-colors">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li className="font-semibold text-[#14223b]">Mensagens</li>
            </ol>
          </nav>

          <div className="max-w-xl mx-auto my-12 bg-white rounded-[16px] border border-[#e0e6f0] p-8 sm:p-10 shadow-sm text-center">
            <div className="size-16 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center mx-auto mb-5">
              <IconLock className="size-8 text-[#b91c1c]" />
            </div>

            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#14223b] leading-tight">
              Acesse sua conta para ver suas mensagens
            </h1>

            <p className="text-[14px] text-[#62718a] mt-3 leading-relaxed max-w-md mx-auto">
              Para conversar com anunciantes em tempo real, agendar visitas com segurança e manter
              seu histórico protegido, entre na sua conta Feira de Carros.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/entrar?redirect=/mensagens"
                className="w-full sm:w-auto px-6 h-[46px] bg-[#e0151f] hover:bg-[#b91c1c] text-white font-bold text-[14px] rounded-[8px] flex items-center justify-center transition-colors shadow-xs"
              >
                Entrar na minha conta
              </Link>
              <Link
                href="/entrar?tab=register&redirect=/mensagens"
                className="w-full sm:w-auto px-6 h-[46px] bg-white hover:bg-slate-50 text-[#14223b] font-semibold text-[14px] rounded-[8px] border border-[#e0e6f0] flex items-center justify-center transition-colors"
              >
                Criar conta gratuita
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-[#e2e7ee] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <IconShield className="size-5 text-[#059669] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#48566a] leading-snug">
                  <strong>Negociação Segura:</strong> Seus dados pessoais e telefone permanecem sob
                  seu controle.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <IconClock className="size-5 text-[#1463c7] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#48566a] leading-snug">
                  <strong>Histórico Salvo:</strong> Acompanhe todas as respostas e propostas
                  enviadas em um só lugar.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <IconCar className="size-5 text-[#b91c1c] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#48566a] leading-snug">
                  <strong>Vínculo do Anúncio:</strong> Informações completas do carro visíveis ao
                  lado da conversa.
                </p>
              </div>
            </div>

            {/* Dev / QA Testing helper */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-8 p-3 rounded-[8px] bg-slate-50 border border-dashed border-slate-300 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    [DEMO SIMULATOR] Teste rápido de comprador autenticado:
                  </span>
                  <button
                    type="button"
                    onClick={handleSimulateLogin}
                    className="text-[11px] font-bold text-[#b91c1c] underline cursor-pointer"
                  >
                    Simular Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <MarketplaceFooter />
      </div>
    );
  }

  // 2. EMPTY INBOX STATE (Figma 1168:557 Desktop / 1168:590 Mobile)
  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-between">
        <MarketplaceHeader />

        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
          <nav aria-label="Navegação estrutural" className="mb-4">
            <ol className="flex items-center gap-1.5 text-[12px] text-[#62718a]">
              <li>
                <Link href="/" className="hover:text-[#14223b] transition-colors">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li className="font-semibold text-[#14223b]">Mensagens</li>
            </ol>
          </nav>

          <div className="max-w-xl mx-auto my-12 bg-white rounded-[16px] border border-[#e0e6f0] p-8 sm:p-10 shadow-sm text-center">
            <div className="size-16 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center mx-auto mb-5">
              <IconMessageSquare className="size-8 text-[#62718a]" />
            </div>

            <h1 className="text-[24px] font-bold text-[#14223b]">Nenhuma mensagem encontrada</h1>

            <p className="text-[14px] text-[#62718a] mt-3 leading-relaxed max-w-md mx-auto">
              Você ainda não iniciou conversas com nenhum anunciante. Encontre veículos de seu
              interesse e clique em <strong>Enviar Mensagem</strong> para tirar dúvidas diretamente
              com o vendedor.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/veiculos"
                className="w-full sm:w-auto px-6 h-[46px] bg-[#e0151f] hover:bg-[#b91c1c] text-white font-bold text-[14px] rounded-[8px] flex items-center justify-center transition-colors shadow-xs"
              >
                Buscar veículos no marketplace
              </Link>
              <button
                type="button"
                onClick={() => {
                  resetDemoConversations();
                  refreshConversations();
                }}
                className="w-full sm:w-auto px-5 h-[46px] bg-white hover:bg-slate-50 text-[#62718a] hover:text-[#14223b] font-medium text-[13px] rounded-[8px] border border-[#e0e6f0] transition-colors"
              >
                Restaurar conversas de demonstração
              </button>
            </div>
          </div>
        </main>

        <MarketplaceFooter />
      </div>
    );
  }

  // 3. ACTIVE INBOX WITH THREADS (Figma 1168:202, 1168:310, 1168:693, 1168:790)
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Breadcrumb & Header Title */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <nav aria-label="Navegação estrutural" className="mb-1">
              <ol className="flex items-center gap-1.5 text-[11px] text-[#62718a]">
                <li>
                  <Link href="/" className="hover:text-[#14223b] transition-colors">
                    Início
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link href="/conta" className="hover:text-[#14223b] transition-colors">
                    Minha conta
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li className="font-semibold text-[#14223b]">Mensagens</li>
              </ol>
            </nav>
            <h1 className="text-[24px] font-bold text-[#14223b]">Minhas Mensagens</h1>
          </div>

          {/* Dev reset buttons */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetDemoConversations();
                  const list = refreshConversations();
                  if (list.length > 0) setSelectedConvId(list[0].id);
                  showToast('Conversas de demonstração restauradas.');
                }}
                className="text-[11px] font-medium text-[#1463c7] hover:underline"
              >
                Reset Demo
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => {
                  clearAllConversations();
                  refreshConversations();
                  setSelectedConvId('');
                  showToast('Todas as conversas foram limpas.');
                }}
                className="text-[11px] font-medium text-slate-500 hover:text-red-600 hover:underline"
              >
                Limpar Caixa
              </button>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {feedbackToast && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[8px] text-[12px] flex items-center justify-between shadow-xs">
            <span>{feedbackToast}</span>
            <button
              type="button"
              onClick={() => setFeedbackToast(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* MAIN MESSAGING CONTAINER (Split view Desktop, stacked/switchable Mobile) */}
        <div className="bg-white rounded-[16px] border border-[#e0e6f0] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* ============================================================== */}
          {/* COLUMN 1: CONVERSATION LIST (Col 1-4 on Desktop)               */}
          {/* ============================================================== */}
          <aside
            aria-label="Lista de conversas"
            className={`lg:col-span-4 border-r border-[#e0e6f0] flex flex-col bg-white ${
              selectedConvId && activeConversation ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-[#e0e6f0] space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar conversas..."
                  className="w-full h-[38px] pl-9 pr-3 text-[13px] bg-[#f5f7fb] border border-[#e0e6f0] rounded-[8px] text-[#14223b] placeholder:text-[#62718a] focus:outline-none focus:border-[#b91c1c]"
                />
                <span className="absolute left-3 top-2.5 text-[#62718a]">🔍</span>
              </div>

              {/* Tabs: Todas / Não lidas */}
              <div className="flex items-center gap-1 bg-[#f5f7fb] p-1 rounded-[8px] border border-[#e0e6f0]">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 text-[12px] font-semibold py-1 px-2 rounded-[6px] transition-colors ${
                    filterTab === 'all'
                      ? 'bg-white text-[#14223b] shadow-xs'
                      : 'text-[#62718a] hover:text-[#14223b]'
                  }`}
                >
                  Todas ({conversations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('unread')}
                  className={`flex-1 text-[12px] font-semibold py-1 px-2 rounded-[6px] transition-colors ${
                    filterTab === 'unread'
                      ? 'bg-white text-[#14223b] shadow-xs'
                      : 'text-[#62718a] hover:text-[#14223b]'
                  }`}
                >
                  Não lidas ({conversations.filter((c) => c.unreadCount > 0).length})
                </button>
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#f0f3f8]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-[#62718a] text-[13px]">
                  Nenhuma conversa encontrada para o filtro.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedConvId;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                        isSelected
                          ? 'bg-[#fef2f2] border-l-4 border-l-[#b91c1c]'
                          : 'hover:bg-[#f8f9fb] border-l-4 border-l-transparent'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className={`size-11 rounded-full flex items-center justify-center font-bold text-[13px] ${
                            conv.isMediated
                              ? 'bg-[#dbeafe] text-[#1e40af] border border-[#93c5fd]'
                              : conv.sellerType === 'concessionaria'
                                ? 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]'
                                : 'bg-[#f1f5f9] text-[#1e293b] border border-[#cbd5e1]'
                          }`}
                        >
                          {conv.isMediated ? (
                            <IconShield className="size-5" />
                          ) : conv.sellerType === 'concessionaria' ? (
                            <IconBuilding className="size-5" />
                          ) : (
                            conv.sellerInitials
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-[#e0151f] text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Conversation Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[13px] font-bold text-[#14223b] truncate">
                            {conv.sellerName}
                          </p>
                          <span className="text-[11px] text-[#62718a] shrink-0">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-[#b91c1c] truncate mt-0.5">
                          {conv.vehicleTitle}
                        </p>

                        <p className="text-[12px] text-[#475569] truncate mt-1 leading-snug">
                          {conv.lastMessage}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          {conv.isMediated && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                              Mediação Oficial
                            </span>
                          )}
                          {conv.isBlocked && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              Bloqueado
                            </span>
                          )}
                          {conv.isSold && !conv.isBlocked && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              Vendido
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ============================================================== */}
          {/* COLUMN 2: ACTIVE CONVERSATION THREAD (Col 5-9 on Desktop)      */}
          {/* ============================================================== */}
          <section
            aria-label="Conversa ativa"
            className={`lg:col-span-5 xl:col-span-5 flex flex-col bg-[#fdfdfd] border-r border-[#e0e6f0] ${
              !selectedConvId || !activeConversation ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3.5 sm:p-4 border-b border-[#e0e6f0] bg-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Mobile Back Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedConvId('')}
                      className="lg:hidden p-1.5 rounded-full hover:bg-slate-100 text-[#62718a] shrink-0"
                      aria-label="Voltar para a lista de conversas"
                    >
                      <IconArrowLeft className="size-5" />
                    </button>

                    <div className="size-10 rounded-full bg-[#f1f5f9] text-[#14223b] border border-[#e2e8f0] flex items-center justify-center font-bold text-[13px] shrink-0">
                      {activeConversation.isMediated ? (
                        <IconShield className="size-5 text-[#1e40af]" />
                      ) : (
                        activeConversation.sellerInitials
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-[14px] sm:text-[15px] font-bold text-[#14223b] truncate">
                          {activeConversation.sellerName}
                        </h2>
                        {activeConversation.isMediated && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                            Equipe Oficial
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#62718a] truncate">
                        Sobre:{' '}
                        <Link
                          href={`/veiculos/${activeConversation.vehicleId}`}
                          className="font-medium text-[#1463c7] hover:underline"
                        >
                          {activeConversation.vehicleTitle}
                        </Link>
                      </p>
                    </div>
                  </div>

                  {/* Actions / Options Menu Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsOptionsOpen((prev) => !prev)}
                      className="p-2 rounded-full hover:bg-slate-100 text-[#62718a] transition-colors"
                      aria-label="Opções da conversa"
                      aria-expanded={isOptionsOpen}
                    >
                      <IconMoreHorizontal className="size-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {isOptionsOpen && (
                      <div className="absolute right-0 top-10 w-52 bg-white rounded-[10px] border border-[#e0e6f0] shadow-lg py-1 z-20">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOptionsOpen(false);
                            setIsReportModalOpen(true);
                          }}
                          className="w-full px-4 py-2.5 text-left text-[12px] font-medium text-[#b91c1c] hover:bg-red-50 flex items-center gap-2"
                        >
                          <IconFlag className="size-4" />
                          <span>Denunciar anunciante</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOptionsOpen(false);
                            handleReportSubmit({
                              conversationId: activeConversation.id,
                              reason: 'outro',
                              details: 'Bloqueio solicitado diretamente pelo usuário.',
                              blockSeller: true,
                            });
                          }}
                          className="w-full px-4 py-2 text-left text-[12px] text-[#48566a] hover:bg-slate-50 flex items-center gap-2"
                        >
                          <IconBan className="size-4" />
                          <span>Bloquear vendedor</span>
                        </button>
                        <Link
                          href={`/veiculos/${activeConversation.vehicleId}`}
                          className="w-full px-4 py-2 text-left text-[12px] text-[#48566a] hover:bg-slate-50 flex items-center gap-2"
                          onClick={() => setIsOptionsOpen(false)}
                        >
                          <IconExternalLink className="size-4" />
                          <span>Ver anúncio do carro</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Mediated Conversation Banner (Figma 1168:790 / 1168:846) */}
                {activeConversation.isMediated && (
                  <div className="bg-[#eff6ff] border-b border-[#bfdbfe] p-3 text-[12px] text-[#1e40af] flex items-start gap-2.5">
                    <IconShield className="size-5 text-[#2563eb] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Equipe Feira de Carros • Mediação Oficial</p>
                      <p className="text-[11px] text-[#3b82f6] mt-0.5 leading-snug">
                        Este canal conta com mediação da nossa equipe para esclarecimento técnico de
                        dúvidas e proteção das partes envolvidas.
                      </p>
                    </div>
                  </div>
                )}

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fbfcfd]">
                  {activeConversation.messages.map((msg) => {
                    if (msg.sender === 'system') {
                      return (
                        <div key={msg.id} className="text-center my-3">
                          <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 text-[#475569] text-[11px] rounded-full">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    if (msg.sender === 'staff') {
                      return (
                        <div key={msg.id} className="flex flex-col items-start max-w-[85%]">
                          <div className="bg-[#eff6ff] border border-[#bfdbfe] text-[#1e3a8a] rounded-[14px] rounded-tl-xs p-3.5 text-[13px] leading-relaxed shadow-xs">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-[#1d4ed8] mb-1">
                              <IconShield className="size-3.5" />
                              <span>{msg.senderName}</span>
                            </div>
                            <p>{msg.text}</p>
                          </div>
                          <span className="text-[10px] text-[#64748b] mt-1 ml-1">{msg.time}</span>
                        </div>
                      );
                    }

                    const isBuyer = msg.sender === 'buyer';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-[14px] p-3.5 text-[13px] leading-relaxed shadow-xs ${
                            isBuyer
                              ? 'bg-[#fee2e2] text-[#991b1b] rounded-tr-xs'
                              : 'bg-white border border-[#e2e7ee] text-[#14223b] rounded-tl-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-[#64748b] mt-1 px-1">
                          {isBuyer ? `Você · ${msg.time}` : `${msg.senderName} · ${msg.time}`}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Composer or Read-Only State (Figma 1168:693 / 1168:746) */}
                {activeConversation.isBlocked ||
                activeConversation.isSold ||
                activeConversation.status === 'blocked' ? (
                  <div className="p-4 bg-slate-100 border-t border-[#e2e7ee] text-center">
                    <div className="flex items-center justify-center gap-2 text-[13px] font-semibold text-[#475569]">
                      <IconLock className="size-4 text-slate-500" />
                      <span>Esta conversa está arquivada e não aceita novas mensagens.</span>
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-1">
                      O veículo foi vendido ou o anunciante foi bloqueado por segurança.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 sm:p-4 bg-white border-t border-[#e0e6f0] flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Digite sua mensagem ao vendedor..."
                      className="flex-1 h-[42px] px-3.5 bg-[#f5f7fb] border border-[#e0e6f0] rounded-[8px] text-[13px] text-[#14223b] placeholder:text-[#62718a] focus:outline-none focus:border-[#b91c1c]"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="h-[42px] px-5 bg-[#e0151f] hover:bg-[#b91c1c] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-[13px] rounded-[8px] flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span className="hidden sm:inline">Enviar</span>
                      <IconSend className="size-4" />
                    </button>
                  </form>
                )}
              </>
            ) : selectedConvId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#62718a]">
                <IconAlert className="size-12 text-amber-400 mb-3" />
                <h3 className="text-[16px] font-bold text-[#14223b]">Conversa não encontrada</h3>
                <p className="text-[13px] max-w-xs mt-1">
                  A conversa solicitada não foi encontrada ou foi removida do histórico.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedConvId('')}
                  className="mt-4 px-4 py-1.5 text-[12px] font-semibold text-[#1463c7] hover:underline bg-[#f1f5f9] rounded-[6px]"
                >
                  Ver todas as conversas
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#62718a]">
                <IconMessageSquare className="size-12 text-slate-300 mb-3" />
                <h3 className="text-[16px] font-bold text-[#14223b]">Selecione uma conversa</h3>
                <p className="text-[13px] max-w-xs mt-1">
                  Escolha um anunciante na lista lateral para visualizar as mensagens e responder.
                </p>
              </div>
            )}
          </section>

          {/* ============================================================== */}
          {/* COLUMN 3: VEHICLE & SAFETY RIGHT RAIL (Col 10-12 Desktop Only)  */}
          {/* ============================================================== */}
          <aside
            aria-label="Detalhes do veículo e segurança"
            className="hidden lg:flex lg:col-span-3 xl:col-span-3 flex-col bg-white p-5 space-y-5 overflow-y-auto"
          >
            {activeConversation ? (
              <>
                {/* Vehicle Quick Card */}
                <div className="border border-[#e0e6f0] rounded-[12px] p-4 bg-[#f8f9fb]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#62718a] mb-2">
                    Veículo de Referência
                  </p>
                  <div className="w-full h-28 bg-slate-200 rounded-[8px] overflow-hidden relative mb-2.5">
                    <img
                      src={activeConversation.vehicleImageUrl}
                      alt={activeConversation.vehicleTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#14223b] leading-tight">
                    {activeConversation.vehicleTitle}
                  </h4>
                  <p className="text-[11px] text-[#62718a] mt-0.5">
                    {activeConversation.vehicleLocation}
                  </p>
                  <p className="text-[15px] font-extrabold text-[#e0151f] mt-1.5">
                    {activeConversation.vehiclePriceFormatted}
                  </p>

                  <Link
                    href={`/veiculos/${activeConversation.vehicleId}`}
                    className="mt-3 block text-center text-[12px] font-bold text-[#1463c7] hover:underline bg-white border border-[#dce3ec] py-1.5 rounded-[6px]"
                  >
                    Ver anúncio completo →
                  </Link>
                </div>

                {/* Safety Advice Box */}
                <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[12px] p-4">
                  <div className="flex items-start gap-2">
                    <IconAlert className="size-4 text-[#d97706] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[12px] font-bold text-[#92400e]">Dicas de Segurança</h4>
                      <ul className="text-[11px] text-[#92400e] mt-1 space-y-1.5 leading-relaxed">
                        <li>• Nunca realize transferências ou sinais antecipados.</li>
                        <li>• Marque encontros sempre em locais públicos e movimentados.</li>
                        <li>• Confira presencialmente a documentação e histórico do carro.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Privacy & Monitoring Notice */}
                <div className="text-[11px] text-[#62718a] leading-relaxed p-3 bg-[#f1f5f9] rounded-[10px]">
                  <p className="font-semibold text-[#14223b] mb-1">Privacidade do Chat</p>
                  Para sua proteção, o canal de mensagens da Feira de Carros possui filtros contra
                  mensagens fraudulentas e links maliciosos.
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-[#62718a] text-[12px]">
                Nenhum veículo selecionado.
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Report & Block Modal */}
      {activeConversation && (
        <ReportConversationModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          conversation={activeConversation}
          onReportSubmitted={handleReportSubmit}
        />
      )}

      <MarketplaceFooter />
    </div>
  );
}

export default function BuyerMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center text-[13px] text-[#62718a]">
          Carregando mensagens...
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
