'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/app/providers/LanguageContext';
import { mockOffers } from '@/data/mockOffers';
import OfferCard from '@/components/OfferCard';
import { HeroBanner } from '@/components/home/HeroBanner';
import { createClient } from '@/lib/supabase/client';
import {
  Blockchain,
  Brain,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gem
} from 'lucide-react';

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
            <p className="text-gray-500">{t.partner?.listingNotFound || "We're currently updating our curated list. Please check back soon!"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}

        {/* ===== Digital Ecosystem Section ===== */}
        <section className="bg-white rounded-3xl shadow-md border border-gray-200 py-16 px-6 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-6">
                <Blockchain size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {t.common?.offersTitle || 'The Future of Travel: Our Digital Ecosystem'}
              </h2>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                {t.home?.heroSubtitle || 'Integrating Blockchain and AI to redefine the tourism experience.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: InternalEfficiency,
                  title: t.partner?.addListingSubtitle || 'Internal Efficiency',
                  description: 'Streamlined payments for strategic partners and staff.',
                  color: 'from-blue-400 to-cyan-400'
                },
                {
                  icon: ClientRewards,
                  title: t.partner?.editListingTitle || 'Client Rewards',
                  description: 'Exclusive credits for curated holiday packages.',
                  color: 'from-purple-400 to-pink-400'
                },
                {
                  icon: AIExperience,
                  title: t.partner?.pricingCapacity || 'AI-Driven Experience',
                  description: 'Future integration of AI agents for autonomous booking and settlement.',
                  color: 'from-emerald-400 to-green-400'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} mb-4`}>
                    <item.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Closed-Loop Economy</h4>
                    <p className="text-sm text-gray-600">A dedicated internal settlement system ensuring seamless, stable transactions between all stakeholders.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles size={24} className="text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">1:1 Stability & Transparency</h4>
                    <p className="text-sm text-gray-600">Every utility token represents a real tourism service, providing price predictability and operational clarity.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <span className="text-lg font-semibold text-red-600 inline-flex items-center gap-2">
                Our Digital Ecosystem
                <ArrowRight size={20} />
              </span>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                {t.partner?.listingNotFound || 'The future of travel begins here. Access the seamless ecosystem that powers Albania Tours.'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Icon components for feature points
function InternalEfficiency({ size }: { size: number }) {
  return <Blockchain size={size} />;
}

function ClientRewards({ size }: { size: number }) {
  return <Gem size={size} />;
}

function AIExperience({ size }: { size: number }) {
  return <Brain size={size} />;
}
