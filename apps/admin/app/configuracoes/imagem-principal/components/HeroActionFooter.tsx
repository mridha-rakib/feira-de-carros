'use client';

import { Info, Loader2, RotateCcw, UploadCloud, XCircle } from 'lucide-react';
import type * as React from 'react';
import type { AdminRole, StagedHeroImage } from '../../../../lib/types/hero-image';

interface HeroActionFooterProps {
  stagedImage: StagedHeroImage | null;
  onDiscard: () => void;
  onPublish: () => void;
  onResetDefault: () => void;
  isLoading: boolean;
  currentRole: AdminRole;
}

export function HeroActionFooter({
  stagedImage,
  onDiscard,
  onPublish,
  onResetDefault,
  isLoading,
  currentRole,
}: HeroActionFooterProps) {
  const isRestricted = currentRole !== 'main_admin';
  const hasStaged = !!stagedImage;
  const isPublishDisabled =
    !hasStaged || !stagedImage?.validation?.overallValid || isLoading || isRestricted;

  return (
    <div
      className="bg-white border-t border-[#d9e2ec] pt-5 pb-8 space-y-3"
      data-testid="hero-action-footer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Info text matching Figma node 2940:10440 */}
        <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#334155] font-medium">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Nenhuma alteração será aplicada antes da publicação.</span>
        </div>

        {/* Action Buttons matching Figma node 2940:10441-10446 */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Reset to Canonical initial default (helpful utility) */}
          <button
            type="button"
            onClick={onResetDefault}
            disabled={isLoading || isRestricted}
            className="px-3 py-2 rounded-[9px] border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40"
            title="Restaurar imagem padrão oficial inicial (hero-desktop.png)"
            data-testid="button-reset-canonical"
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
            Restaurar original
          </button>

          {/* Discard changes button matching Figma node 2940:10441 */}
          <button
            type="button"
            onClick={onDiscard}
            disabled={!hasStaged || isLoading}
            className="px-4 py-2.5 rounded-[9px] bg-white border border-[#94a3b8] text-[#131b2b] font-semibold text-xs sm:text-[14px] hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            data-testid="button-discard-changes"
          >
            Descartar alterações
          </button>

          {/* Publish image button matching Figma node 2940:10443 */}
          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishDisabled}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[9px] bg-[#e31921] hover:bg-[#c7151c] text-white font-semibold text-xs sm:text-[14px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            data-testid="button-publish-image"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publicando imagem…</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Salvar e publicar imagem</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footnote matching Figma node 2940:10447 */}
      <p className="text-[11px] text-[#63728a] font-medium leading-relaxed">
        CR-003 • Alteração visual da homepage. Banners promocionais (CR-002) não são afetados.
      </p>
    </div>
  );
}
