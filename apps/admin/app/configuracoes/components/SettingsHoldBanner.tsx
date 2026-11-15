'use client';

import { ShieldAlert } from 'lucide-react';
import type * as React from 'react';

interface SettingsHoldBannerProps {
  gateCode: string; // e.g. SMG-10, SMG-07, SEARCH-005
  title: string;
  description: string;
}

export function SettingsHoldBanner({ gateCode, title, description }: SettingsHoldBannerProps) {
  return (
    <div
      data-testid="settings-hold-banner"
      className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950"
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold uppercase tracking-wide">
            {gateCode} · {title}
          </strong>
          <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
