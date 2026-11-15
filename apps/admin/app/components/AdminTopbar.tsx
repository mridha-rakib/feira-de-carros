'use client';

import { Bell, ChevronRight, LogOut, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { getAuthAdapter } from '../../lib/adapters/auth-factory';

interface AdminTopbarProps {
  breadcrumbs?: string[];
  location?: string;
  userName?: string;
}

export function AdminTopbar({
  breadcrumbs = ['Admin', 'Visão geral'],
  location = 'Ipatinga - MG',
  userName = 'Admin principal',
}: AdminTopbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const auth = getAuthAdapter();
      await auth.logout();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full h-[76px] bg-white border-b border-[#e8edf5] px-6 flex items-center justify-between shrink-0">
      {/* Breadcrumbs matching Figma node 39:49 */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />}
              <div
                className={`h-[34px] px-[11px] py-[5px] rounded-[8px] flex items-center transition-colors ${
                  isLast
                    ? 'bg-[#f4f6f8] text-[#111827] font-semibold text-[13px]'
                    : 'text-[#4b5563] font-medium text-[12px] hover:text-[#111827]'
                }`}
              >
                <span>{crumb}</span>
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Locality Selector Pill (Figma ADM-D-002) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f6f8] border border-[#e8edf5] text-xs font-medium text-[#111827]">
          <MapPin className="w-3.5 h-3.5 text-[#f42524]" />
          <span>{location}</span>
        </div>

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          aria-label="Notificações"
          className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4 text-[#4b5563]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f42524] ring-2 ring-white" />
        </button>

        {/* User Profile Avatar & Name */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Link
            href="/perfil"
            title="Ver perfil do administrador"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-[#fee2e2] border border-[#fca5a5] text-[#b91c1c] flex items-center justify-center text-xs font-bold">
              AP
            </div>
            <span className="text-[13px] font-semibold text-[#111827] hidden md:inline-block">
              {userName}
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Encerrar sessão"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
