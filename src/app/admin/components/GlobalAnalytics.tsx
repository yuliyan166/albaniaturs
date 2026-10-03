'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users, Building2, TrendingUp, MapPin, RefreshCw,
  CheckCircle, Clock, BookOpen
} from 'lucide-react';

export default function GlobalAnalytics() {
  const [stats, setStats] = useState({
    totalPartners: 0,
    activeListings: 0,
    pendingListings: 0,
    totalBookings: 0,
    completedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    loadGlobalStats();
  }, []);

  const loadGlobalStats = async () => {
    try {
      // Get total partners (host and partner roles)
      const { count: partners } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .in('role', ['partner', 'host']);

      // Get listings stats
      const { count: totalListings } = await supabase
        .from('properties')
        .select('*', { count: 'exact' });
        
      const { count: activeListings } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'active');
        
      const { count: pendingListings } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      // Get bookings stats
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' });
        
      const { count: completedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('payment_status', 'paid');

      setStats({
        totalPartners: partners ?? 0,
        activeListings: activeListings ?? 0,
        pendingListings: pendingListings ?? 0,
        totalBookings: totalBookings ?? 0,
        completedBookings: completedBookings ?? 0
      });

    } catch (err) {
      console.error('Global stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-green-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Global System Analytics</h2>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <Users className="text-blue-600 mx-auto mb-3" size={32} />
          <p className="text-sm text-gray-500">Total Partners</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalPartners}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <Building2 className="text-purple-600 mx-auto mb-3" size={32} />
          <p className="text-sm text-gray-500">Active Listings</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{stats.activeListings}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <MapPin className="text-yellow-600 mx-auto mb-3" size={32} />
          <p className="text-sm text-gray-500">Pending Listings</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pendingListings}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <BookOpen className="text-orange-600 mx-auto mb-3" size={32} />
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{stats.totalBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <CheckCircle className="text-green-600 mx-auto mb-3" size={32} />
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.completedBookings}</p>
        </div>
      </div>

      {/* Platform Activity Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <RefreshCw size={20} />
          Recent Platform Activity
        </h3>

        {/* Placeholder - Implement actual recent activity feed */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Clock className="text-blue-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">New partner application received</p>
                <p className="text-sm text-gray-500">{item * 12} minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Distribution */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Listings by Category
        </h3>

        {/* Placeholder - Implement actual category distribution chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Accommodations', count: 45, color: 'bg-purple-500' },
            { label: 'Car Rentals', count: 32, color: 'bg-blue-500' },
            { label: 'Excursions', count: 18, color: 'bg-green-500' },
            { label: 'Transfers', count: 28, color: 'bg-orange-500' }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-24">{item.label}</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${item.color} transition-all`}
                  style={{ width: `${(item.count / 50) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900 w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
