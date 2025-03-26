'use client';

import Link from 'next/link';
import { Menu, MoveRight, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { User } from '@prisma/client';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type NavbarUIType = {
  user?: User;
};

const LINKS = [
  {
    label: 'Features',
    link: '#',
  },
  {
    label: 'Pricing',
    link: '/pricing',
  },
  {
    label: 'About',
    link: '/about',
  },
  {
    label: 'Changelog',
    link: '/changelog',
  },
];

const NavbarUI = ({ user }: NavbarUIType) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isShrinked, setShrinked] = useState<boolean>(false);

  const isMobile = useIsMobile();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', latest => {
    const prev = scrollY.getPrevious();
    if (!prev) return;

    const SCROLL_THRESHOLD = 25;

    if (latest > prev && latest > SCROLL_THRESHOLD) {
      setShrinked(true);
    } else if (latest < prev && latest <= SCROLL_THRESHOLD) {
      setShrinked(false);
    }
  });

  return (
    <div
      data-state={isMenuOpen ? 'active' : 'inactive'}
      className='fixed top-5 z-[110] w-full flex items-center justify-center px-2 md:px-20'
    >
      <motion.nav
        initial={{
          width: isMobile ? '100%' : '90%',
          backgroundColor: '#f7f7f7',
          borderRadius: '100px',
        }}
        animate={{
          width: !isMobile && isShrinked ? '65%' : '90%',
          boxShadow: isShrinked ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          border: isShrinked ? '1px solid rgba(0, 0, 0, 0.123)' : 'none',
          padding: isShrinked ? '6px' : '4px',
          borderRadius: '100px',
          backgroundColor: isShrinked
            ? 'rgba(255,255,255,1)'
            : 'rgba(247,247,247,1)',
        }}
        transition={{
          type: 'tween',
          duration: 0.5,
        }}
        className={cn(
          'flex items-center flex-col md:flex-row gap-5 md:gap-1 justify-between px-4'
        )}
      >
        <motion.div className='flex items-center w-full justify-between md:w-auto md:justify-normal'>
          <h1 className='text-lg font-bold px-3'>Shifts</h1>

          <Button
            size='icon'
            variant='ghost'
            onClick={() => setIsMenuOpen(prev => !prev)}
            className='relative md:hidden'
          >
            <Menu className='in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200' />
            <X className='in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200' />
          </Button>
        </motion.div>

        <motion.div
          className={cn(
            'w-full md:w-auto in-data-[state=inactive]:hidden in-data-[state=active]:flex flex-col md:flex md:flex-row md:items-center gap-6 md:gap-8 p-3 md:p-0',
            !isShrinked &&
              isMobile &&
              'border border-border rounded-lg md:border-0 shadow'
          )}
        >
          <ul className='flex flex-col md:flex-row md:items-center gap-2.5 shrink-0'>
            {LINKS.map(({ label, link }) => (
              <li key={link}>
                <Link
                  href={link}
                  className={cn(
                    buttonVariants({
                      size: isMobile ? 'default' : 'sm',
                      variant: 'ghost',
                    }),
                    isMobile && 'text-base font-medium'
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {user?.id ? (
            <Button size='sm' className='group'>
              Go to business
              <MoveRight className='group-hover:translate-x-1 transition-transform ml-2' />
            </Button>
          ) : (
            <div className='flex flex-col md:flex-row gap-2 md:space-x-2'>
              <Link
                href='/login'
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' })
                )}
              >
                Sign in
              </Link>
              <Link
                href='/business-new'
                className={cn(buttonVariants({ size: 'sm' }), 'group')}
              >
                Get started{' '}
                <MoveRight className='group-hover:translate-x-1 transition-transform ml-2' />
              </Link>
            </div>
          )}
        </motion.div>
      </motion.nav>
    </div>
  );
};

export default NavbarUI;
