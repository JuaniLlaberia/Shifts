import { getTranslations } from 'next-intl/server';

const TermsOfServicePage = async () => {
  const t = await getTranslations('terms');

  return (
    <section className='w-full md:w-[90%]'>
      <div className='flex flex-col max-w-5xl gap-4 my-10 px-4 md:px-20'>
        <h2 className='text-3xl md:text-5xl'>
          <span className='relative p-1 rounded-lg z-30'>
            {t('title')}
            <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-2 -z-10' />
          </span>
        </h2>
        <p>{t('intro')}</p>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className='space-y-1 py-1'>
            <p>
              <strong>
                {i + 1}. {t(`sections.${i + 1}.title`)}
              </strong>
            </p>
            <p>{t(`sections.${i + 1}.content`)}</p>
          </div>
        ))}
        <p className='mt-4 text-center text-sm text-muted-foreground'>
          {t('lastUpdated')}
        </p>
      </div>
    </section>
  );
};

export default TermsOfServicePage;
