'use client';
import React from 'react';
import Navbar from '@/components/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
      <footer className="p-8 text-center text-gray-400 border-t">
        © {new Date().getFullYear()} AlbaniaTours
      </footer>
    </div>
  );
}