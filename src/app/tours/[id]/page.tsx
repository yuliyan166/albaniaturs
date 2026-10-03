'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/app/providers/LanguageContext';
import { translations } from '@/lib/translations';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Calendar, Users, Phone, Mail, ArrowLeft, CheckCircle, Image as ImageIcon } from 'lucide-react';

// Force dynamic rendering to prevent Vercel stale cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  if (!images || images.length === 0) return null;
  
  const mainImage = images[0];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="relative h-72 md:h-96 w-full overflow-hidden bg-slate-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <ImageIcon size={64} />
          </div>
        )}
      </div>

      {hasMultipleImages && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-3 border-t border-gray-100 bg-slate-50">
          {images.slice(0, 8).map((img, idx) => (
            <div key={idx} className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group transition-transform hover:scale-105">
              <Image
                src={img}
                alt={`Photo ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
              />
            </div>
          ))}
          {images.length > 8 && (
            <div className="aspect-square flex items-center justify-center rounded-lg bg-gray-200 text-sm font-medium text-gray-600">
              +{images.length - 8}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { language } = useLanguage();
  const t: any = translations[language as keyof typeof translations] || translations.en;
  const supabase = createClient();
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);

  const hasVideo = (listing as any)?.data?.video_url || (listing as any)?.video_url;

  const nights = useMemo(() => {
    if (!listing) return 1;
    if (listing.category !== 'accommodation') return 1;
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diffTime > 0 ? diffTime : 1;
  }, [listing, startDate, endDate]);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const { data: listingData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setListing(listingData);
    } catch (err: any) {
      console.error('Error fetching listing:', err);
      setError(t.common?.detail || 'Detail');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, Record<string, string>> = {
      accommodation: { cs: 'Byty a domy', en: 'Apartments & Houses', sq: 'Akomodim', bg: 'Настаняване' },
      car_rental: { cs: 'Půjčovny aut', en: 'Car Rental', sq: 'Me qera makina', bg: 'Автомобил под наем' },
      excursion: { cs: 'Výlety a turistika', en: 'Excursions & Tours', sq: 'Turizëm', bg: 'Екскурзии' },
      transfer: { cs: 'Letecké přesuny', en: 'Airport Transfers', sq: 'Transferime', bg: 'Трансфери' }
    };
    return labels[category]?.[language] || category;
  };

  // Dynamic title fallbacks based on language
  const getFallbackTitle = () => {
    if (language === 'cs') return 'Luxusní apartmán s výhledem';
    if (language === 'bg') return 'Луксозен апартамент с гледка';
    if (language === 'sq') return 'Apartament luksoz me pamje';
    return 'Luxury Apartment with View';
  };

  // Amenities localization
  const getAmenities = () => {
    const baseAmenities = ['Wi-Fi', 'Air Conditioning', 'Parking', 'Kitchen', 'Water Saving', 'Invitations'];
    
    if (language === 'cs') {
      return ['Wi-Fi', 'Klimatizace', 'Parkování', 'Kuchyně', 'Úspora vody', 'Pozvánky'];
    }
    if (language === 'bg') {
      return ['Интернет', 'Климатизация', 'Паркинг', 'Кухня', 'Запазване на вода', 'Покани'];
    }
    if (language === 'sq') {
      return ['Wi-Fi', 'Klimatizim', 'Parkim', 'Bazhmakinje', 'Ruajtja e ujit', 'Ftesa'];
    }
    return baseAmenities;
  };

  // Section header localization
  const getSectionTitle = (type: string) => {
    if (type === 'description') {
      if (language === 'cs') return 'Popis';
      if (language === 'bg') return 'Описание';
      if (language === 'sq') return 'Përshkrimi';
      return 'Description';
    }
    if (type === 'amenities') {
      if (language === 'cs') return 'Vybavení';
      if (language === 'bg') return 'Удобства';
      if (language === 'sq') return 'Aksesori';
      return 'Amenities';
    }
    if (type === 'location') {
      if (language === 'cs') return 'Lokalita';
      if (language === 'bg') return 'Местоположение';
      if (language === 'sq') return 'Vendndodhja';
      return 'Location';
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t.errorRegister || 'Error'}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/tours" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <ArrowLeft size={18} />
            {t.partner?.backToDashboard || 'Back'}
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const title = listing.titles?.[language] || listing.titles?.en || listing.titles?.cs || getFallbackTitle();
  const description = listing.descriptions?.[language] || listing.descriptions?.en || listing.descriptions?.cs || '';

  // Price from property
  const priceCZK = (listing as any).price_czk ?? listing.price ?? 500;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/tours" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <ArrowLeft size={18} />
            {t.partner?.backToDashboard || 'Back'}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">{t.footer?.home || 'Home'}</Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-blue-600">{t.partner?.addListingSubtitle?.split(' ')[0] || 'All Listings'}</Link>
          <span>/</span>
          <span className="text-gray-900">{title}</span>
        </nav>

        {listing.images && listing.images.length > 0 && (
          <PropertyGallery images={listing.images} title={title} />
        )}

        {hasVideo && (
          <div className="mb-8">
            <video controls src={(listing as any).data?.video_url || (listing as any).video_url} className="w-full h-64 md:h-96 rounded-2xl object-cover shadow-sm" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
              
              {/* Location & Rating (if available) */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={20} />
                  <span>{t.common?.locationTirana || 'Albania'}</span>
                </div>

                {listing.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={20} fill="currentColor" />
                    <span className="font-bold">{listing.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                {listing.capacity && (
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Users size={16} />
                    <span>{listing.capacity} {t.common?.detail || 'guests'}</span>
                  </div>
                )}
                
                {listing.departure_times && (
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Calendar size={16} />
                    <span>{getSectionTitle('departure')} {listing.departure_times.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{getSectionTitle('description')}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>

            {/* Amenities (if any) */}
            {listing.category === 'accommodation' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{getSectionTitle('amenities')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getAmenities().map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle size={18} className="text-green-500" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <h2 className="text-xl font-semibold text-gray-900 p-6 pb-4">{getSectionTitle('location')}</h2>
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <MapPin size={48} className="text-gray-300" />
                <p className="ml-4 text-gray-500">{t.common?.detail || 'Map will be displayed in production mode'}</p>
              </div>
            </div>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 sticky top-24 overflow-hidden">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                {t.booking?.bookNow || 'Book Now'}
              </h2>
              
              <div className="space-y-4 bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100">
                {/* Date Selection - shown for accommodations */}
                {listing.category === 'accommodation' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t.booking?.checkIn || 'Check In'}</label>
                      <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{t.booking?.checkOut || 'Check Out'}</label>
                      <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                )}
                
                {/* Date Selection - shown for excursions/transfer */}
                {listing.category === 'excursion' || listing.category === 'transfer' ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{t.partner?.basicInfo || 'Service Date'}</label>
                    <input type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                ) : null}
                
                {/* Guests/Seats Selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {listing.category === 'car_rental' ? t.partner?.capacity || 'Cars' : t.common?.detail || 'Guests'}
                  </label>
                  <input type="number" min={1} max={listing.capacity} defaultValue={1} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* Price Summary */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.booking?.price || 'Price per night'}</span>
                    <span className="font-medium">{priceCZK} CZK</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.booking?.duration || 'Duration'}</span>
                    <span className="font-medium">{nights} {t.booking?.checkIn || 'day(s)'}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span>{t.booking?.total || 'Total'}</span>
                    <span className="text-blue-600 text-xl">{nights > 0 ? (priceCZK * nights).toLocaleString() + ' CZK' : ''}</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={async () => {
                    const { data: { session }, error: authError } = await supabase.auth.getSession();
                    
                    if (authError || !session?.user) {
                      router.push(`/login?redirectTo=/tours/${id}`);
                      return;
                    }

                    const { data: categoryCommission } = await supabase
                      .from('category_commissions')
                      .select('default_commission')
                      .eq('category_id', listing.category)
                      .single();

                    const commissionPercent = categoryCommission?.default_commission || 10;
                    const platformFee = (priceCZK * commissionPercent) / 100;
                    const partnerAmount = priceCZK - platformFee;

                    const { error: bookingError } = await supabase.from('bookings').insert([{
                      property_id: listing.id,
                      customer_id: session.user.id,
                      total_price_czk: priceCZK,
                      payment_status: 'pending',
                      applied_commission_percent: commissionPercent,
                      platform_fee_czk: platformFee,
                      partner_amount_czk: partnerAmount
                    }]);

                    if (bookingError) {
                      console.error('Booking error:', bookingError);
                      return;
                    }

                    router.push('/partner/bookings');
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-xl">♥</span>
                  {t.booking?.bookNow || 'Book Now'}
                </button>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>{t.booking?.freeCancellation || 'Free cancellation within 24h'}</span>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">{t.common?.locationTirana || 'Contact Partner'}</h3>
              
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">P</div>
                <div>
                  <p className="font-medium text-gray-900">{t.common?.locationTirana || 'AlbaniaTours Partner'}</p>
                  <p className="text-sm text-green-600 font-medium">{t.partner?.basicInfo || 'Verified partner'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Phone size={18} />
                  {t.common?.detail || 'Contact Partner'}
                </button>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Mail size={18} />
                    {t.booking?.checkOut || 'Email'}
                  </button>
                </div>

                {/* Verification Status */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm text-gray-600">{t.common?.detail || 'Partner verified by AlbaniaTours'}</span>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">{t.booking?.checkOut || 'Cancellation Policy'}</h3>
              <p className="text-sm text-gray-600">
                {t.partner?.basicInfo || 'Free up to 24 hours before service start. After that, a 50% fee of the total price applies.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} AlbaniaTours. Všechna práva vyhrazena.</p>
        </div>
      </footer>
    </div>
  );
}
