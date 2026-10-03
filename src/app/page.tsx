'use client';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/app/providers/LanguageContext';
import { mockOffers } from '@/data/mockOffers';
import OfferCard from '@/components/OfferCard';
import { HeroBanner } from '@/components/home/HeroBanner';
import { createClient } from '@/lib/supabase/client';

// Force dynamic rendering to prevent Vercel stale cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  const { t, language } = useLanguage();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOffers() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;

        if (!data || data.length === 0) {
          // Fallback to mock data if DB is empty but no error occurred
          setOffers(mockOffers);
        } else {
          const translatedOffers = data.map(offer => ({
            ...offer,
            title: offer.titles?.[language] || offer.titles?.['en'] || 'Untitled',
            description: offer.descriptions?.[language] || offer.descriptions?.['en'] || '',
          }));
          setOffers(translatedOffers);
        }
      } catch (err) {
        console.error('Supabase fetch error, using mock data:', err);
        setOffers(mockOffers);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, [language, supabase]);

  return (
    <div className="min-h-screen bg-slate-50">
      <HeroBanner />

      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-black text-slate-900 mb-2">{t.common?.offersTitle || 'Our Offers'}</h2>
            <p className="text-gray-500">{t.home?.heroSubtitle || 'Hand-picked premium experiences for your perfect trip.'}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['accommodation', 'car', 'tour', 'transfers'] as const).map((cat) => (
              <button key={cat} className="whitespace-nowrap rounded-full bg-white border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:border-red-600 hover:text-red-600 transition-all">
                {t.categories[cat]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t.common?.offersTitle || 'No offers found'}</h3>
            <p className="text-gray-500">{t.partner?.basicInfo || "We're currently updating our curated list. Please check back soon!"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}