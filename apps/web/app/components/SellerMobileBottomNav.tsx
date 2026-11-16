'use client';

import Link from 'next/link';
import { IconCar, IconMessageSquare, IconSettings, IconUsers } from './SellerIcons';

interface SellerMobileBottomNavProps {
  activeTab?: 'inicio' | 'cadastro' | 'anuncios' | 'criar' | 'mensagens' | 'ajuda' | 'conta';
  userRole?: 'applicant' | 'seller';
}

/**
 * Reusable Seller Mobile Navigation Bar matching Figma 624:21 (Applicant) and 624:48 (Approved Seller).
 * Exactly 4 equal 89px width touch targets with centered icons and labels.
 */
export function SellerMobileBottomNav({
  activeTab = 'cadastro',
  userRole = 'applicant',
}: SellerMobileBottomNavProps) {
  if (userRole === 'applicant') {
    // Figma Component 624:21 (FDC / Seller / Mobile Bottom Nav / Applicant)
    return (
      <nav
        aria-label="Navegação móvel do solicitante"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#d1d5db] flex md:hidden h-[78px] items-center justify-between px-[10px] pb-[7px] pt-[8px] shadow-lg"
      >
        {/* Tab 1: Início */}
        <Link
          href="/"
          className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
        >
          <div
            className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
              activeTab === 'inicio' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            <IconCar className="size-[18px]" />
          </div>
          <span
            className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
              activeTab === 'inicio' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            Início
          </span>
        </Link>

        {/* Tab 2: Cadastro */}
        <Link
          href="/vendedor/solicitacao/status"
          className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
        >
          <div
            className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
              activeTab === 'cadastro' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            <IconUsers className="size-[18px]" />
          </div>
          <span
            className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
              activeTab === 'cadastro' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            Cadastro
          </span>
        </Link>

        {/* Tab 3: Ajuda */}
        <Link
          href="/ajuda"
          className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
        >
          <div
            className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
              activeTab === 'ajuda' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            <IconMessageSquare className="size-[18px]" />
          </div>
          <span
            className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
              activeTab === 'ajuda' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            Ajuda
          </span>
        </Link>

        {/* Tab 4: Conta */}
        <Link
          href="/vendedor/conta"
          className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
        >
          <div
            className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
              activeTab === 'conta' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            <IconSettings className="size-[18px]" />
          </div>
          <span
            className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
              activeTab === 'conta' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            Conta
          </span>
        </Link>
      </nav>
    );
  }

  // Figma Component 624:48 (FDC / Seller / Mobile Bottom Nav / Approved Seller)
  return (
    <nav
      aria-label="Navegação móvel do vendedor aprovado"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#d1d5db] flex md:hidden h-[78px] items-center justify-between px-[10px] pb-[7px] pt-[8px] shadow-lg"
    >
      {/* Tab 1: Anúncios */}
      <Link
        href="/vendedor/anuncios"
        className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
      >
        <div
          className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
            activeTab === 'anuncios' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          <IconCar className="size-[18px]" />
        </div>
        <span
          className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
            activeTab === 'anuncios' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          Anúncios
        </span>
      </Link>

      {/* Tab 2: Criar */}
      <Link
        href="/vendedor/anuncios/novo"
        className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
      >
        <div
          className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
            activeTab === 'criar' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          <IconCar className="size-[18px]" />
        </div>
        <span
          className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
            activeTab === 'criar' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          Criar
        </span>
      </Link>

      {/* Tab 3: Mensagens */}
      <Link
        href="/vendedor/mensagens"
        className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
      >
        <div
          className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
            activeTab === 'mensagens' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          <IconMessageSquare className="size-[18px]" />
        </div>
        <span
          className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
            activeTab === 'mensagens' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          Mensagens
        </span>
      </Link>

      {/* Tab 4: Conta */}
      <Link
        href="/vendedor/conta"
        className="flex flex-col gap-[3px] h-[62px] items-center justify-center overflow-clip w-[89px]"
      >
        <div
          className={`flex items-center justify-center rounded-[8px] size-[24px] shrink-0 transition-colors ${
            activeTab === 'conta' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          <IconUsers className="size-[18px]" />
        </div>
        <span
          className={`text-[11px] font-semibold leading-[16px] text-center w-[78px] truncate ${
            activeTab === 'conta' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          Conta
        </span>
      </Link>
    </nav>
  );
}
