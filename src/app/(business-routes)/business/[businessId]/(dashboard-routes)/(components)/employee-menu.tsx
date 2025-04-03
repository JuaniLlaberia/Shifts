import Link from 'next/link';
import {
  ChevronDown,
  CircleHelp,
  Earth,
  ExternalLink,
  LogOut,
  LucideIcon,
  Palette,
  Settings,
} from 'lucide-react';

import { SidebarMenu } from '@/components/ui/sidebar';
import { signOut } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
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
    label: 'Themes',
    icon: Palette,
    link: 'settings/profile#themes',
  },
  {
    label: 'Settings',
    icon: Settings,
    link: 'settings/profile',
  },
  {
    label: 'Language',
    icon: Earth,
    link: 'settings/profile#language',
  },
];

type EmployeeMenuProps = {
  user: {
    fullName: string | null;
    email: string;
    image: string | null;
  };
  business: {
    id: string;
    name: string;
  };
  role: {
    name: string;
  };
};

const EmployeeMenu = async ({ user, role, business }: EmployeeMenuProps) => {
  const handleLogOut = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size='lg'
              tooltip={user.fullName || 'Employee'}
              className='justify-between group-data-[collapsible=icon]:justify-center cursor-pointer h-10!'
            >
              <div className='flex items-center justify-center gap-2.5'>
                <Avatar className='size-6'>
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h6 className='flex flex-col font-medium group-data-[collapsible=icon]:hidden'>
                  <span className='text-sm'>{user.fullName}</span>
                  <span className='text-xs text-muted-foreground'>
                    {role.name} at {business.name}
                  </span>
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
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h6 className='flex flex-col font-medium'>
                  <span className='text-sm'>{user.fullName}</span>
                  <span className='text-xs text-muted-foreground'>
                    {role.name} at {business.name}
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
            <Separator />
            {/* Special employee links */}
            <ul className='p-2 text-muted-foreground'>
              <li>
                <Link
                  href='/support'
                  target='_blank'
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                    'size-full justify-between text-[13px] px-2 py-1 rounded-md'
                  )}
                >
                  <span className='flex items-center gap-1.5'>
                    <CircleHelp className='size-4 mr-1' />
                    Need help?
                  </span>
                  <ExternalLink className='size-4' />
                </Link>
              </li>
              <li>
                <form action={handleLogOut}>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='size-full justify-start text-[13px] px-2 py-1 rounded-md hover:text-red-400 dark:hover:text-red-500'
                    type='submit'
                  >
                    <LogOut className='size-4 mr-1' />
                    Log out
                  </Button>
                </form>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default EmployeeMenu;
