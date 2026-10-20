/** Runs once when the server starts, so invalid configuration fails at boot, not mid-request. */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('@/server/env');
  }
}
