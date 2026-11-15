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
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

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

  const handleRestrictedAction = (actionName: string) => {
    setFeedbackMessage(
      `Ação "${actionName}" bloqueada no ambiente demonstrativo. Alterações de credenciais e MFA requerem ambiente de produção integrado ao IdP corporativo.`,
    );
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. Dedicated Mobile View (Figma ADM-M-012 / node 468:9881)   */}
      {/* ============================================================ */}
      <div
        data-testid="mobile-admin-profile-page"
        className="lg:hidden min-h-screen bg-slate-100 text-slate-800 pb-28 select-none"
      >
        {/* Approved Dark Mobile Header */}
        <header className="bg-[#0B111E] text-white p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <BrandLogo variant="on-dark" priority width={130} height={26} className="h-6 w-auto" />
            <div className="flex items-center gap-2">
              <span
                data-testid="mobile-profile-badge"
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
              >
                ADM-M-012
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>{profile.location}</span>
            <span>Identidade do Operador</span>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="p-4 space-y-4 max-w-lg mx-auto">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 text-center">
            <div className="relative mx-auto w-16 h-16 rounded-full bg-red-100 border-2 border-red-200 text-red-700 flex items-center justify-center text-xl font-black shadow-inner">
              AP
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{profile.name}</h1>
              <div className="text-xs text-slate-500 font-mono mt-0.5">{profile.id}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{profile.role}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">E-mail:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {profile.emailMasked}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Unidade:</span>
                <span className="font-medium text-slate-800">{profile.assignedUnit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Localidade:</span>
                <span className="font-medium text-slate-800">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Security and Session Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Sessão e Segurança da Conta</span>
            </h2>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Status da Sessão</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{profile.sessionStatus}</span>
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Último Acesso</span>
                <span className="font-mono text-slate-700">{profile.lastLogin}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">MFA / 2FA</span>
                <span className="text-amber-700 font-semibold">{profile.mfaStatus}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Credentials Notice */}
          <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Privacidade e Credenciais Protegidas</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Nenhuma senha ou chave JWT é armazenada no terminal cliente. As alterações de
              privilégios e permissões corporativas são centralizadas no módulo de Equipe e obedecem
              à matriz RBAC do sistema.
            </p>
          </div>

          {/* Feedback banner if simulated */}
          {feedbackMessage && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              {feedbackMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => handleRestrictedAction('Alteração de Senha')}
              className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Alterar Senha de Acesso</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? 'Encerrando sessão...' : 'Encerrar Sessão'}</span>
            </button>
          </div>
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
                className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
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
                  AP
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
                    <span className="font-mono font-semibold text-slate-800">
                      {profile.emailMasked}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Localidade:</span>
                    <span className="font-medium text-slate-800">{profile.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Atribuição:</span>
                    <span className="font-medium text-slate-800">{profile.assignedUnit}</span>
                  </div>
                </div>
              </div>

              {/* Right Column (2 cols): Security, Audit & Invariants */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span>Parâmetros de Sessão e Segurança Corporativa</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Estado da Sessão
                      </span>
                      <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{profile.sessionStatus}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Registro de Acesso
                      </span>
                      <div className="font-mono font-bold text-slate-800">{profile.lastLogin}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Governança de Credenciais (LGPD e Segurança)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Nenhuma credencial sensível (senha em texto plano ou tokens JWT corporativos)
                      é exposta nesta interface. Em observância às diretrizes de conformidade, a
                      gestão de operadores e atribuição de funções é restrita ao módulo de Equipe.
                    </p>
                  </div>

                  {feedbackMessage && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      {feedbackMessage}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleRestrictedAction('Alteração de Senha')}
                      className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4 text-slate-400" />
                      <span>Solicitar Alteração de Senha (Demonstração)</span>
                    </button>
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
