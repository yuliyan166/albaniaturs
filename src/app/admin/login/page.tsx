'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldAlert, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Authenticate using Supabase Auth first
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Check admin role from profiles table
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user?.id).maybeSingle();

      if (profile?.role === 'admin') {
        // Wait for @supabase/ssr to flush session cookies to document.cookie before redirecting
        await new Promise((resolve) => setTimeout(resolve, 100));
        window.location.href = '/admin';
      } else {
        setError('Access Denied: Administrator privileges required.');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-xl mb-4 border border-slate-700 shadow-inner">
            <Lock className="text-red-500" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Administrator Portal</h1>
          <p className="text-slate-400 mt-2 text-sm">Secure Access Only. Authorized Personnel.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-lg flex items-start gap-3 text-red-200 text-sm">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <p className="whitespace-pre-wrap break-words">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Administrator Email</label>
            <input id="admin-email" type="email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
            <input id="admin-password" type="password" required name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Verifying...' : 'Enter Command Center'}
          </button>

          <p className="text-xs text-center text-slate-500 pt-4">Authorized Personnel Only. All activity is logged and monitored.</p>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">&#169; {new Date().getFullYear()} AlbaniaTours Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
