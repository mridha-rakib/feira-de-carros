'use client';

import { BrandLogo } from '@feira/ui';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Eye,
  FileText,
  Info,
  Lock,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import type { AdminUserRecord } from '../../../lib/types/users-presentation';
import { AdminMobileNavigation } from '../../components/AdminMobileNavigation';

interface MobileClientSearchProps {
  users: AdminUserRecord[];
  onInspectUser: (user: AdminUserRecord) => void;
}

const QUICK_DEMO_QUERIES = [
  'Mariana Costa',
  'Bruno Almeida',
  'Vale Auto',
  'Rafael Santos',
  'Lucas Ribeiro',
  'Fernanda Rocha',
  'Tiago Pereira',
];

export function MobileClientSearch({ users, onInspectUser }: MobileClientSearchProps) {
  const [query, setQuery] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmittedQuery(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    setSubmittedQuery('');
  };

  const handleSelectQuickQuery = (term: string) => {
    setQuery(term);
    setSubmittedQuery(term);
  };

  // Filter matching users strictly upon search
  const results = React.useMemo(() => {
    const term = submittedQuery.trim().toLowerCase();
    if (!term) return [];

    const searchWords = term.split(/\s+/).filter(Boolean);

    return users.filter((u) => {
      const searchableText =
        `${u.name} ${u.email} ${u.code} ${u.city} ${u.document} ${u.phone} ${u.dealership?.tradeName ?? ''}`.toLowerCase();
      return searchWords.every((word) => searchableText.includes(word));
    });
  }, [users, submittedQuery]);

  const hasSearched = submittedQuery.length > 0;

  return (
    <div
      data-testid="mobile-users-management"
      className="block lg:hidden min-h-screen bg-slate-50 pb-28"
    >
      {/* 1. Mobile Header with Official 2026 Brand Logo */}
      <header className="bg-[#0B111E] text-white p-4 sticky top-0 z-30 shadow-md">
        {/* Top Brand & Viewport Indicator */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <BrandLogo variant="on-dark" priority width={120} height={24} className="h-5 w-auto" />
          <div className="text-right">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
              ADMIN • MOBILE WEB
            </span>
            <span className="text-[10px] text-slate-400">Acesso Restrito • Consulta</span>
          </div>
        </div>

        {/* Screen Title & Badge (ADM-M-008) */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-red-600/20 text-red-400 flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-base font-bold tracking-tight">Pesquisa de clientes</h1>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            ADM-M-008
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3">
          Consulta restrita de clientes com mascaramento LGPD e inspeção somente leitura.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, CPF/CNPJ, código..."
              className="w-full pl-9 pr-8 py-2 bg-slate-800/90 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                aria-label="Limpar termo de busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Consultar
          </button>
        </form>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-4">
        {/* 2. Privacy-by-field Notice (AUTH-019 / ADM-021) */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/90 text-amber-900 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold block">Privacidade por campo ativa (LGPD)</span>
            <span className="text-[11px] text-amber-800">
              Dados cadastrais sensíveis são restritos por perfil e mascarados. A listagem
              irrestrita do diretório é desabilitada no dispositivo móvel.
            </span>
          </div>
        </div>

        {/* 3. Criteria for Consultation Section (Figma ADM-M-008) */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Critérios de Consulta Autorizada</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1.5 pl-1">
            <li className="flex items-start gap-1.5">
              <span className="text-red-500 font-bold">•</span>
              <span>
                <strong>Parâmetros aceitos:</strong> Nome, CPF/CNPJ parcial, e-mail institucional ou
                identificador (ex: <code>USR-2026-0001</code>).
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-red-500 font-bold">•</span>
              <span>
                <strong>Modo leitura:</strong> Operações de suspensão, reativação ou alteração de
                dados são exclusivas do terminal desktop.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-red-500 font-bold">•</span>
              <span>
                <strong>Auditoria:</strong> As consultas de cadastro geram registros na trilha de
                auditoria do sistema.
              </span>
            </li>
          </ul>

          {/* Quick Demo Queries Chips */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 block mb-1.5 uppercase">
              Consultas demonstrativas rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_DEMO_QUERIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectQuickQuery(item)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Results State or Empty Initial Prompt */}
        {!hasSearched ? (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Aguardando consulta</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Utilize o campo de busca acima ou selecione uma consulta demonstrativa para localizar
              o cliente autorizado.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Nenhum cliente localizado</h3>
            <p className="text-[11px] text-slate-500">
              Nenhum cadastro encontrado para <strong>"{submittedQuery}"</strong>.
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 text-xs font-bold text-red-600 hover:text-red-700"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Localizado(s) <strong className="text-slate-900">{results.length}</strong>{' '}
                cadastro(s)
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-red-600 font-semibold hover:underline text-[11px]"
              >
                Nova consulta
              </button>
            </div>

            {/* Masked Customer Summary Cards */}
            {results.map((user) => {
              const roleLabel =
                user.role === 'dealer'
                  ? 'Concessionária'
                  : user.role === 'seller'
                    ? 'Vendedor'
                    : user.role === 'member'
                      ? 'Comprador'
                      : user.role;

              const statusBadgeClass =
                user.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : user.status === 'SUSPENDED'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

              const statusLabel =
                user.status === 'ACTIVE'
                  ? 'Ativo'
                  : user.status === 'SUSPENDED'
                    ? 'Suspenso'
                    : 'Pendente';

              return (
                <div
                  key={user.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {user.name
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                          {user.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{user.code}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {/* Masked Data Summary Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Papel / Perfil:</span>
                      <span className="font-semibold text-slate-800">{roleLabel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Localidade:</span>
                      <span className="font-semibold text-slate-800">
                        {user.city}, {user.state}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Documento (LGPD):</span>
                      <span className="font-mono text-slate-700">{user.document}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Anúncios ativos:</span>
                      <span className="font-semibold text-slate-800">
                        {user.activity.activeListings} anúncio(s)
                      </span>
                    </div>
                  </div>

                  {/* Dealership Details if applicable (e.g. Vale Auto) */}
                  {user.dealership && (
                    <div className="p-2.5 bg-sky-50/70 rounded-xl border border-sky-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-sky-900">
                        <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>{user.dealership.tradeName}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        {user.dealership.inventoryCount} veículos no catálogo
                      </span>
                    </div>
                  )}

                  {/* Authorized Read-only Summary Action */}
                  <button
                    type="button"
                    onClick={() => onInspectUser(user)}
                    className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspecionar Dossiê (Modo Leitura)</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Approved Bottom Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
