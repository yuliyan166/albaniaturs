import { Metadata } from 'next';

// Default metadata
export const siteMetadata: Metadata = {
  title: 'AlbaniaTours - Discover Hidden Treasures of Albania',
  description: 'Book accommodations, car rentals, tours, and transfers in Albania. Your trusted guide for an unforgettable vacation.',
  keywords: 'Albania, tours, accommodation, car rental, transfers, AlbaniaTours',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://albania-turs.com',
    siteName: 'AlbaniaTours',
    title: 'AlbaniaTours - Discover Hidden Treasures of Albania',
    description: 'Book accommodations, car rentals, tours, and transfers in Albania. Your trusted guide for an unforgettable vacation.',
    images: [
      {
        url: 'https://albania-turs.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AlbaniaTours - Discover Albania',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@albaniatours',
    title: 'AlbaniaTours - Discover Hidden Treasures of Albania',
    description: 'Book accommodations, car rentals, tours, and transfers in Albania',
    images: ['https://albania-turs.com/images/og-image.jpg'],
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
    yandex: 'YOUR_YANDEX_VERIFICATION',
  },
};

// Dynamic metadata generator
export function generateMetadataForPage({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug?: string;
}): Metadata {
  return {
    title: `${title} | AlbaniaTours`,
    description,
    keywords: `Albania, ${title}, tours, accommodation, car rental, ${slug || ''}`,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://albania-turs.com/${slug || ''}`,
      title: `${title} | AlbaniaTours`,
      description,
      images: [
        {
          url: 'https://albania-turs.com/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${title} | AlbaniaTours`,
        },
      ],
    },
  };
}
