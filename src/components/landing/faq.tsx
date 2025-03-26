import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

const Faq = async () => {
  const t = await getTranslations('homepage.faq');
  const keys = ['one', 'two', 'three', 'four', 'five'] as const;

  return (
    <section className='relative w-full md:w-[90%] grid grid-cols-1 md:grid-cols-7 gap-12 py-8 md:py-16 px-4 md:px-20'>
      <div className='col-span-3'>
        <h3 className='text-5xl font-medium'>{t('title')}</h3>
      </div>
      <div className='col-span-4 space-y-8 z-20'>
        <Accordion type='single' collapsible>
          {keys.map(key => (
            <AccordionItem
              key={key}
              value={`value-${key}`}
              className='text-lg cursor-pointer hover:border-b-0 hover:scale-[101%] data-[state=open]:bg-landing-main-card data-[state=open]:rounded-b-xl data-[state=open]:border data-[state=open]:border-border hover:bg-landing-main-card hover:border hover:border-border rounded-xl rounded-b-none hover:rounded-b-xl transition-all md:duration-150 '
            >
              <AccordionTrigger className='text-xl font-normal px-2.5 cursor-pointer'>
                {t(`questions.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className='text-lg p-4'>
                {t(`questions.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Link
          href='/faq'
          className={cn(
            buttonVariants({ size: 'lg' }),
            'w-full md:w-auto text-base md:text-sm'
          )}
        >
          {t('link')}
        </Link>
      </div>

      <div className='absolute top-0 z-10 h-full w-[85%]'>
        <div className='absolute bottom-auto right-auto -left-5 top-0 h-[250px] w-[250px] md:h-[350px] md:w-[350px] translate-x-[30%] translate-y-[25%] rounded-full bg-[rgba(243,202,115,0.65)] opacity-50 blur-[80px]'></div>
      </div>
    </section>
  );
};

export default Faq;
