'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { memberAction } from '@/lib/member-actions';
import { deleteNotificationValidator } from '@/zod-validators/notification';

export const deleteNotification = memberAction
  .createServerAction()
  .input(deleteNotificationValidator)
  .handler(
    async ({ input: { notificationId, businessId }, ctx: { employeeId } }) => {
      try {
        const notification = await db.notification.findUnique({
          where: { id: notificationId },
          select: {
            id: true,
            recipientId: true,
          },
        });
        if (!notification) throw new Error('Notification not found');

        if (notification.recipientId !== employeeId)
          throw new Error('This notification does not belong to your');

        await db.notification.delete({ where: { id: notification.id } });

        revalidatePath(`/business/${businessId}/notifications`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
