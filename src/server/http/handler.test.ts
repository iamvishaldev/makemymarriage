import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ForbiddenError } from '@/server/http/errors';
import { REQUEST_ID_HEADER, withApi } from '@/server/http/handler';
import { logger } from '@/server/logger';

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost:3000/api/v1/things', { headers });
}

describe('withApi', () => {
  it('wraps a successful result in the envelope with the requested status and message', async () => {
    // Arrange
    const route = withApi(async () => ({ data: { id: 't1' }, status: 201, message: 'Created.' }));

    // Act
    const response = await route(makeRequest(), {});
    const body = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(body).toMatchObject({ success: true, data: { id: 't1' }, message: 'Created.' });
  });

  it('defaults to 200 with a null message', async () => {
    // Arrange
    const route = withApi(async () => ({ data: 'ok' }));

    // Act
    const response = await route(makeRequest(), {});
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.message).toBeNull();
  });

  it('passes the route context through to the handler', async () => {
    // Arrange
    const context = { params: Promise.resolve({ id: 'abc' }) };
    const route = withApi(async (_request, ctx: typeof context) => ({ data: await ctx.params }));

    // Act
    const body = await (await route(makeRequest(), context)).json();

    // Assert
    expect(body.data).toEqual({ id: 'abc' });
  });

  it('maps an AppError to its status, code and message', async () => {
    // Arrange
    const route = withApi(async () => {
      throw new ForbiddenError();
    });

    // Act
    const response = await route(makeRequest(), {});
    const body = await response.json();

    // Assert
    expect(response.status).toBe(403);
    expect(body).toMatchObject({ success: false, data: null, errorCode: 'FORBIDDEN' });
  });

  it('maps a ZodError to a 400 with field errors in data', async () => {
    // Arrange
    const schema = z.object({ name: z.string() });
    const route = withApi(async () => ({ data: schema.parse({}) }));

    // Act
    const response = await route(makeRequest(), {});
    const body = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(body.errorCode).toBe('VALIDATION_ERROR');
    expect(body.data.fieldErrors).toHaveProperty('name');
  });

  it('hides unexpected error details from the client and logs them server-side', async () => {
    // Arrange
    const errorSpy = jest.fn();
    const childSpy = jest
      .spyOn(logger, 'child')
      .mockReturnValue({ error: errorSpy, warn: jest.fn(), info: jest.fn() } as never);
    const route = withApi(async () => {
      throw new Error('connection string mongodb://user:pass@host');
    });

    // Act
    const response = await route(makeRequest(), {});
    const body = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(body).toMatchObject({ success: false, errorCode: 'INTERNAL_ERROR' });
    expect(JSON.stringify(body)).not.toContain('mongodb://');
    expect(errorSpy).toHaveBeenCalledWith({ err: expect.any(Error) }, 'unhandled error');
    childSpy.mockRestore();
  });

  it('echoes a well-formed incoming request ID', async () => {
    // Arrange
    const route = withApi(async () => ({ data: null }));

    // Act
    const response = await route(makeRequest({ [REQUEST_ID_HEADER]: 'req-12345678' }), {});

    // Assert
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe('req-12345678');
  });

  it('replaces a malformed request ID with a generated UUID', async () => {
    // Arrange
    const route = withApi(async () => ({ data: null }));

    // Act
    const response = await route(makeRequest({ [REQUEST_ID_HEADER]: 'bad id <script>' }), {});

    // Assert
    expect(response.headers.get(REQUEST_ID_HEADER)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('marks every API response as non-cacheable', async () => {
    // Arrange
    const route = withApi(async () => ({ data: null }));

    // Act
    const response = await route(makeRequest(), {});

    // Assert
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
