import * as React from 'react';
import type { AdminUserRole, AdminUserStatus } from '../../../lib/types/users-presentation';

interface UserStatusBadgeProps {
  status: AdminUserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className = '' }: UserStatusBadgeProps) {
  switch (status) {
    case 'ACTIVE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Ativo
        </span>
      );
    case 'PENDING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pendente
        </span>
      );
    case 'SUSPENDED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Suspenso
        </span>
      );
    case 'BANNED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Bloqueado
        </span>
      );
  }
}

interface UserRoleBadgeProps {
  role: AdminUserRole;
  className?: string;
}

export function UserRoleBadge({ role, className = '' }: UserRoleBadgeProps) {
  const getRoleConfig = (r: AdminUserRole) => {
    switch (r) {
      case 'main_admin':
        return {
          label: 'Admin Principal',
          classes: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'sales':
        return { label: 'Comercial', classes: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'support':
        return { label: 'Suporte', classes: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'dealer':
        return { label: 'Concessionária', classes: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'seller':
        return { label: 'Vendedor', classes: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Membro', classes: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const { label, classes } = getRoleConfig(role);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${classes} ${className}`}
    >
      {label}
    </span>
  );
}
