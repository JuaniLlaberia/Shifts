'server only';

import { db } from '@/db';

type checkIsAdminType = {
  businessId: string;
  userId: string;
};

export const checkIsAdmin = async ({
  businessId,
  userId,
}: checkIsAdminType) => {
  const permissions = await db.employee.findUnique({
    where: { businessId_userId: { businessId, userId } },
    select: {
      role: {
        select: {
          permissions: true,
        },
      },
    },
  });

  if (!permissions || !permissions.role.permissions) return false;
  else return true;
};
