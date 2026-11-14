'use client';

import { AdminMobileNavigation } from '@/app/components/AdminMobileNavigation';
import type { StaffMember } from '@/lib/types/staff-presentation';
import { BrandLogo } from '@feira/ui';
import {
  Headphones,
  Lock,
  Mail,
  MapPin,
  Search,
  Shield,
  ShieldAlert,
  ShoppingBag,
  Users,
} from 'lucide-react';
import * as React from 'react';

interface MobileStaffViewProps {
  staffMembers: StaffMember[];
}

export function MobileStaffView({ staffMembers }: MobileStaffViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStaff = React.useMemo(() => {
    if (!searchTerm.trim()) return staffMembers;
    const term = searchTerm.toLowerCase();
    return staffMembers.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term),
    );
  }, [staffMembers, searchTerm]);

  // Reference card staff: STF-DEMO-0001 (Paulo Nogueira)
  const referenceStaff = staffMembers.find((s) => s.id === 'STF-DEMO-0001');

  return (
    <div
      data-testid="adm-m-010-mobile-staff"
      className="lg:hidden min-h-screen bg-slate-100 flex flex-col pb-20 select-none"
    >
      {/* Dark Mobile Header with Official 2026 BrandLogo */}
      <header className="bg-[#0B111E] text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <BrandLogo variant="on-dark" priority width={140} height={28} className="h-6 w-auto" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
            ADM-M-010
          </span>
          <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 font-black text-[10px] flex items-center justify-center">
            AM
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 space-y-4">
        {/* Title & Scope */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Equipe e permissões
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Resumo de colaboradores autorizados e políticas RBAC da plataforma.
          </p>
        </div>

        {/* Mobile Explicit Modification Restriction Banner */}
        <div
          data-testid="mobile-staff-restriction-banner"
          className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs"
        >
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold uppercase tracking-wide text-amber-900 block text-[11px]">
              GESTÃO RESTRITA AO DESKTOP (ADM-019)
            </strong>
            <p className="text-[11px] text-amber-800/95 mt-0.5 leading-relaxed">
              Criação, bloqueio de colaboradores e liberação de permissões são restritas ao terminal
              desktop do Main Admin. Acesso móvel estritamente para consulta segura.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar colaborador..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all shadow-2xs"
          />
        </div>

        {/* Summary Metrics Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs grid grid-cols-2 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Colaboradores
            </span>
            <span className="text-xl font-black text-slate-900 block mt-0.5">
              {staffMembers.length}
            </span>
            <span className="text-[10px] text-slate-400">2 Vendas • 2 Suporte</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">
              Operações HOLD
            </span>
            <span className="text-xl font-black text-amber-900 block mt-0.5">12</span>
            <span className="text-[10px] text-amber-700 font-medium">DENY_PENDING</span>
          </div>
        </div>

        {/* Reference Card: STF-DEMO-0001 (Paulo Nogueira) as required by ADM-M-010 */}
        {referenceStaff && !searchTerm && (
          <div
            data-testid="mobile-staff-reference-card"
            className="bg-white rounded-2xl border-2 border-slate-800 p-4 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
                Colaborador em Destaque • {referenceStaff.id}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Ativo
              </span>
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-900">{referenceStaff.name}</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">{referenceStaff.department}</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                  Função atribuída:
                </span>
                <span className="font-bold text-blue-700 text-[11px]">Vendas (Sales)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5" />
                  E-mail mascarado:
                </span>
                <span className="font-mono text-slate-700 text-[11px] font-medium">
                  {referenceStaff.emailMasked}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5" />
                  Localização:
                </span>
                <span className="text-slate-700 text-[11px] font-medium">
                  {referenceStaff.location}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Permissões sensíveis:
                </span>
                <span className="font-bold text-amber-800 text-[11px]">12 em HOLD</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              * Contas individuais sem permissão de alteração ou aprovação direta pelo dispositivo
              móvel.
            </p>
          </div>
        )}

        {/* List of Staff Members */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Todos os colaboradores ({filteredStaff.length})
          </div>

          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              data-testid={`mobile-staff-item-${staff.id}`}
              className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{staff.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">{staff.id}</span>
                </div>
                {staff.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Suspenso
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  {staff.role === 'sales' ? (
                    <ShoppingBag className="w-3 h-3 text-blue-600" />
                  ) : (
                    <Headphones className="w-3 h-3 text-indigo-600" />
                  )}
                  {staff.role === 'sales' ? 'Vendas' : 'Suporte'}
                </span>
                <span className="font-mono text-slate-500">{staff.emailMasked}</span>
              </div>

              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{staff.location}</span>
                <span className="text-amber-700 font-semibold font-mono">DENY_PENDING</span>
              </div>
            </div>
          ))}
        </div>

        {/* Read-only Footer Note */}
        <div className="text-center text-[10px] text-slate-400 py-3 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Nenhum provisionamento de credenciais realizado.
        </div>
      </main>

      {/* Existing Mobile Navigation */}
      <AdminMobileNavigation />
    </div>
  );
}
