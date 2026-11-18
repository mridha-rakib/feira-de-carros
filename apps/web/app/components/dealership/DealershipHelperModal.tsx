'use client';

import React from 'react';

interface DealershipHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DealershipHelperModal({ isOpen, onClose }: DealershipHelperModalProps) {
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
          <div className="bg-[#eaf2ff] rounded-full size-[47px] flex items-center justify-center shrink-0">
            <span className="font-semibold text-[#2461a5] text-[24px]">i</span>
          </div>
          <div className="flex-1">
            <h3
              id="helper-modal-title"
              className="font-semibold text-[#17243f] text-[20px] leading-tight"
            >
              Interação demonstrativa
            </h3>
            <p className="font-normal text-[#62748e] text-[14px] mt-2 leading-relaxed">
              Filtros e envio de arquivos são apresentados como componentes de interface. A
              aplicação real terá seleção, validação e atualização dos dados.
            </p>
          </div>
        </div>

        <div className="bg-[#eaf2ff] rounded-[8px] p-3 mt-4">
          <p className="font-normal text-[#2f6198] text-[11px] leading-relaxed">
            Nenhum filtro ou arquivo é processado nesta demonstração.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-white hover:bg-[#f8fafd] border border-[#dee6f0] font-semibold text-[#17243f] text-[13px] h-[46px] rounded-[8px] transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
