import { withApi } from '@/server/http/handler';

/**
 * GET /api/v1/health — liveness check for uptime monitoring and deployment verification.
 * Anonymous by design; returns no configuration or dependency detail.
 * A database connectivity check is added with the MongoDB integration.
 *
 * @returns 200 with `{ status: "ok" }` in the standard envelope.
 */
export const GET = withApi(async () => ({ data: { status: 'ok' as const } }));
