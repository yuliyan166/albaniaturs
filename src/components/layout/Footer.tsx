'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-8 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
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
            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
                { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
                { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
                { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-gradient-to-br hover:from-blue-600 hover:to-teal-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 backdrop-blur-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
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
                { label: 'Home', href: '/', icon: 'Home' },
                { label: 'Accommodation', href: '/accommodation', icon: 'Building' },
                { label: 'Car Rentals', href: '/cars', icon: 'Car' },
                { label: 'Tours', href: '/tours', icon: 'Map' },
                { label: 'Transfers', href: '/transfers', icon: 'Plane' },
                { label: 'Partner with Us', href: '/partner', icon: 'Users' },
                { label: 'Contact Us', href: '/contact', icon: 'Mail' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-3 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      <link.icon className="w-4 h-4" />
                    </span>
                    <span className="group-hover:w-2 transition-all duration-300 bg-blue-500 h-0.5 flex-grow max-w-[20px]"></span>
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
                { label: 'Terms & Conditions', href: '/terms', icon: 'FileText' },
                { label: 'Privacy Policy (GDPR)', href: '/gdpr', icon: 'Shield' },
                { label: 'Partner Agreement', href: '/partner-agreement', icon: 'Handshake' },
                { label: 'Cookie Policy', href: '/cookies', icon: 'Cookie' },
                { label: 'Cancellation Policy', href: '/cancellations', icon: 'Ban' },
                { label: 'Complaints & Refunds', href: '/complaints', icon: 'AlertTriangle' },
                { label: 'FAQ', href: '/faq', icon: 'HelpCircle' },
                { label: 'Help Center', href: '/help', icon: 'LifeBuoy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-3 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      <link.icon className="w-4 h-4" />
                    </span>
                    <span className="group-hover:w-2 transition-all duration-300 bg-teal-500 h-0.5 flex-grow max-w-[20px]"></span>
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
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-sm"
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
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { name: 'Visa', icon: 'CreditCard' },
                  { name: 'Mastercard', icon: 'CreditCard' },
                  { name: 'PayPal', icon: 'CreditCard' },
                  { name: 'Amex', icon: 'CreditCard' },
                  { name: 'Google Pay', icon: 'Smartphone' },
                  { name: 'Apple Pay', icon: 'Smartphone' }
                ].map((method) => (
                  <div
                    key={method.name}
                    className="w-10 h-6 sm:w-12 sm:h-7 bg-slate-800/80 rounded flex items-center justify-center text-[10px] sm:text-xs text-slate-500 hover:bg-slate-700 transition-colors backdrop-blur-sm"
                  >
                    <method.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">{method.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm md:text-base text-center md:text-left">
              © {currentYear} AlbaniaTours. All rights reserved. Your trusted travel partner in Albania.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-slate-300 hidden sm:inline">Secure Booking</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-slate-300 hidden sm:inline">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="text-xs text-slate-300 hidden sm:inline">Top Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
