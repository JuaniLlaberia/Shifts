'server only';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getEventsType = {
  businessId: string;
  pageSize: number;
  page: number;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getEventsBase = async ({
  businessId,

  isAdmin,
  page,
  pageSize,
}: getEventsType) => {
  try {
    const events = await db.event.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { events, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getEvents = withEmployee(getEventsBase);
