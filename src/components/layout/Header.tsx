'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/providers/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  const pathname = usePathname() || '';
  const { t } = useLanguage();
  const isPartnerZone = pathname.startsWith('/partner');
  const isAdminZone = pathname.startsWith('/admin');

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-red-600 tracking-tight hover:opacity-80 transition-opacity">
              Albania<span className="text-slate-800">Tours</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {!isPartnerZone && !isAdminZone && (
              <>
                <Link href="/accommodation" className="text-sm font-medium text-gray-600 hover:text-red-600 transition">{t.categories.accommodation}</Link>
                <Link href="/cars" className="text-sm font-medium text-gray-600 hover:text-red-600 transition">{t.categories.car}</Link>
                <Link href="/tours" className="text-sm font-medium text-gray-600 hover:text-red-600 transition">{t.categories.tour}</Link>
                <Link href="/transfers" className="text-sm font-medium text-gray-600 hover:text-red-600 transition">{t.categories.transfers}</Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <Link 
              href="/login" 
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-all shadow-md"
            >
              {t.common.myBookings || 'My Bookings'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};