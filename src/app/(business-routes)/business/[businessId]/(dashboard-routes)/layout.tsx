import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import BusinessSidebar from './(components)/business-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import BusinessNavbar from './(components)/business-navbar';

const BusinessDashboardLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessId: string }>;
}) => {
  const cookiesStore = await cookies();
  const defaultOpen = cookiesStore.get('sidebar_state')?.value === 'true';

  const { businessId } = await params;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <BusinessSidebar businessId={businessId} />
      <main className='w-full min-h-screen bg-background-2'>
        <BusinessNavbar businessId={businessId} />
        <div className='p-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default BusinessDashboardLayout;
