'use client';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageContext';
import { translations } from '@/lib/translations';

export default function Navbar() {
  const { language, setLanguage, languages } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const navItems = [
    { label: t?.nav?.home, href: '/' },
    { label: t?.nav?.accommodation, href: '/accommodation' },
    { label: t?.nav?.cars, href: '/cars' },
    { label: t?.nav?.tours, href: '/tours' },
    { label: t?.nav?.transfers, href: '/transfers' },
    { label: t?.nav?.partnerSection, href: '/partner' },
    { label: t?.nav?.contact, href: '/contact' },
    { label: t?.nav?.terms, href: '/terms' },
    { label: t?.nav?.gdpr, href: '/gdpr' },
  ];

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
      <Link href="/" className="text-2xl font-black text-blue-600">AlbaniaTours</Link>
      
      <div className="flex items-center gap-6">
        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>

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
          {t?.nav?.partnerSection || 'Partner Portal'}
        </Link>
        
        <Link href="/admin" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
          {t?.nav?.admin || 'Admin'}
        </Link>
      </div>
    </nav>
  );
}
