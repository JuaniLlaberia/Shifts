import { Plus } from 'lucide-react';

import DepartmentForm from './(components)/department-form';
import { getDepartments } from '@/access-data/department/get-departments';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './(components)/department-columns';
import { Button } from '@/components/ui/button';

const DEPARTMENTS_FILTERS = [
  {
    label: 'Active',
    field: 'active',
    options: [
      {
        label: 'Active',
        value: 'true',
      },
      {
        label: 'Inactive',
        value: 'false',
      },
    ],
  },
];

const DepartmentsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ active: string }>;
}) => {
  const { businessId } = await params;
  const { active } = await searchParams;

  const { departments } = await getDepartments({ businessId, active });

  return (
    <section className='p-8 space-y-4'>
      <header className='flex items-center justify-between'>
        <h1 className='text-lg font-medium'>All departments</h1>
        <div className='space-x-2'>
          <DepartmentForm businessId={businessId}>
            <Button size='sm'>
              <Plus className='size-4 mr-1' />
              Add department
            </Button>
          </DepartmentForm>
        </div>
      </header>

      <DataTable
        data={departments}
        columns={columns}
        searchField='name'
        filters={[...DEPARTMENTS_FILTERS]}
      />
    </section>
  );
};

export default DepartmentsPage;
