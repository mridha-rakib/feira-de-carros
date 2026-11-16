'use client';

import { BrandLogo } from '@feira/ui';
import { FileEdit, RefreshCw, UserX, Users } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { mockAdminUsers } from '../../lib/adapters/mock-users-data';
import type {
  AdminUserRecord,
  AdminUserRole,
  AdminUserStatus,
} from '../../lib/types/users-presentation';
import { AdminPagination } from '../components/AdminPagination';
import { AdminShell } from '../components/AdminShell';
import { UserInspectionModal } from '../components/UserInspectionModal';
import { UserStatusChangeModal } from '../components/UserStatusChangeModal';
import { MobileClientSearch } from './components/MobileClientSearch';
import { UserDetailPanel } from './components/UserDetailPanel';
import { UserEmptyState } from './components/UserEmptyState';
import { UserKpiCards } from './components/UserKpiCards';
import { UserSearchFilters } from './components/UserSearchFilters';
import { UserTable } from './components/UserTable';

const PAGE_SIZE = 10;

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

  // Filter change handlers that automatically reset pagination
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (role: 'all' | AdminUserRole) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: 'all' | AdminUserStatus) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // Filter users list
  const filteredUsers = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const searchWords = term ? term.split(/\s+/).filter(Boolean) : [];

    return users.filter((u) => {
      const searchableText =
        `${u.name} ${u.email} ${u.code} ${u.city} ${u.document} ${u.phone} ${u.dealership?.tradeName ?? ''}`.toLowerCase();
      const matchesSearch =
        searchWords.length === 0 || searchWords.every((word) => searchableText.includes(word));

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
    const sellers = users.filter((u) => u.role === 'seller').length;
    const dealers = users.filter((u) => u.role === 'dealer').length;
    const sellersAndDealers = sellers + dealers;
    const suspendedOrBanned = users.filter(
      (u) => u.status === 'SUSPENDED' || u.status === 'BANNED',
    ).length;
    return { total, members, sellers, dealers, sellersAndDealers, suspendedOrBanned };
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
      {/* MOBILE CLIENT SEARCH VIEW (Figma ADM-M-008)                     */}
      {/* ============================================================== */}
      <MobileClientSearch
        users={users}
        onInspectUser={(user) => {
          setInspectingUser(user);
          setIsMobileReadOnly(true);
          setIsModalOpen(true);
        }}
      />

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
                <Link
                  href="/exclusao-contas"
                  data-testid="link-exclusao-contas"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <UserX className="w-3.5 h-3.5 text-red-600" />
                  Exclusão de contas (3)
                </Link>
                <Link
                  href="/correcoes-clientes"
                  data-testid="link-correcoes-clientes"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <FileEdit className="w-3.5 h-3.5 text-blue-600" />
                  Correções cadastrais (3)
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Amostra demonstrativa: 22 contas carregadas (Base total: 2.406)
                </span>
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
