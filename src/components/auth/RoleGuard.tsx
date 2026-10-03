'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * RoleGuard: enforces BOTH email verification AND admin approval before any
 * protected route renders. Any failure → hard redirect to login with the
 * reason embedded in the URL for diagnostics.
 */

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: readonly string[];
}

const APPROVAL_REQUIRED_ROLES = new Set(['admin', 'partner', 'host']);
export const ADMIN_APPROVAL_FLAG = 'is_approved'; // enforced server-side too

function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    async function guard() {
      try {
        // Step 1 — session must exist AND be email-verified.
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (error || !sessionData?.session) {
          router.replace('/login?reason=auth_required');
          return;
        }

        // Block any account whose email has NOT been confirmed via Supabase Auth.
        const u = sessionData.session.user as any;
        if (!u?.email_confirmed_at) {
          router.replace('/login?reason=email_unverified');
          return;
        }

        // Step 2 — profile + role/approval check. This is the critical security gate.
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role,is_approved')
          .eq('id', u.id)
          .maybeSingle();

        // Never trust a missing/erroring profile — force login.
        if (profileError || !profile) {
          router.replace('/login?reason=profile_missing');
          return;
        }

        const role = String(profile.role ?? '');
        const isApproved = profile.is_approved === true;

        // Partner/host accounts MUST be admin-approved before accessing anything.
        if ((APPROVAL_REQUIRED_ROLES.has(role)) && !isApproved) {
          router.replace('/partner/login?reason=pending_approval');
          return;
        }

        // Final allow-check: requested role must match. Any mismatch → login.
        if (!allowedRoles.includes(role)) {
          router.replace('/login?reason=role_mismatch');
          return;
        }

        // If we reach here the session is verified AND authorized — render children.
        setChecked(true);
      } catch {
        router.replace('/login?reason=guard_error');
      } finally {
        if (!cancelled) {
          /* keep component mounted until resolved */
        }
      }

      return () => { cancelled = true; };
    }

    void guard();
  }, [router, allowedRoles]);

  // NEVER render protected content while checks are pending.
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default RoleGuard;
