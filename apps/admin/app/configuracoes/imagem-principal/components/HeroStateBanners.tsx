'use client';

import { AlertTriangle, CheckCircle2, Lock, RefreshCw, XCircle } from 'lucide-react';
import type * as React from 'react';
import type { HeroImagePageState } from '../../../../lib/types/hero-image';

interface HeroStateBannersProps {
  pageState: HeroImagePageState;
  errorMessage?: string;
  successTimestamp?: string;
  onRetry?: () => void;
  onDismissAlert?: () => void;
  progressPercent?: number;
}

export function HeroStateBanners({
  pageState,
  errorMessage,
  successTimestamp,
  onRetry,
  onDismissAlert,
  progressPercent = 68,
}: HeroStateBannersProps) {
  if (pageState === 'IDLE' || pageState === 'STAGED') {
    return null;
  }

  return (
    <div className="space-y-4" data-testid="hero-state-banners">
      {/* STATE-01 / Validating upload and publishing (Figma node 2942:10298) */}
      {pageState === 'VALIDATING' && (
        <div
          className="bg-white border border-[#d9e2ec] rounded-[13px] p-5 shadow-xs space-y-3"
          data-testid="state-banner-validating"
        >
          <div className="inline-block px-3 py-1 rounded-[9px] bg-[#e7f1ff] text-[#1d4ed8] text-[12px] font-semibold">
            Processando...
          </div>
          <h3 className="text-lg font-bold text-[#131b2b]">Validando nova imagem</h3>
          <p className="text-xs sm:text-[12px] text-[#526176] leading-relaxed">
            Aguarde enquanto a imagem é verificada. A imagem publicada não será alterada.
          </p>

          <div className="space-y-1 pt-1">
            <div className="w-full h-[9px] rounded-[6px] bg-[#e2e8f0] overflow-hidden">
              <div
                className="h-full bg-[#f42524] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#64748b] font-mono">
              {progressPercent}% · Etapa de validação
            </p>
          </div>
        </div>
      )}

      {/* STATE-02 / Invalid file and rejection (Figma node 2942:10306) */}
      {pageState === 'REJECTED' && (
        <div
          className="bg-white border border-[#fbcaca] rounded-[13px] p-5 shadow-xs space-y-3"
          data-testid="state-banner-rejected"
        >
          <div className="flex items-center justify-between">
            <div className="inline-block px-3 py-1 rounded-[9px] bg-[#fee2e2] text-[#b91c1c] text-[12px] font-semibold">
              Arquivo rejeitado
            </div>
            {onDismissAlert && (
              <button
                type="button"
                onClick={onDismissAlert}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Fechar aviso
              </button>
            )}
          </div>

          <h3 className="text-lg font-bold text-[#991b1b]">
            Não foi possível utilizar esta imagem
          </h3>
          <p className="text-xs sm:text-[12px] text-[#7f1d1d] leading-relaxed">
            {errorMessage ||
              'Arquivo incompatível, corrompido ou acima do limite permitido. Selecione uma imagem segura e válida.'}
          </p>

          <p className="text-[12px] text-[#64748b] font-medium pt-1 border-t border-red-100">
            A imagem publicada atualmente permanece ativa.
          </p>
        </div>
      )}

      {/* STATE-03 / Successful publication and audit (Figma node 2942:10312) */}
      {pageState === 'SUCCESS' && (
        <div
          className="bg-white border border-[#86cda4] rounded-[13px] p-5 shadow-xs space-y-3"
          data-testid="state-banner-success"
        >
          <div className="flex items-center justify-between">
            <div className="inline-block px-3 py-1 rounded-[9px] bg-[#dcfce7] text-[#166534] text-[12px] font-semibold">
              Imagem publicada
            </div>
            {onDismissAlert && (
              <button
                type="button"
                onClick={onDismissAlert}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Dispensar
              </button>
            )}
          </div>

          <h3 className="text-lg font-bold text-[#166534]">
            Imagem principal atualizada com sucesso
          </h3>
          <p className="text-xs sm:text-[12px] text-[#475569] leading-relaxed">
            A nova imagem será exibida na homepage em desktop e mobile após atualização de cache.
          </p>

          <div className="bg-[#f0fdf4] rounded-[6px] px-3 py-2 text-[11px] font-medium text-[#166534]">
            Registro: Administrador principal • Publicado em{' '}
            {successTimestamp ||
              new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
          </div>
        </div>
      )}

      {/* STATE-04 / Publish failure and fallback (Figma node 2942:10319) */}
      {pageState === 'FAILURE' && (
        <div
          className="bg-white border border-[#fbbf24] rounded-[13px] p-5 shadow-xs space-y-3"
          data-testid="state-banner-fallback"
        >
          <div className="inline-block px-3 py-1 rounded-[9px] bg-[#fef3c7] text-[#92400e] text-[12px] font-semibold">
            Falha ao publicar • Fallback
          </div>
          <h3 className="text-lg font-bold text-[#92400e]">A imagem anterior continua publicada</h3>
          <p className="text-xs sm:text-[12px] text-[#5b6271] leading-relaxed">
            {errorMessage ||
              'Não foi possível concluir a publicação. Nenhuma alteração foi aplicada à imagem visível da homepage.'}
          </p>

          {onRetry && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[7px] bg-white border border-[#f59e0b] text-[#92400e] font-semibold text-xs sm:text-[12px] hover:bg-amber-50 transition-colors shadow-2xs"
                data-testid="button-retry-publish"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar novamente</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STATE-05 / Restricted access - non Main Admin (Figma node 2942:10326) */}
      {pageState === 'RESTRICTED' && (
        <div
          className="bg-white border border-[#fbcaca] rounded-[13px] p-5 shadow-xs space-y-3"
          data-testid="state-banner-restricted"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[9px] bg-[#fee2e2] text-[#b91c1c] text-[12px] font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Acesso restrito</span>
          </div>
          <h3 className="text-lg font-bold text-[#991b1b]">Permissão insuficiente</h3>
          <p className="text-xs sm:text-[12px] text-[#7f1d1d] leading-relaxed">
            Apenas o administrador principal pode carregar, substituir ou publicar a imagem do Hero.
            Outros perfis não podem alterar o conteúdo.
          </p>
          <p className="text-[11px] text-[#64748b] font-medium pt-1 border-t border-red-100">
            Design state · A verificação real deverá ocorrer no servidor.
          </p>
        </div>
      )}
    </div>
  );
}
