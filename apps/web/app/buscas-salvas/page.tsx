'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  DEFAULT_SAVED_SEARCHES,
  type SavedSearchItem,
  useBuyerStore,
} from '../../stores/use-buyer-store';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBell,
  IconCheck,
  IconCross,
  IconHeart,
  IconHelpCircle,
  IconLock,
  IconPlus,
  IconSearch,
  IconShield,
  IconTrash,
  IconUser,
} from '../components/SellerIcons';

export default function BuyerSavedSearchesPage() {
  const router = useRouter();
  const { savedSearches, deleteSavedSearch, toggleSearchAlert, saveSearch, logoutSimulation } =
    useBuyerStore();

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Helper to build URL query string from saved search params
  const buildSearchUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        searchParams.set(key, value);
      }
    }
    const qs = searchParams.toString();
    return qs ? `/veiculos?${qs}` : '/veiculos';
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Deseja remover a busca salva "${title}"?`)) {
      deleteSavedSearch(id);
      setFeedbackToast(`Busca "${title}" removida com sucesso.`);
      setTimeout(() => setFeedbackToast(null), 3500);
    }
  };

  const handleToggleAlert = (id: string, currentEnabled: boolean) => {
    toggleSearchAlert(id);
    setFeedbackToast(
      currentEnabled
        ? 'Alertas desativados para esta busca.'
        : 'Alertas ativados! Você será notificado sobre novos veículos.',
    );
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleRestoreDemo = () => {
    for (const item of DEFAULT_SAVED_SEARCHES) {
      if (!savedSearches.some((s) => s.id === item.id)) {
        saveSearch(item.title, item.params, item.category);
      }
    }
    setFeedbackToast('Buscas salvas de demonstração restauradas.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleLogout = () => {
    logoutSimulation();
    if (typeof document !== 'undefined') {
      document.cookie = 'fdc_web_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb matching Figma 856:165 */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[12px] text-[#68788e] mb-4"
        >
          <Link href="/" className="hover:text-[#17223a] transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link href="/conta" className="hover:text-[#17223a] transition-colors">
            Minha Conta
          </Link>
          <span>/</span>
          <span className="text-[#17223a] font-medium">Buscas salvas</span>
        </nav>

        {/* FEEDBACK TOAST */}
        {feedbackToast && (
          <output
            aria-live="polite"
            className="mb-4 bg-[#101d34] text-white text-[13px] px-4 py-2.5 rounded-[8px] shadow-lg flex items-center justify-between animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <IconCheck className="size-4 text-[#22c55e]" />
              <span>{feedbackToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackToast(null)}
              className="text-[#94a3b8] hover:text-white"
            >
              <IconCross className="size-4" />
            </button>
          </output>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR NAVIGATION matching Figma 856:165 & 1398:2401 */}
          <aside className="lg:col-span-3 bg-white border border-[#e1e7ef] rounded-[14px] p-3 shadow-xs space-y-1">
            <Link
              href="/conta"
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconUser className="size-4 text-[#68788e]" />
              <span>Minha conta</span>
            </Link>

            <Link
              href="/favoritos"
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconHeart className="size-4 text-[#68788e]" />
              <span>Meus Favoritos</span>
            </Link>

            <Link
              href="/buscas-salvas"
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-semibold bg-[#17223a] text-white shadow-xs flex items-center gap-3 transition-colors"
            >
              <IconSearch className="size-4" />
              <span>Buscas salvas ({savedSearches.length})</span>
            </Link>

            <Link
              href="/conta/alertas"
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconBell className="size-4 text-[#68788e]" />
              <span>Alertas de veículos</span>
            </Link>

            <Link
              href="/conta/notificacoes"
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconShield className="size-4 text-[#68788e]" />
              <span>Preferências de Notificação</span>
            </Link>

            <Link
              href="/conta/senha"
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconLock className="size-4 text-[#68788e]" />
              <span>Segurança da conta</span>
            </Link>

            <div className="pt-3 border-t border-[#e2e7ee]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-[38px] px-3.5 rounded-[8px] text-[13px] font-semibold text-[#b91c1c] hover:bg-[#fee2e2] flex items-center gap-2 transition-colors"
              >
                <span>Encerrar sessão</span>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA (lg:col-span-9) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header matching Figma 856:165 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[24px] sm:text-[30px] font-bold text-[#14223b] tracking-tight">
                    Buscas salvas
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    DEMO DATA
                  </span>
                </div>
                <p className="text-[14px] text-[#62718a] mt-1">
                  Acesse rapidamente suas pesquisas mais frequentes e receba alertas de novos
                  anúncios.
                </p>
              </div>

              {/* + Nova busca CTA */}
              <Link
                href="/veiculos"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e0151f] hover:bg-[#c41217] text-white text-[13px] font-semibold rounded-[8px] transition-colors shadow-xs shrink-0"
              >
                <IconPlus className="size-4 stroke-[3]" />
                <span>Nova busca no catálogo</span>
              </Link>
            </div>

            {/* EMPTY STATE matching Figma 856:192 when length === 0 */}
            {savedSearches.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-8 sm:p-12 text-center shadow-xs">
                <div className="size-16 mx-auto rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] mb-5">
                  <IconSearch className="size-8" />
                </div>
                <h2 className="text-[20px] sm:text-[24px] font-bold text-[#14223b]">
                  Você não tem nenhuma busca salva
                </h2>
                <p className="text-[14px] text-[#62718a] max-w-[480px] mx-auto mt-2 leading-relaxed">
                  Aplique filtros no catálogo de veículos e clique em &quot;Salvar busca&quot; para
                  acompanhar novos carros, motos ou caminhões adicionados por vendedores.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <Link
                    href="/veiculos"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#e0151f] hover:bg-[#c41217] text-white text-[13px] font-semibold rounded-[8px] transition-colors"
                  >
                    Explorar veículos agora
                  </Link>
                  <button
                    type="button"
                    onClick={handleRestoreDemo}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#14223b] text-[13px] font-semibold rounded-[8px] transition-colors"
                  >
                    Restaurar buscas de demonstração
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* LIST OF SAVED SEARCH CARDS */}
                {savedSearches.map((item) => {
                  const targetUrl = buildSearchUrl(item.params);

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-[#e0e6f0] hover:border-[#cbd5e1] rounded-[14px] p-5 shadow-xs transition-all space-y-4"
                    >
                      {/* Top Bar: Icon + Title + Meta + Trash */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="size-10 rounded-[10px] bg-[#f0f4f8] text-[#14223b] flex items-center justify-center shrink-0 mt-0.5">
                            <IconSearch className="size-5 text-[#e0151f]" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-[16px] sm:text-[18px] font-bold text-[#14223b]">
                                {item.title}
                              </h3>
                              {item.newMatchesCount > 0 && (
                                <span className="bg-[#fee2e2] text-[#e0151f] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span>{item.newMatchesCount} novos veículos</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#62718a] mt-0.5">
                              Salva em {item.createdAt}
                            </p>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          aria-label={`Excluir busca salva ${item.title}`}
                          className="p-2 text-[#94a3b8] hover:text-[#b91c1c] hover:bg-[#fee2e2] rounded-[8px] transition-colors"
                        >
                          <IconTrash className="size-4" />
                        </button>
                      </div>

                      {/* Filter Badges / Pills matching Figma 856:165 */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Object.entries(item.params).map(([key, val]) => (
                          <span
                            key={key}
                            className="bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] text-[12px] font-medium px-2.5 py-1 rounded-[6px]"
                          >
                            <span className="text-[#64748b] capitalize">{key}:</span> {val}
                          </span>
                        ))}
                      </div>

                      {/* Actions & Alerts Toggle Row */}
                      <div className="pt-3 border-t border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Alert Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleAlert(item.id, item.alertsEnabled)}
                          className={`flex items-center gap-2 text-[12px] font-medium transition-colors cursor-pointer ${
                            item.alertsEnabled
                              ? 'text-[#16a34a] hover:text-[#15803d]'
                              : 'text-[#64748b] hover:text-[#334155]'
                          }`}
                        >
                          <div
                            className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                              item.alertsEnabled ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'
                            }`}
                          >
                            <div
                              className={`size-3 rounded-full bg-white transition-transform ${
                                item.alertsEnabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                          <span>
                            {item.alertsEnabled ? 'Alertas ativados' : 'Alertas desativados'}
                          </span>
                        </button>

                        {/* View Results Button */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={targetUrl}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#14223b] hover:bg-[#1e293b] text-white text-[13px] font-semibold rounded-[8px] transition-colors shadow-xs"
                          >
                            <span>Ver resultados</span>
                            <IconArrowRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* HOW SAVED SEARCHES WORK HELP CARD matching Figma 856:165 */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[14px] p-5 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-[#dbeafe] text-[#1d4ed8] shrink-0 mt-0.5">
                <IconBell className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[14px] font-bold text-[#1e3a8a]">
                  Como funcionam os alertas de busca?
                </h3>
                <p className="text-[13px] text-[#1e40af] leading-relaxed">
                  Sempre que um vendedor cadastrar um veículo compatível com seus filtros salvos,
                  você verá o novo anúncio na página de alertas e poderá receber avisos por e-mail
                  ou notificações push.
                </p>
                <div className="pt-2">
                  <Link
                    href="/conta/notificacoes"
                    className="text-[12px] font-semibold text-[#1d4ed8] hover:underline flex items-center gap-1"
                  >
                    <span>Gerenciar canais e frequência de notificação</span>
                    <IconArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
