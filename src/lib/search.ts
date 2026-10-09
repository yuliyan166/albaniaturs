// Search Logic for Albania-Turs
import { SearchParams, SearchResult } from '@/types/booking';
import { Accommodation } from '@/types/accommodation';
import { CarRental } from '@/types/carRental';
import { Tour } from '@/types/tours';
import { Transfer } from '@/types/transfers';

/**
 * Filter properties based on search parameters
 */
export function filterProperties(
  properties: (Accommodation | CarRental | Tour | Transfer)[],
  params: SearchParams
): SearchResult[] {
  return properties
    .filter((property) => {
      // Filter by category
      if (params.category) {
        if (params.category === 'accommodation') {
          properties = properties.filter(p => p.category === 'accommodation');
        } else if (params.category === 'cars') {
          properties = properties.filter(p => p.category === 'car_rental');
        } else if (params.category === 'tours') {
          properties = properties.filter(p => p.category === 'tours');
        } else if (params.category === 'transfers') {
          properties = properties.filter(p => p.category === 'transfers');
        } else {
          return [];
        }
      }
      
      // Filter by price range
      properties = properties.filter((property) => {
        let price = 0;
        
        if (property.category === 'accommodation') {
          price = (property as Accommodation).pricing.basePrice;
        } else if (property.category === 'car_rental') {
          price = (property as CarRental).pricing.dailyRate;
        } else if (property.category === 'tours') {
          price = (property as Tour).pricing.basePrice;
        } else if (property.category === 'transfers') {
          price = (property as Transfer).pricing.basePrice;
        }
        
        if (params.minPrice && price < params.minPrice) return false;
        if (params.maxPrice && price > params.maxPrice) return false;
        
        return true;
      });
      
      // Filter by location (for transfers, use route locations)
      if (params.location) {
        let locationMatch = false;
        
        if (property.category === 'transfers') {
          const transfer = property as Transfer;
          locationMatch =
            transfer.locations.pickup.address.toLowerCase().includes(params.location.toLowerCase()) ||
            transfer.locations.dropoff.address.toLowerCase().includes(params.location.toLowerCase());
        } else {
          locationMatch = (property as Accommodation).address?.toLowerCase().includes(params.location.toLowerCase());
        }
        
        if (!locationMatch) return false;
      }
      
      // Filter by capacity (guests)
      if (params.guests) {
        const capacity =
          (property as Accommodation).capacity ||
          (property as CarRental).specifications?.passengers || 0;
        
        if (capacity < params.guests!) return false;
      }
      
      return true;
    })
    .map((property) => ({
      id: property.id,
      category: property.category,
      title: property.title,
      price:
        property.category === 'accommodation' ? (property as Accommodation).pricing.basePrice :
        property.category === 'car_rental' ? (property as CarRental).pricing.dailyRate :
        property.category === 'tours' ? (property as Tour).pricing.basePrice :
        property.category === 'transfers' ? (property as Transfer).pricing.basePrice :
        0,
      rating: (property as any).reviews?.rating,
      images:
        property.category === 'accommodation' ? (property as Accommodation).photos :
        property.category === 'car_rental' ? (property as CarRental).photos :
        property.category === 'tours' ? (property as Tour).photos :
        [],
      location:
        property.category === 'transfers'
          ? `${(property as Transfer).locations.pickup.name}, ${(property as Transfer).locations.dropoff.name}`
          : (property as Accommodation).address,
      capacity:
        property.category === 'accommodation' ? (property as Accommodation).capacity :
        property.category === 'car_rental' ? (property as CarRental).specifications?.passengers :
        0,
    }));
}

/**
 * Sort search results
 */
export function sortResults(results: SearchResult[], sortBy: 'price_asc' | 'price_desc' | 'rating'): SearchResult[] {
  return [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });
}

/**
 * Calculate transfer price automatically
 */
export function calculateTransferPrice(
  transfer: Transfer,
  distanceKm: number,
  isNight: boolean = false,
  waitingTimeMinutes: number = 0,
  additionalTolls: number = 0,
  additionalParking: number = 0
): number {
  const basePrice = transfer.pricing.basePrice;
  const perKmPrice = transfer.pricing.perKmPrice;
  const nightSurcharge = isNight && transfer.pricing.nightSurcharge ? transfer.pricing.nightSurcharge : 0;
  
  const distanceCost = distanceKm * perKmPrice;
  const waitingTimeCost = waitingTimeMinutes * (transfer.pricing.waitingTimeFee || 0);
  const tolls = additionalTolls || (transfer.pricing.tolls || 0);
  const parking = additionalParking || (transfer.pricing.parking || 0);
  
  return basePrice + distanceCost + nightSurcharge + waitingTimeCost + tolls + parking;
}

/**
 * Calculate accommodation price for a stay
 */
export function calculateAccommodationPrice(
  accommodation: Accommodation,
  checkIn: string,
  checkOut: string
): number {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const nightCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  if (nightCount <= 0) return 0;
  
  // Base price calculation (simplified - would need seasonal pricing in production)
  const basePrice = accommodation.pricing.basePrice;
  const cleaningFee = accommodation.pricing.cleaningFee || 0;
  const serviceFee = accommodation.pricing.serviceFee || 0;
  
  return (basePrice * nightCount) + cleaningFee + serviceFee;
}

/**
 * Calculate car rental price
 */
export function calculateCarRentalPrice(
  car: CarRental,
  rentalDays: number
): { rentalCost: number; deposit: number; totalWithDeposit: number } {
  const dailyRate = car.pricing.dailyRate;
  const deposit = car.pricing.deposit;
  
  // Weekly discount (simplified)
  let weeklyRate = car.pricing.weeklyRate || (dailyRate * 7 * 0.9); // 10% discount
  let monthlyRate = car.pricing.monthlyRate || (dailyRate * 30 * 0.8); // 20% discount
  
  let total = 0;
  
  if (rentalDays >= 30) {
    total = monthlyRate + (dailyRate * (rentalDays % 30));
  } else if (rentalDays >= 7) {
    total = weeklyRate + (dailyRate * (rentalDays % 7));
  } else {
    total = dailyRate * rentalDays;
  }
  
  return {
    rentalCost: total,
    deposit: deposit,
    totalWithDeposit: total + deposit,
  };
}

/**
 * Available time slot checker for tours
 */
export function checkTourAvailability(
  tour: Tour,
  date: string,
  preferredTime?: string
): boolean {
  const dayOfWeek = new Date(date).getDay();
  const daySlots = tour.availableSlots[dayOfWeek];
  
  if (!daySlots) return false;
  
  if (!preferredTime) return true; // Any time is available
  
  return daySlots.times.includes(preferredTime) && 
         daySlots.times.length < daySlots.maxCapacity;
}
