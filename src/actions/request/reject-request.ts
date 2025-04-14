'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { rejectRequestValidator } from '@/zod-validators/request';
import { createNotification } from '../notification/create-notification';
import { revalidatePath } from 'next/cache';

export const rejectRequest = protectedAction
  .createServerAction()
  .input(rejectRequestValidator)
  .handler(async ({ input: { businessId, requestId, type, extraData } }) => {
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

      revalidatePath(`/business/${businessId}/requests`);
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
