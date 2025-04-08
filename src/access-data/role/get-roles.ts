'server only';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getRolesType = {
  businessId: string;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getRolesBase = async ({
  businessId,

  isAdmin,
}: getRolesType) => {
  try {
    const roles = await db.role.findMany({
      where: { businessId },
      select: { id: true, name: true },
    });

    return { roles, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getRoles = withEmployee(getRolesBase);
