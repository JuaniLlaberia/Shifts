'use client';

import Link from 'next/link';
import { Building2, User } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import NewBusinessForm from './new-business-form';

const OnboardingForm = ({
  userInvitationsList,
}: {
  userInvitationsList: ReactNode;
}) => {
  const t = useTranslations('authOnboarding');
  const [accountType, setAccountType] = useState<
    'business' | 'employee' | undefined
  >(undefined);

  if (!accountType)
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className='text-2xl md:text-3xl font-semibold leading-tight'>
          <h1 className='text-landing-main-text-primary'>
            <span className='relative z-30'>
              {t('header.title.span')}
              <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-0 -z-10' />
            </span>{' '}
            {t('header.title.content')}
          </h1>
          <h2 className='text-landing-main-text-secondary/75'>
            {t('header.subTitle')}
          </h2>
        </header>
        <div className='py-8 space-y-6 md:px-0'>
          <ul className='space-y-2.5'>
            <li
              onClick={() => setAccountType('business')}
              className='flex gap-5 items-center bg-landing-main-card/50 border-2 border-landing-main-border/50 rounded-2xl p-4 hover:border-landing-main-border/75 hover:bg-landing-main-card transition-colors'
            >
              <div className='bg-amber-300/75 border-2 border-landing-main-border/50 size-12 rounded-md flex items-center justify-center'>
                <Building2 strokeWidth={1.5} />
              </div>

              <div>
                <h2 className='font-medium text-landing-main-text-primary'>
                  {t('cards.business.title')}
                </h2>
                <p className='text-landing-main-text-secondary'>
                  {t('cards.business.description')}
                </p>
              </div>
            </li>
            <li
              onClick={() => setAccountType('employee')}
              className='flex gap-5 items-center bg-landing-main-card/50 border-2 border-landing-main-border/50 rounded-2xl p-4 hover:border-landing-main-border/75 hover:bg-landing-main-card transition-colors'
            >
              <div className='bg-amber-300/75 border-2 border-landing-main-border/50 size-12 rounded-md flex items-center justify-center'>
                <User strokeWidth={1.5} />
              </div>

              <div>
                <h2 className='font-medium text-landing-main-text-primary'>
                  {t('cards.employee.title')}
                </h2>
                <p className='text-landing-main-text-secondary'>
                  {t('cards.employee.description')}
                </p>
              </div>
            </li>
          </ul>
          <p className='text-center text-landing-main-text-secondary mt-8'>
            {t('help.content')}{' '}
            <span>
              <Link href='/support/tutorials' className='underline'>
                {t('help.link')}
              </Link>
            </span>
          </p>
        </div>
      </motion.section>
    );

  return (
    <section>
      {accountType === 'business' ? (
        <NewBusinessForm />
      ) : (
        // <UserInvitationsList />
        userInvitationsList
      )}
    </section>
  );
};

export default OnboardingForm;
