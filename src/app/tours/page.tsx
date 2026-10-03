'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/providers/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Filter, SlidersHorizontal, MapPin, Calendar, Star } from 'lucide-react';
import OfferCard from '@/components/OfferCard';
import { translations } from '@/lib/translations';
import { Offer } from '@/data/mockOffers';

// Category options for filtering
const CATEGORIES = [
  { id: 'all', labelKey: 'categories.all' },
  { id: 'accommodation', labelKey: 'categories.accommodation' },
  { id: 'car_rental', labelKey: 'categories.carRental' },
  { id: 'excursion', labelKey: 'categories.excursion' },
  { id: 'transfer', labelKey: 'categories.transfer' }
];

// Price range options
const PRICE_RANGES = [
  { id: 'all', labelKey: 'price.all' },
  { id: 'low', labelKey: 'price.lowToHigh' },
  { id: 'high', labelKey: 'price.highToLow' }
];

export default function ToursPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceSort, setPriceSort] = useState('low');
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t: any = translations[language as keyof typeof translations] || translations.en;
  const supabase = createClient();

  // Helper to get label from constant by key
  const getCategoryOptionLabel = (labelKey: string) => {
    return t.categories?.[labelKey as keyof typeof t.categories] || labelKey;
  };

  const getPriceOptionLabel = (labelKey: string) => {
    return t.price?.[labelKey as keyof typeof t.price] || labelKey;
  };

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data: listingsData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      
      setListings(listingsData || []);
      setFilteredListings(listingsData || []);

    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort listings
  useEffect(() => {
    let result = [...listings];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Price sorting
    if (priceSort === 'low') {
      result.sort((a, b) => (a.price_czk || 0) - (b.price_czk || 0));
    } else if (priceSort === 'high') {
      result.sort((a, b) => (b.price_czk || 0) - (a.price_czk || 0));
    }

    setFilteredListings(result);
  }, [selectedCategory, priceSort, listings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common?.detail || 'Loading listings...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.home?.heroTitle || 'Explore Albania'}</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t.home?.heroSubtitle || 'Discover perfect accommodations, car rentals, excursions, and airport transfers for your Czech trip to Albania'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 sticky top-24 z-10">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">{t.common?.offersTitle || 'Filters'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.categories?.accommodation || 'Category'}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{getCategoryOptionLabel(cat.labelKey)}</option>
                ))}
              </select>
            </div>

            {/* Price Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking?.duration || 'Price Sorting'}</label>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {PRICE_RANGES.map(range => (
                  <option key={range.id} value={range.id}>{getPriceOptionLabel(range.labelKey)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
            <SlidersHorizontal size={16} />
            <span>{filteredListings.length} listings</span>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <OfferCard key={listing.id} offer={listing as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">{t.common?.offersTitle || 'No listings found'}</h3>
            <p className="text-gray-500 mt-1">
              {t.partner?.listingNotFound || 'Try adjusting your filters or check back later for new offerings'}
            </p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} AlbaniaTours. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
