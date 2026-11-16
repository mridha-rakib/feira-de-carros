'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';

interface SettingsSectionHeaderProps {
  title: string;
  subtitle: string;
  figmaNodeId?: string;
  badgeLabel?: string;
  actionButton?: React.ReactNode;
}

export function SettingsSectionHeader({
  title,
  subtitle,
  figmaNodeId,
  badgeLabel,
  actionButton,
}: SettingsSectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/configuracoes"
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Voltar às Configurações"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {badgeLabel && (
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {badgeLabel}
            </span>
          )}
          {figmaNodeId && (
            <span className="text-[10px] font-mono text-slate-400">Node: {figmaNodeId}</span>
          )}
        </div>
        <p className="text-sm text-slate-500 pl-8">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 pl-8 sm:pl-0">
        {actionButton}
        <Link
          href="/configuracoes"
          className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
        >
          Menu Geral
        </Link>
      </div>
    </div>
  );
}
