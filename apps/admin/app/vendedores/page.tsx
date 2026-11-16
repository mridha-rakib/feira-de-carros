'use client';

import { BrandLogo } from '@feira/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  Lock,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { mockSellerApplications } from '../../lib/adapters/mock-b2-data';
import type {
  SellerApplication,
  SellerApplicationStatus,
  SellerType,
} from '../../lib/types/b2-presentation';
import { AdminMobileNavigation } from '../components/AdminMobileNavigation';
import { AdminPagination } from '../components/AdminPagination';
import { AdminShell } from '../components/AdminShell';
import { LoadMore } from '../components/LoadMore';
import { SellerInspectionModal } from '../components/SellerInspectionModal';

export default function SellerApprovalPage() {
  const [applications, setApplications] =
    React.useState<SellerApplication[]>(mockSellerApplications);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'all' | SellerType>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | SellerApplicationStatus>(
    'all',
  );
  const [selectedAppId, setSelectedAppId] = React.useState<string>(
    mockSellerApplications[0]?.id || '',
  );
  const [inspectingApplication, setInspectingApplication] =
    React.useState<SellerApplication | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = React.useState(false);

  // Panel decision state
  const [panelActionType, setPanelActionType] = React.useState<'corrections' | 'reject' | null>(
    null,
  );
  const [panelReasonText, setPanelReasonText] = React.useState('');
  const [panelFeedback, setPanelFeedback] = React.useState<string | null>(null);

  // Pagination states
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [mobileVisibleCount, setMobileVisibleCount] = React.useState(6);

  // Reset pagination on search or filter change
  React.useEffect(() => {
    if (searchTerm || selectedType || selectedStatus) {
      setCurrentPage(1);
      setMobileVisibleCount(6);
    } else {
      setCurrentPage(1);
      setMobileVisibleCount(6);
    }
  }, [searchTerm, selectedType, selectedStatus]);

  // Filter application list
  const filteredApplications = React.useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.document.includes(searchTerm);

      const matchesType = selectedType === 'all' || app.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [applications, searchTerm, selectedType, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplications.length / PAGE_SIZE) || 1;

  const paginatedApplications = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredApplications.slice(start, start + PAGE_SIZE);
  }, [filteredApplications, currentPage]);

  const mobileApplications = React.useMemo(() => {
    return filteredApplications.slice(0, mobileVisibleCount);
  }, [filteredApplications, mobileVisibleCount]);

  // Currently selected application in desktop side panel
  const selectedApplication = React.useMemo(() => {
    return (
      applications.find((app) => app.id === selectedAppId) ||
      paginatedApplications[0] ||
      filteredApplications[0] ||
      applications[0]
    );
  }, [applications, selectedAppId, paginatedApplications, filteredApplications]);

  // Metric counters
  const counts = React.useMemo(() => {
    const pending = applications.filter((a) => a.status === 'pending').length;
    const approved = applications.filter((a) => a.status === 'approved').length;
    const corrections = applications.filter((a) => a.status === 'corrections').length;
    const dealerships = applications.filter((a) => a.type === 'concessionaria').length;
    return { pending, approved, corrections, dealerships };
  }, [applications]);

  const handleDecision = (id: string, newStatus: SellerApplicationStatus, reason?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              rejectionReason: reason || app.rejectionReason,
              verifiedAt: newStatus === 'approved' ? 'Agora por Main Admin' : app.verifiedAt,
            }
          : app,
      ),
    );
  };

  const handlePanelApprove = () => {
    if (!selectedApplication) return;
    handleDecision(selectedApplication.id, 'approved');
    setPanelFeedback('Vendedor credenciado com sucesso no sistema!');
    setTimeout(() => setPanelFeedback(null), 3000);
  };

  const handlePanelConfirmAction = () => {
    if (!selectedApplication || !panelReasonText.trim()) return;
    if (panelActionType === 'corrections') {
      handleDecision(selectedApplication.id, 'corrections', panelReasonText.trim());
      setPanelFeedback('Solicitação de correção registrada e enviada.');
    } else if (panelActionType === 'reject') {
      handleDecision(selectedApplication.id, 'rejected', panelReasonText.trim());
      setPanelFeedback('Solicitação recusada com justificativa de auditoria.');
    }
    setPanelActionType(null);
    setPanelReasonText('');
    setTimeout(() => setPanelFeedback(null), 3000);
  };

  const getStatusBadge = (status: SellerApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pendente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Aprovado
          </span>
        );
      case 'corrections':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            Correções
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            Recusado
          </span>
        );
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE SELLER APPROVAL (Figma ADM-M-002)                        */}
      {/* ============================================================== */}
      <div
        className="block lg:hidden min-h-screen bg-slate-100 pb-24"
        data-testid="mobile-seller-approval"
      >
        {/* Mobile Dark Header */}
        <header className="bg-[#0B111E] text-white p-4">
          <div className="flex items-center justify-between">
            <BrandLogo variant="on-dark" priority width={130} height={26} className="h-6 w-auto" />
            <div className="text-right">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                ADMIN • MOBILE WEB
              </span>
              <span className="text-[10px] text-slate-400">
                Solicitações de vendedores • ADM-M-002
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ipatinga - MG</span>
            <span>Fila Operacional</span>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* Mobile Title & Overview */}
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Solicitações de Vendedores
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualização móvel de solicitações (ADM-021 • Somente Leitura).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Pendentes
              </span>
              <span className="text-2xl font-black text-amber-600">{counts.pending}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Concessionárias
              </span>
              <span className="text-2xl font-black text-slate-900">{counts.dealerships}</span>
            </div>
          </div>

          {/* Mobile Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar vendedor ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                  selectedType === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Todos ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('particular')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                  selectedType === 'particular'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Pessoas Físicas
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('concessionaria')}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                  selectedType === 'concessionaria'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Concessionárias
              </button>
            </div>
          </div>

          {/* Mobile Cards List */}
          <div className="space-y-3">
            {mobileApplications.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl text-center border border-slate-200 text-slate-500 text-xs">
                Nenhuma solicitação encontrada com os filtros selecionados.
              </div>
            ) : (
              <>
                {mobileApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-amber-600 font-bold">
                            {app.code}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">
                            {app.type === 'concessionaria' ? 'Concessionária' : 'Particular'}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{app.name}</h3>
                        {app.tradeName && (
                          <span className="text-xs text-slate-500 block">{app.tradeName}</span>
                        )}
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Documento:</span>
                        <span className="font-mono font-medium text-slate-800">{app.document}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Local:</span>
                        <span className="text-slate-800">
                          {app.city}, {app.state}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Envio:</span>
                        <span className="text-slate-600">{app.submittedAt}</span>
                      </div>
                    </div>

                    {/* Read-Only Mobile Detail Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setInspectingApplication(app);
                        setIsMobileModalOpen(true);
                      }}
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Ver detalhes e documentos</span>
                    </button>
                  </div>
                ))}

                <LoadMore
                  currentCount={mobileApplications.length}
                  totalCount={filteredApplications.length}
                  onLoadMore={() => setMobileVisibleCount((prev) => prev + 6)}
                  step={6}
                  itemName="solicitações"
                />
              </>
            )}
          </div>
        </div>

        {/* Fixed Mobile Navigation with Vendedores Active */}
        <AdminMobileNavigation />
      </div>

      {/* ============================================================== */}
      {/* DESKTOP SELLER APPROVAL (Figma ADM-D-005)                      */}
      {/* ============================================================== */}
      <div className="hidden lg:block" data-testid="desktop-seller-approval">
        <AdminShell breadcrumbs={['Admin', 'Aprovação de vendedores']}>
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Aprovação de Vendedores
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Fila de solicitações de novos anunciantes, verificação cadastral e credenciamento
                  (Figma ADM-D-005).
                </p>
              </div>

              {/* RBAC Callout Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                <span>Autorização exclusiva • Main Admin</span>
              </div>
            </div>

            {/* Metric KPI Cards Strip */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pendentes de Análise
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.pending}
                </div>
                <p className="text-[11px] text-amber-700 mt-1 font-medium">
                  Aguardando validação do Main Admin
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Aprovados no Mês
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.approved + 682}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  +25 novos vendedores nos últimos 30 dias
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Com Correções
                  </span>
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.corrections}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Aguardando reenvio de documento</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Concessionárias
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {counts.dealerships}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Lojas com CNPJ sob análise</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail, documento ou localidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-slate-800"
                />
              </div>

              {/* Segmented Type Controls */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedType === 'all'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({applications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('particular')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedType === 'particular'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Particulares (CPF)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('concessionaria')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedType === 'concessionaria'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Concessionárias (CNPJ)
                </button>
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as 'all' | SellerApplicationStatus)
                  }
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Apenas Pendentes</option>
                  <option value="approved">Aprovados</option>
                  <option value="corrections">Com Correções</option>
                  <option value="rejected">Recusados</option>
                </select>
              </div>
            </div>

            {/* Split Information Architecture: Queue + Selected Seller Detail Panel (Figma ADM-D-005) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Seller Applications Queue Table */}
              <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Fila de Solicitações ({filteredApplications.length})
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Selecione um item para ver detalhes
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="py-3 px-3.5">Código / Vendedor</th>
                        <th className="py-3 px-3">Tipo</th>
                        <th className="py-3 px-3">Localidade</th>
                        <th className="py-3 px-3">Situação</th>
                        <th className="py-3 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedApplications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            <p className="text-sm font-semibold">Nenhuma solicitação encontrada</p>
                            <p className="text-xs mt-1">
                              Tente ajustar os termos de busca ou filtros selecionados.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        paginatedApplications.map((app) => {
                          const isSelected = selectedApplication?.id === app.id;
                          return (
                            <tr
                              key={app.id}
                              tabIndex={0}
                              onClick={() => setSelectedAppId(app.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedAppId(app.id);
                                }
                              }}
                              className={`cursor-pointer transition-colors group ${
                                isSelected
                                  ? 'bg-red-50/70 border-l-4 border-l-red-600 font-medium'
                                  : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td className="py-3 px-3.5">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-[11px] ${
                                      isSelected
                                        ? 'bg-red-600 text-white'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {app.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 block group-hover:text-red-700 transition-colors">
                                      {app.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-amber-700">
                                      {app.code}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                {app.type === 'concessionaria' ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-purple-700 text-[11px]">
                                    <Building2 className="w-3 h-3" />
                                    Loja
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 font-medium text-slate-600 text-[11px]">
                                    <User className="w-3 h-3" />
                                    Particular
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                  {app.city}
                                </span>
                              </td>
                              <td className="py-3 px-3">{getStatusBadge(app.status)}</td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAppId(app.id);
                                    setInspectingApplication(app);
                                    setIsMobileModalOpen(false);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors shadow-2xs text-[11px] inline-flex items-center gap-1"
                                >
                                  <span>Analisar</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={PAGE_SIZE}
                  totalItems={filteredApplications.length}
                  onPageChange={setCurrentPage}
                  itemName="solicitações"
                />
              </div>

              {/* Right Column: Selected Seller Detail & Decision Panel (Figma ADM-D-005) */}
              <div
                data-testid="selected-seller-detail-panel"
                className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5"
              >
                {selectedApplication ? (
                  <>
                    {/* Panel Top Heading & Badge */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono text-xs text-amber-600 font-bold">
                            {selectedApplication.code}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-600 capitalize">
                            {selectedApplication.type === 'concessionaria'
                              ? 'Concessionária (CNPJ)'
                              : 'Vendedor Particular (CPF)'}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                          {selectedApplication.name}
                        </h2>
                        {selectedApplication.tradeName && (
                          <span className="text-xs text-slate-500 block">
                            Fantasia: {selectedApplication.tradeName}
                          </span>
                        )}
                      </div>
                      <div>{getStatusBadge(selectedApplication.status)}</div>
                    </div>

                    {/* Feedback Alert if Action Triggered */}
                    {panelFeedback && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{panelFeedback}</span>
                      </div>
                    )}

                    {/* Contact & Location Info */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Documento LGPD:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {selectedApplication.document}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">E-mail:</span>
                        <span className="font-medium text-slate-800">
                          {selectedApplication.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Telefone:</span>
                        <span className="font-medium text-slate-800">
                          {selectedApplication.phone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Localidade:</span>
                        <span className="font-medium text-slate-800">
                          {selectedApplication.city}, {selectedApplication.state}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Data de Envio:</span>
                        <span className="text-slate-600">{selectedApplication.submittedAt}</span>
                      </div>
                    </div>

                    {/* Document Checklist Items */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Documentos para Auditoria
                      </h3>

                      <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between bg-white text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">
                            {selectedApplication.documentProofName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            alert(`Visualizando ${selectedApplication.documentProofName}`)
                          }
                          className="text-[11px] text-red-700 font-bold hover:underline shrink-0 ml-2"
                        >
                          Ver arquivo
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between bg-white text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">
                            {selectedApplication.addressProofName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            alert(`Visualizando ${selectedApplication.addressProofName}`)
                          }
                          className="text-[11px] text-red-700 font-bold hover:underline shrink-0 ml-2"
                        >
                          Ver arquivo
                        </button>
                      </div>
                    </div>

                    {/* Decision Form inputs if action selected */}
                    {panelActionType && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <label htmlFor="panel-reason" className="font-bold text-slate-800 block">
                          {panelActionType === 'corrections'
                            ? 'Instruções de correção ao vendedor:'
                            : 'Justificativa da recusa cadastral:'}
                        </label>
                        <textarea
                          id="panel-reason"
                          rows={2}
                          value={panelReasonText}
                          onChange={(e) => setPanelReasonText(e.target.value)}
                          placeholder="Informe a justificativa..."
                          className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setPanelActionType(null);
                              setPanelReasonText('');
                            }}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handlePanelConfirmAction}
                            disabled={!panelReasonText.trim()}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold disabled:opacity-50"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Operational Action Controls (Desktop Exclusive) */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handlePanelApprove}
                          className="py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Aprovar Vendedor</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPanelActionType('corrections')}
                          className="py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                        >
                          Solicitar Correção
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setPanelActionType('reject')}
                          className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline"
                        >
                          Recusar Cadastro
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setInspectingApplication(selectedApplication);
                            setIsMobileModalOpen(false);
                          }}
                          className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 hover:underline"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Auditoria Completa</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Selecione um vendedor na fila para carregar suas informações.
                  </div>
                )}
              </div>
            </div>
          </div>
        </AdminShell>
      </div>

      {/* Inspection Modal (Desktop: Interactive; Mobile: Read-Only via prop) */}
      <SellerInspectionModal
        application={inspectingApplication}
        isOpen={inspectingApplication !== null}
        onClose={() => setInspectingApplication(null)}
        onDecision={handleDecision}
        readOnly={isMobileModalOpen}
      />
    </>
  );
}
