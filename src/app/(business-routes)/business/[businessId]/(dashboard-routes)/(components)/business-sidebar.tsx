import { notFound } from 'next/navigation';

import {
  Sidebar,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { getBusinessSidebarData } from '@/access-data/business/get-business-sidebar-data';
import BusinessSidebarContent from './business-sidebar-content';
import EmployeeMenu from './employee-menu';

const BusinessSidebar = async ({ businessId }: { businessId: string }) => {
  const { sidebarData, isAdmin } = await getBusinessSidebarData({
    businessId,
  });
  if (!sidebarData) return notFound();

  return (
    <Sidebar side='left' collapsible='icon'>
      <BusinessSidebarContent sidebarData={sidebarData} isAdmin={isAdmin} />
      <SidebarSeparator />
      <SidebarFooter className='h-14'>
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
