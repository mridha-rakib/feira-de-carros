import { CheckCircle2, Eye, Mail, MapPin, Phone, Shield } from 'lucide-react';
import * as React from 'react';
import type { AdminUserRecord } from '../../../lib/types/users-presentation';
import { LoadMore } from '../../components/LoadMore';
import { UserAvatar } from './UserAvatar';
import { UserRoleBadge, UserStatusBadge } from './UserStatusBadge';

interface UserCardListProps {
  users: AdminUserRecord[];
  totalFilteredCount: number;
  visibleCount: number;
  onLoadMore: () => void;
  onInspectUser: (user: AdminUserRecord) => void;
}

export function UserCardList({
  users,
  totalFilteredCount,
  visibleCount,
  onLoadMore,
  onInspectUser,
}: UserCardListProps) {
  return (
    <div className="space-y-3 pt-1">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
        >
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                  {user.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono">{user.code}</p>
              </div>
            </div>
            <UserStatusBadge status={user.status} />
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block">Papel</span>
              <UserRoleBadge role={user.role} className="mt-0.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Localização</span>
              <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {user.city}, {user.state}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-400 block">Contato</span>
              <div className="flex items-center gap-2 mt-0.5 text-slate-700">
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Dealership Info Badge */}
          {user.dealership && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs flex items-center justify-between">
              <span className="font-semibold text-slate-800 truncate">
                {user.dealership.tradeName}
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md shrink-0">
                {user.dealership.plan}
              </span>
            </div>
          )}

          {/* Mobile Inspection Action (Read-only as per AUTH-019 / ADM-021) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onInspectUser(user)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Inspecionar Dossiê (Leitura)
            </button>
          </div>
        </div>
      ))}

      {/* Load More Pagination Helper */}
      <LoadMore
        currentCount={visibleCount}
        totalCount={totalFilteredCount}
        onLoadMore={onLoadMore}
        itemName="usuários"
      />
    </div>
  );
}
