import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { ZodError, z } from 'zod';
import { AppError, ErrorCode } from '@/server/http/errors';
import { errorBody, successBody, type ApiResponse } from '@/server/http/response';
import { logger, type Logger } from '@/server/logger';

export interface ApiResult<T> {
  data: T;
  status?: number;
  message?: string;
}

export type ApiHandler<TContext, T> = (
  request: NextRequest,
  context: TContext,
) => Promise<ApiResult<T>>;

export const REQUEST_ID_HEADER = 'x-request-id';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

const INTERNAL_ERROR_MESSAGE = 'Something went wrong. Please try again.';

function resolveRequestId(request: NextRequest): string {
  const incoming = request.headers.get(REQUEST_ID_HEADER);
  return incoming && REQUEST_ID_PATTERN.test(incoming) ? incoming : crypto.randomUUID();
}

function toErrorResponse(
  error: unknown,
  log: Logger,
): { status: number; body: ApiResponse<unknown> } {
  if (error instanceof AppError) {
    log.warn({ errorCode: error.code, status: error.status }, 'request rejected');
    return { status: error.status, body: errorBody(error.code, error.message, error.details) };
  }

  if (error instanceof ZodError) {
    log.warn({ errorCode: ErrorCode.VALIDATION_ERROR, status: 400 }, 'request rejected');
    return {
      status: 400,
      body: errorBody(ErrorCode.VALIDATION_ERROR, 'The request is invalid.', z.flattenError(error)),
    };
  }

  // Unexpected: full detail goes to the server log only, never to the client.
  log.error({ err: error }, 'unhandled error');
  return { status: 500, body: errorBody(ErrorCode.INTERNAL_ERROR, INTERNAL_ERROR_MESSAGE) };
}

/**
 * Wraps an /api/v1 route handler with the shared request lifecycle: request ID, the standard
 * response envelope, error mapping, no-store caching and a completion log line.
 *
 * Only the pathname is logged, so bearer tokens (invitation links, etc.) must travel in the
 * request body or headers — never in an API path or query string.
 */
export function withApi<TContext, T>(handler: ApiHandler<TContext, T>) {
  return async (request: NextRequest, context: TContext): Promise<NextResponse> => {
    const requestId = resolveRequestId(request);
    const startedAt = performance.now();
    const log = logger.child({
      requestId,
      method: request.method,
      path: request.nextUrl.pathname,
    });

    let response: NextResponse;
    try {
      const result = await handler(request, context);
      response = NextResponse.json(successBody(result.data, result.message ?? null), {
        status: result.status ?? 200,
      });
    } catch (error) {
      const { status, body } = toErrorResponse(error, log);
      response = NextResponse.json(body, { status });
    }

    response.headers.set(REQUEST_ID_HEADER, requestId);
    response.headers.set('Cache-Control', 'no-store');
    log.info(
      { status: response.status, durationMs: Math.round(performance.now() - startedAt) },
      'request completed',
    );
    return response;
  };
}
