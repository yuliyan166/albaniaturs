// Accommodation Module Data Structures
export type AccommodationType = 'apartment' | 'house' | 'villa' | 'hotel' | 'guesthouse' | 'other';

export interface AccommodationAmenity {
  id: string;
  icon: string;
  cs: string;
  en: string;
  sq: string;
}

export interface AccommodationPricingRules {
  basePrice: number;
  seasonalPrices: {
    [season: string]: {
      startDate: string;
      endDate: string;
      price: number;
    };
  };
  minimumStay: number;
  cleaningFee?: number;
  serviceFee?: number;
}

export interface Accommodation {
  id: string;
  hostId: string;
  category: 'accommodation';
  
  // Multi-language fields
  title: {
    cs: string;
    en: string;
    sq: string;
    [key: string]: string;
  };
  description: {
    cs: string;
    en: string;
    sq: string;
    [key: string]: string;
  };
  
  address: string;
  gps: {
    lat: number;
    lng: number;
  };
  
  type: AccommodationType;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  
  photos: string[];
  videoUrl?: string;
  
  amenities: AccommodationAmenity[];
  
  pricing: AccommodationPricingRules;
  cancellationPolicy: 'free' | 'moderate' | 'strict' | 'superStrict';
  
  icalUrl?: string;
  reviews: {
    rating: number;
    count: number;
    reviews: Array<{
      id: string;
      customerId: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
  
  availabilityCalendar: {
    [date: string]: {
      available: boolean;
      price?: number;
    };
  };
  
  status: 'pending' | 'active' | 'rejected';
  isDemo: boolean;
  createdAt: string;
}
