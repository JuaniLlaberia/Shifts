import { notFound } from 'next/navigation';
import { Settings } from 'lucide-react';

import { getBusinessById } from '@/access-data/business/get-business-by-id';
import GeneralSettingsForm from './(components)/general-settings-form';

const GeneralSettingsPage = async ({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) => {
  const { businessId } = await params;
  const business = await getBusinessById({ businessId });

  if (!business.business || !business.isAdmin) return notFound();

  return (
    <section className='relative space-y-4'>
      <header className='p-8 pb-2'>
        <p className='text-xs flex items-center text-muted-foreground'>
          <Settings className='size-3.5 mr-1' /> Settings / General
        </p>
        <h2 className='font-medium text-lg'>Business Information</h2>
      </header>
      <GeneralSettingsForm businessData={business.business} />
    </section>
  );
};

export default GeneralSettingsPage;
