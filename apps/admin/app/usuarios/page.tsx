'use client';

import { RefreshCw, Users } from 'lucide-react';
import * as React from 'react';
import { mockAdminUsers } from '../../lib/adapters/mock-users-data';
import type {
  AdminUserRecord,
  AdminUserRole,
  AdminUserStatus,
} from '../../lib/types/users-presentation';
import { AdminMobileNavigation } from '../components/AdminMobileNavigation';
import { AdminPagination } from '../components/AdminPagination';
import { AdminShell } from '../components/AdminShell';
import { UserInspectionModal } from '../components/UserInspectionModal';
import { UserStatusChangeModal } from '../components/UserStatusChangeModal';
import { UserCardList } from './components/UserCardList';
import { UserDetailPanel } from './components/UserDetailPanel';
import { UserEmptyState } from './components/UserEmptyState';
import { UserKpiCards } from './components/UserKpiCards';
import { UserSearchFilters } from './components/UserSearchFilters';
import { UserTable } from './components/UserTable';

const PAGE_SIZE = 10;
const MOBILE_PAGE_SIZE = 6;

export default function UsersManagementPage() {
  const [users, setUsers] = React.useState<AdminUserRecord[]>(mockAdminUsers);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<'all' | AdminUserRole>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | AdminUserStatus>('all');

  const [selectedUserId, setSelectedUserId] = React.useState<string>(mockAdminUsers[0]?.id || '');
  const [inspectingUser, setInspectingUser] = React.useState<AdminUserRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMobileReadOnly, setIsMobileReadOnly] = React.useState(false);

  // Status Change Dialog State
  const [statusModalUser, setStatusModalUser] = React.useState<AdminUserRecord | null>(null);
  const [statusModalAction, setStatusModalAction] = React.useState<
    'ACTIVATE' | 'SUSPEND' | 'BAN' | null
  >(null);

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [mobileVisibleCount, setMobileVisibleCount] = React.useState(MOBILE_PAGE_SIZE);

  // Filter change handlers that automatically reset pagination
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  };

  const handleRoleChange = (role: 'all' | AdminUserRole) => {
    setSelectedRole(role);
    setCurrentPage(1);
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  };

  const handleStatusFilterChange = (status: 'all' | AdminUserStatus) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  };

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
    setCurrentPage(1);
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  };

  // Filter users list
  const filteredUsers = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((u) => {
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.code.toLowerCase().includes(term) ||
        u.city.toLowerCase().includes(term) ||
        u.document.toLowerCase().includes(term) ||
        u.phone.includes(term) ||
        (u.dealership?.tradeName.toLowerCase().includes(term) ?? false);

      const matchesRole = selectedRole === 'all' || u.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;

  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const mobileUsers = React.useMemo(() => {
    return filteredUsers.slice(0, mobileVisibleCount);
  }, [filteredUsers, mobileVisibleCount]);

  // Selected user for desktop side panel
  const selectedUser = React.useMemo(() => {
    return (
      filteredUsers.find((u) => u.id === selectedUserId) ||
      paginatedUsers[0] ||
      filteredUsers[0] ||
      users[0] ||
      null
    );
  }, [users, selectedUserId, paginatedUsers, filteredUsers]);

  // Metric counters
  const counts = React.useMemo(() => {
    const total = users.length;
    const members = users.filter((u) => u.role === 'member').length;
    const sellersAndDealers = users.filter(
      (u) => u.role === 'seller' || u.role === 'dealer',
    ).length;
    const suspendedOrBanned = users.filter(
      (u) => u.status === 'SUSPENDED' || u.status === 'BANNED',
    ).length;
    return { total, members, sellersAndDealers, suspendedOrBanned };
  }, [users]);

  // Status change handler with audit logging
  const handleStatusChange = (userId: string, newStatus: AdminUserStatus, reason: string) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes(),
    ).padStart(2, '0')}`;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;

        const actionType: 'ACTIVATE' | 'SUSPEND' | 'BAN' =
          newStatus === 'ACTIVE' ? 'ACTIVATE' : newStatus === 'SUSPENDED' ? 'SUSPEND' : 'BAN';

        const newLogEntry = {
          id: `aud-${Date.now()}`,
          timestamp: formattedDate,
          action: actionType,
          fromStatus: u.status,
          toStatus: newStatus,
          reason,
          operator: 'Admin Principal',
          operatorRole: 'main_admin',
        };

        return {
          ...u,
          status: newStatus,
          statusReason: newStatus === 'ACTIVE' ? undefined : reason,
          auditTrail: [newLogEntry, ...u.auditTrail],
        };
      }),
    );
  };

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE USERS VIEW (Figma ADM-M-008)                             */}
      {/* ============================================================== */}
      <div
        data-testid="mobile-users-management"
        className="block lg:hidden min-h-screen bg-slate-50 pb-24"
      >
        {/* Mobile Header Bar */}
        <div className="bg-[#0B111E] text-white p-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              <h1 className="text-base font-bold tracking-tight">Gestão de Usuários</h1>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              ADM-M-008
            </span>
          </div>

          {/* Mobile Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por nome, e-mail, CPF/CNPJ..."
            className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Mobile Filter Chips & Summary */}
        <div className="p-4 space-y-3">
          {/* Quick Stats Pill Row */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block">Total</span>
              <span className="text-sm font-extrabold text-slate-900">{counts.total}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block">Membros</span>
              <span className="text-sm font-extrabold text-slate-900">{counts.members}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block">Vendedores</span>
              <span className="text-sm font-extrabold text-slate-900">
                {counts.sellersAndDealers}
              </span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block">Suspensos</span>
              <span className="text-sm font-extrabold text-red-600">
                {counts.suspendedOrBanned}
              </span>
            </div>
          </div>

          {/* Mobile Filter Dropdowns */}
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Filtrar por papel"
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value as 'all' | AdminUserRole)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Todos os papéis</option>
              <option value="member">Membros (Compradores)</option>
              <option value="seller">Vendedores Particulares</option>
              <option value="dealer">Concessionárias</option>
              <option value="support">Suporte</option>
              <option value="sales">Comercial</option>
              <option value="main_admin">Admin Principal</option>
            </select>

            <select
              aria-label="Filtrar por situação"
              value={selectedStatus}
              onChange={(e) => handleStatusFilterChange(e.target.value as 'all' | AdminUserStatus)}
              className="w-full text-xs py-2 px-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Todas as situações</option>
              <option value="ACTIVE">Ativo</option>
              <option value="PENDING">Pendente</option>
              <option value="SUSPENDED">Suspenso</option>
              <option value="BANNED">Bloqueado</option>
            </select>
          </div>

          {/* Mobile User Cards List or Empty State */}
          {mobileUsers.length > 0 ? (
            <UserCardList
              users={mobileUsers}
              totalFilteredCount={filteredUsers.length}
              visibleCount={mobileVisibleCount}
              onLoadMore={() => setMobileVisibleCount((prev) => prev + MOBILE_PAGE_SIZE)}
              onInspectUser={(user) => {
                setInspectingUser(user);
                setIsMobileReadOnly(true);
                setIsModalOpen(true);
              }}
            />
          ) : (
            <UserEmptyState onResetFilters={handleResetFilters} searchTerm={searchTerm} />
          )}
        </div>

        {/* Mobile Navigation Bar */}
        <AdminMobileNavigation />
      </div>

      {/* ============================================================== */}
      {/* DESKTOP USERS MANAGEMENT (Figma ADM-D-003)                      */}
      {/* ============================================================== */}
      <div
        data-testid="desktop-users-management"
        className="hidden lg:block min-h-screen bg-slate-50"
      >
        <AdminShell>
          <div className="space-y-6">
            {/* Top Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Gestão de Usuários
                  </h1>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    ADM-D-003
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Gerencie contas de membros, vendedores particulares, concessionárias e modere
                  acessos institucionais.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Ambiente de Demonstração (LGPD)</span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
                  title="Atualizar lista"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Summary / KPI Metric Cards (Figma ADM-D-003) */}
            <UserKpiCards
              counts={counts}
              selectedRole={selectedRole}
              selectedStatus={selectedStatus}
              onFilterRole={handleRoleChange}
              onFilterStatus={handleStatusFilterChange}
            />

            {/* Filter Controls Bar */}
            <UserSearchFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusFilterChange}
              onResetFilters={handleResetFilters}
              filteredCount={filteredUsers.length}
              totalCount={users.length}
            />

            {/* Split Screen Master-Detail Layout (Figma ADM-D-003) */}
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Data Table & Pagination (8 Cols) */}
              <div className="col-span-8 space-y-4">
                {paginatedUsers.length > 0 ? (
                  <>
                    <UserTable
                      users={paginatedUsers}
                      selectedUserId={selectedUser?.id || ''}
                      onSelectUser={(user) => setSelectedUserId(user.id)}
                      onInspectUser={(user) => {
                        setInspectingUser(user);
                        setIsMobileReadOnly(false);
                        setIsModalOpen(true);
                      }}
                    />

                    {/* Pagination Controls */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3">
                      <AdminPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={PAGE_SIZE}
                        totalItems={filteredUsers.length}
                        itemName="usuários"
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </>
                ) : (
                  <UserEmptyState onResetFilters={handleResetFilters} searchTerm={searchTerm} />
                )}
              </div>

              {/* Right Column: Selected User Dossier Panel (4 Cols - ADM-D-003-DETAIL-01 to 07) */}
              <UserDetailPanel
                user={selectedUser}
                onOpenDossier={(user) => {
                  setInspectingUser(user);
                  setIsMobileReadOnly(false);
                  setIsModalOpen(true);
                }}
                onRequestStatusChange={(user, action) => {
                  setStatusModalUser(user);
                  setStatusModalAction(action);
                }}
              />
            </div>
          </div>
        </AdminShell>
      </div>

      {/* ============================================================== */}
      {/* FULL INSPECTION MODAL (Tabs: Profile, Dealer, Activity, Audit) */}
      {/* ============================================================== */}
      <UserInspectionModal
        user={inspectingUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInspectingUser(null);
        }}
        readOnly={isMobileReadOnly}
        onOpenStatusModal={(action) => {
          if (inspectingUser) {
            setStatusModalUser(inspectingUser);
            setStatusModalAction(action);
          }
        }}
      />

      {/* ============================================================== */}
      {/* STATUS CHANGE CONFIRMATION MODAL (ADM-D-009 / RBAC)             */}
      {/* ============================================================== */}
      <UserStatusChangeModal
        user={statusModalUser}
        action={statusModalAction}
        isOpen={Boolean(statusModalAction && statusModalUser)}
        onClose={() => {
          setStatusModalAction(null);
          setStatusModalUser(null);
        }}
        onConfirm={(userId, newStatus, reason) => {
          handleStatusChange(userId, newStatus, reason);
          if (inspectingUser && inspectingUser.id === userId) {
            setInspectingUser((prev) =>
              prev ? { ...prev, status: newStatus, statusReason: reason } : null,
            );
          }
        }}
      />
    </>
  );
}
