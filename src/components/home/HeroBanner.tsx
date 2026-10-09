import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/providers/LanguageContext';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  const { t, language } = useLanguage();

  return (
    <div className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
      {/* Vibrant Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-teal-500 to-blue-700 opacity-90" />
        <div className="absolute inset-0 bg-[url('/images/hero-albania.jpg')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto animate-slide-up">
          {/* Hero Image */}
          <div className="mb-12 animate-fade-in-slow">
            <div className="relative w-full max-h-[400px] sm:max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 backdrop-blur-sm">
              <img
                src="/images/hero_image.png"
                alt="AlbaniaTours Hero - Discover Albania"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute top-6 right-6">
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🌟 #1 Travel Platform in Albania
                </span>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in-slow border border-white/20">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              {t?.home?.heroTitle || (language === 'cs' ? 'Vítejte v Albánii' : 'Discover Albania')}
            </h1>
            
            <div className="space-y-4 md:space-y-6">
              {t?.home?.welcomeLines ? (
                t.home.welcomeLines.map((line: string, index: number) => (
                  <p key={index} className="text-base md:text-xl text-slate-600 font-medium leading-relaxed pl-8 border-l-4 border-blue-500">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-base md:text-xl text-slate-600 font-medium leading-relaxed">
                  {t?.home?.heroSubtitle || 'Best accommodation, car rentals and tours curated by locals.'}
                </p>
              )}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-6">
              <Link
                href="/tours"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {t?.booking?.bookNow || (language === 'cs' ? 'Rezervovat' : 'Book Now')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Accommodation', icon: '🏠', color: 'bg-blue-100 text-blue-700' },
                  { label: 'Car Rental', icon: '🚗', color: 'bg-teal-100 text-teal-700' },
                  { label: 'Tours', icon: '⛰️', color: 'bg-yellow-100 text-yellow-700' },
                ].map((item) => (
                  <div key={item.label} className={`p-3 rounded-xl ${item.color} flex flex-col items-center gap-2`}>
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 opacity-75">
              {['🔒 Secure Booking', '✓ GDPR Compliant', '⭐ Top Rated', '💰 Best Price'].map((badge) => (
                <span key={badge} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
