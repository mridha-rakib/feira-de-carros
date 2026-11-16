/**
 * Production validation rules for Individual Seller Onboarding (WEB-016 & WEB-019).
 * Enforces SRS v0.5 field mandatory matrix, CPF formatting, email structure, and legal consent.
 */

export interface SellerApplicationFormData {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate?: string;
  cep: string;
  address: string;
  neighborhood?: string;
  city: string;
  state: string;
  termsAccepted: boolean;
  lgpdConsent: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateSellerApplicationForm(
  data: Partial<SellerApplicationFormData>,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Nome completo é obrigatório.';
  }

  const cpfClean = (data.cpf || '').replace(/\D/g, '');
  if (!cpfClean || cpfClean.length !== 11) {
    errors.cpf = 'CPF deve conter 11 dígitos numéricos.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'E-mail inválido ou não informado.';
  }

  const phoneClean = (data.phone || '').replace(/\D/g, '');
  if (!phoneClean || phoneClean.length < 10) {
    errors.phone = 'Telefone para contato é obrigatório.';
  }

  const cepClean = (data.cep || '').replace(/\D/g, '');
  if (!cepClean || cepClean.length !== 8) {
    errors.cep = 'CEP deve conter 8 dígitos numéricos.';
  }

  if (!data.address || !data.address.trim()) {
    errors.address = 'Endereço residencial é obrigatório.';
  }

  if (!data.termsAccepted) {
    errors.termsAccepted = 'É necessário concordar com os Termos de Uso.';
  }

  if (!data.lgpdConsent) {
    errors.lgpdConsent = 'É necessário autorizar o tratamento de dados (LGPD).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
