'use client';
import React, { useState } from 'react';
import { useLanguage } from '@/app/providers/LanguageContext';
import { ChevronDown, Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition"
      >
        <Globe size={16} />
        <span>{currentLang?.flag} {currentLang?.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${language === lang.code ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span>{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};