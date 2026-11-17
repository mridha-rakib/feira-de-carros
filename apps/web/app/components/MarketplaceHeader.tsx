'use client';

import { BrandLogo } from '@feira/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { BuyerLocationModal } from './BuyerLocationModal';
import { FavoritesLoginModal } from './FavoritesLoginModal';
import {
  IconCar,
  IconCross,
  IconHeart,
  IconHelpCircle,
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
  const { location, favorites, isAuthenticated, buyerProfile, openLocationModal } = useBuyerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/veiculos?busca=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push('/veiculos');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e0e6f0] shadow-xs">
        {/* Top Locality Strip */}
        <div className="bg-[#101d34] text-white text-[11px] h-[26px] flex items-center justify-between px-4 sm:px-8">
          <button
            type="button"
            onClick={openLocationModal}
            className="flex items-center gap-1.5 hover:text-[#fca5a5] transition-colors cursor-pointer group"
          >
            <IconPin className="size-3 text-[#f42524] group-hover:scale-110 transition-transform" />
            <span className="font-medium">{location.label}</span>
            <span className="text-[#94a3b8] text-[10px] hidden sm:inline ml-1 underline">
              (alterar cidade)
            </span>
          </button>
          <div className="hidden md:flex items-center gap-4 text-[#cbd5e1] text-[11px]">
            <Link href="/vendedor/solicitacao" className="hover:text-white transition-colors">
              Área do Vendedor
            </Link>
            <span>•</span>
            <Link href="/ajuda" className="hover:text-white transition-colors">
              Ajuda
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] sm:h-[76px] flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#14223b] hover:bg-slate-100 rounded-lg transition-colors"
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
                width={178}
                height={32}
                className="h-7 sm:h-8 w-auto"
              />
            </Link>
          </div>

          {/* Search Keyword Field */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-[380px] lg:max-w-[420px] bg-[#f5f7fb] hover:bg-[#eef2f8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#b91c1c]/20 border border-[#e2e7ee] rounded-[10px] h-[44px] px-3 transition-all"
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
          <nav className="hidden xl:flex items-center gap-5 text-[13px] text-[#14223b]">
            <Link
              href="/veiculos"
              className="font-semibold text-[#14223b] hover:text-[#b91c1c] transition-colors whitespace-nowrap"
            >
              Todos os veículos
            </Link>
            <Link
              href="/veiculos?categoria=Carros"
              className="text-[#475569] hover:text-[#b91c1c] transition-colors"
            >
              Carros
            </Link>
            <Link
              href="/veiculos?categoria=Motos"
              className="text-[#475569] hover:text-[#b91c1c] transition-colors"
            >
              Motos
            </Link>
            <Link
              href="/veiculos?categoria=Caminhões"
              className="text-[#475569] hover:text-[#b91c1c] transition-colors"
            >
              Caminhões
            </Link>
          </nav>

          {/* Action Links & CTA */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Favorites link */}
            <Link
              href="/favoritos"
              className="hidden sm:flex items-center gap-1.5 p-2 text-[#14223b] hover:text-[#b91c1c] transition-colors relative"
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

            {/* Account / Login link */}
            {isAuthenticated ? (
              <Link
                href="/conta"
                className="hidden sm:flex items-center gap-2 p-1.5 rounded-[8px] hover:bg-slate-100 transition-colors"
                aria-label="Acessar minha conta"
              >
                <div className="size-7 rounded-full bg-[#17223a] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  {buyerProfile.avatarInitials}
                </div>
                <span className="text-[12px] font-semibold text-[#14223b] hidden xl:inline">
                  {buyerProfile.firstName}
                </span>
              </Link>
            ) : (
              <Link
                href="/entrar"
                className="hidden sm:flex items-center gap-1.5 p-2 text-[#14223b] hover:text-[#b91c1c] transition-colors"
                aria-label="Fazer login ou cadastrar"
              >
                <IconUser className="size-5" />
                <span className="text-[12px] font-medium hidden lg:inline">Entrar</span>
              </Link>
            )}

            {/* Messages link */}
            <Link
              href="/mensagens"
              className="hidden sm:flex items-center gap-1.5 p-2 text-[#14223b] hover:text-[#b91c1c] transition-colors"
              aria-label="Ver mensagens"
            >
              <IconMessageSquare className="size-5" />
              <span className="text-[12px] font-medium hidden lg:inline">Mensagens</span>
            </Link>

            {/* Sell Car CTA Button */}
            <Link
              href="/vendedor/solicitacao"
              className="bg-[#e0151f] hover:bg-[#c41217] text-white font-semibold text-[12px] sm:text-[13px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[8px] transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <IconPlus className="size-4 stroke-[3]" />
              <span>Anunciar veículo</span>
            </Link>
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

              {/* Links List */}
              <nav className="mt-5 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  Início
                </Link>
                <Link
                  href="/veiculos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  <IconCar className="size-4 text-[#62718a]" />
                  Todos os veículos
                </Link>
                <Link
                  href="/veiculos?categoria=Carros"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] text-[#475569] hover:bg-slate-100 pl-9"
                >
                  Carros
                </Link>
                <Link
                  href="/veiculos?categoria=Motos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] text-[#475569] hover:bg-slate-100 pl-9"
                >
                  Motos
                </Link>
                <Link
                  href="/veiculos?categoria=Caminhões"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] text-[#475569] hover:bg-slate-100 pl-9"
                >
                  Caminhões
                </Link>
                <Link
                  href="/categorias"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  Categorias de Veículos
                </Link>
                <Link
                  href="/favoritos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  <IconSearch className="size-4 text-[#62718a]" />
                  <span>Buscas salvas</span>
                </Link>
                <Link
                  href={isAuthenticated ? '/conta' : '/entrar'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  <IconUser className="size-4 text-[#62718a]" />
                  <span>{isAuthenticated ? 'Minha conta' : 'Entrar ou cadastrar'}</span>
                </Link>
                <Link
                  href="/mensagens"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-[#14223b] hover:bg-slate-100"
                >
                  <IconMessageSquare className="size-4 text-[#62718a]" />
                  Mensagens
                </Link>
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
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-4 border-t border-[#e2e7ee]">
              <Link
                href="/vendedor/solicitacao"
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
