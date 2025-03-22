'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { deleteEventValidator } from '@/zod-validators/event';
import { createNotification } from '../notification/create-notification';

export const deleteEvent = protectedAction
  .createServerAction()
  .input(deleteEventValidator)
  .handler(async ({ input: { eventId, businessId, date, name } }) => {
    try {
      await db.event.delete({
        where: { id: eventId },
      });

      const employees = await db.employee.findMany({
        where: { businessId },
        select: { id: true },
      });

      const notifications = employees.map(({ id }) =>
        createNotification({
          type: 'EVENT_UPDATE',
          messageKey: 'EVENT_CANCELED',
          recipientId: id,
          messageData: {
            eventName: name,
            eventDate: date,
          },
        })
      );

      await Promise.all(notifications);
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
