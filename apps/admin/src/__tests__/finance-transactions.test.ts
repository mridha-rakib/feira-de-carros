import { describe, expect, it } from 'vitest';
import {
  FIGMA_FINANCE_METRICS,
  formatBrl,
  mockCashReceipts,
  mockTransactions,
} from '../../lib/adapters/mock-finance-data';
import type { TransactionRecord } from '../../lib/types/finance-presentation';

describe('Admin B4A — Financial Transactions & Cash Ledger Data', () => {
  it('primary sample contains exactly 5 transactions matching approved Figma ADM-D-024 specification', () => {
    expect(mockTransactions).toHaveLength(5);
  });

  it('verifies 4 confirmed transactions total R$ 160,00 and 1 pending totals R$ 30,00', () => {
    const confirmed = mockTransactions.filter((t) => t.status === 'CONFIRMED');
    const pending = mockTransactions.filter((t) => t.status === 'PENDING');

    expect(confirmed).toHaveLength(4);
    expect(pending).toHaveLength(1);

    const confirmedSum = confirmed.reduce((acc, t) => acc + t.amountBrl, 0);
    const pendingSum = pending.reduce((acc, t) => acc + t.amountBrl, 0);
    const totalSum = mockTransactions.reduce((acc, t) => acc + t.amountBrl, 0);

    expect(confirmedSum).toBe(160.0);
    expect(pendingSum).toBe(30.0);
    expect(totalSum).toBe(190.0);

    // Verify FIGMA_FINANCE_METRICS constants
    expect(FIGMA_FINANCE_METRICS.confirmedVolumeBrl).toBe(160.0);
    expect(FIGMA_FINANCE_METRICS.confirmedCount).toBe(4);
    expect(FIGMA_FINANCE_METRICS.pendingVolumeBrl).toBe(30.0);
    expect(FIGMA_FINANCE_METRICS.pendingCount).toBe(1);
    expect(FIGMA_FINANCE_METRICS.totalTransactedBrl).toBe(190.0);
  });

  it('verifies Cash Receipts Ledger (ADM-D-027) contains 3 fictional receipts totaling R$ 110,00', () => {
    expect(mockCashReceipts).toHaveLength(3);

    const cashSum = mockCashReceipts.reduce((acc, r) => acc + r.amountReceivedBrl, 0);
    expect(cashSum).toBe(110.0);
    expect(FIGMA_FINANCE_METRICS.cashLedgerVolumeBrl).toBe(110.0);
    expect(FIGMA_FINANCE_METRICS.cashLedgerCount).toBe(3);

    // Every cash receipt must have an audit hash and a physical slip number
    for (const receipt of mockCashReceipts) {
      expect(receipt.auditHash).toMatch(/^sha256-/);
      expect(receipt.physicalSlipNumber).toMatch(/^CANHOTO-/);
      expect(receipt.operatorRole).toBe('main_admin');
    }
  });

  it('verifies independent lifecycle: confirmed payments do NOT publish ads without prior approval', () => {
    for (const tx of mockTransactions) {
      if (tx.status === 'CONFIRMED') {
        // Confirmation is independent from adStatus
        expect(['APPROVED', 'PENDING_APPROVAL']).toContain(tx.adStatus);
      }
      if (tx.status === 'PENDING') {
        expect(tx.adPublished).toBe(false);
      }
    }
  });

  it('formats BRL values correctly according to pt-BR standards', () => {
    expect(formatBrl(40.0)).toMatch(/R\$\s?40,00/);
    expect(formatBrl(160.0)).toMatch(/R\$\s?160,00/);
    expect(formatBrl(190.0)).toMatch(/R\$\s?190,00/);
  });

  it('verifies pending cash transaction TX-2026-0005 is eligible for cash preview flow', () => {
    const tx = mockTransactions.find((t) => t.id === 'TX-2026-0005');
    expect(tx).toBeDefined();
    expect(tx?.method).toBe('CASH');
    expect(tx?.status).toBe('PENDING');
    expect(tx?.amountBrl).toBe(30.0);
    expect(tx?.adStatus).toBe('PENDING_APPROVAL');
    expect(tx?.adPublished).toBe(false);
  });
});
