'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { IconCross, IconHeart, IconLock, IconShield } from './SellerIcons';

export function FavoritesLoginModal() {
  const { isAuthModalOpen, closeAuthModal, authModalRedirect } = useBuyerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const loginUrl = `/entrar?redirect=${encodeURIComponent(authModalRedirect || '/veiculos')}`;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 bg-[#0e1320]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeAuthModal();
      }}
    >
      <div className="bg-white rounded-[16px] max-w-[460px] w-full p-6 sm:p-7 shadow-xl border border-[#e2e7ee] relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#62718a] hover:text-[#14223b] rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Fechar modal"
        >
          <IconCross className="size-4" />
        </button>

        {/* Modal Icon */}
        <div className="size-14 rounded-full bg-[#fff1f0] border border-[#fecaca] flex items-center justify-center mx-auto mb-4">
          <IconHeart className="size-7 text-[#e0151f]" />
        </div>

        {/* Title & Description matching Figma 840:317 */}
        <div className="text-center mb-6">
          <h3 id="auth-gate-title" className="text-[20px] font-bold text-[#14223b]">
            Acesse sua conta para salvar
          </h3>
          <p className="text-[13px] text-[#62718a] mt-2 leading-relaxed">
            Salve seus veículos favoritos, receba alertas de variação de preço e acerte propostas
            direto com os vendedores.
          </p>
        </div>

        {/* Security / Non-Fabricated Session Notice */}
        <div className="bg-[#f8f9fb] border border-[#e2e7ee] rounded-[10px] p-3.5 mb-6 text-left flex items-start gap-2.5">
          <IconShield className="size-4 text-[#1463c7] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#48566a] leading-relaxed">
            <strong className="font-semibold text-[#14223b]">Controle de Acesso:</strong> Os
            favoritos são sincronizados com o seu perfil de comprador autenticado (
            <code className="bg-slate-200/70 px-1 py-0.5 rounded font-mono text-[10px]">
              member
            </code>
            ). Visitantes convidados precisam acessar a conta.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2.5">
          <Link
            href={loginUrl}
            onClick={closeAuthModal}
            className="w-full h-[44px] bg-[#e0151f] hover:bg-[#b91c1c] text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <IconLock className="size-4" />
            <span>Entrar ou Cadastrar</span>
          </Link>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-full h-[40px] bg-white border border-[#e0e6f0] hover:bg-[#f5f7fb] text-[#14223b] font-medium text-[13px] rounded-[8px] transition-colors"
          >
            Continuar navegando como visitante
          </button>
        </div>
      </div>
    </div>
  );
}
