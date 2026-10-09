'use client';
import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <span className="font-black text-lg">A</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl leading-none text-white tracking-tight">
                    Albania<span className="text-blue-400">Tours</span>
                  </span>
                  <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">
                    Premium Travel
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted partner for unforgettable journeys through Albania. 
              Discover hidden treasures with our premium accommodations, car rentals, 
              tours, and transfers.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { icon: 'facebook', label: 'Facebook' },
                { icon: 'twitter', label: 'Twitter' },
                { icon: 'linkedin', label: 'LinkedIn' },
                { icon: 'instagram', label: 'Instagram' }
              ].map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-teal-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label={social.label}
                >
                  {social.icon === 'facebook' && (
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  )}
                  {social.icon === 'twitter' && (
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                  )}
                  {social.icon === 'linkedin' && (
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  )}
                  {social.icon === 'instagram' && (
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Accommodation', href: '/accommodation' },
                { label: 'Car Rentals', href: '/cars' },
                { label: 'Tours & Excursions', href: '/tours' },
                { label: 'Transfers', href: '/transfers' },
                { label: 'Partner with Us', href: '/partner' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 transition-all duration-300 bg-blue-500 h-0.5"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Legal & Support
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Privacy Policy (GDPR)', href: '/gdpr' },
                { label: 'Partner Agreement', href: '/partner-agreement' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'Cancellation Policy', href: '/cancellations' },
                { label: 'Complaints & Refunds', href: '/complaints' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Help Center', href: '/help' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 transition-all duration-300 bg-teal-500 h-0.5"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
              Stay Updated
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to receive exclusive deals, travel inspiration, and updates about Albania.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                Subscribe Now
              </button>
            </form>
            
            {/* Payment Methods */}
            <div className="mt-8">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Accepted Payment Methods</p>
              <div className="flex flex-wrap gap-3">
                {['visa', 'mastercard', 'paypal', 'amex', 'google_pay', 'apple_pay'].map((method) => (
                  <div
                    key={method}
                    className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500"
                  >
                    {method.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} AlbaniaTours. All rights reserved. Your trusted travel partner in Albania.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-green-500">🔒</span>
                <span className="text-xs text-slate-500">Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <span className="text-xs text-slate-500">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-xs text-slate-500">Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
