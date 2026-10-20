'use client';

import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level error boundary. Shows a generic message only; the digest is an opaque
 * reference that support can match against server logs, never the error itself.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-ink-muted">Please try again. If the problem continues, contact support.</p>
      {error.digest ? <p className="text-sm text-ink-muted">Reference: {error.digest}</p> : null}
      <div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
