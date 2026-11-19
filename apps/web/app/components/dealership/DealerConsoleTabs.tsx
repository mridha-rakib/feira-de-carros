'use client';

import { useDealerMessagesStore } from '@/stores/use-dealer-messages-store';
import { useDealerProfileStore } from '@/stores/use-dealer-profile-store';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface DealerConsoleTabsProps {
  activeTab: 'estoque' | 'perfil' | 'mensagens';
}

export function DealerConsoleTabs({ activeTab }: DealerConsoleTabsProps) {
  const { conversations } = useDealerMessagesStore();
  const { publishedProfile } = useDealerProfileStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalUnread = mounted ? conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0) : 0;

  const showroomSlug = publishedProfile?.id || 'dealer-lider-seminovos';

  return (
    <div className="flex items-center justify-between gap-4 mb-6 border-b border-[#dfe7f1] pb-3 overflow-x-auto">
      <div className="flex items-center gap-2">
        <Link
          href="/concessionaria/anuncios"
          className={`text-[13px] font-medium px-3 py-1.5 rounded-[6px] transition-colors ${
            activeTab === 'estoque'
              ? 'font-semibold text-[#b91c1c] bg-[#fee2e2]/60'
              : 'text-[#63738e] hover:text-[#16243c] hover:bg-[#f1f6fd]'
          }`}
        >
          Estoque da frota
        </Link>
        <Link
          href="/concessionaria/perfil"
          className={`text-[13px] font-medium px-3 py-1.5 rounded-[6px] transition-colors ${
            activeTab === 'perfil'
              ? 'font-semibold text-[#b91c1c] bg-[#fee2e2]/60'
              : 'text-[#63738e] hover:text-[#16243c] hover:bg-[#f1f6fd]'
          }`}
        >
          Perfil público
        </Link>
        <Link
          href="/concessionaria/mensagens"
          className={`text-[13px] font-medium px-3 py-1.5 rounded-[6px] transition-colors flex items-center gap-1.5 ${
            activeTab === 'mensagens'
              ? 'font-semibold text-[#b91c1c] bg-[#fee2e2]/60'
              : 'text-[#63738e] hover:text-[#16243c] hover:bg-[#f1f6fd]'
          }`}
        >
          <span>Mensagens</span>
          {totalUnread > 0 && (
            <span
              data-testid="dealer-unread-badge"
              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-[#b91c1c] rounded-full"
            >
              {totalUnread}
            </span>
          )}
        </Link>
      </div>

      <div className="flex items-center">
        <Link
          href={`/concessionarias/${showroomSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium text-[#0066cc] hover:text-[#004d99] flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] hover:bg-[#eff6ff] transition-colors"
        >
          <span>Ver showroom público</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
