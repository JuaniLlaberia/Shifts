'server only';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getBusinessSidebarDataType = {} & {
  userId: string;
  employeeId: string;
  isAdmin: boolean;
};

const getBusinessSidebarDataBase = async ({
  employeeId,
  isAdmin,
}: getBusinessSidebarDataType) => {
  try {
    const sidebarData = await db.employee.findFirst({
      where: { id: employeeId },
      select: {
        id: true,
        role: {
          select: { name: true },
        },
        user: {
          select: { fullName: true, email: true, image: true },
        },
        business: { select: { id: true, name: true, image: true } },
      },
    });

    return { sidebarData, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getBusinessSidebarData = withEmployee(getBusinessSidebarDataBase);
