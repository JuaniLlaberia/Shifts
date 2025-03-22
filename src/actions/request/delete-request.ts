'use server';

import { db } from '@/db';
import { memberAction } from '@/lib/member-actions';
import { deleteRequestValidator } from '@/zod-validators/request';

export const deleteRequest = memberAction
  .createServerAction()
  .input(deleteRequestValidator)
  .handler(async ({ input: { requestId }, ctx: { employeeId } }) => {
    try {
      const request = await db.request.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          createdBy: true,
        },
      });
      if (!request) throw new Error('Request not found');

      if (request.createdBy !== employeeId)
        throw new Error('This request does not belong to your');

      await db.request.delete({ where: { id: request.id } });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
