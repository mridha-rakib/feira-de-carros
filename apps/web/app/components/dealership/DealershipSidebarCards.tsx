'use client';

import React from 'react';
import { IconBuilding, IconCheck, IconInfo, IconShield } from '../SellerIcons';

export function DealershipSidebarCards() {
  return (
    <div className="space-y-6">
      {/* Sidebar 1: Como funciona? */}
      <div className="bg-white border border-[#dee6f1] rounded-[13px] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-[#fff0f0] rounded-full size-[40px] flex items-center justify-center shrink-0">
            <IconBuilding className="size-[22px] text-[#f42524]" />
          </div>
          <h3 className="font-semibold text-[#17243f] text-[20px] leading-tight">Como funciona?</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="font-semibold text-[#f42524] text-[13px] shrink-0 mt-0.5">01</span>
            <div>
              <h4 className="font-semibold text-[#17243f] text-[13px]">Envie seus dados</h4>
              <p className="font-normal text-[#697a95] text-[12px] leading-relaxed mt-0.5">
                Informações pessoais e CNPJ para análise cadastral.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-semibold text-[#f42524] text-[13px] shrink-0 mt-0.5">02</span>
            <div>
              <h4 className="font-semibold text-[#17243f] text-[13px]">Análise manual da equipe</h4>
              <p className="font-normal text-[#697a95] text-[12px] leading-relaxed mt-0.5">
                O cadastro será revisado antes da habilitação no sistema.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="font-semibold text-[#f42524] text-[13px] shrink-0 mt-0.5">03</span>
            <div>
              <h4 className="font-semibold text-[#17243f] text-[13px]">Conta aprovada</h4>
              <p className="font-normal text-[#697a95] text-[12px] leading-relaxed mt-0.5">
                Após a aprovação, será possível publicar e gerenciar anúncios.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#fff0f0] rounded-[8px] p-2.5 mt-5 flex items-center gap-2">
          <IconInfo className="size-[15px] text-[#b91c1c] shrink-0" />
          <p className="font-semibold text-[#b91c1c] text-[11px] leading-tight">
            O envio não garante aprovação automática.
          </p>
        </div>
      </div>

      {/* Sidebar 2: Segurança e privacidade */}
      <div className="bg-white border border-[#dee6f1] rounded-[13px] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-[#e8f1ff] rounded-full size-[40px] flex items-center justify-center shrink-0">
            <IconShield className="size-[22px] text-[#215c9d]" />
          </div>
          <h3 className="font-semibold text-[#17243f] text-[19px] leading-tight">
            Segurança e privacidade
          </h3>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-start gap-3">
            <IconCheck className="size-[16px] text-[#215c9d] shrink-0 mt-0.5" />
            <p className="font-normal text-[#697a95] text-[11px] leading-relaxed">
              Cadastro destinado exclusivamente a maiores de 18 anos.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <IconCheck className="size-[16px] text-[#215c9d] shrink-0 mt-0.5" />
            <p className="font-normal text-[#697a95] text-[11px] leading-relaxed">
              CNPJ acessível somente à equipe interna autorizada.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <IconCheck className="size-[16px] text-[#215c9d] shrink-0 mt-0.5" />
            <p className="font-normal text-[#697a95] text-[11px] leading-relaxed">
              Uma conta por concessionária na versão inicial da plataforma.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <IconCheck className="size-[16px] text-[#215c9d] shrink-0 mt-0.5" />
            <p className="font-normal text-[#697a95] text-[11px] leading-relaxed">
              Dados de anúncio devem ser reais e devidamente atualizados.
            </p>
          </div>
        </div>

        <div className="border-t border-[#dee6f1] pt-3.5 mt-4">
          <p className="font-semibold text-[#215c9d] text-[12px] leading-tight">
            Para anunciar: aprovação prévia e dados válidos.
          </p>
        </div>
      </div>

      {/* Info banner: Requisitos adicionais */}
      <div className="bg-[#e8f1ff] rounded-[10px] p-3 flex items-center gap-2.5">
        <IconInfo className="size-[17px] text-[#215c9d] shrink-0" />
        <p className="font-normal text-[#215c9d] text-[11px] leading-tight">
          Requisitos adicionais serão confirmados no cadastro final.
        </p>
      </div>
    </div>
  );
}
