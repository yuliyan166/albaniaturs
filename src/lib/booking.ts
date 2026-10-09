// Booking Logic for Albania-Turs
import { BookingDetails, BookingQuote, Review } from '@/types/booking';
import { Accommodation } from '@/types/accommodation';
import { CarRental } from '@/types/carRental';
import { Tour } from '@/types/tours';
import { Transfer } from '@/types/transfers';
import { calculateTransferPrice, calculateAccommodationPrice, calculateCarRentalPrice } from './search';

/**
 * Book Accommodation
 */
export async function bookAccommodation(
  accommodation: Accommodation,
  details: BookingDetails
): Promise<BookingQuote> {
  const totalPrice = calculateAccommodationPrice(
    accommodation,
    details.checkIn,
    details.checkOut
  );
  
  const platformFee = totalPrice * 0.1; // 10% platform fee
  const partnerAmount = totalPrice - platformFee;
  
  return {
    propertyId: accommodation.id,
    checkIn: details.checkIn,
    checkOut: details.checkOut,
    guests: details.guests,
    basePrice: totalPrice,
    taxes: platformFee,
    discount: 0,
    total: totalPrice,
    currency: 'CZK',
  };
}

/**
 * Book Car Rental
 */
export async function bookCarRental(
  car: CarRental,
  rentalDays: number
): Promise<BookingQuote> {
  const pricing = calculateCarRentalPrice(car, rentalDays);
  
  const platformFee = pricing.rentalCost * 0.12; // 12% platform fee
  const partnerAmount = pricing.rentalCost - platformFee;
  
  return {
    propertyId: car.id,
    checkIn: '', // Will be set by user
    checkOut: '', // Will be set by user
    guests: car.specifications.passengers,
    basePrice: pricing.rentalCost,
    taxes: platformFee,
    discount: 0,
    total: pricing.totalWithDeposit,
    currency: 'CZK',
  };
}

/**
 * Book Tour
 */
export async function bookTour(
  tour: Tour,
  date: string,
  time: string,
  guests: number
): Promise<BookingQuote> {
  const basePrice = tour.pricing.perPerson ? tour.pricing.basePrice * guests : tour.pricing.basePrice;
  
  // Apply group discount if applicable
  const groupDiscount = guests >= 5 && tour.pricing.groupDiscount ? 
    basePrice * (tour.pricing.groupDiscount / 100) : 0;
  
  const finalPrice = basePrice - groupDiscount;
  
  const platformFee = finalPrice * 0.15; // 15% platform fee
  const partnerAmount = finalPrice - platformFee;
  
  return {
    propertyId: tour.id,
    checkIn: date,
    checkOut: date,
    guests,
    basePrice: finalPrice,
    taxes: platformFee,
    discount: groupDiscount,
    total: finalPrice,
    currency: 'CZK',
  };
}

/**
 * Book Transfer
 */
export async function bookTransfer(
  transfer: Transfer,
  pickupDate: string,
  pickupTime: string,
  distanceKm: number,
  isNight: boolean = false
): Promise<BookingQuote> {
  const totalPrice = calculateTransferPrice(
    transfer,
    distanceKm,
    isNight
  );
  
  const platformFee = totalPrice * 0.08; // 8% platform fee
  const partnerAmount = totalPrice - platformFee;
  
  return {
    propertyId: transfer.id,
    checkIn: `${pickupDate}T${pickupTime}`,
    checkOut: '', // One-way
    guests: transfer.vehicles.find(v => v.type === transfer.vehicleType)?.capacity || 4,
    basePrice: totalPrice,
    taxes: platformFee,
    discount: 0,
    total: totalPrice,
    currency: 'CZK',
  };
}

/**
 * Submit review for a property
 */
export async function submitReview(
  propertyId: string,
  customerId: string,
  customerName: string,
  rating: number,
  comment: string
): Promise<Review> {
  const review: Review = {
    id: `review-${Date.now()}`,
    customerId,
    customerName,
    rating,
    comment,
    date: new Date().toISOString().split('T')[0],
  };
  
  // In a real app, save to database
  return review;
}

/**
 * Cancel booking (with refund calculation based on cancellation policy)
 */
export function cancelBooking(
  property: Accommodation | CarRental | Tour | Transfer,
  bookingDate: string,
  cancellationDate: Date
): { refundAmount: number; cancellationFee: number } {
  const daysUntilBooking = new Date(bookingDate).getTime() - cancellationDate.getTime();
  const days = daysUntilBooking / (1000 * 3600 * 24);
  
  let cancellationFee = 0;
  
  // Check cancellation policy
  if ('cancellationPolicy' in property) {
    const policy = property.cancellationPolicy;
    
    switch (policy) {
      case 'free':
        cancellationFee = 0;
        break;
      case 'moderate':
        if (days < 7) {
          cancellationFee = 0.5; // 50% fee
        } else {
          cancellationFee = 0;
        }
        break;
      case 'strict':
        if (days < 14) {
          cancellationFee = 1; // 100% fee
        } else if (days < 30) {
          cancellationFee = 0.5; // 50% fee
        } else {
          cancellationFee = 0.1; // 10% fee
        }
        break;
      case 'superStrict':
        if (days < 48) { // 2 days
          cancellationFee = 1; // 100% fee
        } else {
          cancellationFee = 0.5; // 50% fee
        }
        break;
    }
  } else {
    // Default to moderate for other types
    if (days < 7) {
      cancellationFee = 0.5;
    } else {
      cancellationFee = 0;
    }
  }
  
  // Calculate refund (simplified)
  const totalPaid = 1000; // Would come from actual booking data
  const refundAmount = totalPaid * (1 - cancellationFee);
  
  return {
    refundAmount,
    cancellationFee: totalPaid - refundAmount,
  };
}
