'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Construction,
  ChefHat,
  Popcorn,
  HeartIcon as ScanHeart,
  BadgeDollarSign,
  University,
  Dumbbell,
  Hospital,
  CodeXml,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ICONS = {
  construction: (
    <div className='mb-4 rounded-full p-3 bg-blue-950/50'>
      <Construction className='size-6 text-blue-400' strokeWidth={1} />
    </div>
  ),
  technology: (
    <div className='mb-4 rounded-full p-3 bg-green-950/50'>
      <CodeXml className='size-6 text-green-400' strokeWidth={1} />
    </div>
  ),
  gastronomy: (
    <div className='mb-4 rounded-full p-3 bg-pink-950/50'>
      <ChefHat className='size-6 text-pink-400' strokeWidth={1} />
    </div>
  ),
  entertainment: (
    <div className='mb-4 rounded-full p-3 bg-indigo-950/50'>
      <Popcorn className='size-6 text-indigo-400' strokeWidth={1} />
    </div>
  ),
  healthcare: (
    <div className='mb-4 rounded-full p-3 bg-yellow-950/50'>
      <ScanHeart className='size-6 text-yellow-400' strokeWidth={1} />
    </div>
  ),
  retail: (
    <div className='mb-4 rounded-full p-3 bg-cyan-950/50'>
      <BadgeDollarSign className='size-6 text-cyan-400' strokeWidth={1} />
    </div>
  ),
  education: (
    <div className='mb-4 rounded-full p-3 bg-red-950/50'>
      <University className='size-6 text-red-400' strokeWidth={1} />
    </div>
  ),
  sports: (
    <div className='mb-4 rounded-full p-3 bg-orange-950/50'>
      <Dumbbell className='size-6 text-orange-400' strokeWidth={1} />
    </div>
  ),
  hospitality: (
    <div className='mb-4 rounded-full p-3 bg-emerald-950/50'>
      <Hospital className='size-6 text-emerald-400' strokeWidth={1} />
    </div>
  ),
};

const Industries = () => {
  const t = useTranslations('homepage.industries');
  const keys = [
    'construction',
    'technology',
    'gastronomy',
    'entertainment',
    'healthcare',
    'retail',
    'education',
    'sports',
    'hospitality',
  ] as const;

  const batchOne = keys.slice(0, 3);
  const batchTwo = keys.slice(3, 6);
  const batchTree = keys.slice(6, 9);

  return (
    <motion.section
      initial={{
        y: 0,
      }}
      whileInView={{
        y: -100,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      viewport={{
        once: true,
        amount: 0,
      }}
      className='w-full bg-landing-second-bg flex flex-col items-center py-16 md:py-24 pb-28 md:pb-36 px-2 md:px-20 rounded-t-2xl rounded-b-2xl overflow-hidden'
    >
      <div className='relative w-[90%]'>
        <div className='grid lg:grid-cols-2 gap-16'>
          <div className='relative order-2 md:order-1'>
            <div className='grid grid-cols-1 gap-6 md:gap-4 md:grid-cols-3 text-landing-second-text-primary'>
              <ul className='mt-0 space-y-6 md:mt-24'>
                {batchOne.map(key => (
                  <li
                    key={key}
                    className='flex flex-col items-center p-6 py-10 text-center transition-all border border-landing-second-border rounded-2xl bg-landing-second-card hover:shadow-lg hover:-translate-y-1 duration-300'
                  >
                    {ICONS[key]}
                    <span className='font-medium'>{t(`cards.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <ul className='mt-0 space-y-6 md:mt-12'>
                {batchTwo.map(key => (
                  <li
                    key={key}
                    className='flex flex-col items-center p-6 py-10 text-center transition-all border border-landing-second-border rounded-2xl bg-landing-second-card hover:shadow-lg hover:-translate-y-1 duration-300'
                  >
                    {ICONS[key]}
                    <span className='font-medium'>{t(`cards.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <ul className='mt-0 space-y-6 md:mt-24 hidden md:block'>
                {batchTree.map(key => (
                  <li
                    key={key}
                    className='flex flex-col items-center p-6 py-10 text-center transition-all border border-landing-second-border rounded-2xl bg-landing-second-card hover:shadow-lg hover:-translate-y-1 duration-300'
                  >
                    {ICONS[key]}
                    <span className='font-medium'>{t(`cards.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <div className='w-full absolute bottom-0 bg-gradient-to-b from-transparent to-landing-second-bg h-24 md:h-20'></div>
              <div className='w-full absolute top-0 md:top-10 bg-gradient-to-b from-landing-second-bg to-transparent h-24 md:h-20'></div>
            </div>
          </div>

          <div className='flex flex-col justify-center space-y-8 order-1 md:order-2'>
            <div className='space-y-4'>
              <h2 className='text-4xl md:text-5xl text-landing-second-text-primary'>
                {t('title')}
              </h2>
              <p className='max-w-2xl text-landing-second-text-secondary text-xl'>
                {t('description')}
              </p>
            </div>
            <div className='flex'>
              <Link
                href='/business-new'
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                  'duration-300 w-full md:w-auto text-base md:text-sm'
                )}
              >
                {t('buttonAction')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='w-[90%] flex items-center justify-center mt-32 md:mt-48 text-landing-second-text-secondary'>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-3xl md:text-5xl font-bold text-center max-w-4xl leading-10 md:leading-16'
        >
          {t('phrase.contentOne')}{' '}
          <span className='relative p-1 rounded-lg z-30 text-landing-second-text-primary inline-block'>
            {t('phrase.span')}{' '}
            <span className='absolute bg-amber-300/90 h-3 w-full left-0 bottom-1 md:bottom-2 -z-10' />
          </span>
          {t('phrase.contentTwo')}{' '}
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Industries;
