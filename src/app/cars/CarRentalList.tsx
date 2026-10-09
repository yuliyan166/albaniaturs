import { getCarRentals } from '@/actions/bookingActions';
import { CarRentalCard } from './CarRentalCard';
import { CarRentalSearch } from './CarRentalSearch';

export async function CarRentalList() {
  const carRentals = await getCarRentals();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {carRentals?.map((car) => (
        <CarRentalCard key={car.id} car={car} />
      ))}
    </div>
  );
}
