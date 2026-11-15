'use client';

import { ChevronDown, Sparkles } from 'lucide-react';
import * as React from 'react';

export interface LoadMoreProps {
  currentCount: number;
  totalCount: number;
  onLoadMore: () => void;
  step?: number;
  itemName?: string;
  className?: string;
}

export function LoadMore({
  currentCount,
  totalCount,
  onLoadMore,
  step = 6,
  itemName = 'registros',
  className = '',
}: LoadMoreProps) {
  if (totalCount === 0) return null;

  const isAllLoaded = currentCount >= totalCount;
  const remaining = Math.max(0, totalCount - currentCount);
  const nextBatch = Math.min(step, remaining);

  return (
    <div
      data-testid="load-more-container"
      className={`pt-3 pb-2 space-y-2 text-center ${className}`}
    >
      <p className="text-xs text-slate-500 font-medium">
        Exibindo <strong className="text-slate-900">{Math.min(currentCount, totalCount)}</strong> de{' '}
        <strong className="text-slate-900">{totalCount}</strong> {itemName}
      </p>

      {!isAllLoaded ? (
        <button
          type="button"
          onClick={onLoadMore}
          data-testid="load-more-button"
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
          <span>Carregar mais ({nextBatch})</span>
        </button>
      ) : (
        <div className="py-2 text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Todos os {totalCount} {itemName} foram carregados
          </span>
        </div>
      )}
    </div>
  );
}
