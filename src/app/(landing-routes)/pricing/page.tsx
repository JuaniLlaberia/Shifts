import Link from 'next/link';
import { Check, MoveDown } from 'lucide-react';

import PricingComparator from './(components)/pricing-comparator';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const PricingPage = () => {
  return (
    <div className='w-full md:w-[90%] px-4 md:px-20'>
      <header className='space-y-2.5'>
        <h1 className='text-6xl text-landing-main-text-primary'>
          <span className='relative p-1 rounded-lg z-30'>
            Plans & pricing
            <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-3 -z-10' />
          </span>
        </h1>
        <p className='text-xl text-landing-main-text-secondary'>
          Choose the plan that works best for your business.
        </p>
      </header>
      {/* Price cards */}
      <section className='flex items-center mt-8 py-10 md:py-16 w-full'>
        <ul className='w-full items-center gap-2.5 grid md:grid-cols-3 *:bg-landing-main-card'>
          <li className='border-2 border-landing-main-border/50 rounded-2xl p-6'>
            <h2 className='text-3xl font-medium text-landing-main-text-primary'>
              Starter
            </h2>
            <p className='text-landing-main-text-secondary'>Some description</p>

            <Link
              href='#'
              className={cn(buttonVariants({ size: 'lg' }), 'w-full mt-6')}
            >
              Start for Free
            </Link>
            <h3 className='text-4xl font-medium font-mono py-12'>
              $0
              <span className='text-base font-normal text-landing-main-text-secondary'>
                /month
              </span>
            </h3>
            <Separator className='my-2' />
            <div className='space-y-2.5'>
              <h4 className='text-sm text-landing-main-text-secondary font-medium'>
                Includes:
              </h4>
              <ul>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 1
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 2
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 3
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 4
                </li>
              </ul>
            </div>
          </li>
          <li className='border-2 border-landing-main-border rounded-2xl p-6 py-10'>
            <h2 className='text-3xl font-medium text-landing-main-text-primary'>
              Professional{' '}
              <span className='text-sm text-amber-500 bg-amber-100/60 p-1 px-2.5 rounded-lg'>
                Most Popular
              </span>
            </h2>
            <p className='text-landing-main-text-secondary'>Some description</p>

            <Link
              href='#'
              className={cn(buttonVariants({ size: 'lg' }), 'w-full mt-6')}
            >
              Upgrade Now
            </Link>
            <h3 className='text-4xl font-medium font-mono py-12'>
              $0
              <span className='text-base font-normal text-landing-main-text-secondary'>
                /month
              </span>
            </h3>
            <Separator className='my-2' />
            <div className='space-y-2.5'>
              <h4 className='text-sm text-landing-main-text-secondary font-medium'>
                Everything in Starter Plan, plus:
              </h4>
              <ul>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 1
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 2
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 3
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 4
                </li>
              </ul>
            </div>
          </li>
          <li className='border-2 border-landing-main-border/50 rounded-2xl p-6'>
            <h2 className='text-3xl font-medium text-landing-main-text-primary'>
              Business
            </h2>
            <p className='text-landing-main-text-secondary'>Some description</p>

            <Link
              href='#'
              className={cn(buttonVariants({ size: 'lg' }), 'w-full mt-6')}
            >
              Upgrade Now
            </Link>
            <h3 className='text-4xl font-medium font-mono py-12'>
              $0
              <span className='text-base font-normal text-landing-main-text-secondary'>
                /month
              </span>
            </h3>
            <Separator className='my-2' />
            <div className='space-y-2.5'>
              <h4 className='text-sm text-landing-main-text-secondary font-medium'>
                Everything in Pro Plan, plus:
              </h4>
              <ul>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 1
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 2
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 3
                </li>
                <li className='flex items-center gap-1.5'>
                  <Check className='size-5 stroke-green-500' strokeWidth={3} />{' '}
                  Feature 4
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </section>
      <div className='flex items-center justify-center'>
        <Link
          href='#plans'
          className={cn(
            buttonVariants({ size: 'lg' }),
            'group hover:scale-105'
          )}
        >
          Compare our plans
          <MoveDown className='group-hover:translate-y-1 transition-transform' />
        </Link>
      </div>
      {/* Price comparator */}
      <PricingComparator />
    </div>
  );
};

export default PricingPage;
