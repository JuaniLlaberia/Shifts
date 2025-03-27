import { getTranslations } from 'next-intl/server';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AboutPage = async () => {
  const t = await getTranslations('about');

  return (
    <div className='w-full md:w-[90%] px-4 md:px-20 space-y-8'>
      <header className='space-y-2.5'>
        <h1 className='px-4 md:px-0 text-3xl md:text-5xl font-bold leading-tight relative z-30'>
          {t('title')}
          <br />
          {t('subTitle.content')}{' '}
          <span className='relative p-1 rounded-lg z-30'>
            {t('subTitle.span')}
            <div className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-3.5 -z-10' />
          </span>
        </h1>
        <h2 className='text-2xl text-landing-main-text-secondary max-w-3xl'>
          {t('description')}
        </h2>
      </header>
      <section className='text-landing-main-text-primary text-lg max-w-4xl space-y-1.5'>
        <p>{t('us')}</p>
        <p>{t('mission')}</p>
        <p>{t('vision')}</p>
      </section>
      <section className='space-y-4'>
        <h3 className='text-2xl font-medium mt-16'>{t('team.title')}</h3>
        <ul className='flex'>
          <li className='flex flex-col items-center gap-4 p-2'>
            <Avatar className='size-32'>
              <AvatarFallback className='text-3xl bg-amber-300'>
                J
              </AvatarFallback>
            </Avatar>
            <div className='text-center'>
              <h4 className='text-lg text-landing-main-text-primary font-medium'>
                Juan I. Llaberia
              </h4>
              <p className='text-landing-main-text-secondary'>Founder</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
