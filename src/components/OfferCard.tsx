'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/providers/LanguageContext';
import { Star, MapPin, Users } from 'lucide-react';

export interface Offer {
  id: string;
  title: string | Record<string, string>;
  description?: string | Record<string, string>;
  category?: string;
  price?: number;
  imageUrl?: string;
  images?: string[];
  reviews?: { rating?: number; count?: number };
  location?: string;
  capacity?: number;
  [key: string]: any;
}

export default function OfferCard(props: any) {
  const { t, language } = useLanguage();

  const offer = props.offer || props;
  const { id, title, description, category, price, imageUrl, images, reviews, location, capacity } = offer;

  // 1. Safe Image extraction
  const mainImageUrl = imageUrl || (Array.isArray(images) && images[0]) || '/images/hero_image.png';

  // 2. Safe Dynamic Title Resolution
  let safeTitle = '';
  if (typeof title === 'string') {
    safeTitle = title;
  } else if (title && typeof title === 'object') {
    safeTitle = title[language] || title['cs'] || title['en'] || 'Offer';
  } else {
    safeTitle = 'Offer';
  }

  // Handle mock fallback translations
  if (safeTitle === 'Luxury Apartment with View') {
    if (language === 'cs') safeTitle = 'Luxusní apartmán s výhledem';
    if (language === 'sq') safeTitle = ' Apartament luksoz me pamje';
  }

  // 3. Safe Dynamic Description Resolution
  let safeDescription = '';
  if (typeof description === 'string') {
    safeDescription = description;
  } else if (description && typeof description === 'object') {
    safeDescription = description[language] || description['cs'] || description['en'] || '';
  }

  if (safeDescription === 'Luxury Apartment with View') {
    if (language === 'cs') safeDescription = 'Krásný ubytovací prostor v srdci Albánie.';
    if (language === 'sq') safeDescription = 'Hapësirë e bukur akomodimi në zemër të Shqipërisë.';
  }

  // 4. Safe Category Resolution
  const safeCategoryStr = typeof category === 'string' ? category : '';
  const categoryKey = safeCategoryStr.toLowerCase().trim();
  const translatedCategory =
    t?.categories?.[categoryKey as keyof typeof t.categories] || safeCategoryStr || 'Tour';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-50/50 flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden">
        <Image
          src={mainImageUrl}
          alt={safeTitle}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg z-10">
          {translatedCategory}
        </span>

        {/* Rating Badge */}
        {reviews?.rating && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg z-10 flex items-center gap-1">
            <Star className="text-yellow-500 w-4 h-4 fill-current" />
            <span className="text-xs font-bold text-slate-900">{reviews.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-bold text-slate-900 line-clamp-2">
              {safeTitle}
            </h3>
          </div>
          
          {safeDescription && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {safeDescription}
            </p>
          )}

          {/* Location & Capacity */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="truncate max-w-[150px]">{location || 'Tirana, Albania'}</span>
            </div>
            
            {capacity && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Users className="w-4 h-4 text-teal-500" />
                <span>{capacity} guests</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-blue-50/50 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {t?.common?.pricePerNight || 'Price per night'}
            </span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              {(offer?.price_czk ?? offer?.price ?? price ?? 0)} CZK
            </span>
          </div>

          <Link
            href={`/${id || ''}`}
            className="grouprelative px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t?.booking?.bookNow || 'Book Now'}
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
