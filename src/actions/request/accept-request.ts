'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { acceptRequestValidator } from '@/zod-validators/request';
import { createNotification } from '../notification/create-notification';

export const acceptRequest = protectedAction
  .createServerAction()
  .input(acceptRequestValidator)
  .handler(async ({ input: { requestId, type, comments, extraData } }) => {
    try {
      switch (type) {
        case 'SWAP': {
          // Swap shift #1 with shift #2 => Change the start/end time
          const [shift1, shift2] = await db.shift.findMany({
            where: {
              id: {
                in: [extraData.originalShiftId, extraData.requestedShiftId],
              },
            },
            select: { id: true, startTime: true, endTime: true },
          });

          if (!shift1 || !shift2)
            throw new Error('One of the shifts was not found');

          await db.$transaction(async tx => {
            await tx.shift.update({
              where: { id: shift1.id },
              data: { startTime: shift2.startTime, endTime: shift2.endTime },
            });
            await tx.shift.update({
              where: { id: shift2.id },
              data: { startTime: shift1.startTime, endTime: shift1.endTime },
            });
          });

          await Promise.all([
            // Notify user that request was accepted
            createNotification({
              type: 'REQUEST_STATUS',
              messageKey: 'REQUEST_SHIFT_SWAP_APPROVED',
              messageData: { shiftDate: shift1.startTime },
              recipientId: extraData.createdBy,
            }),
            // Delete request
            db.request.delete({ where: { id: requestId } }),
          ]);

          break;
        }
        case 'VACATION':
        case 'UNAVAILABLE': {
          await db.$transaction(async tx => {
            // Approving request
            await tx.request.update({
              where: { id: requestId },
              data: {
                status: 'APPROVED',
                comments,
              },
            });

            await tx.shift.deleteMany({
              where: {
                assignedTo: extraData.createdBy,
                // Find shifts that overlap with the given date range
                // A shift overlaps if:
                // - shift starts within the period, OR
                // - shift ends within the period, OR
                // - shift starts before and ends after the period (completely contains it)
                OR: [
                  {
                    startTime: {
                      gte: extraData.startDate,
                      lte: extraData.endDate,
                    },
                  },
                  {
                    endTime: {
                      gte: extraData.startDate,
                      lte: extraData.endDate,
                    },
                  },
                  {
                    AND: [
                      { startTime: { lte: extraData.startDate } },
                      { endTime: { gte: extraData.endDate } },
                    ],
                  },
                ],
              },
            });
          });

          if (type === 'VACATION') {
            await createNotification({
              type: 'REQUEST_STATUS',
              messageKey: 'REQUEST_VACATION_APPROVED',
              messageData: { ...extraData },
              recipientId: extraData.createdBy,
            });
          } else {
            await createNotification({
              type: 'REQUEST_STATUS',
              messageKey: 'REQUEST_UNAVAILABLE_APPROVED',
              messageData: { ...extraData },
              recipientId: extraData.createdBy,
            });
          }

          break;
        }
      }
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
