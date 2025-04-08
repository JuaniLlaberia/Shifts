'server only';

import { EmployeeStatus, Prisma } from '@prisma/client';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getEmployeesType = {
  businessId: string;
  // Filters
  admin?: string;
  status?: EmployeeStatus;
  departmentId?: string;
  // Pagination
  pageSize: number;
  page: number;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getEmployeesBase = async ({
  businessId,
  admin,
  status,
  departmentId,
  isAdmin,
  page,
  pageSize,
}: getEmployeesType) => {
  try {
    const conditions: Prisma.EmployeeWhereInput[] = [{ businessId }];

    if (status) conditions.push({ status });
    if (admin)
      conditions.push({
        role: {
          permissions: { equals: admin === 'true' ? 'ADMIN' : 'MEMBER' },
        },
      });
    if (departmentId) conditions.push({ role: { departmentId } });

    const employees = await db.employee.findMany({
      where: { AND: conditions },
      select: {
        id: true,
        status: true,
        user: { select: { fullName: true, email: true, image: true } },
        role: { select: { name: true, color: true, permissions: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { employees, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getEmployees = withEmployee(getEmployeesBase);
