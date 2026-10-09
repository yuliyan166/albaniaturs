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
    <header className="bg-white border-b border-blue-50 sticky top-0 z-50 shadow-lg">
      {/* Premium Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xs">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Albania's #1 Travel Platform
            </span>
          </div>
          <div className="hidden md:flex gap-4">
            <span>✈️ Best Price Guarantee</span>
            <span className="hidden lg:inline">🔒 Secure Booking</span>
            <span className="hidden lg:inline">💰 100% Satisfaction</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/30 transition-all">
                <span className="font-black text-xl">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl leading-none text-slate-900 tracking-tight">
                  Albania<span className="text-blue-600">Tours</span>
                </span>
                <span className="text-[10px] font-medium text-blue-600 uppercase tracking-widest">
                  Premium Travel
                </span>
              </div>
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden xl:flex items-center space-x-1">
            {!isPartnerZone && !isAdminZone && (
              <>
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {/* CTA Button */}
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
            >
              <span>{t?.common?.myBookings || 'My Bookings'}</span>
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✈️</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
