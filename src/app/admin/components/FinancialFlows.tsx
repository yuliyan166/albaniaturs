'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  Wallet, Calendar, RefreshCw, ArrowRightLeft
} from 'lucide-react';

// Period options for financial analytics
const PERIODS = [
  { id: 'day', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
];

export default function FinancialFlows() {
  const [period, setPeriod] = useState('month');
  const [financials, setFinancials] = useState({
    totalRevenue: 0,
    platformCommission: 0,
    partnerPayouts: 0,
    activeBookings: 0
  });
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    loadFinancialData();
  }, [period]);

  const loadFinancialData = async () => {
    try {
      // TODO: Replace with actual period-based filtering when date fields are confirmed
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*');

      if (error) throw error;

      if (!bookings || bookings.length === 0) {
        setFinancials({
          totalRevenue: 0,
          platformCommission: 0,
          partnerPayouts: 0,
          activeBookings: 0
        });
        return;
      }

      // Calculate financial metrics from bookings data
      const totalRevenue = bookings.reduce((sum, b) => 
        sum + (b.total_price_czk || 0), 0);
      
      const platformCommission = bookings.reduce((sum, b) => 
        sum + (b.platform_fee_czk || 0), 0);
        
      const partnerPayouts = totalRevenue - platformCommission;
      const activeBookings = bookings.filter(b => b.payment_status === 'paid').length;

      setFinancials({
        totalRevenue,
        platformCommission,
        partnerPayouts,
        activeBookings
      });

    } catch (err: any) {
      console.error('Financial data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodFilter = () => {
    switch(period) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'All Time';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Flows</h2>
        
        {/* Period Selector */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
        >
          {PERIODS.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="text-green-600" size={24} />
            <span className="text-xs text-gray-500 font-medium uppercase">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{(financials.totalRevenue ?? 0).toLocaleString()} CZK</p>
          <p className="text-sm text-green-600 mt-1">Platform-wide sales ({getPeriodFilter()})</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="text-blue-600" size={24} />
            <span className="text-xs text-gray-500 font-medium uppercase">Platform Commission</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{(financials.platformCommission ?? 0).toLocaleString()} CZK</p>
          <p className="text-sm text-blue-600 mt-1">Earned by AlbaniaTours</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Wallet className="text-purple-600" size={24} />
            <span className="text-xs text-gray-500 font-medium uppercase">Partner Payouts</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{(financials.partnerPayouts ?? 0).toLocaleString()} CZK</p>
          <p className="text-sm text-purple-600 mt-1">Due to partners ({getPeriodFilter()})</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="text-orange-600" size={24} />
            <span className="text-xs text-gray-500 font-medium uppercase">Active Bookings</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{financials.activeBookings}</p>
          <p className="text-sm text-orange-600 mt-1">Confirmed reservations</p>
        </div>
      </div>

      {/* Commission Breakdown Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingDown size={20} />
          Commission Breakdown by Category
        </h3>

        {/* Placeholder - Implement with actual category commission rates */}
        {[ 'Accommodation (10%)', 'Car Rentals (12%)', 'Excursions (15%)', 'Transfers (8%)' ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
            <span className="text-gray-700 font-medium">{item}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Active Partners: 0</span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    idx === 0 ? 'bg-purple-500' : 
                    idx === 1 ? 'bg-blue-500' :
                    idx === 2 ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${(idx + 1) * 15}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Payout Status Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRightLeft size={20} />
          Payout Status & Settlements
        </h3>

        {/* Placeholder - Implement actual payout settlement UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">Completed Payouts</p>
            <p className="text-2xl font-bold text-green-900 mt-1">Total: {(financials.partnerPayouts ?? 0).toLocaleString()} CZK</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800">Pending Payouts</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">0 Partners</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800">Next Payout Date</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">Monthly (Auto)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
