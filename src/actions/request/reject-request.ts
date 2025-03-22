'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { rejectRequestValidator } from '@/zod-validators/request';
import { createNotification } from '../notification/create-notification';

export const rejectRequest = protectedAction
  .createServerAction()
  .input(rejectRequestValidator)
  .handler(async ({ input: { requestId, type, extraData } }) => {
    try {
      // Rejecting request
      await db.request.delete({
        where: { id: requestId },
      });

      // Notify employee that request was rejected
      createNotification({
        type: 'REQUEST_STATUS',
        messageKey:
          type === 'SWAP'
            ? 'REQUEST_SHIFT_SWAP_REJECTED'
            : type === 'VACATION'
            ? 'REQUEST_VACATION_REJECTED'
            : 'REQUEST_UNAVAILABLE_REJECTED',
        messageData: { ...extraData },
        recipientId: extraData.createdBy,
      });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
