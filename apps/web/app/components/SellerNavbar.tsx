'use client';

import { BrandLogo } from '@feira/ui';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCurrentAuth } from '../../lib/hooks/use-current-auth';
import {
  IconCar,
  IconCard,
  IconChevronDown,
  IconFile,
  IconHelpCircle,
  IconMessageSquare,
  IconPlus,
  IconUser,
  IconUserRound,
} from './SellerIcons';

interface SellerNavbarProps {
  variant?: 'applicant' | 'seller';
  activeTab?: 'inicio' | 'cadastro' | 'anuncios' | 'criar' | 'mensagens' | 'pagamentos' | 'ajuda';
}

export function SellerNavbar({ variant = 'applicant', activeTab = 'cadastro' }: SellerNavbarProps) {
  const { user, isMounted, isAuthenticated, logout } = useCurrentAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const displayName =
    isMounted && isAuthenticated && user ? user.firstName || user.name : 'Minha conta';

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

        {/* Account Control with Accessible Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Menu do vendedor"
            className="bg-[#f8f9fb] border border-[#e2e7ee] flex items-center justify-between gap-2 h-[46px] px-[10px] rounded-[10px] min-w-[170px] max-w-[210px] text-left hover:bg-[#f1f3f7] transition-colors cursor-pointer"
          >
            <div className="bg-[#059669] text-white flex items-center justify-center rounded-full size-[32px] shrink-0 font-bold text-[11px]">
              {user?.avatarInitials || <IconUserRound className="size-[17px] text-white" />}
            </div>
            <span className="text-[#141c2e] text-[13px] font-semibold flex-1 truncate">
              {displayName}
            </span>
            <IconChevronDown
              className={`size-[14px] text-[#566273] transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="Opções do vendedor"
              className="absolute right-0 mt-2 w-64 rounded-[12px] bg-white p-2 shadow-xl border border-[#e2e7ee] z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              {/* Header */}
              {isMounted && isAuthenticated && user && (
                <div className="p-3 bg-[#f8fafc] rounded-[8px] mb-2 border border-[#edf2f7]">
                  <p className="text-[13px] font-bold text-[#14223b] truncate">{user.name}</p>
                  <p className="text-[11px] text-[#64748b] truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534]">
                    {user.roleLabel}
                  </span>
                </div>
              )}

              <div className="space-y-0.5 text-[13px] text-[#1e293b]">
                <Link
                  href="/vendedor/anuncios"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                >
                  <IconCar className="size-4 text-[#64748b]" />
                  <span>Meus anúncios</span>
                </Link>
                <Link
                  href="/vendedor/anuncios/novo"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                >
                  <IconPlus className="size-4 text-[#64748b]" />
                  <span>Criar anúncio</span>
                </Link>
                <Link
                  href="/vendedor/mensagens"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                >
                  <IconMessageSquare className="size-4 text-[#64748b]" />
                  <span>Mensagens</span>
                </Link>
                <Link
                  href="/vendedor/pagamentos"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                >
                  <IconCard className="size-4 text-[#64748b]" />
                  <span>Pagamentos</span>
                </Link>
                <Link
                  href="/vendedor/conta"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors"
                >
                  <IconUser className="size-4 text-[#64748b]" />
                  <span>Minha conta</span>
                </Link>
                <Link
                  href="/vendedor/solicitacao/status"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#f1f5f9] transition-colors text-[#64748b]"
                >
                  <IconFile className="size-4 text-[#64748b]" />
                  <span>Status do cadastro</span>
                </Link>
              </div>

              <div className="border-t border-[#e2e8f0] my-1.5" />

              <div className="space-y-0.5">
                <Link
                  href="/ajuda"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[13px] text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
                >
                  <IconHelpCircle className="size-4" />
                  <span>Central de Ajuda</span>
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
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
      </div>

      {/* Mobile Top Header (h-72px, exactly matching 627:102, 627:175, 627:246, 627:315) */}
      <div className="flex md:hidden h-[72px] items-center justify-between px-[18px] bg-white">
        <Link href="/" className="h-[43px] w-[136px] flex items-center shrink-0">
          <BrandLogo variant="on-light" priority width={136} height={34} className="h-7 w-auto" />
        </Link>

        <div className="flex items-center gap-2">
          {variant === 'applicant' ? (
            <div className="bg-[#fff2e8] border border-[#ffeedd] flex items-center justify-center h-[32px] px-[11px] rounded-[16px]">
              <span className="text-[#111827] text-[10px] font-semibold">Solicitante</span>
            </div>
          ) : (
            <div className="bg-[#e8f7ed] border border-[#cbeed4] flex items-center justify-center h-[32px] px-[11px] rounded-[16px]">
              <span className="text-[#111827] text-[10px] font-semibold">Vendedor ativo</span>
            </div>
          )}
          {isMounted && isAuthenticated && (
            <button
              type="button"
              onClick={() => logout('/entrar')}
              aria-label="Sair da conta"
              className="p-1.5 text-[#dc2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
