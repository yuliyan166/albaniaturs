// Transfers Module Data Structures
export type TransferLocationType = 'airport' | 'hotel' | 'city' | 'intercity';
export type VehicleType = 'sedan' | 'minivan' | 'suv' | 'limousine' | 'bus';

export interface TransferLocation {
  id: string;
  name: {
    cs: string;
    en: string;
    sq: string;
  };
  type: TransferLocationType;
  address: string;
  gps: {
    lat: number;
    lng: number;
  };
}

export interface TransferVehicle {
  type: VehicleType;
  capacity: number;
  priceMultiplier: number;
}

export interface TransferPricing {
  basePrice: number;
  perKmPrice: number;
  nightSurcharge?: number;
  waitingTimeFee?: number;
  tolls?: number;
  parking?: number;
}

export interface Transfer {
  id: string;
  hostId: string;
  category: 'transfers';
  
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
  
  locations: {
    pickup: TransferLocation;
    dropoff: TransferLocation;
  };
  
  vehicleType: VehicleType;
  vehicles: TransferVehicle[];
  
  pricing: TransferPricing;
  
  availability: {
    [date: string]: {
      available: boolean;
      times: string[];
    };
  };
  
  status: 'pending' | 'active' | 'rejected';
  isDemo: boolean;
  createdAt: string;
}
