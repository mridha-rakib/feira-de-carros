'use client';

import type * as React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

interface AdminShellProps {
  children: React.ReactNode;
  breadcrumbs?: string[];
  location?: string;
  userName?: string;
  maxWidthClass?: string;
}

export function AdminShell({
  children,
  breadcrumbs,
  location,
  userName,
  maxWidthClass = 'max-w-[1348px]',
}: AdminShellProps) {
  return (
    <div className="min-h-screen flex bg-[#f8f9fa] text-slate-800 antialiased selection:bg-red-500/20 selection:text-red-900">
      {/* Desktop Sidebar (hidden on mobile) */}
      <AdminSidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar (hidden on mobile) */}
        <div className="hidden lg:block">
          <AdminTopbar breadcrumbs={breadcrumbs} location={location} userName={userName} />
        </div>

        {/* Scrollable Main Area - Figma 1276px content + 36px margins on 1600px desktop */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:px-[36px] lg:py-[28px] ${maxWidthClass} w-full mx-auto pb-10`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
