'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemName?: string;
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  itemName = 'registros',
  className = '',
}: AdminPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return (
      <div
        data-testid="admin-pagination"
        className={`p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 ${className}`}
      >
        <span>
          Exibindo <strong>{totalItems}</strong> {itemName}
        </span>
        <span className="font-mono text-[11px] text-slate-400">Página 1 de 1</span>
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with intelligent ellipsis if many pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label="Paginação da tabela"
      data-testid="admin-pagination"
      className={`p-3.5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 ${className}`}
    >
      {/* Range Display */}
      <div className="font-medium">
        Exibindo{' '}
        <strong className="text-slate-900">
          {startItem}–{endItem}
        </strong>{' '}
        de <strong className="text-slate-900">{totalItems}</strong> {itemName}
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Anterior"
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={idx === 1 ? 'ellipsis-start' : 'ellipsis-end'}
                  className="px-2 py-1 text-slate-400 select-none text-xs"
                >
                  …
                </span>
              );
            }
            const pageNum = p as number;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
                  isActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Próximo"
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium shadow-2xs"
        >
          <span className="hidden sm:inline">Próximo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
}
