'use client';

import { AlertTriangle } from 'lucide-react';
import type * as React from 'react';

interface MobileSettingsRestrictedBannerProps {
  moduleName?: string;
}

export function MobileSettingsRestrictedBanner({
  moduleName = 'configurações comerciais',
}: MobileSettingsRestrictedBannerProps) {
  return (
    <div
      data-testid="mobile-settings-restricted-banner"
      className="lg:hidden p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 flex items-start gap-2.5 mb-4"
    >
      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
      <div>
        <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
          CONFIGURAÇÃO RESTRITA AO DESKTOP (ADM-019)
        </strong>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          A alteração de {moduleName}, precificação e parâmetros do catálogo é exclusiva da
          interface desktop pelo Main Admin. Dispositivos móveis operam em modo somente leitura até
          a liberação do módulo dedicado ADM-M-011.
        </p>
      </div>
    </div>
  );
}
