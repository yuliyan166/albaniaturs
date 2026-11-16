'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/providers/LanguageContext';
import { getSupportedLanguagesForPath } from '@/config/i18n';

interface LanguageGuardProps {
  children: React.ReactNode;
}

export default function LanguageGuard({ children }: LanguageGuardProps) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (!pathname) return;

    try {
      const config = getSupportedLanguagesForPath(pathname);
      if (!config.allowedLanguages.includes(language)) {
        const safeLang = config.allowedLanguages[0] || 'en';
        setLanguage(safeLang);
      }
    } catch (err) {
      console.error('[LanguageGuard] Error during language validation:', err);
    }
  }, [pathname, language]);

  return <>{children}</>;
}