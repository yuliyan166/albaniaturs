// Offer interface supporting both static mock data and dynamic Supabase JSONB properties
export interface Offer {
  id: string;
  title?: string | Record<string, string>;
  titles?: Record<string, string>;
  description?: string | Record<string, string>;
  descriptions?: Record<string, string>;
  price?: number;
  price_czk?: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  category?: 'accommodation' | 'car' | 'tour' | 'transfer';
  rating?: number;
  location?: string;
  [key: string]: any; // Allow index signature for dynamic Supabase fields
}

export const mockOffers: Offer[] = [];