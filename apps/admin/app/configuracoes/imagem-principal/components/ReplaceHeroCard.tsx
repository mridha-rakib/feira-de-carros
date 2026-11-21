'use client';

import { Sparkles, Trash2, Upload, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import type { AdminRole, StagedHeroImage } from '../../../../lib/types/hero-image';

interface ReplaceHeroCardProps {
  stagedImage: StagedHeroImage | null;
  onFileSelect: (file: File) => void;
  onRemoveStaged: () => void;
  onLoadSample: () => void;
  disabled?: boolean;
  currentRole: AdminRole;
}

export function ReplaceHeroCard({
  stagedImage,
  onFileSelect,
  onRemoveStaged,
  onLoadSample,
  disabled = false,
  currentRole,
}: ReplaceHeroCardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const isRestricted = currentRole !== 'main_admin';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isRestricted) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isRestricted) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
    // Reset input so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formattedStagedSize = React.useMemo(() => {
    if (!stagedImage) return '';
    const mb = stagedImage.fileSizeBytes / (1024 * 1024);
    return `${mb.toFixed(2).replace('.', ',')} MB`;
  }, [stagedImage]);

  return (
    <div
      className="bg-white border border-[#d9e2ec] rounded-[14px] p-5 shadow-xs space-y-4 flex flex-col justify-between"
      data-testid="card-replace-hero-image"
    >
      <div className="space-y-3">
        {/* Header matching Figma node 2940:10363 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#f42524] flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-[19px] font-bold text-[#131b2b]">Substituir imagem</h2>
          </div>

          {!stagedImage && !isRestricted && (
            <button
              type="button"
              onClick={onLoadSample}
              disabled={disabled}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors"
              title="Carregar imagem de exemplo homologada no Figma (nova-imagem-home.webp)"
              data-testid="load-sample-hero-button"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Usar exemplo Figma</span>
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          id="hero-file-upload"
          data-testid="hero-file-input"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          disabled={disabled || isRestricted}
          className="sr-only"
          aria-label="Selecionar arquivo de imagem para substituição do Hero"
        />

        {/* Dropzone matching Figma node 2940:10364 */}
        <label
          htmlFor={disabled || isRestricted ? undefined : 'hero-file-upload'}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-[12px] p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
            isRestricted
              ? 'bg-slate-50 border-slate-300 opacity-60 cursor-not-allowed'
              : isDragging
                ? 'bg-red-50/80 border-[#f42524] scale-[0.99]'
                : 'bg-[#fff9fa] border-[#f42524] hover:bg-red-50/50'
          }`}
          data-testid="hero-image-dropzone"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-red-100 flex items-center justify-center text-[#f42524]">
            <UploadCloud className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-[13px] font-medium text-[#131b2b]">
              {isRestricted
                ? 'Substituição desabilitada para seu perfil de acesso'
                : 'Arraste uma imagem ou clique para selecionar'}
            </p>
            <p className="text-[11px] text-[#58667a]">
              JPG, PNG ou WebP • limites definidos na implementação
            </p>
          </div>

          <span
            className={`px-4 py-1.5 rounded-[9px] bg-white border border-[#f42524] text-[#d71920] font-semibold text-xs sm:text-[13px] shadow-2xs ${
              disabled || isRestricted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'
            }`}
            data-testid="select-file-button"
          >
            Selecionar imagem
          </span>
        </label>
      </div>

      {/* Queued Staged Replacement matching Figma node 2940:10371 */}
      {stagedImage ? (
        <div
          className="bg-[#fbfcfe] border border-[#d9e2ec] rounded-[10px] p-3 flex items-center justify-between gap-3 mt-3 shadow-2xs"
          data-testid="queued-replacement-row"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail Preview */}
            <div className="relative w-[100px] sm:w-[135px] h-[58px] rounded-[8px] overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
              <Image
                src={stagedImage.previewUrl}
                alt={stagedImage.fileName}
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>

            {/* File Info */}
            <div className="min-w-0 space-y-0.5">
              <p
                className="text-xs sm:text-[13px] font-semibold text-[#131b2b] truncate"
                title={stagedImage.fileName}
              >
                {stagedImage.fileName}
              </p>
              <p className="text-[11px] text-[#63728a]">
                {formattedStagedSize} • {stagedImage.dimensions.width}x
                {stagedImage.dimensions.height}px
              </p>
              <div className="pt-0.5">
                <span className="inline-block px-2 py-0.5 rounded-[8px] bg-[#ede7ff] text-[#6d28d9] font-semibold text-[10px]">
                  Prévia não publicada
                </span>
              </div>
            </div>
          </div>

          {/* Remove/Discard staged image button */}
          <button
            type="button"
            onClick={onRemoveStaged}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Remover imagem selecionada"
            aria-label="Remover imagem selecionada"
            data-testid="remove-staged-image-button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="pt-2 text-center text-xs text-slate-400 italic">
          Nenhuma nova imagem selecionada para substituição.
        </div>
      )}
    </div>
  );
}
