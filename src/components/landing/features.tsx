'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CalendarDays, Clock1, MapPin, PartyPopper, Users } from 'lucide-react';
import { use } from 'react';

import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { CursorContext } from '@/app/context/cursor-context';

const ICONS = {
  scheduling: <CalendarDays className='size-16' strokeWidth={1} />,
  roles: <Users className='size-16' strokeWidth={1} />,
  clock: <Clock1 className='size-16' strokeWidth={1} />,
  location: <MapPin className='size-16' strokeWidth={1} />,
  events: <PartyPopper className='size-16' strokeWidth={1} />,
};

const Features = () => {
  const t = useTranslations('homepage.features');
  const keys = ['scheduling', 'roles', 'clock', 'location', 'events'] as const;

  const { setCursorVariant } = use(CursorContext);

  return (
    <section
      className='w-full md:w-[90%] min-h-screen py-32 px-2 md:px-20'
      id='features'
      onMouseEnter={() =>
        setCursorVariant({ variant: 'hover', content: 'Scroll' })
      }
      onMouseLeave={() => setCursorVariant({ variant: 'default' })}
    >
      <div className='px-4 md:px-0 grid md:grid-cols-2 gap-16'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
          className='md:sticky md:top-24 self-start space-y-8 z-10'
        >
          <h2 className='text-5xl md:text-7xl'>{t('title')}</h2>
          <p className='text-2xl text-landing-main-text-secondary'>
            {t('description')}
          </p>
          <Link
            href='/business-new'
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full text-base md:text-sm md:w-auto'
            )}
            onMouseEnter={() => setCursorVariant({ variant: 'default' })}
            onMouseLeave={() =>
              setCursorVariant({ variant: 'hover', content: 'Scroll' })
            }
          >
            {t('buttonAction')}
          </Link>
        </motion.div>
        <ul className='space-y-4'>
          {keys.map(key => (
            <motion.li
              key={key}
              initial={{ scale: 0.95, opacity: 0.5 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ amount: 0.99 }}
              className='w-full flex flex-col p-4 border-2 border-border rounded-2xl h-96 bg-landing-main-card text-landing-main-text-primary'
            >
              <div className='flex-1 p-4'>{ICONS[key]}</div>
              <div className='space-y-1.5'>
                <h3 className='text-3xl'>{t(`features.${key}.title`)}</h3>
                <p className='text-lg text-landing-main-text-secondary'>
                  {t(`features.${key}.description`)}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
