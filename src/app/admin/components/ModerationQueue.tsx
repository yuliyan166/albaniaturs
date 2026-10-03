'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  UserPlus, Users, AlertCircle, CheckCircle, XCircle,
  Building2, MapPin, Clock, RefreshCw, Eye
} from 'lucide-react';

export default function ModerationQueue() {
  const [pendingPartners, setPendingPartners] = useState<any[]>([]);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    checkModerationData();
  }, []);

  const checkModerationData = async () => {
    try {
      // Load pending partners: role='partner' AND is_approved=false
      const { data: partners, error: partnersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'partner')
        .eq('is_approved', false);

      if (!partnersError && partners) {
        setPendingPartners(partners);
      }

      // Load pending listings: status='pending' with host profile join
      const { data: listings, error: listingsError } = await supabase
        .from('properties')
        .select('*, profiles!host_id(id, full_name)')
        .eq('status', 'pending');

      if (!listingsError && listings) {
        setPendingListings(listings);
      }
    } catch (err) {
      console.error('Moderation data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const approvePartner = async (userId: string) => {
    try {
      // Set is_approved=true so the partner can access the portal
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId);

      if (error) throw error;

      setPendingPartners(prev => prev.filter(p => p.id !== userId));
    } catch (err: any) {
      alert('Failed to approve partner: ' + err.message);
    }
  };

  const rejectPartner = async (userId: string) => {
    if (!confirm('Reject this partner application?')) return;

    try {
      // Delete the profile row entirely to reject
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setPendingPartners(prev => prev.filter(p => p.id !== userId));
    } catch (err: any) {
      alert('Failed to reject partner: ' + err.message);
    }
  };

  const approveListing = async (listingId: string, newStatus: 'active' | 'rejected') => {
    try {
      // Update property status — only 'active' is valid per DB check constraint
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (error) throw error;

      // Remove from pending list
      setPendingListings(prev => prev.filter(l => l.id !== listingId));
    } catch (err: any) {
      alert('Failed to update listing: ' + err.message);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'accommodation': return 'Accommodation';
      case 'car_rental': return 'Car Rental';
      case 'excursion': return 'Excursion';
      case 'transfer': return 'Transfer';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto text-blue-600" size={32} />
          <p className="mt-4 text-gray-600">Loading moderation queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Moderation Queue</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending Partners</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{pendingPartners.length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <Users className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending Listings</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{pendingListings.length}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <Building2 className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Partners Section */}
      {pendingPartners.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Pending Partner Applications
          </h3>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {pendingPartners.map((partner) => (
              <div key={partner.id} className="p-5 border-b last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                    {partner.full_name?.charAt(0) || '?'}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{partner.full_name}</h4>
                    <p className="text-sm text-gray-500 mb-2">Partner Application</p>

                    {/* Partner Details */}
                    {partner.created_at && (
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>Applied on: {new Date(partner.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => approvePartner(partner.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>

                    <button
                      onClick={() => rejectPartner(partner.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Listings Section */}
      {pendingListings.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-purple-600" />
            Pending Listings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Listing Image */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.titles?.en} className="w-full h-full object-cover" />
                  ) : (
                    <MapPin size={48} className="mx-auto text-gray-300 mt-8" />
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> Pending
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {listing.titles?.bg || listing.titles?.en || listing.title_en || 'Untitled'}
                  </h4>

                  {/* Category Badge */}
                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-3 ${
                    listing.category === 'accommodation' ? 'bg-purple-100 text-purple-800' :
                    listing.category === 'car_rental' ? 'bg-blue-100 text-blue-800' :
                    listing.category === 'excursion' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {getCategoryLabel(listing.category)}
                  </span>

                  {/* Price & Capacity */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-gray-900">{listing.price_czk} CZK</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveListing(listing.id, 'active')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle size={14} />
                      APPROVE
                    </button>

                    <button
                      onClick={() => approveListing(listing.id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <XCircle size={14} />
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {pendingPartners.length === 0 && pendingListings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <CheckCircle size={48} className="mx-auto text-green-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
          <p className="text-gray-500 mt-1">No pending partnerships or listings to moderate.</p>
        </div>
      )}
    </div>
  );
}
