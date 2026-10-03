'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/providers/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <h3 className="text-white text-2xl font-bold">AlbaniaTours</h3>
          <p className="text-sm leading-relaxed opacity-80">{t?.common?.premiumOption || 'Premium gateway to the hidden gems of Albania.'}</p>
        </div>

        {/* Platform links */}
        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{t?.footer?.platform || 'Platform'}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white transition text-gray-400">{t?.footer?.home || 'Home'}</Link></li>
            <li><Link href="/login" className="block w-full hover:text-red-600 transition font-medium text-red-500">{t?.footer?.customerLogin || 'Customer Login'}</Link></li>
            <li><Link href="/register?role=partner" className="block w-full hover:text-orange-600 transition font-medium text-orange-500">{t?.footer?.partnerPortal || 'Partner Portal'}</Link></li>
            <li><Link href="/admin/login" className="block w-full hover:text-white transition font-medium text-red-500">{t?.footer?.adminPortal || 'Admin Portal'}</Link></li>
          </ul>
        </div>

        {/* Innovation links */}
        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{t?.footer?.platform || 'Innovation'}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/ecosystem" className="hover:text-white transition text-gray-400">{t?.footer?.digitalEcosystem || 'Digital Ecosystem'}</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">{t?.footer?.privacy || 'Privacy'}</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{t?.footer?.support || 'Support'}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/privacy" className="hover:text-white transition">{t?.footer?.privacy || 'Privacy'}</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">{t?.footer?.terms || 'Terms'}</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">{t?.footer?.contact || 'Contact'}</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{t?.footer?.connect || 'Connect'}</h4>
          <div className="flex gap-3 mb-6">
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 transition text-white" aria-label="Facebook"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg></a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 transition text-white" aria-label="Instagram"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149 3.227 1.664 4.771 4.919 4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><span className="text-red-500"><MailIcon size={16} /></span> info@albaniatours.al</div>
            <div className="flex items-center gap-3"><span className="text-red-500"><PhoneIcon size={16} /></span> +355 6X XXX XXX</div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-xs"><p>&copy; {new Date().getFullYear()} AlbaniaTours Premium MVP. All rights reserved.</p></div>

      {/* Security notice */}
      <div className="max-w-7xl mx-auto px-6 mt-4 text-center text-[10px] text-gray-500">Unauthorized access to administrative and partner functionality is strictly prohibited, monitored, and logged. Violations are reported.</div>
    </footer>
  );
}

function MailIcon({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9 2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}

function PhoneIcon({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
