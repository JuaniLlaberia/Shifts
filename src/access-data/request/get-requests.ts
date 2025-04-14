'server only';

import { Prisma, RequestStatus, RequestType } from '@prisma/client';

import { db } from '@/db';
import { withAdmin } from '../auth-helper/admin-wrapper';

type getRequestsType = {
  businessId: string;
  type?: RequestType;
  status?: RequestStatus;
  pageSize: number;
  page: number;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getRequestsBase = async ({
  businessId,
  type,
  status,
  isAdmin,
  page,
  pageSize,
}: getRequestsType) => {
  try {
    const conditions: Prisma.RequestWhereInput[] = [];

    if (type) conditions.push({ type });
    if (status) conditions.push({ status });

    const include: Prisma.RequestInclude = {
      employee: {
        select: { user: { select: { fullName: true, image: true } } },
      },
    };

    if (!type || type === 'SWAP')
      include.swapRequest = {
        include: {
          originalShift: { select: { id: true, startTime: true } },
          requestedShift: { select: { id: true, startTime: true } },
          swapWithUser: true,
        },
      };

    if (!type || type === 'UNAVAILABLE') {
      include.unavailableRequest = true;
    }

    if (!type || type === 'VACATION') {
      include.vacationRequest = true;
    }

    const requests = await db.request.findMany({
      where:
        conditions.length > 0
          ? { AND: conditions, businessId }
          : { businessId },
      include,
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
