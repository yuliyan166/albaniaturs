// Common Booking Types
export interface SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  amenities?: string[];
  ratings?: number;
}

export interface SearchResult {
  id: string;
  category: string;
  title: {
    cs: string;
    en: string;
    sq: string;
  };
  price: number;
  rating?: number;
  images: string[];
  location?: string;
  capacity?: number;
}

export interface BookingDetails {
  id?: string;
  propertyId: string;
  customerId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes?: string;
}

export interface BookingQuote {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  basePrice: number;
  taxes: number;
  discount: number;
  total: number;
  currency: 'CZK';
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  response?: {
    comment: string;
    date: string;
  };
}
