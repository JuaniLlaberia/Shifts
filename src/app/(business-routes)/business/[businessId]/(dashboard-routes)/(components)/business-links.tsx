'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
  Building2,
  Calendar1,
  CalendarDays,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Inbox,
  LayoutPanelLeft,
  LucideIcon,
  Settings,
  Timer,
  Users,
} from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const LINKS: {
  label: string;
  icon: LucideIcon;
  link: string;
  requiresAdmin: boolean;
}[] = [
  {
    label: 'Inbox',
    icon: Inbox,
    link: 'inbox',
    requiresAdmin: false,
  },
  {
    label: 'Overview',
    icon: LayoutPanelLeft,
    link: 'overview',
    requiresAdmin: false,
  },
  {
    label: 'My Shifts',
    icon: Calendar1,
    link: 'my-shifts',
    requiresAdmin: false,
  },
  {
    label: 'Schedule',
    icon: ClipboardList,
    link: 'schedule',
    requiresAdmin: false,
  },
  {
    label: 'Review',
    icon: ClipboardCheck,
    link: 'review-shifts',
    requiresAdmin: true,
  },
  {
    label: 'Employees',
    icon: Users,
    link: 'employees',
    requiresAdmin: false,
  },
  {
    label: 'Requests',
    icon: Timer,
    link: 'requests',
    requiresAdmin: true,
  },
  {
    label: 'Events',
    icon: CalendarDays,
    link: 'events',
    requiresAdmin: true,
  },
  {
    label: 'Analytics',
    icon: ChartColumn,
    link: 'analytics',
    requiresAdmin: true,
  },
  {
    label: 'Departments',
    icon: Building2,
    link: 'departments',
    requiresAdmin: true,
  },
  {
    label: 'Settings',
    icon: Settings,
    link: 'settings',
    requiresAdmin: true,
  },
];

const BusinessLinks = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname();
  const { businessId } = useParams<{ businessId: string }>();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {LINKS.map(({ label, icon: Icon, link, requiresAdmin }) =>
          requiresAdmin && !isAdmin ? null : (
            <SidebarMenuItem key={link}>
              <SidebarMenuButton
                asChild
                className={cn(
                  pathname.includes(link) &&
                    'bg-amber-100/50 text-amber-500 [&_svg]:text-amber-500 font-medium hover:bg-amber-100/50 hover:text-amber-500'
                )}
                tooltip={label}
              >
                <Link href={`/business/${businessId}/${link}`}>
                  <Icon
                    className='size-4 shrink-0 text-primary/75'
                    strokeWidth={2.1}
                  />
                  <span className='group-data-[collapsible=icon]:hidden'>
                    {label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default BusinessLinks;
