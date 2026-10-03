'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  DollarSign, CreditCard, CheckCircle, XCircle,
  RefreshCw, Clock, User, Calendar, AlertTriangle
} from 'lucide-react';

// Payment status options for admin override
const PAYMENT_STATUS_OPTIONS = ['pending', 'paid', 'failed'];

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          id,
          total_price_czk,
          payment_status,
          applied_commission_percent,
          platform_fee_czk,
          partner_amount_czk,
          created_at,
          property_id,
          customer_id,
          properties(
            id,
            titles,
            category,
            host_id
          ),
          profiles!customer_id(
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the new schema fields to a consistent shape for the UI
      const mappedBookings = bookingsData?.map((b: any) => {
        const titles = b.properties?.titles || {};
        return {
          id: b.id,
          status: b.payment_status || 'pending',
          total_price: b.total_price_czk || 0,
          created_at: b.created_at,
          properties: {
            ...b.properties,
            title_en: titles.en || '',
            title_cs: titles.cs || '',
            title_sq: titles.sq || '',
          },
          profiles: b.profiles,
          payment_status: b.payment_status || 'pending',
          platform_fee_czk: b.platform_fee_czk || 0,
          partner_amount_czk: b.partner_amount_czk || 0,
          applied_commission_percent: b.applied_commission_percent || 10,
        };
      }) || [];
      
      setBookings(mappedBookings);

    } catch (err: any) {
      console.error('Booking management error:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Update local state
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, payment_status: newStatus } : b
      ));

    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const formatCurrency = (amount: number | null) => {
    return amount ? `${amount.toLocaleString()} CZK` : '-';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="text-red-600 shrink-0" size={20} />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        
        {/* Summary Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Total Bookings</p>
            <p className="text-xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 uppercase font-semibold">Paid</p>
            <p className="text-xl font-bold text-green-700">
              {bookings.filter(b => b.payment_status === 'paid').length}
            </p>
          </div>
          
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-600 uppercase font-semibold">Pending</p>
            <p className="text-xl font-bold text-yellow-700">
              {bookings.filter(b => b.payment_status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Listing</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform Commission</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Partner Share</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {booking.payment_status === 'pending' && <Clock size={16} className="text-yellow-600" />}
                      {booking.payment_status === 'paid' && <CheckCircle size={16} className="text-green-600" />}
                      {booking.payment_status === 'failed' && <XCircle size={16} className="text-red-600" />}
                      <div>
                        <p className="font-medium text-gray-900">#{booking.id.toString().substring(0, 8)}...</p>
                        <p className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.profiles && booking.profiles.full_name ? (
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{booking.profiles.full_name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {booking.profiles.id?.toString().substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unknown</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.properties ? (
                      <div>
                        <p className="font-medium text-gray-900">{booking.properties.title_en || booking.properties.title_cs || booking.properties.title_sq || 'Untitled'}</p>
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-medium mt-1 bg-blue-100 text-blue-800">
                          Listing
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Deleted listing</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(booking.total_price)}</p>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="text-blue-600 font-medium">{formatCurrency(booking.platform_fee_czk)}</p>
                    <p className="text-xs text-gray-500">({booking.applied_commission_percent || 10}%)</p>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="font-bold text-green-700">{formatCurrency(booking.partner_amount_czk)}</p>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.payment_status.toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {/* Admin Actions - Payment Status Override */}
                    {booking.payment_status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updatePaymentStatus(booking.id, 'paid')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Mark Paid
                        </button>
                        
                        <button
                          onClick={() => updatePaymentStatus(booking.id, 'failed')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          Refund
                        </button>
                      </div>
                    )}
                    
                    {booking.payment_status === 'paid' && (
                      <span className="text-xs text-gray-500">Completed</span>
                    )}
                    
                    {booking.payment_status === 'failed' && (
                      <span className="text-xs text-red-600 font-medium">Refunded</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <CreditCard size={48} className="text-gray-300" />
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* System-wide Summary */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold uppercase mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {(bookings.reduce((sum, b) => sum + (b.total_price || 0), 0) ?? 0).toLocaleString()} CZK
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold uppercase mb-1">Platform Earnings</p>
            <p className="text-2xl font-bold text-gray-900">
              {(bookings.reduce((sum, b) => sum + (b.platform_fee_czk || 0), 0) ?? 0).toLocaleString()} CZK
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <p className="text-sm text-green-600 font-semibold uppercase mb-1">Partner Payouts</p>
            <p className="text-2xl font-bold text-gray-900">
              {(bookings.reduce((sum, b) => sum + (b.partner_amount_czk || 0), 0) ?? 0).toLocaleString()} CZK
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
