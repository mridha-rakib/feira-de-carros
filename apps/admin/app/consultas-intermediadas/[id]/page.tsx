'use client';

import { AdminShell } from '@/app/components/AdminShell';
import { getIntermediatedInquiryById } from '@/lib/adapters/mock-intermediated-inquiries-data';
import type { MediatedMessage } from '@/lib/types/intermediated-inquiries-presentation';
import {
  AlertTriangle,
  ArrowLeft,
  Car,
  CheckCircle2,
  Lock,
  MessageSquare,
  Phone,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  UserX,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function MediatedConversationPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const inquiry = React.useMemo(() => getIntermediatedInquiryById(id), [id]);

  const [replyText, setReplyText] = React.useState('');
  const [simulationState, setSimulationState] = React.useState<'NONE' | 'SENT_PREVIEW'>('NONE');

  // Not Found State
  if (!inquiry) {
    return (
      <AdminShell breadcrumbs={['Admin', 'Mensagens', 'Consultas', 'Não encontrado']}>
        <div
          data-testid="inquiry-not-found-state"
          className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto shadow-2xs my-10"
        >
          <UserX className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Consulta não encontrada</h2>
          <p className="text-xs text-slate-500">
            O protocolo de consulta "{id}" não foi localizado na base de registros.
          </p>
          <Link
            href="/consultas-intermediadas"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Fila de Consultas
          </Link>
        </div>
      </AdminShell>
    );
  }

  const handleSimulateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSimulationState('SENT_PREVIEW');
  };

  return (
    <AdminShell
      breadcrumbs={['Admin', 'Mensagens', 'Consultas intermediadas', inquiry.id]}
      maxWidthClass="max-w-[1360px]"
    >
      <div className="space-y-6" data-testid="mediated-conversation-page">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/consultas-intermediadas"
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Voltar à fila"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Conversa intermediada: {inquiry.advertisementId}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                ADM-D-044
              </span>
            </div>
            <p className="text-sm text-slate-500 pl-8">
              Mediação entre comprador e proprietário da feira; identificação explícita de
              representante.
            </p>
          </div>

          <div className="flex items-center gap-3 pl-8 sm:pl-0">
            <Link
              href="/consultas-intermediadas"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            >
              Voltar à fila
            </Link>
          </div>
        </div>

        {/* Mobile Restriction Banner on < 1024px */}
        <div
          data-testid="mobile-conversation-restricted"
          className="lg:hidden p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
              ENVIO DE MENSAGENS RESTRITO AO DESKTOP (ADM-019)
            </strong>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              A resposta a consultas intermediadas e comunicação com compradores são restritas ao
              terminal desktop do Main Admin. Acesso móvel estritamente para visualização.
            </p>
          </div>
        </div>

        {/* Tripartite Actor & Vehicle Context Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Vehicle mini thumbnail & title */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
              <Image
                src={inquiry.vehicleImageUrl}
                alt={inquiry.vehicleTitle}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{inquiry.vehicleTitle}</div>
              <div className="text-[11px] font-bold text-red-600">
                {inquiry.vehiclePriceFormatted}
              </div>
              <div className="text-[10px] font-mono text-slate-400">{inquiry.advertisementId}</div>
            </div>
          </div>

          {/* Buyer */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Comprador
            </span>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              {inquiry.buyerName}
            </div>
          </div>

          {/* Owner */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Proprietário Presencial
            </span>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5 text-amber-600" />
              {inquiry.ownerName}
            </div>
            <span className="text-[10px] text-amber-700 font-medium block">
              Sem conta cadastrada
            </span>
          </div>

          {/* Representative */}
          <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100">
            <span className="text-[10px] uppercase font-bold text-red-600 block mb-0.5">
              Representante Institucional
            </span>
            <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-red-600" />
              {inquiry.representativeName}
            </div>
          </div>
        </div>

        {/* Conversation Feed Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <h2 className="text-xs font-bold text-slate-800">
                Histórico da Conversa Intermediada • Protocolo {inquiry.id}
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Mediação Ativa
            </span>
          </div>

          {/* Message Thread */}
          <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto bg-slate-50/30">
            {inquiry.conversationExcerpts.map((msg: MediatedMessage) => {
              if (msg.isAuditMilestone) {
                return (
                  <div
                    key={msg.id}
                    className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-center text-xs text-amber-900 max-w-2xl mx-auto shadow-2xs"
                  >
                    <div className="flex items-center justify-center gap-1.5 font-bold mb-1 text-[11px] text-amber-950">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                      <span>{msg.senderName}</span>
                      <span className="text-amber-700 font-normal">• {msg.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">{msg.content}</p>
                  </div>
                );
              }

              const isRepresentative = msg.senderType === 'REPRESENTATIVE';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isRepresentative ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-700">{msg.senderName}</span>
                    {isRepresentative && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                        Representante Institucional
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed shadow-2xs ${
                      isRepresentative
                        ? 'bg-red-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulation Feedback Alert */}
          {simulationState === 'SENT_PREVIEW' && (
            <div
              data-testid="inquiry-send-simulation-result"
              className="m-4 p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 border border-slate-800"
            >
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Prévia de Resposta Registrada — Modo Fail-Closed</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                MENSAGEM NÃO TRANSMITIDA — Demonstração frontend apenas. A comunicação com
                compradores em produção requer integração ao serviço de mensageria autenticado e
                autorização prévia do proprietário presencial. Nenhuma mensagem externa foi enviada.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSimulationState('NONE');
                  setReplyText('');
                }}
                className="text-[11px] font-bold text-amber-400 hover:underline pt-1 block"
              >
                Limpar prévia
              </button>
            </div>
          )}

          {/* Response Draft Form (Desktop only interactive) */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <form onSubmit={handleSimulateSend} className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Compor resposta institucional:</span>
                <span className="text-[11px] text-slate-400">
                  Respondendo como <strong>Main Admin (Representante Feira de Carros)</strong>
                </span>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  setSimulationState('NONE');
                }}
                placeholder="Escreva a mensagem de mediação com o comprador... Lembre-se: identifique-se como representante da Feira e nunca como o proprietário."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400 italic">
                  * Proibido personificar o vendedor presencial João Batista.
                </p>

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  data-testid="simulate-send-message-btn"
                  className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Prévia de envio (Simulação)</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Institutional Safeguards & Audit Banner */}
        <div
          data-testid="inquiry-audit-banner"
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950"
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase tracking-wide">
                REL-07 · MEDIAÇÃO INSTITUCIONAL AUDITADA
              </strong>
              <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                A plataforma Feira de Carros atua como intermediadora neutra de anúncios legados. É
                vedada a celebração de negócios ou recebimento de valores sem confirmação presencial
                do comprador e do vendedor no pátio da feira.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200">
          AMBIENTE DEMONSTRATIVO • Nenhum contato telefônico, SMS, WhatsApp ou e-mail externo
          disparado.
        </div>
      </div>
    </AdminShell>
  );
}
