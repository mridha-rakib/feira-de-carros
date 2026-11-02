'use client';

import { Bell, ChevronRight, LogOut, MapPin } from 'lucide-react';
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
    <header className="w-full bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-medium text-slate-500"
      >
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 font-semibold' : ''}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Locality Selector Pill (Figma ADM-D-002) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          <span>{location}</span>
        </div>

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          aria-label="Notificações"
          className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
        </button>

        {/* User Profile Avatar & Name */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 text-red-700 flex items-center justify-center text-xs font-bold">
            AP
          </div>
          <span className="text-sm font-semibold text-slate-800 hidden md:inline-block">
            {userName}
          </span>
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
