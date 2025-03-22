'server only';

import { Prisma, RequestStatus, RequestType } from '@prisma/client';

import { db } from '@/db';
import { withAdmin } from '../auth-helper/admin-wrapper';

type getRequestsType = {
  businessId: string;
  type?: RequestType;
  status?: RequestStatus;
  email?: string;
  pageSize: number;
  page: number;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getRequestsBase = async ({
  businessId,
  type,
  status,
  email,
  isAdmin,
  page,
  pageSize,
}: getRequestsType) => {
  try {
    const conditions: Prisma.RequestWhereInput[] = [];

    if (type) conditions.push({ type });
    if (status) conditions.push({ status });
    if (email) conditions.push({ employee: { user: { email } } });

    const requests = await db.request.findMany({
      where:
        conditions.length > 0
          ? { AND: conditions, businessId }
          : { businessId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { requests, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getRequests = withAdmin(getRequestsBase);
