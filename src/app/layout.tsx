import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LanguageProvider } from '@/app/providers/LanguageContext';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AlbaniaTours - Discover Albania',
  description: 'The best tours and accommodations in Albania',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <LanguageProvider>
            <Header />
            {children}
            <Footer />
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
