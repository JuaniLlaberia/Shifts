'server only';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getLocationsType = {
  businessId: string;
  pageSize: number;
  page: number;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getLocationsBase = async ({
  businessId,
  isAdmin,
  page,
  pageSize,
}: getLocationsType) => {
  try {
    const locations = await db.location.findMany({
      where: { businessId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { locations, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getLocations = withEmployee(getLocationsBase);
