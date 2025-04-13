import { Permissions } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';

import { getDepartments } from '@/access-data/department/get-departments';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { getRoles } from '@/access-data/role/get-roles';
import { columns } from './(components)/roles-columns';
import RoleForm from './(components)/role-form';

const ROLES_FILTERS = {
  permissions: {
    label: 'Permissions type',
    field: 'permissions',
    options: [
      { label: 'Is Admin', value: 'ADMIN' },
      { label: 'Is Member', value: 'MEMBER' },
    ],
  },
};

const RolesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ departmentId: string; permissions: Permissions }>;
}) => {
  const { businessId } = await params;
  const { departmentId, permissions } = await searchParams;

  const { roles, isAdmin } = await getRoles({
    businessId,
    departmentId,
    permissions,
  });
  if (!isAdmin) return notFound();

  const departments = await getDepartments({ businessId });

  const DYNAMIC_DEPARTMENTS_FILTER = {
    label: 'Department',
    field: 'departmentId',
    options: departments.departments.map(department => ({
      label: department.name,
      value: department.id,
    })),
  };

  return (
    <section className='p-8 space-y-4'>
      <header className='flex items-center justify-between'>
        <h1 className='text-lg font-medium'>All Roles</h1>
        <div className='space-x-2'>
          <RoleForm businessId={businessId}>
            <Button size='sm'>
              <Plus className='size-4 mr-1' />
              Add role
            </Button>
          </RoleForm>
        </div>
      </header>

      <DataTable
        data={roles}
        columns={columns}
        searchField='name'
        filters={[ROLES_FILTERS.permissions, DYNAMIC_DEPARTMENTS_FILTER]}
      />
    </section>
  );
};

export default RolesPage;
