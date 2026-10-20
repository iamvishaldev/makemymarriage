import type { ErrorCode } from '@/server/http/errors';

/**
 * Standard API envelope (PlexiTech API standard). Every /api/v1 response uses this shape.
 * On validation errors, `data` carries the field-level issues.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errorCode: ErrorCode | null;
  timestamp: string;
}

export function successBody<T>(data: T, message: string | null = null): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    errorCode: null,
    timestamp: new Date().toISOString(),
  };
}

export function errorBody(
  errorCode: ErrorCode,
  message: string,
  details: unknown = null,
): ApiResponse<unknown> {
  return {
    success: false,
    data: details,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };
}
