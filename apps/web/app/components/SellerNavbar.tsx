'use client';

import { BrandLogo } from '@feira/ui';
import Link from 'next/link';
import { useState } from 'react';
import { IconChevronDown, IconUserRound } from './SellerIcons';

interface SellerNavbarProps {
  variant?: 'applicant' | 'seller';
  activeTab?: 'inicio' | 'cadastro' | 'anuncios' | 'criar' | 'mensagens' | 'pagamentos' | 'ajuda';
}

export function SellerNavbar({ variant = 'applicant', activeTab = 'cadastro' }: SellerNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e2e7ee]">
      {/* Desktop Header */}
      <div className="hidden md:flex h-[76px] items-center px-6 lg:px-[48px] xl:px-[68px] gap-4 w-full">
        {/* Brand Logo */}
        <Link href="/" className="h-[50px] w-[164px] flex items-center shrink-0">
          <BrandLogo variant="on-light" priority width={164} height={40} className="h-8 w-auto" />
        </Link>

        {/* Flexible Space */}
        <div className="flex-1" />

        {/* Navigation Items */}
        {variant === 'applicant' ? (
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`flex flex-col items-center justify-center h-[48px] px-4 text-[14px] font-medium transition-colors ${
                activeTab === 'inicio'
                  ? 'text-[#b91c1c] font-semibold'
                  : 'text-[#141c2e] hover:text-[#b91c1c]'
              }`}
            >
              Início
              {activeTab === 'inicio' && (
                <span className="bg-[#b91c1c] h-[3px] rounded-[2px] w-[32px] mt-1" />
              )}
            </Link>

            <Link
              href="/vendedor/solicitacao/status"
              className={`flex flex-col items-center justify-center h-[48px] px-4 text-[14px] transition-colors ${
                activeTab === 'cadastro'
                  ? 'text-[#b91c1c] font-semibold'
                  : 'text-[#141c2e] font-medium hover:text-[#b91c1c]'
              }`}
            >
              Meu cadastro
              {activeTab === 'cadastro' && (
                <span className="bg-[#b91c1c] h-[3px] rounded-[2px] w-[42px] mt-1" />
              )}
            </Link>

            <Link
              href="/ajuda"
              className={`flex flex-col items-center justify-center h-[48px] px-4 text-[14px] font-medium transition-colors ${
                activeTab === 'ajuda'
                  ? 'text-[#b91c1c] font-semibold'
                  : 'text-[#141c2e] hover:text-[#b91c1c]'
              }`}
            >
              Ajuda
              {activeTab === 'ajuda' && (
                <span className="bg-[#b91c1c] h-[3px] rounded-[2px] w-[32px] mt-1" />
              )}
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-1">
            <Link
              href="/vendedor/anuncios"
              className={`flex flex-col items-center justify-center h-[48px] px-4 text-[14px] transition-colors ${
                activeTab === 'anuncios'
                  ? 'text-[#b91c1c] font-semibold'
                  : 'text-[#141c2e] font-medium hover:text-[#b91c1c]'
              }`}
            >
              Meus anúncios
              {activeTab === 'anuncios' && (
                <span className="bg-[#b91c1c] h-[3px] rounded-[2px] w-[42px] mt-1" />
              )}
            </Link>

            <Link
              href="/vendedor/anuncios/novo"
              className={`flex flex-col items-center justify-center h-[48px] px-4 text-[14px] font-medium transition-colors ${
                activeTab === 'criar'
                  ? 'text-[#b91c1c] font-semibold'
                  : 'text-[#141c2e] hover:text-[#b91c1c]'
              }`}
            >
              Criar anúncio
              {activeTab === 'criar' && (
                <span className="bg-[#b91c1c] h-[3px] rounded-[2px] w-[42px] mt-1" />
              )}
            </Link>

            <Link
              href="/vendedor/mensagens"
              className={`flex flex-col items-center justify-center h-[48px] px-4 text-[14px] font-medium transition-colors ${
                activeTab === 'mensagens'
                  ? 'text-[#b91c1c] font-semibold'
                  : 'text-[#141c2e] hover:text-[#b91c1c]'
              }`}
            >
              Mensagens
              {activeTab === 'mensagens' && (
                <span className="bg-[#b91c1c] h-[3px] rounded-[2px] w-[42px] mt-1" />
              )}
            </Link>

            <Link
              href="/vendedor/pagamentos"
              className={`flex flex-col items-center justify-center h-[48px] px-4 text-[14px] font-medium transition-colors ${
                activeTab === 'pagamentos'
                  ? 'text-[#b91c1c] font-semibold'
                  : 'text-[#141c2e] hover:text-[#b91c1c]'
              }`}
            >
              Pagamentos
              {activeTab === 'pagamentos' && (
                <span className="bg-[#b91c1c] h-[3px] rounded-[2px] w-[42px] mt-1" />
              )}
            </Link>
          </nav>
        )}

        {/* Role Indicator Badge */}
        {variant === 'applicant' ? (
          <div className="bg-[#fff7ee] border border-[#ffeedd] flex items-center justify-center gap-[7px] h-[32px] px-[10px] rounded-full shrink-0">
            <span className="size-[7px] rounded-full bg-[#f97316]" />
            <span className="text-[#a1591f] text-[11px] font-semibold">Solicitante</span>
          </div>
        ) : (
          <div className="bg-[#ebf9f0] border border-[#d6f5e1] flex items-center justify-center gap-[7px] h-[32px] px-[10px] rounded-full shrink-0">
            <span className="size-[7px] rounded-full bg-[#22c55e]" />
            <span className="text-[#26915e] text-[11px] font-semibold">Vendedor ativo</span>
          </div>
        )}

        {/* Account Separator */}
        <div className="bg-[#e2e7ee] h-[26px] w-px shrink-0 mx-1" />

        {/* Account Control */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-[#f8f9fb] border border-[#e2e7ee] flex items-center justify-between gap-2 h-[46px] px-[10px] rounded-[10px] w-[190px] text-left hover:bg-[#f1f3f7] transition-colors"
          >
            <div className="bg-[#eaeff4] flex items-center justify-center rounded-full size-[32px] shrink-0 text-[#141c2e]">
              <IconUserRound className="size-[17px]" />
            </div>
            <span className="text-[#141c2e] text-[13px] font-semibold flex-1 truncate">
              Minha conta
            </span>
            <IconChevronDown
              className={`size-[14px] text-[#566273] transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg border border-[#e2e7ee] z-50">
              <Link
                href="/vendedor/anuncios"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Meus anúncios
              </Link>
              <Link
                href="/vendedor/solicitacao/status"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Status do cadastro
              </Link>
              <div className="border-t border-gray-100 my-1" />
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sair
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Top Header (h-72px, exactly matching 627:102, 627:175, 627:246, 627:315) */}
      <div className="flex md:hidden h-[72px] items-center justify-between px-[18px] bg-white">
        <Link href="/" className="h-[43px] w-[136px] flex items-center shrink-0">
          <BrandLogo variant="on-light" priority width={136} height={34} className="h-7 w-auto" />
        </Link>

        {variant === 'applicant' ? (
          <div className="bg-[#fff2e8] border border-[#ffeedd] flex items-center justify-center h-[32px] px-[11px] rounded-[16px]">
            <span className="text-[#111827] text-[10px] font-semibold">Solicitante</span>
          </div>
        ) : (
          <div className="bg-[#e8f7ed] border border-[#cbeed4] flex items-center justify-center h-[32px] px-[11px] rounded-[16px]">
            <span className="text-[#111827] text-[10px] font-semibold">Vendedor ativo</span>
          </div>
        )}
      </div>
    </header>
  );
}
