'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Since admin/page.tsx is now a purely client component with its own session checks,
  // this layout simply renders children without any server-side guards.
  // All authentication and authorization is handled directly in the page component.
  
  return <>{children}</>;
}
