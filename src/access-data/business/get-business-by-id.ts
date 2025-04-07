'server only';

import { notFound } from 'next/navigation';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getBusinessByIdType = {
  businessId: string;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getBusinessByIdBase = async ({
  businessId,
  isAdmin,
}: getBusinessByIdType) => {
  try {
    const business = await db.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        industry: true,
        image: true,
      },
    });
    if (!business) return notFound();

    return { business, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getBusinessById = withEmployee(getBusinessByIdBase);
