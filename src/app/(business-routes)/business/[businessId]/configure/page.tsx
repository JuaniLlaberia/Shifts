import ConfigureForm from './(components)/configure-form';
import { getBusinessConfiguration } from '@/access-data/business/get-business-configuration';

const BusinessConfigurePage = async ({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) => {
  const { businessId } = await params;
  const businessConfig = await getBusinessConfiguration({ businessId });

  return (
    <main className='w-full h-screen bg-background flex items-center justify-center px-4 md:px-0'>
      <section className='w-full max-w-lg space-y-8'>
        <header className='space-y-2'>
          <h1 className='text-2xl md:text-3xl font-medium relative z-30'>
            <span className='relative'>
              Welcome to {businessConfig.name}
              <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-0 -z-10' />
            </span>
          </h1>
          <p className='text-muted-foreground'>
            Start your business by doing these 4 easy steps.
          </p>
        </header>

        <ConfigureForm businessData={businessConfig} />
      </section>
    </main>
  );
};

export default BusinessConfigurePage;
