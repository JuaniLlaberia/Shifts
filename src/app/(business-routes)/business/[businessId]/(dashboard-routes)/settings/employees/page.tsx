import { notFound } from 'next/navigation';
import { Users } from 'lucide-react';

import { getEmployees } from '@/access-data/employee/get-employees';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './(components)/employees-columns';
import { EMPLOYEE_FILTERS } from '@/lib/filters';
import { getDepartments } from '@/access-data/department/get-departments';

const EmployeesPage = async ({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) => {
  const { businessId } = await params;
  const employees = await getEmployees({ businessId, pageSize: 10, page: 1 });

  if (!employees.employees || !employees.isAdmin) return notFound();

  const departments = await getDepartments({ businessId });

  const DYNAMIC_DEPARTMENTS_FILTER = {
    label: 'Department',
    field: 'department',
    options: departments.departments.map(department => department.name),
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
