import Link from 'next/link';
import { Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/components/ui/button';

const FAQPage = async () => {
  const t = await getTranslations('faq');

  return (
    <section className='w-full md:w-[90%] grid gap-y-4 md:grid-cols-3 px-4 md:px-20 space-y-8'>
      <header className='col-span-1'>
        <h1 className='mb-4 text-3xl md:text-5xl md:w-16'>{t('title')}</h1>
      </header>

      <ul className='col-span-2 sm:mx-auto max-w-2xl'>
        {Array.from({ length: 5 }, (_, i) => (
          <li className='pb-6' key={i}>
            <h3 className='text-lg font-medium'>
              {t(`questions.${i + 1}.question`)}
            </h3>
            <p className='text-muted-foreground mt-4'>
              {t(`questions.${i + 1}.answer`)}
            </p>
          </li>
        ))}
      </ul>
      <div className='flex items-center justify-center col-span-full py-4'>
        <Link href='/support' className={buttonVariants({ size: 'xl' })}>
          <Mail />
          {t('link')}
        </Link>
      </div>
    </section>
  );
};

export default FAQPage;
