import { http, HttpResponse } from 'msw';
import { mockVehicle } from '../fixtures/vehicles';

export const handlers = [
  http.get('*/vehicles', () => {
    return HttpResponse.json({
      data: [mockVehicle],
      pagination: {
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    });
  }),

  http.get('*/vehicles/:id', ({ params }) => {
    return HttpResponse.json({
      ...mockVehicle,
      id: params.id,
    });
  }),

  http.post('*/leads', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        id: 'lead-new-123',
        status: 'NEW',
        ...(body as Record<string, unknown>),
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),
];
