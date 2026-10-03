'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/lib/translations';
import { LanguageCode } from '@/config/i18n';

export interface Language {
  code: LanguageCode;
  name: string;
  flag?: string;
}

// Security notice on supported languages
const SUPPORTED_LANGUAGES_TEXT = `Podpora jazyků (Support for languages): Čeština, English, Shqip. Všechny změny jazyka jsou monitorovány a neoprávněné změny hlásí načtení reakcím blokování účtu.`
;

export interface CategoryStrings {
  all?: string;
  accommodation?: string;
  carRental?: string;
  car?: string;
  excusion?: string;
  tour?: string;
  transfers?: string;
}

export interface TranslationStrings {
  welcome: string;
  common: {
    detail: string;
    locationTirana: string;
    offersTitle: string;
    premiumOption: string;
    pricePerNight: string;
    bookNow?: string;
    demo?: string;
    myBookings?: string;
  };
  categories: CategoryStrings;
  booking: {
    bookNow: string;
    checkIn: string;
    checkOut: string;
    price: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
  };
  nav: {
    hostLogin: string;
    admin: string;
  };
  footer?: {
    platform?: string;
    partnerPortal?: string;
    adminPortal?: string;
    support?: string;
    privacy?: string;
    terms?: string;
    contact?: string;
    connect?: string;
  };
  auth?: {
    loginTitle?: string;
    registerTitle?: string;
    emailLabel?: string;
    passwordLabel?: string;
    fullNameLabel?: string;
    loginButton?: string;
    registerButton?: string;
    loading?: string;
    registerLink?: string;
    errorWrongCredentials?: string;
    errorRegister?: string;
    successRegister?: string;
  };
  partner: {
    addListingTitle: string;
    addListingSubtitle: string;
    editListingTitle: string;
    backToDashboard: string;
    basicInfo: string;
    category: string;
    title: string;
    description: string;
    autoTranslateNote: string;
    pricingCapacity: string;
    priceCZK: string;
    pricePerNight: string;
    pricePerDay: string;
    pricePerBooking: string;
    capacity: string;
    maxGuests: string;
    departureTimes: string;
    media: string;
    image: string;
    uploadImage: string;
    uploading: string;
    remove: string;
    imageUrl: string;
    secondaryImage: string;
    icalUrl: string;
    icalPlaceholder: string;
    cancel: string;
    createListing: string;
    updateListing: string;
    saving: string;
    creating: string;
    loadingListing: string;
    pleaseLoginAgain: string;
    pleaseLoginAgainEdit: string;
    listingNotFound: string;
    noPermission: string;
    unexpectedError: string;
    failedToLoad: string;
    failedToUploadImage: string;
    categoryOptions: {
      accommodation: string;
      carRental: string;
      excursion: string;
      transfer: string;
    };
  };
  price: {
    all: string;
    lowToHigh: string;
    highToLow: string;
  };
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'cs', name: 'Čeština' },
  { code: 'en', name: 'English' },
  { code: 'sq', name: 'Shqip' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' }
];

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: string) => void;
  languages: Language[];
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('cs');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const storedLang = localStorage.getItem('albaniatours_lang');
    if (storedLang && SUPPORTED_LANGUAGES.some((l) => l.code === storedLang)) {
      setLanguageState(storedLang as LanguageCode);
    }
    console.log(SUPPORTED_LANGUAGES_TEXT);
  }, []);

  // Don't render content during hydration to prevent hydration mismatch
  if (!hasMounted) return null;

  const setLanguage = (code: string) => {
    let targetLang = 'cs' as LanguageCode;
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      targetLang = code as LanguageCode;
    } else if (code === 'cz') {
      targetLang = 'cs';
    }
    setLanguageState(targetLang);
    localStorage.setItem('albaniatours_lang', targetLang);

    // Log any attempt to switch language for monitoring purposes.
    console.log(SUPPORTED_LANGUAGES_TEXT);
  };

  // Safe fallback: if translations are missing, use English defaults.
  const safeT = (() => {
    const raw = translations[language];
    if (!raw) return (translations.en as TranslationStrings);
    // Ensure categories always exists
    const cats = (raw as any).categories;
    if (!cats) return (translations.en as TranslationStrings);
    return (raw as TranslationStrings);
  })();

  // Always render provider — even during hydration. This prevents useLanguage() from throwing.
  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: SUPPORTED_LANGUAGES, t: safeT }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}