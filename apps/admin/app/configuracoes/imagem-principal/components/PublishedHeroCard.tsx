'use client';

import { Check, Info } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import type { PublishedHeroImageRecord } from '../../../../lib/types/hero-image';

interface PublishedHeroCardProps {
  publishedImage: PublishedHeroImageRecord;
}

export function PublishedHeroCard({ publishedImage }: PublishedHeroCardProps) {
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(publishedImage.publishedAt);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return publishedImage.publishedAt;
    }
  }, [publishedImage.publishedAt]);

  const formattedSize = React.useMemo(() => {
    const mb = publishedImage.fileSizeBytes / (1024 * 1024);
    return `${mb.toFixed(2).replace('.', ',')} MB`;
  }, [publishedImage.fileSizeBytes]);

  return (
    <div
      className="bg-[#ecfbf1] border border-[#6cc58e] rounded-[14px] p-4 sm:p-5 shadow-xs space-y-4"
      data-testid="card-published-hero-image"
    >
      {/* Header matching Figma node 2940:10326 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-[21px] h-[21px] rounded-[11px] bg-[#16a34a] text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <h2 className="text-lg sm:text-[20px] font-bold text-[#166534]">
            Imagem publicada atualmente
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
          <span
            data-testid="badge-published-status"
            className="text-xs sm:text-[14px] font-semibold text-[#166534]"
          >
            Publicada
          </span>
        </div>
      </div>

      {/* Hero Visual Mock matching Figma node 2940:10333 */}
      <div className="relative w-full h-[226px] rounded-[10px] overflow-hidden bg-[#091221] shadow-inner select-none">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={publishedImage.url}
            alt="Imagem principal atualmente publicada"
            fill
            priority
            unoptimized={
              publishedImage.url.startsWith('data:') || publishedImage.url.startsWith('blob:')
            }
            className="object-cover object-center"
          />
        </div>

        {/* Hero Left Text Safety Overlay matching Figma node 2940:10334 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(9,18,33,0.92)] via-[58%] via-[rgba(9,18,33,0.59)] to-[rgba(9,18,33,0)] w-full md:w-[75%] z-10" />

        {/* Hero Read-only Content */}
        <div className="relative z-20 h-full p-4 sm:p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-[26px] font-bold text-white tracking-tight leading-tight">
              Encontre seu próximo <br />
              carro com <span className="text-[#f42524]">segurança</span>
            </h3>
            <p className="text-xs sm:text-[13px] text-white/90 font-medium max-w-lg hidden sm:block">
              Os melhores veículos, de vendedores verificados, em um só lugar.
            </p>
          </div>

          {/* Search Form Visual Mock matching Figma node 2940:10339 */}
          <div className="bg-white rounded-[12px] p-2.5 max-w-[620px] shadow-md pointer-events-none opacity-95">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="px-3 py-1 rounded-[6px] bg-[#e31921] text-white font-semibold text-[10px]">
                Carros
              </span>
              <span className="px-3 py-1 rounded-[6px] bg-[#f2f5f9] text-[#131b2b] font-semibold text-[10px]">
                Motos
              </span>
              <span className="px-3 py-1 rounded-[6px] bg-[#f2f5f9] text-[#131b2b] font-semibold text-[10px]">
                Caminhões
              </span>
            </div>

            {/* Filter inputs & CTA */}
            <div className="grid grid-cols-5 gap-1.5 items-center">
              <div className="bg-[#f8fafc] border border-[#d9e2ec] rounded-[4px] px-2 py-1 text-[9px] text-[#475569] font-medium truncate">
                Marca
              </div>
              <div className="bg-[#f8fafc] border border-[#d9e2ec] rounded-[4px] px-2 py-1 text-[9px] text-[#475569] font-medium truncate">
                Modelo
              </div>
              <div className="bg-[#f8fafc] border border-[#d9e2ec] rounded-[4px] px-2 py-1 text-[9px] text-[#475569] font-medium truncate">
                Ano
              </div>
              <div className="bg-[#f8fafc] border border-[#d9e2ec] rounded-[4px] px-2 py-1 text-[9px] text-[#475569] font-medium truncate">
                Preço
              </div>
              <div className="bg-[#e31921] text-white font-semibold text-[9px] rounded-[5px] py-1 text-center truncate">
                Buscar veículos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Notice matching Figma node 2940:10359 */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-[#334155] text-xs sm:text-[13px] font-medium">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#16a34a] shrink-0" />
          <span>A imagem atual permanece publicada até a confirmação da substituição.</span>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Arquivo: {publishedImage.fileName} ({formattedSize}) • Publicado em {formattedDate}
        </div>
      </div>
    </div>
  );
}
