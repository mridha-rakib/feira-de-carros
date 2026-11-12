import Image from 'next/image';
import * as React from 'react';

export type BrandLogoVariant =
  | 'on-dark'
  | 'on-light'
  | 'mono-white'
  | 'mono-black'
  | 'stacked-on-dark'
  | 'stacked-on-light'
  | 'icon-red'
  | 'icon-white'
  | 'icon-black';

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  alt?: string;
}

const LOGO_PATHS: Record<
  BrandLogoVariant,
  { src: string; defaultWidth: number; defaultHeight: number }
> = {
  'on-dark': { src: '/brand/2026/logo-on-dark.png', defaultWidth: 178, defaultHeight: 36 },
  'on-light': { src: '/brand/2026/logo-on-light.png', defaultWidth: 178, defaultHeight: 36 },
  'mono-white': { src: '/brand/2026/logo-mono-white.png', defaultWidth: 178, defaultHeight: 36 },
  'mono-black': { src: '/brand/2026/logo-mono-black.png', defaultWidth: 178, defaultHeight: 36 },
  'stacked-on-dark': {
    src: '/brand/2026/logo-stacked-on-dark.png',
    defaultWidth: 148,
    defaultHeight: 70,
  },
  'stacked-on-light': {
    src: '/brand/2026/logo-stacked-on-light.png',
    defaultWidth: 148,
    defaultHeight: 70,
  },
  'icon-red': { src: '/brand/2026/brand-icon-red.png', defaultWidth: 36, defaultHeight: 36 },
  'icon-white': { src: '/brand/2026/brand-icon-white.png', defaultWidth: 36, defaultHeight: 36 },
  'icon-black': { src: '/brand/2026/brand-icon-black.png', defaultWidth: 36, defaultHeight: 36 },
};

export function BrandLogo({
  variant = 'on-dark',
  className = '',
  priority = false,
  width,
  height,
  alt = 'Feira de Carros',
}: BrandLogoProps) {
  const config = LOGO_PATHS[variant] || LOGO_PATHS['on-dark'];
  const w = width ?? config.defaultWidth;
  const h = height ?? config.defaultHeight;

  return (
    <Image
      src={config.src}
      alt={alt}
      width={w}
      height={h}
      priority={priority}
      className={`object-contain inline-block ${className}`}
    />
  );
}
