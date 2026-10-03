import { NextRequest, NextResponse } from 'next/server';
import { parseICS } from 'node-ical';
import { createClient } from '@/lib/supabase/server';

/**
 * Synchronizes external iCal feed with the `blocked_dates` table in Supabase.
 * This implementation ensures that only iCal-synced dates are managed, 
 * preserving manual or maintenance blocks.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('offerId'); // Mapping offerId param to property_id column
  const icalUrl = searchParams.get('url');

  if (!propertyId || !icalUrl) {
    return NextResponse.json(
      { error: 'Missing parameters: require `offerId` and `url`' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(icalUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal feed. Status: ${response.status}`);
    }

    const text = await response.text();
    
    // Parse iCal using node-ical
    const calendar = parseICS(text);
    const events = Object.values(calendar).filter(
      (item) => item.type === 'VEVENT'
    ) as Array<{ start: Date; end: Date; summary?: string }>;

    if (!events || events.length === 0) {
      return NextResponse.json({ 
        success: true, 
        count: 0, 
        message: 'No valid VEVENT entries found in iCal.' 
      });
    }

    // Format dates for Supabase DATE type (YYYY-MM-DD)
    const blockedDates = events.map((event) => ({
      property_id: propertyId,
      start_date: event.start.toISOString().split('T')[0],
      end_date: event.end.toISOString().split('T')[0],
      reason: 'ical_sync',
    }));

    const supabase = await createClient();

    /**
     * DUPLICATE PREVENTION & ATOMICITY:
     * Instead of wiping all blocked dates, we only remove previous iCal syncs 
     * for this specific property. This avoids duplicates and preserves manual blocks.
     */
    const { error: deleteError } = await supabase
      .from('blocked_dates')
      .delete()
      .eq('property_id', propertyId)
      .eq('reason', 'ical_sync');

    if (deleteError) throw new Error(`Failed to clear previous syncs: ${deleteError.message}`);

    if (blockedDates.length > 0) {
      const { error: insertError } = await supabase
        .from('blocked_dates')
        .insert(blockedDates);

      if (insertError) throw new Error(`Supabase insert failed: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      count: blockedDates.length,
      message: 'Successfully synced iCal with Supabase.',
    });
  } catch (e: any) {
    console.error('[sync-ical] Error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown server error' },
      { status: 500 }
    );
  }
}