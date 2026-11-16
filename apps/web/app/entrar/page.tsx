'use client';

import { BrandLogo } from '@feira/ui';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { IconCar, IconInfo, IconLock, IconMail } from '../components/SellerIcons';

function EntrarForm() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || searchParams.get('retorno') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-[440px] bg-white border border-[#e2e7ee] rounded-[16px] p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-6">
        <Link href="/" className="inline-block mb-4">
          <BrandLogo
            variant="on-light"
            priority
            width={160}
            height={38}
            className="h-8 w-auto mx-auto"
          />
        </Link>
        <h1 className="text-[22px] sm:text-[24px] font-bold text-[#111827]">Acesso à Conta</h1>
        <p className="text-[13px] text-[#566273] mt-1">
          Entre com seu e-mail e senha para gerenciar seus anúncios e propostas.
        </p>
      </div>

      {/* Demo / Security Invariant Notice */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[10px] p-4 mb-6 text-left">
        <div className="flex items-start gap-2.5">
          <IconInfo className="size-5 text-[#2563eb] shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#1e40af] leading-relaxed">
            <strong className="font-semibold block text-[#1e3a8a] mb-0.5">
              Placeholder Institucional · Lote B6 / B7
            </strong>
            A autenticação de usuários e emissão de sessões serão conectadas ao endpoint oficial{' '}
            <code className="bg-white/60 px-1 py-0.5 rounded font-mono text-[11px]">
              POST /v1/auth/login
            </code>{' '}
            no Lote B6. Nenhuma sessão fictícia é fabricada no frontend.
          </div>
        </div>
      </div>

      {redirectTarget !== '/' && (
        <div className="bg-[#f8f9fb] border border-[#e2e7ee] rounded-[8px] p-3 mb-5 text-[12px] text-[#566273]">
          <span className="font-medium text-[#111827]">Destino protegido solicitado:</span>{' '}
          <code className="text-[#b91c1c] font-mono">{redirectTarget}</code>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label
            htmlFor="customer-email"
            className="block text-[13px] font-semibold text-[#141c2e] mb-1.5"
          >
            E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8e98a8]">
              <IconMail className="size-4" />
            </div>
            <input
              id="customer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled
              className="w-full h-[46px] pl-9 pr-3 rounded-[10px] border border-[#d1d5db] bg-[#f9fafb] text-[14px] text-[#9ca3af] cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="customer-password"
            className="block text-[13px] font-semibold text-[#141c2e] mb-1.5"
          >
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8e98a8]">
              <IconLock className="size-4" />
            </div>
            <input
              id="customer-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled
              className="w-full h-[46px] pl-9 pr-3 rounded-[10px] border border-[#d1d5db] bg-[#f9fafb] text-[14px] text-[#9ca3af] cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="button"
          disabled
          className="w-full h-[46px] rounded-[10px] bg-[#e5e7eb] text-[#9ca3af] text-[14px] font-semibold cursor-not-allowed transition-colors"
        >
          Entrar (Aguardando Integração B6)
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#e2e7ee] text-center space-y-2">
        <p className="text-[13px] text-[#566273]">
          Ainda não tem cadastro de vendedor?{' '}
          <Link
            href="/vendedor/solicitacao"
            className="font-semibold text-[#b91c1c] hover:underline"
          >
            Solicite aqui
          </Link>
        </p>
        <div>
          <Link href="/" className="text-[12px] text-[#566273] hover:text-[#111827]">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col justify-center items-center p-4">
      <Suspense fallback={<div className="text-sm text-gray-500">Carregando formulário...</div>}>
        <EntrarForm />
      </Suspense>
    </div>
  );
}
