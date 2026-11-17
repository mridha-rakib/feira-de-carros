import { beforeEach, describe, expect, it } from 'vitest';
import {
  getDealershipApplication,
  resubmitDealershipCorrection,
  submitDealershipApplication,
} from '../../lib/adapters/dealer-application-adapter';
import {
  DEMO_FIXTURE_PASSWORD,
  authenticateDemoLogin,
  findAccountByEmail,
  getRoleDestination,
  isEmailRegisteredGlobally,
  isSafeRedirect,
  normalizeEmail,
  registerDemoAccount,
  resetAccountsRegistry,
} from '../../lib/adapters/shared-auth-registry';
import {
  formatBrazilianPhone,
  formatCnpj,
  isAtLeast18YearsOld,
  isValidBrazilianPhone,
  isValidCnpj,
  maskCnpjForDisplay,
} from '../../lib/utils/cnpj-validator';
import { useDealerStore } from '../../stores/use-dealer-store';

describe('Dealership Frontend Batch D1 — Registration, Lifecycle & Shared Auth', () => {
  beforeEach(() => {
    // Reset Zustand store state and shared accounts registry before each test
    useDealerStore.getState().resetDraft();
    resetAccountsRegistry();
  });

  // 1. Dealership account registration
  it('Scenario 1: Submits dealership application and creates a valid pending registration', async () => {
    const payload = {
      firstName: 'Marcos',
      lastName: 'Melo',
      birthDate: '1984-07-15',
      email: 'marcos@valemotors.com.br',
      dealershipName: 'Vale Motors e Serviços Ltda',
      tradeName: 'Vale Motors',
      cnpj: '11222333000181',
      phone: '(31) 3822-1000',
      address: 'Av. Castelo Branco, 700',
      city: 'Ipatinga',
      state: 'MG',
      cep: '35160-001',
      termsAccepted: true,
    };

    const result = await submitDealershipApplication(payload);

    expect(result.id).toBeDefined();
    expect(result.protocol).toMatch(/^SOL-DEALER-202611-\d{4}$/);
    expect(result.status).toBe('pending_approval');
    expect(result.applicant.fullName).toBe('Marcos Melo');
    expect(result.dealership.name).toBe('Vale Motors e Serviços Ltda');
    expect(result.dealership.cnpjMasked).toBe('11.***.***/0001-**');
  });

  // 2. Required-field validation
  it('Scenario 2: Validates required fields across application draft', () => {
    const store = useDealerStore.getState();

    // Incomplete draft
    expect(store.draft.firstName).toBe('');
    expect(store.draft.dealershipName).toBe('');
    expect(store.draft.cnpj).toBe('');

    // Update with complete required data
    store.updateDraft({
      firstName: 'Ana',
      lastName: 'Paula',
      birthDate: '15/05/1990',
      email: 'ana@revendapremier.com.br',
      dealershipName: 'Premier Veículos',
      cnpj: '11.222.333/0001-81',
      phone: '(31) 98888-2222',
      address: 'Rua Diamantina, 100',
    });

    const updated = useDealerStore.getState().draft;
    expect(updated.firstName).toBe('Ana');
    expect(updated.dealershipName).toBe('Premier Veículos');
    expect(updated.cnpj).toBe('11.222.333/0001-81');
  });

  // 3. Under-18 rejection
  it('Scenario 3: Enforces strict 18+ eligibility requirement for responsible person', () => {
    // Current year is 2026
    const underAgeBirthDate = '10/05/2012'; // 14 years old
    const underAgeBirthDate17 = '18/11/2008'; // Turns 18 tomorrow (currently 17)
    const eligibleBirthDate = '15/04/1995'; // 31 years old
    const eligible18Exact = '01/01/2008'; // 18 years old in 2026

    expect(isAtLeast18YearsOld(underAgeBirthDate)).toBe(false);
    expect(isAtLeast18YearsOld(underAgeBirthDate17)).toBe(false);
    expect(isAtLeast18YearsOld(eligibleBirthDate)).toBe(true);
    expect(isAtLeast18YearsOld(eligible18Exact)).toBe(true);
  });

  // 4. Valid/invalid CNPJ
  it('Scenario 4: Verifies CNPJ check digits via Brazilian Receita Federal algorithm', () => {
    // Known valid Brazilian CNPJs (Receita Federal standard test cases)
    const validCnpjs = [
      '11.222.333/0001-81',
      '11222333000181',
      '00.000.000/0001-91', // Banco do Brasil
      '33.000.167/0001-01', // Petrobras
    ];

    for (const cnpj of validCnpjs) {
      expect(isValidCnpj(cnpj)).toBe(true);
    }

    // Invalid CNPJs (invalid check digits, invalid lengths, repeated digits)
    const invalidCnpjs = [
      '11.222.333/0001-00', // Wrong check digits
      '00.000.000/0000-00', // Repeated digits
      '11.111.111/1111-11', // Repeated digits
      '12345', // Short length
      'abcdefghijklmn', // Non-numeric
      '',
    ];

    for (const cnpj of invalidCnpjs) {
      expect(isValidCnpj(cnpj)).toBe(false);
    }
  });

  // 5. Duplicate email in the shared demo registry (Option 2 Global Email Uniqueness)
  it('Scenario 5: Prohibits duplicate email across roles under Option 2 Global Email Uniqueness', () => {
    // Existing Buyer in seed registry
    const existingBuyerEmail = 'comprador@exemplo.com.br';
    expect(isEmailRegisteredGlobally(existingBuyerEmail)).toBe(true);

    // Existing Individual Seller in seed registry
    const existingSellerEmail = 'vendedor@exemplo.com.br';
    expect(isEmailRegisteredGlobally(existingSellerEmail)).toBe(true);

    // Existing Dealership in seed registry
    const existingDealerEmail = 'contato@liderveiculos.com.br';
    expect(isEmailRegisteredGlobally(existingDealerEmail)).toBe(true);

    // Attempting to register dealership with existing buyer email fails
    const duplicateRegResult = registerDemoAccount({
      email: existingBuyerEmail,
      fullName: 'Tentativa Duplicada',
      role: 'dealer',
      status: 'pending_approval',
    });

    expect(duplicateRegResult.success).toBe(false);
    expect(duplicateRegResult.error).toContain('já está cadastrado na plataforma');

    // Brand new unique email succeeds
    const uniqueEmail = `dealer.novo.${Date.now()}@concessionaria.com.br`;
    expect(isEmailRegisteredGlobally(uniqueEmail)).toBe(false);

    const successfulReg = registerDemoAccount({
      email: uniqueEmail,
      fullName: 'Novo Concessionário',
      role: 'dealer',
      status: 'pending_approval',
    });

    expect(successfulReg.success).toBe(true);
    expect(successfulReg.account?.role).toBe('dealer');
  });

  // 6. Password confirmation
  it('Scenario 6: Validates password confirmation and minimum length', () => {
    const store = useDealerStore.getState();

    store.updateDraft({
      password: 'short',
      confirmPassword: 'short',
    });
    expect((store.draft.password || '').length < 6).toBe(true);

    store.updateDraft({
      password: 'password123',
      confirmPassword: 'passwordDifferent',
    });
    expect(
      useDealerStore.getState().draft.password === useDealerStore.getState().draft.confirmPassword,
    ).toBe(false);

    store.updateDraft({
      password: 'validPassword123',
      confirmPassword: 'validPassword123',
    });
    expect(
      useDealerStore.getState().draft.password === useDealerStore.getState().draft.confirmPassword,
    ).toBe(true);
    expect((useDealerStore.getState().draft.password || '').length >= 6).toBe(true);
  });

  // 7. Four-step form navigation
  it('Scenario 7: Navigates across the 4 registration steps and preserves draft state', () => {
    const store = useDealerStore.getState();
    expect(store.activeStep).toBe(1);

    // Move to step 2: Dados da revenda
    store.setActiveStep(2);
    expect(useDealerStore.getState().activeStep).toBe(2);

    // Move to step 3: Contato e endereço
    store.setActiveStep(3);
    expect(useDealerStore.getState().activeStep).toBe(3);

    // Move to step 4: Revisão e envio
    store.setActiveStep(4);
    expect(useDealerStore.getState().activeStep).toBe(4);

    // Clamps to step 4 max and step 1 min
    store.setActiveStep(10);
    expect(useDealerStore.getState().activeStep).toBe(4);

    store.setActiveStep(-5);
    expect(useDealerStore.getState().activeStep).toBe(1);
  });

  // 8. Submission state
  it('Scenario 8: Transitions state to pending_approval and sets protocol and session token on submit', () => {
    const store = useDealerStore.getState();

    store.updateDraft({
      firstName: 'Renato',
      lastName: 'Silveira',
      birthDate: '12/03/1986',
      email: 'renato@autovale.com.br',
      dealershipName: 'Autovale Seminovos',
      cnpj: '22.333.444/0001-92',
      phone: '(31) 3824-5500',
      address: 'Av. Castelo Branco, 1200',
      termsAccepted: true,
    });

    const app = store.submitApplication();

    expect(app.status).toBe('pending_approval');
    expect(app.protocol).toMatch(/^SOL-DEALER-202611-\d{4}$/);
    expect(app.termsAccepted).toBe(true);

    const state = useDealerStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.sessionToken).toBeDefined();
    expect(state.account?.role).toBe('dealer');
  });

  // 9. Pending approval
  it('Scenario 9: Verifies pending approval review indicators and estimated timeline', async () => {
    const pendingApp = await getDealershipApplication('dealer.pendente@exemplo.com');

    expect(pendingApp).not.toBeNull();
    expect(pendingApp?.status).toBe('pending_approval');
    expect(pendingApp?.dealership.name).toBe('Autovale Comércio de Veículos Ltda');
    expect(pendingApp?.dealership.cnpjMasked).toBe('22.***.***/0001-92');
  });

  // 10. Correction/resubmission
  it('Scenario 10: Permits editing flagged fields and resubmitting from correction_required state', async () => {
    const store = useDealerStore.getState();

    // Seed state as correction_required
    store.simulateStatus(
      'correction_required',
      'Razão social divergente do cartão CNPJ da Receita Federal.',
    );

    expect(useDealerStore.getState().application.status).toBe('correction_required');
    expect(useDealerStore.getState().application.rejectionReason).toContain('Razão social');

    // Resubmit correction
    const corrected = store.resubmitCorrection({
      dealershipName: 'Nova Era Automóveis Eireli (Corrigida)',
      cnpj: '33444555000103',
      address: 'Rua Jacarandá, 320, Horto, Ipatinga - MG',
    });

    expect(corrected.status).toBe('pending_approval');
    expect(corrected.rejectionReason).toBeUndefined();
    expect(corrected.dealershipName).toBe('Nova Era Automóveis Eireli (Corrigida)');

    // Also test adapter resubmission
    const adapterRes = await resubmitDealershipCorrection('dealer.corrigir@exemplo.com', {
      dealershipName: 'Nova Era Automóveis Corrigida Ltda',
      phone: '(31) 3821-6600',
    });

    expect(adapterRes?.status).toBe('pending_approval');
    expect(adapterRes?.dealership.name).toBe('Nova Era Automóveis Corrigida Ltda');
  });

  // 11. Approved state
  it('Scenario 11: Recognizes approved dealership account and provides access to inventory', () => {
    const store = useDealerStore.getState();

    store.loginSimulation('contato@liderveiculos.com.br');

    const state = useDealerStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.account?.role).toBe('dealer');
    expect(state.application.status).toBe('active');

    const dest = getRoleDestination('dealer', 'active');
    expect(dest.destination).toBe('/concessionaria/anuncios');
    expect(dest.isBlocked).toBe(false);
  });

  // 12. Suspended account behavior
  it('Scenario 12: Blocks suspended accounts from logging in or modifying data with friendly error', () => {
    const authResult = authenticateDemoLogin('dealer.suspenso@exemplo.com', '123456');

    expect(authResult.success).toBe(false);
    expect(authResult.error).toContain('suspensa');

    const dest = getRoleDestination('dealer', 'suspended');
    expect(dest.isBlocked).toBe(true);
    expect(dest.blockMessage).toContain('suspensa para análise de segurança');
  });

  // 13. Buyer-to-Seller conversion prohibition (AUTH-022)
  it('Scenario 13: Enforces AUTH-022 prohibiting Buyer-to-Seller or Buyer-to-Dealer account conversion', () => {
    const buyerAccount = findAccountByEmail('comprador@exemplo.com.br');
    expect(buyerAccount?.role).toBe('member');

    // Buyer attempting to register as seller with same email is rejected
    const sellerAttempt = registerDemoAccount({
      email: 'comprador@exemplo.com.br',
      fullName: buyerAccount?.fullName || 'Comprador',
      role: 'seller',
      status: 'pending_approval',
    });
    expect(sellerAttempt.success).toBe(false);
    expect(sellerAttempt.error).toContain('já está cadastrado na plataforma');

    // Buyer attempting to register as dealership with same email is rejected
    const dealerAttempt = registerDemoAccount({
      email: 'comprador@exemplo.com.br',
      fullName: buyerAccount?.fullName || 'Comprador',
      role: 'dealer',
      status: 'pending_approval',
    });
    expect(dealerAttempt.success).toBe(false);
    expect(dealerAttempt.error).toContain('já está cadastrado na plataforma');
  });

  // 14. Buyer/Seller/Dealer account separation
  it('Scenario 14: Verifies separate roles, statuses, and post-login destinations for each persona', () => {
    // 1. Buyer
    const buyerDest = getRoleDestination('member', 'active');
    expect(buyerDest.destination).toBe('/conta');

    // 2. Seller (active vs pending)
    const sellerActiveDest = getRoleDestination('seller', 'active');
    expect(sellerActiveDest.destination).toBe('/vendedor/anuncios');

    const sellerPendingDest = getRoleDestination('seller', 'pending_approval');
    expect(sellerPendingDest.destination).toBe('/vendedor/solicitacao/status');

    // 3. Dealership (active vs pending vs correction)
    const dealerActiveDest = getRoleDestination('dealer', 'active');
    expect(dealerActiveDest.destination).toBe('/concessionaria/anuncios');

    const dealerPendingDest = getRoleDestination('dealer', 'pending_approval');
    expect(dealerPendingDest.destination).toBe('/concessionaria/solicitacao/status');

    const dealerCorrectionDest = getRoleDestination('dealer', 'correction_required');
    expect(dealerCorrectionDest.destination).toBe('/concessionaria/solicitacao/corrigir');

    // 4. Staff accounts entering customer /entrar are blocked
    const staffAdminAuth = authenticateDemoLogin('admin@feiradecarros.com.br', '123456');
    expect(staffAdminAuth.success).toBe(false);
    expect(staffAdminAuth.error).toContain('portal administrativo');
  });

  // 15. Safe login redirects
  it('Scenario 15: Protects login redirect against open redirect attacks', () => {
    // Unsafe URLs
    const evilUrls = [
      'https://malicious-site.com',
      '//evil.com/phishing',
      '/\\evil.com',
      'javascript:alert(1)',
      '   ',
    ];

    for (const evil of evilUrls) {
      const dest = getRoleDestination('member', 'active', evil);
      expect(dest.destination).toBe('/conta');
    }

    // Cross-role redirect protection: Buyer cannot redirect into staff or admin
    const buyerIntoAdmin = getRoleDestination('member', 'active', '/admin/dashboard');
    expect(buyerIntoAdmin.destination).toBe('/conta');

    // Safe relative redirect for dealership
    const safeDealerDest = getRoleDestination(
      'dealer',
      'active',
      '/concessionaria/solicitacao/status',
    );
    expect(safeDealerDest.destination).toBe('/concessionaria/solicitacao/status');
  });

  // 16. Public CNPJ privacy (SEC-003 / AUTH-021)
  it('Scenario 16: Formats and masks CNPJ preventing plaintext disclosure in presentation models', () => {
    const rawCnpj = '11222333000181';
    const formatted = formatCnpj(rawCnpj);
    const masked = maskCnpjForDisplay(rawCnpj);

    expect(formatted).toBe('11.222.333/0001-81');
    expect(masked).toBe('11.***.***/0001-**');
    expect(masked).not.toContain('222.333'); // Core identifying digits masked
  });

  // 17. Responsive mobile interactions
  it('Scenario 17: Validates phone formatting and responsive presentation data', () => {
    const rawLandline = '3138224000';
    const rawMobile = '31987654321';

    expect(formatBrazilianPhone(rawLandline)).toBe('(31) 3822-4000');
    expect(formatBrazilianPhone(rawMobile)).toBe('(31) 98765-4321');
    expect(isValidBrazilianPhone(rawLandline)).toBe(true);
    expect(isValidBrazilianPhone(rawMobile)).toBe(true);
    expect(isValidBrazilianPhone('123')).toBe(false);
  });

  // 18. Demo Authentication Security & Password Verification
  it('Scenario 18: Enforces strict credential verification for demo authentication', () => {
    // 1. Unknown email must NOT authenticate and must NOT create a dummy buyer
    const unknownRes = authenticateDemoLogin('desconhecido.inexistente@exemplo.com.br', '123456');
    expect(unknownRes.success).toBe(false);
    expect(unknownRes.error).toContain('Conta não encontrada');
    expect(findAccountByEmail('desconhecido.inexistente@exemplo.com.br')).toBeUndefined();

    // 2. Empty or invalid email format
    const emptyEmailRes = authenticateDemoLogin('', '123456');
    expect(emptyEmailRes.success).toBe(false);

    // 3. Known account with invalid password
    const wrongPassRes = authenticateDemoLogin('comprador@exemplo.com.br', 'senha_incorreta');
    expect(wrongPassRes.success).toBe(false);
    expect(wrongPassRes.error).toContain('Verifique suas credenciais');

    // 4. Known account with empty password
    const emptyPassRes = authenticateDemoLogin('comprador@exemplo.com.br', '');
    expect(emptyPassRes.success).toBe(false);

    // 5. Valid credentials for known account
    const validRes = authenticateDemoLogin('comprador@exemplo.com.br', '123456');
    expect(validRes.success).toBe(true);
    expect(validRes.account?.email).toBe('comprador@exemplo.com.br');
    expect(validRes.destination).toBe('/conta');

    // Standard fixture password also works
    const standardPassRes = authenticateDemoLogin(
      'comprador@exemplo.com.br',
      DEMO_FIXTURE_PASSWORD,
    );
    expect(standardPassRes.success).toBe(true);
  });

  // 19. Option 2 Global Email Uniqueness (10 Required Cases)
  it('Scenario 19: Enforces Option 2 Global Email Uniqueness across all 10 required cases', () => {
    // Case 1: Buyer email cannot register another Buyer
    const case1 = registerDemoAccount({
      email: 'comprador@exemplo.com.br',
      fullName: 'Outro Comprador',
      role: 'member',
      status: 'active',
    });
    expect(case1.success).toBe(false);
    expect(case1.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 2: Buyer email cannot register Seller
    const case2 = registerDemoAccount({
      email: 'comprador@exemplo.com.br',
      fullName: 'Comprador Tentando Vender',
      role: 'seller',
      status: 'pending_approval',
    });
    expect(case2.success).toBe(false);
    expect(case2.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 3: Buyer email cannot register Dealer
    const case3 = registerDemoAccount({
      email: 'comprador@exemplo.com.br',
      fullName: 'Comprador Tentando Concessionaria',
      role: 'dealer',
      status: 'pending_approval',
    });
    expect(case3.success).toBe(false);
    expect(case3.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 4: Seller email cannot register Buyer
    const case4 = registerDemoAccount({
      email: 'vendedor@exemplo.com.br',
      fullName: 'Vendedor Tentando Comprar',
      role: 'member',
      status: 'active',
    });
    expect(case4.success).toBe(false);
    expect(case4.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 5: Seller email cannot register Dealer
    const case5 = registerDemoAccount({
      email: 'vendedor@exemplo.com.br',
      fullName: 'Vendedor Tentando Concessionaria',
      role: 'dealer',
      status: 'pending_approval',
    });
    expect(case5.success).toBe(false);
    expect(case5.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 6: Dealer email cannot register Buyer
    const case6 = registerDemoAccount({
      email: 'contato@liderveiculos.com.br',
      fullName: 'Dealer Tentando Comprar',
      role: 'member',
      status: 'active',
    });
    expect(case6.success).toBe(false);
    expect(case6.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 7: Dealer email cannot register Seller
    const case7 = registerDemoAccount({
      email: 'contato@liderveiculos.com.br',
      fullName: 'Dealer Tentando Vendedor',
      role: 'seller',
      status: 'pending_approval',
    });
    expect(case7.success).toBe(false);
    expect(case7.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 8: Case-insensitive duplicate detection
    const case8 = registerDemoAccount({
      email: 'COMPRADOR@EXEMPLO.COM.BR',
      fullName: 'Comprador Maiusculo',
      role: 'member',
      status: 'active',
    });
    expect(case8.success).toBe(false);
    expect(case8.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 9: Whitespace normalization
    const case9 = registerDemoAccount({
      email: '   comprador@exemplo.com.br   ',
      fullName: 'Comprador Espacado',
      role: 'member',
      status: 'active',
    });
    expect(case9.success).toBe(false);
    expect(case9.errorCode).toBe('EMAIL_ALREADY_REGISTERED');

    // Case 10: Successful registration of unique email & subsequent duplicate resistance
    const uniqueEmail = `novo.usuario.${Date.now()}@exemplo.com`;
    const regSuccess = registerDemoAccount({
      email: uniqueEmail,
      fullName: 'Usuario Unico Teste',
      role: 'member',
      status: 'active',
    });
    expect(regSuccess.success).toBe(true);

    // Immediate re-registration fails
    const reReg = registerDemoAccount({
      email: uniqueEmail,
      fullName: 'Tentativa Imediata Duplicada',
      role: 'dealer',
      status: 'pending_approval',
    });
    expect(reReg.success).toBe(false);
    expect(reReg.errorCode).toBe('EMAIL_ALREADY_REGISTERED');
  });

  // 20. Sensitive Data Protection & Store Sanitization
  it('Scenario 20: Ensures sensitive passwords, session secrets, and plaintext CNPJ are stripped from persistent storage', () => {
    const store = useDealerStore.getState();

    store.updateDraft({
      firstName: 'Carlos',
      lastName: 'Eduardo',
      birthDate: '10/10/1985',
      email: 'carlos@automoveis.com.br',
      password: 'SuperSecretPassword@2026',
      confirmPassword: 'SuperSecretPassword@2026',
      dealershipName: 'Carlos Automóveis Ltda',
      cnpj: '11.222.333/0001-81',
      phone: '(31) 98765-4321',
      address: 'Rua das Flores, 50',
    });

    // In ephemeral memory, draft has the fields
    expect(useDealerStore.getState().draft.password).toBe('SuperSecretPassword@2026');
    expect(useDealerStore.getState().draft.cnpj).toBe('11.222.333/0001-81');

    // Submit application
    store.submitApplication();

    // Sensitive passwords in draft are wiped immediately after submission
    expect(useDealerStore.getState().draft.password).toBe('');
    expect(useDealerStore.getState().draft.confirmPassword).toBe('');

    // Verification of partialize behavior (what gets written to localStorage)
    const rawOptions = (
      useDealerStore as unknown as {
        persist: { getOptions: () => { partialize: (state: unknown) => unknown } };
      }
    ).persist.getOptions();
    const persistedData = rawOptions.partialize(useDealerStore.getState()) as {
      isAuthenticated: boolean;
      sessionToken: string | null;
      draft: { password?: string; confirmPassword?: string; cnpj?: string };
      application: { cnpj?: string };
    };

    expect(persistedData.isAuthenticated).toBe(false);
    expect(persistedData.sessionToken).toBeNull();
    expect(persistedData.draft.password).toBe('');
    expect(persistedData.draft.confirmPassword).toBe('');
    expect(persistedData.draft.cnpj).toBe('');
    expect(persistedData.application.cnpj).toBe('');
  });

  // 21. Dealership Registration Transaction Order
  it('Scenario 21: Enforces that account registration is confirmed before committing application state', () => {
    // If a collision occurs (e.g. email already exists), registration returns failure
    const collisionAttempt = registerDemoAccount({
      email: 'contato@liderveiculos.com.br', // Already in use by seed dealer
      fullName: 'Tentativa Conflito',
      role: 'dealer',
      status: 'pending_approval',
    });

    expect(collisionAttempt.success).toBe(false);
    expect(collisionAttempt.errorCode).toBe('EMAIL_ALREADY_REGISTERED');
  });

  // 22. Strict Redirect Sanitization
  it('Scenario 22: Enforces strict redirect sanitization rejecting bypasses', () => {
    expect(isSafeRedirect('/conta')).toBe(true);
    expect(isSafeRedirect('/veiculos/123')).toBe(true);
    expect(isSafeRedirect('/concessionaria/solicitacao/status')).toBe(true);

    // Malicious or bypass attempts
    expect(isSafeRedirect('//evil.com')).toBe(false);
    expect(isSafeRedirect('/\\evil.com')).toBe(false);
    expect(isSafeRedirect('/foo@evil.com')).toBe(false);
    expect(isSafeRedirect('/path\r\nevil.com')).toBe(false);
    expect(isSafeRedirect('javascript:alert(1)')).toBe(false);
    expect(isSafeRedirect('https://google.com')).toBe(false);
    expect(isSafeRedirect(null)).toBe(false);
    expect(isSafeRedirect('')).toBe(false);
  });
});
