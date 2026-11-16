'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

interface LanguageGuardProps {
  children: (filteredLanguages: any[]) => React.ReactNode;
}

export default function LanguageGuard({ children }: LanguageGuardProps) {
  const { languages } = useLanguage(); 
  const pathname = usePathname();

  // Филтриране на езиците въз основа на текущия път
  const filteredLanguages = languages.filter(lang => {
    // КОРЕКЦИЯ: Замяна на 'cz' с 'cs' (ISO 639-1)
    if (pathname?.startsWith('/partner') && lang.code === 'cs') {
      return false;
    }
    return true;
  });

  // ПРЕМАХНАТ Е ИЗЛИШНИЯТ ФРАГМЕНТ <>, който причиняваше грешката в Vercel.
  // Тъй като children(filteredLanguages) връща ReactNode, можем да го върнем директно.
  return children(filteredLanguages);
}