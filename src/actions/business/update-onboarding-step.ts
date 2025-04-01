'use server';

import { z } from 'zod';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';

export const updateOnboardingStep = protectedAction
  .createServerAction()
  .input(z.object({ businessId: z.string() }))
  .handler(async ({ input: { businessId } }) => {
    try {
      await db.business.update({
        where: { id: businessId },
        data: { completedOnboardingSteps: { increment: 1 } },
      });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
