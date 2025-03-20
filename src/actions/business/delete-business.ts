'use server';

import { deleteBusinessValidator } from '@/zod-validators/business';
import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';

export const deleteBusiness = protectedAction
  .createServerAction()
  .input(deleteBusinessValidator)
  .handler(async ({ input: { businessId } }) => {
    try {
      await db.business.delete({ where: { id: businessId } });
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }
    }
  });
