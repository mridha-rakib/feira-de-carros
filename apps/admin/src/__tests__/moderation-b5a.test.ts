import { describe, expect, it } from 'vitest';
import {
  MODERATION_KPI,
  MODERATION_MOBILE_KPI,
  formatVehiclePrice,
  getReportById,
  mockMobileModerationReports,
  mockModerationDecision,
  mockReports,
} from '../../lib/adapters/mock-moderation-data';

describe('Admin B5A — Reports & Moderation Management', () => {
  describe('Workflow 04 — ADM-D-032: Moderation Queue & Reference Data', () => {
    it('has exactly 3 demonstrative reports conforming to Figma source of truth', () => {
      expect(mockReports).toHaveLength(3);
      expect(mockReports.map((r) => r.id)).toEqual([
        'RPT-DEMO-008',
        'RPT-DEMO-009',
        'RPT-DEMO-010',
      ]);
    });

    it('matches ADM-D-032 KPI reference metrics', () => {
      expect(MODERATION_KPI.totalReports).toBe(3);
      expect(MODERATION_KPI.underReview).toBe(2);
      expect(MODERATION_KPI.corrections).toBe(1);
      expect(MODERATION_KPI.supportAccessLabel).toBe('DENY_PENDING');

      const underReviewCount = mockReports.filter((r) => r.status === 'UNDER_REVIEW').length;
      const correctionsCount = mockReports.filter(
        (r) => r.status === 'CORRECTION_REQUESTED',
      ).length;
      expect(underReviewCount).toBe(MODERATION_KPI.underReview);
      expect(correctionsCount).toBe(MODERATION_KPI.corrections);
    });

    it('faithfully preserves RPT-DEMO-008 vehicle and seller reference attributes', () => {
      const rpt8 = getReportById('RPT-DEMO-008');
      expect(rpt8).toBeDefined();
      expect(rpt8?.adId).toBe('FC-2026-0121');
      expect(rpt8?.vehicleTitle).toBe('Toyota Corolla 2021');
      expect(rpt8?.vehiclePriceBrl).toBe(112900);
      expect(rpt8?.sellerName).toBe('Vale Auto Veículos');
      expect(rpt8?.sellerType).toBe('concessionaria');
      expect(rpt8?.reportedAt).toBe('24/10/2026');
      expect(rpt8?.status).toBe('UNDER_REVIEW');
      expect(rpt8?.conclusionLabel).toBe('Não determinada');
      expect(rpt8?.vehicleImagePath).toBe('/images/vehicles/demo/image.png');
    });

    it('formats vehicle prices correctly with pt-BR currency conventions', () => {
      expect(formatVehiclePrice(112900)).toBe('R$ 112.900');
      expect(formatVehiclePrice(0)).toBe('—');
    });
  });

  describe('Workflow 05 — ADM-D-033: Report Details & Privacy Protections', () => {
    it('masks sensitive documents and protects identities under LGPD', () => {
      for (const report of mockReports) {
        expect(report.sellerCnpjMasked).toBe('Restrito / não público');
      }
      expect(getReportById('RPT-DEMO-008')?.reporterAlias).toContain('protegido');
      expect(getReportById('RPT-DEMO-009')?.reporterAlias).toContain('protegido');
    });

    it('returns null for unknown report IDs to support not-found state', () => {
      expect(getReportById('RPT-NON-EXISTENT')).toBeNull();
      expect(getReportById('')).toBeNull();
    });

    it('maintains unverified allegation status without concluding violation', () => {
      const rpt8 = getReportById('RPT-DEMO-008');
      expect(rpt8?.conclusionLabel).toBe('Não determinada');
      const verifiedEvidence = rpt8?.evidence.filter((e) => e.verified);
      expect(verifiedEvidence).toHaveLength(0);
    });
  });

  describe('Workflow 06 — ADM-D-034: Restricted Conversation Review', () => {
    it('attaches scoped conversation excerpt only to authorized reported context as unilateral unverified evidence', () => {
      const rpt8 = getReportById('RPT-DEMO-008');
      expect(rpt8?.conversationExcerpt).toBeDefined();
      const excerpt = rpt8?.conversationExcerpt;
      expect(excerpt?.scopeNotice).toContain('Trecho unilateral');
      expect(excerpt?.scopeNotice).toContain('Não constitui registro certificado de chat privado');
      expect(excerpt?.messages).toHaveLength(2);
      expect(excerpt?.evidenceAuthStatus).toBe('PENDING_VERIFICATION');
      expect(excerpt?.auditSummary).toContain('Evidência documental unilateral');
      expect(excerpt?.auditSummary).toContain('Não constitui espelhamento de chat');
      expect(excerpt?.permissionsNote).toContain('Support: DENY_PENDING');

      // Every message must be explicitly marked as excerpt
      for (const msg of excerpt?.messages || []) {
        expect(msg.isExcerpt).toBe(true);
      }
    });

    it('does not expose private conversations for reports without attached dialogue', () => {
      const rpt10 = getReportById('RPT-DEMO-010');
      expect(rpt10?.conversationExcerpt).toBeUndefined();
    });
  });

  describe('Workflow 07 — ADM-D-035: Moderation Decision Preview & Fail-Closed Invariants', () => {
    it('provides exactly 3 approved decision options requiring justification', () => {
      expect(mockModerationDecision.decisionOptions).toHaveLength(3);
      expect(mockModerationDecision.decisionOptions.map((o) => o.type)).toEqual([
        'NOT_SUBSTANTIATED',
        'CORRECTION_REQUESTED',
        'RESTRICTIVE_MEASURE',
      ]);
      for (const opt of mockModerationDecision.decisionOptions) {
        expect(opt.requiresJustification).toBe(true);
        expect(opt.consequences.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('enforces blocked authorization state and fail-closed audit note', () => {
      expect(mockModerationDecision.blockedAuthorizationState).toBe(true);
      expect(mockModerationDecision.justificationRequired).toBe(true);
      expect(mockModerationDecision.auditNote).toContain('fail-closed');
      expect(mockModerationDecision.auditNote).toContain('Nenhuma medida é executada');
    });
  });

  describe('Workflow 08 — ADM-M-005: Dedicated Mobile Moderation Fidelity & Restrictions', () => {
    it('matches approved Figma ADM-M-005 mobile KPI metrics (7 pending, 2 urgent)', () => {
      expect(MODERATION_MOBILE_KPI.pendingReports).toBe(7);
      expect(MODERATION_MOBILE_KPI.urgentReports).toBe(2);
      expect(MODERATION_MOBILE_KPI.mainAdminStatus).toBe('Revisão e leitura autorizada');
      expect(MODERATION_MOBILE_KPI.supportStatus).toBe('DENY_PENDING');
    });

    it('separates mobile demonstration fixtures from desktop queue dataset', () => {
      expect(mockMobileModerationReports).toHaveLength(2);
      expect(mockMobileModerationReports.map((r) => r.id)).toEqual([
        'REP-DEMO-0021',
        'REP-DEMO-0022',
      ]);

      const rep21 = mockMobileModerationReports.find((r) => r.id === 'REP-DEMO-0021');
      expect(rep21).toBeDefined();
      expect(rep21?.isUrgent).toBe(true);
      expect(rep21?.priorityLabel).toBe('Urgente');
      expect(rep21?.vehicleTitle).toBe('Toyota Corolla 2021');
      expect(rep21?.vehiclePriceBrl).toBe(112900);
      expect(rep21?.sellerName).toBe('Vale Auto Veículos');
      expect(rep21?.sellerDocumentMasked).toContain('Restrito');
      expect(rep21?.reporterMasked).toContain('protegido por LGPD');
      expect(rep21?.readOnlyNotice).toContain('Modo Leitura');

      const rep22 = mockMobileModerationReports.find((r) => r.id === 'REP-DEMO-0022');
      expect(rep22).toBeDefined();
      expect(rep22?.isUrgent).toBe(false);
      expect(rep22?.priorityLabel).toBe('Pendente');
      expect(rep22?.vehicleTitle).toBe('Fiat Strada 2023');
      expect(rep22?.sellerName).toBe('Particular');
      expect(rep22?.sellerDocumentMasked).toContain('CPF: ***.***.***-**');
      expect(rep22?.reporterMasked).toContain('protegido por LGPD');
    });
  });
});
