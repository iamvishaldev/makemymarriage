import 'server-only';
import pino, { type DestinationStream } from 'pino';
import { env } from '@/server/env';

/**
 * Keys that must never reach logs: credentials, bearer tokens and guest personal data
 * (PRD §10 Observability, Database Design §12). Matched at the top level and up to two levels
 * deep, e.g. `err.headers.authorization`. Request bodies are never logged by default.
 */
export const REDACTED_KEYS = [
  // credentials and bearer tokens
  'authorization',
  'cookie',
  '["set-cookie"]',
  'password',
  'secret',
  'apiKey',
  'token',
  'accessToken',
  'refreshToken',
  'tokenHash',
  // guest and member personal data
  'email',
  'emailNormalized',
  'recipientEmail',
  'phone',
  'phoneNormalized',
  'notes',
  'dietaryNotes',
  'addressText',
];

const REDACT_PATHS = REDACTED_KEYS.flatMap((key) => {
  const segment = key.startsWith('[') ? key : `.${key}`;
  return [key.startsWith('[') ? `*${key}` : key, `*${segment}`, `*.*${segment}`];
});

/** Builds a logger; `destination` lets tests capture output. */
export function createLogger(level: string, destination?: DestinationStream) {
  return pino(
    {
      level,
      base: { service: 'make-my-marriage', env: env.NODE_ENV },
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
    },
    destination,
  );
}

/** Structured JSON logger. Use `logger.child({ requestId })` to correlate a request's lines. */
export const logger = createLogger(env.LOG_LEVEL);

export type Logger = typeof logger;
