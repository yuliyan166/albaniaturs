import Link from 'next/link';
import { Car, Users, MapPin, Star } from 'lucide-react';
import { CarRental } from '@/types/carRental';
import { useLanguage } from '@/app/providers/LanguageContext';

export function CarRentalCard({ car }: { car: CarRental }) {
  const { t, language } = useLanguage();
  
  const title = car.title[language] || car.title.cs || 'Car Rental';
  const location = t.common?.locationTirana || 'Tirana, Albania';
  const guests = t.booking?.guests || 'guests';
  const pricePerNight = t.common?.pricePerNight || 'Price per night';
  const details = t.common?.detail || 'Detail';
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {car.photos.length > 0 && (
        <div className="relative h-48">
          <img
            src={car.photos[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {car.brand} {car.model}
          </h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Users className="w-4 h-4 mr-1" />
          {car.specifications.passengers} {guests}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-xl font-bold text-red-600">
              {car.pricing.dailyRate} CZK
            </span>
            <span className="text-sm text-gray-500"> / {pricePerNight.toLowerCase().split(' ')[0]}</span>
          </div>
          <Link
            href={`/${car.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {details}
          </Link>
        </div>
      </div>
    </div>
  );
}
