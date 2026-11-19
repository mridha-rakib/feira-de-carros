/**
 * Brazilian CNPJ Formatting, Masking, and Check-Digit Validation Algorithm.
 * Implements standard Receita Federal modulus 11 algorithm.
 *
 * Notice: Mathematical validity check is an anti-fraud client filter,
 * NOT a substitute for administrative business registration approval.
 */

/**
 * Strips all non-digit characters from a string.
 */
export function cleanCnpj(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

/**
 * Formats digits into standard CNPJ representation: XX.XXX.XXX/YYYY-ZZ.
 */
export function formatCnpj(value: string): string {
  const digits = cleanCnpj(value).slice(0, 14);
  if (!digits) return '';

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Masks a CNPJ for privacy compliance (SEC-003 / AUTH-021), hiding middle digits.
 * Example: 11.222.333/0001-81 -> 11.***.*** / 0001-**
 */
export function maskCnpjForDisplay(cnpj: string): string {
  const formatted = formatCnpj(cnpj);
  if (formatted.length < 18) return formatted;
  return `${formatted.slice(0, 3)}***.***/${formatted.slice(11, 15)}-**`;
}

/**
 * Validates a CNPJ mathematically using the standard Receita Federal Modulus 11 algorithm.
 */
export function isValidCnpj(cnpj: string): boolean {
  const digits = cleanCnpj(cnpj);

  // Must have exactly 14 digits
  if (digits.length !== 14) return false;

  // Reject known invalid sequences of identical digits
  const invalidSequences = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ];
  if (invalidSequences.includes(digits)) return false;

  // First verification digit (13th digit)
  const weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sumFirst = 0;
  for (let i = 0; i < 12; i++) {
    sumFirst += Number.parseInt(digits[i], 10) * weightsFirst[i];
  }
  const remainderFirst = sumFirst % 11;
  const expectedDigit13 = remainderFirst < 2 ? 0 : 11 - remainderFirst;

  if (Number.parseInt(digits[12], 10) !== expectedDigit13) {
    return false;
  }

  // Second verification digit (14th digit)
  const weightsSecond = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sumSecond = 0;
  for (let i = 0; i < 13; i++) {
    sumSecond += Number.parseInt(digits[i], 10) * weightsSecond[i];
  }
  const remainderSecond = sumSecond % 11;
  const expectedDigit14 = remainderSecond < 2 ? 0 : 11 - remainderSecond;

  return Number.parseInt(digits[13], 10) === expectedDigit14;
}

/**
 * Validates a Brazilian date of birth string (DD/MM/AAAA or YYYY-MM-DD)
 * and verifies that the applicant is at least 18 years of age.
 */
export function validateAgeEligibility(dateString: string): {
  isValid: boolean;
  isAdult: boolean;
  age?: number;
  formattedIso?: string;
  errorMessage?: string;
} {
  if (!dateString) {
    return { isValid: false, isAdult: false, errorMessage: 'Data de nascimento é obrigatória.' };
  }

  let year: number;
  let month: number;
  let day: number;

  if (dateString.includes('/')) {
    // DD/MM/AAAA
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      return {
        isValid: false,
        isAdult: false,
        errorMessage: 'Formato de data inválido (DD/MM/AAAA).',
      };
    }
    day = Number.parseInt(parts[0], 10);
    month = Number.parseInt(parts[1], 10) - 1; // 0-indexed
    year = Number.parseInt(parts[2], 10);
  } else if (dateString.includes('-')) {
    // YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      return {
        isValid: false,
        isAdult: false,
        errorMessage: 'Formato de data inválido (AAAA-MM-DD).',
      };
    }
    year = Number.parseInt(parts[0], 10);
    month = Number.parseInt(parts[1], 10) - 1;
    day = Number.parseInt(parts[2], 10);
  } else {
    return { isValid: false, isAdult: false, errorMessage: 'Formato de data não reconhecido.' };
  }

  const birthDate = new Date(year, month, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month ||
    birthDate.getDate() !== day
  ) {
    return { isValid: false, isAdult: false, errorMessage: 'Data de nascimento inválida.' };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const isoMonth = String(month + 1).padStart(2, '0');
  const isoDay = String(day).padStart(2, '0');
  const formattedIso = `${year}-${isoMonth}-${isoDay}`;

  if (age < 18) {
    return {
      isValid: true,
      isAdult: false,
      age,
      formattedIso,
      errorMessage: 'O responsável pelo cadastro da concessionária deve ter no mínimo 18 anos.',
    };
  }

  return { isValid: true, isAdult: true, age, formattedIso };
}

/**
 * Convenience helper returning boolean for legal majority check (18+).
 */
export function isAtLeast18YearsOld(dateString: string): boolean {
  return validateAgeEligibility(dateString).isAdult;
}

/**
 * Validates Brazilian phone number formatting (10 or 11 digits).
 */
export function isValidBrazilianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

/**
 * Formats phone string to (XX) XXXXX-XXXX or (XX) XXXX-XXXX.
 */
export function formatBrazilianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
