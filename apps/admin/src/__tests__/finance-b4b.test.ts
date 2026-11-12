import { describe, expect, it } from 'vitest';
import {
  FIGMA_DISPUTES_METRICS,
  formatBrl,
  mapPayToTx,
  mapTxToPay,
  mockCardDisputes,
  mockRefundRequests,
  mockRevenueReport,
} from '../../lib/adapters/mock-finance-data';

describe('Admin B4B — Finance: Refunds, Disputes & Revenue Analytics', () => {
  describe('Phase 3 & 4 — Refund Requests Queue & Details (ADM-D-028 & ADM-D-029)', () => {
    it('has exactly 3 approved fictional refund requests totaling R$ 110,00', () => {
      expect(mockRefundRequests).toHaveLength(3);
      const totalRefundsBrl = mockRefundRequests.reduce((sum, r) => sum + r.amountBrl, 0);
      expect(totalRefundsBrl).toBe(110);
    });

    it('enforces 3-business-day review rule and Art. 49 CDC criteria on CXL-DEMO-001', () => {
      const cxl1 = mockRefundRequests.find((r) => r.id === 'CXL-DEMO-001');
      expect(cxl1).toBeDefined();
      expect(cxl1?.status).toBe('PENDING_REVIEW');
      expect(cxl1?.amountBrl).toBe(40);
      expect(cxl1?.legalDeadline).toContain('3 dias úteis');
      expect(cxl1?.reviewCriteria.withinSevenDays).toBe(true);
      expect(cxl1?.reviewCriteria.boostAlreadyConsumed).toBe(false);
      expect(cxl1?.reviewCriteria.eligibleForRefund).toBe(true);
      expect(cxl1?.auditTimeline.length).toBeGreaterThanOrEqual(3);
    });

    it('enforces HOLD_LEGAL state on CXL-DEMO-002 due to service consumption', () => {
      const cxl2 = mockRefundRequests.find((r) => r.id === 'CXL-DEMO-002');
      expect(cxl2).toBeDefined();
      expect(cxl2?.status).toBe('HOLD_LEGAL');
      expect(cxl2?.amountBrl).toBe(40);
      expect(cxl2?.reviewCriteria.withinSevenDays).toBe(false);
      expect(cxl2?.reviewCriteria.boostAlreadyConsumed).toBe(true);
      expect(cxl2?.reviewCriteria.eligibleForRefund).toBe(false);
    });

    it('reconciles cash pre-booking cancellation on CXL-DEMO-003 without physical cash disbursement', () => {
      const cxl3 = mockRefundRequests.find((r) => r.id === 'CXL-DEMO-003');
      expect(cxl3).toBeDefined();
      expect(cxl3?.method).toBe('CASH');
      expect(cxl3?.amountBrl).toBe(30);
      expect(cxl3?.notes).toContain('pagamento em dinheiro nunca foi efetuado');
    });
  });

  describe('Phase 5 — Card Disputes & Chargebacks (ADM-D-030)', () => {
    it('has exactly 3 card disputes with approved R$ 130,00 total disputed amount', () => {
      expect(mockCardDisputes).toHaveLength(3);
      expect(FIGMA_DISPUTES_METRICS.totalDisputedBrl).toBe(130);
      expect(FIGMA_DISPUTES_METRICS.totalDisputesCount).toBe(3);

      const calculatedTotal = mockCardDisputes.reduce((acc, d) => acc + d.amountBrl, 0);
      expect(calculatedTotal).toBe(130);
    });

    it('correctly tracks 2 disputes under review and 1 with incomplete evidence', () => {
      expect(FIGMA_DISPUTES_METRICS.underReviewCount).toBe(2);
      expect(FIGMA_DISPUTES_METRICS.underReviewAmountBrl).toBe(100);
      expect(FIGMA_DISPUTES_METRICS.incompleteEvidenceCount).toBe(1);
      expect(FIGMA_DISPUTES_METRICS.incompleteEvidenceAmountBrl).toBe(30);

      const underReview = mockCardDisputes.filter((d) => d.status === 'UNDER_REVIEW');
      const incomplete = mockCardDisputes.filter((d) => d.status === 'INCOMPLETE_EVIDENCE');
      expect(underReview).toHaveLength(2);
      expect(incomplete).toHaveLength(1);
      expect(incomplete[0]?.id).toBe('DSP-2026-0003');
    });

    it('strictly maintains guaranteed revenue notice at R$ 0,00 for disputed amounts', () => {
      expect(FIGMA_DISPUTES_METRICS.guaranteedRevenueNoticeBrl).toBe(0);
    });

    it('correctly provides bidirectional mapping between TX-2026-* and PAY-2026-*', () => {
      expect(mapTxToPay('TX-2026-0001')).toBe('PAY-2026-0001');
      expect(mapTxToPay('TX-2026-0002')).toBe('PAY-2026-0002');
      expect(mapPayToTx('PAY-2026-0001')).toBe('TX-2026-0001');
      expect(mapPayToTx('PAY-2026-0002')).toBe('TX-2026-0002');
    });
  });

  describe('Phase 6 — Revenue & Payment Reports (ADM-D-031)', () => {
    it('matches exact confirmed revenue of R$ 42.580,00 for May–October 2026', () => {
      const r = mockRevenueReport;
      expect(r.totalConfirmedRevenueBrl).toBe(42580);
      expect(r.periodLabel).toBe('Maio – Outubro 2026');
      expect(r.activeAdvertisementsCount).toBe(1248);
      expect(r.vehicleSalesProcessedBrl).toBe(0);
    });

    it('reconciles monthly revenue figures with 100% precision', () => {
      const data = mockRevenueReport.monthlyData;
      expect(data).toHaveLength(6);

      const monthlyAmounts = [4200, 5180, 6260, 6950, 8150, 11840];
      data.forEach((m, idx) => {
        expect(m.amountBrl).toBe(monthlyAmounts[idx]);
        expect(m.plansAmountBrl + m.boostsAmountBrl).toBe(m.amountBrl);
      });

      const totalSum = data.reduce((acc, m) => acc + m.amountBrl, 0);
      expect(totalSum).toBe(42580);
    });

    it('confirms platform vehicle sales processed is R$ 0,00', () => {
      expect(mockRevenueReport.vehicleSalesProcessedBrl).toBe(0);
      expect(formatBrl(mockRevenueReport.vehicleSalesProcessedBrl)).toBe('R$\u00A00,00');
    });
  });
});
