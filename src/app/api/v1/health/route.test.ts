import { NextRequest } from 'next/server';
import { GET } from '@/app/api/v1/health/route';

describe('GET /api/v1/health', () => {
  it('reports ok in the standard envelope', async () => {
    // Arrange
    const request = new NextRequest('http://localhost:3000/api/v1/health');

    // Act
    const response = await GET(request, {});
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      success: true,
      data: { status: 'ok' },
      message: null,
      errorCode: null,
    });
  });
});
