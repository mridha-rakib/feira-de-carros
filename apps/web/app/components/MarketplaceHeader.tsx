'use client';

import { BrandLogo } from '@feira/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCurrentAuth } from '../../lib/hooks/use-current-auth';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { BuyerLocationModal } from './BuyerLocationModal';
import { FavoritesLoginModal } from './FavoritesLoginModal';
import {
  IconCar,
  IconCard,
  IconChevronDown,
  IconCross,
  IconFile,
  IconHeart,
  IconHelpCircle,
  IconLock,
  IconMessageSquare,
  IconMotorcycle,
  IconPin,
  IconPlus,
  IconSearch,
  IconShield,
  IconTruck,
  IconUser,
} from './SellerIcons';

export function MarketplaceHeader() {
  const router = useRouter();
  const { location, favorites, openLocationModal } = useBuyerStore();
  const { isMounted, isAuthenticated, role, user, dashboardUrl, createAdUrl, messagesUrl, logout } =
    useCurrentAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    }
    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [accountMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/veiculos?busca=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push('/veiculos');
    }
  };

  // Top Locality Strip target
  const topAreaLink =
    role === 'dealer'
      ? { href: '/concessionaria/anuncios', label: 'Painel da Loja' }
      : role === 'seller'
        ? { href: '/vendedor/anuncios', label: 'Área do Vendedor' }
        : { href: '/vendedor/solicitacao', label: 'Área do Vendedor' };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e0e6f0] shadow-xs">
        {/* Top Locality Strip (Figma 752:31 / 1437:2364: 15px dark navy strip) */}
        <div className="hidden md:block w-full bg-[#101d34]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[15px] flex items-center justify-between text-white text-[10px]">
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1 hover:text-[#fca5a5] transition-colors cursor-pointer group text-[10px]"
            >
              <IconPin className="size-2.5 text-[#f42524] group-hover:scale-110 transition-transform" />
              <span className="font-medium text-white">{location.label}</span>
              <span className="text-[#94a3b8] text-[9px] ml-1 underline group-hover:text-white">
                (alterar cidade)
              </span>
            </button>
            <div className="flex items-center gap-4 text-[#cbd5e1] text-[10px]">
              <Link href={topAreaLink.href} className="hover:text-white transition-colors">
                {topAreaLink.label}
              </Link>
              <span>•</span>
              <Link href="/ajuda" className="hover:text-white transition-colors">
                Ajuda
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Main Navbar (Figma 1440x89px, Total 104px) */}
        <div className="hidden md:flex max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[89px] items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <BrandLogo
              variant="on-light"
              priority
              width={181}
              height={29}
              className="h-[29px] w-auto"
            />
          </Link>

          {/* Search Keyword Field (Figma 355x46px) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-[355px] bg-[#f5f7fb] hover:bg-[#eef2f8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#b91c1c]/20 border border-[#e2e7ee] rounded-[10px] h-[46px] px-3.5 transition-all"
          >
            <IconSearch className="size-4 text-[#62718a] shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Marca, modelo ou palavra-chave"
              className="w-full bg-transparent border-none text-[13px] text-[#14223b] placeholder:text-[#62718a] outline-none"
            />
          </form>

          {/* Desktop Category Navigation */}
          <nav className="flex items-center gap-6 text-[12px] text-[#14223b]">
            <Link
              href="/veiculos"
              className="font-semibold text-[#14223b] hover:text-[#b91c1c] transition-colors whitespace-nowrap"
            >
              Todos os veículos
            </Link>
            <Link
              href="/veiculos?categoria=Carros"
              className="text-[#14223b] hover:text-[#b91c1c] transition-colors"
            >
              Carros
            </Link>
            <Link
              href="/veiculos?categoria=Motos"
              className="text-[#14223b] hover:text-[#b91c1c] transition-colors"
            >
              Motos
            </Link>
            <Link
              href="/veiculos?categoria=Caminhões"
              className="text-[#14223b] hover:text-[#b91c1c] transition-colors"
            >
              Caminhões
            </Link>
          </nav>

          {/* Action Links & CTA */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Favorites link */}
            <Link
              href="/favoritos"
              className="flex items-center gap-1.5 p-2 text-[#14223b] hover:text-[#b91c1c] transition-colors relative"
              aria-label="Ver favoritos salvos"
            >
              <div className="relative">
                <IconHeart className="size-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#e0151f] text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span className="text-[12px] font-medium hidden lg:inline">Favoritos</span>
            </Link>

            {/* Account / Login link with Role-Aware Dropdown */}
            {isMounted && isAuthenticated && user ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                  aria-label="Abrir menu da conta"
                  className="flex items-center gap-2 p-1.5 rounded-[8px] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div
                    className={`size-7 rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      role === 'dealer'
                        ? 'bg-[#4338ca]'
                        : role === 'seller'
                          ? 'bg-[#059669]'
                          : 'bg-[#17223a]'
                    }`}
                  >
                    {user.avatarInitials}
                  </div>
                  <span className="text-[12px] font-semibold text-[#14223b] hidden xl:inline max-w-[120px] truncate">
                    {user.firstName || user.name}
                  </span>
                  <IconChevronDown
                    className={`size-3 text-[#64748b] transition-transform ${
                      accountMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {accountMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Opções da conta"
                    className="absolute right-0 mt-2 w-72 rounded-[12px] bg-white p-2 shadow-xl border border-[#dde3ec] z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* Persona Header Card */}
                    <div className="p-3 bg-[#f8fafc] rounded-[8px] mb-2 border border-[#edf2f7]">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-full text-white flex items-center justify-center font-bold text-[13px] shrink-0 ${
                            role === 'dealer'
                              ? 'bg-[#4338ca]'
                              : role === 'seller'
                                ? 'bg-[#059669]'
                                : 'bg-[#17223a]'
                          }`}
                        >
                          {user.avatarInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold text-[#14223b] truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-[#64748b] truncate">{user.email}</p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              role === 'dealer'
                                ? 'bg-[#e0e7ff] text-[#3730a3]'
                                : role === 'seller'
                                  ? 'bg-[#dcfce7] text-[#166534]'
                                  : 'bg-[#e2e8f0] text-[#1e293b]'
                            }`}
                          >
                            {user.roleLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role-Specific Navigation Menu Items */}
                    <div className="space-y-0.5 text-[13px] text-[#1e293b]">
                      {role === 'dealer' &&
                        (user.status === 'active' ? (
                          <>
                            <Link
                              href="/concessionaria/anuncios"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconCar className="size-4 text-[#64748b]" />
                              <span>Estoque da frota</span>
                            </Link>
                            <Link
                              href="/concessionaria/anuncios/novo"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconPlus className="size-4 text-[#64748b]" />
                              <span>Adicionar veículo</span>
                            </Link>
                            <Link
                              href="/concessionaria/perfil"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconUser className="size-4 text-[#64748b]" />
                              <span>Perfil da loja</span>
                            </Link>
                            <Link
                              href="/concessionaria/mensagens"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconMessageSquare className="size-4 text-[#64748b]" />
                              <span>Mensagens</span>
                            </Link>
                            <Link
                              href="/concessionarias/dealer-lider-seminovos"
                              target="_blank"
                              rel="noopener noreferrer"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors text-[#2563eb]"
                            >
                              <IconCar className="size-4 text-[#2563eb]" />
                              <span>Ver showroom público ↗</span>
                            </Link>
                            <Link
                              href="/concessionaria/solicitacao/status"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors text-[#64748b]"
                            >
                              <IconFile className="size-4 text-[#64748b]" />
                              <span>Status da adesão</span>
                            </Link>
                          </>
                        ) : user.status === 'correction_required' ? (
                          <>
                            <Link
                              href="/concessionaria/solicitacao/corrigir"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors text-[#b45309] font-medium"
                            >
                              <IconFile className="size-4 text-[#b45309]" />
                              <span>Corrigir dados da loja</span>
                            </Link>
                            <Link
                              href="/concessionaria/solicitacao/status"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconFile className="size-4 text-[#64748b]" />
                              <span>Acompanhar solicitação</span>
                            </Link>
                          </>
                        ) : (
                          <Link
                            href="/concessionaria/solicitacao/status"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors font-medium text-[#b91c1c]"
                          >
                            <IconFile className="size-4 text-[#b91c1c]" />
                            <span>Acompanhar solicitação</span>
                          </Link>
                        ))}

                      {role === 'seller' &&
                        (user.status === 'active' ? (
                          <>
                            <Link
                              href="/vendedor/anuncios"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconCar className="size-4 text-[#64748b]" />
                              <span>Meus anúncios</span>
                            </Link>
                            <Link
                              href="/vendedor/anuncios/novo"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconPlus className="size-4 text-[#64748b]" />
                              <span>Criar novo anúncio</span>
                            </Link>
                            <Link
                              href="/vendedor/mensagens"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconMessageSquare className="size-4 text-[#64748b]" />
                              <span>Mensagens</span>
                            </Link>
                            <Link
                              href="/vendedor/pagamentos"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconCard className="size-4 text-[#64748b]" />
                              <span>Pagamentos</span>
                            </Link>
                            <Link
                              href="/vendedor/conta"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconUser className="size-4 text-[#64748b]" />
                              <span>Minha conta</span>
                            </Link>
                            <Link
                              href="/vendedor/solicitacao/status"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors text-[#64748b]"
                            >
                              <IconFile className="size-4 text-[#64748b]" />
                              <span>Status do cadastro</span>
                            </Link>
                          </>
                        ) : user.status === 'correction_required' ? (
                          <>
                            <Link
                              href="/vendedor/solicitacao/corrigir"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors text-[#b45309] font-medium"
                            >
                              <IconFile className="size-4 text-[#b45309]" />
                              <span>Corrigir pendências</span>
                            </Link>
                            <Link
                              href="/vendedor/solicitacao/status"
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                            >
                              <IconFile className="size-4 text-[#64748b]" />
                              <span>Acompanhar solicitação</span>
                            </Link>
                          </>
                        ) : (
                          <Link
                            href="/vendedor/solicitacao/status"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors font-medium text-[#b91c1c]"
                          >
                            <IconFile className="size-4 text-[#b91c1c]" />
                            <span>Acompanhar solicitação</span>
                          </Link>
                        ))}

                      {role === 'member' && (
                        <>
                          <Link
                            href="/conta"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                          >
                            <IconUser className="size-4 text-[#64748b]" />
                            <span>Meu perfil e conta</span>
                          </Link>
                          <Link
                            href="/favoritos"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <IconHeart className="size-4 text-[#64748b]" />
                              <span>Meus favoritos</span>
                            </div>
                            {favorites.length > 0 && (
                              <span className="bg-[#e0151f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {favorites.length}
                              </span>
                            )}
                          </Link>
                          <Link
                            href="/buscas-salvas"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                          >
                            <IconSearch className="size-4 text-[#64748b]" />
                            <span>Buscas salvas</span>
                          </Link>
                          <Link
                            href="/conta/alertas"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                          >
                            <IconFile className="size-4 text-[#64748b]" />
                            <span>Alertas de veículos</span>
                          </Link>
                          <Link
                            href="/mensagens"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                          >
                            <IconMessageSquare className="size-4 text-[#64748b]" />
                            <span>Mensagens</span>
                          </Link>
                          <Link
                            href="/conta/notificacoes"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                          >
                            <IconShield className="size-4 text-[#64748b]" />
                            <span>Notificações</span>
                          </Link>
                          <Link
                            href="/conta/senha"
                            role="menuitem"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                          >
                            <IconLock className="size-4 text-[#64748b]" />
                            <span>Segurança da conta</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-[#e2e8f0] my-1.5" />

                    <div className="space-y-0.5">
                      <Link
                        href="/ajuda"
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[13px] text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
                      >
                        <IconHelpCircle className="size-4" />
                        <span>Central de Ajuda</span>
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout('/entrar');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[13px] font-semibold text-[#dc2626] hover:bg-[#fef2f2] transition-colors text-left cursor-pointer"
                      >
                        <svg
                          className="size-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Encerrar sessão</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/entrar"
                className="flex items-center gap-1.5 p-2 text-[#14223b] hover:text-[#b91c1c] transition-colors"
                aria-label="Fazer login ou cadastrar"
              >
                <IconUser className="size-5" />
                <span className="text-[12px] font-medium hidden lg:inline">Entrar</span>
              </Link>
            )}

            {/* Messages link (points to role-appropriate messages screen) */}
            <Link
              href={messagesUrl}
              className="flex items-center gap-1.5 p-2 text-[#14223b] hover:text-[#b91c1c] transition-colors"
              aria-label="Ver mensagens"
            >
              <IconMessageSquare className="size-5" />
              <span className="text-[12px] font-medium hidden lg:inline">Mensagens</span>
            </Link>

            {/* Sell Car CTA Button (Points to role-appropriate creation flow) */}
            <Link
              href={createAdUrl}
              className="w-[162px] h-[44px] bg-[#e0151f] hover:bg-[#c41217] text-white font-semibold text-[13px] rounded-[8px] transition-colors shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <IconPlus className="size-4 stroke-[3]" />
              <span>Anunciar veículo</span>
            </Link>
          </div>
        </div>

        {/* Mobile Header (Figma 752:50: 390x125px total) */}
        <div className="md:hidden flex flex-col h-[125px]">
          {/* Mobile Top Row (Menu, Logo, Actions) */}
          <div className="h-[75px] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-[#14223b] hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Abrir menu de navegação"
              >
                <svg
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <Link href="/" className="shrink-0 flex items-center">
                <BrandLogo
                  variant="on-light"
                  priority
                  width={170}
                  height={26}
                  className="h-[26px] w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/favoritos"
                className="p-1.5 text-[#14223b] hover:text-[#b91c1c] relative"
                aria-label="Ver favoritos salvos"
              >
                <IconHeart className="size-5" />
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 bg-[#e0151f] text-white text-[9px] font-bold size-3.5 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link
                href={messagesUrl}
                className="p-1.5 text-[#14223b] hover:text-[#b91c1c]"
                aria-label="Ver mensagens"
              >
                <IconMessageSquare className="size-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Bottom Sub-row (Locality Indicator matching Figma 752:50) */}
          <div className="h-[44px] px-4 bg-white border-t border-[#e0e6f0] flex items-center justify-between">
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1.5 text-[12px] font-medium text-[#14223b] hover:text-[#b91c1c] transition-colors"
            >
              <IconPin className="size-3.5 text-[#f42524]" />
              <span className="font-semibold">{location.label}</span>
            </button>
            <button
              type="button"
              onClick={openLocationModal}
              className="text-[#62718a] hover:text-[#b91c1c] text-[11px] font-medium underline"
            >
              alterar cidade
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
          }}
        >
          <div className="w-[85%] max-w-[340px] bg-white h-full p-5 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e7ee]">
                <BrandLogo variant="on-light" width={140} height={28} className="h-6 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#62718a] hover:text-[#14223b] rounded-lg"
                  aria-label="Fechar menu"
                >
                  <IconCross className="size-5" />
                </button>
              </div>

              {/* Authenticated Persona Header Card (Mobile) */}
              {isMounted && isAuthenticated && user && (
                <div className="mt-4 p-3 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-full text-white flex items-center justify-center font-bold text-[14px] shrink-0 ${
                        role === 'dealer'
                          ? 'bg-[#4338ca]'
                          : role === 'seller'
                            ? 'bg-[#059669]'
                            : 'bg-[#17223a]'
                      }`}
                    >
                      {user.avatarInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-[#14223b] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#64748b] truncate">{user.email}</p>
                      <span
                        className={`inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          role === 'dealer'
                            ? 'bg-[#e0e7ff] text-[#3730a3]'
                            : role === 'seller'
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : 'bg-[#e2e8f0] text-[#1e293b]'
                        }`}
                      >
                        {user.roleLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-4">
                <div className="relative">
                  <IconSearch className="size-4 text-[#62718a] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar veículos..."
                    className="w-full h-10 pl-9 pr-3 bg-[#f5f7fb] rounded-[8px] text-[13px] outline-none border border-[#e2e7ee]"
                  />
                </div>
              </form>

              {/* Location Pill */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLocationModal();
                }}
                className="w-full mt-3 flex items-center justify-between p-2.5 bg-[#f0f4f8] rounded-[8px] text-[12px] text-[#14223b]"
              >
                <div className="flex items-center gap-2">
                  <IconPin className="size-4 text-[#f42524]" />
                  <span className="font-semibold">{location.label}</span>
                </div>
                <span className="text-[#b91c1c] text-[11px] font-medium">Alterar</span>
              </button>

              {/* Links List - Role-Aware */}
              <nav className="mt-5 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  Início
                </Link>
                <Link
                  href="/veiculos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  <IconCar className="size-4 text-[#62718a]" />
                  Todos os veículos
                </Link>

                {role === 'dealer' ? (
                  <>
                    {user?.status === 'active' ? (
                      <>
                        <Link
                          href="/concessionaria/anuncios"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconCar className="size-4 text-[#4338ca]" />
                          <span>Estoque da frota</span>
                        </Link>
                        <Link
                          href="/concessionaria/anuncios/novo"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconPlus className="size-4 text-[#4338ca]" />
                          <span>Adicionar veículo</span>
                        </Link>
                        <Link
                          href="/concessionaria/perfil"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconUser className="size-4 text-[#4338ca]" />
                          <span>Perfil da loja</span>
                        </Link>
                        <Link
                          href="/concessionaria/mensagens"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconMessageSquare className="size-4 text-[#4338ca]" />
                          <span>Mensagens</span>
                        </Link>
                        <Link
                          href="/concessionaria/solicitacao/status"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#64748b] hover:bg-slate-100"
                        >
                          <IconFile className="size-4 text-[#64748b]" />
                          <span>Status da adesão</span>
                        </Link>
                      </>
                    ) : user?.status === 'correction_required' ? (
                      <>
                        <Link
                          href="/concessionaria/solicitacao/corrigir"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#b45309] hover:bg-amber-50"
                        >
                          <IconFile className="size-4 text-[#b45309]" />
                          <span>Corrigir dados da loja</span>
                        </Link>
                        <Link
                          href="/concessionaria/solicitacao/status"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#64748b] hover:bg-slate-100"
                        >
                          <IconFile className="size-4 text-[#64748b]" />
                          <span>Acompanhar solicitação</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/concessionaria/solicitacao/status"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#b91c1c] hover:bg-red-50"
                      >
                        <IconFile className="size-4 text-[#b91c1c]" />
                        <span>Acompanhar solicitação</span>
                      </Link>
                    )}
                  </>
                ) : role === 'seller' ? (
                  <>
                    {user?.status === 'active' ? (
                      <>
                        <Link
                          href="/vendedor/anuncios"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconCar className="size-4 text-[#059669]" />
                          <span>Meus anúncios</span>
                        </Link>
                        <Link
                          href="/vendedor/anuncios/novo"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconPlus className="size-4 text-[#059669]" />
                          <span>Criar anúncio</span>
                        </Link>
                        <Link
                          href="/vendedor/mensagens"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconMessageSquare className="size-4 text-[#059669]" />
                          <span>Mensagens</span>
                        </Link>
                        <Link
                          href="/vendedor/pagamentos"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconCard className="size-4 text-[#059669]" />
                          <span>Pagamentos</span>
                        </Link>
                        <Link
                          href="/vendedor/conta"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                        >
                          <IconUser className="size-4 text-[#059669]" />
                          <span>Minha conta</span>
                        </Link>
                        <Link
                          href="/vendedor/solicitacao/status"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#64748b] hover:bg-slate-100"
                        >
                          <IconFile className="size-4 text-[#64748b]" />
                          <span>Status do cadastro</span>
                        </Link>
                      </>
                    ) : user?.status === 'correction_required' ? (
                      <>
                        <Link
                          href="/vendedor/solicitacao/corrigir"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#b45309] hover:bg-amber-50"
                        >
                          <IconFile className="size-4 text-[#b45309]" />
                          <span>Corrigir pendências</span>
                        </Link>
                        <Link
                          href="/vendedor/solicitacao/status"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#64748b] hover:bg-slate-100"
                        >
                          <IconFile className="size-4 text-[#64748b]" />
                          <span>Acompanhar solicitação</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/vendedor/solicitacao/status"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#b91c1c] hover:bg-red-50"
                      >
                        <IconFile className="size-4 text-[#b91c1c]" />
                        <span>Acompanhar solicitação</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/favoritos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <IconHeart className="size-4 text-[#62718a]" />
                        <span>Favoritos</span>
                      </div>
                      {favorites.length > 0 && (
                        <span className="bg-[#e0151f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/buscas-salvas"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                    >
                      <IconSearch className="size-4 text-[#62718a]" />
                      <span>Buscas salvas</span>
                    </Link>
                    <Link
                      href={isAuthenticated ? dashboardUrl : '/entrar'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                    >
                      <IconUser className="size-4 text-[#62718a]" />
                      <span>{isAuthenticated ? 'Minha conta' : 'Entrar ou cadastrar'}</span>
                    </Link>
                    <Link
                      href={messagesUrl}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                    >
                      <IconMessageSquare className="size-4 text-[#62718a]" />
                      <span>Mensagens</span>
                    </Link>
                  </>
                )}
              </nav>

              <div className="mt-5 pt-4 border-t border-[#e2e7ee] space-y-1 text-[13px] text-[#62718a]">
                <Link
                  href="/ajuda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 hover:text-[#14223b]"
                >
                  <IconHelpCircle className="size-4" />
                  Central de Ajuda
                </Link>
                <Link
                  href="/privacidade"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 hover:text-[#14223b]"
                >
                  <IconShield className="size-4" />
                  Privacidade e Termos
                </Link>
                {isMounted && isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout('/entrar');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[#dc2626] font-semibold hover:bg-red-50 rounded-[6px] text-left cursor-pointer"
                  >
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Encerrar sessão</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-4 border-t border-[#e2e7ee]">
              <Link
                href={createAdUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#e0151f] hover:bg-[#c41217] text-white font-semibold text-[13px] py-2.5 rounded-[8px] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <IconPlus className="size-4 stroke-[3]" />
                <span>Anunciar meu veículo</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      <BuyerLocationModal />

      {/* Favorites Authentication Gate Modal (Figma 840:317) */}
      <FavoritesLoginModal />
    </>
  );
}
