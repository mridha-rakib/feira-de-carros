'use client';

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  MapPin,
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
import { AdminShell } from '../components/AdminShell';
import { SellerInspectionModal } from '../components/SellerInspectionModal';

export default function SellerApprovalPage() {
  const [applications, setApplications] =
    React.useState<SellerApplication[]>(mockSellerApplications);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'all' | SellerType>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | SellerApplicationStatus>(
    'all',
  );
  const [inspectingApplication, setInspectingApplication] =
    React.useState<SellerApplication | null>(null);

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
            <Image
              src="/brand/logo-white.png"
              alt="Feira de Carros"
              width={120}
              height={32}
              priority
              className="h-6 w-auto object-contain"
            />
            <div className="text-right">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                ADMIN • MOBILE WEB
              </span>
              <span className="text-[10px] text-slate-400">Vendedores • ADM-M-002</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ipatinga - MG</span>
            <span>Fila de Aprovação</span>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* Mobile Title & Metric Strip */}
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Aprovação de Vendedores
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Avaliação documental e conformidade LGPD.
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
                Lojas / CNPJ
              </button>
            </div>
          </div>

          {/* Mobile Cards List */}
          <div className="space-y-3">
            {filteredApplications.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl text-center border border-slate-200 text-slate-500 text-xs">
                Nenhum vendedor encontrado com os filtros selecionados.
              </div>
            ) : (
              filteredApplications.map((app) => (
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

                  <button
                    type="button"
                    onClick={() => setInspectingApplication(app)}
                    className="w-full py-2.5 px-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Analisar documentos
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fixed Mobile Navigation with Vendedores Active */}
        <AdminMobileNavigation />
      </div>

      {/* ============================================================== */}
      {/* DESKTOP SELLER APPROVAL (Figma ADM-D-003)                      */}
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
                  Avaliação cadastral, conformidade com a LGPD e habilitação de anunciantes (Figma
                  ADM-D-003).
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

            {/* Desktop Table (Figma ADM-D-003) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                      <th className="py-3.5 px-4">Código / Vendedor</th>
                      <th className="py-3.5 px-4">Tipo</th>
                      <th className="py-3.5 px-4">Documento (LGPD)</th>
                      <th className="py-3.5 px-4">Localidade</th>
                      <th className="py-3.5 px-4">Data Envio</th>
                      <th className="py-3.5 px-4">Situação</th>
                      <th className="py-3.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <p className="text-sm font-semibold">Nenhuma solicitação encontrada</p>
                          <p className="text-xs mt-1">
                            Tente ajustar os termos de busca ou filtros selecionados.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold text-[11px]">
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
                          <td className="py-3.5 px-4">
                            {app.type === 'concessionaria' ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                                <Building2 className="w-3.5 h-3.5" />
                                Concessionária
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                                <User className="w-3.5 h-3.5" />
                                Particular
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-800">{app.document}</td>
                          <td className="py-3.5 px-4">
                            <span className="flex items-center gap-1 text-slate-600">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                              {app.city}, {app.state}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{app.submittedAt}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setInspectingApplication(app)}
                              className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors shadow-2xs text-xs inline-flex items-center gap-1"
                            >
                              <span>Analisar</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Exibindo <strong>{filteredApplications.length}</strong> de{' '}
                  <strong>{applications.length}</strong> solicitações
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  AMBIENTE DEMONSTRATIVO • Fila operacional
                </span>
              </div>
            </div>
          </div>
        </AdminShell>
      </div>

      {/* Inspection Modal */}
      <SellerInspectionModal
        application={inspectingApplication}
        isOpen={inspectingApplication !== null}
        onClose={() => setInspectingApplication(null)}
        onDecision={handleDecision}
      />
    </>
  );
}
