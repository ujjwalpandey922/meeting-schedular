import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {Providers} from '@/lib/providers';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meeting Scheduler',
  description: 'Schedule and manage your meetings easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="u2VUWOONnIZnNiZqbGgNaTjDuNl7xn58e3Na0nz_NCU" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}