'server only';

import { Prisma } from '@prisma/client';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getDepartmentsType = {
  businessId: string;
  active?: string;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getDepartmentsBase = async ({
  businessId,
  active,
  isAdmin,
}: getDepartmentsType) => {
  try {
    const conditions: Prisma.DepartmentWhereInput[] = [{ businessId }];

    if (active) conditions.push({ active: active === 'true' ? true : false });

    const departments = await db.department.findMany({
      where: { AND: conditions },
      include: {
        _count: { select: { roles: true } },
      },
    });

    return { departments, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getDepartments = withEmployee(getDepartmentsBase);
