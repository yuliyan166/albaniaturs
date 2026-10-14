'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageContext';

export function AccommodationSearch() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">{t.home?.searchAccommodationTitle || 'Vyhledání ubytování'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.categories?.accommodation || 'Location'}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t.common?.search || 'Enter location...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchParams.location}
              onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.booking?.arrival || 'Arrival'}
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchParams.checkIn}
            onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.booking?.departure || 'Departure'}
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchParams.checkOut}
            onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.booking?.guests || 'Guests'}
          </label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchParams.guests}
            onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
        {t.booking?.bookNow || 'Search'}
      </button>
    </div>
  );
}
