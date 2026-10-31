import { describe, expect, it } from 'vitest';
import { mockVehicle } from '../fixtures/vehicles';
import { createTestQueryClient } from '../render';

describe('Testing Utilities', () => {
  it('creates isolated query client with retry disabled', () => {
    const client = createTestQueryClient();
    expect(client.getDefaultOptions().queries?.retry).toBe(false);
  });

  it('provides valid mock vehicle fixtures', () => {
    expect(mockVehicle.id).toBeDefined();
    expect(mockVehicle.make).toBe('Toyota');
    expect(mockVehicle.status).toBe('PUBLISHED');
  });
});
