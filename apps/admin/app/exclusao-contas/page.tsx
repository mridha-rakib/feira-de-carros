'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { mockAccountDeletionRequests } from '@/lib/adapters/mock-account-deletion-data';
import type {
  AccountDeletionRecord,
  AccountDeletionStatus,
} from '@/lib/types/account-deletion-presentation';
import { AlertTriangle, Lock, RefreshCw, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { AccountDeletionDetailPanel } from './components/AccountDeletionDetailPanel';
import { AccountDeletionKpiCards } from './components/AccountDeletionKpiCards';
import { AccountDeletionLgpdReviewCard } from './components/AccountDeletionLgpdReviewCard';
import { AccountDeletionSearchFilters } from './components/AccountDeletionSearchFilters';
import { AccountDeletionTable } from './components/AccountDeletionTable';

export default function AccountDeletionQueuePage() {
  const router = useRouter();
  const [records] = React.useState<AccountDeletionRecord[]>(mockAccountDeletionRequests);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | AccountDeletionStatus>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'seller' | 'buyer'>('all');
  const [locationFilter, setLocationFilter] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string>(
    mockAccountDeletionRequests[0]?.id || 'EX-2026-0027',
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedCategory('all');
    setLocationFilter('');
  };

  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        q === '' ||
        r.id.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.userRoleLabel.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || r.userRole === selectedCategory;

      const locQ = locationFilter.toLowerCase();
      const matchesLocation = locQ === '' || r.location.toLowerCase().includes(locQ);

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
    });
  }, [records, searchTerm, selectedStatus, selectedCategory, locationFilter]);

  const selectedRecord = React.useMemo(() => {
    return (
      filteredRecords.find((r) => r.id === selectedId) ||
      records.find((r) => r.id === selectedId) ||
      filteredRecords[0] ||
      null
    );
  }, [filteredRecords, records, selectedId]);

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Usuários', 'Solicitações de exclusão de conta']}
      maxWidthClass="max-w-[1330px]"
    >
      <div className="space-y-6" data-testid="account-deletion-queue-page">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Solicitações de exclusão de conta
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                ADM-D-036
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Pedidos de usuários, impactos de anúncios/chats e retenção LGPD.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Atualizar filtros"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Restriction Banner */}
        <div
          data-testid="mobile-deletion-queue-banner"
          className="lg:hidden p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800 shadow-2xs"
        >
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Operações de Exclusão Restritas ao Desktop (ADM-019)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Por política estrita da LGPD, a deliberação sobre solicitações de exclusão de contas e a
            homologação de descarte de dados são bloqueadas no ambiente móvel.
          </p>
        </div>

        {/* Top 4 KPI Cards */}
        <AccountDeletionKpiCards
          selectedStatus={selectedStatus}
          onFilterStatus={(s) => setSelectedStatus((prev) => (prev === s ? 'all' : s))}
        />

        {/* Search & Filters */}
        <AccountDeletionSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredRecords.length}
          totalRecords={records.length}
        />

        {/* Master-Detail Split Composition */}
        <div>
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-800">Solicitações recebidas</h2>
            <p className="text-xs text-slate-500">
              Conta, impacto e status - nenhuma exclusão automática de dados privados.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Table */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <AccountDeletionTable
                records={filteredRecords}
                selectedId={selectedRecord?.id || null}
                onSelectRecord={(r) => setSelectedId(r.id)}
                onNavigateDetail={(id) => router.push(`/exclusao-contas/${id}`)}
              />
            </div>

            {/* Right Column: Selected Record Detail */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-6">
                <AccountDeletionDetailPanel
                  record={selectedRecord}
                  onNavigateDetail={(id) => router.push(`/exclusao-contas/${id}`)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LGPD Review Card */}
        <AccountDeletionLgpdReviewCard selectedId={selectedRecord?.id || 'EX-2026-0027'} />

        {/* Demo Audit Banner Matching Figma ADM-D-036 */}
        <div
          data-testid="deletion-compliance-banner"
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950"
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase tracking-wide">
                SOLICITAÇÃO SOB ANÁLISE - NENHUM REGISTRO EXCLUÍDO
              </strong>
              <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                Exclusão imediata, eliminação de histórico e acesso indevido não são permitidos.
                Decisão final depende das políticas LGPD e de regras legais validadas, com
                auditoria.
              </p>
            </div>
          </div>
        </div>

        {/* LGPD Footer Note */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Dados e casos fictícios; nenhum acesso privado ou ação
          administrativa efetivada.
        </div>
      </div>
    </AdminShell>
  );
}
