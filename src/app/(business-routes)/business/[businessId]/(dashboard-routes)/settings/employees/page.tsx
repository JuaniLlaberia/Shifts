import { notFound } from 'next/navigation';
import { Users } from 'lucide-react';

import { getEmployees } from '@/access-data/employee/get-employees';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './(components)/employees-columns';
import { getDepartments } from '@/access-data/department/get-departments';
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE } from '@/lib/consts';
import { EmployeeStatus } from '@prisma/client';

const EMPLOYEE_FILTERS = {
  admin: {
    label: 'Is Administrator',
    field: 'admin',
    options: [
      { label: 'True', value: 'true' },
      { label: 'False', value: 'false' },
    ],
  },
  status: {
    label: 'Status',
    field: 'status',
    options: [
      { label: 'Has joinned', value: 'JOINED' },
      { label: 'Is Pending', value: 'PENDING' },
    ],
  },
};

const EmployeesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{
    admin: string;
    status: EmployeeStatus;
    departmentId: string;
    page: number;
  }>;
}) => {
  const { businessId } = await params;
  const { admin, status, departmentId, page } = await searchParams;

  const employees = await getEmployees({
    businessId,
    admin,
    status,
    departmentId,
    pageSize: DEFAULT_PAGE_SIZE,
    page: page || INITIAL_PAGE,
  });

  if (!employees.employees || !employees.isAdmin) return notFound();

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
    <section className='relative space-y-4'>
      <header className='p-8 pb-2'>
        <p className='text-xs flex items-center text-muted-foreground'>
          <Users className='size-3.5 mr-1' /> Settings / Employees
        </p>
        <h2 className='font-medium text-lg'>Manage employees</h2>
      </header>

      <div className='p-8 pt-2'>
        <DataTable
          data={employees.employees}
          columns={columns}
          searchField='user.email'
          filters={[
            EMPLOYEE_FILTERS.admin,
            EMPLOYEE_FILTERS.status,
            DYNAMIC_DEPARTMENTS_FILTER,
          ]}
        />
      </div>
    </section>
  );
};

export default EmployeesPage;
