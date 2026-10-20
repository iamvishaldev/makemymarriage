import 'server-only';
import { z } from 'zod';

/**
 * Server-side environment contract. Add a variable here (and to .env.example) in the same
 * change that first uses it; never read process.env directly elsewhere in server code.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.url(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates an environment source. The error names the invalid variables but never echoes
 * their values, so secrets cannot leak into build or startup logs.
 */
export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => issue.path.join('.')))];
    throw new Error(`Invalid environment configuration: ${names.join(', ')}. See .env.example.`);
  }
  return result.data;
}

export const env = parseServerEnv(process.env);
