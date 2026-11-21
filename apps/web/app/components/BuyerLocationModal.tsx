'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { APPROVED_LOCATIONS, type BuyerLocation } from '../../lib/adapters/buyer-catalog-adapter';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { IconCheck, IconCross, IconPin, IconSearch } from './SellerIcons';

interface BuyerLocationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  standalone?: boolean;
}

export function BuyerLocationModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  standalone = false,
}: BuyerLocationModalProps) {
  const router = useRouter();
  const { location, setLocation, isLocationModalOpen, closeLocationModal } = useBuyerStore();
  const [searchTerm, setSearchTerm] = useState('');

  const isOpen = standalone || (propIsOpen ?? isLocationModalOpen);
  const handleClose = propOnClose ?? closeLocationModal;

  if (!isOpen) return null;

  const filteredLocations = APPROVED_LOCATIONS.filter((loc) =>
    loc.label.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  const handleSelectLocation = (loc: BuyerLocation) => {
    setLocation(loc.city, loc.state);
    if (!standalone) {
      handleClose();
    }
  };

  const handleApplyAndSearch = () => {
    if (!standalone) {
      handleClose();
    }
    router.push(
      `/veiculos?cidade=${encodeURIComponent(location.city)}&estado=${encodeURIComponent(location.state)}`,
    );
  };

  const content = (
    <div className="bg-white rounded-[16px] border border-[#dae1e9] shadow-xl w-full max-w-[840px] overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="p-6 border-b border-[#e2e7ee] flex items-center justify-between">
        <div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0e1420]">
            Escolha sua localização
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#657386] mt-1">
            Selecione estado e cidade para explorar anúncios da região desejada.
          </p>
        </div>
        {!standalone && (
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-[#657386] hover:text-[#0e1420] rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Fechar"
          >
            <IconCross className="size-5" />
          </button>
        )}
      </div>

      {/* Body: Two columns on desktop */}
      <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Cities List */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="relative">
            <IconSearch className="size-4 text-[#657386] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar cidade ou estado..."
              className="w-full h-[46px] pl-10 pr-4 bg-[#f0f4f8] rounded-[9px] border border-transparent focus:border-[#dae1e9] focus:bg-white text-[13px] text-[#0e1420] outline-none transition-all placeholder:text-[#657386]"
            />
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {filteredLocations.map((loc) => {
              const isSelected =
                location.city.toLowerCase() === loc.city.toLowerCase() &&
                location.state.toLowerCase() === loc.state.toLowerCase();

              return (
                <button
                  type="button"
                  key={loc.label}
                  onClick={() => handleSelectLocation(loc)}
                  className={`w-full flex items-center gap-3.5 p-3 rounded-[10px] text-left transition-all ${
                    isSelected
                      ? 'bg-[#ffeded] border border-[#fca5a5]'
                      : 'bg-[#f0f4f8] hover:bg-[#e6ecf3] border border-transparent'
                  }`}
                >
                  <div
                    className={`size-9 rounded-full flex items-center justify-center shrink-0 text-[14px] font-bold ${
                      isSelected ? 'bg-[#f42524] text-white' : 'bg-white text-[#657386]'
                    }`}
                  >
                    {isSelected ? <IconCheck className="size-5" /> : <IconPin className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#0e1420]">{loc.label}</p>
                    <p className="text-[11px] text-[#657386]">
                      {isSelected
                        ? 'Cidade selecionada'
                        : loc.isInitial
                          ? 'Localidade inicial recomendada'
                          : 'Exemplo ilustrativo'}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredLocations.length === 0 && (
              <div className="text-center py-8 text-[#657386] text-[13px]">
                Nenhuma localidade encontrada com o termo pesquisado.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Applied State & GPS Notice */}
        <div className="md:col-span-5 flex flex-col gap-4 justify-between border-t md:border-t-0 md:border-l border-[#e2e7ee] pt-4 md:pt-0 md:pl-6">
          <div className="space-y-4">
            <div>
              <p className="text-[12px] font-semibold text-[#657386] uppercase tracking-wide">
                Localização Selecionada
              </p>
              <div className="bg-[#ffeded] rounded-[10px] p-4 mt-2 border border-[#fecaca]">
                <p className="text-[16px] font-bold text-[#0e1420]">
                  {location.city} · {location.state}
                </p>
                <p className="text-[12px] text-[#657386] mt-1">
                  Apresentar anúncios disponíveis nesta localidade.
                </p>
              </div>
            </div>

            <div className="bg-[#f0f4f8] rounded-[10px] p-3.5 border border-[#e2e7ee]">
              <p className="text-[12px] font-semibold text-[#0e1420]">
                Sem acesso automático ao GPS
              </p>
              <p className="text-[11px] text-[#657386] mt-1 leading-relaxed">
                O usuário escolhe a cidade manualmente; busca por raio não está habilitada nesta
                fase.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleApplyAndSearch}
              className="w-full h-[46px] bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold text-[13px] rounded-[9px] transition-colors flex items-center justify-center shadow-sm"
            >
              Ver anúncios em {location.city}, {location.state}
            </button>
            {!standalone ? (
              <button
                type="button"
                onClick={handleClose}
                className="w-full h-[42px] bg-[#f0f4f8] hover:bg-[#e6ecf3] text-[#0e1420] font-medium text-[12px] rounded-[9px] transition-colors"
              >
                Voltar ao início
              </button>
            ) : (
              <Link
                href="/"
                className="w-full h-[42px] bg-[#f0f4f8] hover:bg-[#e6ecf3] text-[#0e1420] font-medium text-[12px] rounded-[9px] transition-colors flex items-center justify-center"
              >
                Voltar ao início
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return content;
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose();
      }}
    >
      {content}
    </div>
  );
}
