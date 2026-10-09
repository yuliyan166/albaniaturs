// Excursions/Tours Module Data Structures
export type TourType = 'cultural' | 'adventure' | 'beach' | 'nature' | 'city' | 'food' | 'historical' | 'other';
export type DurationType = 'half_day' | 'full_day' | 'multi_day';

export interface TourService {
  included: boolean;
  description: {
    cs: string;
    en: string;
    sq: string;
  };
}

export interface Tour {
  id: string;
  hostId: string;
  category: 'tours';
  
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
  shortDescription: {
    cs: string;
    en: string;
    sq: string;
  };
  
  tourType: TourType;
  duration: DurationType;
  
  route: {
    startPoint: {
      lat: number;
      lng: number;
      name: string;
    };
    endPoint: {
      lat: number;
      lng: number;
      name: string;
    };
    waypoints: Array<{
      lat: number;
      lng: number;
      name: string;
      description: {
        cs: string;
        en: string;
        sq: string;
      };
    }>;
  };
  
  mapUrl?: string;
  
  pricing: {
    basePrice: number;
    perPerson: boolean;
    groupDiscount?: number;
    childrenPrice?: number;
  };
  
  services: {
    included: TourService[];
    excluded: TourService[];
  };
  
  availableSlots: {
    [dayOfWeek: number]: {
      times: string[];
      maxCapacity: number;
    };
  };
  
  photos: string[];
  videoUrl?: string;
  
  reviews: {
    rating: number;
    count: number;
  };
  
  status: 'pending' | 'active' | 'rejected';
  isDemo: boolean;
  createdAt: string;
}
