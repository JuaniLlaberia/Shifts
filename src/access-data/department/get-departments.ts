'server only';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getDepartmentsType = {
  businessId: string;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getDepartmentsBase = async ({
  businessId,
  isAdmin,
}: getDepartmentsType) => {
  try {
    const departments = await db.department.findMany({
      where: { businessId },
      include: {
        roles: {
          include: {
            _count: {
              select: { employee: true },
            },
          },
        },
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
