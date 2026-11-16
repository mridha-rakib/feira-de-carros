'use client';

import { AdminShell } from '@/app/components/AdminShell';
import {
  CUSTOMER_CORRECTION_KPIS,
  mockCustomerCorrections,
} from '@/lib/adapters/mock-customer-corrections-data';
import type {
  CustomerCorrectionFieldType,
  CustomerCorrectionRecord,
  CustomerCorrectionStatus,
} from '@/lib/types/customer-corrections-presentation';
import { FileEdit, Shield } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { CustomerCorrectionDetailPanel } from './components/CustomerCorrectionDetailPanel';
import { CustomerCorrectionKpiCards } from './components/CustomerCorrectionKpiCards';
import { CustomerCorrectionSearchFilters } from './components/CustomerCorrectionSearchFilters';
import { CustomerCorrectionTable } from './components/CustomerCorrectionTable';

export default function CustomerCorrectionsQueuePage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<CustomerCorrectionStatus | 'all'>(
    'all',
  );
  const [selectedField, setSelectedField] = React.useState<CustomerCorrectionFieldType | 'all'>(
    'all',
  );

  // Default selected record is COR-DEMO-0042 per requirements
  const [selectedCorrectionId, setSelectedCorrectionId] = React.useState<string>('COR-DEMO-0042');

  const filteredCorrections = React.useMemo(() => {
    return mockCustomerCorrections.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesField = selectedField === 'all' || item.fieldType === selectedField;

      return matchesSearch && matchesStatus && matchesField;
    });
  }, [searchTerm, selectedStatus, selectedField]);

  const selectedCorrection = React.useMemo(() => {
    return (
      filteredCorrections.find((c) => c.id === selectedCorrectionId) ||
      mockCustomerCorrections.find((c) => c.id === selectedCorrectionId) ||
      filteredCorrections[0]
    );
  }, [filteredCorrections, selectedCorrectionId]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedField('all');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Usuários', 'Correções de dados']}
      maxWidthClass="max-w-[1440px]"
    >
      <div className="space-y-6" data-testid="customer-corrections-queue-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Fila de correções de dados de clientes
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ADM-D-041
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Solicitações de alteração cadastral, validação de titularidade e controle de
              permissões.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/usuarios"
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <span>Voltar a Usuários</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <CustomerCorrectionKpiCards
          summary={CUSTOMER_CORRECTION_KPIS}
          selectedStatus={selectedStatus}
          onFilterStatus={setSelectedStatus}
        />

        {/* Filters and Search Bar */}
        <CustomerCorrectionSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedField={selectedField}
          onFieldChange={setSelectedField}
          onResetFilters={handleResetFilters}
          filteredCount={filteredCorrections.length}
          totalCount={mockCustomerCorrections.length}
        />

        {/* Split Screen Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Corrections Table (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {filteredCorrections.length > 0 ? (
              <CustomerCorrectionTable
                corrections={filteredCorrections}
                selectedCorrectionId={selectedCorrection?.id || ''}
                onSelectCorrection={(item: CustomerCorrectionRecord) =>
                  setSelectedCorrectionId(item.id)
                }
              />
            ) : (
              <div
                data-testid="correction-empty-state"
                className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
              >
                <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                <h2 className="text-sm font-bold text-slate-800">Nenhuma solicitação encontrada</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Não foram localizadas solicitações com os filtros atuais.
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

          {/* Right Column: Selected Correction Detail Panel (4 Cols) */}
          <div className="lg:col-span-4">
            <CustomerCorrectionDetailPanel correction={selectedCorrection} />
          </div>
        </div>

        {/* Demo Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Registros fictícios; nenhuma alteração persistida em banco de
          dados.
        </div>
      </div>
    </AdminShell>
  );
}
