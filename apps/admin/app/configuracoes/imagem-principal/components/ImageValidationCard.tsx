'use client';

import { AlertCircle, Check, HelpCircle, Shield, X } from 'lucide-react';
import type * as React from 'react';
import type { StagedHeroImage } from '../../../../lib/types/hero-image';

interface ImageValidationCardProps {
  stagedImage: StagedHeroImage | null;
}

export function ImageValidationCard({ stagedImage }: ImageValidationCardProps) {
  const hasStaged = !!stagedImage;
  const validation = stagedImage?.validation;

  const formatValid = hasStaged ? validation?.formatValid : null;
  const contrastPreserved = hasStaged ? validation?.contrastPreserved : null;
  const responsiveCropValid = hasStaged ? validation?.responsiveCropValid : null;

  return (
    <div
      className="bg-white border border-[#d9e2ec] rounded-[13px] p-4 shadow-xs space-y-3"
      data-testid="card-image-validation"
    >
      {/* Header matching Figma node 2940:10420 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-[18px] font-bold text-[#131b2b]">Validação de imagem</h2>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Critérios de homologação visual
        </span>
      </div>

      {/* 3 Checks Grid matching Figma node 2940:10421-10434 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Check 1: Formato compatível */}
        <div
          className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/60 sm:bg-transparent"
          data-testid="validation-format"
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              formatValid === true
                ? 'bg-[#16a34a] text-white'
                : formatValid === false
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 text-slate-400'
            }`}
          >
            {formatValid === true ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : formatValid === false ? (
              <X className="w-3 h-3 stroke-[3]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`text-xs sm:text-[12px] font-semibold ${
                formatValid === false ? 'text-red-700' : 'text-[#131b2b]'
              }`}
            >
              Formato compatível
            </span>
            <span className="text-[10px] text-[#64748b]">
              {hasStaged
                ? formatValid
                  ? `${stagedImage?.format.toUpperCase()} válido`
                  : 'Formato rejeitado'
                : 'JPG, PNG ou WebP'}
            </span>
          </div>
        </div>

        {/* Check 2: Contraste preservado */}
        <div
          className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/60 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-slate-200/80 sm:pl-4"
          data-testid="validation-contrast"
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              contrastPreserved === true
                ? 'bg-[#16a34a] text-white'
                : contrastPreserved === false
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 text-slate-400'
            }`}
          >
            {contrastPreserved === true ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : contrastPreserved === false ? (
              <X className="w-3 h-3 stroke-[3]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`text-xs sm:text-[12px] font-semibold ${
                contrastPreserved === false ? 'text-red-700' : 'text-[#131b2b]'
              }`}
            >
              Contraste preservado
            </span>
            <span className="text-[10px] text-[#64748b]">
              {hasStaged ? 'Verificação consultiva de texto' : 'Legibilidade sob overlay'}
            </span>
          </div>
        </div>

        {/* Check 3: Recorte responsivo */}
        <div
          className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/60 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-slate-200/80 sm:pl-4"
          data-testid="validation-crop"
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              responsiveCropValid === true
                ? 'bg-[#16a34a] text-white'
                : responsiveCropValid === false
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 text-slate-400'
            }`}
          >
            {responsiveCropValid === true ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : responsiveCropValid === false ? (
              <X className="w-3 h-3 stroke-[3]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`text-xs sm:text-[12px] font-semibold ${
                responsiveCropValid === false ? 'text-red-700' : 'text-[#131b2b]'
              }`}
            >
              Recorte responsivo
            </span>
            <span className="text-[10px] text-[#64748b]">
              {hasStaged
                ? responsiveCropValid
                  ? 'Desktop e Mobile compatíveis'
                  : 'Resolução insuficiente'
                : '16:9 Desktop e 9:16 Mobile'}
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Status Note */}
      <div className="pt-1 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-[#64748b]">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Status consultivo:</strong> A validação de formato e dimensões é técnica; a
          preservação de contraste e o enquadramento do recorte dependem da revisão visual do
          administrador antes da publicação.
        </p>
      </div>
    </div>
  );
}
