'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ModerationQueue from './components/ModerationQueue';
import FinancialFlows from './components/FinancialFlows';
import GlobalAnalytics from './components/GlobalAnalytics';
import BookingManagement from './components/BookingManagement';
import { Users, Building2, DollarSign, TrendingUp, AlertCircle, Activity, Calendar, LogOut } from 'lucide-react';

// Define tabs for admin dashboard
const TABS = [
  { id: 'moderation', label: 'Moderation Queue', icon: AlertCircle },
  { id: 'financials', label: 'Financial Flows', icon: DollarSign },
  { id: 'analytics', label: 'Global Analytics', icon: Activity },
  { id: 'bookings', label: 'Bookings & Payments', icon: Calendar }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('moderation');
  const [pendingPartnersCount, setPendingPartnersCount] = useState(0);
  const [pendingListingsCount, setPendingListingsCount] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  useEffect(() => {
    checkSessionAndCounts();
  }, []);

  const checkSessionAndCounts = async () => {
    try {
      // Check session
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/admin/login';
        return;
      }
      
      // Get admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profile?.role !== 'admin') {
        window.location.href = '/admin/login';
        return;
      }

      // Get counts for stats
      const { count: pendingPartners } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'pending');
        
      setPendingPartnersCount(pendingPartners || 0);

      const { count: pendingListings } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');
        
      setPendingListingsCount(pendingListings || 0);
    } catch (err) {
      console.error('Admin dashboard error:', err);
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
          
          {/* Navigation Tabs */}
          <nav className="flex gap-2 ml-8">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Partners</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{pendingPartnersCount}</p>
            </div>
            <Users className="text-blue-600 bg-blue-50 p-3 rounded-lg" size={24} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Listings</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{pendingListingsCount}</p>
            </div>
            <Building2 className="text-purple-600 bg-purple-50 p-3 rounded-lg" size={24} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-3xl font-bold text-green-600 mt-1">...</p>
            </div>
            <DollarSign className="text-green-600 bg-green-50 p-3 rounded-lg" size={24} />
          </div>
        </div>

        {/* Dynamic Content Based on Tab */}
        {activeTab === 'moderation' && (
          <ModerationQueue />
        )}

        {activeTab === 'financials' && (
          <FinancialFlows />
        )}

        {activeTab === 'analytics' && (
          <GlobalAnalytics />
        )}

        {activeTab === 'bookings' && (
          <BookingManagement />
        )}

      </main>
    </div>
  );
}
