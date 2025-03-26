import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { GridPattern } from '../special/grid-pattern';

const Footer = async () => {
  const t = await getTranslations('homepage.footer');

  const keys = [
    'features',
    'whatsNew',
    'pricing',
    'tos',
    'about',
    'privacy',
    'faq',
    'support',
  ] as const;

  return (
    <footer className='w-full md:w-[90%] space-y-5 px-4 md:px-20'>
      {/* Call to action */}
      <div className='py-12 md:py-16'>
        <div className='relative w-full flex flex-col items-center justify-center gap-16 bg-landing-second-bg p-8 py-20 rounded-3xl'>
          <div className='space-y-4 z-50'>
            <h3 className='text-landing-second-text-primary text-4xl md:text-5xl font-bold max-w-xl md:max-w-lg text-center leading-14'>
              {t('callToAction.titleTop.content')}{' '}
              <span className='relative p-1 rounded-lg z-30'>
                {t('callToAction.titleTop.span')}
                <span className='absolute bg-amber-300/90 h-3 w-44 md:w-full right-0 md:left-0 bottom-1 -z-10' />
              </span>
              <br />
              {t('callToAction.titleBottom')}
            </h3>
            <h4 className='text-landing-second-text-secondary text-lg md:text-xl font-medium max-w-lg text-center'>
              {t('callToAction.description')}
            </h4>
          </div>
          <Link
            href='/business-new'
            className={cn(
              buttonVariants({ size: 'xl', variant: 'secondary' }),
              'group z-50'
            )}
          >
            {t('callToAction.buttonAction')}
            <MoveRight className='group-hover:translate-x-1 transition-transform' />
          </Link>
          <GridPattern
            className={cn(
              '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] opacity-50'
            )}
          />
        </div>
      </div>
      {/* Actual footer */}
      <div className='grid gap-y-8 md:gap-y-0 md:grid-cols-2 pb-6'>
        <div className='order-2 md:order-1'>
          <h4 className='text-2xl font-medium'>Shifts</h4>
          <h6 className='text-lg max-w-sm text-landing-main-text-secondary'>
            {t('subTitle')}
          </h6>
          <p className='text-landing-main-text-secondary text-sm mt-3'>
            Copyright {new Date().getFullYear()} © Shifts
          </p>
        </div>
        <div className='order-1 md:order-2'>
          <ul className='grid grid-cols-2 grid-rows-4 gap-y-2'>
            {keys.map(key => (
              <li
                key={key}
                className={cn(
                  buttonVariants({ variant: 'link' }),
                  'justify-start text-base'
                )}
              >
                <Link href={t(`links.${key}.link`)}>
                  {t(`links.${key}.label`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
