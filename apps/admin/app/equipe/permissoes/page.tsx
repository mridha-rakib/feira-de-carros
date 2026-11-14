'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { mockStaffPermissionsMatrix } from '@/lib/adapters/mock-staff-data';
import type { StaffPermissionMatrixItem } from '@/lib/types/staff-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Lock,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Slash,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

export default function StaffPermissionsMatrixPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'BLOCKED_ALERT'>('NONE');

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    for (const item of mockStaffPermissionsMatrix) {
      set.add(item.category);
    }
    return Array.from(set);
  }, []);

  const filteredMatrix = React.useMemo(() => {
    if (selectedCategory === 'all') return mockStaffPermissionsMatrix;
    return mockStaffPermissionsMatrix.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Equipe e permissões', 'Matriz de permissões']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="staff-permissions-matrix-page">
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
                Matriz de papéis e permissões da equipe
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                ADM-D-040
              </span>
            </div>
            <p className="text-sm text-slate-500 pl-8">
              Atribuição de autoridade, isolamento de funções operacionais e 12 operações sensíveis
              sob HOLD.
            </p>
          </div>

          <div className="flex items-center gap-3 pl-8 sm:pl-0">
            <Link
              href="/equipe"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              Voltar à equipe
            </Link>
          </div>
        </div>

        {/* 4 Summary / Warning Cards Matching Figma ADM-D-040 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-amber-200/90 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Operações sob HOLD
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-900 tracking-tight">12 sensíveis</div>
            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
              Status: DENY_PENDING ativo
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Assinatura de Governança
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-800 tracking-tight">Não assinada</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Matriz preliminar v0.2</p>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200/90 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">
                Delegação de Caixa
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
                <Slash className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-rose-900 tracking-tight">
              Expressamente vedada
            </div>
            <p className="text-[11px] text-rose-700 font-medium mt-0.5">
              Dinheiro físico: desktop Main Admin
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Aprovações Finais
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              Exclusivas Main Admin
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Anúncios, vendedores e planos</p>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-2">Filtrar categoria:</span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({mockStaffPermissionsMatrix.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            data-testid="simulate-save-permissions-btn"
            onClick={() => setSimulationState('BLOCKED_ALERT')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Salvar permissões (Indisponível)</span>
          </button>
        </div>

        {/* Simulation Feedback Alert */}
        {simulationState === 'BLOCKED_ALERT' && (
          <div
            data-testid="permissions-blocked-notice"
            className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
          >
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Modificação de Direitos Bloqueada — Modo Fail-Closed (REL-06)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              A matriz de permissões está temporariamente congelada. A plataforma não permite
              elevação arbitrária de privilégios ou concessão de autoridade antes da validação
              formal dos contratos e aprovação legal. Nenhuma regra foi modificada.
            </p>
            <button
              type="button"
              onClick={() => setSimulationState('NONE')}
              className="text-[11px] font-bold text-amber-400 hover:underline pt-1 block"
            >
              Fechar aviso
            </button>
          </div>
        )}

        {/* Permissions Matrix Table */}
        <div
          data-testid="permissions-matrix-table-container"
          className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
        >
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Matriz de autorizações por papel</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Comparativo de poderes entre Main Admin, Vendas (Sales) e Suporte (Support)
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              12 operações sob HOLD
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" data-testid="permissions-matrix-table">
              <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                <tr>
                  <th scope="col" className="py-3 px-4 min-w-[220px]">
                    Operação / Escopo
                  </th>
                  <th scope="col" className="py-3 px-3 min-w-[150px]">
                    Main Admin
                  </th>
                  <th scope="col" className="py-3 px-3 min-w-[150px]">
                    Sales (Vendas)
                  </th>
                  <th scope="col" className="py-3 px-3 min-w-[150px]">
                    Support (Suporte)
                  </th>
                  <th scope="col" className="py-3 px-4 min-w-[260px]">
                    Política / Regra
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMatrix.map((item: StaffPermissionMatrixItem) => {
                  return (
                    <tr
                      key={item.id}
                      data-testid={`permission-row-${item.id}`}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Operação */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.operation}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.category}</div>
                      </td>

                      {/* Main Admin */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {item.mainAdmin}
                        </span>
                      </td>

                      {/* Sales */}
                      <td className="py-3 px-3">
                        {item.sales.includes('DENY_PENDING') ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Lock className="w-3 h-3 text-amber-600" />
                            {item.sales}
                          </span>
                        ) : item.sales.includes('Proibido') || item.sales.includes('Sem acesso') ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            <Slash className="w-3 h-3 text-slate-400" />
                            {item.sales}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-700 font-medium">
                            {item.sales}
                          </span>
                        )}
                      </td>

                      {/* Support */}
                      <td className="py-3 px-3">
                        {item.support.includes('DENY_PENDING') ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Lock className="w-3 h-3 text-amber-600" />
                            {item.support}
                          </span>
                        ) : item.support.includes('Proibido') ||
                          item.support.includes('Sem acesso') ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            <Slash className="w-3 h-3 text-slate-400" />
                            {item.support}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-700 font-medium">
                            {item.support}
                          </span>
                        )}
                      </td>

                      {/* Política / Regra */}
                      <td className="py-3 px-4 text-[11px] text-slate-600 leading-relaxed">
                        {item.policy}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Audit Banner */}
          <div
            data-testid="permissions-matrix-audit-banner"
            className="p-4 bg-amber-50/70 border-t border-amber-200/70 flex items-start gap-3"
          >
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
                REL-06 · HOLD DE SEGURANÇA RBAC — NENHUMA PERMISSÃO MODIFICADA
              </strong>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                As 12 operações sensíveis listadas permanecem estritamente bloqueadas para
                operadores Sales e Support. Delegação de caixa físico é permanentemente proibida.
                Nenhuma elevação de privilégio pode ser executada nesta interface.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Dados e diretrizes de governança em conformidade com o SRS v0.2.
        </div>
      </div>
    </AdminShell>
  );
}
