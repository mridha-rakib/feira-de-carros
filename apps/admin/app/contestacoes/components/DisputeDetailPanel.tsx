'use client';

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Lock,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  Tag,
  Upload,
  User,
  XCircle,
} from 'lucide-react';
import * as React from 'react';
import { formatBrl, mapTxToPay } from '../../../lib/adapters/mock-finance-data';
import type { CardDisputeRecord } from '../../../lib/types/finance-presentation';
import { DisputeStatusBadge } from './DisputeTable';

interface DisputeDetailPanelProps {
  dispute: CardDisputeRecord | null;
}

export function DisputeDetailPanel({ dispute }: DisputeDetailPanelProps) {
  const [demoActionMessage, setDemoActionMessage] = React.useState<string | null>(null);

  if (!dispute) {
    return (
      <div
        data-testid="dispute-detail-panel-empty"
        className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">Nenhuma contestação selecionada</h3>
        <p className="text-xs text-slate-500">
          Clique em uma linha da tabela para auditar o dossiê de chargeback e evidências anexadas.
        </p>
      </div>
    );
  }

  const payRef = mapTxToPay(dispute.transactionId);

  return (
    <div
      data-testid="dispute-detail-panel"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {dispute.id}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{dispute.pspCaseId}</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Dossiê de Contestação</h2>
        </div>
        <DisputeStatusBadge status={dispute.status} />
      </div>

      {/* Amount Callout */}
      <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200/80 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-red-700 uppercase block">
            Valor em Risco (Cautelar)
          </span>
          <span className="text-2xl font-black text-red-900">{formatBrl(dispute.amountBrl)}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-red-600 block uppercase">
            Prazo Fatal do PSP
          </span>
          <span className="text-xs font-bold text-red-800">{dispute.pspDeadline}</span>
        </div>
      </div>

      {/* Cartão e Transação Original */}
      <div className="space-y-2 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <span>Dados do Cartão & Transação</span>
        </h3>
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Bandeira:</span>
            <strong className="text-slate-800">{dispute.cardBrand}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Cartão Final:</span>
            <span className="font-mono text-slate-700">•••• {dispute.cardLastFour}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Transação Original:</span>
            <span className="font-mono text-slate-700">{dispute.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Referência PSP:</span>
            <span className="font-mono text-slate-700">{payRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Titular / Vendedor:</span>
            <span className="text-slate-800 font-semibold">{dispute.sellerName}</span>
          </div>
        </div>
      </div>

      {/* Motivo do Chargeback */}
      <div className="space-y-1.5 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Alegação do Titular / Bandeira</span>
        </h3>
        <p className="p-3 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl leading-relaxed text-xs">
          "{dispute.disputeReason}"
        </p>
      </div>

      {/* Checklist de Evidências */}
      <div className="space-y-2 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Pacote de Evidências Submetidas</span>
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-600">Aceite dos Termos de Uso:</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Anexado</span>
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-600">IP de Publicação & Logs:</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auditado</span>
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-600">Status do Dossiê Técnico:</span>
            {dispute.evidenceSubmitted ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protocolado na Adquirente</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Pendente de Extrato Bancário</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trilha de Eventos */}
      <div className="space-y-2 text-xs">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Histórico da Disputa</span>
        </h3>
        <div className="space-y-2 border-l-2 border-slate-200 pl-3">
          {dispute.timeline.map((evt) => (
            <div key={evt.id} className="space-y-0.5">
              <div className="flex items-center justify-between">
                <strong className="text-slate-800 text-[11px]">{evt.title}</strong>
                <span className="text-[9px] font-mono text-slate-400">{evt.timestamp}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">{evt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PSP Uncertainty & Governance Warning */}
      <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-1 border border-slate-800">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Aviso de Incerteza da Câmara de Compensação</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          O julgamento do chargeback cabe soberanamente à bandeira e ao banco emissor. O saldo de{' '}
          <strong>{formatBrl(dispute.amountBrl)}</strong> permanece retido preventivamente e{' '}
          <strong>não compõe o saldo de receita líquida</strong>.
        </p>
      </div>

      {/* Demo Action Buttons */}
      <div className="space-y-2 pt-1">
        {demoActionMessage && (
          <div
            data-testid="demo-action-feedback"
            className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 font-medium"
          >
            {demoActionMessage}
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            setDemoActionMessage(
              'Simulação de envio: Dossiê de contestação reenviado para reanálise da câmara (Ação demonstrativa).',
            )
          }
          data-testid="simulate-submit-evidence-btn"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Simular Envio de Dossiê Técnico</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setDemoActionMessage(
              'Espelho de notificação PSP gerado em formato auditável (Demonstração).',
            )
          }
          data-testid="simulate-download-notice-btn"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Baixar Notificação Formal da Bandeira</span>
        </button>
      </div>
    </div>
  );
}
