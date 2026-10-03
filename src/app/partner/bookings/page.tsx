'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  CalendarCheck, CalendarX, Clock, CreditCard, Users, DollarSign,
  MapPin, FileText, AlertCircle, CheckCircle, XCircle, ChevronDown
} from 'lucide-react';

// Booking status options
const STATUS_FILTERS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'pending', label: 'Pending Approval' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'cancelled', label: 'Cancelled' }
];

export default function PartnerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSessionAndLoadBookings = async () => {
      try {
        // Check session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!session) {
          window.location.href = '/partner/login';
          return;
        }
        
        // Verify partner/host role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (!profile || (profile.role !== 'partner' && profile.role !== 'host')) {
          window.location.href = '/login';
          return;
        }

        // Load partner's bookings using properties table join
        const { data: partnerBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            status,
            total_price,
            created_at,
            property_id,
            renter_id,
            properties (
              id,
              title_sq,
              title_en,
              title_cs,
              images,
              owner_id
            )
          `)
          .eq('properties.owner_id', session.user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Error loading bookings:', bookingsError);
          return;
        }
        
        // Normalize to match UI expectations
        const normalized = (partnerBookings || []).map((b: any) => ({
          ...b,
          payment_status: b.status || 'pending',
          total_price_czk: b.total_price || 0,
          platform_fee_czk: Math.round((b.total_price || 0) * 0.1),
          partner_amount_czk: Math.round((b.total_price || 0) * 0.9),
          applied_commission_percent: 10,
        }));
        
        setBookings(normalized);
        setFilteredBookings(normalized);

      } catch (err: any) {
        console.error('Partner bookings error:', err);
        window.location.href = '/partner/login';
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndLoadBookings();
  }, [supabase]);

  // Filter bookings by status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(b => b.payment_status === statusFilter)
      );
    }
  }, [statusFilter, bookings]);

  const updateBookingStatus = async (bookingId: string, newStatus: 'pending' | 'paid' | 'cancelled' | 'failed') => {
    setUpdatingBookingId(bookingId);

    try {
      // Update booking status
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
      console.error('Error updating booking:', err);
      alert(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Helper to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Bookings Management</h1>
          <Link 
            href="/partner"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Status Filter Dropdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Filter Bookings</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {STATUS_FILTERS.map(status => (
                <option key={status.id} value={status.id}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{filteredBookings.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-500">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {filteredBookings.filter(b => b.payment_status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {filteredBookings.filter(b => b.payment_status === 'paid').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {(filteredBookings.reduce((sum, b) => sum + (b.total_price || 0), 0) ?? 0).toLocaleString()} CZK
            </p>
          </div>
        </div>

        {/* Bookings List */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking History</h2>
        
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Booking Header */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {booking.payment_status === 'pending' && (
                      <Clock className="text-yellow-600" size={24} />
                    )}
                    {booking.payment_status === 'paid' && (
                      <CheckCircle className="text-green-600" size={24} />
                    )}
                    {booking.payment_status === 'failed' && (
                      <XCircle className="text-red-600" size={24} />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Booking #{booking.id.toString().substring(0, 8)}...
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                        {booking.payment_status.toUpperCase()}
                      </span>
                </div>

                {/* Booking Details */}
                <div className="p-5">
                  {/* Property Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {booking.properties?.images && booking.properties.images.length > 0 ? (
                        <img
                          src={booking.properties.images[0]}
                          alt={booking.properties.title_en || 'Property'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText size={32} className="text-gray-400" />
                          )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{booking.properties?.title_en || booking.properties?.title_cs || booking.properties?.title_sq || 'Unknown Property'}</h4>
                      <p className="text-sm text-gray-500">
                        {(booking.total_price ?? 0).toLocaleString()} CZK
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  {booking.renter_id && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Customer Information</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="block text-gray-500 text-xs uppercase tracking-wide">Renter ID</span>
                          <p className="text-gray-900 font-medium">{booking.renter_id.toString().substring(0, 8)}...</p>
                        </div>
                        {booking.booking_details && (
                          <>
                            <div>
                              <span className="block text-gray-500 text-xs uppercase tracking-wide">Details</span>
                            <p className="text-gray-900">{JSON.stringify(booking.booking_details)}</p>
                          </div>
                          </>
                        )}
                        <div>
                          <span className="block text-gray-500 text-xs uppercase tracking-wide">Applied Commission</span>
                          <p className="text-gray-900 font-medium">{booking.applied_commission_percent || 10}%</p>
                          <p className="text-green-600 text-sm">
                            Partner gets: {(booking.partner_amount_czk ?? 0).toLocaleString()} CZK
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {booking.payment_status === 'pending' && (
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'paid')}
                        disabled={updatingBookingId === booking.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {updatingBookingId === booking.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Confirm Booking
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'failed')}
                        disabled={updatingBookingId === booking.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <CalendarCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="text-gray-500 mt-1">
              {statusFilter === 'all'
                ? 'New bookings will appear here once customers reserve your listings.'
                : `No ${statusFilter} bookings found.`}
            </p>
          </div>
        )}

        {/* iCal Sync Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar & Availability</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <CalendarX className="text-blue-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">iCal Synchronization</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Connect your booking calendar to external platforms like Airbnb or Booking.com using iCal sync.
                  When enabled, your availability will update automatically across all connected services.
                </p>
                
                {/* Calendar URL Input */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">iCal Feed URL (for external sync)</label>
                  <p className="text-xs text-gray-500 mb-3">
                    Copy this URL and paste it into your external calendar platform for automated syncing:
                  </p>
                  
                  <div className="flex gap-2">
                    <code className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono truncate" title="Your iCal URL will appear here when you configure it">
                      Your iCal URL will be generated for each property
                    </code>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => alert('iCal sync configuration coming soon!')}
                    >
                      Configure iCal
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Note: iCal sync requires a premium partnership tier. Contact support to enable automated calendar synchronization.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
