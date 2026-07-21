'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobileRoute = pathname.startsWith('/m/') || pathname === '/m';
  const isAdminRoute = pathname.startsWith('/admin');

  if (isMobileRoute || isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-[60px]">{children}</main>
      <Footer />
    </>
  );
}
