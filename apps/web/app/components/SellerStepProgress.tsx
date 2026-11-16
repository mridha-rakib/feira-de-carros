import { IconAlert, IconCheck, IconClock } from './SellerIcons';

interface SellerStepProgressProps {
  currentStep: 1 | 2 | 3;
  showStepperLine?: boolean;
  stepStatus?: 'PENDING_REVIEW' | 'CORRECTION_REQUESTED' | 'APPROVED' | 'REJECTED';
}

export function SellerStepProgress({
  currentStep,
  showStepperLine = false,
  stepStatus = 'PENDING_REVIEW',
}: SellerStepProgressProps) {
  return (
    <div className="w-full">
      {/* Top Segment Bars Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-[#b91c1c] uppercase tracking-wider block">
            {currentStep === 1
              ? 'Onboarding Inicial'
              : currentStep === 2
                ? 'Em Análise'
                : 'Revisão & Ajustes'}
          </span>
          <span className="text-[15px] sm:text-[16px] font-semibold text-[#111827]">
            Etapa {currentStep} de 3
          </span>
        </div>

        {/* 3 Progress Bars (matching Figma nodes 2677:2186-2188, 2678:2176-2178, 2678:2260-2262) */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-[360px]">
          <div
            className={`h-[8px] flex-1 rounded-[4px] transition-colors ${
              currentStep >= 1 ? 'bg-[#b91c1c]' : 'bg-[#dbe1e8]'
            }`}
          />
          <div
            className={`h-[8px] flex-1 rounded-[4px] transition-colors ${
              currentStep >= 2 ? 'bg-[#b91c1c]' : 'bg-[#dbe1e8]'
            }`}
          />
          <div
            className={`h-[8px] flex-1 rounded-[4px] transition-colors ${
              currentStep >= 3 ? 'bg-[#b91c1c]' : 'bg-[#dbe1e8]'
            }`}
          />
        </div>
      </div>

      {/* Stepper Timeline Line (for WEB-018 and WEB-019) */}
      {showStepperLine && (
        <div className="my-8 hidden md:block">
          <div className="relative flex items-center justify-between max-w-4xl mx-auto px-12">
            {/* Background connecting bar */}
            <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-[3px] bg-[#dbe1e8] z-0" />

            {/* Step 1: Solicitação concluída */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="size-[44px] rounded-full bg-[#178a54] text-white flex items-center justify-center shadow-sm">
                <IconCheck className="size-[22px]" />
              </div>
              <span className="mt-3 text-[15px] font-semibold text-[#111827]">
                Solicitação concluída
              </span>
              <span className="text-xs text-[#566273]">Dados enviados</span>
            </div>

            {/* Step 2: Revisão */}
            <div className="relative z-10 flex flex-col items-center">
              {currentStep === 2 ? (
                <div className="size-[44px] rounded-full bg-[#b91c1c] text-white flex items-center justify-center font-bold text-[18px] shadow-sm">
                  <IconClock className="size-[22px]" />
                </div>
              ) : currentStep > 2 ? (
                <div className="size-[44px] rounded-full bg-[#178a54] text-white flex items-center justify-center shadow-sm">
                  <IconCheck className="size-[22px]" />
                </div>
              ) : (
                <div className="size-[44px] rounded-full bg-[#dbe1e8] text-[#566273] flex items-center justify-center font-bold text-[18px]">
                  2
                </div>
              )}
              <span
                className={`mt-3 text-[15px] font-semibold ${
                  currentStep === 2 ? 'text-[#b91c1c]' : 'text-[#111827]'
                }`}
              >
                {currentStep > 2 ? 'Revisão concluída' : 'Revisão em andamento'}
              </span>
              <span className="text-xs text-[#566273]">Análise interna</span>
            </div>

            {/* Step 3: Resultado / Correção */}
            <div className="relative z-10 flex flex-col items-center">
              {currentStep === 3 ? (
                stepStatus === 'CORRECTION_REQUESTED' ? (
                  <div className="size-[44px] rounded-full bg-[#b91c1c] text-white flex items-center justify-center font-bold text-[18px] shadow-sm">
                    <IconAlert className="size-[22px]" />
                  </div>
                ) : (
                  <div className="size-[44px] rounded-full bg-[#178a54] text-white flex items-center justify-center shadow-sm">
                    <IconCheck className="size-[22px]" />
                  </div>
                )
              ) : (
                <div className="size-[44px] rounded-full bg-[#dbe1e8] text-[#566273] flex items-center justify-center font-bold text-[18px]">
                  3
                </div>
              )}
              <span
                className={`mt-3 text-[15px] font-semibold ${
                  currentStep === 3 ? 'text-[#b91c1c]' : 'text-[#111827]'
                }`}
              >
                {currentStep === 3
                  ? stepStatus === 'CORRECTION_REQUESTED'
                    ? 'Correção solicitada'
                    : 'Resultado disponível'
                  : 'Resultado pendente'}
              </span>
              <span className="text-xs text-[#566273]">Status final</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Stepper Card (matching 719:486) */}
      {showStepperLine && (
        <div className="grid grid-cols-3 gap-2 md:hidden my-4">
          <div className="bg-[#ebf9f0] p-3 rounded-[9px] flex flex-col items-center text-center">
            <div className="size-6 rounded-full bg-white text-[#178a54] flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
              ✓
            </div>
            <span className="text-[11px] font-semibold text-[#131a2b]">Solicitação</span>
            <span className="text-[10px] font-semibold text-[#178a54]">Feita</span>
          </div>

          <div
            className={`p-3 rounded-[9px] flex flex-col items-center text-center ${
              currentStep === 2 ? 'bg-[#fff5ea]' : currentStep > 2 ? 'bg-[#ebf9f0]' : 'bg-[#f3f6fa]'
            }`}
          >
            <div
              className={`size-6 rounded-full bg-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm ${
                currentStep === 2
                  ? 'text-[#ba660a]'
                  : currentStep > 2
                    ? 'text-[#178a54]'
                    : 'text-[#5e697d]'
              }`}
            >
              {currentStep > 2 ? '✓' : '◷'}
            </div>
            <span className="text-[11px] font-semibold text-[#131a2b]">Revisão</span>
            <span
              className={`text-[10px] font-semibold ${
                currentStep === 2
                  ? 'text-[#ba660a]'
                  : currentStep > 2
                    ? 'text-[#178a54]'
                    : 'text-[#5e697d]'
              }`}
            >
              {currentStep === 2 ? 'Ativa' : currentStep > 2 ? 'Concluída' : 'Pendente'}
            </span>
          </div>

          <div
            className={`p-3 rounded-[9px] flex flex-col items-center text-center ${
              currentStep === 3 ? 'bg-[#fff5ea]' : 'bg-[#f3f6fa]'
            }`}
          >
            <div
              className={`size-6 rounded-full bg-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm ${
                currentStep === 3 ? 'text-[#c21c24]' : 'text-[#5e697d]'
              }`}
            >
              {currentStep === 3 ? '!' : '3'}
            </div>
            <span className="text-[11px] font-semibold text-[#131a2b]">Resultado</span>
            <span
              className={`text-[10px] font-semibold ${
                currentStep === 3 ? 'text-[#c21c24]' : 'text-[#5e697d]'
              }`}
            >
              {currentStep === 3 ? 'Ajuste' : 'Pendente'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
