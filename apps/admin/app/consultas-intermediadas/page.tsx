'use client';

import { AdminShell } from '@/app/components/AdminShell';
import {
  INQUIRY_KPI_DATA,
  mockIntermediatedInquiries,
} from '@/lib/adapters/mock-intermediated-inquiries-data';
import type {
  InquiryStatus,
  IntermediatedInquiryRecord,
} from '@/lib/types/intermediated-inquiries-presentation';
import { MessageSquare, Shield } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { InquiryDetailPanel } from './components/InquiryDetailPanel';
import { InquiryKpiCards } from './components/InquiryKpiCards';
import { InquirySearchFilters } from './components/InquirySearchFilters';
import { InquiryTable } from './components/InquiryTable';
import { MobileIntermediatedInquiriesView } from './components/MobileIntermediatedInquiriesView';

export default function IntermediatedInquiriesQueuePage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<InquiryStatus | 'all'>('all');

  // Default selected inquiry is INQ-LEG-0021 per requirements
  const [selectedInquiryId, setSelectedInquiryId] = React.useState<string>('INQ-LEG-0021');

  const filteredInquiries = React.useMemo(() => {
    return mockIntermediatedInquiries.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.advertisementId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const selectedInquiry = React.useMemo(() => {
    return (
      filteredInquiries.find((inq) => inq.id === selectedInquiryId) ||
      mockIntermediatedInquiries.find((inq) => inq.id === selectedInquiryId) ||
      filteredInquiries[0]
    );
  }, [filteredInquiries, selectedInquiryId]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
  };

  return (
    <>
      {/* ============================================================== */}
      {/* MOBILE RESTRICTED VIEW (ADM-M-007) - Rendered on < 1024px       */}
      {/* ============================================================== */}
      <MobileIntermediatedInquiriesView />

      {/* ============================================================== */}
      {/* DESKTOP QUEUE VIEW (ADM-D-043) - Rendered on >= 1024px          */}
      {/* ============================================================== */}
      <div className="hidden lg:block">
        <AdminShell
          breadcrumbs={['Admin', 'Mensagens e denúncias', 'Consultas intermediadas']}
          maxWidthClass="max-w-[1440px]"
        >
          <div className="space-y-6" data-testid="intermediated-inquiries-page">
            {/* Top Page Header */}
            <div className="flex items-center justify-between gap-4 pb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Consultas intermediadas da Feira
                  </h1>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    ADM-D-043
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Contatos de compradores sobre anúncios legados; mediação institucional da
                  plataforma.
                </p>
              </div>

              {/* Navigation Action */}
              <div className="flex items-center gap-3">
                <Link
                  href="/moderacao"
                  className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                >
                  <span>Voltar a Moderação</span>
                </Link>
              </div>
            </div>

            {/* 4 KPI Cards */}
            <InquiryKpiCards
              summary={INQUIRY_KPI_DATA}
              selectedStatus={selectedStatus}
              onFilterStatus={setSelectedStatus}
            />

            {/* Filters and Search Bar */}
            <InquirySearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onResetFilters={handleResetFilters}
              filteredCount={filteredInquiries.length}
              totalCount={mockIntermediatedInquiries.length}
            />

            {/* Split Screen Master-Detail Layout */}
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Inquiry Table (8 Cols) */}
              <div className="col-span-8 space-y-4">
                {filteredInquiries.length > 0 ? (
                  <InquiryTable
                    inquiries={filteredInquiries}
                    selectedInquiryId={selectedInquiry?.id || ''}
                    onSelectInquiry={(item: IntermediatedInquiryRecord) =>
                      setSelectedInquiryId(item.id)
                    }
                  />
                ) : (
                  <div
                    data-testid="inquiry-empty-state"
                    className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                  >
                    <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                    <h2 className="text-sm font-bold text-slate-800">
                      Nenhuma consulta encontrada
                    </h2>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Não foram localizadas consultas com os filtros atuais.
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

              {/* Right Column: Selected Inquiry Detail Panel (4 Cols) */}
              <div className="col-span-4">
                <InquiryDetailPanel inquiry={selectedInquiry} />
              </div>
            </div>

            {/* Demo Environment Notice */}
            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-200">
              AMBIENTE DEMONSTRATIVO • Dados e consultas fictícias da feira presencial; nenhum
              contato real efetuado.
            </div>
          </div>
        </AdminShell>
      </div>
    </>
  );
}
