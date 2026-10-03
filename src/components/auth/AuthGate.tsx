'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/** AuthGate: defense-in-depth gate enforcing both email verification AND admin approval. */

type GateReason = 'unverified_email' | 'dismissable_pending_approval' | 'session_missing';

interface AuthGateProps {
  children: React.ReactNode;
  /** Roles allowed to reach the protected content (e.g. ['admin','partner']). Unmatched → redirect. */
  requiredRoles?: readonly string[];
}

const PUBLIC_WHEN_UNVERIFIED = new Set([
  '/login',
  '/register',
  '/reset-password',
]);

export default function AuthGate({ children, requiredRoles }: AuthGateProps) {
  const [status, setStatus] = useState<'loading' | GateReason>('unverified_email');
  const router = useRouter();

  // We intentionally do NOT early-return or render children here on failure.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function verify() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          setStatus('session_missing');
          return;
        }

        // Every route behind this gate must be on a verified-email account.
        if (!sessionData.session.user?.email_confirmed_at) {
          setStatus('unverified_email');
          return;
        }

        // Fetch profile to enforce role + admin-approval invariants server-side.
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role,is_approved')
          .eq('id', sessionData.session.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          setStatus('session_missing');
          return;
        }

        // Partner/host roles MUST be explicitly approved before touching secured areas.
        const isPrivileged = ['admin', 'partner', 'host'].includes(profile.role);
        const needsApproval = profile.is_approved !== true && (isPrivileged || requiredRoles?.some(r => ['partner','host'].includes(r)));

        if ((requiredRoles && !requiredRoles.includes(profile.role)) || needsApproval) {
          setStatus('dismissable_pending_approval');
          return;
        }

        // Fully verified + authorized — allow render.
        setStatus(null as unknown as GateReason);
      } catch {
        setStatus('session_missing');
      } finally {
        if (!cancelled) {
          setTimeout(() => setStatus(status), 0);
        }
      }
    }

    // Never show protected UI during checks.
    void verify();

    return () => { cancelled = true; };
  }, [router]);

  function renderContent() {
    if (status === null) return children;

    // Handle loading state before accessing reasonText (which only has GateReason keys).
    if (status === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Verifying authentication...</p>
          </div>
        </div>
      );
    }

    const reasonText: Record<GateReason, string> = {
      unverified_email: 'Your email must be confirmed before accessing this page.',
      dismissable_pending_approval: 'Access is pending administrator approval. Contact support to proceed.',
      session_missing: 'You need to sign in or your session has expired.',
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-xl font-bold mb-4 text-red-700">Access Blocked</h2>
          <p className="text-gray-600 break-words">{reasonText[status ?? 'session_missing']}</p>
        </div>
      </div>
    );
  }

  return renderContent();
}
