import Link from 'next/link';
import { CircleCheck, CircleX } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tableData: {
  feature: string;
  type: 'boolean' | 'text';
  starter: boolean | string;
  pro: boolean | string;
  business: boolean | string;
}[] = [
  {
    feature: 'Clock In and Out',
    type: 'boolean',
    starter: true,
    pro: true,
    business: true,
  },
  {
    feature: 'GPS Clock Geolocation',
    type: 'boolean',
    starter: true,
    pro: true,
    business: true,
  },
  {
    feature: 'Clock In/Out Map',
    type: 'boolean',
    starter: true,
    pro: true,
    business: true,
  },
  {
    feature: 'Shifts approval',
    type: 'boolean',
    starter: true,
    pro: true,
    business: true,
  },
  {
    feature: 'Notifications',
    type: 'boolean',
    starter: true,
    pro: true,
    business: true,
  },
  {
    feature: 'Download information',
    type: 'boolean',
    starter: false,
    pro: true,
    business: true,
  },
  {
    feature: 'Manage events',
    type: 'boolean',
    starter: false,
    pro: true,
    business: true,
  },
  {
    feature: 'Auto Clock Out',
    type: 'boolean',
    starter: false,
    pro: false,
    business: true,
  },
  {
    feature: 'Employees',
    type: 'text',
    starter: 'Up to 5',
    pro: 'Up to 15',
    business: 'Up to 50',
  },
  {
    feature: 'Locations',
    type: 'text',
    starter: 'Single',
    pro: 'Up to 3',
    business: 'Unlimited',
  },
  {
    feature: 'Departments',
    type: 'text',
    starter: 'Up to 5',
    pro: 'Up to 10',
    business: 'Unlimited',
  },
  {
    feature: 'Shifts & Tasks',
    type: 'text',
    starter: 'Unlimited',
    pro: 'Unlimited',
    business: 'Unlimited',
  },
];

const PricingComparator = () => {
  return (
    <section className='py-16 md:py-32' id='plans'>
      <div className='w-full overflow-auto lg:overflow-visible'>
        <table className='w-full border-separate border-spacing-x-3 md:w-full'>
          <thead>
            <tr className='*:py-4 *:text-left *:font-medium'>
              <th className='lg:w-2/5'></th>
              <th className='space-y-3 w-64'>
                <h3 className='text-xl'>
                  Starter{' '}
                  <span className='font-mono text-base text-landing-main-text-secondary'>
                    $0/ month
                  </span>
                </h3>

                <Link
                  href='#'
                  className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                >
                  Start for Free
                </Link>
              </th>

              <th className='space-y-3 w-64'>
                <h3 className='text-xl'>
                  Pro{' '}
                  <span className='font-mono text-base text-landing-main-text-secondary'>
                    $0/ month
                  </span>
                </h3>

                <Link
                  href='#'
                  className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                >
                  Upgrade Now
                </Link>
              </th>

              <th className='space-y-3 w-64'>
                <h3 className='text-xl'>
                  Business{' '}
                  <span className='font-mono text-base text-landing-main-text-secondary'>
                    $0/ month
                  </span>
                </h3>

                <Link
                  href='#'
                  className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                >
                  Upgrade Now
                </Link>
              </th>
            </tr>
          </thead>
          <tbody className='text-caption text-sm'>
            <tr className='*:pb-3'>
              <td className='flex items-center gap-2 font-medium'>
                <span>Features & Limits</span>
              </td>
              <td></td>
              <td className='bg-muted border-none px-4'></td>
              <td></td>
            </tr>
            {tableData.map((row, index) => (
              <tr key={index} className='*:border-b *:py-3'>
                <td className='text-muted-foreground'>{row.feature}</td>
                <td>
                  {row.type === 'boolean' ? (
                    row.starter ? (
                      <CircleCheck className='fill-green-400 stroke-white' />
                    ) : (
                      <CircleX className='fill-red-400 stroke-white' />
                    )
                  ) : (
                    row.starter
                  )}
                </td>
                <td className='bg-muted border-none px-4'>
                  <div className='-mb-3 border-b py-3'>
                    {row.type === 'boolean' ? (
                      row.pro ? (
                        <CircleCheck className='fill-green-400 stroke-white' />
                      ) : (
                        <CircleX className='fill-red-400 stroke-white' />
                      )
                    ) : (
                      row.pro
                    )}
                  </div>
                </td>
                <td>
                  {row.type === 'boolean' ? (
                    row.business ? (
                      <CircleCheck className='fill-green-400 stroke-white' />
                    ) : (
                      <CircleX className='fill-red-400 stroke-white' />
                    )
                  ) : (
                    row.business
                  )}
                </td>
              </tr>
            ))}
            <tr className='*:py-6'>
              <td></td>
              <td></td>
              <td className='bg-muted rounded-b-(--radius) border-none px-4'></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PricingComparator;
