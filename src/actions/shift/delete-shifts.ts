'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { deleteShiftsValidator } from '@/zod-validators/shift';
import { createNotification } from '../notification/create-notification';

export const deleteShifts = protectedAction
  .createServerAction()
  .input(deleteShiftsValidator)
  .handler(async ({ input: { shiftsIds, employeesIds } }) => {
    try {
      await db.shift.deleteMany({
        where: { id: { in: shiftsIds } },
      });

      if (employeesIds.length > 1) {
        const notifications = employeesIds.map(id =>
          createNotification({
            type: 'SHIFT_UPDATE',
            messageKey: 'SHIFT_DELETED_MULTIPLE',
            recipientId: id,
            messageData: {},
          })
        );

        await Promise.all(notifications);
      } else {
        await createNotification({
          type: 'SHIFT_UPDATE',
          messageKey: 'SHIFT_DELETED_MULTIPLE',
          recipientId: employeesIds[0],
          messageData: {},
        });
      }
    } catch (error) {
      if (error instanceof Error) throw error.message;
    }
  });
