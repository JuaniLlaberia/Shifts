import Link from 'next/link';
import { CircleHelp, LucideIcon, Phone, Tv } from 'lucide-react';

import BusinessSearchDialog from './business-search-dialog';
import FeedbackDialog from '@/components/landing/feedback-dialog';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { isAdmin as getAdmin } from '@/access-data/auth-helper/isAdmin';

const SUPPORT_LINKS: {
  label: string;
  icon: LucideIcon;
  link: string;
}[] = [
  {
    label: 'Contact us',
    icon: Phone,
    link: '/support',
  },
  {
    label: 'FaQ',
    icon: CircleHelp,
    link: '/faq',
  },
  {
    label: 'Tutorials',
    icon: Tv,
    link: '/support/tutorials',
  },
];

const BusinessNavbar = async ({ businessId }: { businessId: string }) => {
  const { isAdmin } = await getAdmin({ businessId });

  return (
    <nav className='sticky top-0 z-30 h-[3.55rem] w-full flex justify-between items-center bg-background border-b border-sidebar-border p-2'>
      <SidebarTrigger className='rounded-lg size-9' />
      <BusinessSearchDialog isAdmin={isAdmin} />
      <div className='space-x-2'>
        <FeedbackDialog />
        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button size='icon' variant='ghost' className='rounded-lg'>
                  <CircleHelp className='size-4' />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>Need some help?</TooltipContent>
          </Tooltip>
          <PopoverContent side='bottom' align='end'>
            <h2 className='text-xs font-medium px-1 mb-1'>Need some help?</h2>
            <div className='grid grid-cols-3 gap-2 w-auto'>
              {SUPPORT_LINKS.map(({ label, icon: Icon, link }) => (
                <Link
                  key={link}
                  href={link}
                  className='flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent shrink-0 text-nowrap'
                >
                  <div className='flex items-center justify-center bg-background border-2 border-border text-amber-300 rounded-lg size-14 p-4'>
                    <Icon />
                  </div>
                  <h6 className='text-xs font-medium text-muted-foreground'>
                    {label}
                  </h6>
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default BusinessNavbar;
