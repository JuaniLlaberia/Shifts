'use client';

import { useTranslations } from 'next-intl';

const UserInvitationsList = () => {
  const t = useTranslations('authOnboarding.userInvitations');

  return (
    <div className='py-8 space-y-8 md:px-0'>
      <header className='text-2xl md:text-3xl font-semibold leading-tight'>
        <h1 className='text-landing-main-text-primary'>
          {t('title.content')}{' '}
          <span className='relative z-30'>
            {t('title.span')}
            <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-0 -z-10' />
          </span>
        </h1>
        <h2 className='text-landing-main-text-secondary/75'>{t('subTitle')}</h2>
      </header>
      <ul className='bg-landing-main-card border-2 border-landing-main-border/50 rounded-xl p-6'>
        <div className='text-center'>
          <p>{t('empty')}</p>
        </div>
      </ul>
      <p className='text-sm text-landing-main-text-secondary text-center font-medium'>
        {t('disclaimer')}
      </p>
    </div>
  );
};

export default UserInvitationsList;
