'use client';

import { SellerBreadcrumb } from '@/app/components/SellerBreadcrumb';
import {
  IconCheck,
  IconEdit,
  IconFile,
  IconLock,
  IconShield,
  IconUser,
} from '@/app/components/SellerIcons';
import { SellerMobileBottomNav } from '@/app/components/SellerMobileBottomNav';
import { SellerNavbar } from '@/app/components/SellerNavbar';
import { getUserProfile } from '@/lib/adapters/user-account-adapter';
import Link from 'next/link';
import { useState } from 'react';

export default function VendedorContaPage() {
  const [profile] = useState(() => getUserProfile());

  return (
    <div className="min-h-screen bg-[#f1f6fd] flex flex-col">
      <SellerNavbar variant="seller" activeTab="anuncios" />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SellerBreadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Meus anúncios', href: '/vendedor/anuncios' },
            { label: 'Minha conta' },
          ]}
        />

        <div className="bg-white border border-[#d6dfea] rounded-[16px] p-6 sm:p-8 shadow-sm max-w-[800px] mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-[#fef2f2] text-[#c41217] font-bold text-[20px] flex items-center justify-center">
              MS
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#111827]">{profile.fullName}</h1>
              <p className="text-[14px] text-[#596679]">
                {profile.email} • {profile.city}/{profile.state}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#ecfdf5] text-[#166534] text-[11px] font-bold border border-[#bbf7d0]">
                  <IconCheck className="size-3" />
                  {profile.roleLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-[#f8fafc] border border-[#e2e8f0] text-[13px] text-[#475569] leading-relaxed">
            As configurações de perfil, segurança, privacidade e preferências de contato estão
            centralizadas na área unificada da conta.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/conta/configuracoes"
              className="p-5 rounded-[12px] border border-[#cbd5e1] hover:border-[#c41217] hover:bg-[#fef2f2]/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="size-10 rounded-lg bg-red-50 text-[#c41217] flex items-center justify-center mb-3">
                  <IconEdit className="size-5" />
                </div>
                <h3 className="text-[15px] font-bold text-[#111827] group-hover:text-[#c41217]">
                  Configurações da Conta
                </h3>
                <p className="text-[12px] text-[#64748b] mt-1">
                  Editar dados cadastrais, telefone e preferências de notificação.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-[#c41217] mt-4 block">
                Acessar configurações →
              </span>
            </Link>

            <Link
              href="/vendedor/solicitacao/status"
              className="p-5 rounded-[12px] border border-[#cbd5e1] hover:border-[#c41217] hover:bg-[#fef2f2]/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="size-10 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center mb-3">
                  <IconFile className="size-5" />
                </div>
                <h3 className="text-[15px] font-bold text-[#111827] group-hover:text-[#c41217]">
                  Status do Cadastro de Vendedor
                </h3>
                <p className="text-[12px] text-[#64748b] mt-1">
                  Consultar protocolo de aprovação e credenciais de vendedor.
                </p>
              </div>
              <span className="text-[12px] font-semibold text-[#c41217] mt-4 block">
                Ver status do cadastro →
              </span>
            </Link>
          </div>
        </div>
      </main>

      <SellerMobileBottomNav activeTab="anuncios" userRole="seller" />
    </div>
  );
}
