import { Suspense } from 'react';
import { AccommodationCard } from './AccommodationCard';
import { AccommodationSearch } from './AccommodationSearch';
import { getAccommodations } from '@/actions/bookingActions';

export async function AccommodationList() {
  const accommodations = await getAccommodations();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accommodations?.map((accommodation) => (
        <AccommodationCard key={accommodation.id} accommodation={accommodation} />
      ))}
    </div>
  );
}
