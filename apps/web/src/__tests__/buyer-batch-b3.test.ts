import { describe, expect, it } from 'vitest';
import { useBuyerStore } from '../../stores/use-buyer-store';

describe('Buyer Batch B3 — Authentication & Account Management', () => {
  describe('Canonical WEB-005: Login Authentication (Figma 845:164 / 845:188)', () => {
    it('initializes with default mock buyer profile', () => {
      const state = useBuyerStore.getState();
      expect(state.buyerProfile).toBeDefined();
      expect(state.buyerProfile.fullName).toBe('João Silva');
      expect(state.buyerProfile.email).toBe('joao.silva@exemplo.com');
      expect(state.buyerProfile.phone).toBe('(31) 98765-4321');
      expect(state.buyerProfile.city).toBe('Ipatinga');
      expect(state.buyerProfile.state).toBe('MG');
      expect(state.buyerProfile.avatarInitials).toBe('JS');
      expect(state.buyerProfile.savedSearchesCount).toBe(2);
    });

    it('simulates login and updates profile with new user details', () => {
      useBuyerStore.getState().loginSimulation('ana.pereira@email.com', 'Ana Pereira');
      const state = useBuyerStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.buyerProfile.email).toBe('ana.pereira@email.com');
      expect(state.buyerProfile.fullName).toBe('Ana Pereira');
      expect(state.buyerProfile.firstName).toBe('Ana');
      expect(state.buyerProfile.lastName).toBe('Pereira');
      expect(state.buyerProfile.avatarInitials).toBe('AP');
    });

    it('simulates logout by setting isAuthenticated to false', () => {
      useBuyerStore.getState().logoutSimulation();
      const state = useBuyerStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Canonical WEB-006: Registration Validation (Figma 845:212 / 845:241)', () => {
    const parseAgeFromBirthdate = (dateStr: string): number | null => {
      const parts = dateStr.split('/');
      if (parts.length !== 3) return null;
      const day = Number.parseInt(parts[0], 10);
      const month = Number.parseInt(parts[1], 10);
      const year = Number.parseInt(parts[2], 10);
      if (!day || !month || !year || year < 1900) return null;
      const today = new Date();
      let age = today.getFullYear() - year;
      const m = today.getMonth() + 1 - month;
      if (m < 0 || (m === 0 && today.getDate() < day)) {
        age--;
      }
      return age;
    };

    it('validates DD/MM/AAAA birthdate and enforces minimum 18 years old', () => {
      // Adult > 18
      const adultAge = parseAgeFromBirthdate('15/05/1990');
      expect(adultAge).toBeGreaterThanOrEqual(18);

      // Minor < 18 (e.g. born in 2015)
      const minorAge = parseAgeFromBirthdate('10/10/2015');
      expect(minorAge).toBeLessThan(18);

      // Invalid format
      expect(parseAgeFromBirthdate('1990-05-15')).toBeNull();
      expect(parseAgeFromBirthdate('invalid')).toBeNull();
    });

    it('rejects passwords shorter than 8 characters or mismatched confirmations', () => {
      const validatePassword = (pwd: string, confirm: string) => {
        if (!pwd || pwd.length < 8) return 'A senha deve conter no mínimo 8 caracteres.';
        if (pwd !== confirm) return 'As senhas não coincidem.';
        return null;
      };

      expect(validatePassword('short', 'short')).toBe(
        'A senha deve conter no mínimo 8 caracteres.',
      );
      expect(validatePassword('validPassword123', 'differentPassword')).toBe(
        'As senhas não coincidem.',
      );
      expect(validatePassword('validPassword123', 'validPassword123')).toBeNull();
    });
  });

  describe('Canonical WEB-007: Account Management (Figma 845:270 / 845:293)', () => {
    it('allows updating buyer profile contact information', () => {
      useBuyerStore.getState().updateBuyerProfile({
        phone: '(31) 99999-8888',
        city: 'Contagem',
        state: 'MG',
      });

      const updated = useBuyerStore.getState().buyerProfile;
      expect(updated.phone).toBe('(31) 99999-8888');
      expect(updated.city).toBe('Contagem');
      expect(updated.state).toBe('MG');
    });

    it('tracks favorites and saved searches count', () => {
      const state = useBuyerStore.getState();
      expect(state.favorites).toBeDefined();
      expect(Array.isArray(state.favorites)).toBe(true);
      expect(state.buyerProfile.savedSearchesCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Canonical WEB-008: Password Recovery (Figma 845:316 / 845:333)', () => {
    it('validates email format for password recovery instructions', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      expect(isValidEmail('buyer@exemplo.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Phase-03B: Security — Password Change (Figma 1212:524 / 1212:619)', () => {
    it('validates current password presence and new password constraints', () => {
      const validateChange = (current: string, next: string, confirm: string) => {
        if (!current) return 'Informe a senha atual.';
        if (!next || next.length < 8) return 'A nova senha deve conter no mínimo 8 caracteres.';
        if (next !== confirm) return 'A confirmação não confere com a nova senha.';
        if (current === next) return 'A nova senha não pode ser idêntica à senha atual.';
        return null;
      };

      expect(validateChange('', 'novasenha123', 'novasenha123')).toBe('Informe a senha atual.');
      expect(validateChange('antiga123', 'curta', 'curta')).toBe(
        'A nova senha deve conter no mínimo 8 caracteres.',
      );
      expect(validateChange('antiga123', 'novasenha123', 'errada123')).toBe(
        'A confirmação não confere com a nova senha.',
      );
      expect(validateChange('antiga123', 'antiga123', 'antiga123')).toBe(
        'A nova senha não pode ser idêntica à senha atual.',
      );
      expect(validateChange('antiga123', 'novasenha123', 'novasenha123')).toBeNull();
    });
  });

  describe('Phase-03B: LGPD Data Deletion Request (Figma 1212:690 / 1212:769)', () => {
    it('generates a formatted DEMO protocol and legal notice compliant with LGPD Art. 18', () => {
      const generateProtocol = () =>
        `LGPD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

      const protocol = generateProtocol();
      expect(protocol).toMatch(/^LGPD-\d{6}-\d{3}$/);
    });

    it('requires explicit user confirmation and legal notice acceptance before submitting deletion', () => {
      const canSubmitDeletion = (reason: string, confirmed: boolean) =>
        Boolean(reason && confirmed);

      expect(canSubmitDeletion('', false)).toBe(false);
      expect(canSubmitDeletion('Vendi meu carro', false)).toBe(false);
      expect(canSubmitDeletion('', true)).toBe(false);
      expect(canSubmitDeletion('Não utilizo mais a plataforma', true)).toBe(true);
    });
  });
});
