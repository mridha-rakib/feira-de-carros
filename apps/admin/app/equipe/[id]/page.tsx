'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { getStaffMemberById } from '@/lib/adapters/mock-staff-data';
import type { StaffRole, StaffStatus } from '@/lib/types/staff-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Headphones,
  Lock,
  Mail,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function StaffEditPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const initialStaff = React.useMemo(() => getStaffMemberById(id), [id]);

  // Form states (controlled inputs for demonstration)
  const [name, setName] = React.useState(initialStaff?.name || '');
  const [email, setEmail] = React.useState(initialStaff?.email || '');
  const [role, setRole] = React.useState<StaffRole>(initialStaff?.role || 'support');
  const [status, setStatus] = React.useState<StaffStatus>(initialStaff?.status || 'active');
  const [department, setDepartment] = React.useState(initialStaff?.department || '');
  const [location, setLocation] = React.useState(initialStaff?.location || '');

  // Simulation feedback state
  const [simulationState, setSimulationState] = React.useState<
    'NONE' | 'SAVE_PREVIEW' | 'STATUS_TOGGLE_PREVIEW'
  >('NONE');

  // If staff not found
  if (!initialStaff) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Equipe e permissões', 'Não encontrado']}>
        <div
          data-testid="staff-not-found-state"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs my-10"
        >
          <UserX className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Colaborador não encontrado</h2>
          <p className="text-xs text-slate-500">
            O protocolo de equipe "{id}" não foi localizado na base de registros.
          </p>
          <Link
            href="/equipe"
            data-testid="back-to-staff-queue-btn"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Gestão de Equipe
          </Link>
        </div>
      </AdminShell>
    );
  }

  const handleSimulateSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulationState('SAVE_PREVIEW');
  };

  const handleSimulateToggleStatus = () => {
    setSimulationState('STATUS_TOGGLE_PREVIEW');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Equipe e permissões', initialStaff.name]}
      maxWidthClass="max-w-[1280px]"
    >
      <div className="space-y-6" data-testid="staff-edit-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
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
                Editar colaborador: {initialStaff.name}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ADM-D-039
              </span>
            </div>
            <p className="text-sm text-slate-500 pl-8">
              Identidade funcional, papel operacional e validação de permissões RBAC.
            </p>
          </div>

          <div className="flex items-center gap-3 pl-8 sm:pl-0">
            <Link
              href="/equipe/permissoes"
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Matriz de permissões</span>
            </Link>
          </div>
        </div>

        {/* Mobile Restriction Banner on < 1024px */}
        <div
          data-testid="mobile-staff-edit-restricted"
          className="lg:hidden p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
              EDIÇÃO RESTRITA AO DESKTOP (ADM-019)
            </strong>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Alterações de função, e-mail institucional e suspensão de colaboradores só podem ser
              efetuadas no terminal desktop pelo Main Admin. Visualização somente para consulta.
            </p>
          </div>
        </div>

        {/* 4 Summary Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Protocolo Funcional
            </span>
            <div className="text-base font-black font-mono text-slate-900">{initialStaff.id}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Identificador corporativo único</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Papel Atribuído
            </span>
            <div className="text-base font-black text-slate-900 capitalize">
              {role === 'sales' ? 'Vendas (Sales)' : 'Suporte (Support)'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Escopo limitado por RBAC</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Estado da Conta
            </span>
            <div className="flex items-center gap-2">
              {status === 'active' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Ativo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Suspenso
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Controle de acesso</p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">
              Permissões Sensíveis
            </span>
            <div className="text-base font-black text-amber-900">12 em HOLD</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">Status: DENY_PENDING</p>
          </div>
        </div>

        {/* Main Form & Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editable Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Dados do colaborador</h2>
                <p className="text-[11px] text-slate-500">
                  Formulário demonstrativo de edição funcional e atribuição de equipe
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Somente Vendas ou Suporte
              </span>
            </div>

            <form onSubmit={handleSimulateSave} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="staff-name-input"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Nome completo
                </label>
                <input
                  id="staff-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSimulationState('NONE');
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-medium text-slate-900"
                  required
                />
              </div>

              {/* Professional Email */}
              <div>
                <label
                  htmlFor="staff-email-input"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  E-mail institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="staff-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Domínio institucional @equipe.example exclusivo para operadores da plataforma.
                </span>
              </div>

              {/* Two columns: Assigned Team & Account Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team / Role Selection (Sales or Support only) */}
                <div>
                  <label
                    htmlFor="staff-role-select"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Função / Equipe atribuída
                  </label>
                  <select
                    id="staff-role-select"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as StaffRole);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="sales">Vendas (Sales) — Relacionamento comercial</option>
                    <option value="support">Suporte (Support) — Atendimento e moderação</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    * O papel Main Admin não pode ser delegado ou selecionado via formulário.
                  </p>
                </div>

                {/* Status Toggle */}
                <div>
                  <label
                    htmlFor="staff-status-select"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Status da conta
                  </label>
                  <select
                    id="staff-status-select"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as StaffStatus);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="active">Ativo — Acesso liberado ao painel</option>
                    <option value="suspended">Suspenso — Acesso bloqueado temporariamente</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Contas suspensas não conseguem autenticar ou efetuar operações.
                  </p>
                </div>
              </div>

              {/* Department & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="staff-department-input"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Departamento / Área
                  </label>
                  <input
                    id="staff-department-input"
                    type="text"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="staff-location-input"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Base operacional / Localidade
                  </label>
                  <input
                    id="staff-location-input"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setSimulationState('NONE');
                    }}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Simulation Result Alert */}
              {simulationState === 'SAVE_PREVIEW' && (
                <div
                  data-testid="staff-save-simulation-result"
                  className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
                >
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Prévia de Edição Processada — Modo Fail-Closed (REL-06)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    As alterações para o colaborador <strong>{name}</strong> ({role}) foram
                    validadas visualmente no protótipo frontend. Nenhuma alteração persistente ou
                    modificação de credenciais foi realizada em banco de dados ou ambiente de
                    produção.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSimulationState('NONE')}
                    className="text-[11px] font-bold text-amber-400 hover:underline pt-1 block"
                  >
                    Redefinir prévia
                  </button>
                </div>
              )}

              {simulationState === 'STATUS_TOGGLE_PREVIEW' && (
                <div
                  data-testid="staff-status-simulation-result"
                  className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
                >
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Simulação de Bloqueio/Ativação Registrada</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    A ação de alteração de estado para o colaborador <strong>{name}</strong> foi
                    simulada com sucesso. Operações definitivas de suspensão requerem aprovação
                    assinada do Main Admin.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSimulationState('NONE')}
                    className="text-[11px] font-bold text-amber-400 hover:underline pt-1 block"
                  >
                    Redefinir prévia
                  </button>
                </div>
              )}

              {/* Action Buttons (Desktop only interactive) */}
              <div className="hidden lg:flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  data-testid="staff-save-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar alterações (Prévia)</span>
                </button>

                <button
                  type="button"
                  data-testid="staff-toggle-status-btn"
                  onClick={handleSimulateToggleStatus}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                    status === 'active'
                      ? 'border-rose-300 text-rose-700 bg-rose-50/70 hover:bg-rose-100'
                      : 'border-emerald-300 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100'
                  }`}
                >
                  <UserX className="w-4 h-4" />
                  <span>
                    {status === 'active'
                      ? 'Bloquear conta (Simulação)'
                      : 'Reativar conta (Simulação)'}
                  </span>
                </button>

                <Link
                  href="/equipe"
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ml-auto"
                >
                  Voltar à lista
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column: Security & RBAC Policy Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Políticas de Segurança e RBAC</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-800 font-bold block text-[11px]">
                    Atribuição Restrita
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Apenas os papéis Vendas e Suporte podem ser atribuídos a operadores comuns. O
                    papel Main Admin é fixo e intransferível.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 space-y-1">
                  <strong className="text-amber-900 font-bold block text-[11px]">
                    12 Operações em DENY_PENDING
                  </strong>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Mesmo com a conta ativa, aprovações finais de anúncios, vendedores e confirmação
                    de dinheiro continuam bloqueadas para Sales e Support.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <strong className="text-slate-800 font-bold block text-[11px]">
                    Trilha de Auditoria
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Todas as ações realizadas por operadores institucionais geram registros
                    imutáveis com identificação de IP, protocolo e data/hora.
                  </p>
                </div>
              </div>

              <Link
                href="/equipe/permissoes"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver matriz de 12 operações</span>
              </Link>
            </div>

            {/* Audit Notice Box */}
            <div
              data-testid="staff-audit-hold-banner"
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950"
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold uppercase tracking-wide">
                    REL-06 · ALTERAÇÃO DE EQUIPE NÃO EXECUTADA
                  </strong>
                  <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                    Demonstração frontend apenas. A modificação de papéis e estados de acesso requer
                    autorização corporativa do Main Admin e backend de produção. Nenhuma alteração
                    foi persistida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Registros e colaboradores fictícios; nenhuma operação de
          credenciamento efetivada.
        </div>
      </div>
    </AdminShell>
  );
}
