import * as React from 'react';

export function UserLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Carregando dados dos usuários">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="w-8 h-8 rounded-lg bg-slate-200" />
            </div>
            <div className="h-7 w-16 bg-slate-200 rounded" />
            <div className="h-2.5 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-14 bg-white rounded-2xl border border-slate-200/90" />

      {/* Table & Panel Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="h-28 bg-slate-100 rounded-xl" />
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
