'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import {
  ArrowBigUpDashIcon,
  Bell,
  Building2,
  Calendar1,
  CalendarDays,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Import,
  Inbox,
  LayoutPanelLeft,
  LucideIcon,
  MailPlus,
  MapPin,
  MoveLeft,
  Settings,
  Timer,
  User,
  UserPlus,
  Users,
  Workflow,
} from 'lucide-react';

import Badge from '@/components/ui/badge';
import BusinessMenu from './business-menu';
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type SettingsLinkType = {
  label: string;
  icon: LucideIcon;
  link: string;
  requiresAdmin: boolean;
  soon: boolean;
};

const DASHBOARD_LINKS: SettingsLinkType[] = [
  {
    label: 'Inbox',
    icon: Inbox,
    link: 'inbox',
    requiresAdmin: false,
    soon: false,
  },
  {
    label: 'Overview',
    icon: LayoutPanelLeft,
    link: 'overview',
    requiresAdmin: false,
    soon: false,
  },
  {
    label: 'My Shifts',
    icon: Calendar1,
    link: 'my-shifts',
    requiresAdmin: false,
    soon: false,
  },
  {
    label: 'Schedule',
    icon: ClipboardList,
    link: 'schedule',
    requiresAdmin: false,
    soon: false,
  },
  {
    label: 'Review',
    icon: ClipboardCheck,
    link: 'review-shifts',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Employees',
    icon: Users,
    link: 'employees',
    requiresAdmin: false,
    soon: false,
  },
  {
    label: 'Requests',
    icon: Timer,
    link: 'requests',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Events',
    icon: CalendarDays,
    link: 'events',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Analytics',
    icon: ChartColumn,
    link: 'analytics',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Departments',
    icon: Building2,
    link: 'departments',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Settings',
    icon: Settings,
    link: 'settings',
    requiresAdmin: true,
    soon: false,
  },
];

const SETTINGS_LINKS: SettingsLinkType[] = [
  {
    label: 'General',
    icon: Settings,
    link: 'settings/general',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Locations',
    icon: MapPin,
    link: 'settings/locations',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Invitations',
    icon: MailPlus,
    link: 'settings/invitations',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Employees',
    icon: Users,
    link: 'settings/employees',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Billing',
    icon: ArrowBigUpDashIcon,
    link: 'settings/billing',
    requiresAdmin: true,
    soon: false,
  },
  {
    label: 'Integrations',
    icon: Workflow,
    link: 'settings/integrations',
    requiresAdmin: true,
    soon: true,
  },
  {
    label: 'Import & Exports',
    icon: Import,
    link: 'settings/imports-exports',
    requiresAdmin: true,
    soon: true,
  },
];

const USER_LINKS: SettingsLinkType[] = [
  {
    label: 'Profile',
    icon: User,
    link: 'settings/profile',
    requiresAdmin: false,
    soon: false,
  },
  {
    label: 'Notifications',
    icon: Bell,
    link: 'settings/notifications',
    requiresAdmin: false,
    soon: false,
  },
  {
    label: 'Referals',
    icon: UserPlus,
    link: 'settings/referals',
    requiresAdmin: false,
    soon: true,
  },
];

const BusinessLink = ({
  label,
  link,
  icon: Icon,
  soon,
  businessId,
  isActive,
}: SettingsLinkType & { businessId: string; isActive: boolean }) => {
  return (
    <SidebarMenuItem key={link}>
      <SidebarMenuButton
        asChild
        className={cn(
          isActive &&
            'bg-amber-100/50 text-amber-500 [&_svg]:text-amber-500 font-medium hover:bg-amber-100/50 hover:text-amber-500',
          soon &&
            'pointer-events-none text-muted-foreground [&_svg]:text-muted-foreground'
        )}
        tooltip={label}
        disabled={soon}
      >
        <Link
          className='flex items-center justify-between'
          href={`/business/${businessId}/${link}`}
        >
          <div className='flex items-center gap-2'>
            <Icon
              className='size-4 shrink-0 text-primary/75'
              strokeWidth={2.1}
            />
            <span className='group-data-[collapsible=icon]:hidden'>
              {label}
            </span>
          </div>
          {soon && (
            <Badge color='orange' className='text-xs'>
              Soon
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

type BusinessSidebarContentProps = {
  sidebarData: {
    user: {
      fullName: string | null;
      email: string;
      image: string | null;
    };
    business: {
      id: string;
      name: string;
      image: string | null;
    };
    role: {
      name: string;
    };
  };
  isAdmin: boolean;
};

const BusinessSidebarContent = ({
  sidebarData,
  isAdmin,
}: BusinessSidebarContentProps) => {
  const pathname = usePathname();
  const { businessId } = useParams<{ businessId: string }>();

  const isSettingsRoute = pathname.includes('settings');

  return (
    <>
      <SidebarHeader className='h-14'>
        {!isSettingsRoute ? (
          <BusinessMenu
            business={{ ...sidebarData.business, plan: 'Standard' }}
          />
        ) : (
          <SidebarMenuButton asChild size='lg'>
            <Link
              href={`/business/${businessId}/overview`}
              className='group-data-[collapsible=icon]:justify-center'
            >
              <MoveLeft className='size-4 mr-1' />{' '}
              <span className='group-data-[collapsible=icon]:hidden'>
                Back to Business
              </span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <h3 className='text-xs text-muted-foreground font-medium px-2.5 mb-1 group-data-[collapsible=icon]:hidden'>
              {isSettingsRoute ? 'Business' : 'General'}
            </h3>
            {(isSettingsRoute ? SETTINGS_LINKS : DASHBOARD_LINKS).map(link =>
              link.requiresAdmin && !isAdmin ? null : (
                <BusinessLink
                  key={link.link}
                  businessId={businessId}
                  isActive={pathname.includes(link.link)}
                  {...link}
                />
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
        {isSettingsRoute && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarMenu>
                <h3 className='text-xs text-muted-foreground font-medium px-2.5 mb-1 group-data-[collapsible=icon]:hidden'>
                  Your settings
                </h3>
                {USER_LINKS.map(link =>
                  link.requiresAdmin && !isAdmin ? null : (
                    <BusinessLink
                      key={link.link}
                      businessId={businessId}
                      isActive={pathname.includes(link.link)}
                      {...link}
                    />
                  )
                )}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </>
  );
};

export default BusinessSidebarContent;
