'use client';

import Link from 'next/link';
import React from 'react';

interface DealershipSubNavProps {
  activeItem?: 'compradores' | 'vender' | 'concessionarias' | 'ajuda';
}

export function DealershipSubNav({ activeItem = 'concessionarias' }: DealershipSubNavProps) {
  return (
    <div className="w-full bg-white border-b border-[#dee6f1] text-[12px] leading-[1.26]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[70px] h-[34px] flex items-center gap-6 sm:gap-8">
        <Link
          href="/"
          className={`transition-colors ${
            activeItem === 'compradores'
              ? 'font-semibold text-[#f42524]'
              : 'font-normal text-[#697a95] hover:text-[#17243f]'
          }`}
        >
          Compradores
        </Link>
        <Link
          href="/vendedor/solicitacao"
          className={`transition-colors ${
            activeItem === 'vender'
              ? 'font-semibold text-[#f42524]'
              : 'font-normal text-[#697a95] hover:text-[#17243f]'
          }`}
        >
          Vender
        </Link>
        <Link
          href="/concessionaria/solicitacao"
          className={`transition-colors ${
            activeItem === 'concessionarias'
              ? 'font-semibold text-[#f42524]'
              : 'font-normal text-[#697a95] hover:text-[#17243f]'
          }`}
        >
          Concessionárias
        </Link>
        <Link
          href="/ajuda"
          className={`transition-colors ${
            activeItem === 'ajuda'
              ? 'font-semibold text-[#f42524]'
              : 'font-normal text-[#697a95] hover:text-[#17243f]'
          }`}
        >
          Ajuda
        </Link>
      </div>
    </div>
  );
}
