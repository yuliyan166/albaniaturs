// Car Rental Module Data Structures
export type TransmissionType = 'manual' | 'automatic';
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'other';
export type CarClass = 'economy' | 'compact' | 'intermediate' | 'standard' | 'premium' | 'luxury' | 'suv' | 'van';

export interface CarRental {
  id: string;
  hostId: string;
  category: 'car_rental';
  
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
  
  brand: string;
  model: string;
  year: number;
  carClass: CarClass;
  
  specifications: {
    transmission: TransmissionType;
    fuel: FuelType;
    ac: boolean;
    doors: number;
    luggageCapacity: number;
    passengers: number;
  };
  
  photos: string[];
  
  pricing: {
    dailyRate: number;
    weeklyRate?: number;
    monthlyRate?: number;
    deposit: number;
    insurance: {
      basic: number;
      comprehensive: number;
    };
  };
  
  availabilityCalendar: {
    [date: string]: {
      available: boolean;
      price?: number;
    };
  };
  
  documents: {
    electronicAgreementUrl?: string;
    driverLicenseCheck: boolean;
  };
  
  status: 'pending' | 'active' | 'rejected';
  isDemo: boolean;
  createdAt: string;
}
