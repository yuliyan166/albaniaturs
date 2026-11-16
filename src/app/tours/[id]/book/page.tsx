'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Booking Flow</h1>
      <Link href="/tours" className="inline-flex items-center gap-2 text-blue-600 font-medium">
        <ArrowLeft size={18} />
        Back to Tours
      </Link>
    </div>
  );
}
