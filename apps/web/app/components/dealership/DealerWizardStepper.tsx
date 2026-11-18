'use client';

import { IconCheck } from '@/app/components/SellerIcons';
import Link from 'next/link';
import React from 'react';

export interface DealerWizardStep {
  number: 1 | 2 | 3 | 4;
  title: string;
  shortTitle: string;
  href: string;
}

export const DEALER_WIZARD_STEPS: DealerWizardStep[] = [
  {
    number: 1,
    title: 'Categoria do veículo',
    shortTitle: 'Categoria',
    href: '/concessionaria/anuncios/novo',
  },
  {
    number: 2,
    title: 'Dados e características',
    shortTitle: 'Detalhes',
    href: '/concessionaria/anuncios/novo/detalhes',
  },
  {
    number: 3,
    title: 'Fotos do veículo',
    shortTitle: 'Fotos & Plano',
    href: '/concessionaria/anuncios/novo/fotos',
  },
  {
    number: 4,
    title: 'Revisão e envio',
    shortTitle: 'Revisão',
    href: '/concessionaria/anuncios/novo/revisao',
  },
];

interface DealerWizardStepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

export function DealerWizardStepper({ currentStep }: DealerWizardStepperProps) {
  const currentStepInfo = DEALER_WIZARD_STEPS[currentStep - 1];

  return (
    <div
      className="w-full bg-white border border-[#dee6f1] rounded-[16px] p-4 sm:p-6 mb-8 shadow-xs"
      data-testid="dealer-wizard-stepper"
    >
      {/* Mobile Top Header: Step pill + Title */}
      <div className="flex md:hidden flex-col gap-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#b91c1c] uppercase tracking-wider">
            Etapa {currentStep} de 4
          </span>
          <span className="text-xs font-medium text-[#64748b]">
            {Math.round((currentStep / 4) * 100)}% concluído
          </span>
        </div>
        <h2 className="text-[16px] font-bold text-[#17243f]">{currentStepInfo.title}</h2>

        {/* Mobile 4-segment progress bar */}
        <div className="grid grid-cols-4 gap-1.5 mt-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                step <= currentStep ? 'bg-[#b91c1c]' : 'bg-[#e2e8f0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <ol className="flex items-center justify-between relative">
          {/* Connecting line behind icons */}
          <div className="absolute top-[20px] left-[60px] right-[60px] h-[3px] bg-[#e2e8f0] -z-0" />

          {/* Active progress fill line */}
          <div
            className="absolute top-[20px] left-[60px] h-[3px] bg-[#b91c1c] -z-0 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / 3) * 100}%`,
              maxWidth: 'calc(100% - 120px)',
            }}
          />

          {DEALER_WIZARD_STEPS.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <li
                key={step.number}
                className="relative z-10 flex flex-col items-center flex-1 text-center"
              >
                {/* Step Circle */}
                <div
                  className={`size-[40px] rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-300 shadow-xs ${
                    isCompleted
                      ? 'bg-[#16a34a] text-white ring-4 ring-[#dcfce7]'
                      : isCurrent
                        ? 'bg-[#b91c1c] text-white ring-4 ring-[#fee2e2]'
                        : 'bg-white border-2 border-[#cbd5e1] text-[#64748b]'
                  }`}
                >
                  {isCompleted ? <IconCheck className="size-5" /> : <span>{step.number}</span>}
                </div>

                {/* Step Title */}
                <div className="mt-2.5">
                  <span
                    className={`block text-[13px] font-bold ${
                      isCurrent
                        ? 'text-[#b91c1c]'
                        : isCompleted
                          ? 'text-[#16a34a]'
                          : 'text-[#64748b]'
                    }`}
                  >
                    {step.shortTitle}
                  </span>
                  <span className="text-[11px] text-[#94a3b8] hidden lg:block">{step.title}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
