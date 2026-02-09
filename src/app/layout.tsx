import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { QueryProvider } from '@/shared/providers/query-provider';
import { DebugLogoutButton } from '@/shared/ui/debug-logout-button';
import { Toaster } from '@/shared/ui/sonner';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

const inter = Inter({
  variable: '--font-inter',
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NuqsAdapter>
          <QueryProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              <DebugLogoutButton />
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
