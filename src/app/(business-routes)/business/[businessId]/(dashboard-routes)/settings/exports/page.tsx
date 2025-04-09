import { Users } from 'lucide-react';

import ExportEmployeesButton from './(components)/export-employees-button';

const ExportsPage = async ({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) => {
  const { businessId } = await params;

  return (
    <section className='relative space-y-4'>
      <header className='p-8 pb-2'>
        <p className='text-xs flex items-center text-muted-foreground'>
          <Users className='size-3.5 mr-1' /> Settings / Export data
        </p>
        <h2 className='font-medium text-lg'>Export business data</h2>
      </header>

      <div className='p-8 pt-2'>
        <ExportEmployeesButton businessId={businessId} />
      </div>
    </section>
  );
};

export default ExportsPage;
