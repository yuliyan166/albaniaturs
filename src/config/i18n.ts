/**
 * Konfigurace pro internacionalizaci (i18n) AlbaniaTours.
 * Definuje povolené jazyky pro každou zónu aplikace.
 */

export type LanguageCode = 'cs' | 'en' | 'sq' | 'sk' | 'de' | 'pl';
export type UserRole = 'customer' | 'partner' | 'admin';

export interface RouteLanguageConfig {
  pathPrefix: string;
  allowedLanguages: LanguageCode[];
  defaultLanguage: LanguageCode;
}

export const LANGUAGE_CONFIG: RouteLanguageConfig[] = [
  {
    // Public zone for tourists (Czech clients)
    pathPrefix: '/',
    allowedLanguages: ['cs', 'en', 'sq', 'sk', 'de', 'pl'],
    defaultLanguage: 'cs',
  },
  {
    // Zone for local partners (Albanian operators)
    pathPrefix: '/partner',
    allowedLanguages: ['sq', 'en', 'cs', 'sk', 'de', 'pl'],
    defaultLanguage: 'sq',
  },
  {
    // Administrative panel
    pathPrefix: '/admin',
    allowedLanguages: ['cs', 'en', 'sq', 'sk', 'de', 'pl'],
    defaultLanguage: 'cs',
  },
];

export const getSupportedLanguagesForPath = (path: string): RouteLanguageConfig => {
  const matched = LANGUAGE_CONFIG
    .filter(config => path.startsWith(config.pathPrefix))
    .sort((a, b) => b.pathPrefix.length - a.pathPrefix.length);

  return matched[0] || LANGUAGE_CONFIG[0];
};
