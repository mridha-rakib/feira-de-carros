'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { STAFF_KPI_DATA, mockStaffMembers } from '@/lib/adapters/mock-staff-data';
import type { StaffMember, StaffRole, StaffStatus } from '@/lib/types/staff-presentation';
import { ExternalLink, Plus, Shield } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { MobileStaffView } from './components/MobileStaffView';
import { StaffDetailPanel } from './components/StaffDetailPanel';
import { StaffKpiCards } from './components/StaffKpiCards';
import { StaffSearchFilters } from './components/StaffSearchFilters';
import { StaffTable } from './components/StaffTable';

export default function StaffManagementPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<StaffRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<StaffStatus | 'all'>('all');

  // Default selected staff is Ana Ferreira (STF-DEMO-0002) per requirements
  const [selectedStaffId, setSelectedStaffId] = React.useState<string>('STF-DEMO-0002');

  const filteredStaff = React.useMemo(() => {
    return mockStaffMembers.filter((staff) => {
      const matchesSearch =
        searchTerm === '' ||
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === 'all' || staff.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || staff.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus]);

  const selectedStaff = React.useMemo(() => {
    return (
      filteredStaff.find((s) => s.id === selectedStaffId) ||
      mockStaffMembers.find((s) => s.id === selectedStaffId) ||
      filteredStaff[0]
    );
  }, [filteredStaff, selectedStaffId]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
  };

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE VIEW (ADM-M-010) - Rendered on < 1024px                  */}
      {/* ============================================================== */}
      <MobileStaffView staffMembers={mockStaffMembers} />

      {/* ============================================================== */}
      {/* DESKTOP VIEW (ADM-D-038) - Rendered on >= 1024px               */}
      {/* ============================================================== */}
      <div className="hidden lg:block">
        <AdminShell breadcrumbs={['Admin', 'Equipe e permissões']} maxWidthClass="max-w-[1440px]">
          <div className="space-y-6" data-testid="staff-management-page">
            {/* Top Page Header */}
            <div className="flex items-center justify-between gap-4 pb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Gestão de equipe e colaboradores
                  </h1>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    ADM-D-038
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Contas administrativas, permissões por papel e controle de acesso exclusivo do
                  Main Admin.
                </p>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3">
                <Link
                  href="/equipe/permissoes"
                  data-testid="header-permissions-matrix-btn"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>Matriz de permissões (12 em HOLD)</span>
                </Link>

                <Link
                  href="/equipe/novo"
                  data-testid="header-new-staff-btn"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo colaborador</span>
                </Link>
              </div>
            </div>

            {/* 4 KPI Cards */}
            <StaffKpiCards
              summary={STAFF_KPI_DATA}
              selectedRole={selectedRole}
              selectedStatus={selectedStatus}
              onFilterRole={setSelectedRole}
              onFilterStatus={setSelectedStatus}
            />

            {/* Search and Filters */}
            <StaffSearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onResetFilters={handleResetFilters}
              filteredCount={filteredStaff.length}
              totalCount={mockStaffMembers.length}
            />

            {/* Split Screen Master-Detail Layout */}
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Staff Table (8 Cols) */}
              <div className="col-span-8 space-y-4">
                {filteredStaff.length > 0 ? (
                  <StaffTable
                    staffMembers={filteredStaff}
                    selectedStaffId={selectedStaff?.id || ''}
                    onSelectStaff={(staff: StaffMember) => setSelectedStaffId(staff.id)}
                  />
                ) : (
                  <div
                    data-testid="staff-empty-state"
                    className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                  >
                    <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                    <h2 className="text-sm font-bold text-slate-800">
                      Nenhum colaborador encontrado
                    </h2>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Não foram localizados colaboradores correspondentes aos critérios de filtro
                      aplicados.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Redefinir filtros
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Staff Detail Panel (4 Cols) */}
              <div className="col-span-4">
                <StaffDetailPanel staff={selectedStaff} />
              </div>
            </div>

            {/* Demo Environment Notice */}
            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-200">
              AMBIENTE DEMONSTRATIVO • Dados e colaboradores fictícios; nenhuma credencial
              corporativa real provisionada.
            </div>
          </div>
        </AdminShell>
      </div>
    </>
  );
}
