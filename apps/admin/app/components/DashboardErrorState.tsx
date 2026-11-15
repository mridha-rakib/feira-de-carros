'use client';

import { AlertCircle, Lock, RefreshCw, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { getAuthAdapter } from '../../lib/adapters/auth-factory';

interface DashboardErrorStateProps {
  statusCode?: number;
  message?: string;
  onRetry?: () => void;
}

export function DashboardErrorState({
  statusCode = 500,
  message,
  onRetry,
}: DashboardErrorStateProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const auth = getAuthAdapter();
      await auth.logout();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isForbidden = statusCode === 403;
  const isUnauthorized = statusCode === 401;
  const isServiceUnavailable = statusCode === 503;

  const title = isForbidden
    ? 'Acesso Restrito ao Painel (403)'
    : isUnauthorized
      ? 'Sessão Expirada (401)'
      : isServiceUnavailable
        ? 'Serviço Temporariamente Indisponível (503)'
        : 'Falha ao Carregar Métricas (500)';

  const description =
    message ||
    (isForbidden
      ? 'Sua conta não possui permissões administrativas para visualizar o painel geral.'
      : isUnauthorized
        ? 'Sua sessão administrativa não é mais válida. Faça login novamente.'
        : isServiceUnavailable
          ? 'O servidor backend de produção não está respondendo. Verifique a conectividade de rede.'
          : 'Ocorreu uma instabilidade na recuperação das métricas consolidadas.');

  return (
    <div
      className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto my-12"
      role="alert"
    >
      <div
        className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
          isForbidden || isUnauthorized ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
        }`}
      >
        {isForbidden ? (
          <ShieldAlert className="w-7 h-7" />
        ) : isUnauthorized ? (
          <Lock className="w-7 h-7" />
        ) : (
          <AlertCircle className="w-7 h-7" />
        )}
      </div>

      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">{title}</h2>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && !isForbidden && !isUnauthorized && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        )}

        {(isForbidden || isUnauthorized) && (
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Ir para Tela de Login
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          {isLoggingOut ? 'Saindo...' : 'Encerrar Sessão'}
        </button>
      </div>
    </div>
  );
}
