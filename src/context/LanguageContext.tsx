'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Дефинираме строг тип за езиковите кодове, за да избегнем Type Errors при билд
export type LanguageCode = 'cs' | 'en' | 'sq';

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: string) => void;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Синхронизиране с дефолтния език 'en'
  const [language, setLanguageState] = useState<LanguageCode>('en');
  
  const languages: Language[] = [
    { code: 'cs', name: 'Čeština' },
    { code: 'en', name: 'English' },
    { code: 'sq', name: 'Shqip' },
  ];

  const setLanguage = (code: string) => {
    // Валидация и мапинг на езика
    if (languages.some(l => l.code === code)) {
      setLanguageState(code as LanguageCode);
    } else if (code === 'cz') {
      setLanguageState('cs'); // Fallback за старата номенклатура
    } else {
      setLanguageState('en');
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}