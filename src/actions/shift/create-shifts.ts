'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createMultipleShiftsValidator } from '@/zod-validators/shift';

export const createShifts = protectedAction
  .createServerAction()
  .input(createMultipleShiftsValidator)
  .handler(async ({ input: { shifts } }) => {
    try {
      if (shifts.length > 1) {
        await db.shift.createMany({
          data: {
            ...shifts,
          },
        });
      } else {
        await db.shift.create({
          data: { ...shifts[0] },
        });
      }
    } catch (error) {
      if (error instanceof Error) throw error.message;
    }
  });
