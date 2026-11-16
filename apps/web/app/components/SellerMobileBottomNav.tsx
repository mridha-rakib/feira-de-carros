'use client';

import Link from 'next/link';
import { IconCar, IconMessageSquare, IconSettings, IconUsers } from './SellerIcons';

interface SellerMobileBottomNavProps {
  activeTab?: 'inicio' | 'cadastro' | 'anuncios' | 'mensagens' | 'ajuda' | 'perfil';
  userRole?: 'applicant' | 'seller';
}

export function SellerMobileBottomNav({
  activeTab = 'cadastro',
  userRole = 'applicant',
}: SellerMobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#d1d5db] flex md:hidden h-[78px] items-center justify-around px-2 pb-2 pt-1 shadow-lg">
      {/* Tab 1: Início */}
      <Link href="/" className="flex flex-col items-center justify-center h-[62px] w-[75px]">
        <div
          className={`flex items-center justify-center rounded-[10px] size-[28px] ${
            activeTab === 'inicio' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          <IconCar className="size-[18px]" />
        </div>
        <span
          className={`text-[11px] font-semibold mt-1 ${
            activeTab === 'inicio' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          Início
        </span>
      </Link>

      {/* Tab 2: Cadastro or Anúncios */}
      {userRole === 'applicant' ? (
        <Link
          href="/vendedor/solicitacao/status"
          className="flex flex-col items-center justify-center h-[62px] w-[75px]"
        >
          <div
            className={`flex items-center justify-center rounded-[10px] size-[28px] ${
              activeTab === 'cadastro' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            <IconUsers className="size-[18px]" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-1 ${
              activeTab === 'cadastro' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            Cadastro
          </span>
        </Link>
      ) : (
        <Link
          href="/vendedor/anuncios"
          className="flex flex-col items-center justify-center h-[62px] w-[75px]"
        >
          <div
            className={`flex items-center justify-center rounded-[10px] size-[28px] ${
              activeTab === 'anuncios' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            <IconCar className="size-[18px]" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-1 ${
              activeTab === 'anuncios' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
            }`}
          >
            Anúncios
          </span>
        </Link>
      )}

      {/* Tab 3: Mensagens */}
      <Link
        href="/vendedor/mensagens"
        className="flex flex-col items-center justify-center h-[62px] w-[75px]"
      >
        <div
          className={`flex items-center justify-center rounded-[10px] size-[28px] ${
            activeTab === 'mensagens' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          <IconMessageSquare className="size-[18px]" />
        </div>
        <span
          className={`text-[11px] font-semibold mt-1 ${
            activeTab === 'mensagens' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          Mensagens
        </span>
      </Link>

      {/* Tab 4: Ajuda / Configurações */}
      <Link href="/ajuda" className="flex flex-col items-center justify-center h-[62px] w-[75px]">
        <div
          className={`flex items-center justify-center rounded-[10px] size-[28px] ${
            activeTab === 'ajuda' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          <IconSettings className="size-[18px]" />
        </div>
        <span
          className={`text-[11px] font-semibold mt-1 ${
            activeTab === 'ajuda' ? 'text-[#b91c1c]' : 'text-[#4b5563]'
          }`}
        >
          Ajuda
        </span>
      </Link>
    </nav>
  );
}
