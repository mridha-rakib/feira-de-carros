'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  type VehicleMatchAlert,
  getBuyerMatchAlerts,
} from '../../../lib/adapters/buyer-catalog-adapter';
import { useBuyerStore } from '../../../stores/use-buyer-store';
import { MarketplaceFooter } from '../../components/MarketplaceFooter';
import { MarketplaceHeader } from '../../components/MarketplaceHeader';
import {
  IconAlert,
  IconArrowRight,
  IconBell,
  IconCalendar,
  IconCheck,
  IconCross,
  IconGauge,
  IconHeart,
  IconHelpCircle,
  IconLock,
  IconPin,
  IconSearch,
  IconShield,
  IconTrash,
  IconUser,
} from '../../components/SellerIcons';

export default function BuyerAlertsPage() {
  const router = useRouter();
  const { savedSearches, logoutSimulation } = useBuyerStore();
  const [alerts, setAlerts] = useState<VehicleMatchAlert[]>(() => getBuyerMatchAlerts());
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setFeedbackToast('Alerta dispensado.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    setFeedbackToast('Todos os alertas foram marcados como lidos.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleRestoreAlerts = () => {
    setAlerts(getBuyerMatchAlerts());
    setFeedbackToast('Alertas restaurados para o estado inicial.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleLogout = () => {
    logoutSimulation();
    if (typeof document !== 'undefined') {
      document.cookie = 'fdc_web_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/');
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb matching Figma 856:219 */}
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
          <span className="text-[#17223a] font-medium">Alertas de veículos</span>
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
          {/* LEFT SIDEBAR NAVIGATION matching Figma 856:219 & 1398:2401 */}
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
              className="w-full h-[44px] px-3.5 rounded-[9px] text-[14px] font-semibold bg-[#17223a] text-white shadow-xs flex items-center gap-3 transition-colors"
            >
              <IconBell className="size-4" />
              <span>Alertas de veículos</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-[#e0151f] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadCount}
                </span>
              )}
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
            {/* Header matching Figma 856:219 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[24px] sm:text-[30px] font-bold text-[#14223b] tracking-tight">
                    Alertas de Novos Veículos
                  </h1>
                  {unreadCount > 0 && (
                    <span className="bg-[#fee2e2] text-[#e0151f] text-[12px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} novos
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    DEMO DATA
                  </span>
                </div>
                <p className="text-[14px] text-[#62718a] mt-1">
                  Listagens recentes que correspondem aos critérios das suas buscas salvas.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="px-3 py-2 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#14223b] text-[12px] font-semibold rounded-[8px] transition-colors"
                  >
                    Marcar lidos
                  </button>
                )}
                <Link
                  href="/conta/notificacoes"
                  className="px-4 py-2 bg-[#14223b] hover:bg-[#1e293b] text-white text-[12px] font-semibold rounded-[8px] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <IconShield className="size-3.5" />
                  <span>Preferências</span>
                </Link>
              </div>
            </div>

            {/* DEMONSTRATION NOTICE BANNER matching AGENTS.md provenance rules */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[12px] p-4 flex items-start gap-3 text-[#166534]">
              <div className="p-1 rounded bg-[#dcfce7] text-[#16a34a] shrink-0 mt-0.5">
                <IconCheck className="size-4" />
              </div>
              <div className="text-[12px] leading-relaxed">
                <span className="font-bold">DEMO PROTOCOL • FEIRA DE CARROS:</span> Os alertas
                exibidos nesta seção são gerados deterministicamente a partir dos filtros de busca
                salvos e anúncios do catálogo público. Em ambiente produtivo, estes alertas são
                enviados por mensageria e notificações push pelos microserviços do backend.
              </div>
            </div>

            {/* ALERTS LIST or EMPTY STATE */}
            {alerts.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-[16px] p-8 sm:p-12 text-center shadow-xs">
                <div className="size-16 mx-auto rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] mb-5">
                  <IconBell className="size-8" />
                </div>
                <h2 className="text-[20px] sm:text-[24px] font-bold text-[#14223b]">
                  Nenhum alerta recente
                </h2>
                <p className="text-[14px] text-[#62718a] max-w-[480px] mx-auto mt-2 leading-relaxed">
                  Quando novos anúncios corresponderem aos filtros das suas buscas salvas, eles
                  serão listados aqui para consulta rápida.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <Link
                    href="/buscas-salvas"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#e0151f] hover:bg-[#c41217] text-white text-[13px] font-semibold rounded-[8px] transition-colors"
                  >
                    Ver minhas buscas salvas
                  </Link>
                  <button
                    type="button"
                    onClick={handleRestoreAlerts}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#14223b] text-[13px] font-semibold rounded-[8px] transition-colors"
                  >
                    Restaurar alertas de demonstração
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-white border rounded-[14px] p-4 sm:p-5 transition-all shadow-xs space-y-3.5 ${
                      alert.isRead
                        ? 'border-[#e2e8f0]'
                        : 'border-[#fca5a5] ring-1 ring-[#fee2e2] bg-[#fffdfd]'
                    }`}
                  >
                    {/* Alert Top Bar */}
                    <div className="flex items-center justify-between gap-3 text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#14223b]">
                          <IconSearch className="size-3.5 text-[#e0151f]" />
                          <span>Busca: {alert.savedSearchTitle}</span>
                        </span>
                        {!alert.isRead && (
                          <span className="size-2 rounded-full bg-[#e0151f] inline-block" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[#64748b]">
                        <span>{alert.notifiedAt}</span>
                        <button
                          type="button"
                          onClick={() => handleDismiss(alert.id)}
                          className="hover:text-[#b91c1c] text-[#94a3b8] transition-colors"
                          aria-label="Dispensar alerta"
                        >
                          <IconCross className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Vehicle Preview Card Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#f1f5f9]">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative size-16 sm:size-20 rounded-[10px] overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={alert.vehicle.imageUrl}
                            alt={alert.vehicle.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] sm:text-[17px] font-bold text-[#14223b] truncate">
                              {alert.vehicle.title}
                            </h3>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#475569]">
                              {alert.vehicle.sellerType === 'concessionaria'
                                ? 'Concessionária'
                                : 'Particular'}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#62718a] truncate">
                            {alert.vehicle.version}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-[#64748b] mt-1">
                            <span className="flex items-center gap-1">
                              <IconPin className="size-3 text-[#e0151f]" />
                              {alert.vehicle.city}, {alert.vehicle.state}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <IconCalendar className="size-3" />
                              {alert.vehicle.yearModel}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <IconGauge className="size-3" />
                              {alert.vehicle.mileageFormatted}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                        <span className="text-[18px] sm:text-[20px] font-bold text-[#e0151f]">
                          {alert.vehicle.priceFormatted}
                        </span>
                        <Link
                          href={`/veiculos/${alert.vehicle.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#14223b] hover:bg-[#1e293b] text-white text-[12px] font-semibold rounded-[8px] transition-colors shadow-xs"
                        >
                          <span>Ver anúncio</span>
                          <IconArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
