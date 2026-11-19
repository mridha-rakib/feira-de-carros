'use client';

import { useEffect, useState } from 'react';
import { isClientDemoPreviewEnvironment } from '../../lib/security/environment';

export function ClientDemoBanner() {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(isClientDemoPreviewEnvironment());
  }, []);

  if (!isPreview) {
    return null;
  }

  return (
    <aside
      aria-label="Aviso de ambiente de demonstração"
      className="bg-[#0f172a] text-[#94a3b8] text-[11px] font-medium py-1 px-4 text-center border-b border-[#1e293b] flex items-center justify-center gap-2 select-none relative z-50"
    >
      <span
        className="inline-block size-1.5 rounded-full bg-[#f59e0b] shrink-0"
        aria-hidden="true"
      />
      <span className="font-semibold text-slate-200">
        Ambiente de demonstração — dados fictícios
      </span>
      <span className="text-[#475569] hidden sm:inline" aria-hidden="true">
        •
      </span>
      <span className="text-[#64748b] text-[10px] hidden sm:inline">
        Simulação completa de navegação para Comprador, Vendedor e Concessionária
      </span>
    </aside>
  );
}
