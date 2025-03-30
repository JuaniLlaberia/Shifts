'server only';

import { db } from '@/db';
import { withAuth } from '../auth-helper/auth-wrapper';

type getEmployeeType = {} & { userId: string };

const getEmployeeBase = async ({ userId }: getEmployeeType) => {
  try {
    const employee = await db.employee.findFirst({
      where: { userId },
      select: {
        id: true,
        businessId: true,
        role: {
          select: { permissions: true },
        },
        user: { select: { completedOnboarding: true } },
      },
    });

    return employee;
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getEmployee = withAuth(getEmployeeBase);
