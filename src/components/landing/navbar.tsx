import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import NavbarUI from './navbar-ui';
import BusinessButton from '@/app/(landing-routes)/(components)/business-button';
import { auth } from '@/auth';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

const Navbar = async () => {
  const session = await auth();
  const t = await getTranslations('homepage.navbar');

  return (
    <NavbarUI>
      {session ? (
        <BusinessButton />
      ) : (
        <Link href='/sign-in' className={cn(buttonVariants({ size: 'sm' }))}>
          {t(`unAuthButton`)}
        </Link>
      )}
    </NavbarUI>
  );
};

export default Navbar;
