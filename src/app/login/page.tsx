'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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

      // Check role from profiles table
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user?.id).maybeSingle();
      const userRole = profile?.role || 'customer';

      if (userRole === 'admin') {
        // Wait for @supabase/ssr to flush session cookies to document.cookie before redirecting
        await new Promise((resolve) => setTimeout(resolve, 100));
        window.location.href = '/admin';
      } else if (userRole === 'partner') {
        // Wait for @supabase/ssr to flush session cookies to document.cookie before redirecting
        await new Promise((resolve) => setTimeout(resolve, 100));
        window.location.href = '/partner';
      } else {
        // Wait for @supabase/ssr to flush session cookies to document.cookie before redirecting
        await new Promise((resolve) => setTimeout(resolve, 100));
        window.location.href = '/';
      }

      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-600">Secure Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-100 whitespace-pre-wrap break-words">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="login-email" type="email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" />
          </div>

          <div className="space-y-1">
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="login-password" type="password" required name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50">
            {loading ? 'Authenticating...' : 'Login'}
          </button>

          <div className="mt-4 text-center">
            <Link href="/register" className="text-sm text-gray-600 hover:text-red-600 underline font-medium">Don't have an account? Register here.</Link>
          </div>
        </form>

        <footer className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">Security verified login page.</p>
          <p className="text-xs text-[color:crimson] mt-1">&#9888; All auth requests are logged and monitored.</p>
        </footer>
      </div>
    </div>
  );
}
