/**
 * Konfigurace pro internacionalizaci (i18n) AlbaniaTours.
 * Definuje povolené jazyky pro každou zónu aplikace.
 */

export type LanguageCode = 'cs' | 'en' | 'sq' | 'bg';
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
    allowedLanguages: ['cs', 'en', 'bg'],
    defaultLanguage: 'cs',
  },
  {
    // Zone for local partners (Albanian operators)
    pathPrefix: '/partner',
    allowedLanguages: ['sq', 'en', 'cs', 'bg'],
    defaultLanguage: 'sq',
  },
  {
    // Administrative panel
    pathPrefix: '/admin',
    allowedLanguages: ['cs', 'en', 'bg'],
    defaultLanguage: 'cs',
  },
];

export const getSupportedLanguagesForPath = (path: string): RouteLanguageConfig => {
  const matched = LANGUAGE_CONFIG
    .filter(config => path.startsWith(config.pathPrefix))
    .sort((a, b) => b.pathPrefix.length - a.pathPrefix.length);

  return matched[0] || LANGUAGE_CONFIG[0];
};