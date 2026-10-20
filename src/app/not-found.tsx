import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-ink-muted">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="font-medium text-brand underline underline-offset-4">
        Go to the home page
      </Link>
    </main>
  );
}
