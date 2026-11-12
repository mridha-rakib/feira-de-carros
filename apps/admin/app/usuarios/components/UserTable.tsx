import { CheckCircle2, Eye, MapPin } from 'lucide-react';
import * as React from 'react';
import type { AdminUserRecord } from '../../../lib/types/users-presentation';
import { UserAvatar } from './UserAvatar';
import { UserRoleBadge, UserStatusBadge } from './UserStatusBadge';

interface UserTableProps {
  users: AdminUserRecord[];
  selectedUserId: string;
  onSelectUser: (user: AdminUserRecord) => void;
  onInspectUser: (user: AdminUserRecord) => void;
}

export function UserTable({ users, selectedUserId, onSelectUser, onInspectUser }: UserTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Usuário</th>
              <th className="py-3.5 px-4">Papel / Perfil</th>
              <th className="py-3.5 px-4">Localização</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Cadastro</th>
              <th className="py-3.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isSelected = user.id === selectedUserId;

              return (
                <tr
                  key={user.id}
                  tabIndex={0}
                  onClick={() => onSelectUser(user)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectUser(user);
                    }
                  }}
                  className={`group cursor-pointer transition-colors focus:outline-none focus:bg-slate-100/80 ${
                    isSelected
                      ? 'bg-red-50/50 hover:bg-red-50/70 border-l-4 border-l-red-600'
                      : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                  }`}
                >
                  {/* User Profile Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={user.name}
                        avatarUrl={user.avatarUrl}
                        size="sm"
                        isSelected={isSelected}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                            {user.name}
                          </span>
                          {user.verified && (
                            <span title="Verificado" className="inline-flex">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block">
                          {user.code} • {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <UserRoleBadge role={user.role} />
                      {user.dealership && (
                        <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                          {user.dealership.tradeName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Location Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>
                        {user.city}, {user.state}
                      </span>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-3.5 px-4">
                    <UserStatusBadge status={user.status} />
                  </td>

                  {/* Registered At Column */}
                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 font-mono text-[11px] block">
                      {user.registeredAt.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Acesso: {user.lastAccessAt.split(' ')[0]}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUser(user);
                        onInspectUser(user);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Abrir inspeção detalhada do usuário"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspecionar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
