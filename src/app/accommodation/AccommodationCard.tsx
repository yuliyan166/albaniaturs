import Link from 'next/link';
import { Hotel, MapPin, Users, Star } from 'lucide-react';
import { Accommodation } from '@/types/accommodation';

export function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {accommodation.photos.length > 0 && (
        <div className="relative h-48">
          <img 
            src={accommodation.photos[0]} 
            alt={accommodation.title.cs}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {accommodation.title.cs}
          </h3>
          {accommodation.reviews.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{accommodation.reviews.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {accommodation.address}
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Users className="w-4 h-4 mr-1" />
          {accommodation.capacity} hostů
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-xl font-bold text-red-600">
              {accommodation.pricing.basePrice} Kč
            </span>
            <span className="text-sm text-gray-500"> / noc</span>
          </div>
          <Link 
            href={`/${accommodation.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Detaily
          </Link>
        </div>
      </div>
    </div>
  );
}
