'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { getStaffMemberById, mockStaffPermissionsMatrix } from '@/lib/adapters/mock-staff-data';
import type { StaffPermissionMatrixItem } from '@/lib/types/staff-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Slash,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function IndividualStaffPermissionsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const staff = React.useMemo(() => getStaffMemberById(id), [id]);

  if (!staff) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Equipe e permissões', 'Não encontrado']}>
        <div
          data-testid="staff-perm-not-found-state"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs my-10"
        >
          <UserX className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Colaborador não encontrado</h2>
          <p className="text-xs text-slate-500">
            O protocolo de equipe "{id}" não foi localizado na base de registros.
          </p>
          <Link
            href="/equipe"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Gestão de Equipe
          </Link>
        </div>
      </AdminShell>
    );
  }

  const roleLabel = staff.role === 'sales' ? 'Vendas (Sales)' : 'Suporte (Support)';

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Equipe e permissões', staff.name, 'Permissões']}
      maxWidthClass="max-w-[1360px]"
    >
      <div className="space-y-6" data-testid="individual-staff-permissions-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/equipe/${staff.id}`}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Voltar ao perfil"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Permissões de {staff.name}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                ADM-D-040
              </span>
            </div>
            <p className="text-sm text-slate-500 pl-8">
              Atribuição específica para o papel {roleLabel} • Protocolo {staff.id}
            </p>
          </div>

          <div className="flex items-center gap-3 pl-8 sm:pl-0">
            <Link
              href={`/equipe/${staff.id}`}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              Voltar ao colaborador
            </Link>
          </div>
        </div>

        {/* Individual Scope Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Colaborador
            </span>
            <div className="text-sm font-bold text-slate-900">{staff.name}</div>
            <div className="text-[11px] font-mono text-slate-500">{staff.emailMasked}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Papel Atribuído
            </span>
            <div className="text-sm font-bold text-slate-900">{roleLabel}</div>
            <div className="text-[11px] text-slate-500">{staff.department}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">
              Restrições Sensíveis
            </span>
            <div className="text-sm font-bold text-amber-900">12 operações em HOLD</div>
            <div className="text-[11px] font-mono text-amber-700 font-semibold">DENY_PENDING</div>
          </div>
        </div>

        {/* Matrix Table for this Staff's Role */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Direitos de Acesso Específicos para {roleLabel}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Visualização restrita
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
                <tr>
                  <th scope="col" className="py-3 px-4 min-w-[220px]">
                    Operação
                  </th>
                  <th scope="col" className="py-3 px-3 min-w-[160px]">
                    Status para este colaborador
                  </th>
                  <th scope="col" className="py-3 px-4 min-w-[260px]">
                    Regra Institucional
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockStaffPermissionsMatrix.map((item: StaffPermissionMatrixItem) => {
                  const effectiveStatus = staff.role === 'sales' ? item.sales : item.support;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.operation}</div>
                        <div className="text-[10px] text-slate-400">{item.category}</div>
                      </td>
                      <td className="py-3 px-3">
                        {effectiveStatus.includes('DENY_PENDING') ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Lock className="w-3 h-3 text-amber-600" />
                            {effectiveStatus}
                          </span>
                        ) : effectiveStatus.includes('Proibido') ||
                          effectiveStatus.includes('Sem acesso') ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            <Slash className="w-3 h-3 text-slate-400" />
                            {effectiveStatus}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-700 font-medium">
                            {effectiveStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 leading-relaxed">
                        {item.policy}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-amber-50/70 border-t border-amber-200/70 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
                REL-06 · POLÍTICA DE SEGURANÇA IMUTÁVEL
              </strong>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Nenhum colaborador comum possui poderes de alteração ou aprovação final de
                transações ou cadastros. Acesso em modo fail-closed permanente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Dados e colaboradores fictícios.
        </div>
      </div>
    </AdminShell>
  );
}
