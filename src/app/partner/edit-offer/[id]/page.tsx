'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Star, DollarSign, Clock, AlertCircle } from 'lucide-react';

export default function EditOfferPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  // All hooks at the top — language must be defined before any conditional return
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLanguage(localStorage.getItem('albaniatours_lang') || 'en');
    }
  }, []);

  // Translation helper for category options based on selected language
  const t = (lang: string) => ({
    accommodation: lang === 'sq' ? 'Akomodim' : lang === 'cs' ? 'Ubytování' : lang === 'bg' ? 'Настаняване' : 'Accommodation',
    carRental: lang === 'sq' ? 'Makina me qera' : lang === 'cs' ? 'Autopůjčovna' : lang === 'bg' ? 'Автомобил под наем' : 'Car Rental',
    excursion: lang === 'sq' ? 'Ekskursioni' : lang === 'cs' ? 'Výlet' : lang === 'bg' ? 'Екскурзия' : 'Excursion/ Tour',
    transfer: lang === 'sq' ? 'Transfer' : lang === 'cs' ? 'Transfery' : lang === 'bg' ? 'Трансфер' : 'Transfer',
  });

  const id = params.id as string;

  const [category, setCategory] = useState('accommodation');
  const [title_en, setTitle_en] = useState('');
  const [title_cs, setTitle_cs] = useState('');
  const [desc_en, setDesc_en] = useState('');
  const [desc_cs, setDesc_cs] = useState('');
  const [price_czk, setPrice_czk] = useState<number>(500);
  const [capacity, setCapacity] = useState<number>(2);
  const [image_urls, setImage_urls] = useState<string[]>([]);
  const [departure_times, setDepartureTimes] = useState('');
  const [ical_url, setIcalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOfferData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { window.location.href = '/partner/login'; return; }

        const { data: offer, error: fetchError } = await supabase.from('properties').select('*').eq('id', id).single();
        if (fetchError || !offer) { setError('Listing not found.'); setDataLoading(false); return; }
        if (offer.host_id !== session.user.id) { setError('You do not have permission to edit this listing.'); setDataLoading(false); return; }

        setCategory(offer.category || 'accommodation');
        setTitle_en(offer.titles?.en || '');
        setTitle_cs(offer.titles?.cs || '');
        setDesc_en(offer.descriptions?.en || '');
        setDesc_cs(offer.descriptions?.cs || '');
        setPrice_czk(offer.price_czk || 500);
        setCapacity(offer.capacity || 2);
        setImage_urls(Array.isArray(offer.images) ? offer.images : (offer.image_url ? [offer.image_url] : []));
        setDepartureTimes(Array.isArray(offer.departure_times) ? offer.departure_times.join(', ') : '');
        setIcalUrl(offer.ical_url || '');
      } catch (err: any) {
        setError(err.message || 'Failed to load listing data.');
      } finally {
        setDataLoading(false);
      }
    };
    loadOfferData();
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setError('Please log in again to update this listing.'); setLoading(false); return; }

      const updatedOffer = {
        category,
        titles: { en: title_en, cs: title_cs },
        descriptions: { en: desc_en, cs: desc_cs },
        price_czk, capacity,
        images: image_urls.length > 0 ? image_urls : [],
        departure_times: (category === 'excursion' || category === 'transfer') ? departure_times.split(',').map(t => t.trim()).filter(Boolean) : null,
        ical_url: ical_url || null,
      };

      const { error: updateError } = await supabase.from('properties').update(updatedOffer).eq('id', id);
      if (updateError) { setError(updateError.message); setLoading(false); return; }
      router.push('/partner');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'cs' ? 'Načítání inzerátu...' : language === 'sq' ? 'Duke ngarkuar ofertën...' : language === 'bg' ? 'Зареждане на обявлението...' : 'Loading listing...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors">← Back to Dashboard</button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">

          {/* Basic Information Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="accommodation">{t(language).accommodation}</option>
                  <option value="car_rental">{t(language).carRental}</option>
                  <option value="excursion">{t(language).excursion}</option>
                  <option value="transfer">{t(language).transfer}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
                  <input type="text" required value={title_en} onChange={(e) => setTitle_en(e.target.value)} placeholder="e.g., Deluxe Apartment" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (CS)</label>
                  <input type="text" required value={title_cs} onChange={(e) => setTitle_cs(e.target.value)} placeholder="Např., Deluxe byt" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div className="grid grid-cols-2 gap-4">
                <textarea rows={4} required value={desc_en} onChange={(e) => setDesc_en(e.target.value)} placeholder="Describe your listing in English" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <textarea rows={4} required value={desc_cs} onChange={(e) => setDesc_cs(e.target.value)} placeholder="Popište váš inzerát v češtině" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* Pricing & Capacity Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Pricing & Capacity</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (CZK)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="number" required min={0} value={price_czk || ''} onChange={(e) => setPrice_czk(Number(e.target.value))} placeholder="500" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Price per {category === 'accommodation' ? 'night' : category === 'car_rental' ? 'day' : 'booking'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <div className="relative">
                  <Star className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="number" required min={1} value={capacity || ''} onChange={(e) => setCapacity(Number(e.target.value))} placeholder="2" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Max guests/seats/slots</p>
              </div>

              {(category === 'excursion' || category === 'transfer') && (
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Times (comma-separated)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="text" value={departure_times} onChange={(e) => setDepartureTimes(e.target.value)} placeholder="09:00, 12:00, 15:00" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Media Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Media</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
                <input type="url" value={image_urls[0] || ''} onChange={(e) => { const newUrls = [...image_urls]; if (newUrls.length === 0) newUrls.push(e.target.value); else newUrls[0] = e.target.value; setImage_urls(newUrls); }} placeholder="https://example.com/main-image.jpg" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Image 1</label>
                <input type="url" value={image_urls[1] || ''} onChange={(e) => { const newUrls = [...image_urls]; if (newUrls.length <= 1) newUrls.push(e.target.value); else newUrls[1] = e.target.value; setImage_urls(newUrls); }} placeholder="https://example.com/image2.jpg" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Image 2</label>
                <input type="url" value={image_urls[2] || ''} onChange={(e) => { const newUrls = [...image_urls]; if (newUrls.length <= 2) newUrls.push(e.target.value); else newUrls[2] = e.target.value; setImage_urls(newUrls); }} placeholder="https://example.com/image3.jpg" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">iCal URL (for availability calendar)</label>
                <input type="url" value={ical_url} onChange={(e) => setIcalUrl(e.target.value)} placeholder="https://example.com/calendar.ics" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* Submit Section */}
          <div className="pt-6 border-t">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => router.push('/partner')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (<>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>) : (<>
                  <MapPin size={18} />
                  Update Listing
                </>)}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
