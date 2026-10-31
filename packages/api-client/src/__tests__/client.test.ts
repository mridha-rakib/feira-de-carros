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

  it('throws typed ApiError on HTTP failures', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ message: 'Acesso negado: permissão necessária' }),
    } as Response);

    const onForbiddenSpy = vi.fn();
    const client = new ApiClient({
      baseUrl: 'https://api.feiradecarros.com',
      onForbidden: onForbiddenSpy,
    });

    await expect(client.get('/admin/moderation')).rejects.toThrow(ApiError);
    expect(onForbiddenSpy).toHaveBeenCalledTimes(1);
  });

  it('generates structured query keys', () => {
    const key = vehicleKeys.list({ make: 'Honda', minYear: 2020 });
    expect(key).toEqual(['vehicles', 'list', { make: 'Honda', minYear: 2020 }]);
  });
});
