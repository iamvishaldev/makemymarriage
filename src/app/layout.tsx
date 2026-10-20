import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { env } from '@/server/env';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: {
    default: 'Make My Marriage',
    template: '%s · Make My Marriage',
  },
  description: 'One wedding. One shared plan. Everyone coordinated.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-surface font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
