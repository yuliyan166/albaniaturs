'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/app/providers/LanguageContext';
import { MapPin, Star, Image as ImageIcon, Video, DollarSign, LogOut, TrendingUp, Calendar, Activity, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

// Period options for analytics
const PERIODS = [
  { id: 'day', label: { cs: 'Dnes', en: 'Today', sq: 'Sot', bg: 'Днес' } },
  { id: 'week', label: { cs: 'Tento týden', en: 'This Week', sq: 'Këtë javë', bg: 'Тази седмица' } },
  { id: 'month', label: { cs: 'Tento měsíc', en: 'This Month', sq: 'Këtë muaj', bg: 'Този месец' } },
  { id: 'year', label: { cs: 'Tento rok', en: 'This Year', sq: 'Këtë vit', bg: 'Тази година' } },
];

// Strict type for all translation entries - every key must have cs, en, sq, and bg
type TranslationItem = Record<'cs' | 'en' | 'sq' | 'bg', string>;

// UI labels that can be internationalized
const LABELS: Record<string, TranslationItem> = {
  partnerDashboard: {
    cs: 'Partner Dashboard',
    en: 'Partner Dashboard',
    sq: 'Partner Paneli',
    bg: 'Партньор Табло',
  },
  signOut: {
    cs: 'Odhlásit se',
    en: 'Sign Out',
    sq: 'Dilohu',
    bg: 'Изход',
  },
  performanceAnalytics: {
    cs: 'Výkonnostní analytika',
    en: 'Performance Analytics',
    sq: 'Analiza e Performancës',
    bg: 'Аналитика на Производителността',
  },
  totalRevenue: {
    cs: 'Celkový příjem',
    en: 'Total Revenue',
    sq: 'Të ardhurat totale',
    bg: 'Об总收入',
  },
  platformCommission: {
    cs: 'Komise platformy',
    en: 'Platform Commission',
    sq: 'Komisioni i platformës',
    bg: 'Комисиона на Платформата',
  },
  yourEarnings: {
    cs: 'Vaše výdělky',
    en: 'Your Earnings',
    sq: 'Të ardhurat tuaja',
    bg: 'Вашите Доходи',
  },
  totalBookings: {
    cs: 'Celkem rezervací',
    en: 'Total Bookings',
    sq: 'Rezervimet totale',
    bg: 'Общо Резервации',
  },
  occupancyRate: {
    cs: 'Míra obsazenosti',
    en: 'Occupancy Rate',
    sq: 'Shkalla e mbushjes',
    bg: 'Процент на Заетост',
  },
  activeListings: {
    cs: 'Aktivní inzeráty',
    en: 'Active Listings',
    sq: 'Listimet aktive',
    bg: 'Активни Обявления',
  },
  addNewListing: {
    cs: 'Přidat nový inzerát',
    en: 'Add New Listing',
    sq: 'Shto listim të ri',
    bg: 'Добавете Ново Обявление',
  },
  myListings: {
    cs: 'Moje inzeráty',
    en: 'My Listings',
    sq: 'Listimet e mia',
    bg: 'Моите Обявления',
  },
  edit: {
    cs: 'Upravit',
    en: 'Edit',
    sq: 'Ndrysho',
    bg: 'Редактирай',
  },
  delete: {
    cs: 'Smazat',
    en: 'Delete',
    sq: 'Fshi',
    bg: 'Изтрий',
  },
  addFirstListing: {
    cs: 'Přidat první inzerát',
    en: 'Add First Listing',
    sq: 'Shto listimin e parë',
    bg: 'Добавете Първо Обявление',
  },
  noListingsYet: {
    cs: 'Zatím žádné inzeráty',
    en: 'No listings yet',
    sq: ' ende nuk ka lista',
    bg: 'Все още няма обявления',
  },
  addFirstListingDescription: {
    cs: 'Přidejte své první ubytování, autopůjčovnu nebo výlet a začněte vydělávat na komisích.',
    en: 'Add your first accommodation, car rental, or tour to start earning commissions.',
    sq: 'Shto akomodimin e parë, qiranë e makinës ose turin për të filluar të fitoni komisione.',
    bg: 'Добавете първото си настаняване, автомобил под наем или екскурзия, за да започнете да печелите комисиони.',
  },
};

export default function PartnerDashboard() {
  const { language } = useLanguage();
  const t = LABELS;
  
  // Helper function to get translated text with safe type casting
  const translate = (labelKey: keyof typeof t) => {
    const item = t[labelKey];
    return item?.[language as keyof TranslationItem] || item?.en || labelKey;
  };

  const [offers, setOffers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Handle sign out properly with cleanup
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err: any) {
      console.error('Error signing out:', err);
    }
  };

  // Check session and load data on mount or period change
  useEffect(() => {
    const checkSessionAndLoadData = async () => {
      try {
        setSuccessMessage(null);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!session) {
          window.location.href = '/partner/login';
          return;
        }
        
        // Check partner role (also allow host role)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (!profile || (profile.role !== 'partner' && profile.role !== 'host')) {
          window.location.href = '/login';
          return;
        }
        
        // Load partner's offers - fix host_id to owner_id for schema compliance
        const { data: partnerOffers } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (partnerOffers) {
          setOffers(partnerOffers);
        }
        
        // Load partner's bookings - fix host_id to property_id.owner_id for schema compliance
        const { data: partnerBookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('property_id.owner_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (partnerBookings) {
          setBookings(partnerBookings);
        }
      } catch (err) {
        console.error('Partner dashboard error:', err);
        window.location.href = '/partner/login';
      } finally {
        setLoading(false);
        setAnalyticsLoading(false);
      }
    };
    
    checkSessionAndLoadData();
  }, []);

  // Calculate period filter
  const getPeriodFilter = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    return startDate.toISOString();
  };

  // Calculate analytics metrics - use correct schema fields
  const periodFilter = getPeriodFilter();
  
  const filteredBookings = bookings.filter(b => {
    const createdAt = b.created_at || '';
    return new Date(createdAt) >= new Date(periodFilter);
  });
  
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const platformCommission = filteredBookings.reduce((sum, b) => sum + ((b.total_price || 0) * 0.1), 0); // 10% commission estimate
  const partnerEarnings = totalRevenue - platformCommission;
  
  const bookingCount = filteredBookings.length;
  const activeListings = offers.filter(o => o.status === 'active').length;
  const pendingListings = offers.filter(o => o.status === 'pending').length;
  
  // Conversion/occupancy calculation
  const occupancyRate = activeListings > 0 
    ? ((bookingCount / (activeListings * 30)) * 100).toFixed(1) 
    : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{translate('partnerDashboard')}</p>
        </div>
      </div>
    );
  }

  // Helper to get localized offer title
  const getLocalizedTitle = (offer: any) => {
    if (typeof offer.title_en === 'string' && offer.title_en) return offer.title_en;
    if (typeof offer.title_cs === 'string' && offer.title_cs) return offer.title_cs;
    if (typeof offer.title_sq === 'string' && offer.title_sq) return offer.title_sq;
    if (typeof offer.title === 'object' && offer.title !== null) {
      return (offer.title as Record<string, string>)[language] || (offer.title as Record<string, string>).en || 'Untitled';
    }
    return 'Untitled';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">{translate('partnerDashboard')}</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <LogOut size={18} />
            <span>{translate('signOut')}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Period Selector */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{translate('performanceAnalytics')}</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {PERIODS.map(p => (
              <option key={p.id} value={p.id}>{p.label[language as keyof typeof p.label] || p.label.en}</option>
            ))}
          </select>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-green-500" size={24} />
              <span className="text-sm text-gray-500">{translate('totalRevenue')}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{(totalRevenue ?? 0).toLocaleString()} CZK</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Activity className="text-blue-500" size={24} />
              <span className="text-sm text-gray-500">{translate('platformCommission')}</span>
            </div>
            <p className="text-3xl font-bold text-red-500">{(platformCommission ?? 0).toLocaleString()} CZK</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-green-600" size={24} />
              <span className="text-sm text-gray-500">{translate('yourEarnings')}</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{(partnerEarnings ?? 0).toLocaleString()} CZK</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-purple-500" size={24} />
              <span className="text-sm text-gray-500">{translate('totalBookings')}</span>
            </div>
            <p className="text-3xl font-bold text-purple-500">{bookingCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Star className="text-yellow-500" size={24} />
              <span className="text-sm text-gray-500">{translate('occupancyRate')}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{occupancyRate}%</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="text-blue-500" size={24} />
              <span className="text-sm text-gray-500">{translate('activeListings')}</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{activeListings}</p>
          </div>
        </div>

        {/* Add New Listing CTA */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{translate('myListings')}</h2>
          <Link 
            href="/partner/add-offer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span> {translate('addNewListing')}
          </Link>
        </div>

        {/* Offers Grid */}
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Offer Image */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {(offer.images && offer.images.length > 0) ? (
                    <img src={offer.images[0]} alt={getLocalizedTitle(offer)} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {offer.status === 'pending' && (
                    <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      <RefreshCw size={12} /> Pending
                    </div>
                  )}
                </div>

                {/* Offer Details */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{getLocalizedTitle(offer)}</h3>
                  
                  {/* Category Badge */}
                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-3 ${
                    offer.category === 'accommodation' ? 'bg-purple-100 text-purple-800' :
                    offer.category === 'car_rental' ? 'bg-blue-100 text-blue-800' :
                    offer.category === 'excursion' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {translate(offer.category?.replace('_', '') as keyof typeof translate)}
                  </span>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-lg font-bold text-gray-900">{offer.price_czk || 0} CZK</p>
                    </div>
                    
                    {offer.rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="font-semibold">{offer.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <Link 
                      href={`/partner/edit-offer/${offer.id}`}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      {translate('edit')}
                    </Link>
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this listing?')) {
                          supabase.from('properties').delete().eq('id', offer.id);
                          setOffers(offers.filter(o => o.id !== offer.id));
                        }
                      }}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      {translate('delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">{translate('noListingsYet')}</h3>
            <p className="text-gray-500 mt-1 mb-4">{translate('addFirstListingDescription')}</p>
            <Link 
              href="/partner/add-offer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              <span className="text-lg">+</span> {translate('addFirstListing')}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
