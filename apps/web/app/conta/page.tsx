'use client';

import Link from 'next/link';
import { useState } from 'react';
import { executeUnifiedLogout } from '../../lib/hooks/use-current-auth';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { MarketplaceFooter } from '../components/MarketplaceFooter';
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import {
  IconAlert,
  IconCheck,
  IconFile,
  IconHeart,
  IconHelpCircle,
  IconLock,
  IconMail,
  IconMessageSquare,
  IconSearch,
  IconShield,
  IconUser,
} from '../components/SellerIcons';

export default function BuyerAccountDashboardPage() {
  const { buyerProfile, updateBuyerProfile, favorites } = useBuyerStore();

  const [activeTab, setActiveTab] = useState<'perfil' | 'mensagens' | 'buscas' | 'seguranca'>(
    'perfil',
  );

  // Form states
  const [firstName, setFirstName] = useState(buyerProfile.firstName);
  const [lastName, setLastName] = useState(buyerProfile.lastName);
  const [birthDate, setBirthDate] = useState(buyerProfile.birthDate);
  const [email, setEmail] = useState(buyerProfile.email);
  const [phone, setPhone] = useState(buyerProfile.phone);

  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBuyerProfile({
      firstName,
      lastName,
      birthDate,
      email,
      phone,
    });
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3500);
  };

  const handleLogout = () => {
    executeUnifiedLogout('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col justify-between">
      <MarketplaceHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR NAVIGATION matching Figma 1398:2401 (lg:col-span-3) */}
          <aside className="lg:col-span-3 bg-white border border-[#e1e7ef] rounded-[14px] p-3 shadow-xs space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('perfil')}
              className={`w-full h-[46px] px-3.5 rounded-[9px] text-[14px] font-semibold flex items-center gap-3 transition-colors ${
                activeTab === 'perfil'
                  ? 'bg-[#17223a] text-white shadow-xs'
                  : 'text-[#17223a] hover:bg-[#f5f7fb]'
              }`}
            >
              <IconUser className="size-4" />
              <span>Minha conta</span>
            </button>

            <Link
              href="/favoritos"
              className="w-full h-[46px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconHeart className="size-4 text-[#68788e]" />
              <span>Meus Favoritos ({favorites.length})</span>
            </Link>

            <Link
              href="/buscas-salvas"
              className="w-full h-[46px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconSearch className="size-4 text-[#68788e]" />
              <span>Buscas salvas</span>
            </Link>

            <Link
              href="/conta/alertas"
              className="w-full h-[46px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconFile className="size-4 text-[#68788e]" />
              <span>Alertas de veículos</span>
            </Link>

            <Link
              href="/conta/notificacoes"
              className="w-full h-[46px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconShield className="size-4 text-[#68788e]" />
              <span>Preferências de Notificação</span>
            </Link>

            <Link
              href="/conta/senha"
              className="w-full h-[46px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconLock className="size-4 text-[#68788e]" />
              <span>Segurança da conta</span>
            </Link>

            <Link
              href="/ajuda"
              className="w-full h-[46px] px-3.5 rounded-[9px] text-[14px] font-medium text-[#17223a] hover:bg-[#f5f7fb] flex items-center gap-3 transition-colors"
            >
              <IconHelpCircle className="size-4 text-[#68788e]" />
              <span>Suporte e Ajuda</span>
            </Link>

            <div className="pt-3 border-t border-[#e2e7ee]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-[40px] px-3.5 rounded-[8px] text-[13px] font-semibold text-[#b91c1c] hover:bg-[#fee2e2] flex items-center gap-2 transition-colors"
              >
                <span>Encerrar sessão</span>
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT (lg:col-span-9) */}
          <section className="lg:col-span-9 space-y-6">
            {/* Header matching Figma 1398:2415 */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-[26px] sm:text-[32px] font-bold text-[#17223a] tracking-tight">
                  Minha conta
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  DEMO DATA
                </span>
              </div>
              <p className="text-[14px] sm:text-[15px] text-[#68788e]">
                Gerencie seus dados pessoais, favoritos e preferências de segurança.
              </p>
            </div>

            {/* Profile Summary Panel matching Figma 1398:2417 */}
            <div className="bg-white border border-[#e1e7ef] rounded-[14px] p-5 sm:p-6 shadow-xs flex items-center gap-5">
              <div className="size-16 sm:size-18 rounded-full bg-[#17223a] text-white flex items-center justify-center font-bold text-[22px] sm:text-[24px] shrink-0 shadow-sm">
                {buyerProfile.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[18px] sm:text-[22px] font-semibold text-[#17223a] truncate">
                    {buyerProfile.fullName}
                  </h2>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
                    Comprador (Membro)
                  </span>
                </div>
                <p className="text-[13px] text-[#68788e] mt-0.5">{buyerProfile.email}</p>
                <p className="text-[12px] text-[#94a3b8] mt-1">
                  Foto de perfil não configurada · {buyerProfile.city}, {buyerProfile.state}
                </p>
              </div>
            </div>

            {/* Edit Profile Panel matching Figma 1398:2423 */}
            <div className="bg-white border border-[#e1e7ef] rounded-[14px] p-5 sm:p-7 shadow-xs">
              <h3 className="text-[18px] font-semibold text-[#17223a] mb-5">Dados do perfil</h3>

              {isSavedFeedback && (
                <div className="bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-[13px] p-3 rounded-[9px] mb-5 flex items-center gap-2">
                  <IconCheck className="size-4 stroke-[3]" />
                  <span>Dados do perfil atualizados com sucesso (simulação)!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div>
                    <label
                      htmlFor="profile-firstname"
                      className="block text-[13px] font-semibold text-[#68788e] mb-1.5"
                    >
                      Nome
                    </label>
                    <input
                      id="profile-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-[45px] px-3.5 bg-[#f8fafc] border border-[#e1e7ef] rounded-[8px] text-[13px] text-[#17223a] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Sobrenome */}
                  <div>
                    <label
                      htmlFor="profile-lastname"
                      className="block text-[13px] font-semibold text-[#68788e] mb-1.5"
                    >
                      Sobrenome
                    </label>
                    <input
                      id="profile-lastname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-[45px] px-3.5 bg-[#f8fafc] border border-[#e1e7ef] rounded-[8px] text-[13px] text-[#17223a] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Data de Nascimento */}
                  <div>
                    <label
                      htmlFor="profile-birthdate"
                      className="block text-[13px] font-semibold text-[#68788e] mb-1.5"
                    >
                      Data de nascimento
                    </label>
                    <input
                      id="profile-birthdate"
                      type="text"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-full h-[45px] px-3.5 bg-[#f8fafc] border border-[#e1e7ef] rounded-[8px] text-[13px] text-[#17223a] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label
                      htmlFor="profile-email"
                      className="block text-[13px] font-semibold text-[#68788e] mb-1.5"
                    >
                      E-mail
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[45px] px-3.5 bg-[#f8fafc] border border-[#e1e7ef] rounded-[8px] text-[13px] text-[#17223a] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="profile-phone"
                    className="block text-[13px] font-semibold text-[#68788e] mb-1.5"
                  >
                    Telefone de contato
                  </label>
                  <input
                    id="profile-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(31) 98765-4321"
                    className="w-full max-w-sm h-[45px] px-3.5 bg-[#f8fafc] border border-[#e1e7ef] rounded-[8px] text-[13px] text-[#17223a] focus:outline-none focus:border-[#b91c1c] focus:bg-white transition-all"
                  />
                </div>

                {/* Salvar Button matching Figma 1398:2437 */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="h-[42px] px-6 bg-[#cb121c] hover:bg-[#b01018] text-white font-semibold text-[13px] rounded-[9px] transition-colors shadow-xs"
                  >
                    Salvar alterações
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Links Panel matching Figma 1398:2439 */}
            <div className="bg-white border border-[#e1e7ef] rounded-[14px] p-5 sm:p-7 shadow-xs">
              <h3 className="text-[17px] font-semibold text-[#17223a] mb-4">Acesso rápido</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <Link
                  href="/veiculos"
                  className="bg-[#f7f9fc] hover:bg-[#edf2f9] border border-[#e8ecf2] p-4 rounded-[10px] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <IconHeart className="size-5 text-[#e0151f]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[#17223a]">Favoritos</p>
                      <p className="text-[11px] text-[#68788e]">
                        {favorites.length} {favorites.length === 1 ? 'veículo' : 'veículos'}
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    ›
                  </span>
                </Link>

                <Link
                  href="/veiculos"
                  className="bg-[#f7f9fc] hover:bg-[#edf2f9] border border-[#e8ecf2] p-4 rounded-[10px] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <IconSearch className="size-5 text-[#1463c7]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[#17223a]">Buscas salvas</p>
                      <p className="text-[11px] text-[#68788e]">
                        {buyerProfile.savedSearchesCount} buscas ativas
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    ›
                  </span>
                </Link>

                <Link
                  href="/vendedor/mensagens"
                  className="bg-[#f7f9fc] hover:bg-[#edf2f9] border border-[#e8ecf2] p-4 rounded-[10px] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <IconMessageSquare className="size-5 text-emerald-600" />
                    <div>
                      <p className="text-[14px] font-semibold text-[#17223a]">Mensagens</p>
                      <p className="text-[11px] text-[#68788e]">Conversas e propostas</p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    ›
                  </span>
                </Link>
              </div>
            </div>

            {/* Security and Privacy Panel matching Figma 1398:2447 */}
            <div className="bg-white border border-[#e1e7ef] rounded-[14px] p-5 sm:p-7 shadow-xs">
              <h3 className="text-[17px] font-semibold text-[#17223a] mb-4">
                Segurança e privacidade
              </h3>
              <div className="divide-y divide-[#f0f3f8]">
                <Link
                  href="/conta/senha"
                  className="py-3.5 flex items-center justify-between text-[#17223a] hover:text-[#b91c1c] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <IconLock className="size-4 text-[#68788e] group-hover:text-[#b91c1c]" />
                    <span className="text-[14px] sm:text-[15px] font-medium">Alterar senha</span>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                </Link>

                <Link
                  href="/conta/configuracoes"
                  className="py-3.5 flex items-center justify-between text-[#17223a] hover:text-[#b91c1c] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <IconShield className="size-4 text-[#68788e] group-hover:text-[#b91c1c]" />
                    <span className="text-[14px] sm:text-[15px] font-medium">
                      Notificações e preferências de contato
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                </Link>

                <Link
                  href="/conta/exclusao"
                  className="py-3.5 flex items-center justify-between text-[#cb121c] hover:text-[#991b1b] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <IconAlert className="size-4 text-[#cb121c]" />
                    <span className="text-[14px] sm:text-[15px] font-semibold">
                      Solicitar exclusão da conta (LGPD)
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
