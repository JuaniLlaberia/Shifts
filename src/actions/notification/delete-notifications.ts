'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { memberAction } from '@/lib/member-actions';
import { deleteNotificationValidator } from '@/zod-validators/notification';

export const deleteNotification = memberAction
  .createServerAction()
  .input(deleteNotificationValidator)
  .handler(
    async ({ input: { notifications, businessId }, ctx: { employeeId } }) => {
      try {
        const notificationsDB = await db.notification.findMany({
          where: { id: { in: notifications } },
          select: {
            id: true,
            recipientId: true,
          },
        });
        if (!notifications) throw new Error('Notifications not found');

        if (
          notificationsDB.some(
            notification => notification.recipientId !== employeeId
          )
        )
          throw new Error('This notification does not belong to your');

        await db.notification.deleteMany({
          where: { id: { in: notifications } },
        });

        revalidatePath(`/business/${businessId}/notifications`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
