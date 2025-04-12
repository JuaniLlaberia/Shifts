'server only';

import { NotificationStatus, NotificationType, Prisma } from '@prisma/client';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type getNotificationsType = {
  businessId: string;
  type?: NotificationType;
  status?: NotificationStatus;
  pageSize: number;
  page: number;
} & { userId: string; employeeId: string; isAdmin: boolean };

const getNotificationsBase = async ({
  employeeId,
  type,
  status,
  isAdmin,
  page,
  pageSize,
}: getNotificationsType) => {
  try {
    const conditions: Prisma.NotificationWhereInput[] = [];

    if (type) conditions.push({ type });
    if (status) conditions.push({ status });

    const notifications = await db.notification.findMany({
      where:
        conditions.length > 0
          ? { AND: conditions, recipientId: employeeId }
          : { recipientId: employeeId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { notifications, isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getNotifications = withEmployee(getNotificationsBase);
