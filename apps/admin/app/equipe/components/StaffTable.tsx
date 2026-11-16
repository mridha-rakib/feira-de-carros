'use client';

import type { StaffMember } from '@/lib/types/staff-presentation';
import { Headphones, Lock, ShieldAlert, ShoppingBag } from 'lucide-react';
import type * as React from 'react';

interface StaffTableProps {
  staffMembers: StaffMember[];
  selectedStaffId: string;
  onSelectStaff: (staff: StaffMember) => void;
}

export function StaffTable({ staffMembers, selectedStaffId, onSelectStaff }: StaffTableProps) {
  return (
    <div
      data-testid="staff-table-container"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Colaboradores da plataforma</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Contas individuais de acesso administrativo e operacional interno
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
          RBAC restrito
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" data-testid="staff-table">
          <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
            <tr>
              <th scope="col" className="py-3 px-4">
                Colaborador / ID
              </th>
              <th scope="col" className="py-3 px-3">
                Função
              </th>
              <th scope="col" className="py-3 px-3">
                Departamento / Local
              </th>
              <th scope="col" className="py-3 px-3 text-center">
                Status
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Permissões
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffMembers.map((staff) => {
              const isSelected = selectedStaffId === staff.id;

              return (
                <tr
                  key={staff.id}
                  data-testid={`staff-row-${staff.id}`}
                  tabIndex={0}
                  onClick={() => onSelectStaff(staff)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStaff(staff);
                    }
                  }}
                  className={`cursor-pointer transition-colors outline-none focus:bg-slate-100/70 ${
                    isSelected ? 'bg-red-50/40 hover:bg-red-50/60' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Colaborador / ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                          staff.role === 'sales'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {staff.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                          {staff.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{staff.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Função */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {staff.role === 'sales' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                        <ShoppingBag className="w-3 h-3 text-blue-600" />
                        Vendas (Sales)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        <Headphones className="w-3 h-3 text-indigo-600" />
                        Suporte (Support)
                      </span>
                    )}
                  </td>

                  {/* Departamento / Local */}
                  <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">
                    <div className="truncate font-medium">{staff.department}</div>
                    <div className="text-[11px] text-slate-400">{staff.location}</div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {staff.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Suspenso
                      </span>
                    )}
                  </td>

                  {/* Permissões */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                      <Lock className="w-3 h-3 text-amber-600" />
                      DENY_PENDING
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Warning Box Matching Figma ADM-D-038 */}
      <div
        data-testid="staff-table-warning"
        className="p-4 bg-amber-50/70 border-t border-amber-200/70 flex items-start gap-3"
      >
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950">
          <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
            GESTÃO EXCLUSIVA DO MAIN ADMIN
          </strong>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Apenas o Main Admin tem autoridade para criar colaboradores, alterar papéis e suspender
            contas. 12 operações sensíveis mantidas em HOLD (REL-06). Nenhum login compartilhado é
            permitido na plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
