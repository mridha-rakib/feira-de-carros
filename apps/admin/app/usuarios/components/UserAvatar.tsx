'use client';

import Image from 'next/image';
import * as React from 'react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean;
  className?: string;
}

export function UserAvatar({
  name,
  avatarUrl,
  size = 'md',
  isSelected = false,
  className = '',
}: UserAvatarProps) {
  const [hasImageError, setHasImageError] = React.useState(false);

  const initials = React.useMemo(() => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [name]);

  const sizeDimensions = {
    sm: { px: 36, classes: 'w-9 h-9 text-xs rounded-xl' },
    md: { px: 40, classes: 'w-10 h-10 text-xs rounded-xl' },
    lg: { px: 48, classes: 'w-12 h-12 text-sm rounded-2xl' },
    xl: { px: 68, classes: 'w-[68px] h-[68px] text-base rounded-2xl' },
  }[size];

  if (avatarUrl && !hasImageError) {
    return (
      <div
        className={`relative overflow-hidden shrink-0 ring-1 ring-slate-200/80 shadow-xs ${
          sizeDimensions.classes
        } ${isSelected ? 'ring-2 ring-red-600 shadow-sm' : ''} ${className}`}
      >
        <Image
          src={avatarUrl}
          alt={`Avatar ilustrativo de ${name}`}
          width={sizeDimensions.px}
          height={sizeDimensions.px}
          className="w-full h-full object-cover"
          onError={() => setHasImageError(true)}
          priority={size === 'xl' || size === 'lg'}
        />
      </div>
    );
  }

  return (
    <div
      aria-label={`Iniciais de ${name}: ${initials}`}
      className={`flex items-center justify-center font-bold shrink-0 transition-colors ${
        sizeDimensions.classes
      } ${
        isSelected
          ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-600'
          : 'bg-slate-900 text-white'
      } ${className}`}
    >
      {initials}
    </div>
  );
}
