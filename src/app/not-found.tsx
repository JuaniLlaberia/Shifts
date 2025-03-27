import Link from 'next/link';
import { FileSearch, MoveLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GridPattern } from '@/components/special/grid-pattern-static';

const NotFoundPage = async () => {
  const t = await getTranslations('notFound');
  return (
    <section>
      <div className='relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-background text-primary'>
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            '[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
          )}
        />
        <div className='grid md:grid-cols-2 gap:6 w-full'>
          <div className='flex flex-col items-center justify-center'>
            <div className='space-y-2.5'>
              <p className='font-mono font-medium'>404 page</p>
              <div className='space-y-2'>
                <h1 className='text-5xl font-medium'>
                  Oops!
                  <span className='relative p-1 z-30'>
                    {t('title')}
                    <span className='absolute bg-amber-300/75 dark:bg-amber-300/90 h-3 w-full left-0 bottom-2 -z-10' />
                  </span>
                </h1>
                <p className='text-lg text-muted-foreground max-w-md'>
                  {t('description')}
                </p>
              </div>
              <Link
                href='/'
                className={cn(buttonVariants({ size: 'sm' }), 'group')}
              >
                <MoveLeft className='mr-1 group-hover:-translate-x-1 transition-transform' />
                {t('link')}
              </Link>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='flex items-center justify-center size-44 rounded-full bg-muted'>
              <FileSearch
                className='size-16 text-muted-foreground/50'
                strokeWidth={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
