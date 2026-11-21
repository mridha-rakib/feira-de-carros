'use client';

import { Monitor, Smartphone } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';
import type { PublishedHeroImageRecord, StagedHeroImage } from '../../../../lib/types/hero-image';

interface ResponsivePreviewCardProps {
  publishedImage: PublishedHeroImageRecord;
  stagedImage: StagedHeroImage | null;
}

export function ResponsivePreviewCard({ publishedImage, stagedImage }: ResponsivePreviewCardProps) {
  const activeUrl = stagedImage ? stagedImage.previewUrl : publishedImage.url;
  const isPreviewingStaged = !!stagedImage;

  return (
    <div
      className="bg-white border border-[#d9e2ec] rounded-[14px] p-5 shadow-xs space-y-4"
      data-testid="card-responsive-preview"
    >
      {/* Header matching Figma node 2940:10383 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Monitor className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-[19px] font-bold text-[#131b2b]">
            Pré-visualização responsiva
          </h2>
        </div>

        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isPreviewingStaged
              ? 'bg-purple-100 text-purple-700 font-mono'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isPreviewingStaged ? 'Simulando nova imagem' : 'Exibindo imagem atual'}
        </span>
      </div>

      {/* Responsive Previews Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Desktop Preview (16:9) matching Figma node 2940:10386 */}
        <div className="md:col-span-8 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#475569] px-0.5">
            <span className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-500" />
              Desktop (16:9)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1920 × 480 px</span>
          </div>

          <div className="relative w-full h-[150px] rounded-[10px] overflow-hidden bg-slate-950 border border-slate-200 select-none shadow-xs">
            <Image
              src={activeUrl}
              alt="Prévia Desktop"
              fill
              unoptimized={activeUrl.startsWith('data:') || activeUrl.startsWith('blob:')}
              className="object-cover object-center"
            />

            {/* Dark gradient overlay matching Figma node 2940:10387 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(9,18,33,0.92)] via-[58%] via-[rgba(9,18,33,0.59)] to-[rgba(9,18,33,0)] w-[75%] z-10" />

            {/* Desktop Mock Content */}
            <div className="relative z-20 h-full p-3.5 flex flex-col justify-between">
              <div className="space-y-0.5">
                <p className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-tight">
                  Encontre seu próximo carro com segurança
                </p>
                <p className="text-[9px] text-white/80">Os melhores veículos...</p>
              </div>

              {/* Desktop Search UI thumbnail matching Figma node 2940:10391 */}
              <div className="bg-white rounded-[5px] p-1.5 max-w-[380px] shadow-xs flex items-center gap-1">
                <div className="bg-[#f7f9fc] border border-[#e2e8f0] rounded-[3px] px-1.5 py-0.5 text-[8px] text-[#64748b] flex-1 truncate">
                  Marca
                </div>
                <div className="bg-[#f7f9fc] border border-[#e2e8f0] rounded-[3px] px-1.5 py-0.5 text-[8px] text-[#64748b] flex-1 truncate">
                  Modelo
                </div>
                <div className="bg-[#f7f9fc] border border-[#e2e8f0] rounded-[3px] px-1.5 py-0.5 text-[8px] text-[#64748b] w-10 truncate">
                  Ano
                </div>
                <div className="bg-[#f7f9fc] border border-[#e2e8f0] rounded-[3px] px-1.5 py-0.5 text-[8px] text-[#64748b] w-12 truncate">
                  Preço
                </div>
                <div className="bg-[#e31921] text-white font-semibold text-[8px] rounded-[4px] px-2 py-0.5 truncate shrink-0">
                  Buscar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block md:col-span-1 text-center">
          <div className="w-px h-[140px] bg-[#cbd5e1] mx-auto" />
        </div>

        {/* Mobile Preview (9:16) matching Figma node 2940:10403 */}
        <div className="md:col-span-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#475569] px-0.5">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              Mobile (9:16)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Mobile Crop</span>
          </div>

          <div className="relative w-full h-[150px] rounded-[10px] overflow-hidden bg-slate-950 border border-slate-200 select-none shadow-xs mx-auto">
            <Image
              src={activeUrl}
              alt="Prévia Mobile"
              fill
              unoptimized={activeUrl.startsWith('data:') || activeUrl.startsWith('blob:')}
              className="object-cover object-center"
            />

            {/* Dark gradient overlay matching Figma node 2940:10404 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(9,18,33,0.92)] via-[60%] via-[rgba(9,18,33,0.65)] to-[rgba(9,18,33,0.2)] z-10" />

            {/* Mobile Mock Content */}
            <div className="relative z-20 h-full p-2.5 flex flex-col justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-white leading-tight">
                  Encontre seu <br />
                  próximo carro <br />
                  com segurança
                </p>
                <p className="text-[7px] text-white/80">Os melhores veículos</p>
              </div>

              {/* Mobile tabs thumbnail matching Figma node 2940:10409 */}
              <div className="bg-white rounded-[5px] p-1 flex items-center justify-around gap-1 shadow-xs">
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#e31921] text-white font-semibold text-[7px]">
                  Carros
                </span>
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#f2f5f9] text-[#131b2b] font-semibold text-[7px]">
                  Motos
                </span>
                <span className="px-1.5 py-0.5 rounded-[3px] bg-[#f2f5f9] text-[#131b2b] font-semibold text-[7px]">
                  Caminhões
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
