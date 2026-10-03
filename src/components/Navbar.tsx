'use client';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageContext';
import { translations } from '@/lib/translations';

export default function Navbar() {
  const { language, setLanguage, languages } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
      <Link href="/" className="text-2xl font-black text-blue-600">AlbaniaTours</Link>
      
      <div className="flex items-center gap-6">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <Globe size={18} className="text-gray-500" />
          <div className="flex gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`uppercase px-1 transition-colors ${ 
                  language === lang.code 
                    ? 'text-blue-600 font-bold' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                {lang.code}
              </button>
            ))}
          </div>
        </div>

        <Link href="/partner" className="text-sm font-medium hover:text-blue-600 transition-colors">
          {t.nav.hostLogin}
        </Link>
        
        <Link href="/admin" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
          {t.nav.admin}
        </Link>
      </div>
    </nav>
  );
}