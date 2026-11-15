'use client';

import { AdminMobileNavigation } from '@/app/components/AdminMobileNavigation';
import { AdminShell } from '@/app/components/AdminShell';
import { getAuthAdapter } from '@/lib/adapters/auth-factory';
import { mockAdminProfile } from '@/lib/adapters/mock-content-settings-data';
import { BrandLogo } from '@feira/ui';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function AdminProfilePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const profile = mockAdminProfile;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const auth = getAuthAdapter();
      await auth.logout();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. Dedicated Mobile View (Figma ADM-M-012 / node 468:9881)   */}
      {/* ============================================================ */}
      <div
        data-testid="mobile-admin-profile-page"
        className="lg:hidden min-h-screen bg-[#f8f9fa] text-slate-800 pb-28 select-none"
      >
        {/* Approved Dark Mobile Header matching Figma node 468:9882 */}
        <header className="bg-[#0e1728] text-white px-5 py-3.5 sticky top-0 z-30 space-y-2">
          <div className="flex items-center gap-3">
            <BrandLogo
              variant="on-dark"
              priority
              width={135}
              height={28}
              className="h-7 w-auto shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#fc9d9d] tracking-wide">
                ADMIN · MOBILE WEB
              </span>
              <span className="text-[11px] font-semibold text-[#f2f5fa]">
                Main Admin · perfil pessoal
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#c9d4e5] font-normal border-t border-slate-800/80 pt-1.5">
            Ipatinga · MG &nbsp;&bull;&nbsp; Ambiente demonstrativo
          </p>
        </header>

        {/* Mobile Main Content matching Figma node 488:10030 */}
        <main className="p-5 space-y-4 max-w-lg mx-auto">
          {/* Page Heading matching Figma node 488:10031 */}
          <div className="space-y-1">
            <h1 className="text-[22px] font-bold text-[#111827] leading-[32px]">Meu perfil</h1>
            <p className="text-[12px] text-[#6b7280] leading-[18px]">
              Dados e segurança da conta administrativa.
            </p>
          </div>

          {/* Card 1: ADM-DEMO-0001 · Admin principal matching Figma node 488:10034 */}
          <div className="bg-white rounded-[16px] border border-[#e8edf5] p-[17px] shadow-xs space-y-2">
            <h2 className="text-[15px] font-bold text-[#111827] leading-[22px]">
              ADM-DEMO-0001 · Admin principal
            </h2>
            <p className="text-[11px] font-medium text-[#6b7280] leading-[16px]">
              Minha conta · ambiente demonstrativo
            </p>

            <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[11px]">
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Função</span>
                <span className="font-semibold text-[#111827]">Main Admin</span>
              </div>
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Localidade</span>
                <span className="font-semibold text-[#111827]">Ipatinga · MG</span>
              </div>
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">E-mail</span>
                <span className="font-semibold text-[#111827]">a***@exemplo.com</span>
              </div>
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Sessão</span>
                <span className="font-semibold text-[#111827]">Autenticada</span>
              </div>
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Dados privados</span>
                <span className="font-semibold text-[#111827]">Não exibidos no resumo</span>
              </div>
            </div>

            <div className="bg-[#f4f6fa] rounded-[10px] px-3 py-2.5 text-[11px] font-medium text-[#111827]">
              Dados protegidos por controle de acesso.
            </div>
          </div>

          {/* Card 2: Segurança da conta matching Figma node 488:10059 */}
          <div className="bg-white rounded-[16px] border border-[#e8edf5] p-[17px] shadow-xs space-y-2">
            <h2 className="text-[15px] font-bold text-[#111827] leading-[22px]">
              Segurança da conta
            </h2>
            <p className="text-[11px] font-medium text-[#6b7280] leading-[16px]">
              Resumo dos controles
            </p>

            <div className="divide-y divide-[#d1d5db] border-y border-[#d1d5db] text-[11px]">
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Autenticação</span>
                <span className="font-semibold text-[#111827]">Obrigatória</span>
              </div>
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Credenciais</span>
                <span className="font-semibold text-[#111827]">Nunca exibidas</span>
              </div>
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Sessões</span>
                <span className="font-semibold text-[#111827]">Acesso monitorado</span>
              </div>
              <div className="py-[7px] flex items-center justify-between">
                <span className="text-[#6b7280]">Alterar perfil</span>
                <span className="font-semibold text-[#111827]">Fluxo seguro no desktop</span>
              </div>
            </div>

            <div className="bg-[#f4f6fa] rounded-[10px] px-3 py-2.5 text-[11px] font-medium text-[#111827]">
              Alterações de segurança exigem verificação em duas etapas.
            </div>
          </div>

          {/* Safe Notice Banner matching Figma node 488:10080 */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[12px] p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#92400e]" />
              <span className="text-[12px] font-bold text-[#92400e]">Acesso pessoal seguro</span>
            </div>
            <p className="text-[11px] text-[#92400e] leading-relaxed">
              Acesse pelo desktop para redefinição de credenciais e exportação de logs.
            </p>
          </div>

          {/* Actions & Logout */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-3 rounded-xl bg-[#b91c1c] hover:bg-[#a8121c] text-white text-[12px] font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? 'Encerrando sessão...' : 'Encerrar Sessão'}</span>
            </button>
          </div>

          {/* Demo footnote matching Figma node 488:10083 */}
          <p className="text-[11px] text-[#94a3b8] text-center pt-2">
            Ambiente de demonstração &bull; v0.1
          </p>
        </main>

        {/* Mobile Navigation */}
        <AdminMobileNavigation />
      </div>

      {/* ============================================================ */}
      {/* 2. Desktop Companion View                                    */}
      {/* ============================================================ */}
      <div className="hidden lg:block">
        <AdminShell
          breadcrumbs={['Admin', 'Perfil do Administrador']}
          maxWidthClass="max-w-[1200px]"
        >
          <div className="space-y-6" data-testid="desktop-admin-profile-page">
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Perfil do Administrador
                  </h1>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-white">
                    ADM-M-012 Companion
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Identidade do operador autenticado, status de credenciais e governança de sessão.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="py-2 px-4 rounded-xl bg-[#b91c1c] hover:bg-[#a8121c] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? 'Saindo...' : 'Encerrar Sessão'}</span>
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Identity Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5 text-center">
                <div className="relative mx-auto w-20 h-20 rounded-full bg-red-100 border-2 border-red-200 text-red-700 flex items-center justify-center text-2xl font-black shadow-inner">
                  AM
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">{profile.name}</h2>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{profile.id}</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200/60">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{profile.role}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">E-mail:</span>
                    <span className="font-mono font-semibold text-slate-800">a***@exemplo.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Localidade:</span>
                    <span className="font-semibold text-slate-800">{profile.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sessão:</span>
                    <span className="font-semibold text-emerald-600">Autenticada</span>
                  </div>
                </div>
              </div>

              {/* Right Columns: Security & Session Details */}
              <div className="md:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Controles de Segurança e Governança</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-slate-400 font-medium">
                        Autenticação multifator (MFA)
                      </div>
                      <div className="font-bold text-slate-800">Obrigatória</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-slate-400 font-medium">Nível de privilégio</div>
                      <div className="font-bold text-red-700">Acesso Total (Main Admin)</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-slate-400 font-medium">Trilha de auditoria</div>
                      <div className="font-bold text-emerald-700">Ativa e monitorada</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-slate-400 font-medium">Ambiente operacional</div>
                      <div className="font-bold text-slate-800">Demonstrativo (V1)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminShell>
      </div>
    </>
  );
}
