'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function PartnerRegisterPage() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create the user account in Supabase Auth first
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        // Handle duplicate email error gracefully
        if (authError.message?.toLowerCase().includes('already registered') || authError.message?.toLowerCase().includes('user already')) {
          setError(`An account with this email (${email}) is already registered. Please try logging in instead.`);
          setLoading(false);
          return;
        }
        throw new Error(authError.message);
      }

      if (data.user) {
        // Insert a profile record flagged explicitly as 'partner' with status 'pending'
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: companyName,
          phone_number: phone,
          business_type: businessType,
          role: 'partner',
          status: 'pending', // Awaiting manual review / approval
        });

        if (profileError) throw new Error(profileError.message);
      }

      alert('Your partner application has been submitted. An administrator will review your details shortly.');
      router.push('/login');
    } catch (err: any) {
      setError(
        err.message || 'There was an error processing your partner application.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-red-600 mb-2 tracking-tight">Partner Registration</h1>
          <p className="text-sm text-gray-500">
            Become a service provider on AlbaniaTours. Applications are reviewed before approval.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name / Company Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name / Company Name</label>
            <input
              type="text" required value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
          </div>

          {/* Business Email */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="you@yourbusiness.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel" required value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder="+355 ..."
            />
          </div>

          {/* Business Type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select required value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white">
              <option value="">Select...</option>
              <option value="accommodation">Accommodation</option>
              <option value="car_rental">Car Rental</option>
              <option value="tour_guide">Tour Guide</option>
              <option value="transfer_service">Transfer Service</option>
            </select>
          </div>

          {/* Notice */}
          <p className="text-[11px] text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
            By registering as a partner, you acknowledge that all submissions are reviewed manually for approval. Misrepresentation can lead to account suspension.
          </p>

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading ? 'Processing...' : 'Submit Partner Application'}
          </button>

          {/* Link back to customer registration */}
          <div className="text-center pt-4 border-t border-gray-100 text-sm">
            Looking for a traveler account?{' '}
            <Link href="/register" className="text-red-600 hover:underline font-medium">Return to Visitor Registration</Link>
          </div>
        </form>

        {/* Legal */}
        <footer className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} AlbaniaTours Partner Program. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
