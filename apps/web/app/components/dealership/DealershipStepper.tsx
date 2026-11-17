'use client';

import React from 'react';

interface DealershipStepperProps {
  currentStep: number; // 1, 2, 3, 4
  onStepClick?: (step: number) => void;
}

export function DealershipStepper({ currentStep, onStepClick }: DealershipStepperProps) {
  const steps = [
    {
      number: 1,
      title: 'Dados da conta',
      subtitle: 'Identificação do responsável',
      mobileTitle: 'Dados da conta',
    },
    {
      number: 2,
      title: 'Dados da revenda',
      subtitle: 'CNPJ e informações',
      mobileTitle: 'Dados da revenda',
    },
    {
      number: 3,
      title: 'Contato e endereço',
      subtitle: 'Obrigatórios para anunciar',
      mobileTitle: 'Contato e endereço',
    },
    {
      number: 4,
      title: 'Revisão e envio',
      subtitle: 'Análise manual',
      mobileTitle: 'Revisão e envio',
    },
  ];

  return (
    <div className="w-full bg-white border border-[#dee6f1] rounded-[10px] p-3 sm:p-4 mb-6">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                className={`flex items-center gap-3 cursor-pointer text-left ${
                  isActive ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-60'
                }`}
                onClick={() => onStepClick?.(step.number)}
              >
                <div
                  className={`size-[33px] rounded-full flex items-center justify-center font-semibold text-[15px] shrink-0 transition-colors ${
                    isActive || isCompleted
                      ? 'bg-[#f42524] text-white'
                      : 'bg-[#eff4f9] text-[#697a95]'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <div>
                  <p className="font-semibold text-[13px] text-[#17243f] leading-tight">
                    {step.title}
                  </p>
                  <p className="font-normal text-[11px] text-[#697a95] leading-tight mt-0.5">
                    {step.subtitle}
                  </p>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 rounded-[1px] transition-colors ${
                    currentStep > step.number ? 'bg-[#f42524]' : 'bg-[#dee6f1]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="flex md:hidden items-center justify-between">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                className="flex flex-col items-center cursor-pointer flex-1"
                onClick={() => onStepClick?.(step.number)}
              >
                <div
                  className={`size-[30px] rounded-full flex items-center justify-center font-semibold text-[13px] shrink-0 transition-colors ${
                    isActive || isCompleted
                      ? 'bg-[#f42524] text-white'
                      : 'bg-[#eff4f9] text-[#697a95]'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <p
                  className={`text-[10px] text-center leading-tight mt-1.5 line-clamp-2 max-w-[70px] ${
                    isActive ? 'font-semibold text-[#17243f]' : 'font-normal text-[#697a95]'
                  }`}
                >
                  {step.mobileTitle}
                </p>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`h-[2px] flex-1 -mt-4 transition-colors ${
                    currentStep > step.number ? 'bg-[#f42524]' : 'bg-[#dee6f1]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
