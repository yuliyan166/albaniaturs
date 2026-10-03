'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/app/providers/LanguageContext';
import { getSupportedLanguagesForPath, type RouteLanguageConfig, type LanguageCode } from '@/config/i18n';

interface LanguageGuardProps {
  children: React.ReactNode;
}

export default function LanguageGuard({ children }: LanguageGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (!pathname) return;

    // FALLBACK: Автоматично пренасочване от /cz/ към /cs/
    if (pathname.startsWith('/cz')) {
      const newPath = pathname.replace('/cz', '/cs');
      console.log(`[LanguageGuard] Redirecting legacy path ${pathname} to ${newPath}`);
      router.replace(newPath);
    }
  }, [pathname, router]);

  if (!pathname) return <>{children}</>;

  const normalizedPath = Array.isArray(pathname) ? pathname.join('/') : pathname;
  const config: RouteLanguageConfig = getSupportedLanguagesForPath(normalizedPath);

  // КОРЕКЦИЯ: Кастинг на language към LanguageCode, за да се реши Type Error-ът при билд
  if (!config.allowedLanguages.includes(language as LanguageCode)) {
    console.warn(`[LanguageGuard] Block ${language} for path ${normalizedPath}.`);
    const safeLang = config.allowedLanguages[0];
    setLanguage(safeLang);
  }

  return <>{children}</>;
}