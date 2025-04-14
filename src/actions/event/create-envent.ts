'use server';

import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createEventValidator } from '@/zod-validators/event';
import { createNotification } from '../notification/create-notification';

export const createEvent = protectedAction
  .createServerAction()
  .input(createEventValidator)
  .handler(
    async ({ input: { businessId, name, description, date, location } }) => {
      try {
        const { id: eventId } = await db.event.create({
          data: {
            name,
            description,
            date,
            location,
            businessId,
          },
        });

        if (eventId) {
          const employees = await db.employee.findMany({
            where: { businessId },
            select: { id: true },
          });

          const notifications = employees.map(({ id }) =>
            createNotification({
              type: 'EVENT_UPDATE',
              messageKey: 'EVENT_CREATED',
              recipientId: id,
              messageData: {
                eventName: name,
                eventDate: `${format(date, 'EEEE, MMMM d, yyyy')} at ${format(
                  date,
                  'hh:mm a'
                )}`,
              },
            })
          );

          await Promise.all(notifications);
        }

        revalidatePath(`/business/${businessId}/events`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
