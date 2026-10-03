'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * PartnerLayout: ZERO trust gate. Every request is rejected unless the user has
 * a VERIFIED email AND an ADMIN-approved partner role record. Unverified or
 * pending-approval sessions are redirected to /partner/login with a reason, and
 * protected content NEVER renders during async validation.
 */

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const [permitted, setPermitted] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  // Skip the guard for the login page itself (users must be able to reach it).
  if (pathname === '/partner/login') {
    return <section className="min-h-screen bg-gray-50">{children}</section>;
  }

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function validatePartnerAccess() {
      try {
        // Step 1 — session MUST exist and be email-verified.
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          router.replace('/partner/login?reason=auth_required');
          return;
        }

        const user = sessionData.session.user as any;
        if (!user?.email_confirmed_at) {
          // Block unverified emails immediately.
          await supabase.auth.signOut();
          router.replace('/login?reason=email_unverified');
          return;
        }

        // Step 2 — strict profile lookup for role + approval state.
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role,is_approved')
          .eq('id', user.id)
          .maybeSingle();

        // Missing or errored profile → reject absolutely.
        if (profileError || !profile) {
          router.replace('/login?reason=profile_missing');
          return;
        }

        const role = String(profile.role ?? '');
        const isApproved = profile.is_approved === true;

        // CRITICAL: Partner/host roles must be EXPLICITLY approved by an admin.
        if (role !== 'partner' && role !== 'host') {
          router.replace('/login?reason=non_partner');
          return;
        }

        // Pending-approval partners NEVER reach protected content.
        if (!isApproved) {
          router.replace('/partner/login?reason=pending_approval');
          return;
        }

        // Fully validated — permit render (after async completes).
        setPermitted(true);
      } catch {
        router.replace('/login?reason=validation_error');
      } finally {
        if (!cancelled) {
          /* keep component pinned until validation resolves */
        }
        return () => void cancelled;
      }

      // Final cleanup marker.
    }

    void validatePartnerAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // NEVER render partner UI while checks are unresolved or denied.
  if (!permitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Validating partner access…</p>
        </div>
      </div>
    );
  }

  return <section className="min-h-screen bg-gray-50">{children}</section>;
}
