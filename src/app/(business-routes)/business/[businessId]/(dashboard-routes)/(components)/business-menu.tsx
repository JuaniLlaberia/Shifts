import Link from 'next/link';
import {
  ArrowBigUpDash,
  ChevronDown,
  LucideIcon,
  Settings,
  Users,
} from 'lucide-react';

import { SidebarMenu } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const LINKS: {
  label: string;
  icon: LucideIcon;
  link: string;
}[] = [
  {
    label: 'Settings',
    icon: Settings,
    link: 'settings/general',
  },
  {
    label: 'Upgrade',
    icon: ArrowBigUpDash,
    link: 'settings/billing',
  },
  {
    label: 'Manage employees',
    icon: Users,
    link: 'settings/employees',
  },
];

type BusinessMenuProps = {
  business: {
    id: string;
    name: string;
    plan: string;
    image: string | null;
  };
};

const BusinessMenu = async ({ business }: BusinessMenuProps) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size='lg'
              tooltip={business.name || 'Business'}
              className='justify-between group-data-[collapsible=icon]:justify-center cursor-pointer h-10!'
            >
              <div className='flex items-center justify-center gap-2.5'>
                <Avatar className='size-8'>
                  <AvatarImage src={business.image || undefined} />
                  <AvatarFallback className='bg-amber-300 text-white font-medium'>
                    {business.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h6 className='flex flex-col font-medium text-sm line-clamp-1 group-data-[collapsible=icon]:hidden'>
                  {business.name}
                </h6>
              </div>
              <ChevronDown className='size-4 data-[state=open]:rotate-180 transition-transform group-data-[collapsible=icon]:hidden' />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent side='bottom' align='start' className='p-0'>
            {/* Header */}
            <div className='flex flex-col gap-2.5 p-2.5'>
              <div className='flex items-center gap-2.5'>
                <Avatar className='size-8'>
                  <AvatarImage src={business.image || undefined} />
                  <AvatarFallback className='bg-amber-300 text-white font-medium'>
                    {business.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h6 className='flex flex-col'>
                  <span className='text-sm font-medium'>{business.name}</span>
                  <span className='text-xs text-muted-foreground'>
                    {business.plan} plan
                  </span>
                </h6>
              </div>
            </div>
            <Separator />
            {/* General employee links */}
            <ul className='p-2 text-muted-foreground'>
              {LINKS.map(({ label, icon: Icon, link }) => (
                <li key={link}>
                  <Link
                    href={`/busoness/${business.id}/${link}`}
                    className={cn(
                      buttonVariants({ size: 'sm', variant: 'ghost' }),
                      'size-full justify-start text-[13px] px-2 py-1 rounded-md text-muted-foreground'
                    )}
                  >
                    <Icon className='size-4' />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default BusinessMenu;
