import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MoveRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { TextShimmer } from '../ui/text-shimmer';

const Hero = async () => {
  const t = await getTranslations('homepage.hero');

  return (
    <section className='w-[90%] overflow-hidden mt-2 px-2 md:px-20'>
      <h1 className='text-6xl md:text-7xl font-bold leading-tight'>
        {t('title')}
        <br />
        {t('subTitle.content')}{' '}
        <span className='relative p-1 rounded-lg z-30'>
          {t('subTitle.span')}
          <div className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-3.5 -z-10' />
        </span>
      </h1>
      <h2 className='text-xl md:text-3xl font-light max-w-5xl mt-8'>
        {t('description')}
      </h2>
      <div className='flex flex-col items-start md:flex-row md:items-start gap-3 mt-12'>
        <div className='flex flex-col items-center gap-2.5'>
          <Link
            href='/startups'
            className={cn(
              buttonVariants({ size: 'xl' }),
              'group w-full md:w-auto z-20'
            )}
          >
            {t('buttonAction')}
            <MoveRight className='group-hover:translate-x-1 transition-transform ml-2' />
          </Link>
          <TextShimmer
            duration={1}
            className='flex items-center gap-2 text-sm font-mono text-landing-main-text-primary/50'
          >
            {t('cardNotRequired')}
          </TextShimmer>
        </div>
        <Link
          href='/about-us'
          className={cn(
            buttonVariants({ size: 'xl', variant: 'ghost' }),
            'text-landing-main-text-secondary w-full md:w-auto z-20'
          )}
        >
          {t('demoAction')}
        </Link>
      </div>

      <div className='absolute top-0 z-10 h-full w-[85%] overflow-hidden'>
        <div className='absolute bottom-auto left-auto -right-5 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(243,202,115,0.5)] opacity-50 blur-[80px]'></div>
      </div>
    </section>
  );
};

export default Hero;
