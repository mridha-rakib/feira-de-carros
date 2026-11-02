'use client';

import * as React from 'react';

export function DashboardLoadingState() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Carregando painel">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-40 bg-slate-200 rounded-lg" />
        <div className="h-4 w-72 bg-slate-100 rounded" />
      </div>

      {/* Summary Cards Skeleton (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 h-32 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-slate-100 rounded" />
              <div className="w-8 h-8 rounded-full bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 bg-slate-200 rounded" />
              <div className="h-3 w-28 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Middle row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 h-72" />
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 h-72" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 h-64" />
    </div>
  );
}
