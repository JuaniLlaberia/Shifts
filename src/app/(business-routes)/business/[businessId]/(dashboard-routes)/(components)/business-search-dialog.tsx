'use client';

import Link from 'next/link';
import { Link as LinkIcon, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const LINKS: {
  label: string;
  link: string;
  requiresAdmin: boolean;
  category: 'general' | 'settings' | 'actions';
}[] = [
  {
    label: 'Inbox',
    link: 'inbox',
    requiresAdmin: false,
    category: 'general',
  },
  {
    label: 'Overview',
    link: 'overview',
    requiresAdmin: false,
    category: 'general',
  },
  {
    label: 'My Shifts',
    link: 'my-shifts',
    requiresAdmin: false,
    category: 'general',
  },
  {
    label: 'Schedule',
    link: 'schedule',
    requiresAdmin: false,
    category: 'general',
  },
  {
    label: 'Review',
    link: 'review-shifts',
    requiresAdmin: true,
    category: 'general',
  },
  {
    label: 'Employees',
    link: 'employees',
    requiresAdmin: false,
    category: 'general',
  },
  {
    label: 'Requests',
    link: 'requests',
    requiresAdmin: true,
    category: 'general',
  },
  {
    label: 'Events',
    link: 'events',
    requiresAdmin: true,
    category: 'general',
  },
  {
    label: 'Analytics',
    link: 'analytics',
    requiresAdmin: true,
    category: 'general',
  },
  {
    label: 'Departments',
    link: 'departments',
    requiresAdmin: true,
    category: 'general',
  },
  {
    label: 'Settings',
    link: 'settings',
    requiresAdmin: true,
    category: 'settings',
  },
  {
    label: 'Business settings',
    link: 'settings/general',
    requiresAdmin: true,
    category: 'settings',
  },
  {
    label: 'Manage employees',
    link: 'settings/employees',
    requiresAdmin: true,
    category: 'settings',
  },
  {
    label: 'Billing',
    link: 'settings/billing',
    requiresAdmin: true,
    category: 'settings',
  },
  {
    label: 'Profile settings',
    link: 'settings/profile',
    requiresAdmin: false,
    category: 'settings',
  },
  {
    label: 'Themes',
    link: 'settings/profile#themes',
    requiresAdmin: false,
    category: 'settings',
  },
  {
    label: 'Language',
    link: 'settings/profile#language',
    requiresAdmin: false,
    category: 'settings',
  },
  {
    label: 'Create new shifts',
    link: 'schedule/new',
    requiresAdmin: true,
    category: 'actions',
  },
  {
    label: 'Create new department',
    link: 'department/new',
    requiresAdmin: true,
    category: 'actions',
  },
  {
    label: 'Create new event',
    link: 'events/new',
    requiresAdmin: true,
    category: 'actions',
  },
];

const BusinessSearchDialog = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { businessId } = useParams<{ businessId: string }>();

  const filteredLinks = useMemo(() => {
    return LINKS.filter(link => {
      if (link.requiresAdmin && !isAdmin) return false;

      const matchesSearch =
        searchTerm === '' ||
        link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm, isAdmin]);

  const results = Object.groupBy(filteredLinks, ({ category }) => category);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <DialogTrigger asChild>
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
        </DialogTrigger>
        <TooltipContent>Search about your business</TooltipContent>
      </Tooltip>
      <DialogContent className='p-0 overflow-hidden gap-0'>
        <DialogTitle />

        <div className='relative w-full'>
          <Input
            placeholder={`Search...`}
            className='w-full h-10 pl-10 pr-20 border-0 ring-0! rounded-none! shadow-none! outline-0!'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='size-4 text-muted-foreground' />
          </div>
        </div>

        <Separator />
        <ScrollArea className='h-64 p-2 py-4'>
          {Object.entries(results).map(([category, links]) => (
            <div className='flex flex-col gap-1 mb-2' key={category}>
              <h3 className='text-xs font-medium capitalize text-muted-foreground px-2.5'>
                {category}
              </h3>
              <ul>
                {links.map(link => (
                  <li key={link.link}>
                    <Link
                      href={`/business/${businessId}/${link.link}`}
                      className='flex items-center gap-2 p-2 rounded-lg hover:bg-accent hover:cursor-pointer transition-colors'
                    >
                      <LinkIcon
                        className='size-4 text-amber-400'
                        strokeWidth={2.5}
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>

        <DialogFooter className='p-2 px-4'>
          <DialogClose asChild>
            <Button variant='outline' size='sm'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessSearchDialog;
