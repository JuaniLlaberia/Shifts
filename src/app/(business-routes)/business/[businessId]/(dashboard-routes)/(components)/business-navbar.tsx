import { CircleHelp, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const BusinessNavbar = () => {
  return (
    <nav className='h-[3.55rem] w-full flex justify-between items-center bg-background border-b border-sidebar-border p-2'>
      <SidebarTrigger className='rounded-lg size-9' />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button className='inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-primary px-3 py-2 relative h-8 justify-start rounded-lg bg-muted/40 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 w-48 lg:w-72 xl:w-84'>
            <Search className='size-3.5' />
            <span className='hidden lg:inline-flex'>Search here...</span>
            <span className='inline-flex lg:hidden'>Search...</span>
            <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded-lg border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
              <span className='text-[0.6rem]'>⌘</span>Enter
            </kbd>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Search about your business</TooltipContent>
      </Tooltip>

      <div className='space-x-2'>
        <Button variant='outline' size='sm'>
          Feedback
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size='icon' variant='ghost' className='rounded-lg'>
              <CircleHelp className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Need some help?</TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
};

export default BusinessNavbar;
