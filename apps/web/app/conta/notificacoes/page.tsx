'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type NotificationPreferences, useBuyerStore } from '../../../stores/use-buyer-store';
import { MarketplaceFooter } from '../../components/MarketplaceFooter';
import { MarketplaceHeader } from '../../components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBell,
  IconCheck,
  IconCross,
  IconHeart,
  IconHelpCircle,
  IconLock,
  IconMail,
  IconMessageSquare,
  IconSearch,
  IconShield,
  IconSmartphone,
  IconUser,
} from '../../components/SellerIcons';

export default function BuyerNotificationPreferencesPage() {
  const router = useRouter();
  const {
    notificationPreferences,
    updateNotificationPreferences,
    resetNotificationPreferences,
    buyerProfile,
    savedSearches,
    logoutSimulation,
  } = useBuyerStore();

  const [prefs, setPrefs] = useState<NotificationPreferences>(() => ({
    ...notificationPreferences,
  }));
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFrequencyChange = (frequency: 'immediate' | 'daily' | 'weekly') => {
    setPrefs((prev) => ({
      ...prev,
      frequency,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences(prefs);
    setFeedbackToast('Preferências de notificação salvas com sucesso!');
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleReset = () => {
    resetNotificationPreferences();
    setPrefs({ ...useBuyerStore.getState().notificationPreferences });
    setFeedbackToast('Preferências restauradas para o padrão recomendado.');
    setTimeout(() => setFeedbackToast(null), 3500);
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
        {/* Breadcrumb matching Figma 856:261 */}
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
          <span className="text-[#17223a] font-medium">Preferências de Notificação</span>
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
          {/* LEFT SIDEBAR NAVIGATION matching Figma 856:261 & 1398:2401 */}
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
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconSearch className="size-4 text-[#68788e]" />
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
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-semibold bg-[#17223a] text-white shadow-xs flex items-center gap-3 transition-colors"
            >
              <IconShield className="size-4" />
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
            {/* Header matching Figma 856:261 */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[24px] sm:text-[30px] font-bold text-[#14223b] tracking-tight">
                  Preferências de Notificação
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  DEMO DATA
                </span>
              </div>
              <p className="text-[14px] text-[#62718a] mt-1">
                Escolha como e quando deseja receber alertas de novos veículos, mensagens e
                novidades da plataforma.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* SECTION 1: SEARCH ALERTS */}
              <div className="bg-white border border-[#e0e6f0] rounded-[14px] p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-[10px] bg-[#fee2e2] text-[#e0151f] flex items-center justify-center shrink-0">
                      <IconBell className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#14223b]">
                        Alertas de Buscas Salvas
                      </h2>
                      <p className="text-[12px] text-[#62718a]">
                        Avisos de anúncios compatíveis com seus filtros
                      </p>
                    </div>
                  </div>

                  {/* Master Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle('savedSearchAlerts')}
                    className={`flex items-center gap-2 text-[12px] font-semibold cursor-pointer ${
                      prefs.savedSearchAlerts ? 'text-[#16a34a]' : 'text-[#64748b]'
                    }`}
                  >
                    <div
                      className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                        prefs.savedSearchAlerts ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'
                      }`}
                    >
                      <div
                        className={`size-4 rounded-full bg-white transition-transform ${
                          prefs.savedSearchAlerts ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </button>
                </div>

                {prefs.savedSearchAlerts ? (
                  <div className="space-y-4 pt-1">
                    <p className="text-[13px] font-semibold text-[#14223b]">Canais de entrega:</p>

                    {/* Email Channel */}
                    <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0]">
                      <div className="flex items-center gap-3">
                        <IconMail className="size-5 text-[#64748b]" />
                        <div>
                          <p className="text-[13px] font-semibold text-[#14223b]">Por E-mail</p>
                          <p className="text-[11px] text-[#64748b]">{buyerProfile.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('emailChannel')}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          prefs.emailChannel ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'
                        }`}
                      >
                        <div
                          className={`size-4 rounded-full bg-white transition-transform ${
                            prefs.emailChannel ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Push Channel */}
                    <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-[#f8fafc] border border-[#e2e8f0]">
                      <div className="flex items-center gap-3">
                        <IconSmartphone className="size-5 text-[#64748b]" />
                        <div>
                          <p className="text-[13px] font-semibold text-[#14223b]">
                            Notificação Push
                          </p>
                          <p className="text-[11px] text-[#64748b]">
                            Alertas no navegador ou aplicativo celular
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('pushChannel')}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          prefs.pushChannel ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'
                        }`}
                      >
                        <div
                          className={`size-4 rounded-full bg-white transition-transform ${
                            prefs.pushChannel ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Frequency Selector */}
                    <div className="pt-2">
                      <p className="text-[13px] font-semibold text-[#14223b] mb-2">
                        Frequência de envio:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {(
                          [
                            {
                              key: 'immediate',
                              label: 'Imediata',
                              sub: 'Ao publicar novo anúncio',
                            },
                            {
                              key: 'daily',
                              label: 'Resumo Diário',
                              sub: 'Uma vez ao dia às 18h',
                            },
                            {
                              key: 'weekly',
                              label: 'Semanal',
                              sub: 'Toda segunda-feira',
                            },
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleFrequencyChange(item.key)}
                            className={`p-3 rounded-[10px] text-left border transition-all ${
                              prefs.frequency === item.key
                                ? 'bg-[#eff6ff] border-[#3b82f6] text-[#1e3a8a] shadow-xs'
                                : 'bg-white border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
                            }`}
                          >
                            <p className="text-[13px] font-bold">{item.label}</p>
                            <p className="text-[11px] opacity-80 mt-0.5">{item.sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-[8px] text-[12px] text-[#64748b]">
                    Os alertas para buscas salvas estão desativados. Ative a chave acima para voltar
                    a receber novidades sobre seus filtros salvos.
                  </div>
                )}
              </div>

              {/* SECTION 2: SELLER MESSAGES */}
              <div className="bg-white border border-[#e0e6f0] rounded-[14px] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-[10px] bg-[#dbeafe] text-[#2563eb] flex items-center justify-center shrink-0">
                      <IconMessageSquare className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#14223b]">
                        Mensagens e Propostas
                      </h2>
                      <p className="text-[12px] text-[#62718a]">
                        Avisos quando um vendedor responder a você
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle('sellerMessages')}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                      prefs.sellerMessages ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'
                    }`}
                  >
                    <div
                      className={`size-4 rounded-full bg-white transition-transform ${
                        prefs.sellerMessages ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* SECTION 3: PLATFORM PROMOTIONS */}
              <div className="bg-white border border-[#e0e6f0] rounded-[14px] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-[10px] bg-[#f1f5f9] text-[#475569] flex items-center justify-center shrink-0">
                      <IconShield className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#14223b]">
                        Novidades e Ofertas Feira de Carros
                      </h2>
                      <p className="text-[12px] text-[#62718a]">
                        Tendências do mercado automotivo, promoções e dicas
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle('promotionsNewsletters')}
                    className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                      prefs.promotionsNewsletters ? 'bg-[#16a34a]' : 'bg-[#cbd5e1]'
                    }`}
                  >
                    <div
                      className={`size-4 rounded-full bg-white transition-transform ${
                        prefs.promotionsNewsletters ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* DEMO NOTICE BANNER */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[12px] p-4 text-[#166534] text-[12px] leading-relaxed">
                <p className="font-bold">DEMO PROTOCOL • FEIRA DE CARROS:</p>
                <p className="mt-0.5">
                  As opções acima operam em modo demonstrativo e são persistidas localmente no seu
                  navegador. O envio real por SMTP ou web-push depende da ativação dos microserviços
                  no backend.
                </p>
                {notificationPreferences.lastUpdated && (
                  <p className="text-[11px] text-[#15803d] mt-1 font-mono">
                    Última sincronização local: {notificationPreferences.lastUpdated}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#14223b] text-[13px] font-semibold rounded-[8px] transition-colors"
                >
                  Restaurar padrões
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#e0151f] hover:bg-[#c41217] text-white text-[13px] font-semibold rounded-[8px] transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <IconCheck className="size-4" />
                  <span>Salvar preferências</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
