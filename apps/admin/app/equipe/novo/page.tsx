'use client';

import { AdminShell } from '@/app/components/AdminShell';
import type { StaffRole } from '@/lib/types/staff-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

export default function NewStaffPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<StaffRole>('support');
  const [department, setDepartment] = React.useState('Suporte ao Cliente');
  const [location, setLocation] = React.useState('Ipatinga - MG');

  const [isSimulated, setIsSimulated] = React.useState(false);

  const handleSimulateCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulated(true);
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Equipe e permissões', 'Novo colaborador']}
      maxWidthClass="max-w-[1100px]"
    >
      <div className="space-y-6" data-testid="new-staff-page">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/equipe"
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Voltar à lista"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Cadastrar novo colaborador
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ADM-D-039
              </span>
            </div>
            <p className="text-sm text-slate-500 pl-8">
              Criação controlada de contas operacionais restritas (Sales ou Support).
            </p>
          </div>
        </div>

        {/* Mobile Restriction Banner */}
        <div
          data-testid="mobile-new-staff-restricted"
          className="lg:hidden p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
              CADASTRO RESTRITO AO DESKTOP (ADM-019)
            </strong>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              O provisionamento de novos colaboradores é exclusivo do terminal desktop pelo Main
              Admin. Acesso móvel estritamente para visualização.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Box (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Formulário de cadastro</h2>
                <p className="text-[11px] text-slate-500">
                  Preencha os dados do colaborador para gerar a prévia funcional
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Somente Vendas ou Suporte
              </span>
            </div>

            <form onSubmit={handleSimulateCreate} className="space-y-4">
              <div>
                <label
                  htmlFor="new-staff-name"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Nome completo do colaborador
                </label>
                <input
                  id="new-staff-name"
                  type="text"
                  placeholder="Ex: Beatriz Lima"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setIsSimulated(false);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-staff-email"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  E-mail institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="new-staff-email"
                    type="email"
                    placeholder="Ex: beatriz@equipe.example"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsSimulated(false);
                    }}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Contas individuais. Nunca reutilize e-mails compartilhados para múltiplos
                  colaboradores.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="new-staff-role"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Função atribuída
                  </label>
                  <select
                    id="new-staff-role"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as StaffRole);
                      setIsSimulated(false);
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="support">Suporte (Support) — Atendimento e moderação</option>
                    <option value="sales">Vendas (Sales) — Relacionamento comercial</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="new-staff-dept"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Departamento
                  </label>
                  <input
                    id="new-staff-dept"
                    type="text"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setIsSimulated(false);
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-staff-location"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Localidade operacional
                </label>
                <input
                  id="new-staff-location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setIsSimulated(false);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-900"
                  required
                />
              </div>

              {/* Simulation Result */}
              {isSimulated && (
                <div
                  data-testid="new-staff-simulation-result"
                  className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
                >
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Prévia de Criação Registrada — Modo Fail-Closed (REL-06)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    A criação do colaborador <strong>{name || 'Novo Colaborador'}</strong> ({role})
                    foi simulada com sucesso no protótipo frontend. Nenhuma credencial foi enviada
                    por e-mail e nenhum registro foi inserido no banco de dados.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSimulated(false)}
                    className="text-[11px] font-bold text-amber-400 hover:underline pt-1 block"
                  >
                    Limpar prévia
                  </button>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="hidden lg:flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  data-testid="create-staff-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Criar colaborador (Simulação)</span>
                </button>

                <Link
                  href="/equipe"
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ml-auto"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column: Policies (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Regras de Criação de Contas</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Todas as novas contas iniciam com credenciais individuais protegidas e permissões
                sensíveis sob o status <strong>DENY_PENDING</strong>.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  Conta Individual Obrigatória
                </div>
                <p>
                  É estritamente proibido criar contas genéricas ou compartilhadas por múltiplos
                  operadores de turno.
                </p>
              </div>
            </div>

            <div
              data-testid="new-staff-audit-hold-banner"
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950"
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold uppercase tracking-wide">
                    REL-06 · PROVISIONAMENTO NÃO EXECUTADO
                  </strong>
                  <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                    A criação de contas institucionais depende de conexão com o provedor de
                    identidade corporativo e aprovação por chave criptográfica do Main Admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Nenhum provisionamento de credenciais realizado.
        </div>
      </div>
    </AdminShell>
  );
}
