import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/providers/LanguageContext';

export function HeroBanner() {
  const { t, language } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* 1. BALANCED UNCROPPED BANNER CONTAINER */}
      <div className="w-full max-h-[260px] sm:max-h-[320px] rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100 flex items-center justify-center mx-auto">
        <img
          src="/images/hero_image.png"
          alt="AlbaniaTours Hero"
          className="w-full h-full max-h-[260px] sm:max-h-[320px] object-contain block"
        />
      </div>

      {/* 2. BALANCED MODERN CARD BELOW */}
      <div className="bg-gradient-to-b from-gray-900 to-slate-800 rounded-2xl p-5 sm:p-6 text-center max-w-2xl mx-auto shadow-lg border border-gray-700/50 space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t?.home?.heroTitle || (language === 'bg' ? 'Открийте Албания' : 'Objevte Albánsko')}
        </h1>
        <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed max-w-xl mx-auto">
          {t?.home?.heroSubtitle || (language === 'bg' ? 'Най-добрите места за настаняване, коли под наем и турове.' : 'Nejlepší ubytování, autopůjčovny a výlety kurátorem místních.')}
        </p>
        <div className="pt-1">
          <Link
            href="/tours"
            className="inline-flex items-center justify-center px-8 py-2.5 border border-transparent text-sm sm:text-base font-bold rounded-xl text-white bg-red-600 hover:bg-red-500 transition-all shadow-md hover:shadow-red-600/30 hover:scale-105 transform duration-150"
          >
            {t?.booking?.bookNow || (language === 'bg' ? 'Резервирай' : 'Rezervovat')}
          </Link>
        </div>
      </div>
    </div>
  );
}
