'server only';

import { Permissions, Prisma } from '@prisma/client';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getRolesType = {
  businessId: string;
  departmentId?: string;
  permissions?: Permissions;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getRolesBase = async ({
  businessId,
  departmentId,
  permissions,
  isAdmin,
}: getRolesType) => {
  try {
    const conditions: Prisma.RoleWhereInput[] = [{ businessId }];

    if (departmentId) conditions.push({ departmentId });
    if (permissions) conditions.push({ permissions });

    const roles = await db.role.findMany({
      where: { AND: conditions },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    return { roles, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getRoles = withEmployee(getRolesBase);
