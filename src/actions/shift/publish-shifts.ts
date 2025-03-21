'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { publishShiftsValidator } from '@/zod-validators/shift';

export const publishShifts = protectedAction
  .createServerAction()
  .input(publishShiftsValidator)
  .handler(async ({ input: { shiftsIds, businessId } }) => {
    try {
      await db.shift.updateMany({
        where: { id: { in: shiftsIds }, businessId },
        data: { status: 'PUBLISHED' },
      });
    } catch (error) {
      if (error instanceof Error) throw error.message;
    }
  });
