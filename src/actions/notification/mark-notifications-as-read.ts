'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { markNotificationsAsReadValidator } from '@/zod-validators/notification';
import { memberAction } from '@/lib/member-actions';

export const markNotificationsAsRead = memberAction
  .createServerAction()
  .input(markNotificationsAsReadValidator)
  .handler(
    async ({ input: { notificaitons, businessId }, ctx: { employeeId } }) => {
      try {
        await db.notification.updateMany({
          where: { id: { in: notificaitons }, recipientId: employeeId },
          data: {
            status: 'READ',
          },
        });

        revalidatePath(`/business/${businessId}/notifications`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
