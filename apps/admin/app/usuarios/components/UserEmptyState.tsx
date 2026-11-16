import { RefreshCw, SearchX } from 'lucide-react';
import * as React from 'react';

interface UserEmptyStateProps {
  onResetFilters: () => void;
  searchTerm?: string;
}

export function UserEmptyState({ onResetFilters, searchTerm }: UserEmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <SearchX className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">Nenhum usuário encontrado</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          {searchTerm
            ? `Nenhum resultado corresponde à busca "${searchTerm}" com os filtros selecionados.`
            : 'Não há registros que correspondam aos filtros de papel e status aplicados.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Limpar Filtros e Busca
      </button>
    </div>
  );
}
