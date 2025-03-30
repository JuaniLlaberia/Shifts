'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { type ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type NavbarUIType = {
  children: ReactNode;
};

const NavbarUI = ({ children }: NavbarUIType) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isShrinked, setShrinked] = useState<boolean>(false);

  const t = useTranslations('homepage.navbar');

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

  const keys = ['home', 'pricing', 'about', 'changelog'] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 10 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      data-state={isMenuOpen ? 'active' : 'inactive'}
      className='fixed top-5 z-[110] w-full flex items-center justify-center md:px-20'
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
          borderRadius: !isMobile ? '100px' : isShrinked ? '25px' : '25px',
          backgroundColor: isShrinked
            ? 'rgba(255,255,255,1)'
            : !isMobile
            ? 'rgba(247,247,247,1)'
            : 'transparent',
        }}
        transition={{
          type: 'tween',
          duration: isMobile ? 0.15 : 0.5,
        }}
        className={cn(
          'flex items-center flex-col md:flex-row gap-5 md:gap-1 justify-between px-4'
        )}
      >
        <motion.div className='flex items-center w-full justify-between md:w-auto md:justify-normal'>
          <Link href='/' className='text-lg font-bold px-3'>
            Shifts
          </Link>

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
              'bg-landing-main-card border border-border rounded-[25px] md:border-0 shadow'
          )}
        >
          <ul className='flex flex-col md:flex-row md:items-center gap-2.5 shrink-0'>
            {keys.map(key => (
              <li key={key}>
                <Link
                  href={t(`links.${key}.link`)}
                  className={cn(
                    buttonVariants({
                      size: isMobile ? 'default' : 'sm',
                      variant: 'ghost',
                    }),
                    isMobile && 'text-base font-medium',
                    !isShrinked && 'hover:bg-landing-main-card'
                  )}
                >
                  {t(`links.${key}.label`)}
                </Link>
              </li>
            ))}
          </ul>
          {children}
        </motion.div>
      </motion.nav>
    </motion.div>
  );
};

export default NavbarUI;
