// Импортираме типа от контекста за пълна синхронизация
import { LanguageCode } from '@/context/LanguageContext';

export interface LanguageConfig {
  allowedLanguages: LanguageCode[];
  defaultLanguage: LanguageCode;
}

/**
 * Определя кои езици са позволени за конкретна част от сайта.
 */
export function getSupportedLanguagesForPath(pathname: string): LanguageConfig {
  // 1. Партньорска зона
  if (pathname.startsWith('/partner')) {
    return {
      allowedLanguages: ['en', 'sq'],
      defaultLanguage: 'en',
    };
  }

  // 2. Администраторска зона
  if (pathname.startsWith('/admin')) {
    return {
      allowedLanguages: ['en', 'sq'],
      defaultLanguage: 'en',
    };
  }

  // 3. Обща клиентска зона (Дефолт)
  return {
    allowedLanguages: ['cs', 'en', 'sq'], // Корекция: 'cz' -> 'cs'
    defaultLanguage: 'cs',
  };
}