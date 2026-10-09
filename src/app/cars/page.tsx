import { Suspense } from 'react';
import { CarRentalList } from './CarRentalList';
import { CarRentalSearch } from './CarRentalSearch';

export default function CarRentalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Půjčovna aut v Albánii
        </h1>
        
        <CarRentalSearch />
        
        <Suspense fallback={<div>Loading...</div>}>
          <CarRentalList />
        </Suspense>
      </div>
    </div>
  );
}
