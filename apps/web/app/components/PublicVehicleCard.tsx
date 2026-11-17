'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { PublicVehicleItem } from '../../lib/adapters/buyer-catalog-adapter';
import { useBuyerStore } from '../../stores/use-buyer-store';
import { IconCalendar, IconGauge, IconHeart, IconPin } from './SellerIcons';

interface PublicVehicleCardProps {
  vehicle: PublicVehicleItem;
  variant?: 'grid' | 'horizontal';
}

export function PublicVehicleCard({ vehicle, variant = 'grid' }: PublicVehicleCardProps) {
  const { isFavorite, toggleFavorite } = useBuyerStore();
  const [imgSrc, setImgSrc] = useState(vehicle.imageUrl);
  const favorited = isFavorite(vehicle.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(vehicle.id, `/veiculos/${vehicle.id}`);
  };

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/veiculos/${vehicle.id}`}
        className="group bg-white border border-[#e0e6f0] hover:border-[#b91c1c] rounded-[12px] p-3 flex flex-row gap-3.5 transition-all hover:shadow-sm overflow-hidden relative"
      >
        {/* Thumbnail */}
        <div className="relative w-[130px] sm:w-[150px] aspect-[4/3] rounded-[8px] overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={imgSrc}
            alt={vehicle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgSrc('/images/vehicles/demo/vehicle-fallback.svg')}
            sizes="(max-width: 640px) 130px, 150px"
          />
          {vehicle.featured && (
            <span className="absolute top-1.5 left-1.5 bg-[#e0151f] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
              Destaque
            </span>
          )}
          {vehicle.isSold && (
            <span className="absolute bottom-1.5 left-1.5 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              Indisponível
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0 pr-8">
          <div>
            <h3 className="text-[14px] sm:text-[16px] font-semibold text-[#14223b] truncate">
              {vehicle.title}
            </h3>
            <p className="text-[11px] sm:text-[12px] text-[#62718a] truncate mt-0.5">
              {vehicle.version}
            </p>
          </div>

          <div className="mt-2">
            <p className="text-[16px] sm:text-[18px] font-bold text-[#e0151f]">
              {vehicle.priceFormatted}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#62718a] mt-1">
              <span className="flex items-center gap-1">
                <IconPin className="size-3 text-[#62718a]" />
                {vehicle.city}, {vehicle.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IconCalendar className="size-3 text-[#62718a]" />
                {vehicle.yearModel}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <IconGauge className="size-3 text-[#62718a]" />
                {vehicle.mileageFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <IconHeart
            className={`size-5 transition-colors ${
              favorited ? 'fill-[#e0151f] text-[#e0151f]' : 'text-[#62718a] hover:text-[#e0151f]'
            }`}
          />
        </button>
      </Link>
    );
  }

  return (
    <Link
      href={`/veiculos/${vehicle.id}`}
      className="group bg-white border border-[#e0e6f0] hover:border-[#b91c1c] rounded-[12px] overflow-hidden flex flex-col transition-all hover:shadow-md relative"
    >
      {/* Image container */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
        <Image
          src={imgSrc}
          alt={vehicle.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgSrc('/images/vehicles/demo/vehicle-fallback.svg')}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {vehicle.featured && (
            <span className="bg-[#e0151f] text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
              Destaque
            </span>
          )}
          {vehicle.isSold && (
            <span className="bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              Vendido / Indisponível
            </span>
          )}
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
            {vehicle.condition}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm z-10"
        >
          <IconHeart
            className={`size-4 transition-colors ${
              favorited ? 'fill-[#e0151f] text-[#e0151f]' : 'text-[#475569] hover:text-[#e0151f]'
            }`}
          />
        </button>
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-[#14223b] group-hover:text-[#b91c1c] transition-colors truncate">
            {vehicle.title}
          </h3>
          <p className="text-[12px] text-[#62718a] truncate mt-0.5">{vehicle.version}</p>
          <p className="text-[20px] font-bold text-[#e0151f] mt-2">{vehicle.priceFormatted}</p>
        </div>

        <div className="border-t border-[#f0f4f8] pt-2.5 mt-3 space-y-1 text-[11px] text-[#62718a]">
          <div className="flex items-center gap-1.5 truncate">
            <IconPin className="size-3.5 text-[#62718a] shrink-0" />
            <span>
              {vehicle.city}, {vehicle.state}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconCalendar className="size-3.5 text-[#62718a] shrink-0" />
            <span>
              {vehicle.yearModel} • {vehicle.mileageFormatted}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
