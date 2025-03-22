'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { updateEventValidator } from '@/zod-validators/event';
import { createNotification } from '../notification/create-notification';

export const updateEvent = protectedAction
  .createServerAction()
  .input(updateEventValidator)
  .handler(
    async ({
      input: { eventId, businessId, name, description, date, location },
    }) => {
      try {
        await db.event.update({
          where: { id: eventId },
          data: {
            name,
            description,
            date,
            location,
          },
        });

        const employees = await db.employee.findMany({
          where: { businessId },
          select: { id: true },
        });

        const notifications = employees.map(({ id }) =>
          createNotification({
            type: 'EVENT_UPDATE',
            messageKey: 'EVENT_UPDATED',
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
    }
  );
