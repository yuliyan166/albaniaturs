'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/app/providers/LanguageContext';
import { MapPin, Star, Image as ImageIcon, DollarSign, Clock, Upload } from 'lucide-react';

const PLACEHOLDER_TRANSLATIONS: Record<string, Record<string, string>> = {
  title: { cs: 'Drahý byt s videm', en: 'Luxury Apartment with View', sq: 'Apartmenti Deluxe me Përparime', bg: 'Роскошен апартамент с изглед' },
  description: { cs: 'Nově zrekonstruovaný drahý byt v centru, blízko všech hlavních lákadek.', en: 'Recently renovated luxury apartment in the center, close to all main attractions.', sq: 'Apartmenti i fresku luksuz në qendër, afër të gjitha tarive kryesore.', bg: 'Пресновъзобновен луксозен апартамент в центъра, близо до всички основни забележителности.' },
};

export default function AddOfferPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [category, setCategory] = useState('accommodation');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price_czk, setPrice_czk] = useState<number>(500);
  const [capacity, setCapacity] = useState<number>(2);
  const [image_urls, setImage_urls] = useState<string[]>([]);
  const [departure_times, setDepartureTimes] = useState('');
  const [ical_url, setIcalUrl] = useState('');
  const [video_url, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!title) {
      setTitle(PLACEHOLDER_TRANSLATIONS.title[language] || PLACEHOLDER_TRANSLATIONS.title.en);
    }
    if (!description) {
      setDescription(PLACEHOLDER_TRANSLATIONS.description[language] || PLACEHOLDER_TRANSLATIONS.description.en);
    }
  }, [language]);

  const handleImageUpload = async (file: File, index: number) => {
    try {
      setUploadingImages(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${index}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage.from('property-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(filePath);

      setImage_urls(prev => {
        const newUrls = [...prev];
        if (newUrls[index]) newUrls[index] = publicUrl;
        else newUrls.push(publicUrl);
        return newUrls;
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`${(language === 'sq' ? 'Dështoi ngarkimi i imazhit:' : language === 'cs' ? 'Selhalo nahrání obrázku:' : language === 'bg' ? 'Неуспешно качване на снимка:' : 'Failed to upload image:')} ${err.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  // Build JSONB objects for multi-language title and description fields.
  // The database stores titles/descriptions as JSONB — not flat columns.
  const buildLanguageObjects = (activeLang: string, text: string) => {
    if (!text) return { titles: {}, descriptions: {} };

    const titles: Record<string, string> = {};
    const descriptions: Record<string, string> = {};

    // Always fill active language + fallbacks
    titles[activeLang] = text;
    titles.en = text; // English as universal fallback
    titles.cs = text;
    titles.sq = text;
    titles.bg = text;

    descriptions[activeLang] = text;
    descriptions.en = text;
    descriptions.cs = text;
    descriptions.sq = text;
    descriptions.bg = text;

    return { titles, descriptions };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setError(language === 'cs' ? 'Přihlaste se znovu pro přidání inzerátu.' : language === 'sq' ? 'Ju lutem hyni përsëri për të shtuar një ofertë.' : language === 'bg' ? 'Моля влезте отново, за да добавите обявление.' : 'Please log in again to add a listing.');
        setLoading(false);
        return;
      }

      const { titles, descriptions } = buildLanguageObjects(language, title || 'Property Listing');

      // Payload matches database schema exactly:
      // - host_id (not owner_id)
      // - titles as JSONB object
      // - descriptions as JSONB object
      // - No flat title_en/title_cs/description_* columns
      const newOffer = {
        host_id: session.user.id,
        category,
        titles,
        descriptions,
        price_czk,
        capacity,
        images: image_urls.length > 0 ? image_urls : [],
        departure_times: (category === 'excursion' || category === 'transfer') ? departure_times.split(',').map(t => t.trim()).filter(Boolean) : null,
        video_url: video_url || null,
        ical_url: ical_url || null,
        status: 'pending',
      };

      const { error: insertError } = await supabase.from('properties').insert([newOffer]);
      if (insertError) { setError(insertError.message); setLoading(false); return; }
      router.push('/partner');
    } catch (err: any) {
      setError(err.message || (language === 'cs' ? 'Došlo k neočekávané chybě.' : language === 'sq' ? 'Ndodhi një gabim i papritur.' : language === 'bg' ? 'Възникна неочаквана грешка.' : 'An unexpected error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  const t = (lang: string) => ({
    accommodation: lang === 'sq' ? 'Akomodim' : lang === 'cs' ? 'Ubytování' : lang === 'bg' ? 'Настаняване' : 'Accommodation',
    carRental: lang === 'sq' ? 'Makina me qera' : lang === 'cs' ? 'Autopůjčovna' : lang === 'bg' ? 'Автомобил под наем' : 'Car Rental',
    excursion: lang === 'sq' ? 'Ekskursioni' : lang === 'cs' ? 'Výlet' : lang === 'bg' ? 'Екскурзия' : 'Excursion/ Tour',
    transfer: lang === 'sq' ? 'Transfer' : lang === 'cs' ? 'Transfery' : lang === 'bg' ? 'Трансфер' : 'Transfer',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{language === 'cs' ? 'Přidat Nový Inzerát' : language === 'sq' ? 'Shtoni Ofertë të Re' : language === 'bg' ? 'Добавете Ново Обявление' : 'Add New Listing'}</h1>
          <p className="text-gray-600 mt-1">{language === 'cs' ? 'Vytvořte nové ubytování, půjčovnu aut nebo zážitek pro své zákazníky.' : language === 'sq' ? 'Krijoni një akomodim të ri, makinë me qera ose përvojë ture për klientët tuaj.' : language === 'bg' ? 'Създайте ново настаняване, автомобил под наем или туристическо преживяване за вашите клиенти.' : 'Create a new accommodation, car rental, or tour experience for your customers.'}</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-700">{error}</p></div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">

          {/* Basic Information Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">{language === 'cs' ? 'Základní Informace' : language === 'sq' ? 'Informacioni Bazik' : language === 'bg' ? 'Основна Информация' : 'Basic Information'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Kategorie' : language === 'sq' ? 'Kategoria' : language === 'bg' ? 'Категория' : 'Category'}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="accommodation">{t(language).accommodation}</option>
                  <option value="car_rental">{t(language).carRental}</option>
                  <option value="excursion">{t(language).excursion}</option>
                  <option value="transfer">{t(language).transfer}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Název' : language === 'sq' ? 'Titulli' : language === 'bg' ? 'Заглавие' : 'Title'} ({language.toUpperCase()})</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`${(language === 'cs' ? 'Zadejte název' : language === 'sq' ? 'Shkruani titullin' : language === 'bg' ? 'Въведете заглавие' : 'Enter title')} ${language}`} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Popis' : language === 'sq' ? 'Përshkrimi' : language === 'bg' ? 'Описание' : 'Description'} ({language.toUpperCase()})</label>
              <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`${(language === 'cs' ? 'Popište váš inzerát' : language === 'sq' ? 'Përshkruani ofertën tuaj' : language === 'bg' ? 'Опишете обявлението' : 'Describe your listing')} ${language}`} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <p className="mt-1 text-xs text-gray-500">{language === 'cs' ? 'Bude automaticky přeloženo pro všechny podporované jazyky (SQ, EN, CS)' : language === 'sq' ? 'Ky do të përkthehet automatikisht në të gjitha gjuhët e mbështetura (SQ, EN, CS)' : language === 'bg' ? 'Ще бъде автоматично преведено за всички поддържани езици (SQ, EN, CS, BG)' : 'This will be auto-translated for all supported languages (SQ, EN, CS, BG)'}</p>
            </div>
          </section>

          {/* Pricing & Capacity Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">{language === 'cs' ? 'Cena a Kapacita' : language === 'sq' ? 'Çmimi & Kapaciteti' : language === 'bg' ? 'Цена и Капацитет' : 'Pricing & Capacity'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Cena (CZK)' : language === 'sq' ? 'Çmimi (CZK)' : language === 'bg' ? 'Цена (CZK)' : 'Price (CZK)'}</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="number" required min={0} value={price_czk || ''} onChange={(e) => setPrice_czk(Number(e.target.value))} placeholder="500" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {category === 'accommodation' ? (language === 'cs' ? 'Cena za noc' : language === 'sq' ? 'Çmimi për natë' : language === 'bg' ? 'Цена за нощувка' : 'Price per night') : category === 'car_rental' ? (language === 'cs' ? 'Cena za den' : language === 'sq' ? 'Çmimi për ditë' : language === 'bg' ? 'Цена на ден' : 'Price per day') : (language === 'cs' ? 'Cena za rezervaci' : language === 'sq' ? 'Çmimi për rezervim' : language === 'bg' ? 'Цена за резервация' : 'Price per booking')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Kapacita' : language === 'sq' ? 'Kapaciteti' : language === 'bg' ? 'Капацитет' : 'Capacity'}</label>
                <div className="relative">
                  <Star className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="number" required min={1} value={capacity || ''} onChange={(e) => setCapacity(Number(e.target.value))} placeholder="2" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">{language === 'cs' ? 'Max. hosté/místa' : language === 'sq' ? 'Maks. mysafirë/vende' : language === 'bg' ? 'Макс. гости/седалки/места' : 'Max guests/seats/slots'}</p>
              </div>

              {(category === 'excursion' || category === 'transfer') && (
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Časy odjezdu (oddělené čárkou)' : language === 'sq' ? 'Orët e Nisjes (të ndara me presje)' : language === 'bg' ? 'Време на départ (разделени със запетая)' : 'Departure Times (comma-separated)'}</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="text" value={departure_times} onChange={(e) => setDepartureTimes(e.target.value)} placeholder="09:00, 12:00, 15:00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Media Section with Direct Upload */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">{language === 'cs' ? 'Média (Nahrát Obrázky)' : language === 'sq' ? 'Mediat (Ngarko Imazhet)' : language === 'bg' ? 'Медия (Качване на снимки)' : 'Media (Upload Images)'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {image_urls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Obrázek' : language === 'sq' ? 'Imazhi' : language === 'bg' ? 'Снимка' : 'Image'} {index + 1}</label>
                  <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => { const file = e.target.files?.[0]; if (file && file.size <= 5 * 1024 * 1024 && image_urls.length < 10) handleImageUpload(file, index); else if (file && file.size > 5 * 1024 * 1024) alert(language === 'cs' ? 'Soubor přesahuje 5 MB limit.' : language === 'sq' ? 'Skeda kalon më shumë se 5MB kufi.' : language === 'bg' ? 'Файлът надвишава ограничението от 5 МБ.' : 'File exceeds 5 MB limit.'); }} disabled={uploadingImages} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                  {url && (
                    <div className="relative rounded-lg overflow-hidden">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                      <button type="button" onClick={() => setImage_urls(prev => prev.filter((_, i) => i !== index))} className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 rounded-br-lg text-xs shadow-sm hover:bg-red-700">{language === 'cs' ? 'Odstranit' : language === 'sq' ? 'Hiq' : language === 'bg' ? 'Премахни' : 'Remove'}</button>
                    </div>
                  )}
                </div>
              ))}

              {image_urls.length < 3 && (
                <div className="flex items-end space-y-2">
                  <div className="w-full space-y-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Nahrát Obrázek' : language === 'sq' ? 'Ngarko Imazhin' : language === 'bg' ? 'Качете снимка' : 'Upload Image'} ({image_urls.length + 1}/3)</label>
                    <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => { const file = e.target.files?.[0]; if (file && file.size <= 5 * 1024 * 1024 && image_urls.length < 10) handleImageUpload(file, image_urls.length); else if (file && file.size > 5 * 1024 * 1024) alert(language === 'cs' ? 'Soubor přesahuje 5 MB limit.' : language === 'sq' ? 'Skeda kalon më shumë se 5MB kufi.' : language === 'bg' ? 'Файлът надвишава ограничението от 5 МБ.' : 'File exceeds 5 MB limit.'); }} disabled={uploadingImages} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" />
                    {uploadingImages && <div className="text-xs text-blue-600">{language === 'cs' ? 'Nahrávání...' : language === 'sq' ? 'Duke ngarkuar...' : language === 'bg' ? 'Качване...' : 'Uploading...'}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Video Upload Field */}
            <div className="mt-6 pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'cs' ? 'Video URL (MP4/WebM)' : language === 'sq' ? 'Video URL (MP4/WebM)' : language === 'bg' ? 'Видео URL (MP4/WebM)' : 'Video URL (MP4/WebM)'}</label>
              <input type="url" value={video_url} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://example.com/video.mp4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <p className="mt-1 text-xs text-gray-500">{language === 'cs' ? 'Podporováno MP4 a WebM formáty (max 50 MB)' : language === 'sq' ? 'MP4 dhe WebM formate të mbështetura (maks. 50 MB)' : language === 'bg' ? 'Поддържани формати: MP4 и WebM (макс. 50 МБ)' : 'Supported formats: MP4 and WebM (max 50 MB)'}</p>
            </div>

            {/* iCal URL (for availability calendar) */}
          </section>

          {/* Submit Section */}
          <div className="pt-6 border-t">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => router.push('/partner')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">{language === 'cs' ? 'Zrušit' : language === 'sq' ? 'Anulo' : language === 'bg' ? 'Отказ' : 'Cancel'}</button>
              <button type="submit" disabled={loading} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (<>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {language === 'cs' ? 'Vytváření...' : language === 'sq' ? 'Duke krijuar...' : language === 'bg' ? 'Създаване...' : 'Creating...'}
                </>) : (<>
                  <MapPin size={18} />
                  {language === 'cs' ? 'Vytvořit Inzerát' : language === 'sq' ? 'Krijo Ofertën' : language === 'bg' ? 'Създайте Обявление' : 'Create Listing'}
                </>)}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
