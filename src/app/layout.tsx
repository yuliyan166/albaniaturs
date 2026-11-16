import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LanguageProvider } from '@/app/providers/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AlbaniaTours - Discover Hidden Treasures of Albania',
  description: 'Book accommodations, car rentals, tours, and transfers in Albania. Your trusted premium travel partner for an unforgettable vacation.',
  keywords: 'Albania, tours, accommodation, car rental, transfers, AlbaniaTours, premium travel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://albania-turs.com',
    siteName: 'AlbaniaTours',
    title: 'AlbaniaTours - Discover Hidden Treasures of Albania',
    description: 'Book accommodations, car rentals, tours, and transfers in Albania. Your trusted premium travel partner.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@albaniatours',
    title: 'AlbaniaTours - Discover Hidden Treasures of Albania',
    description: 'Book accommodations, car rentals, tours, and transfers in Albania',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.className} antialiased`} suppressHydrationWarning>
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
