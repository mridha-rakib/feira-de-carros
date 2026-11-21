'use client';

import { ChevronRight, Shield, ShieldAlert, UserCheck } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import type { AdminRole } from '../../../../lib/types/hero-image';

interface HeroHeaderProps {
  currentRole: AdminRole;
  onRoleChange: (role: AdminRole) => void;
  simulateFailure: boolean;
  onSimulateFailureChange: (val: boolean) => void;
}

export function HeroHeader({
  currentRole,
  onRoleChange,
  simulateFailure,
  onSimulateFailureChange,
}: HeroHeaderProps) {
  return (
    <div className="space-y-4" data-testid="hero-image-header">
      {/* Top Breadcrumb Navigation matching Figma ADM-D-054 node 2940:10297 */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#63728a]">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Admin
        </Link>
        <span className="text-slate-400">›</span>
        <Link href="/configuracoes" className="hover:text-slate-900 transition-colors">
          Configurações
        </Link>
        <span className="text-slate-400">›</span>
        <span className="font-semibold text-[#131b2b]">Imagem principal da homepage</span>
      </nav>

      {/* Main Title, Badge and Role Restriction */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          {/* CR-003 Pill matching Figma node 2940:10316 */}
          <div className="inline-flex items-center px-3 py-1 rounded-[12px] bg-[#fce8ea] text-[#b91c1c] text-[12px] font-bold tracking-wide uppercase mb-2">
            CR-003 · IMAGEM DO HERO
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131b2b] tracking-tight">
            Configurações da imagem principal
          </h1>
          <p className="text-sm sm:text-[15px] text-[#49566b] mt-1.5 leading-relaxed">
            Gerencie a imagem de fundo da seção principal do site, sem alterar textos ou busca.
          </p>
        </div>

        {/* Main Admin Restriction Pill matching Figma node 2940:10320 */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[13px] border text-xs sm:text-[13px] font-semibold transition-colors ${
              currentRole === 'main_admin'
                ? 'bg-[#fce8ea] text-[#b91c1c] border-[#fca5a5]/40'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            data-testid="main-admin-restriction-pill"
          >
            {currentRole === 'main_admin' ? (
              <Shield className="w-4 h-4 text-[#b91c1c] shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>
              {currentRole === 'main_admin'
                ? 'Somente administrador principal'
                : `Perfil atual: ${currentRole} (Restrito)`}
            </span>
          </div>
        </div>
      </div>

      {/* QA / Reviewer Interactive Simulation Toolbar */}
      <div
        className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600"
        data-testid="hero-qa-toolbar"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-600" />
            Simulação de Perfil RBAC:
          </span>
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => onRoleChange('main_admin')}
              data-testid="role-toggle-main-admin"
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentRole === 'main_admin'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Main Admin (Autorizado)
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('sales')}
              data-testid="role-toggle-sales"
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentRole === 'sales'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sales (Restrito)
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('support')}
              data-testid="role-toggle-support"
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentRole === 'support'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Support (Restrito)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => onSimulateFailureChange(e.target.checked)}
              data-testid="toggle-simulate-failure"
              className="rounded text-red-600 focus:ring-red-500 border-slate-300 w-3.5 h-3.5"
            />
            <span>Simular falha de rede/servidor (Teste de Fallback)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
