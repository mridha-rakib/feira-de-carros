import { describe, expect, it, vi } from 'vitest';
import { ApiClient, ApiError } from '../client';
import { vehicleKeys } from '../queries/keys';

describe('ApiClient', () => {
  it('formats URLs and parses JSON response successfully', async () => {
    const mockData = { id: 'car-1', make: 'Toyota', model: 'Corolla' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response);

    const client = new ApiClient({ baseUrl: 'https://api.feiradecarros.com' });
    const result = await client.get('/vehicles/car-1');

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.feiradecarros.com/vehicles/car-1',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('throws typed ApiError on HTTP failures with OpenAPI code and request_id', async () => {
    const errorPayload = {
      code: 'ACCESS_DENIED',
      message: 'Acesso negado: permissão necessária',
      request_id: 'req-err-403',
      details: [{ field: 'role', reason: 'Requer perfil main_admin' }],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => errorPayload,
    } as Response);

    const onForbiddenSpy = vi.fn();
    const client = new ApiClient({
      baseUrl: 'https://api.feiradecarros.com',
      onForbidden: onForbiddenSpy,
    });

    try {
      await client.get('/v1/admin/dashboard');
      expect.fail('Should have thrown ApiError');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const apiErr = err as ApiError;
      expect(apiErr.statusCode).toBe(403);
      expect(apiErr.isForbidden).toBe(true);
      expect(apiErr.code).toBe('ACCESS_DENIED');
      expect(apiErr.requestId).toBe('req-err-403');
      expect(apiErr.fieldErrors).toHaveLength(1);
      expect(apiErr.fieldErrors?.[0]?.field).toBe('role');
    }

    expect(onForbiddenSpy).toHaveBeenCalledTimes(1);
  });

  it('generates structured query keys', () => {
    const key = vehicleKeys.list({ make: 'Honda', minYear: 2020 });
    expect(key).toEqual(['vehicles', 'list', { make: 'Honda', minYear: 2020 }]);
  });
});
