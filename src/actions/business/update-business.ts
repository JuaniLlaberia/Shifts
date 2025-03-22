'use server';

import { db } from '@/db';
import { updateBusinessValidator } from '@/zod-validators/business';
import { protectedAction } from '@/lib/protected-actions';

export const updateBusiness = protectedAction
  .createServerAction()
  .input(updateBusinessValidator)
  .handler(async ({ input: { businessId, name, image, industry } }) => {
    try {
      await db.business.update({
        where: { id: businessId },
        data: {
          name,
          industry,
          image,
        },
      });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
