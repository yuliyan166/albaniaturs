'use server';

import { createClient } from '@/lib/supabase/server';
import { Accommodation } from '@/types/accommodation';
import { CarRental } from '@/types/carRental';

/**
 * Get all active accommodations from database
 */
export async function getAccommodations(): Promise<Accommodation[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('category', 'accommodation')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching accommodations:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getAccommodations:', err);
    return [];
  }
}

/**
 * Get all active car rentals from database
 */
export async function getCarRentals(): Promise<CarRental[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('category', 'car_rental')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching car rentals:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getCarRentals:', err);
    return [];
  }
}

/**
 * Get accommodation by ID
 */
export async function getAccommodationById(id: string): Promise<Accommodation | null> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();
    
    if (error) {
      console.error('Error fetching accommodation:', error);
      return null;
    }
    
    return data || null;
  } catch (err) {
    console.error('Error in getAccommodationById:', err);
    return null;
  }
}

/**
 * Get car rental by ID
 */
export async function getCarRentalById(id: string): Promise<CarRental | null> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();
    
    if (error) {
      console.error('Error fetching car rental:', error);
      return null;
    }
    
    return data || null;
  } catch (err) {
    console.error('Error in getCarRentalById:', err);
    return null;
  }
}

/**
 * Get tours by ID
 */
export async function getTourById(id: string): Promise<any | null> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();
    
    if (error) {
      console.error('Error fetching tour:', error);
      return null;
    }
    
    return data || null;
  } catch (err) {
    console.error('Error in getTourById:', err);
    return null;
  }
}

/**
 * Get transfers by ID
 */
export async function getTransferById(id: string): Promise<any | null> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();
    
    if (error) {
      console.error('Error fetching transfer:', error);
      return null;
    }
    
    return data || null;
  } catch (err) {
    console.error('Error in getTransferById:', err);
    return null;
  }
}

/**
 * Search accommodations by filters
 */
export async function searchAccommodations({
  location,
  checkIn,
  checkOut,
  guests
}: {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}): Promise<Accommodation[]> {
  const supabase = await createClient();
  
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('category', 'accommodation')
      .eq('status', 'active');
    
    if (location) {
      query = query.eq('address', new RegExp(location, 'i'));
    }
    
    if (guests && guests > 0) {
      query = query.eq('capacity', guests);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error searching accommodations:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in searchAccommodations:', err);
    return [];
  }
}

/**
 * Search car rentals by filters
 */
export async function searchCarRentals({
  location,
  pickupDate,
  returnDate,
  rentalDays
}: {
  location?: string;
  pickupDate?: string;
  returnDate?: string;
  rentalDays?: number;
}): Promise<CarRental[]> {
  const supabase = await createClient();
  
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('category', 'car_rental')
      .eq('status', 'active');
    
    if (location) {
      query = query.eq('address', new RegExp(location, 'i'));
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error searching car rentals:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in searchCarRentals:', err);
    return [];
  }
}
