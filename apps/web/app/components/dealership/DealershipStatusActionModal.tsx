'use client';

import Link from 'next/link';
import React from 'react';

interface DealershipStatusActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DealershipStatusActionModal({ isOpen, onClose }: DealershipStatusActionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white border border-[#dee6f0] rounded-[16px] max-w-[485px] w-full p-6 shadow-2xl relative">
        <div className="flex items-start gap-4">
          <div className="bg-[#fcebec] rounded-full size-[47px] flex items-center justify-center shrink-0">
            <span className="font-semibold text-[#b91c1c] text-[24px]">!</span>
          </div>
          <div className="flex-1">
            <h3
              id="status-modal-title"
              className="font-semibold text-[#17243f] text-[20px] leading-tight"
            >
              Gerenciar status do anúncio
            </h3>
            <p className="font-normal text-[#62748e] text-[14px] mt-2 leading-relaxed">
              Ativar, pausar ou renovar anúncios depende do estado atual e das permissões. A
              alteração real terá confirmação.
            </p>
          </div>
        </div>

        <div className="bg-[#eaf2ff] rounded-[8px] p-3 mt-4">
          <p className="font-normal text-[#2f6198] text-[11px] leading-relaxed">
            Este é um estado ilustrativo; o status não é alterado no protótipo.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-white hover:bg-[#f8fafd] border border-[#dee6f0] font-semibold text-[#17243f] text-[13px] h-[46px] rounded-[8px] transition-colors"
          >
            Cancelar
          </button>
          <Link
            href="/concessionaria/anuncios"
            className="w-full bg-[#b91c1c] hover:bg-[#a11818] font-semibold text-white text-[13px] h-[46px] rounded-[8px] flex items-center justify-center transition-colors"
          >
            Ver meu estoque
          </Link>
        </div>
      </div>
    </div>
  );
}
