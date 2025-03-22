'server only';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getEmployeesType = {
  businessId: string;
  departmentId?: string;
  pageSize: number;
  page: number;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getEmployeesBase = async ({
  businessId,
  departmentId,
  isAdmin,
  page,
  pageSize,
}: getEmployeesType) => {
  try {
    const employees = await db.employee.findMany({
      where: departmentId
        ? { businessId, role: { departmentId } }
        : { businessId },
      select: {
        id: true,
        status: true,
        user: { select: { fullName: true, email: true, image: true } },
        role: { select: { name: true, permissions: true } },
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
