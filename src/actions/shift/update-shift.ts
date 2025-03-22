'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { updateShiftValidator } from '@/zod-validators/shift';
import { createNotification } from '../notification/create-notification';

export const updateShift = protectedAction
  .createServerAction()
  .input(updateShiftValidator)
  .handler(
    async ({
      input: { shiftId, name, note, startTime, endTime, status, assignedTo },
    }) => {
      try {
        await Promise.all([
          db.shift.update({
            where: { id: shiftId },
            data: {
              name,
              note,
              startTime,
              endTime,
              status,
              assignedTo,
            },
          }),
          createNotification({
            type: 'SHIFT_UPDATE',
            messageKey: 'SHIFT_MODIFIED_SINGLE',
            recipientId: assignedTo,
            messageData: { date: startTime },
          }),
        ]);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
