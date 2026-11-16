'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X } from 'lucide-react';

interface BookingModalProps {
  listing: any;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ listing, onClose }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      if (!formData.startDate || !formData.endDate) return;
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      setTotalPrice(listing.price_czk * diffDays);
    };
    calculateTotal();
  }, [formData, listing.price_czk]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create pending booking in Supabase
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          property_id: listing.id,
          customer_id: user?.id || null,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          start_date: formData.startDate,
          end_date: formData.endDate,
          guests: formData.guests,
          total_price_czk: totalPrice,
          payment_status: 'pending',
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 2. Call Stripe Checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.id,
          amount: totalPrice,
          customerEmail: formData.email,
        }),
      });

      const { url, error: stripeError } = await response.json();
      if (stripeError) throw new Error(stripeError);

      // 3. Redirect to Stripe
      window.location.href = url;
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <form onSubmit={handleBooking} className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleIn">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Book Now</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-black transition"><X /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <img src={listing.image} className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-lg">{listing.title}</h3>
              <p className="text-gray-500 text-sm">{listing.price_czk} CZK / day</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
              <input type="date" required className="w-full p-2 border rounded-lg" onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date</label>
              <input type="date" required className="w-full p-2 border rounded-lg" onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Guests</label>
            <input type="number" min="1" required className="w-full p-2 border rounded-lg" value={formData.guests} onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})} />
          </div>
          <div className="space-y-3 pt-4 border-t">
            <input placeholder="Full Name" required className="w-full p-2 border rounded-lg" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" required className="w-full p-2 border rounded-lg" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="tel" placeholder="Phone" required className="w-full p-2 border rounded-lg" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-gray-600 font-medium">Total Amount:</span>
            <span className="text-3xl font-black text-red-600">{totalPrice} CZK</span>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition disabled:opacity-50">
            {loading ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
          </button>
        </div>
      </form>
    </div>
  );
};