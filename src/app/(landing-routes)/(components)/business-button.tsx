import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getEmployee } from '@/access-data/employee/get-employee';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BusinessButton = async () => {
  const t = await getTranslations('homepage.navbar');
  const employee = await getEmployee({});

  let link: string;

  if (!employee || !employee.user.completedOnboarding) {
    link = '/sign-in/onboarding';
  } else {
    link =
      employee.role.permissions === 'ADMIN'
        ? `/business/${employee.businessId}/overview`
        : `/business/${employee.businessId}/my-shifts`;
  }

  return (
    <Link href={link} className={cn(buttonVariants({ size: 'sm' }), 'group')}>
      {t(`authButton`)}
      <MoveRight className='group-hover:translate-x-1 transition-transform ml-2' />
    </Link>
  );
};

export default BusinessButton;
