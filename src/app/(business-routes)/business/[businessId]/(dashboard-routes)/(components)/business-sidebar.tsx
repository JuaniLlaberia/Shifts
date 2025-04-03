import { notFound } from 'next/navigation';

import BusinessLinks from './business-links';
import BusinessMenu from './business-menu';
import EmployeeMenu from './employee-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { getBusinessSidebarData } from '@/access-data/business/get-business-sidebar-data';

const BusinessSidebar = async ({ businessId }: { businessId: string }) => {
  const { sidebarData, isAdmin } = await getBusinessSidebarData({
    businessId,
  });
  if (!sidebarData) return notFound();

  return (
    <Sidebar side='left' collapsible='icon'>
      <SidebarHeader className='h-14'>
        <BusinessMenu
          business={{ ...sidebarData.business, plan: 'Standard' }}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <BusinessLinks isAdmin={isAdmin} />
        <SidebarGroup />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <EmployeeMenu
          business={sidebarData.business}
          role={sidebarData.role}
          user={sidebarData.user}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default BusinessSidebar;
