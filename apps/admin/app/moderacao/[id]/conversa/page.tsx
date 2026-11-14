'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { ReportStatusBadge } from '@/app/moderacao/components/ReportStatusBadge';
import { getReportById } from '@/lib/adapters/mock-moderation-data';
import type { ConversationMessage } from '@/lib/types/moderation-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  MessageSquare,
  Shield,
  ShieldAlert,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function ReportConversationPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const report = React.useMemo(() => getReportById(id), [id]);

  // If no conversation excerpt for this report
  if (!report) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Denúncias', 'Não encontrado']}>
        <div
          data-testid="conversation-report-not-found"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs"
        >
          <Shield className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Protocolo não encontrado</h2>
          <p className="text-xs text-slate-500">
            O protocolo "{id}" não foi localizado na base de denúncias.
          </p>
          <Link
            href="/moderacao"
            data-testid="back-to-moderation-not-found-conv"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Fila de Denúncias
          </Link>
        </div>
      </AdminShell>
    );
  }

  const excerpt = report.conversationExcerpt;

  // If no conversation excerpt available for this report — show restricted state
  if (!excerpt) {
    return (
      <AdminShell
        breadcrumbs={['Admin', 'Denúncias', report.id, 'Conversa']}
        maxWidthClass="max-w-[900px]"
      >
        <div className="space-y-6" data-testid="conversation-no-excerpt-state">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <Link
              href={`/moderacao/${report.id}`}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-black text-slate-900">Revisão de Conversa — {report.id}</h1>
          </div>
          <div
            data-testid="conversation-restricted-no-excerpt"
            className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-2xs"
          >
            <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
            <h2 className="text-base font-bold text-slate-800">
              Nenhum trecho de conversa vinculado a esta denúncia
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Esta denúncia não possui conversas privadas associadas ao contexto denunciado. O
              acesso a conversas privadas é restrito ao trecho diretamente vinculado ao protocolo.
            </p>
            <Link
              href={`/moderacao/${report.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para detalhes da denúncia
            </Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Denúncias', report.id, 'Revisão de Conversa']}
      maxWidthClass="max-w-[1100px]"
    >
      <div className="space-y-6" data-testid="conversation-review-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                href={`/moderacao/${report.id}`}
                data-testid="back-to-report-detail-btn"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar para detalhes da denúncia"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Revisão de Conversa — {report.id}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                ADM-D-034
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Trecho restrito vinculado à denúncia. Nenhum acesso irrestrito a mensagens privadas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ReportStatusBadge status={report.status} size="md" />
          </div>
        </div>

        {/* Critical Privacy Restriction Banner */}
        <div
          data-testid="conversation-privacy-banner"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900"
        >
          <div className="flex items-center gap-2 font-bold text-red-800 mb-1">
            <Lock className="w-4 h-4 text-red-600 shrink-0" />
            <span>Restrição de Privacidade — LGPD / SMG-08</span>
          </div>
          <p className="text-red-800/90 leading-relaxed">
            Este trecho de conversa é exibido <strong>exclusivamente</strong> no contexto desta
            denúncia (Protocolo {report.id}). Não é um painel de mensagens privadas. Nenhuma
            conversa não relacionada a esta denúncia pode ser acessada aqui. Support e Sales
            permanecem em estado <strong>DENY_PENDING</strong>.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Conversation Excerpt Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Scope Notice */}
            <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900 mb-1">
                    Escopo de Revisão Limitado
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">{excerpt.scopeNotice}</p>
                </div>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <h2 className="text-sm font-bold text-slate-800">Trecho de Conversa Vinculado</h2>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-semibold">
                  TRECHO — Não exportável
                </span>
              </div>

              <div className="p-5 space-y-4">
                {excerpt.messages.map((msg: ConversationMessage) => (
                  <div
                    key={msg.id}
                    data-testid={`conversation-message-${msg.id}`}
                    className={`flex gap-3 ${msg.senderType === 'seller' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.senderType === 'buyer'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>

                    {/* Bubble */}
                    <div
                      className={`flex-1 max-w-[80%] ${msg.senderType === 'seller' ? 'items-end' : 'items-start'} flex flex-col gap-1`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold text-slate-500 ${msg.senderType === 'seller' ? 'order-last' : ''}`}
                        >
                          {msg.senderAlias}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.senderType === 'buyer'
                            ? 'bg-blue-50 text-blue-900 rounded-tl-sm'
                            : 'bg-slate-100 text-slate-800 rounded-tr-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.isExcerpt && (
                        <span className="text-[10px] text-amber-600 font-semibold">
                          — Trecho ilustrativo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Excerpt end notice */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 text-center">
                  — Fim do trecho vinculado ao protocolo {report.id} — Mensagens anteriores e
                  posteriores não acessíveis neste contexto.
                </p>
              </div>
            </div>

            {/* Evidence Authenticity Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Shield className="w-4 h-4 text-slate-600" />
                <span>Status de Autenticidade da Evidência</span>
              </h2>
              <div className="flex items-center gap-3">
                {excerpt.evidenceAuthStatus === 'PENDING_VERIFICATION' && (
                  <>
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-amber-800">Verificação Pendente</p>
                      <p className="text-[11px] text-slate-500">
                        Conteúdo submetido pelo denunciante. Autenticidade não verificada
                        independentemente.
                      </p>
                    </div>
                  </>
                )}
                {excerpt.evidenceAuthStatus === 'VERIFIED' && (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Verificado</p>
                      <p className="text-[11px] text-slate-500">
                        Conteúdo verificado por analista humano.
                      </p>
                    </div>
                  </>
                )}
                {excerpt.evidenceAuthStatus === 'UNVERIFIABLE' && (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-red-800">Não verificável</p>
                      <p className="text-[11px] text-slate-500">
                        Conteúdo não pode ser verificado de forma independente.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{excerpt.auditSummary}</p>
            </div>
          </div>

          {/* Right Column — Context & Permissions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Report Context Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Contexto da Denúncia
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Protocolo</span>
                  <span className="font-mono font-bold text-slate-800">{report.id}</span>
                </div>
                {report.adId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Anúncio</span>
                    <span className="font-mono text-slate-700">{report.adId}</span>
                  </div>
                )}
                {report.vehicleTitle && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Veículo</span>
                    <span className="text-slate-700 text-right max-w-[55%]">
                      {report.vehicleTitle}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendedor</span>
                  <span className="text-slate-700 text-right max-w-[55%]">{report.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Categoria</span>
                  <span className="text-slate-700">{report.categoryLabel}</span>
                </div>
              </div>
            </div>

            {/* Permissions Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-600" />
                <span>Auditoria e Permissões</span>
              </h2>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {excerpt.permissionsNote}
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-emerald-50 rounded-lg">
                  <span className="text-slate-600">Main Admin</span>
                  <span className="text-emerald-700 font-semibold">Revisão autorizada</span>
                </div>
                <div className="flex justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-slate-600">Support</span>
                  <span className="text-red-700 font-semibold">DENY_PENDING</span>
                </div>
                <div className="flex justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-slate-600">Sales</span>
                  <span className="text-red-700 font-semibold">DENY_PENDING</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">CPF/CNPJ</span>
                  <span className="text-slate-700 font-semibold">Sempre protegido</span>
                </div>
              </div>
            </div>

            {/* Prohibited Actions Notice */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
              <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Ações não permitidas neste contexto
              </p>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>✗ Busca global de conversas privadas</li>
                <li>✗ Histórico completo de mensagens</li>
                <li>✗ Exportação de mensagens privadas</li>
                <li>✗ Acesso a anexos não vinculados</li>
                <li>✗ Visualização de outras conversas</li>
              </ul>
            </div>

            {/* Navigate to Decision */}
            <Link
              href={`/moderacao/${report.id}/decisao`}
              data-testid="navigate-to-decision-from-conv"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ir para decisão de moderação
            </Link>

            {/* Back to report */}
            <Link
              href={`/moderacao/${report.id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para detalhes da denúncia
            </Link>
          </div>
        </div>

        {/* Demo Footer */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>AMBIENTE DEMONSTRATIVO</strong> — Trecho ilustrativo vinculado ao protocolo{' '}
              {report.id}. Nenhuma mensagem real foi acessada. Nenhuma conversa privada foi
              exportada ou armazenada.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
