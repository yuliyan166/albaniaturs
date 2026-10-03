'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/providers/LanguageContext';

export interface Offer {
  id: string;
  title: string | Record<string, string>;
  description?: string | Record<string, string>;
  category?: string;
  price?: number;
  imageUrl?: string;
  images?: string[];
  [key: string]: any;
}

export default function OfferCard(props: any) {
  const { t, language } = useLanguage();

  const offer = props.offer || props;
  const { id, title, description, category, price, imageUrl, images } = offer;

  // 1. Safe Image extraction
  const mainImageUrl = imageUrl || (Array.isArray(images) && images[0]) || '/images/hero_image.png';

  // 2. Safe Dynamic Title Resolution (fixes Vercel TS build error)
  let safeTitle = '';
  if (typeof title === 'string') {
    safeTitle = title;
  } else if (title && typeof title === 'object') {
    safeTitle = title[language] || title['cs'] || title['en'] || 'Offer';
  } else {
    safeTitle = 'Offer';
  }

  // Handle mock fallback translations for hardcoded English strings
  if (safeTitle === 'Luxury Apartment with View') {
    if (language === 'cs') safeTitle = 'Luxusní apartmán s výhledem';
    if (language === 'bg') safeTitle = 'Луксозен апартамент с гледка';
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
    if (language === 'bg') safeDescription = 'Прекрасно място за настаняване в сърцето на Албания.';
    if (language === 'sq') safeDescription = 'Hapësirë e bukur akomodimi në zemër të Shqipërisë.';
  }

  // 4. Safe Category Resolution (fixes toLowerCase runtime crash)
  const safeCategoryStr = typeof category === 'string' ? category : '';
  const categoryKey = safeCategoryStr.toLowerCase().trim();
  const translatedCategory =
    t?.categories?.[categoryKey as keyof typeof t.categories] || safeCategoryStr || 'Tour';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col hover:shadow-lg transition-shadow group">
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={mainImageUrl}
          alt={safeTitle}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm z-10">
          {translatedCategory}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {safeTitle}
          </h3>
          {safeDescription && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {safeDescription}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">
              {t?.common?.pricePerNight || 'Cena za noc'}
            </span>
            <span className="text-lg font-extrabold text-gray-900">
              {(offer?.price_czk ?? offer?.price ?? price ?? 0)} CZK
            </span>
          </div>

          <Link
            href={`/tours/${id || ''}`}
            className="px-4 py-2 bg-slate-900 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            {t?.booking?.bookNow || 'Rezervovat'}
          </Link>
        </div>
      </div>
    </div>
  );
}
