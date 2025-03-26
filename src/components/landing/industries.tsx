import Link from 'next/link';
import {
  Construction,
  ChefHat,
  Popcorn,
  ScanHeart,
  BadgeDollarSign,
  University,
  Dumbbell,
  Hospital,
  CodeXml,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

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

const Industries = async () => {
  const t = await getTranslations('homepage.industries');
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
    <section className='bg-landing-second-bg flex flex-col items-center py-24 pb-36 px-2 md:px-20 rounded-t-2xl rounded-b-2xl'>
      <div className='relative w-[90%]'>
        <div className='grid gap-8 lg:grid-cols-2 md:gap-16'>
          <div className='relative'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 text-landing-second-text-primary'>
              <ul className='mt-0 space-y-6 md:mt-24'>
                {batchOne.map(key => (
                  <li
                    key={key}
                    className='flex flex-col items-center p-6 py-10 text-center transition-all border border-landing-second-border rounded-2xl bg-landing-second-card'
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
                    className='flex flex-col items-center p-6 py-10 text-center transition-all border border-landing-second-border rounded-2xl bg-landing-second-card'
                  >
                    {ICONS[key]}
                    <span className='font-medium'>{t(`cards.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <ul className='mt-0 space-y-6 md:mt-24'>
                {batchTree.map(key => (
                  <li
                    key={key}
                    className='flex flex-col items-center p-6 py-10 text-center transition-all border border-landing-second-border rounded-2xl bg-landing-second-card'
                  >
                    {ICONS[key]}
                    <span className='font-medium'>{t(`cards.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <div className='w-full absolute bottom-0 bg-gradient-to-b from-transparent to-landing-second-bg h-16'></div>
              <div className='w-full absolute top-12 bg-gradient-to-b from-landing-second-bg to-transparent h-16'></div>
            </div>
          </div>

          <div className='flex flex-col justify-center space-y-8'>
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
                href='#'
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' })
                )}
              >
                {t('buttonAction')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='w-[90%] flex items-center justify-center mt-48 text-landing-second-text-secondary'>
        <p className='text-2xl md:text-5xl font-bold text-center max-w-4xl leading-16'>
          {t('phrase.contentOne')}{' '}
          <span className='relative p-1 rounded-lg z-30 text-landing-second-text-primary'>
            {t('phrase.span')}{' '}
            <span className='absolute bg-amber-300/90 h-3 w-full left-0 bottom-2 -z-10' />
          </span>
          {t('phrase.contentTwo')}{' '}
        </p>
      </div>
    </section>
  );
};

export default Industries;
