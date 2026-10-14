'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Role = 'customer' | 'partner';

const ALLOWED_ROLES: ReadonlySet<Role> = new Set<Role>(['customer', 'partner']);

function isAllowedRole(value: unknown): value is Role {
  return typeof value === 'string' && ALLOWED_ROLES.has(value as Role);
}

// SearchParamsReader — always rendered inside Suspense boundary.
function SearchParamsReader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  // Initialize role from URL param or UI toggle — trusted for writes now.
  const [role, setRole] = useState<Role>('customer');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync form role from URL on mount and whenever query params change.
  useEffect(() => {
    const r = searchParams.get('role');
    if (isAllowedRole(r)) setRole(r);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName ?? '',
            role, // 'partner' or 'customer'
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      if (!data.user) throw new Error('Signup response missing user.');

      const message =
        role === 'customer'
          ? 'Registration successful! Please check your email for verification.'
          : 'Partner application submitted! An administrator will review your details shortly.';

      alert(message);
      router.push('/login');
    } catch (err: any) {
      setError((err as Error)?.message ?? 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Role Selector Tabs — drives both UI AND writes. */}
        <div className="mb-6">
          <div className="flex rounded-lg bg-gray-100 p-1">
            {(['customer', 'partner'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
                  role === r ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r === 'customer' ? 'Customer' : 'Partner / Host'}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Sign up to browse and book accommodations, tours, and car rentals in Albania.
            Partner applications are reviewed manually before approval.
          </p>
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mt-2">Join as a traveler or apply as a business partner.</p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 whitespace-pre-wrap break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {([
            { label: 'Full Name', key: 'fullName' as const, type: 'text' },
            { label: 'Email Address', key: 'email' as const, type: 'email' },
            { label: 'Password', key: 'password' as const, type: 'password' },
          ]).map((field) => (
            <div className="space-y-1" key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                required
                type={field.type}
                value={formData[field.key]}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>
          ))}

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <div className="text-center pt-4 border-t border-gray-100 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-red-600 hover:underline font-medium">Login</Link>
          </div>
        </form>

        {role === 'partner' && (
          <p className="mt-6 text-xs text-gray-500 leading-relaxed pt-4 border-t border-gray-100">
            By registering as a partner, you acknowledge that all submissions are reviewed
            manually for approval. Misrepresentation can lead to account suspension.
          </p>
        )}
      </div>
    </div>
  );
}

// Default export wraps useSearchParams in a Suspense boundary for prerendering.
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-6" />
          <div className="h-32 bg-gray-200 rounded mb-6" />
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    }>
      <SearchParamsReader />
    </Suspense>
  );
}
