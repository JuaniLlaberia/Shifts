import Link from 'next/link';
import { redirect } from 'next/navigation';

import GoogleButton from '@/components/auth/google-button';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

const SignInPage = async () => {
  const session = await auth();
  if (session?.user) redirect('/');

  const t = await getTranslations('signIn');

  return (
    <section className='w-full max-w-md px-4 space-y-6 py-16 min-h-[50dvh]'>
      <header className='text-xl md:text-3xl font-semibold leading-tight'>
        <h1 className='text-landing-main-text-primary'>
          <span className='relative z-30'>
            {t('title.content')}
            <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-0 -z-10' />
          </span>{' '}
          {t('title.span')}
        </h1>
        <h2 className='text-landing-main-text-secondary/75'>{t('subTitle')}</h2>
      </header>
      <div>
        <GoogleButton message={t('googleBtn')} />
      </div>
      <footer>
        <p className='text-sm text-landing-main-text-secondary/75'>
          {t('disclaimer.content')}{' '}
          <span>
            <Link href='/tos' className='underline'>
              {t('disclaimer.tos')}
            </Link>
          </span>{' '}
          {t('disclaimer.separator')}{' '}
          <span>
            <Link href='/privacy' className='underline'>
              {t('disclaimer.privacy')}
            </Link>
          </span>
        </p>
      </footer>
    </section>
  );
};

export default SignInPage;
