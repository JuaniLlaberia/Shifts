'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CalendarDays, Clock1, MapPin, PartyPopper, Users } from 'lucide-react';

import { buttonVariants } from '../ui/button';

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

  return (
    <section className='w-[90%] min-h-screen py-32 px-2 md:px-20'>
      <div className='grid md:grid-cols-2 gap-16'>
        <div className='md:sticky md:top-24 self-start space-y-8 z-10'>
          <h2 className='text-7xl'>{t('title')}</h2>
          <p className='text-2xl text-landing-main-text-secondary'>
            {t('description')}
          </p>
          <Link href='' className={buttonVariants({ size: 'lg' })}>
            {t('buttonAction')}
          </Link>
        </div>
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
