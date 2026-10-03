'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Interface for blocking date range
 */
export interface BlockDatesParams {
  propertyId: string;
  startDate: string; // ISO format YYYY-MM-DD
  endDate: string;   // ISO format YYYY-MM-DD
  reason: string;
}

/**
 * Server Action to manually block dates for a specific property.
 * Used by hosts via the Partner Dashboard.
 */
export async function blockDates({ 
  propertyId, 
  startDate, 
  endDate, 
  reason 
}: BlockDatesParams) {
  try {
    const supabase = await createClient();

    // 1. Insert the blocked range into the database
    const { data, error } = await supabase
      .from('blocked_dates')
      .insert({
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      })
      .select();

    if (error) {
      console.error('[AvailabilityAction:blockDates] Supabase Error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    // 2. Revalidate relevant paths to reflect changes in UI
    revalidatePath('/partner'); 
    revalidatePath('/'); // Refresh home search results if necessary

    return {
      success: true,
      data: data?.[0],
      message: 'Dates blocked successfully.'
    };

  } catch (error: any) {
    console.error('[AvailabilityAction:blockDates] Critical Error:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred while blocking dates.'
    };
  }
}