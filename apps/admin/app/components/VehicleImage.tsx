'use client';

import Image, { type ImageProps } from 'next/image';
import * as React from 'react';

export interface VehicleImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  showDemoBadge?: boolean;
}

const DEFAULT_FALLBACK = '/images/vehicles/demo/vehicle-fallback.svg';

export function VehicleImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  showDemoBadge = false,
  className = '',
  ...rest
}: VehicleImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <Image
        {...rest}
        src={currentSrc}
        alt={alt}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setCurrentSrc(fallbackSrc);
          }
        }}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {showDemoBadge && (
        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] font-bold tracking-wider backdrop-blur-2xs select-none">
          DEMO
        </span>
      )}
    </div>
  );
}
