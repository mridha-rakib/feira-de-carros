'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  type PublicVehicleItem,
  recordPhoneRevealInteraction,
} from '../../lib/adapters/buyer-catalog-adapter';
import { IconAlert, IconCheck, IconCross, IconMessageSquare, IconPhone } from './SellerIcons';

interface SellerPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: PublicVehicleItem;
}

export function SellerPhoneModal({ isOpen, onClose, vehicle }: SellerPhoneModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Record mock telemetry for anti-scraping and seller leads
      recordPhoneRevealInteraction(vehicle.id, vehicle.sellerType);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCopied(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, vehicle.id, vehicle.sellerType, onClose]);

  if (!isOpen) return null;

  const rawDigits = vehicle.contactPhoneFull.replace(/\D/g, '');
  const telHref = `tel:+55${rawDigits}`;
  const whatsappHref = `https://wa.me/55${rawDigits}?text=${encodeURIComponent(
    `Olá! Vi seu anúncio do ${vehicle.title} (${vehicle.version}) na Feira de Carros e gostaria de mais informações.`,
  )}`;

  const handleCopyPhone = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(vehicle.contactPhoneFull);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 bg-[#0e1320]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white rounded-[16px] max-w-[480px] w-full p-5 sm:p-7 shadow-xl border border-[#e2e7ee] relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#62718a] hover:text-[#14223b] rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Fechar"
        >
          <IconCross className="size-4" />
        </button>

        {/* Header matching Figma 1211:2518 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-full bg-[#eef5fc] border border-[#d2e4f7] flex items-center justify-center shrink-0">
            <IconPhone className="size-5 text-[#1463c7]" />
          </div>
          <div>
            <h3
              id="seller-phone-title"
              className="text-[18px] sm:text-[20px] font-bold text-[#14223b]"
            >
              Telefone do anunciante
            </h3>
            <p className="text-[12px] text-[#62718a]">
              Entre em contato direto para tirar dúvidas ou agendar visita
            </p>
          </div>
        </div>

        {/* Vehicle Mini Summary Card */}
        <div className="bg-[#f8f9fb] border border-[#e0e6f0] rounded-[10px] p-3 flex items-center gap-3 mb-5">
          <div className="relative size-14 rounded-[8px] overflow-hidden bg-slate-200 shrink-0">
            <Image
              src={vehicle.imageUrl}
              alt={vehicle.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-bold text-[#14223b] truncate">{vehicle.title}</h4>
            <p className="text-[11px] text-[#62718a] truncate">{vehicle.version}</p>
            <p className="text-[14px] font-bold text-[#e0151f] mt-0.5">{vehicle.priceFormatted}</p>
          </div>
        </div>

        {/* Seller Info & Revealed Phone */}
        <div className="bg-[#fff8f8] border border-[#fcd8d8] rounded-[12px] p-4 text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-[#14223b]">{vehicle.sellerName}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#e2e7ee] text-[#48566a]">
              {vehicle.sellerType === 'concessionaria' ? 'Concessionária' : 'Particular'}
            </span>
          </div>
          {vehicle.sellerResponseTime && (
            <p className="text-[11px] text-[#62718a] mb-3">{vehicle.sellerResponseTime}</p>
          )}

          {/* Formatted Phone Display */}
          <div className="bg-white border border-[#f0c2c2] rounded-[8px] py-3 px-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <IconPhone className="size-5 text-[#e0151f]" />
              <span className="text-[20px] sm:text-[22px] font-black text-[#14223b] tracking-wider">
                {vehicle.contactPhoneFull}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="text-[12px] font-semibold text-[#1463c7] hover:underline flex items-center gap-1"
            >
              {copied ? (
                <>
                  <IconCheck className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copiado!</span>
                </>
              ) : (
                <span>Copiar</span>
              )}
            </button>
          </div>

          <p className="text-[10px] text-[#8c9ba5] uppercase tracking-wider font-semibold mt-2">
            DEMO DATA · Telefone simulado
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <a
            href={telHref}
            className="h-[44px] bg-[#14223b] hover:bg-[#0e1320] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <IconPhone className="size-4" />
            <span>Ligar agora</span>
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[44px] bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[13px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <IconMessageSquare className="size-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Security / Anti-Fraud Advice */}
        <div className="bg-[#f5f7fb] border border-[#e0e6f0] rounded-[10px] p-3 text-left">
          <div className="flex items-start gap-2">
            <IconAlert className="size-4 text-[#d97706] shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-[#14223b] mb-1">
                Dicas de segurança da Feira de Carros:
              </p>
              <ul className="text-[11px] text-[#62718a] space-y-0.5 list-disc list-inside">
                <li>Nunca faça depósitos, adiantamentos ou pagamentos de sinal.</li>
                <li>Desconfie de valores muito abaixo do mercado da região.</li>
                <li>Verifique o veículo e o laudo cautelar presencialmente.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
