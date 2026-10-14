import { Suspense } from 'react';
import { AccommodationList } from './AccommodationList';
import { AccommodationSearch } from './AccommodationSearch';
import { useLanguage } from '@/app/providers/LanguageContext';

export default function AccommodationPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          {t.nav?.accommodation}
        </h1>
        
        <AccommodationSearch />
        
        <Suspense fallback={<div>Loading...</div>}>
          <AccommodationList />
        </Suspense>
      </div>
    </div>
  );
}
