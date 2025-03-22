'server only';

import { redirect } from 'next/navigation';

import { db } from '@/db';
import { getAuthUser } from '../user/get-auth-user';

export const withEmployee = <T extends { businessId: string }, R>(
  handler: (
    args: T & { userId: string; employeeId: string; isAdmin: boolean }
  ) => Promise<R>
) => {
  return async (args: T): Promise<R> => {
    const user = await getAuthUser();

    const employee = await db.employee.findUnique({
      where: {
        businessId_userId: { businessId: args.businessId, userId: user.id },
      },
      select: { id: true, role: { select: { permissions: true } } },
    });
    if (!employee) return redirect('/');

    return handler({
      ...args,
      userId: user.id,
      employeeId: employee.id,
      isAdmin: employee.role.permissions === 'ADMIN',
    });
  };
};
