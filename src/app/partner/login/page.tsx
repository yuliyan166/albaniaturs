'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, ShieldAlert } from 'lucide-react';

export default function PartnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function showError(msg: string) {
    setError(msg);
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Authenticate via Supabase Auth.
      const { data: authData, error: authError } = await createClient().auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        showError(authError.message);
        return;
      }
      if (!authData.user || !authData.session) {
        showError('Authentication failed.');
        return;
      }

      // Block unverified emails before doing anything else.
      const userRecord = authData.user as any;
      if (!userRecord.email_confirmed_at) {
        await createClient().auth.signOut();
        showError('Email not verified. Confirm your address before continuing.');
        return;
      }

      // Fetch profile to confirm role + admin-approval in REAL TIME.
      const supabase = createClient();
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role,is_approved')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        await createClient().auth.signOut();
        showError('No profile found. Contact an administrator.');
        return;
      }

      const role = String(profile.role ?? '');
      const isApproved = profile.is_approved === true;

      // Only admin-approved partners/hosts may enter the partner portal.
      if (role !== 'partner' && role !== 'host') {
        await createClient().auth.signOut();
        showError('Access Denied: Partner privileges required.');
        return;
      }

      if (!isApproved) {
        await createClient().auth.signOut();
        showError(`Account pending administrator approval. Contact support to proceed.`);
        return;
      }

      // Fully verified + approved — redirect safely within the partner area.
      router.replace('/partner');
    } catch (err: any) {
      showError((err as Error)?.message ?? 'An unexpected error occurred.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-4 border border-gray-300 shadow-inner">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Partner Portal</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your listings and bookings.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <p className="whitespace-pre-wrap break-words">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="partner-email" className="text-xs font-bold uppercase tracking-widest text-gray-700 ml-1">Partner Email</label>
            <input id="partner-email" type="email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label htmlFor="partner-password" className="text-xs font-bold uppercase tracking-widest text-gray-700 ml-1">Access Key</label>
            <input id="partner-password" type="password" required name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Verifying...' : 'Enter Partner Dashboard'}
          </button>

          <p className="text-xs text-center text-gray-500 pt-4">Authorized Partners Only. Activity is logged.</p>
        </form>

        {/* Link to centralized registration (role-parameterized, review-only). */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">Don't have a partner account?</p>
          <Link href="/register?role=partner" className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 px-5 py-2 rounded-lg font-medium transition-colors">Register Now</Link>
        </div>

        {/* Back to main login */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Looking for customer access?{' '}<Link href="/login" className="text-blue-600 hover:underline font-medium">Customer Login</Link></p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} AlbaniaTours Partner Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
